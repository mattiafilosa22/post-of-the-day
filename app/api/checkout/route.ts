import { NextResponse } from "next/server";
import { MAX_BID_CENTS, formatEuro, minNextBidCents, parseEuroToCents } from "@/lib/auction";
import { attachSession, createPendingBid, getLeader } from "@/lib/bids";
import { parseLinkedInPost } from "@/lib/linkedin";
import { siteUrl, stripe } from "@/lib/stripe";
import { formatDayIt, openAuctionDay } from "@/lib/time";

export const dynamic = "force-dynamic";

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Richiesta non valida.");
  }

  const name = String(body.name ?? "").trim();
  const headline = String(body.headline ?? "").trim() || null;
  const post = parseLinkedInPost(String(body.postUrl ?? ""));
  const amountCents = parseEuroToCents(String(body.amount ?? ""));

  if (name.length < 2 || name.length > 60) return fail("Inserisci un nome tra 2 e 60 caratteri.");
  if (headline && headline.length > 100) return fail("Il sottotitolo può avere al massimo 100 caratteri.");
  if (!post) return fail("Incolla il link di un post LinkedIn pubblico.");
  if (amountCents === null) return fail("Inserisci un importo valido, per esempio 12 o 12,50.");

  const day = openAuctionDay();
  const leader = await getLeader(day);
  const min = minNextBidCents(leader?.amount_cents ?? null);
  if (amountCents < min) return fail(`L'offerta minima ora è ${formatEuro(min)}.`);
  if (amountCents > MAX_BID_CENTS) return fail(`L'offerta massima è ${formatEuro(MAX_BID_CENTS)}.`);

  const bidId = await createPendingBid({ day, name, headline, postUrl: post.url, amountCents });

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name: `Post del giorno, ${formatDayIt(day)}`,
            description: "Addebitato solo se la tua offerta è la più alta alla mezzanotte.",
          },
        },
      },
    ],
    // L'importo viene solo bloccato: lo incassiamo a fine asta, e solo dal vincitore.
    payment_intent_data: { capture_method: "manual", metadata: { bid_id: bidId, day } },
    metadata: { bid_id: bidId, day },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${siteUrl()}/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/`,
  });

  await attachSession(bidId, session.id);
  return NextResponse.json({ url: session.url });
}
