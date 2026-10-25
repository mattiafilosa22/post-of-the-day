# Il post del giorno

Ogni giorno un solo post LinkedIn in prima pagina. Lo spazio del giorno dopo va all'offerta più alta entro la mezzanotte (ora italiana), e paga solo chi vince: le offerte bloccano l'importo sulla carta con Stripe, e chi viene superato viene sbloccato subito.

## Come funziona

- **Offerta**: `POST /api/checkout` crea l'offerta e una sessione Stripe Checkout con `capture_method: manual`. L'importo viene solo autorizzato.
- **Autorizzazione**: il webhook `checkout.session.completed` mette l'offerta in testa e annulla il pagamento di chi era in testa prima. Se nel frattempo è arrivata un'offerta più alta, annulla quella nuova.
- **Chiusura**: alla mezzanotte di Roma l'offerta in testa viene incassata. Lo fa il cron di Vercel (`/api/cron/close`) e, per sicurezza, anche la prima visita alla home dopo mezzanotte.
- **Moderazione**: `POST /api/admin/reject` con `Authorization: Bearer $ADMIN_TOKEN` e `{"bidId": "..."}` toglie un'offerta in testa e rilascia il blocco. Un'offerta già incassata si rimborsa dalla dashboard di Stripe.

## Avvio in locale

```bash
npm install
npm run dev
```

Senza `DATABASE_URL`, in sviluppo la home mostra dati di esempio, utile per lavorare sul design.

## Messa online (tutto con piani gratuiti)

1. **Database**: crea un progetto Postgres su [Neon](https://neon.tech) o Supabase ed esegui `db/schema.sql`.
2. **Stripe**: crea un account, prendi la chiave segreta di test e aggiungi un webhook verso `https://<tuo-dominio>/api/webhooks/stripe` con l'evento `checkout.session.completed`.
3. **Vercel**: importa il repository e imposta le variabili di `.env.example`. Il cron in `vercel.json` gira ogni giorno alle 23:05 UTC.
4. Prova un'asta completa con le carte di test di Stripe, poi passa alle chiavi live.

## Test

```bash
npm test
```
