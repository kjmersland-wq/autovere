import { loadStripe, type Stripe } from '@stripe/stripe-js';

type StripeMode = 'test' | 'live';

const PUBLISHABLE_KEY_ENV_NAMES = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
] as const;

const loggedClientStripeIssues = new Set<string>();

let stripePromise: Promise<Stripe | null> | null = null;

const getClientEnv = (key: string): string | undefined => {
  const env = import.meta.env as Record<string, string | undefined>;
  return env[key];
};

const logClientStripeIssue = (message: string, details?: Record<string, unknown>) => {
  const fingerprint = JSON.stringify({ message, details });
  if (loggedClientStripeIssues.has(fingerprint)) return;
  loggedClientStripeIssues.add(fingerprint);
  console.error(message, details ?? {});
};

export const getStripePublishableKey = (): string | null => {
  for (const envName of PUBLISHABLE_KEY_ENV_NAMES) {
    const value = getClientEnv(envName)?.trim();
    if (value) return value;
  }
  return null;
};

export const getStripePublishableKeyMode = (): StripeMode | null => {
  const key = getStripePublishableKey();
  if (!key) return null;
  return key.startsWith('pk_test_') ? 'test' : 'live';
};

export const getStripeMode = (): StripeMode | null => getStripePublishableKeyMode();

export const validateStripeClientEnv = () => {
  const publishableKey = getStripePublishableKey();
  const missing: string[] = [];

  if (!publishableKey) {
    missing.push(PUBLISHABLE_KEY_ENV_NAMES.join(' or '));
    logClientStripeIssue('Stripe client configuration is missing a publishable key.', {
      expectedEnvVars: PUBLISHABLE_KEY_ENV_NAMES,
    });
  }

  return {
    valid: missing.length === 0,
    publishableKey,
    mode: getStripePublishableKeyMode(),
    missing,
  };
};

export const getStripeJs = async (): Promise<Stripe | null> => {
  const config = validateStripeClientEnv();
  if (!config.valid || !config.publishableKey) return null;

  stripePromise ??= loadStripe(config.publishableKey);
  return stripePromise;
};
