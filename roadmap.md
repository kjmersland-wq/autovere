# Roadmap

## Paddle-migrering (Stripe → Paddle, innebygd kobling)
- [x] Koblet til Paddle med egen konto (alias kjmersland+autovere2@gmail.com)
- [x] Slettet Stripe-filer og -pakker
- [x] Omskrevet til gateway-basert Paddle (paddle.server.ts, webhook.ts på kanonisk sti)
- [x] Priser ×1,02 i pricing-i18n.ts, produkter opprettet (trip_pass, pro_monthly/yearly, business_monthly)
- [x] PaymentTestModeBanner i root, typesjekk grønn
- [ ] Bruker: verifiser identitet i Payments-panelet for å gå live
- [ ] Bruker: test kjøp i preview med testkort 4242 4242 4242 4242
