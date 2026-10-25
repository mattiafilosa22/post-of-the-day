// Prima di questo istante la home mostra solo la pagina nera con il conto alla rovescia.
// Default: martedì 17 novembre 2026 alle 8:00 di San Francisco (16:00 UTC).
const DEFAULT_LAUNCH = "2026-11-17T16:00:00Z";

export function launchAt(): Date {
  const raw = process.env.NEXT_PUBLIC_LAUNCH_AT ?? DEFAULT_LAUNCH;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date(DEFAULT_LAUNCH) : d;
}

export function isPrelaunch(now: Date = new Date()): boolean {
  return now < launchAt();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : null;
}
