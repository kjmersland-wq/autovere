import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { url?: string; body?: { email?: unknown } | string; query?: Record<string, string | string[]> };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string | string[]) => Response };

const TOKEN_TTL_SECONDS = 15 * 60;

function authSecret(): string {
  const value = process.env["AUTH_TOKEN_SECRET"];
  if (!value) throw new Error("AUTH_TOKEN_SECRET is not configured.");
  return value;
}

function createMagicToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })).toString("base64url");
  const signature = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
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

function authBaseUrl(): string {
  const raw = (process.env["AUTH_BASE_URL"] || process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").trim();
  // Tolerate a value accidentally pasted as a Markdown link, e.g. "[https://x](https://x)",
  // or wrapped in stray quotes - pull out the first real URL if one is embedded.
  const embedded = raw.match(/https?:\/\/[^\s\])'"]+/);
  const configured = (embedded ? embedded[0] : raw.replace(/^['"]|['"]$/g, "").trim()).replace(/\/$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  return `https://${configured}`;
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function parseBody(body: Request["body"]): { email?: unknown } {
  if (typeof body === "string") {
    try { return JSON.parse(body) as { email?: unknown }; } catch { return {}; }
  }
  return body ?? {};
}

function adminEmail(): string | null {
  const value = process.env["ADMIN_EMAIL"];
  return value ? value.trim().toLowerCase() : null;
}

function signAdminToken(): string | null {
  const secret = process.env["AUTH_TOKEN_SECRET"];
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

async function recordUser(email: string) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return;
  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO users (email, first_seen_at, last_seen_at) VALUES (${email}, now(), now())
      ON CONFLICT (email) DO UPDATE SET last_seen_at = now()
    `;
  } catch (error) {
    console.error("Recording user login failed", error);
  }
}

async function handleVerify(request: Request, response: Response) {
  const url = new URL(request.url ?? "", "http://localhost");
  const token = request.query?.["token"] as string | undefined ?? url.searchParams.get("token") ?? "";
  let email: string | null = null;
  try {
    email = verifyMagicToken(token);
  } catch {
    email = null;
  }
  if (!email) {
    response.status(401).json({ error: "This login link is invalid or has expired." });
    return;
  }
  await recordUser(email);

  const cookies = [`autovere_user=${encodeURIComponent(email)}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`];
  // Admin status is granted only here, after the magic-link token itself has been
  // cryptographically verified — never from a client-supplied claim or the plain
  // session cookie, which is why this is a separate, independently signed cookie.
  if (adminEmail() && email.toLowerCase() === adminEmail()) {
    const adminToken = signAdminToken();
    if (adminToken) cookies.push(`autovere_admin=${adminToken}; Path=/; Max-Age=1209600; HttpOnly; Secure; SameSite=Lax`);
  }
  response.setHeader("Set-Cookie", cookies);
  response.setHeader("Location", "/account");
  response.status(302).json({ ok: true });
}

export default async function handler(request: Request, response: Response) {
  if (request.method === "GET") return handleVerify(request, response);
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { email: rawEmail } = parseBody(request.body);
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) {
    response.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"] || !process.env["AUTH_TOKEN_SECRET"]) {
    response.status(500).json({ error: "Login email is not configured." });
    return;
  }
  const link = `${authBaseUrl()}/api/login?token=${encodeURIComponent(createMagicToken(email))}`;
  try {
    await nodemailer.createTransport({ service: "gmail", auth: { user: process.env["GMAIL_USER"], pass: process.env["GMAIL_APP_PASSWORD"] } }).sendMail({
      from: process.env["GMAIL_USER"],
      to: email,
      subject: "Your AutoVere login link",
      text: `Use this link to sign in to AutoVere. It expires in 15 minutes:\n\n${link}`,
      html: `<p>Use this link to sign in to AutoVere. It expires in 15 minutes:</p><p><a href="${escapeHtmlAttr(link)}">Sign in to AutoVere</a></p><p style="word-break:break-all;color:#666;font-size:12px">${escapeHtmlAttr(link)}</p>`,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Magic link email failed", error);
    response.status(500).json({ error: "Could not send the login email." });
  }
}
