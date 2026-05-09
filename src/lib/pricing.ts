export const BILLING_CURRENCY = 'EUR' as const;

export type BillingInterval = 'month' | 'year';

export const BILLING_PLANS: Record<
  BillingInterval,
  { amountCents: number; stripeEnvVars: string[] }
> = {
  month: {
    amountCents: 699,
    stripeEnvVars: ['STRIPE_PRICE_ID_MONTHLY', 'STRIPE_PRICE_MONTHLY'],
  },
  year: {
    amountCents: 5900,
    stripeEnvVars: ['STRIPE_PRICE_ID_YEARLY', 'STRIPE_PRICE_YEARLY'],
  },
};
