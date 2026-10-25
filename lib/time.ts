// L'asta segue i giorni di calendario UTC, così vale uguale per tutti i fusi orari.
// Le date sono stringhe YYYY-MM-DD.

export function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// L'istante in cui inizia un giorno (mezzanotte UTC).
export function dayStart(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

// L'asta aperta è sempre quella di domani: si chiude alla mezzanotte UTC.
export function openAuctionDay(now: Date = new Date()): string {
  return addDays(today(now), 1);
}

export function formatDay(day: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(dayStart(day));
}
