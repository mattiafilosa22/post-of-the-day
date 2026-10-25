"use client";

import { useState } from "react";

export function BidForm({ minEuro }: { minEuro: number }) {
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Qualcosa non ha funzionato. Riprova tra poco.");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa non ha funzionato. Riprova tra poco.");
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="postUrl">Link al tuo post LinkedIn</label>
        <input id="postUrl" name="postUrl" type="url" inputMode="url" required
          placeholder="https://www.linkedin.com/posts/..." autoComplete="off" />
        <span className="hint">Dal post: tre puntini, poi &ldquo;Copia link al post&rdquo;.</span>
      </div>
      <div className="field">
        <label htmlFor="name">Nome o azienda</label>
        <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="headline">Una riga su di te <span className="hint">(facoltativa)</span></label>
        <input id="headline" name="headline" maxLength={100} placeholder="Es. Founder di una startup a Torino" />
      </div>
      <div className="field">
        <label htmlFor="amount">La tua offerta</label>
        <div className="amount">
          <span aria-hidden="true">€</span>
          <input id="amount" name="amount" inputMode="decimal" required defaultValue={String(minEuro)}
            aria-describedby="amount-hint" />
        </div>
        <span className="hint" id="amount-hint">Minimo {minEuro.toLocaleString("it-IT")} €.</span>
      </div>
      {error ? <p className="error" role="alert">{error}</p> : null}
      <button className="button" type="submit" disabled={sending}>
        {sending ? "Ti porto al pagamento…" : "Fai la tua offerta"}
      </button>
      <p className="reassure">
        L&apos;importo viene solo bloccato sulla carta. Se qualcuno ti supera lo sblocchiamo subito;
        paghi soltanto se a mezzanotte sei ancora in testa.
      </p>
    </form>
  );
}
