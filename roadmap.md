# Roadmap

## Bytte til innebygd Paddle-betaling
- [x] Stripe frakoblet og all Stripe-kode/-pakker fjernet; historiske migrasjoner og kundehistorikk beholdt.
- [x] Paddle aktivert (alias-e-post godkjent); fire planer opprettet med uendrede priser: Trip Pass €7.33/14 dager, Pro €8.15/mnd, Pro €47/år, Business €18.39/mnd.
- [x] Checkout (Paddle-overlay), kundeportal, webhook med idempotens, ledger og regnskapsvideresending til KM TECH LABS skrevet om til Paddle.
- [x] Footer-/pris-/juridiske tekster (15 språk + norsk) oppdatert til Paddle som Merchant of Record; admin-paneler oppdatert.
- [x] Åtte pris-/tilgangstester bestått; typesjekk og bygg OK.
- [ ] Test kjøpsflyt i preview (testkort 4242…): Trip Pass-kjøp, webhook, 14-dagers tilgang, kundeportal.
- [ ] Fullfør Paddle-verifisering (identitet/firma) i Payments-panelet før live-kjøp virker.
- [ ] Publiser og gjør ett lite ekte testkjøp etter godkjenning.
