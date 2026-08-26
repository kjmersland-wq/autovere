import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

type Request = IncomingMessage & { url?: string };
type Response = ServerResponse & {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => Response;
};

function authSecret(): string {
  const value = process.env["AUTH_TOKEN_SECRET"];
  if (!value) throw new Error("AUTH_TOKEN_SECRET is not configured.");
  return value;
}

function verifyMagicToken(token: string): string | null {
  const [payload, encodedSignature] = token.split(".");
  if (!payload || !encodedSignature) return null;
  const expected = createHmac("sha256", authSecret()).update(payload).digest();
  const actual = Buffer.from(encodedSignature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown; exp?: unknown };
    return typeof value.email === "string" && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000) ? value.email : null;
  } catch {
    return null;
  }
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const token = new URL(request.url ?? "", "http://localhost").searchParams.get("token") ?? "";
  let email: string | null = null;
  try { email = verifyMagicToken(token); } catch { email = null; }
  if (!email) {
    response.status(401).json({ error: "This login link is invalid or has expired." });
    return;
  }
  response.setHeader("Set-Cookie", `autovere_user=${encodeURIComponent(email)}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`);
  response.setHeader("Location", "/account");
  response.status(302).json({ ok: true });
}
