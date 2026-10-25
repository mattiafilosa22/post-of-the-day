import { TextPage } from "../components/TextPage";

export const metadata = { title: "Privacy · Il post del giorno" };

const owner = process.env.NEXT_PUBLIC_OWNER_NAME ?? "[Nome del titolare]";
const email = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "[email di contatto]";

export default function Privacy() {
  return (
    <TextPage>
      <h1>Informativa privacy</h1>
      <p className="updated">Bozza da far verificare a un professionista prima del lancio.</p>

      <h2>Titolare</h2>
      <p>{owner}, contattabile a {email}.</p>

      <h2>Quali dati</h2>
      <ul>
        <li>Nome o azienda, riga di presentazione e link al post: li inserisci tu e vengono mostrati pubblicamente insieme all&apos;importo offerto.</li>
        <li>Email e dati di pagamento: li raccoglie Stripe durante il pagamento. Noi non vediamo il numero della carta.</li>
        <li>Dati tecnici minimi necessari al funzionamento del sito (log del server). Non usiamo cookie di profilazione.</li>
      </ul>

      <h2>Perché e su quale base</h2>
      <p>
        Per gestire l&apos;asta, i pagamenti e la pubblicazione (esecuzione del contratto) e per gli
        obblighi fiscali (obbligo di legge).
      </p>

      <h2>Per quanto tempo</h2>
      <p>I dati delle offerte e dei pagamenti si conservano per 10 anni per gli obblighi fiscali. Le offerte restano visibili nell&apos;archivio finché il sito è online, salvo tua richiesta di rimozione.</p>

      <h2>Chi li tratta per noi</h2>
      <p>Stripe (pagamenti), il fornitore di hosting e il fornitore del database, come responsabili del trattamento.</p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione e portabilità dei dati, o opporti al
        trattamento, scrivendo a {email}. Puoi anche presentare reclamo al Garante per la protezione dei
        dati personali.
      </p>
    </TextPage>
  );
}
