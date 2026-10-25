"use client";

import { useEffect, useState } from "react";

const UNITS = [
  ["days", 86400],
  ["hours", 3600],
  ["minutes", 60],
  ["seconds", 1],
] as const;

export function LaunchCountdown({ launchAt }: { launchAt: string }) {
  const end = new Date(launchAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      // Allo scadere ricarica: il server mostra la prima pagina.
      if (t >= end) {
        clearInterval(id);
        window.location.reload();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [end]);

  let left = now === null ? null : Math.max(0, Math.floor((end - now) / 1000));
  return (
    <div className="launch-clock" role="timer" aria-label="Time until launch">
      {UNITS.map(([label, size]) => {
        const value = left === null ? null : Math.floor(left / size);
        if (left !== null && value !== null) left -= value * size;
        return (
          <div className="launch-unit" key={label}>
            <span className="launch-digits" suppressHydrationWarning>
              {value === null ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="launch-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
