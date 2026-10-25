import Link from "next/link";
import { Footer } from "./Footer";
import { Masthead } from "./Masthead";

export function TextPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <Masthead />
      <main className="prose">
        {children}
        <Link className="back" href="/">Torna alla prima pagina</Link>
      </main>
      <Footer />
    </div>
  );
}
