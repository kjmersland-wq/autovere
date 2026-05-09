import Stripe from 'npm:stripe@16.9.0';

export type AppLocale = 'en' | 'no' | 'de' | 'sv' | 'fr' | 'pl' | 'it' | 'es';

const SUPPORTED_LOCALES: AppLocale[] = ['en', 'no', 'de', 'sv', 'fr', 'pl', 'it', 'es'];
export const STRIPE_BILLING_CURRENCY = 'eur' as const;

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export const getStripe = () => {
  const key = getEnv('STRIPE_SECRET_KEY');
  return new Stripe(key, { apiVersion: '2024-06-20' });
};

export const getWebhookSecret = () => getEnv('STRIPE_WEBHOOK_SECRET');

export const getAppBaseUrl = (req: Request): string => {
  const configured = Deno.env.get('SITE_URL') || Deno.env.get('PUBLIC_SITE_URL') || Deno.env.get('APP_URL');
  const candidate = configured || req.headers.get('origin') || req.headers.get('x-site-url') || '';
  if (!candidate) throw new Error('Missing application base URL');
  const parsed = new URL(candidate);
  return parsed.origin;
};

export const sanitizeLocale = (locale: string | null | undefined): AppLocale => {
  if (!locale) return 'en';
  return SUPPORTED_LOCALES.includes(locale as AppLocale) ? (locale as AppLocale) : 'en';
};

export const sanitizeInternalPath = (path: string | null | undefined, fallback: string): string => {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
};

export const localizePath = (path: string, locale: AppLocale): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const segments = normalized.split('/').filter(Boolean);
  const hasLocalePrefix = segments[0] && SUPPORTED_LOCALES.includes(segments[0] as AppLocale);
  const cleanPath = hasLocalePrefix ? `/${segments.slice(1).join('/')}` : normalized;

  if (locale === 'en') return cleanPath === '/' ? '/' : cleanPath;
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
};

export const toStripeLocale = (locale: AppLocale): Stripe.Checkout.SessionCreateParams.Locale | Stripe.BillingPortal.SessionCreateParams.Locale => {
  if (locale === 'no') return 'nb';
  return locale;
};

export const getStripePriceId = (interval: 'month' | 'year'): string => {
  const envKeyByInterval: Record<'month' | 'year', string> = {
    month: 'STRIPE_PRICE_MONTHLY',
    year: 'STRIPE_PRICE_YEARLY',
  };
  return getEnv(envKeyByInterval[interval]);
};

export const toIso = (unixSeconds?: number | null): string | null => {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
};

export const getBillingInterval = (subscription: Stripe.Subscription): 'month' | 'year' | null => {
  const interval = subscription.items.data[0]?.price?.recurring?.interval;
  if (interval === 'month' || interval === 'year') return interval;
  return null;
};

export const stripeEnvironment = (): 'sandbox' | 'live' => {
  const key = getEnv('STRIPE_SECRET_KEY');
  return key.startsWith('sk_test_') ? 'sandbox' : 'live';
};
