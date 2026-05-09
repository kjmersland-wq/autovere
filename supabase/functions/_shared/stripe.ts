import Stripe from 'npm:stripe@16.10.0';

const requireEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export const getStripeClient = (): Stripe =>
  new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-06-20',
  });

export const getStripeWebhookSecret = (): string => requireEnv('STRIPE_WEBHOOK_SECRET');

export const getSiteUrl = (): string => Deno.env.get('SITE_URL') ?? 'http://localhost:5173';

export const resolveStripePriceId = (priceKey: string): string => {
  if (priceKey.startsWith('price_')) return priceKey;

  const mapping: Record<string, string | undefined> = {
    premium_monthly: Deno.env.get('STRIPE_PRICE_PREMIUM_MONTHLY'),
    premium_yearly: Deno.env.get('STRIPE_PRICE_PREMIUM_YEARLY'),
  };

  const mapped = mapping[priceKey];
  if (!mapped) throw new Error(`No Stripe price configured for key "${priceKey}"`);
  return mapped;
};
