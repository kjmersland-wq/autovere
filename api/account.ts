import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "node:crypto";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };
type Response = ServerResponse & {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => Response;
};

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (body as Record<string, unknown>) ?? {};
}

function verifySessionToken(token: string): string | null {
  const secret = process.env["AUTH_TOKEN_SECRET"];
  if (!secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown; exp?: unknown };
    return typeof value.email === "string" && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000) ? value.email : null;
  } catch {
    return null;
  }
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

function verifyAdminCookie(request: Request): boolean {
  const secret = process.env["AUTH_TOKEN_SECRET"];
  const token = readCookie(request, "autovere_admin");
  if (!secret || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { admin?: unknown; exp?: unknown };
    return value.admin === true && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function isAdminUser(request: Request, email: string): boolean {
  const adminEmail = process.env["ADMIN_EMAIL"];
  if (!adminEmail) return false;
  // Both the claimed email AND the independently signed admin cookie must check out —
  // the plain session cookie alone is not trusted for something as sensitive as free Pro access.
  return email.toLowerCase() === adminEmail.trim().toLowerCase() && verifyAdminCookie(request);
}

function queryParam(request: Request, name: string): string | null {
  const raw = request.query?.[name];
  if (typeof raw === "string") return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  return url.searchParams.get(name);
}

function getStripe(): Stripe | null {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

function siteUrl(): string {
  const raw = (process.env["AUTH_BASE_URL"] || process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").trim();
  const embedded = raw.match(/https?:\/\/[^\s\])'"]+/);
  const configured = (embedded ? embedded[0] : raw.replace(/^['"]|['"]$/g, "").trim()).replace(/\/$/, "");
  return /^https?:\/\//.test(configured) ? configured : `https://${configured}`;
}

const planByEnv: Record<string, { label: string; tier: "pro" | "business" }> = {
  STRIPE_PRO_MONTHLY_PRICE_ID: { label: "AutoVere Pro", tier: "pro" },
  STRIPE_PRO_YEARLY_PRICE_ID: { label: "AutoVere Pro", tier: "pro" },
  STRIPE_BUSINESS_MONTHLY_PRICE_ID: { label: "AutoVere Business", tier: "business" },
  STRIPE_BUSINESS_YEARLY_PRICE_ID: { label: "AutoVere Business", tier: "business" },
};

function planForPriceId(priceId: string | undefined): { label: string; tier: "pro" | "business" } | null {
  if (!priceId) return null;
  for (const [envName, plan] of Object.entries(planByEnv)) {
    if (process.env[envName] === priceId) return plan;
  }
  return null;
}

type MembershipRow = { partner_id: string; discount_percent: number; valid_until: string; name: string; logo: string | null; website: string };

async function getMembership(email: string): Promise<{ partnerId: string; partnerName: string; partnerLogo: string | null; partnerWebsite: string; discountPercent: number; validUntil: string; status: "active" | "expired" } | null> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return null;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT m.partner_id, m.discount_percent, m.valid_until, p.name, p.logo, p.website
      FROM partner_memberships m JOIN partners p ON p.id = m.partner_id
      WHERE m.user_email = ${email}
    `) as MembershipRow[];
    const row = rows[0];
    if (!row) return null;
    const today = new Date().toISOString().slice(0, 10);
    return {
      partnerId: row.partner_id,
      partnerName: row.name,
      partnerLogo: row.logo,
      partnerWebsite: row.website,
      discountPercent: row.discount_percent,
      validUntil: row.valid_until,
      status: today <= row.valid_until ? "active" : "expired",
    };
  } catch (error) {
    console.error("Fetching partner membership failed", error);
    return null;
  }
}

async function getAuthInfo(email: string): Promise<{ hasPassword: boolean; mustChangePassword: boolean }> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return { hasPassword: false, mustChangePassword: false };
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`SELECT password_hash, must_change_password FROM users WHERE email = ${email}`) as { password_hash: string | null; must_change_password: boolean }[];
    const row = rows[0];
    return { hasPassword: !!row?.password_hash, mustChangePassword: row?.must_change_password ?? false };
  } catch (error) {
    console.error("Fetching auth info failed", error);
    return { hasPassword: false, mustChangePassword: false };
  }
}

async function handleMe(email: string, request: Request, response: Response) {
  // Same double-verified check used to grant free admin Pro access below — reused here as the
  // sole source of truth for whether the client is told an "Admin" link should be shown at all.
  const isAdmin = isAdminUser(request, email);
  if (isAdmin) {
    // Free, permanent Pro access for the AutoVere admin account only — no Stripe customer or
    // subscription is created or touched, so this can never affect real billing or other users.
    const authInfo = await getAuthInfo(email);
    response.status(200).json({
      email,
      isAdmin: true,
      hasPassword: authInfo.hasPassword,
      mustChangePassword: authInfo.mustChangePassword,
      subscription: {
        status: "active",
        plan: "AutoVere Pro — Admin",
        tier: "pro",
        interval: null,
        cancelAtPeriodEnd: false,
        renewsAt: null,
        paymentMethod: null,
        invoices: [],
        manageable: false,
      },
      membership: null,
    });
    return;
  }
  const membership = await getMembership(email);
  const authInfo = await getAuthInfo(email);
  const stripe = getStripe();
  if (!stripe) {
    response.status(200).json({ email, isAdmin, hasPassword: authInfo.hasPassword, mustChangePassword: authInfo.mustChangePassword, subscription: null, membership });
    return;
  }
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      response.status(200).json({ email, isAdmin, hasPassword: authInfo.hasPassword, mustChangePassword: authInfo.mustChangePassword, subscription: null, membership });
      return;
    }
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 5 });
    const active = subscriptions.data.find((s) => s.status === "active" || s.status === "trialing");
    if (!active) {
      response.status(200).json({ email, isAdmin, hasPassword: authInfo.hasPassword, mustChangePassword: authInfo.mustChangePassword, subscription: null, membership });
      return;
    }
    const price = active.items.data[0]?.price;
    const plan = planForPriceId(price?.id);
    const periodEndRaw = (active as unknown as { current_period_end?: number }).current_period_end ?? active.items.data[0]?.current_period_end ?? null;
    const renewsAt = periodEndRaw ? new Date(periodEndRaw * 1000).toISOString() : null;

    let paymentMethod: { brand: string; last4: string } | null = null;
    const defaultPm = !("deleted" in customer) ? customer.invoice_settings?.default_payment_method : undefined;
    const pmId = typeof defaultPm === "string" ? defaultPm : active.default_payment_method;
    if (typeof pmId === "string") {
      try {
        const pm = await stripe.paymentMethods.retrieve(pmId);
        if (pm.card) paymentMethod = { brand: pm.card.brand, last4: pm.card.last4 };
      } catch {
        paymentMethod = null;
      }
    }

    let invoices: { id: string; amount: number; currency: string; date: string; url: string | null; pdfUrl: string | null }[] = [];
    try {
      const invoiceList = await stripe.invoices.list({ customer: customer.id, limit: 5 });
      invoices = invoiceList.data.map((invoice) => ({
        id: invoice.id ?? invoice.number ?? "",
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        date: new Date(invoice.created * 1000).toISOString(),
        url: invoice.hosted_invoice_url ?? null,
        pdfUrl: invoice.invoice_pdf ?? null,
      }));
    } catch {
      invoices = [];
    }

    response.status(200).json({
      email,
      isAdmin,
      hasPassword: authInfo.hasPassword,
      mustChangePassword: authInfo.mustChangePassword,
      subscription: {
        status: active.status,
        plan: plan?.label ?? price?.nickname ?? price?.id ?? "AutoVere",
        tier: plan?.tier ?? null,
        interval: price?.recurring?.interval ?? null,
        cancelAtPeriodEnd: active.cancel_at_period_end,
        renewsAt,
        paymentMethod,
        invoices,
        manageable: true,
      },
      membership,
    });
  } catch (error) {
    console.error("Fetching subscription status failed", error);
    response.status(200).json({ email, isAdmin, hasPassword: authInfo.hasPassword, mustChangePassword: authInfo.mustChangePassword, subscription: null, membership });
  }
}

const CURRENCIES = new Set(["EUR", "NOK", "SEK", "DKK", "GBP", "CHF"]);
const LOCALES = new Set(["en", "de", "nl", "no", "pl", "sv", "fr", "da"]);
const UNIT_SYSTEMS = new Set(["metric", "imperial"]);

type SettingsRow = { language: string | null; currency: string | null; units: string | null; notifications_email: boolean; display_name: string | null };

async function handleSettingsGet(email: string, response: Response) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    response.status(200).json({ settings: { language: null, currency: null, units: null, notificationsEmail: true, displayName: null } });
    return;
  }
  const sql = neon(databaseUrl);
  const rows = (await sql`SELECT language, currency, units, notifications_email, display_name FROM user_settings WHERE user_email = ${email}`) as SettingsRow[];
  const row = rows[0];
  response.status(200).json({
    settings: row
      ? { language: row.language, currency: row.currency, units: row.units, notificationsEmail: row.notifications_email, displayName: row.display_name }
      : { language: null, currency: null, units: null, notificationsEmail: true, displayName: null },
  });
}

async function handleSettingsPut(email: string, request: Request, response: Response) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    response.status(500).json({ error: "Settings storage is not configured." });
    return;
  }
  const sql = neon(databaseUrl);
  const body = parseBody(request.body);
  // Only the fields actually present in the request are changed — a partial save (e.g. just the
  // display name from the Profile tab) must never silently reset the other saved preferences.
  const existingRows = (await sql`SELECT language, currency, units, notifications_email, display_name FROM user_settings WHERE user_email = ${email}`) as SettingsRow[];
  const existing = existingRows[0];

  const language = "language" in body ? (typeof body["language"] === "string" && LOCALES.has(body["language"]) ? body["language"] : null) : (existing?.language ?? null);
  const currency = "currency" in body ? (typeof body["currency"] === "string" && CURRENCIES.has(body["currency"]) ? body["currency"] : null) : (existing?.currency ?? null);
  const units = "units" in body ? (typeof body["units"] === "string" && UNIT_SYSTEMS.has(body["units"]) ? body["units"] : null) : (existing?.units ?? null);
  const notificationsEmail = "notificationsEmail" in body ? (typeof body["notificationsEmail"] === "boolean" ? body["notificationsEmail"] : true) : (existing?.notifications_email ?? true);
  const displayName = "displayName" in body ? (typeof body["displayName"] === "string" ? body["displayName"].trim().slice(0, 80) || null : null) : (existing?.display_name ?? null);

  await sql`
    INSERT INTO user_settings (user_email, language, currency, units, notifications_email, display_name, updated_at)
    VALUES (${email}, ${language}, ${currency}, ${units}, ${notificationsEmail}, ${displayName}, now())
    ON CONFLICT (user_email) DO UPDATE SET
      language = ${language}, currency = ${currency}, units = ${units}, notifications_email = ${notificationsEmail}, display_name = ${displayName}, updated_at = now()
  `;
  response.status(200).json({ settings: { language, currency, units, notificationsEmail, displayName } });
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

async function handleChangePassword(email: string, request: Request, response: Response) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    response.status(500).json({ code: "not_configured", error: "Password storage is not configured." });
    return;
  }
  const body = parseBody(request.body);
  const currentPassword = typeof body["currentPassword"] === "string" ? body["currentPassword"] : "";
  const newPassword = typeof body["newPassword"] === "string" ? body["newPassword"] : "";
  if (newPassword.length < 8 || newPassword.length > 200) {
    response.status(400).json({ code: "weak_password", error: "Choose a password with at least 8 characters." });
    return;
  }
  if (await tooManyAttempts(email, "change-password", 8, 15)) {
    response.status(429).json({ code: "rate_limited", error: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }
  await recordAttempt(email, "change-password");
  const sql = neon(databaseUrl);
  const rows = (await sql`SELECT password_hash FROM users WHERE email = ${email}`) as { password_hash: string | null }[];
  const existingHash = rows[0]?.password_hash ?? null;
  // A user who already has a password must confirm it before changing it (defense in depth
  // against a hijacked session cookie); a user with no password yet (magic-link only) is
  // setting one for the first time and has nothing to confirm.
  if (existingHash && !verifyPassword(currentPassword, existingHash)) {
    response.status(401).json({ code: "invalid_credentials", error: "Your current password is incorrect." });
    return;
  }
  const newHash = hashPassword(newPassword);
  await sql`
    INSERT INTO users (email, first_seen_at, last_seen_at, password_hash, must_change_password)
    VALUES (${email}, now(), now(), ${newHash}, false)
    ON CONFLICT (email) DO UPDATE SET password_hash = ${newHash}, must_change_password = false
  `;
  response.status(200).json({ ok: true });
}

async function handleLogout(response: Response) {
  response.setHeader("Set-Cookie", "autovere_user=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  response.status(200).json({ ok: true });
}

async function handleDelete(email: string, response: Response) {
  const secret = process.env["STRIPE_SECRET_KEY"];
  if (secret) {
    try {
      const stripe = new Stripe(secret);
      const customers = await stripe.customers.list({ email, limit: 1 });
      const customer = customers.data[0];
      if (customer) {
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
        for (const subscription of subscriptions.data) {
          if (subscription.status === "active" || subscription.status === "trialing") {
            await stripe.subscriptions.cancel(subscription.id);
          }
        }
      }
    } catch (error) {
      console.error("Cancelling subscription during account deletion failed", error);
      response.status(500).json({ error: "Could not cancel your subscription. Please contact support." });
      return;
    }
  }
  const databaseUrl = process.env["DATABASE_URL"];
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl);
      await sql`DELETE FROM trips WHERE user_email = ${email}`;
      await sql`DELETE FROM vehicles WHERE user_email = ${email}`;
      await sql`DELETE FROM saved_places WHERE user_email = ${email}`;
      await sql`DELETE FROM user_settings WHERE user_email = ${email}`;
    } catch (error) {
      console.error("Deleting account data during account deletion failed", error);
    }
  }
  response.setHeader("Set-Cookie", "autovere_user=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  response.status(200).json({ ok: true });
}

async function handleBillingPortal(email: string, response: Response) {
  const secret = process.env["STRIPE_SECRET_KEY"];
  if (!secret) {
    response.status(500).json({ error: "Billing is not configured." });
    return;
  }
  const stripe = new Stripe(secret);
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      response.status(404).json({ error: "No billing account found for this email." });
      return;
    }
    const session = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: `${siteUrl()}/account` });
    response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Creating billing portal session failed", error);
    response.status(500).json({ error: "Could not open billing management right now." });
  }
}

async function handleExport(email: string, response: Response) {
  const data: Record<string, unknown> = { email, exportedAt: new Date().toISOString() };
  const secret = process.env["STRIPE_SECRET_KEY"];
  if (secret) {
    try {
      const stripe = new Stripe(secret);
      const customers = await stripe.customers.list({ email, limit: 1 });
      const customer = customers.data[0];
      if (customer) {
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 20 });
        const invoices = await stripe.invoices.list({ customer: customer.id, limit: 100 });
        data["stripeCustomerId"] = customer.id;
        data["subscriptions"] = subscriptions.data.map((s) => ({ id: s.id, status: s.status, cancelAtPeriodEnd: s.cancel_at_period_end }));
        data["invoices"] = invoices.data.map((invoice) => ({ id: invoice.id, amount: invoice.amount_paid / 100, currency: invoice.currency.toUpperCase(), created: new Date(invoice.created * 1000).toISOString() }));
      }
    } catch (error) {
      console.error("Fetching Stripe data for export failed", error);
    }
  }
  const databaseUrl = process.env["DATABASE_URL"];
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl);
      data["trips"] = await sql`SELECT id, name, from_place, to_place, vehicle_type, currency, days, estimate, created_at, updated_at FROM trips WHERE user_email = ${email}`;
      data["vehicles"] = await sql`SELECT id, name, vehicle_type, consumption, range_km, is_default, created_at FROM vehicles WHERE user_email = ${email}`;
      data["savedPlaces"] = await sql`SELECT id, name, category, lat, lon, notes, created_at FROM saved_places WHERE user_email = ${email}`;
      const settingsRows = await sql`SELECT language, currency, units, notifications_email FROM user_settings WHERE user_email = ${email}`;
      data["settings"] = settingsRows[0] ?? null;
    } catch (error) {
      console.error("Fetching account data for export failed", error);
    }
  }
  data["partnerMembership"] = await getMembership(email);
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Content-Disposition", `attachment; filename="autovere-data-export.json"`);
  response.status(200).json(data);
}

export default async function handler(request: Request, response: Response) {
  const sessionToken = readCookie(request, "autovere_user");
  const email = sessionToken ? verifySessionToken(sessionToken) : null;
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }

  const view = queryParam(request, "view");
  const action = queryParam(request, "action");

  if (request.method === "GET" && view === "settings") return handleSettingsGet(email, response);
  if (request.method === "PUT" && view === "settings") return handleSettingsPut(email, request, response);
  if (request.method === "GET" && view === "export") return handleExport(email, response);
  if (request.method === "GET" && !view && !action) return handleMe(email, request, response);
  if (request.method === "POST" && action === "logout") return handleLogout(response);
  if (request.method === "POST" && action === "delete") return handleDelete(email, response);
  if (request.method === "POST" && action === "billing-portal") return handleBillingPortal(email, response);
  if (request.method === "POST" && action === "change-password") return handleChangePassword(email, request, response);

  response.status(405).json({ error: "Method not allowed" });
}
