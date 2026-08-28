import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import Stripe from "stripe";

type Request = IncomingMessage & { url?: string; body?: unknown; query?: Record<string, string | string[]> };
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

function queryParam(request: Request, name: string): string | null {
  const raw = request.query?.[name];
  if (typeof raw === "string") return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  return url.searchParams.get(name);
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

function adminSecret(): string | null {
  return process.env["AUTH_TOKEN_SECRET"] ?? null;
}

function signAdminToken(): string | null {
  const secret = adminSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyAdminToken(token: string | null): boolean {
  const secret = adminSecret();
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

function isAdmin(request: Request): boolean {
  return verifyAdminToken(readCookie(request, "autovere_admin"));
}

type PartnerRow = {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
  website: string;
  discount_percent: number;
  discount_code: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function toPublic(row: PartnerRow) {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    logo: row.logo,
    website: row.website,
    discountPercent: row.discount_percent,
    discountCode: row.discount_code,
  };
}

function toAdmin(row: PartnerRow, referralCount: number) {
  return {
    ...toPublic(row),
    active: row.active,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    referralCount,
  };
}

function isActiveNow(row: PartnerRow): boolean {
  if (!row.active) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (row.start_date && today < row.start_date) return false;
  if (row.end_date && today > row.end_date) return false;
  return true;
}

function requireDb(): ReturnType<typeof neon> | null {
  const url = process.env["DATABASE_URL"];
  return url ? neon(url) : null;
}

const PARTNER_ID_RE = /^[A-Z0-9]{2,24}$/;
const CODE_RE = /^[A-Z0-9-]{3,32}$/;

function validatePartnerInput(body: Record<string, unknown>): { error: string } | {
  id: string; name: string; country: string | null; logo: string | null; website: string;
  discountPercent: number; discountCode: string; active: boolean; startDate: string | null; endDate: string | null; notes: string | null;
} {
  const id = typeof body["partnerId"] === "string" ? body["partnerId"].trim().toUpperCase() : "";
  const name = typeof body["name"] === "string" ? body["name"].trim() : "";
  const website = typeof body["website"] === "string" ? body["website"].trim() : "";
  const discountPercent = Number(body["discountPercent"]);
  const discountCode = typeof body["discountCode"] === "string" ? body["discountCode"].trim().toUpperCase() : "";

  if (!PARTNER_ID_RE.test(id)) return { error: "Partner ID must be 2-24 uppercase letters/numbers." };
  if (!name) return { error: "Organisation name is required." };
  if (!/^https?:\/\/.+/.test(website)) return { error: "Official website must be a valid URL." };
  if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 100) return { error: "Discount percent must be an integer between 1 and 100." };
  if (!CODE_RE.test(discountCode)) return { error: "Member discount code must be 3-32 uppercase letters/numbers/hyphens." };

  return {
    id,
    name,
    country: typeof body["country"] === "string" && body["country"].trim() ? body["country"].trim() : null,
    logo: typeof body["logo"] === "string" && body["logo"].trim() ? body["logo"].trim() : null,
    website,
    discountPercent,
    discountCode,
    active: typeof body["active"] === "boolean" ? body["active"] : true,
    startDate: typeof body["startDate"] === "string" && body["startDate"] ? body["startDate"] : null,
    endDate: typeof body["endDate"] === "string" && body["endDate"] ? body["endDate"] : null,
    notes: typeof body["notes"] === "string" && body["notes"].trim() ? body["notes"].trim() : null,
  };
}

async function handleAdminLogin(request: Request, response: Response) {
  const secret = process.env["ADMIN_SECRET"];
  if (!secret) {
    response.status(500).json({ error: "Admin access is not configured." });
    return;
  }
  const body = parseBody(request.body);
  const provided = typeof body["secret"] === "string" ? body["secret"] : "";
  const expected = Buffer.from(secret);
  const actual = Buffer.from(provided);
  const matches = expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!matches) {
    response.status(401).json({ error: "Incorrect admin key." });
    return;
  }
  const token = signAdminToken();
  if (!token) {
    response.status(500).json({ error: "Admin access is not configured." });
    return;
  }
  response.setHeader("Set-Cookie", `autovere_admin=${token}; Path=/; Max-Age=1209600; HttpOnly; Secure; SameSite=Lax`);
  response.status(200).json({ ok: true });
}

async function handleAdminLogout(response: Response) {
  response.setHeader("Set-Cookie", "autovere_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  response.status(200).json({ ok: true });
}

async function handlePublicList(response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(200).json({ partners: [] });
    return;
  }
  const rows = (await sql`SELECT * FROM partners WHERE active = true ORDER BY created_at ASC`) as PartnerRow[];
  response.status(200).json({ partners: rows.filter(isActiveNow).map(toPublic) });
}

async function handlePublicOne(id: string, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(404).json({ error: "Partner not found." });
    return;
  }
  const rows = (await sql`SELECT * FROM partners WHERE id = ${id}`) as PartnerRow[];
  const row = rows[0];
  if (!row || !isActiveNow(row)) {
    response.status(404).json({ error: "Partner not found." });
    return;
  }
  response.status(200).json({ partner: toPublic(row) });
}

async function handlePublicByCode(code: string, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(404).json({ error: "Member code not recognised." });
    return;
  }
  const rows = (await sql`SELECT * FROM partners WHERE discount_code = ${code}`) as PartnerRow[];
  const row = rows[0];
  if (!row || !isActiveNow(row)) {
    response.status(404).json({ error: "Member code not recognised." });
    return;
  }
  response.status(200).json({ partner: toPublic(row) });
}

async function handleAdminList(response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(200).json({ partners: [] });
    return;
  }
  const rows = (await sql`SELECT * FROM partners ORDER BY created_at DESC`) as PartnerRow[];
  const counts = (await sql`SELECT partner_id, COUNT(*)::int AS count FROM partner_referrals GROUP BY partner_id`) as { partner_id: string; count: number }[];
  const countByPartner = new Map(counts.map((c) => [c.partner_id, c.count]));
  response.status(200).json({ partners: rows.map((row) => toAdmin(row, countByPartner.get(row.id) ?? 0)) });
  return;
}

function getStripe(): Stripe | null {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

const planTierByEnv: Record<string, "pro" | "business"> = {
  STRIPE_PRO_MONTHLY_PRICE_ID: "pro",
  STRIPE_PRO_YEARLY_PRICE_ID: "pro",
  STRIPE_BUSINESS_MONTHLY_PRICE_ID: "business",
  STRIPE_BUSINESS_YEARLY_PRICE_ID: "business",
};

function tierForPriceId(priceId: string | undefined): "pro" | "business" | null {
  if (!priceId) return null;
  for (const [envName, tier] of Object.entries(planTierByEnv)) {
    if (process.env[envName] === priceId) return tier;
  }
  return null;
}

async function handleMetrics(response: Response) {
  const sql = requireDb();

  let totalUsers = 0;
  let newUsers30d = 0;
  let weeklySignups: { week: string; count: number }[] = [];
  if (sql) {
    try {
      const totalRows = (await sql`SELECT COUNT(*)::int AS count FROM users`) as { count: number }[];
      totalUsers = totalRows[0]?.count ?? 0;
      const newRows = (await sql`SELECT COUNT(*)::int AS count FROM users WHERE first_seen_at > now() - interval '30 days'`) as { count: number }[];
      newUsers30d = newRows[0]?.count ?? 0;
      const weekRows = (await sql`
        SELECT to_char(date_trunc('week', first_seen_at), 'YYYY-MM-DD') AS week, COUNT(*)::int AS count
        FROM users GROUP BY 1 ORDER BY 1 DESC LIMIT 8
      `) as { week: string; count: number }[];
      weeklySignups = weekRows.reverse();
    } catch (error) {
      console.error("Fetching user metrics failed", error);
    }
  }

  let proCount = 0;
  let businessCount = 0;
  let mrrEur = 0;
  let recentPaidInvoicesEur = 0;
  const stripe = getStripe();
  if (stripe) {
    try {
      const subscriptions: Stripe.Subscription[] = [];
      let startingAfter: string | undefined;
      for (let page = 0; page < 5; page++) {
        const result: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({ status: "active", limit: 100, ...(startingAfter ? { starting_after: startingAfter } : {}) });
        subscriptions.push(...result.data);
        if (!result.has_more) break;
        startingAfter = result.data[result.data.length - 1]?.id;
      }
      for (const subscription of subscriptions) {
        const price = subscription.items.data[0]?.price;
        const tier = tierForPriceId(price?.id);
        if (tier === "pro") proCount++;
        else if (tier === "business") businessCount++;
        const amount = price?.unit_amount ?? 0;
        const monthly = price?.recurring?.interval === "year" ? amount / 12 : amount;
        mrrEur += monthly / 100;
      }
    } catch (error) {
      console.error("Fetching Stripe subscriptions for metrics failed", error);
    }
    try {
      const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
      const invoices = await stripe.invoices.list({ status: "paid", limit: 100, created: { gte: since } });
      recentPaidInvoicesEur = invoices.data.reduce((sum, invoice) => sum + invoice.amount_paid / 100, 0);
    } catch (error) {
      console.error("Fetching Stripe invoices for metrics failed", error);
    }
  }
  const activeSubscriptions = proCount + businessCount;
  const freeCount = Math.max(totalUsers - activeSubscriptions, 0);

  type PartnerStat = { id: string; name: string; country: string | null; active: boolean; memberCount: number; referralCount: number };
  let partnerStats: PartnerStat[] = [];
  if (sql) {
    try {
      const rows = (await sql`
        SELECT p.id, p.name, p.country, p.active,
          COALESCE(m.member_count, 0)::int AS member_count,
          COALESCE(r.referral_count, 0)::int AS referral_count
        FROM partners p
        LEFT JOIN (SELECT partner_id, COUNT(*) AS member_count FROM partner_memberships GROUP BY partner_id) m ON m.partner_id = p.id
        LEFT JOIN (SELECT partner_id, COUNT(*) AS referral_count FROM partner_referrals GROUP BY partner_id) r ON r.partner_id = p.id
        ORDER BY member_count DESC
      `) as { id: string; name: string; country: string | null; active: boolean; member_count: number; referral_count: number }[];
      partnerStats = rows.map((row) => ({ id: row.id, name: row.name, country: row.country, active: row.active, memberCount: row.member_count, referralCount: row.referral_count }));
    } catch (error) {
      console.error("Fetching partner metrics failed", error);
    }
  }
  const totalMembers = partnerStats.reduce((sum, partner) => sum + partner.memberCount, 0);
  const totalReferrals = partnerStats.reduce((sum, partner) => sum + partner.referralCount, 0);

  response.status(200).json({
    users: { total: totalUsers, newLast30Days: newUsers30d, weeklySignups },
    subscriptions: { free: freeCount, pro: proCount, business: businessCount, activeTotal: activeSubscriptions },
    revenue: { mrrEur: Math.round(mrrEur), recentPaidInvoicesEur: Math.round(recentPaidInvoicesEur), recentPaidInvoicesWindowDays: 30 },
    partners: partnerStats,
    discountUsage: { totalMembers, totalReferrals },
  });
}

async function handleCreate(request: Request, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(500).json({ error: "Partner storage is not configured." });
    return;
  }
  const parsed = validatePartnerInput(parseBody(request.body));
  if ("error" in parsed) {
    response.status(400).json({ error: parsed.error });
    return;
  }
  try {
    await sql`
      INSERT INTO partners (id, name, country, logo, website, discount_percent, discount_code, active, start_date, end_date, notes)
      VALUES (${parsed.id}, ${parsed.name}, ${parsed.country}, ${parsed.logo}, ${parsed.website}, ${parsed.discountPercent}, ${parsed.discountCode}, ${parsed.active}, ${parsed.startDate}, ${parsed.endDate}, ${parsed.notes})
    `;
    response.status(201).json({ ok: true });
  } catch (error) {
    console.error("Creating partner failed", error);
    response.status(409).json({ error: "A partner with this ID or discount code already exists." });
  }
}

async function handleUpdate(id: string, request: Request, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(500).json({ error: "Partner storage is not configured." });
    return;
  }
  const body = parseBody(request.body);
  const merged = { partnerId: id, ...body };
  const parsed = validatePartnerInput(merged);
  if ("error" in parsed) {
    response.status(400).json({ error: parsed.error });
    return;
  }
  try {
    const existing = (await sql`SELECT id FROM partners WHERE id = ${id}`) as { id: string }[];
    if (existing.length === 0) {
      response.status(404).json({ error: "Partner not found." });
      return;
    }
    await sql`
      UPDATE partners SET
        name = ${parsed.name}, country = ${parsed.country}, logo = ${parsed.logo}, website = ${parsed.website},
        discount_percent = ${parsed.discountPercent}, discount_code = ${parsed.discountCode}, active = ${parsed.active},
        start_date = ${parsed.startDate}, end_date = ${parsed.endDate}, notes = ${parsed.notes}, updated_at = now()
      WHERE id = ${id}
    `;
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Updating partner failed", error);
    response.status(409).json({ error: "This discount code is already used by another partner." });
  }
}

export default async function handler(request: Request, response: Response) {
  const action = queryParam(request, "action");
  const id = queryParam(request, "id");
  const code = queryParam(request, "code");
  const admin = queryParam(request, "admin");

  if (request.method === "POST" && action === "admin-login") return handleAdminLogin(request, response);
  if (request.method === "POST" && action === "admin-logout") return handleAdminLogout(response);

  if (request.method === "GET" && admin) {
    if (!isAdmin(request)) {
      response.status(401).json({ error: "Not authenticated." });
      return;
    }
    if (queryParam(request, "view") === "metrics") return handleMetrics(response);
    return handleAdminList(response);
  }

  if (request.method === "GET" && code) return handlePublicByCode(code.toUpperCase(), response);
  if (request.method === "GET" && id) return handlePublicOne(id.toUpperCase(), response);
  if (request.method === "GET" && !id && !admin) return handlePublicList(response);

  if (request.method === "POST" && !action) {
    if (!isAdmin(request)) {
      response.status(401).json({ error: "Not authenticated." });
      return;
    }
    return handleCreate(request, response);
  }

  if (request.method === "PATCH" && id) {
    if (!isAdmin(request)) {
      response.status(401).json({ error: "Not authenticated." });
      return;
    }
    return handleUpdate(id.toUpperCase(), request, response);
  }

  response.status(405).json({ error: "Method not allowed" });
}
