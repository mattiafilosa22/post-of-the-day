import { TextPage } from "../components/TextPage";

export const metadata = { title: "Rules · The Post of the Day" };

export default function Rules() {
  return (
    <TextPage>
      <h1>Rules</h1>
      <p className="updated">In short: one spot a day, the highest bid wins, only the winner pays.</p>

      <h2>The auction</h2>
      <ul>
        <li>Every day we auction the front-page spot for the following day.</li>
        <li>Bidding closes at midnight UTC. The highest bid at that moment wins.</li>
        <li>The first bid starts at $5. Every new bid must beat the top one by at least $1. On a tie, the earlier bid stays on top.</li>
        <li>You can bid again as many times as you like.</li>
      </ul>

      <h2>Payment</h2>
      <ul>
        <li>When you bid, the amount is authorized on your card through Stripe, without being charged.</li>
        <li>If you are outbid, the authorization is cancelled immediately. Your bank may take a few days to show it.</li>
        <li>If you win, the amount is charged when bidding closes.</li>
      </ul>

      <h2>What you can feature</h2>
      <p>
        A public post on X or LinkedIn, or any public web page. No illegal, hateful, discriminatory, deceptive or
        infringing content, and nothing promoting gambling, financial schemes or prohibited products.
      </p>
      <p>
        We may remove a bid that breaks these rules. If it was on top, the hold is released; if it was already
        charged, it is refunded.
      </p>

      <h2>What this is not</h2>
      <p>
        It is not a lottery or a game of chance: there is no draw and no cash prize. The winner buys one day of
        visibility. This site is not affiliated with X or LinkedIn.
      </p>
    </TextPage>
  );
}
