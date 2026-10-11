/**
 * Paddle Billing — server-side helpers (workerd-safe: fetch + Web Crypto only).
 *
 * Required secrets (set via Lovable project secrets):
 *   PADDLE_API_KEY          — Paddle API key (server-side, never exposed to the browser)
 *   PADDLE_WEBHOOK_SECRET   — webhook signing secret from Paddle → Notifications
 *   PADDLE_ENV              — "sandbox" or "live"
 */

export type PaddleEnv = "sandbox" | "live";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export function paddleEnv(): PaddleEnv {
  return process.env["PADDLE_ENV"] === "live" ? "live" : "sandbox";
}

function apiBase(): string {
  return paddleEnv() === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
}

export async function paddleApi<T = unknown>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getEnv("PADDLE_API_KEY")}`,
      "Content-Type": "application/json",
    },
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

/**
 * Verify a Paddle webhook signature.
 * Header: `Paddle-Signature: ts=<unix>;h1=<hex hmac-sha256 of "<ts>:<raw body>">`
 */
export async function verifyPaddleWebhook(
  req: Request,
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
    new TextEncoder().encode(getEnv("PADDLE_WEBHOOK_SECRET")),
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
