import { formatDayIt, romeDay } from "@/lib/time";

export function Masthead({ edition }: { edition?: string }) {
  const today = romeDay();
  return (
    <header className="masthead">
      <div className="masthead-top">
        <span>Fondato nel 2026</span>
        <span>Un post, un giorno</span>
      </div>
      <hr className="double-rule" />
      <h1 className="masthead-title">
        Il <em>post</em> del giorno
      </h1>
      <div className="dateline">
        <span>{formatDayIt(today)}</span>
        {edition ? <span>{edition}</span> : null}
        <span>Paga solo chi vince</span>
      </div>
    </header>
  );
}
