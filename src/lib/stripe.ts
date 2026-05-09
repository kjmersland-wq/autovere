export function getStripePublishableKeyMode(): 'test' | 'live' | null {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  if (!key) return null;
  return key.startsWith('pk_test_') ? 'test' : 'live';
}

export function getStripeMode(): 'test' | 'live' {
  return getStripePublishableKeyMode() ?? 'live';
}
