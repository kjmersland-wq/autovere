export const BILLING_CURRENCY = 'EUR' as const;

export type BillingInterval = 'month' | 'year';

export const BILLING_PLANS: Record<
  BillingInterval,
  { amountCents: number; stripeEnvVar: string }
> = {
  month: {
    amountCents: 699,
    stripeEnvVar: 'STRIPE_PRICE_MONTHLY',
  },
  year: {
    amountCents: 5900,
    stripeEnvVar: 'STRIPE_PRICE_YEARLY',
  },
};
