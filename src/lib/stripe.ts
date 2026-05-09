export function getStripeMode(): 'test' | 'live' {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  return key?.startsWith('pk_test_') ? 'test' : 'live';
}
