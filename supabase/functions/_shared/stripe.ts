import Stripe from 'npm:stripe@14';

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = 'test' | 'live';

export function getStripeEnvironment(): StripeEnv {
  const key = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
  return key.startsWith('sk_test_') ? 'test' : 'live';
}

export function getStripeClient(): Stripe {
  const secretKey = getEnv('STRIPE_SECRET_KEY');
  return new Stripe(secretKey, { apiVersion: '2024-06-20' });
}

export function getWebhookSecret(): string {
  return getEnv('STRIPE_WEBHOOK_SECRET');
}

export async function verifyWebhook(req: Request): Promise<Stripe.Event> {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const secret = getWebhookSecret();
  if (!signature || !body) throw new Error('Missing signature or body');
  const stripe = getStripeClient();
  return stripe.webhooks.constructEventAsync(body, signature, secret);
}
