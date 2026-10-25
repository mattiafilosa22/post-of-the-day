import { minNextBidCents } from "./auction";
import { closeDueAuctions, getLeader, getWinner, listAuthorizedBids, listPastWinners, type Bid } from "./bids";
import { openAuctionDay, romeDay, romeMidnight } from "./time";

export type FrontPage = {
  today: string;
  auctionDay: string;
  closesAt: string;
  featured: Bid | null;
  leader: Bid | null;
  minNextCents: number;
  bids: Bid[];
  archive: Bid[];
  demo: boolean;
};

export async function loadFrontPage(now: Date = new Date()): Promise<FrontPage> {
  const today = romeDay(now);
  const auctionDay = openAuctionDay(now);
  const closesAt = romeMidnight(auctionDay).toISOString();

  if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
    return demoFrontPage(today, auctionDay, closesAt);
  }

  // Se il cron non è ancora passato, la prima visita dopo mezzanotte chiude l'asta.
  await closeDueAuctions(now).catch((err) => console.error("Chiusura asta non riuscita", err));

  const [featured, leader, bids, archive] = await Promise.all([
    getWinner(today),
    getLeader(auctionDay),
    listAuthorizedBids(auctionDay),
    listPastWinners(today),
  ]);

  return {
    today,
    auctionDay,
    closesAt,
    featured,
    leader,
    minNextCents: minNextBidCents(leader?.amount_cents ?? null),
    bids,
    archive,
    demo: false,
  };
}

// Dati finti per vedere la pagina in locale senza database.
function demoFrontPage(today: string, auctionDay: string, closesAt: string): FrontPage {
  const bid = (i: number, p: Partial<Bid>): Bid => ({
    id: `demo-${i}`,
    day: auctionDay,
    name: "",
    headline: null,
    post_url: "https://www.linkedin.com/posts/demo",
    amount_cents: 0,
    status: "outbid",
    stripe_session_id: null,
    payment_intent_id: null,
    created_at: new Date(),
    authorized_at: new Date(Date.now() - i * 41 * 60000),
    ...p,
  });
  const leader = bid(1, { name: "Giulia Ferri", headline: "Head of Growth, Milano", amount_cents: 4700, status: "leading" });
  return {
    today,
    auctionDay,
    closesAt,
    featured: bid(0, {
      day: today, name: "Studio Arcangeli", headline: "Architettura e interni, Bologna",
      amount_cents: 3900, status: "won", post_url: "https://www.linkedin.com/posts/demo",
    }),
    leader,
    minNextCents: minNextBidCents(leader.amount_cents),
    bids: [
      leader,
      bid(2, { name: "Marco De Santis", headline: "Sviluppatore freelance", amount_cents: 4200 }),
      bid(3, { name: "Officina Nove", amount_cents: 2500 }),
      bid(4, { name: "Sara L.", headline: "Recruiter tech", amount_cents: 1200 }),
    ],
    archive: [
      bid(5, { day: "2026-10-24", name: "Luca Morandi", headline: "Founder, Napoli", amount_cents: 3100, status: "won" }),
      bid(6, { day: "2026-10-23", name: "Elena Conti", amount_cents: 1800, status: "won" }),
      bid(7, { day: "2026-10-22", name: "Pixel & Co.", headline: "Agenzia digitale", amount_cents: 900, status: "won" }),
    ],
    demo: true,
  };
}
