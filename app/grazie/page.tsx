import { TextPage } from "../components/TextPage";

export const metadata = { title: "Offerta ricevuta · Il post del giorno" };

export default function Grazie() {
  return (
    <TextPage>
      <p className="kicker">Offerta ricevuta</p>
      <h1>Ci sei. Ora non resta che aspettare mezzanotte.</h1>
      <p>
        L&apos;importo è bloccato sulla tua carta, non addebitato. Entro qualche secondo la tua offerta
        compare nella prima pagina.
      </p>
      <p>
        Se qualcuno offre di più, sblocchiamo subito l&apos;importo e puoi rilanciare. La banca può
        impiegare qualche giorno a mostrare lo sblocco. Se a mezzanotte sei ancora in testa, l&apos;importo
        viene addebitato e domani il tuo post è in prima pagina.
      </p>
      <p>Un consiglio: condividi la pagina. Chi ti supera lo fa davanti a tutti, e anche chi ti difende.</p>
    </TextPage>
  );
}
