# Migrering Stripe → Paddle (eksisterende Paddle-konto)

- [ ] 1. `src/lib/paddle.server.ts` — Paddle API-klient (fetch, workerd-safe) + webhook-signaturverifisering (HMAC-SHA256, Paddle-Signature-header)
- [ ] 2. `src/lib/paddle.ts` — klient: Paddle.js-lasting, PRICE_IDS-konfig, PRICE_MARKUP = 0.02, tier-mapping (erstatter src/lib/stripe.ts)
- [ ] 3. `src/utils/payments.functions.ts` — createCheckoutSession via Paddle Transactions API, createPortalSession via Paddle customer portal API
- [ ] 4. Ny webhook-route `/api/public/payments/paddle-webhook` — transaction.completed (engangs), subscription.created/updated/canceled
- [ ] 5. Migrasjon: `paddle_customer_id`, `paddle_subscription_id`, `provider` på subscriptions; stripe-kolonner beholdes som legacy
- [ ] 6. Erstatt StripeEmbeddedCheckout med Paddle overlay-checkout; oppdater useStripeCheckout → usePaddleCheckout
- [ ] 7. Oppdater PricingTiers.tsx, ExportPaywallModal.tsx, useSubscription.ts til Paddle
- [ ] 8. Priser × 1,02 i pricing-i18n.ts (penrunding) + foot-tekster Stripe → Paddle (14 språk)
- [ ] 9. Personvern/vilkår: Stripe → Paddle (Merchant of Record)
- [ ] 10. Secrets: PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, PADDLE_CLIENT_TOKEN (via add_secret)
- [ ] 11. Typecheck + bygg
- [ ] 12. Liste til bruker: filer endret + Paddle-oppgaver (produkter/priser, webhook-URL, domenegodkjenning)
