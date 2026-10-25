export const MIN_FIRST_BID_CENTS = 500;
export const MIN_INCREMENT_CENTS = 100;
export const MAX_BID_CENTS = 1_000_000;

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

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function parseEuroToCents(input: string): number | null {
  const clean = input.trim().replace(/\s|€/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  return Math.round(Number(clean) * 100);
}
