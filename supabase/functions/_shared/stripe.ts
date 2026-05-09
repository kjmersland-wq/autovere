import Stripe from 'npm:stripe@16.10.0';

export type StripeMode = 'test' | 'live';

const LOCALES = ['en', 'no', 'de', 'sv', 'fr', 'pl', 'it', 'es'] as const;
export type AppLocale = (typeof LOCALES)[number];

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export const getStripeSecretKey = () => getEnv('STRIPE_SECRET_KEY');

export const getStripeModeFromSecret = (): StripeMode =>
  getStripeSecretKey().startsWith('sk_live_') ? 'live' : 'test';

export const getStripeModeFromPublishable = (pk?: string | null): StripeMode | null => {
  if (!pk) return null;
  if (pk.startsWith('pk_live_')) return 'live';
  if (pk.startsWith('pk_test_')) return 'test';
  return null;
};

let stripeClient: Stripe | null = null;
export const getStripe = (): Stripe => {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey(), {
      apiVersion: '2024-06-20',
    });
  }
  return stripeClient;
};

export const resolveLocale = (input?: unknown): AppLocale => {
  const candidate = typeof input === 'string' ? input.toLowerCase().trim() : '';
  if ((LOCALES as readonly string[]).includes(candidate)) return candidate as AppLocale;
  return 'en';
};

export const localizePath = (path: string, locale: AppLocale): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return locale === 'en' ? '/' : `/${locale}`;
  return locale === 'en' ? clean : `/${locale}${clean}`;
};

export const getBaseUrl = (req: Request): string => {
  const siteUrl = Deno.env.get('SITE_URL')?.trim();
  if (siteUrl) {
    try {
      return new URL(siteUrl).origin;
    } catch {
      throw new Error('SITE_URL is not a valid absolute URL');
    }
  }

  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (!forwardedHost) throw new Error('Unable to resolve base URL from request host headers');
  return `${forwardedProto}://${forwardedHost}`;
};

export const resolvePriceConfig = (priceId: string): { logicalPriceId: string; stripePriceId: string } => {
  if (priceId === 'premium_monthly') {
    return { logicalPriceId: priceId, stripePriceId: getEnv('STRIPE_PRICE_MONTHLY') };
  }
  if (priceId === 'premium_yearly') {
    return { logicalPriceId: priceId, stripePriceId: getEnv('STRIPE_PRICE_YEARLY') };
  }
  throw new Error('Unsupported price identifier');
};

export const getWebhookSecret = () => getEnv('STRIPE_WEBHOOK_SECRET');

export const parseLocaleFromPathname = (pathname: string): AppLocale => {
  const first = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (first && (LOCALES as readonly string[]).includes(first)) return first as AppLocale;
  return 'en';
};
