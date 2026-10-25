import { sql } from "./db";

// Restituisce true se l'email è nuova, false se era già in lista.
export async function joinWaitlist(email: string): Promise<boolean> {
  const rows = await sql()`insert into waitlist (email) values (${email}) on conflict do nothing returning email`;
  return rows.length > 0;
}

export async function waitlistCount(): Promise<number> {
  const [row] = await sql()<{ n: number }[]>`select count(*)::int as n from waitlist`;
  return row.n;
}
