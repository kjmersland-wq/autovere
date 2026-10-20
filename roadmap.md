# Roadmap

## Bytte til innebygd Stripe
- [ ] Fjern eksisterende betalingsintegrasjon og tilhørende secrets/referanser, behold kundehistorikk.
- [ ] Aktiver innebygd Lovable Payments med Stripe via kontoformular.
- [ ] Gjenskap samme produkter/priser og koble checkout, tilgang, kundeportal og økonomioversikt.
- [ ] Test abonnementer og 14-dagers engangspass i preview før live.

## Creem-migrering (Creem → Creem)
- [x] Slettet Creem-filer (creem.ts, creem.server.ts, useCreemCheckout)
- [x] Creem server-klient + webhook-verifisering (creem.server.ts, HMAC-SHA256)
- [x] Checkout via Creem hosted side (payments.functions.ts, useCreemCheckout)
- [x] Webhook: checkout.completed, subscription.*, refund.created → subscriptions-tabellen
- [x] Priser oppdatert alle språk (Pro €8.15/mnd, €47/år, Fleet €18.39, Trip Pass €7.33)
- [x] Juridiske tekster + admin + KM TECH LABS-videresending → Creem
- [x] Typesjekk og bygg grønne
- [ ] Bruker: lim inn CREEM_API_KEY + CREEM_WEBHOOK_SECRET (sikkert skjema sendt)
- [ ] Bruker: oppgi de 4 Creem produkt-ID-ene (prod_...) → legges i src/lib/creem.ts
- [ ] Bruker: pek Creem-webhook til https://www.autovere.com/api/public/payments/webhook
- [ ] Test kjøp i testmodus, deretter sett CREEM_TEST_MODE=false
