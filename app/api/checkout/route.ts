import { NextResponse } from "next/server";
import { CURRENCY, MAX_BID_CENTS, formatMoney, minNextBidCents, parseAmountToCents } from "@/lib/auction";
import { attachSession, createPendingBid, getLeader } from "@/lib/bids";
import { parsePostLink } from "@/lib/links";
import { siteUrl, stripe } from "@/lib/stripe";
import { formatDay, openAuctionDay } from "@/lib/time";

export const dynamic = "force-dynamic";

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const name = String(body.name ?? "").trim();
  const headline = String(body.headline ?? "").trim() || null;
  const post = parsePostLink(String(body.postUrl ?? ""));
  const amountCents = parseAmountToCents(String(body.amount ?? ""));

  if (name.length < 2 || name.length > 60) return fail("Enter a name between 2 and 60 characters.");
  if (headline && headline.length > 100) return fail("The tagline can be at most 100 characters.");
  if (!post) return fail("Paste a public https link: a post on X or LinkedIn, or any page.");
  if (amountCents === null) return fail("Enter a valid amount, like 12 or 12.50.");

  const day = openAuctionDay();
  const leader = await getLeader(day);
  const min = minNextBidCents(leader?.amount_cents ?? null);
  if (amountCents < min) return fail(`The minimum bid right now is ${formatMoney(min)}.`);
  if (amountCents > MAX_BID_CENTS) return fail(`The maximum bid is ${formatMoney(MAX_BID_CENTS)}.`);

  const bidId = await createPendingBid({ day, name, headline, postUrl: post.url, amountCents });

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: amountCents,
          product_data: {
            name: `Post of the Day, ${formatDay(day)}`,
            description: "Charged only if yours is the highest bid at midnight UTC.",
          },
        },
      },
    ],
    // L'importo viene solo bloccato: lo incassiamo a fine asta, e solo dal vincitore.
    payment_intent_data: { capture_method: "manual", metadata: { bid_id: bidId, day } },
    metadata: { bid_id: bidId, day },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${siteUrl()}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/`,
  });

  await attachSession(bidId, session.id);
  return NextResponse.json({ url: session.url });
}
