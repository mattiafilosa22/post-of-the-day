import { TextPage } from "../components/TextPage";

export const metadata = { title: "Privacy · The Post of the Day" };

const owner = process.env.NEXT_PUBLIC_OWNER_NAME ?? "[Owner name]";
const email = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "[contact email]";

export default function Privacy() {
  return (
    <TextPage>
      <h1>Privacy notice</h1>
      <p className="updated">Draft, to be reviewed by a professional before launch.</p>

      <h2>Controller</h2>
      <p>{owner}, reachable at {email}.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Name or company, tagline and link: you enter them, and they are shown publicly with the amount you bid.</li>
        <li>Email for the launch list, if you sign up on the countdown page: used once to send you the launch link, then deleted.</li>
        <li>Email and payment details: Stripe collects them at checkout. We never see your card number.</li>
        <li>Minimal technical data needed to run the site (server logs). No tracking or profiling cookies.</li>
      </ul>

      <h2>Why, and on what basis</h2>
      <p>To run the auction, take payments and display the winning post (performance of a contract), and to meet tax obligations (legal obligation).</p>

      <h2>How long</h2>
      <p>Bid and payment records are kept for 10 years for tax purposes. Winning entries stay in the public archive while the site is online, unless you ask us to remove them.</p>

      <h2>Who processes it for us</h2>
      <p>Stripe (payments), our hosting provider and our database provider, as processors.</p>

      <h2>Your rights</h2>
      <p>
        Under the GDPR you can ask for access, correction, deletion, restriction or portability of your data, or
        object to its processing, by writing to {email}. You can also complain to a data protection authority,
        such as the Italian Garante.
      </p>
    </TextPage>
  );
}
