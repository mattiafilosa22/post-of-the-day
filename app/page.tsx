import { BidForm } from "./components/BidForm";
import { Countdown } from "./components/Countdown";
import { Footer } from "./components/Footer";
import { Masthead } from "./components/Masthead";
import { formatEuro } from "@/lib/auction";
import { loadFrontPage } from "@/lib/frontpage";
import { parseLinkedInPost } from "@/lib/linkedin";
import { formatDayIt } from "@/lib/time";

export const dynamic = "force-dynamic";

const timeFmt = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit" });

export default async function Home() {
  const fp = await loadFrontPage();
  const embedUrl = fp.featured ? parseLinkedInPost(fp.featured.post_url)?.embedUrl ?? null : null;

  return (
    <div className="page">
      <Masthead edition={fp.featured ? `Spazio di oggi venduto a ${formatEuro(fp.featured.amount_cents)}` : undefined} />

      <main>
        <div className="front">
          <section className="lead" aria-labelledby="oggi">
            <p className="kicker">In prima pagina oggi</p>
            {fp.featured ? (
              <>
                <h2 className="headline" id="oggi">{fp.featured.name}</h2>
                <p className="byline">
                  {fp.featured.headline ? <>{fp.featured.headline} · </> : null}
                  ha vinto lo spazio con <strong>{formatEuro(fp.featured.amount_cents)}</strong>
                </p>
                {embedUrl && !fp.demo ? (
                  <iframe className="embed" src={embedUrl} title={`Post LinkedIn di ${fp.featured.name}`} loading="lazy" />
                ) : (
                  <div className="empty-slot">
                    <p className="big">Il post si legge su LinkedIn</p>
                    <p><a href={fp.featured.post_url} rel="nofollow noopener" target="_blank">Apri il post di {fp.featured.name}</a></p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="headline" id="oggi">Oggi questo spazio è rimasto vuoto.</h2>
                <p className="standfirst">
                  Nessuno ha fatto un&apos;offerta per oggi. Quello di domani è ancora libero: chi offre di più
                  entro mezzanotte finisce qui, davanti a tutti quelli che passano.
                </p>
                <div className="empty-slot">
                  <p className="big">Domani potresti esserci tu</p>
                  <p>Bastano il link a un post e un&apos;offerta da {formatEuro(fp.minNextCents)}.</p>
                </div>
              </>
            )}
          </section>

          <section className="auction" aria-labelledby="domani">
            <p className="kicker">L&apos;asta di domani</p>
            <h2 className="headline" id="domani" style={{ fontSize: "1.75rem" }}>
              <span>{formatDayIt(fp.auctionDay)}</span>
            </h2>
            <p className="price-label">{fp.leader ? "Offerta più alta" : "Si parte da"}</p>
            <p className="price">{formatEuro(fp.leader?.amount_cents ?? fp.minNextCents)}</p>
            <p className="leader">
              {fp.leader ? (
                <>In testa c&apos;è <strong>{fp.leader.name}</strong>. Per superarla servono almeno {formatEuro(fp.minNextCents)}.</>
              ) : (
                <>Nessuna offerta per ora. La prima che arriva va in testa.</>
              )}
            </p>
            <Countdown endsAt={fp.closesAt} />
            <BidForm minEuro={fp.minNextCents / 100} />
          </section>
        </div>

        <div className="columns">
          <section className="section" aria-labelledby="offerte">
            <h2 className="section-title" id="offerte">
              Le offerte di oggi <small>{fp.bids.length} finora</small>
            </h2>
            {fp.bids.length ? (
              <ol className="ledger">
                {fp.bids.map((b) => (
                  <li key={b.id} className={b.status === "outbid" ? "is-outbid" : undefined}>
                    <span className="who">
                      {b.name}
                      {b.status === "leading" ? <span className="tag">In testa</span> : null}
                    </span>
                    <span className="sum">{formatEuro(b.amount_cents)}</span>
                    <span className="meta">
                      {b.headline ? `${b.headline} · ` : ""}
                      {b.authorized_at ? `alle ${timeFmt.format(new Date(b.authorized_at))}` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">Ancora nessuna. Le offerte compaiono qui appena il pagamento viene autorizzato.</p>
            )}
          </section>

          <section className="section" aria-labelledby="archivio">
            <h2 className="section-title" id="archivio">Archivio</h2>
            {fp.archive.length ? (
              <ol className="ledger">
                {fp.archive.map((b) => (
                  <li key={b.id}>
                    <a className="who" href={b.post_url} rel="nofollow noopener" target="_blank">{b.name}</a>
                    <span className="sum">{formatEuro(b.amount_cents)}</span>
                    <span className="meta">
                      {formatDayIt(b.day)}{b.headline ? ` · ${b.headline}` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">Qui finiranno i post delle edizioni passate.</p>
            )}
          </section>
        </div>

        <section className="section" aria-labelledby="come">
          <h2 className="section-title" id="come">Come funziona</h2>
          <ol className="how">
            <li>
              <h3>Offri per domani</h3>
              <p>Incolla il link a un tuo post LinkedIn e scegli quanto offrire. Ogni rilancio deve superare il precedente di almeno 1 €.</p>
            </li>
            <li>
              <h3>Paghi solo se vinci</h3>
              <p>L&apos;importo viene bloccato, non addebitato. Se qualcuno ti supera, il blocco viene rilasciato e puoi rilanciare.</p>
            </li>
            <li>
              <h3>Un giorno in prima pagina</h3>
              <p>A mezzanotte l&apos;offerta più alta vince: il suo post resta qui tutto il giorno e poi entra nell&apos;archivio.</p>
            </li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
