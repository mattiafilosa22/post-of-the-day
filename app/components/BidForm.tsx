"use client";

import { useState } from "react";

const FALLBACK_ERROR = "Something went wrong. Please try again in a moment.";

export function BidForm({ minAmount }: { minAmount: number }) {
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
      if (!res.ok || !json.url) throw new Error(json.error ?? FALLBACK_ERROR);
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : FALLBACK_ERROR);
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="postUrl">Link to your post</label>
        <input id="postUrl" name="postUrl" type="url" inputMode="url" required
          placeholder="https://x.com/you/status/..." autoComplete="off" />
        <span className="hint">A post on X or LinkedIn shows up in full. Any other link works too.</span>
      </div>
      <div className="field">
        <label htmlFor="name">Name or company</label>
        <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="headline">One line about you <span className="hint">(optional)</span></label>
        <input id="headline" name="headline" maxLength={100} placeholder="e.g. Building a calm inbox, solo" />
      </div>
      <div className="field">
        <label htmlFor="amount">Your bid</label>
        <div className="amount">
          <span aria-hidden="true">$</span>
          <input id="amount" name="amount" inputMode="decimal" required defaultValue={String(minAmount)}
            aria-describedby="amount-hint" />
        </div>
        <span className="hint" id="amount-hint">Minimum ${minAmount.toLocaleString("en-US")}.</span>
      </div>
      {error ? <p className="error" role="alert">{error}</p> : null}
      <button className="button" type="submit" disabled={sending}>
        {sending ? "Taking you to checkout…" : "Place your bid"}
      </button>
      <p className="reassure">
        Your card is only authorized, not charged. If someone outbids you, we release the hold right away.
        You pay only if you are still on top at midnight.
      </p>
    </form>
  );
}
