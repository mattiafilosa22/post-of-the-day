import Link from "next/link";
import { LaunchCountdown } from "./LaunchCountdown";
import { WaitlistForm } from "./WaitlistForm";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function Prelaunch({ launchAt }: { launchAt: Date }) {
  return (
    <div className="launch">
      <main className="launch-inner">
        <p className="launch-mark">The <em>Post</em> of the Day</p>
        <LaunchCountdown launchAt={launchAt.toISOString()} />
        <p className="launch-line">One spot. One day. Only the winner pays.</p>
        <p className="launch-when">{dateFmt.format(launchAt)}</p>
        <WaitlistForm />
        <p className="launch-fine">
          One email at launch, nothing else. <Link href="/privacy">Privacy</Link>
        </p>
      </main>
    </div>
  );
}
