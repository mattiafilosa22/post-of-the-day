-- Una riga per offerta. "day" è il giorno (ora di Roma) in cui il post vincitore resta in vetrina.
create extension if not exists pgcrypto;

create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  name text not null,
  headline text,
  post_url text not null,
  amount_cents integer not null check (amount_cents > 0),
  -- pending: checkout aperto · leading: autorizzata e in testa · outbid: superata, blocco rilasciato
  -- won: incassata · rejected: rifiutata dalla moderazione · failed: incasso non riuscito
  status text not null default 'pending'
    check (status in ('pending', 'leading', 'outbid', 'won', 'rejected', 'failed')),
  stripe_session_id text unique,
  payment_intent_id text,
  created_at timestamptz not null default now(),
  authorized_at timestamptz
);

create index if not exists bids_day_status on bids (day, status);
-- Al massimo un'offerta in testa per giorno.
create unique index if not exists bids_one_leader on bids (day) where status = 'leading';
create unique index if not exists bids_one_winner on bids (day) where status = 'won';
