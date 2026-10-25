"use client";

import { useEffect, useState } from "react";

function format(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = now === null ? null : end - now;
  return (
    <p className="countdown">
      {left !== null && left <= 0 ? (
        <span>Asta chiusa. Ricarica la pagina per vedere il vincitore.</span>
      ) : (
        <>
          <span>L&apos;asta si chiude a mezzanotte, tra</span>
          <time dateTime={endsAt} suppressHydrationWarning>
            {left === null ? "--:--:--" : format(left)}
          </time>
        </>
      )}
    </p>
  );
}
