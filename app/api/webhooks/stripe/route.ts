import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { handleAuthorized } from "@/lib/bids";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return new NextResponse("Firma mancante", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new NextResponse("Firma non valida", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (piId) {
      const pi = await stripe().paymentIntents.retrieve(piId);
      if (pi.status === "requires_capture") await handleAuthorized(session.id, pi.id);
    }
  }

  return NextResponse.json({ received: true });
}
