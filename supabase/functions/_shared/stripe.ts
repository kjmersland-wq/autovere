export type StripeMode = 'test' | 'live';

const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1';
const WEBHOOK_TOLERANCE_SECONDS = 300;

const encoder = new TextEncoder();

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export function getStripeSecretKey() {
  return getEnv('STRIPE_SECRET_KEY');
}

export function getStripeMode(): StripeMode {
  return getStripeSecretKey().startsWith('sk_test_') ? 'test' : 'live';
}

export function getStripeSiteUrl() {
  return (Deno.env.get('SITE_URL') ?? Deno.env.get('PUBLIC_SITE_URL') ?? 'https://autovere.com').replace(/\/$/, '');
}

export function getStripePriceId(priceId: string) {
  const priceIds: Record<string, string | undefined> = {
    premium_monthly: Deno.env.get('STRIPE_PRICE_PREMIUM_MONTHLY'),
    premium_yearly: Deno.env.get('STRIPE_PRICE_PREMIUM_YEARLY'),
  };
  const stripePriceId = priceIds[priceId];
  if (!stripePriceId) throw new Error(`Unsupported Stripe price mapping for ${priceId}`);
  return stripePriceId;
}

export async function stripeApiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${getStripeSecretKey()}`);

  const body = init.body instanceof URLSearchParams ? init.body.toString() : init.body;
  if (typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

  const response = await fetch(`${STRIPE_API_BASE_URL}${path}`, {
    ...init,
    body,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe API ${path} failed (${response.status}): ${text}`);
  }

  return response;
}

export async function stripeApiJson<T>(path: string, init: RequestInit = {}) {
  const response = await stripeApiFetch(path, init);
  return await response.json() as T;
}

async function hmacHex(secret: string, payload: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function verifyStripeWebhook(req: Request) {
  const signatureHeader = req.headers.get('stripe-signature');
  if (!signatureHeader) throw new Error('Missing Stripe signature');

  const payload = await req.text();
  if (!payload) throw new Error('Missing Stripe payload');

  const signatureParts = signatureHeader.split(',').map((part) => part.trim());
  const timestamp = signatureParts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = signatureParts
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) throw new Error('Malformed Stripe signature');

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > WEBHOOK_TOLERANCE_SECONDS) {
    throw new Error('Stripe signature timestamp is out of tolerance');
  }

  const expected = await hmacHex(getEnv('STRIPE_WEBHOOK_SECRET'), `${timestamp}.${payload}`);
  const valid = signatures.some((signature) => timingSafeEqual(signature, expected));
  if (!valid) throw new Error('Invalid Stripe signature');

  return JSON.parse(payload);
}
