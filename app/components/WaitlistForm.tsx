"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return <p className="launch-done" role="status">You&apos;re on the list. We&apos;ll write a few minutes before everyone else.</p>;
  }

  return (
    <form className="launch-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="email" className="sr-only">Email</label>
      <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@example.com" />
      <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Adding…" : "Get the link first"}</button>
      {error ? <p className="launch-error" role="alert">{error}</p> : null}
    </form>
  );
}
