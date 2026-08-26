import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_SECONDS = 15 * 60;

function secret(): string {
  const value = process.env["AUTH_TOKEN_SECRET"];
  if (!value) throw new Error("AUTH_TOKEN_SECRET is not configured.");
  return value;
}

export function createMagicToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyMagicToken(token: string): string | null {
  const [payload, encodedSignature] = token.split(".");
  if (!payload || !encodedSignature) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const actual = Buffer.from(encodedSignature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown; exp?: unknown };
    return typeof value.email === "string" && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000) ? value.email : null;
  } catch {
    return null;
  }
}

export function authBaseUrl(_request?: Request | { headers?: Record<string, string | string[] | undefined> }): string {
  const configured = (
    process.env["AUTH_BASE_URL"] ||
    process.env["NEXT_PUBLIC_SITE_URL"] ||
    "https://autovere.com"
  ).trim();
  if (/^https?:\/\//.test(configured)) return configured.replace(/\/$/, "");
  return `https://${configured.replace(/\/$/, "")}`;
}