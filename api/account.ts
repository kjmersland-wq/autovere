import type { IncomingMessage, ServerResponse } from "node:http";
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

async function handleMe(email: string, response: Response) {
  const stripe = getStripe();
  if (!stripe) {
    response.status(200).json({ email, subscription: null });
    return;
  }
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      response.status(200).json({ email, subscription: null });
      return;
    }
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 5 });
    const active = subscriptions.data.find((s) => s.status === "active" || s.status === "trialing");
    if (!active) {
      response.status(200).json({ email, subscription: null });
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
      subscription: {
        status: active.status,
        plan: plan?.label ?? price?.nickname ?? price?.id ?? "AutoVere",
        tier: plan?.tier ?? null,
        interval: price?.recurring?.interval ?? null,
        cancelAtPeriodEnd: active.cancel_at_period_end,
        renewsAt,
        paymentMethod,
        invoices,
      },
    });
  } catch (error) {
    console.error("Fetching subscription status failed", error);
    response.status(200).json({ email, subscription: null });
  }
}

const CURRENCIES = new Set(["EUR", "NOK", "SEK", "DKK", "GBP", "CHF"]);
const LOCALES = new Set(["en", "de", "nl", "no", "pl", "sv", "fr", "da"]);
const UNIT_SYSTEMS = new Set(["metric", "imperial"]);

type SettingsRow = { language: string | null; currency: string | null; units: string | null; notifications_email: boolean };

async function handleSettingsGet(email: string, response: Response) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    response.status(200).json({ settings: { language: null, currency: null, units: null, notificationsEmail: true } });
    return;
  }
  const sql = neon(databaseUrl);
  const rows = (await sql`SELECT language, currency, units, notifications_email FROM user_settings WHERE user_email = ${email}`) as SettingsRow[];
  const row = rows[0];
  response.status(200).json({
    settings: row
      ? { language: row.language, currency: row.currency, units: row.units, notificationsEmail: row.notifications_email }
      : { language: null, currency: null, units: null, notificationsEmail: true },
  });
}

async function handleSettingsPut(email: string, request: Request, response: Response) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    response.status(500).json({ error: "Settings storage is not configured." });
    return;
  }
  const body = parseBody(request.body);
  const language = typeof body["language"] === "string" && LOCALES.has(body["language"]) ? body["language"] : null;
  const currency = typeof body["currency"] === "string" && CURRENCIES.has(body["currency"]) ? body["currency"] : null;
  const units = typeof body["units"] === "string" && UNIT_SYSTEMS.has(body["units"]) ? body["units"] : null;
  const notificationsEmail = typeof body["notificationsEmail"] === "boolean" ? body["notificationsEmail"] : true;

  const sql = neon(databaseUrl);
  await sql`
    INSERT INTO user_settings (user_email, language, currency, units, notifications_email, updated_at)
    VALUES (${email}, ${language}, ${currency}, ${units}, ${notificationsEmail}, now())
    ON CONFLICT (user_email) DO UPDATE SET
      language = ${language}, currency = ${currency}, units = ${units}, notifications_email = ${notificationsEmail}, updated_at = now()
  `;
  response.status(200).json({ settings: { language, currency, units, notificationsEmail } });
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
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Content-Disposition", `attachment; filename="autovere-data-export.json"`);
  response.status(200).json(data);
}

export default async function handler(request: Request, response: Response) {
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }

  const view = queryParam(request, "view");
  const action = queryParam(request, "action");

  if (request.method === "GET" && view === "settings") return handleSettingsGet(email, response);
  if (request.method === "PUT" && view === "settings") return handleSettingsPut(email, request, response);
  if (request.method === "GET" && view === "export") return handleExport(email, response);
  if (request.method === "GET" && !view && !action) return handleMe(email, response);
  if (request.method === "POST" && action === "logout") return handleLogout(response);
  if (request.method === "POST" && action === "delete") return handleDelete(email, response);
  if (request.method === "POST" && action === "billing-portal") return handleBillingPortal(email, response);

  response.status(405).json({ error: "Method not allowed" });
}
