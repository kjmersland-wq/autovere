import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";

type Request = IncomingMessage & { body?: { email?: unknown } | string };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

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

function authBaseUrl(): string {
  const raw = (process.env["AUTH_BASE_URL"] || process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").trim();
  const configured = raw.replace(/^['"]|['"]$/g, "").trim();
  if (/^https?:\/\//.test(configured)) return configured.replace(/\/$/, "");
  return `https://${configured.replace(/\/$/, "")}`;
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

export default async function handler(request: Request, response: Response) {
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
  const link = `${authBaseUrl()}/api/verify-login?token=${encodeURIComponent(createMagicToken(email))}`;
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
