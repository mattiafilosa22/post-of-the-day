import { formatDay, today } from "@/lib/time";

export function Masthead({ edition }: { edition?: string }) {
  return (
    <header className="masthead">
      <div className="masthead-top">
        <span>Est. 2026</span>
        <span>One post, one day</span>
      </div>
      <hr className="double-rule" />
      <h1 className="masthead-title">
        The <em>Post</em> of the Day
      </h1>
      <div className="dateline">
        <span>{formatDay(today())}</span>
        {edition ? <span>{edition}</span> : null}
        <span>Only the winner pays</span>
      </div>
    </header>
  );
}
