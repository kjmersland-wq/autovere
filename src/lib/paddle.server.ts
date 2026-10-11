/**
 * Paddle Billing — server-side helpers (workerd-safe: fetch + Web Crypto only).
 *
 * Uses Lovable's built-in payments connection: API calls are routed through
 * the connector gateway, and secrets are provisioned automatically:
 *   PADDLE_SANDBOX_API_KEY / PADDLE_LIVE_API_KEY       — gateway connection keys
 *   PAYMENTS_SANDBOX_WEBHOOK_SECRET / PAYMENTS_LIVE_WEBHOOK_SECRET
 *   LOVABLE_API_KEY                                    — project gateway auth
 */

export type PaddleEnv = "sandbox" | "live";

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev/paddle";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export function getConnectionApiKey(env: PaddleEnv): string {
  return env === "sandbox" ? getEnv("PADDLE_SANDBOX_API_KEY") : getEnv("PADDLE_LIVE_API_KEY");
}

/** Authenticated Paddle REST call through the connector gateway. */
export async function gatewayFetch(env: PaddleEnv, path: string, init?: RequestInit): Promise<Response> {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = getEnv("LOVABLE_API_KEY");
  return fetch(`${GATEWAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Connection-Api-Key": connectionApiKey,
      "Lovable-API-Key": lovableApiKey,
      ...init?.headers,
    },
  });
}

/** Typed Paddle API call; throws with Paddle's error detail on failure. */
export async function paddleApi<T = unknown>(
  env: PaddleEnv,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await gatewayFetch(env, path, {
    method: init?.method ?? "GET",
    ...(init?.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });
  const json = (await res.json().catch(() => null)) as {
    data?: T;
    error?: { detail?: string; code?: string };
  } | null;
  if (!res.ok) {
    const detail = json?.error?.detail ?? json?.error?.code ?? `HTTP ${res.status}`;
    throw new Error(`Paddle API error: ${detail}`);
  }
  return (json?.data ?? json) as T;
}

export function getPaddleErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Paddle request failed";
}

export function getWebhookSecret(env: PaddleEnv): string {
  return env === "sandbox" ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET") : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");
}

/**
 * Verify a Paddle webhook signature.
 * Header: `Paddle-Signature: ts=<unix>;h1=<hex hmac-sha256 of "<ts>:<raw body>">`
 */
export async function verifyPaddleWebhook(
  req: Request,
  env: PaddleEnv,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Paddle event payloads stay loosely typed
): Promise<{ event_type: string; data: any }> {
  const signature = req.headers.get("paddle-signature");
  const body = await req.text();
  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  let h1: string | undefined;
  for (const part of signature.split(";")) {
    const [key, value] = part.split("=", 2);
    if (key === "ts") timestamp = value;
    if (key === "h1") h1 = value;
  }
  if (!timestamp || !h1) throw new Error("Invalid signature format");

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getWebhookSecret(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}:${body}`),
  );
  const expected = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected !== h1.toLowerCase()) throw new Error("Invalid webhook signature");

  return JSON.parse(body);
}
