import { TextPage } from "../components/TextPage";

export const metadata = { title: "Termini · Il post del giorno" };

const owner = process.env.NEXT_PUBLIC_OWNER_NAME ?? "[Nome del titolare]";
const email = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "[email di contatto]";

export default function Termini() {
  return (
    <TextPage>
      <h1>Termini del servizio</h1>
      <p className="updated">Bozza da far verificare a un professionista prima del lancio.</p>

      <h2>Chi offre il servizio</h2>
      <p>Il sito è gestito da {owner}. Per qualsiasi richiesta: {email}.</p>

      <h2>Il servizio</h2>
      <p>
        Il servizio consiste nella pubblicazione, per un giorno di calendario (ora italiana), di un link
        a un post LinkedIn scelto da chi vince l&apos;asta, insieme al nome e alla riga di presentazione
        indicati. Le modalità dell&apos;asta sono descritte nelle Regole, che fanno parte di questi termini.
      </p>

      <h2>Prezzo e pagamento</h2>
      <p>
        Il prezzo è l&apos;importo dell&apos;offerta vincente, IVA inclusa se dovuta. I pagamenti sono gestiti
        da Stripe. Le offerte non vincenti non vengono addebitate.
      </p>

      <h2>Recesso</h2>
      <p>
        Puoi annullare un&apos;offerta in testa scrivendo a {email} prima della chiusura dell&apos;asta:
        rilasciamo l&apos;importo bloccato. Dopo la chiusura il servizio viene eseguito il giorno stesso; con
        l&apos;offerta chiedi espressamente che l&apos;esecuzione inizi prima della scadenza del termine di
        recesso, e accetti che a servizio completato il diritto di recesso non si applichi
        (art. 59 del Codice del Consumo).
      </p>

      <h2>Responsabilità sui contenuti</h2>
      <p>
        Chi offre garantisce di avere il diritto di promuovere il post indicato e ne resta l&apos;unico
        responsabile. Possiamo rimuovere contenuti contrari alle Regole, con rimborso.
      </p>

      <h2>Disponibilità</h2>
      <p>
        Se per un guasto lo spazio non resta visibile per almeno 20 ore del giorno acquistato, rimborsiamo
        l&apos;importo in proporzione.
      </p>

      <h2>Legge applicabile</h2>
      <p>Si applica la legge italiana. Per i consumatori resta competente il foro del luogo di residenza.</p>
    </TextPage>
  );
}
