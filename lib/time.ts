// Tutte le date dell'asta sono giorni di calendario a Roma, nel formato YYYY-MM-DD.
const TZ = "Europe/Rome";

export function romeDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// Minuti di differenza tra Roma e UTC in un dato istante (60 d'inverno, 120 d'estate).
function romeOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

// L'istante in cui inizia un giorno a Roma.
export function romeMidnight(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const utcMidnight = Date.UTC(y, m - 1, d);
  // I cambi d'ora avvengono alle 2-3 di notte, quindi l'offset di mezzanotte è quello del giorno prima.
  const offset = romeOffsetMinutes(new Date(utcMidnight - 12 * 3600 * 1000));
  return new Date(utcMidnight - offset * 60000);
}

// L'asta aperta è sempre quella di domani: si chiude alla mezzanotte di Roma.
export function openAuctionDay(now: Date = new Date()): string {
  return addDays(romeDay(now), 1);
}

// "Lunedì 26 ottobre": in italiano si scrive maiuscola solo la prima lettera.
export function formatDayIt(day: string): string {
  const text = new Intl.DateTimeFormat("it-IT", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${day}T00:00:00Z`));
  return text.charAt(0).toUpperCase() + text.slice(1);
}
