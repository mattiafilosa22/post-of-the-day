import { TextPage } from "../components/TextPage";

export const metadata = { title: "Bid received · The Post of the Day" };

export default function Thanks() {
  return (
    <TextPage>
      <p className="kicker">Bid received</p>
      <h1>You&apos;re in. Now we wait for midnight.</h1>
      <p>
        The amount is on hold on your card, not charged. Your bid will show up on the front page within a few
        seconds.
      </p>
      <p>
        If someone bids higher, we release the hold right away and you can bid again. Your bank may take a few
        days to show the release. If you are still on top at midnight UTC, the amount is charged and your post
        leads tomorrow&apos;s front page.
      </p>
      <p>One tip: share the page. Whoever outbids you does it in public, and so does whoever backs you.</p>
    </TextPage>
  );
}
