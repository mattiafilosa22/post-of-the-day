import { TextPage } from "../components/TextPage";

export const metadata = { title: "Regole · Il post del giorno" };

export default function Regole() {
  return (
    <TextPage>
      <h1>Regole</h1>
      <p className="updated">In breve: un posto al giorno, vince l&apos;offerta più alta, paga solo chi vince.</p>

      <h2>L&apos;asta</h2>
      <ul>
        <li>Ogni giorno si mette all&apos;asta lo spazio in prima pagina del giorno dopo.</li>
        <li>L&apos;asta si chiude alla mezzanotte (ora italiana). Vince l&apos;offerta più alta in quel momento.</li>
        <li>La prima offerta parte da 5 €. Ogni rilancio deve superare l&apos;offerta in testa di almeno 1 €. A parità di importo resta in testa chi è arrivato prima.</li>
        <li>Si può rilanciare quante volte si vuole.</li>
      </ul>

      <h2>Il pagamento</h2>
      <ul>
        <li>Quando offri, l&apos;importo viene bloccato sulla carta tramite Stripe, senza essere addebitato.</li>
        <li>Se vieni superato, il blocco viene annullato subito. La banca può impiegare alcuni giorni a mostrarlo.</li>
        <li>Se vinci, l&apos;importo viene addebitato alla chiusura dell&apos;asta.</li>
      </ul>

      <h2>Cosa si può pubblicare</h2>
      <p>
        Solo link a post LinkedIn pubblici. Non sono ammessi contenuti illegali, offensivi,
        discriminatori, ingannevoli, che violano diritti altrui o che promuovono gioco d&apos;azzardo,
        schemi finanziari o prodotti vietati.
      </p>
      <p>
        Possiamo togliere un&apos;offerta che non rispetta queste regole. Se l&apos;offerta era in testa,
        l&apos;importo bloccato viene rilasciato; se era già stata addebitata, viene rimborsata.
      </p>

      <h2>Cosa non è</h2>
      <p>
        Non è una lotteria né un gioco: non c&apos;è nessuna estrazione e nessun premio in denaro. Chi vince
        acquista uno spazio di visibilità per un giorno. Il sito non è affiliato a LinkedIn.
      </p>
    </TextPage>
  );
}
