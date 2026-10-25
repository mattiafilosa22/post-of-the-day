export const MIN_FIRST_BID_CENTS = 500;
export const MIN_INCREMENT_CENTS = 100;
export const MAX_BID_CENTS = 1_000_000;
export const CURRENCY = "usd";

export function minNextBidCents(leaderCents: number | null): number {
  return leaderCents === null ? MIN_FIRST_BID_CENTS : leaderCents + MIN_INCREMENT_CENTS;
}

// Quando un pagamento viene autorizzato: passa in testa solo se supera chi c'è già.
// A parità vince chi è arrivato prima, quindi l'offerta nuova viene rilasciata.
export function decideOnAuthorized(
  newCents: number,
  leaderCents: number | null,
): "lead" | "outbid" {
  if (leaderCents === null) return "lead";
  return newCents >= leaderCents + MIN_INCREMENT_CENTS ? "lead" : "outbid";
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

// Accetta "12", "12.50", "$12" e anche la virgola decimale ("12,50").
export function parseAmountToCents(input: string): number | null {
  const clean = input.trim().replace(/\s|\$|€/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  return Math.round(Number(clean) * 100);
}
