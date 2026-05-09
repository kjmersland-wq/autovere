export type StripeEnvironment = 'test' | 'live';

export function getStripePublishableKey(): string {
  return (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() || '';
}

export function getStripeEnvironment(): StripeEnvironment {
  const key = getStripePublishableKey();
  return key.startsWith('pk_live_') ? 'live' : 'test';
}
