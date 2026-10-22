# Roadmap

## Tilbake til innebygd Stripe
- [x] Brukeren bekrefter byttet og at eksisterende abonnementer ikke flyttes automatisk.
- [x] Brukeren kobler fra Paddle i betalingspanelet.
- [x] Koble til innebygd Stripe, gjenopprett produkter og bytt betalingskode uten å slette kundehistorikk.
- [x] Brukeren bekrefter at nåværende AutoVere-priser skal beholdes uendret.
- [x] Trip Pass-testkjøp bekreftet i UI, betaling registrert, 14 dagers tilgang og personlig kundeportal kontrollert; åtte tester bestått og bygg OK.
- [ ] Brukeren fullfører Stripe Live-kontooppsett i Payments-panelet; deretter kontrolleres live-status før publisering og ekte testkjøp.
- [x] Testkjøp bekreftet i preview: Trip Pass-checkout åpnes,Stripe-renderer skjemaet, ingen konsollfeil; katalogpriser verifisert likt payment-plans.ts (733/815/4700/1839).
- [x] Foreldet Paddle-token fjernet fra .env.production; produksjonsbygget viser nå tydelig go-live-melding i stedet for en stillbar Paddle-nøkkel.
- [ ] Avgjøres av brukeren: moms legges ovenfor annonsert pris i checkout (Trip Pass €7.33 → €8.87), mens prissidens fottekst sier «inkl. moms». Enten gjøres prisene momsinkluderte, eller så endres fotteksten på alle 15 språk.

## Bytte til innebygd Paddle-betaling
- [x] Stripe frakoblet og all Stripe-kode/-pakker fjernet; historiske migrasjoner og kundehistorikk beholdt.
- [x] Paddle aktivert (alias-e-post godkjent); fire planer opprettet med uendrede priser: Trip Pass €7.33/14 dager, Pro €8.15/mnd, Pro €47/år, Business €18.39/mnd.
- [x] Checkout (Paddle-overlay), kundeportal, webhook med idempotens, ledger og regnskapsvideresending til KM TECH LABS skrevet om til Paddle.
- [x] Footer-/pris-/juridiske tekster (15 språk + norsk) oppdatert til Paddle som Merchant of Record; admin-paneler oppdatert.
- [x] Åtte pris-/tilgangstester bestått; typesjekk og bygg OK.
- Tidligere Paddle-oppgaver er erstattet av Stripe-overgangen ovenfor.
