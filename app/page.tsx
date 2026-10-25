import { BidForm } from "./components/BidForm";
import { Countdown } from "./components/Countdown";
import { Footer } from "./components/Footer";
import { Masthead } from "./components/Masthead";
import { PostEmbed } from "./components/PostEmbed";
import { Prelaunch } from "./components/Prelaunch";
import { formatMoney } from "@/lib/auction";
import { loadFrontPage } from "@/lib/frontpage";
import { isPrelaunch, launchAt } from "@/lib/launch";
import { formatDay } from "@/lib/time";

export const dynamic = "force-dynamic";

const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export default async function Home() {
  if (isPrelaunch()) return <Prelaunch launchAt={launchAt()} />;

  const fp = await loadFrontPage();

  return (
    <div className="page">
      <Masthead edition={fp.featured ? `Today's spot went for ${formatMoney(fp.featured.amount_cents)}` : undefined} />

      <main>
        <div className="front">
          <section className="lead" aria-labelledby="today">
            <p className="kicker">On the front page today</p>
            {fp.featured ? (
              <>
                <h2 className="headline" id="today">{fp.featured.name}</h2>
                <p className="byline">
                  {fp.featured.headline ? <>{fp.featured.headline} · </> : null}
                  won the spot with <strong>{formatMoney(fp.featured.amount_cents)}</strong>
                </p>
                <PostEmbed url={fp.featured.post_url} name={fp.featured.name} />
              </>
            ) : (
              <>
                <h2 className="headline" id="today">Nobody claimed today&apos;s spot.</h2>
                <p className="standfirst">
                  No one bid for today. Tomorrow&apos;s spot is still open: the highest bid by midnight UTC
                  lands right here, in front of everyone who stops by.
                </p>
                <div className="empty-slot">
                  <p className="big">Tomorrow it could be you</p>
                  <p>All it takes is a link and a bid of {formatMoney(fp.minNextCents)}.</p>
                </div>
              </>
            )}
          </section>

          <section className="auction" aria-labelledby="tomorrow">
            <p className="kicker">Bidding for tomorrow</p>
            <h2 className="headline" id="tomorrow" style={{ fontSize: "1.75rem" }}>{formatDay(fp.auctionDay)}</h2>
            <p className="price-label">{fp.leader ? "Highest bid" : "Starting at"}</p>
            <p className="price">{formatMoney(fp.leader?.amount_cents ?? fp.minNextCents)}</p>
            <p className="leader">
              {fp.leader ? (
                <><strong>{fp.leader.name}</strong> is on top. Beating them takes at least {formatMoney(fp.minNextCents)}.</>
              ) : (
                <>No bids yet. The first one takes the lead.</>
              )}
            </p>
            <Countdown endsAt={fp.closesAt} />
            <BidForm minAmount={fp.minNextCents / 100} />
          </section>
        </div>

        <div className="columns">
          <section className="section" aria-labelledby="bids">
            <h2 className="section-title" id="bids">
              Today&apos;s bids <small>{fp.bids.length} so far</small>
            </h2>
            {fp.bids.length ? (
              <ol className="ledger">
                {fp.bids.map((b) => (
                  <li key={b.id} className={b.status === "outbid" ? "is-outbid" : undefined}>
                    <span className="who">
                      {b.name}
                      {b.status === "leading" ? <span className="tag">On top</span> : null}
                    </span>
                    <span className="sum">{formatMoney(b.amount_cents)}</span>
                    <span className="meta">
                      {b.headline ? `${b.headline} · ` : ""}
                      {b.authorized_at ? `at ${timeFmt.format(new Date(b.authorized_at))} UTC` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">None yet. Bids show up here as soon as the card is authorized.</p>
            )}
          </section>

          <section className="section" aria-labelledby="archive">
            <h2 className="section-title" id="archive">Archive</h2>
            {fp.archive.length ? (
              <ol className="ledger">
                {fp.archive.map((b) => (
                  <li key={b.id}>
                    <a className="who" href={b.post_url} rel="nofollow noopener" target="_blank">{b.name}</a>
                    <span className="sum">{formatMoney(b.amount_cents)}</span>
                    <span className="meta">
                      {formatDay(b.day)}{b.headline ? ` · ${b.headline}` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">Past front pages will live here.</p>
            )}
          </section>
        </div>

        <section className="section" aria-labelledby="how">
          <h2 className="section-title" id="how">How it works</h2>
          <ol className="how">
            <li>
              <h3>Bid for tomorrow</h3>
              <p>Paste a link to your post and choose your bid. Every new bid has to beat the top one by at least $1.</p>
            </li>
            <li>
              <h3>Only the winner pays</h3>
              <p>Your card is authorized, not charged. If someone outbids you, the hold is released and you can bid again.</p>
            </li>
            <li>
              <h3>One day on the front page</h3>
              <p>At midnight UTC the highest bid wins. That post stays here all day, then moves to the archive.</p>
            </li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
