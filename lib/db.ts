import postgres from "postgres";

let client: postgres.Sql | null = null;

export function sql(): postgres.Sql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL non impostata");
    client = postgres(url, { max: 5, prepare: false });
  }
  return client;
}
