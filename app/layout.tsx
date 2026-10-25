import type { Metadata } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-schibsted",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Il post del giorno",
  description: "Ogni giorno un solo post LinkedIn in prima pagina. Lo spazio di domani va all'offerta più alta, e paga solo chi vince.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Il post del giorno",
    description: "Un solo post LinkedIn in prima pagina, ogni giorno. Domani può essere il tuo.",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${newsreader.variable} ${schibsted.variable}`}>
      <body>{children}</body>
    </html>
  );
}
