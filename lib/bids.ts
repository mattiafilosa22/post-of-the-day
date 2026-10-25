import { sql } from "./db";
import { stripe } from "./stripe";
import { decideOnAuthorized } from "./auction";
import { today as currentDay } from "./time";

export type BidStatus = "pending" | "leading" | "outbid" | "won" | "rejected" | "failed";

export type Bid = {
  id: string;
  day: string;
  name: string;
  headline: string | null;
  post_url: string;
  amount_cents: number;
  status: BidStatus;
  stripe_session_id: string | null;
  payment_intent_id: string | null;
  created_at: Date;
  authorized_at: Date | null;
};

const COLUMNS = `id, to_char(day, 'YYYY-MM-DD') as day, name, headline, post_url, amount_cents, status,
  stripe_session_id, payment_intent_id, created_at, authorized_at`;

export async function getLeader(day: string): Promise<Bid | null> {
  const rows = await sql().unsafe<Bid[]>(
    `select ${COLUMNS} from bids where day = $1 and status = 'leading'`,
    [day],
  );
  return rows[0] ?? null;
}

export async function getWinner(day: string): Promise<Bid | null> {
  const rows = await sql().unsafe<Bid[]>(
    `select ${COLUMNS} from bids where day = $1 and status = 'won'`,
    [day],
  );
  return rows[0] ?? null;
}

// Le offerte autorizzate di un giorno, dalla più alta: è lo storico mostrato sotto l'asta.
export async function listAuthorizedBids(day: string, limit = 20): Promise<Bid[]> {
  return sql().unsafe<Bid[]>(
    `select ${COLUMNS} from bids
     where day = $1 and status in ('leading', 'outbid', 'won') and authorized_at is not null
     order by amount_cents desc, authorized_at asc limit $2`,
    [day, limit],
  );
}

export async function listPastWinners(beforeDay: string, limit = 14): Promise<Bid[]> {
  return sql().unsafe<Bid[]>(
    `select ${COLUMNS} from bids where status = 'won' and day < $1 order by day desc limit $2`,
    [beforeDay, limit],
  );
}

export async function createPendingBid(input: {
  day: string;
  name: string;
  headline: string | null;
  postUrl: string;
  amountCents: number;
}): Promise<string> {
  const [row] = await sql()<{ id: string }[]>`
    insert into bids (day, name, headline, post_url, amount_cents)
    values (${input.day}, ${input.name}, ${input.headline}, ${input.postUrl}, ${input.amountCents})
    returning id`;
  return row.id;
}

export async function attachSession(bidId: string, sessionId: string): Promise<void> {
  await sql()`update bids set stripe_session_id = ${sessionId} where id = ${bidId}`;
}

async function releaseHold(paymentIntentId: string | null): Promise<void> {
  if (!paymentIntentId) return;
  try {
    await stripe().paymentIntents.cancel(paymentIntentId);
  } catch (err) {
    console.error(`Rilascio del blocco non riuscito per ${paymentIntentId}`, err);
  }
}

// Chiamata dal webhook quando Stripe ha bloccato l'importo sulla carta.
export async function handleAuthorized(sessionId: string, paymentIntentId: string): Promise<void> {
  const today = currentDay();
  const toRelease = await sql().begin(async (tx) => {
    const [bid] = await tx.unsafe<Bid[]>(
      `select ${COLUMNS} from bids where stripe_session_id = $1 for update`,
      [sessionId],
    );
    if (!bid || bid.status !== "pending") return null;

    await tx`select pg_advisory_xact_lock(hashtext(${bid.day}))`;

    // L'asta di quel giorno si è già chiusa mentre la persona pagava.
    if (bid.day <= today) {
      await tx`update bids set status = 'outbid', payment_intent_id = ${paymentIntentId},
        authorized_at = now() where id = ${bid.id}`;
      return paymentIntentId;
    }

    const [leader] = await tx.unsafe<Bid[]>(
      `select ${COLUMNS} from bids where day = $1 and status = 'leading' for update`,
      [bid.day],
    );

    if (decideOnAuthorized(bid.amount_cents, leader?.amount_cents ?? null) === "lead") {
      if (leader) await tx`update bids set status = 'outbid' where id = ${leader.id}`;
      await tx`update bids set status = 'leading', payment_intent_id = ${paymentIntentId},
        authorized_at = now() where id = ${bid.id}`;
      return leader?.payment_intent_id ?? null;
    }

    await tx`update bids set status = 'outbid', payment_intent_id = ${paymentIntentId},
      authorized_at = now() where id = ${bid.id}`;
    return paymentIntentId;
  });

  await releaseHold(toRelease);
}

// Incassa l'offerta in testa di ogni giorno già iniziato. Si può chiamare più volte.
export async function closeDueAuctions(now: Date = new Date()): Promise<number> {
  const today = currentDay(now);
  const due = await sql()<{ day: string }[]>`
    select distinct to_char(day, 'YYYY-MM-DD') as day from bids
    where status = 'leading' and day <= ${today}`;

  let closed = 0;
  for (const { day } of due) {
    await sql().begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtext(${day}))`;
      const [leader] = await tx.unsafe<Bid[]>(
        `select ${COLUMNS} from bids where day = $1 and status = 'leading' for update`,
        [day],
      );
      if (!leader?.payment_intent_id) return;
      try {
        await stripe().paymentIntents.capture(leader.payment_intent_id, undefined, {
          idempotencyKey: `capture-${leader.id}`,
        });
        await tx`update bids set status = 'won' where id = ${leader.id}`;
        closed++;
      } catch (err) {
        console.error(`Incasso non riuscito per l'offerta ${leader.id}`, err);
        await tx`update bids set status = 'failed' where id = ${leader.id}`;
      }
    });
  }
  return closed;
}

// Moderazione: toglie un'offerta in testa e rilascia il blocco. Un'offerta già incassata
// si rimborsa dalla dashboard di Stripe.
export async function rejectLeadingBid(bidId: string): Promise<boolean> {
  const pi = await sql().begin(async (tx) => {
    const [bid] = await tx<{ payment_intent_id: string | null }[]>`
      update bids set status = 'rejected' where id = ${bidId} and status = 'leading'
      returning payment_intent_id`;
    return bid ? bid.payment_intent_id : undefined;
  });
  if (pi === undefined) return false;
  await releaseHold(pi);
  return true;
}
