/**
 * Creem — server-side helpers (workerd-safe: fetch + Web Crypto only).
 *
 * Secrets (Lovable Cloud secrets, never in frontend code):
 *   CREEM_API_KEY         — API key from the Creem dashboard (Developers section)
 *   CREEM_WEBHOOK_SECRET  — webhook signing secret (Developers → Webhooks)
 *   test mode is derived from the API key prefix (creem_test_)
 *
 * Creem is the Merchant of Record: checkout is a hosted page, and Creem
 * confirms purchases via signed webhooks (HMAC-SHA256, `creem-signature` header).
 */

const PROD_BASE_URL = "https://api.creem.io/v1";
const TEST_BASE_URL = "https://test-api.creem.io/v1";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export function creemTestMode(): boolean {
  // Follows the API key: Creem test keys start with "creem_test_".
  return (process.env["CREEM_API_KEY"] ?? "").startsWith("creem_test_");
}

export function creemBaseUrl(): string {
  return creemTestMode() ? TEST_BASE_URL : PROD_BASE_URL;
}

/** Authenticated Creem REST call; throws with Creem's error detail on failure. */
export async function creemApi<T = unknown>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${creemBaseUrl()}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getEnv("CREEM_API_KEY"),
    },
    ...(init?.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });
  const json = (await res.json().catch(() => null)) as
    | (T & { message?: string; error?: string })
    | null;
  if (!res.ok) {
    const detail = (json as { message?: string; error?: string } | null)?.message
      ?? (json as { error?: string } | null)?.error
      ?? `HTTP ${res.status}`;
    throw new Error(`Creem API error: ${detail}`);
  }
  return json as T;
}

export function getCreemErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Creem request failed";
}

export type CreemEvent = {
  id: string;
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Creem payloads stay loosely typed
  object: any;
};

/**
 * Verify a Creem webhook signature.
 * Header: `creem-signature: <hex hmac-sha256 of raw body, keyed by webhook secret>`
 */
export async function verifyCreemWebhook(req: Request): Promise<CreemEvent> {
  const signature = req.headers.get("creem-signature");
  const body = await req.text();
  if (!signature || !body) throw new Error("Missing signature or body");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getEnv("CREEM_WEBHOOK_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected !== signature.toLowerCase()) throw new Error("Invalid webhook signature");

  return JSON.parse(body) as CreemEvent;
}
