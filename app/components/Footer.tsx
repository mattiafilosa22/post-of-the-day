import Link from "next/link";

export function Footer() {
  const owner = process.env.NEXT_PUBLIC_OWNER_NAME;
  return (
    <footer className="footer">
      <span>{owner ? `Un progetto di ${owner}.` : "Il post del giorno."} Non affiliato a LinkedIn.</span>
      <nav aria-label="Informazioni">
        <Link href="/regole">Regole</Link>
        <Link href="/termini">Termini</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
