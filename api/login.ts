import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "node:crypto";
import nodemailer from "nodemailer";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { url?: string; body?: unknown; query?: Record<string, string | string[]> };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string | string[]) => Response };

const TOKEN_TTL_SECONDS = 15 * 60;
const RESET_TTL_SECONDS = 30 * 60;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

function authSecret(): string {
  const value = process.env["AUTH_TOKEN_SECRET"];
  if (!value) throw new Error("AUTH_TOKEN_SECRET is not configured.");
  return value;
}

function createPurposeToken(email: string, purpose: string, ttlSeconds: number): string {
  const payload = Buffer.from(JSON.stringify({ email, purpose, exp: Math.floor(Date.now() / 1000) + ttlSeconds })).toString("base64url");
  const signature = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyPurposeToken(token: string, purpose: string): string | null {
  const [payload, encodedSignature] = token.split(".");
  if (!payload || !encodedSignature) return null;
  const expected = createHmac("sha256", authSecret()).update(payload).digest();
  const actual = Buffer.from(encodedSignature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown; purpose?: unknown; exp?: unknown };
    if (value.purpose !== purpose) return null;
    return typeof value.email === "string" && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000) ? value.email : null;
  } catch {
    return null;
  }
}

function signSessionToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString("base64url");
  const signature = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
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

function parseBody(body: Request["body"]): Record<string, unknown> {
  if (typeof body === "string") {
    try { return JSON.parse(body) as Record<string, unknown>; } catch { return {}; }
  }
  return (body as Record<string, unknown>) ?? {};
}

function queryParam(request: Request, name: string): string | null {
  const raw = request.query?.[name];
  if (typeof raw === "string") return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  return url.searchParams.get(name);
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

function sessionCookiesFor(email: string): string[] {
  const cookies = [`autovere_user=${signSessionToken(email)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`];
  // Admin status is granted only here, after the caller's identity has already been verified
  // (a valid magic-link token or a correct password) — never from a client-supplied claim.
  if (adminEmail() && email.toLowerCase() === adminEmail()) {
    const adminToken = signAdminToken();
    if (adminToken) cookies.push(`autovere_admin=${adminToken}; Path=/; Max-Age=1209600; HttpOnly; Secure; SameSite=Lax`);
  }
  return cookies;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false;
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  if (!salt || !hashHex) return false;
  try {
    const hashBuffer = Buffer.from(hashHex, "hex");
    const suppliedBuffer = scryptSync(password, salt, hashBuffer.length);
    return hashBuffer.length === suppliedBuffer.length && timingSafeEqual(hashBuffer, suppliedBuffer);
  } catch {
    return false;
  }
}

function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8 && password.length <= 200;
}

async function tooManyAttempts(email: string, kind: string, maxAttempts: number, windowMinutes: number): Promise<boolean> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return false;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT count(*)::int AS count FROM auth_attempts
      WHERE email = ${email} AND kind = ${kind} AND created_at > now() - make_interval(mins => ${windowMinutes})
    `) as { count: number }[];
    return (rows[0]?.count ?? 0) >= maxAttempts;
  } catch (error) {
    console.error("Rate limit check failed", error);
    return false;
  }
}

async function recordAttempt(email: string, kind: string) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return;
  try {
    const sql = neon(databaseUrl);
    await sql`INSERT INTO auth_attempts (email, kind, created_at) VALUES (${email}, ${kind}, now())`;
  } catch (error) {
    console.error("Recording auth attempt failed", error);
  }
}

type UserRow = { password_hash: string | null; must_change_password: boolean };

async function getUser(email: string): Promise<UserRow | null> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return null;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`SELECT password_hash, must_change_password FROM users WHERE email = ${email}`) as UserRow[];
    return rows[0] ?? null;
  } catch (error) {
    console.error("Looking up user failed", error);
    return null;
  }
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

async function setPassword(email: string, passwordHash: string, mustChangePassword: boolean) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  const sql = neon(databaseUrl);
  await sql`
    INSERT INTO users (email, first_seen_at, last_seen_at, password_hash, must_change_password)
    VALUES (${email}, now(), now(), ${passwordHash}, ${mustChangePassword})
    ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}, must_change_password = ${mustChangePassword}
  `;
}

function mailer() {
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"]) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user: process.env["GMAIL_USER"], pass: process.env["GMAIL_APP_PASSWORD"] } });
}

async function handleVerify(request: Request, response: Response) {
  const url = new URL(request.url ?? "", "http://localhost");
  const token = request.query?.["token"] as string | undefined ?? url.searchParams.get("token") ?? "";
  let email: string | null = null;
  try {
    email = verifyPurposeToken(token, "login");
  } catch {
    email = null;
  }
  if (!email) {
    response.status(401).json({ error: "This login link is invalid or has expired." });
    return;
  }
  await recordUser(email);
  response.setHeader("Set-Cookie", sessionCookiesFor(email));
  response.setHeader("Location", "/account");
  response.status(302).json({ ok: true });
}

async function handleSendMagicLink(request: Request, response: Response) {
  const body = parseBody(request.body);
  const rawEmail = body["email"];
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) {
    response.status(400).json({ code: "invalid_email", error: "Enter a valid email address." });
    return;
  }
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"] || !process.env["AUTH_TOKEN_SECRET"]) {
    response.status(500).json({ code: "not_configured", error: "Login email is not configured." });
    return;
  }
  if (await tooManyAttempts(email, "magic-link", 5, 15)) {
    response.status(429).json({ code: "rate_limited", error: "Too many login emails requested. Please wait a few minutes and try again." });
    return;
  }
  await recordAttempt(email, "magic-link");
  const link = `${authBaseUrl()}/api/login?token=${encodeURIComponent(createPurposeToken(email, "login", TOKEN_TTL_SECONDS))}`;
  const transport = mailer();
  if (!transport) {
    response.status(500).json({ code: "not_configured", error: "Login email is not configured." });
    return;
  }
  try {
    await transport.sendMail({
      from: process.env["GMAIL_USER"],
      to: email,
      subject: "Your AutoVere login link",
      text: `Use this link to sign in to AutoVere. It expires in 15 minutes:\n\n${link}`,
      html: `<p>Use this link to sign in to AutoVere. It expires in 15 minutes:</p><p><a href="${escapeHtmlAttr(link)}">Sign in to AutoVere</a></p><p style="word-break:break-all;color:#666;font-size:12px">${escapeHtmlAttr(link)}</p>`,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Magic link email failed", error);
    response.status(500).json({ code: "send_failed", error: "Could not send the login email." });
  }
}

async function handlePasswordLogin(request: Request, response: Response) {
  const body = parseBody(request.body);
  const rawEmail = body["email"];
  const rawPassword = body["password"];
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    response.status(400).json({ code: "invalid_credentials", error: "Enter your email and password." });
    return;
  }
  if (await tooManyAttempts(email, "password-login", 8, 15)) {
    response.status(429).json({ code: "rate_limited", error: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }
  await recordAttempt(email, "password-login");
  const user = await getUser(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    response.status(401).json({ code: "invalid_credentials", error: "Incorrect email or password." });
    return;
  }
  await recordUser(email);
  response.setHeader("Set-Cookie", sessionCookiesFor(email));
  response.status(200).json({ ok: true, mustChangePassword: user.must_change_password });
}

async function handleForgotPassword(request: Request, response: Response) {
  const body = parseBody(request.body);
  const rawEmail = body["email"];
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const genericOk = () => response.status(200).json({ ok: true });
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) {
    response.status(400).json({ code: "invalid_email", error: "Enter a valid email address." });
    return;
  }
  if (await tooManyAttempts(email, "forgot-password", 5, 60)) {
    response.status(429).json({ code: "rate_limited", error: "Too many reset requests. Please wait a while and try again." });
    return;
  }
  await recordAttempt(email, "forgot-password");
  // Never reveal whether an account exists - the response is identical either way.
  const user = await getUser(email);
  if (!user || !user.password_hash) {
    genericOk();
    return;
  }
  const transport = mailer();
  if (!transport || !process.env["AUTH_TOKEN_SECRET"]) {
    genericOk();
    return;
  }
  const link = `${authBaseUrl()}/reset-password?token=${encodeURIComponent(createPurposeToken(email, "reset", RESET_TTL_SECONDS))}`;
  try {
    await transport.sendMail({
      from: process.env["GMAIL_USER"],
      to: email,
      subject: "Reset your AutoVere password",
      text: `Use this link to set a new AutoVere password. It expires in 30 minutes:\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>Use this link to set a new AutoVere password. It expires in 30 minutes:</p><p><a href="${escapeHtmlAttr(link)}">Reset your password</a></p><p style="word-break:break-all;color:#666;font-size:12px">${escapeHtmlAttr(link)}</p><p>If you did not request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    console.error("Password reset email failed", error);
  }
  genericOk();
}

async function handleResetPassword(request: Request, response: Response) {
  const body = parseBody(request.body);
  const rawToken = body["token"];
  const rawPassword = body["newPassword"];
  const token = typeof rawToken === "string" ? rawToken : "";
  const newPassword = typeof rawPassword === "string" ? rawPassword : "";
  let email: string | null = null;
  try {
    email = verifyPurposeToken(token, "reset");
  } catch {
    email = null;
  }
  if (!email) {
    response.status(401).json({ code: "invalid_token", error: "This password reset link is invalid or has expired." });
    return;
  }
  if (!isValidPassword(newPassword)) {
    response.status(400).json({ code: "weak_password", error: "Choose a password with at least 8 characters." });
    return;
  }
  if (await tooManyAttempts(email, "reset-password", 10, 30)) {
    response.status(429).json({ code: "rate_limited", error: "Too many attempts. Please request a new reset link." });
    return;
  }
  await recordAttempt(email, "reset-password");
  try {
    await setPassword(email, hashPassword(newPassword), false);
  } catch (error) {
    console.error("Setting new password failed", error);
    response.status(500).json({ code: "server_error", error: "Could not set your new password. Please try again." });
    return;
  }
  response.setHeader("Set-Cookie", sessionCookiesFor(email));
  response.status(200).json({ ok: true });
}

export default async function handler(request: Request, response: Response) {
  if (request.method === "GET") return handleVerify(request, response);
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const action = queryParam(request, "action");
  if (action === "forgot-password") return handleForgotPassword(request, response);
  if (action === "reset-password") return handleResetPassword(request, response);
  const body = parseBody(request.body);
  if (typeof body["password"] === "string" && body["password"]) return handlePasswordLogin(request, response);
  return handleSendMagicLink(request, response);
}
