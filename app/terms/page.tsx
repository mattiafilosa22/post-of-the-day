import { TextPage } from "../components/TextPage";

export const metadata = { title: "Terms · The Post of the Day" };

const owner = process.env.NEXT_PUBLIC_OWNER_NAME ?? "[Owner name]";
const email = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "[contact email]";

export default function Terms() {
  return (
    <TextPage>
      <h1>Terms of service</h1>
      <p className="updated">Draft, to be reviewed by a professional before launch.</p>

      <h2>Who runs this</h2>
      <p>This site is run by {owner}, based in Italy. For any request: {email}.</p>

      <h2>The service</h2>
      <p>
        The service is the display, for one calendar day (UTC), of a link chosen by the winning bidder, with the
        name and tagline they provide. How the auction works is described in the Rules, which are part of these
        terms.
      </p>

      <h2>Price and payment</h2>
      <p>
        The price is the amount of the winning bid, including VAT where due. Payments are processed by Stripe.
        Bids that do not win are never charged.
      </p>

      <h2>Cancellation</h2>
      <p>
        You can withdraw a bid that is on top by writing to {email} before bidding closes, and we release the
        hold. After bidding closes the service is performed on the day itself: by bidding you ask for it to start
        within the withdrawal period and accept that, once fully performed, the right of withdrawal no longer
        applies (Article 16(a) of EU Directive 2011/83).
      </p>

      <h2>Your content</h2>
      <p>
        You confirm you have the right to promote the link you submit and you remain responsible for it. We may
        remove content that breaks the Rules, with a refund.
      </p>

      <h2>Availability</h2>
      <p>If an outage keeps the spot from being visible for at least 20 hours of the day you bought, we refund you pro rata.</p>

      <h2>Governing law</h2>
      <p>Italian law applies. If you are a consumer, you keep the protections of the law of your country of residence.</p>
    </TextPage>
  );
}
