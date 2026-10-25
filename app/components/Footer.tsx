import Link from "next/link";

export function Footer() {
  const owner = process.env.NEXT_PUBLIC_OWNER_NAME;
  return (
    <footer className="footer">
      <span>{owner ? `A project by ${owner}.` : "The Post of the Day."} Not affiliated with X or LinkedIn.</span>
      <nav aria-label="About">
        <Link href="/rules">Rules</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
