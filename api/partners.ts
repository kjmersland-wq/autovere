import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import type { Locale } from "../src/lib/i18n";

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

type PartnerType = "member_organisation" | "car_dealer" | "motorhome_dealer";
const PARTNER_TYPES: PartnerType[] = ["member_organisation", "car_dealer", "motorhome_dealer"];

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
  type: PartnerType;
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
    type: row.type,
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

// Hyphens are intentionally allowed (matches CODE_RE and every documented example ID, e.g.
// "NORDIC-CAMP-NO") — auto-generated IDs from an organisation name are hyphenated slugs.
const PARTNER_ID_RE = /^[A-Z0-9-]{2,24}$/;
const CODE_RE = /^[A-Z0-9-]{3,32}$/;
const APPLICATION_LOCALES: Locale[] = ["en", "de", "nl", "no", "pl", "sv", "fr", "da"];

// Ambiguous characters (0/O, 1/I) excluded so a printed/typed code can't be misread.
const SUFFIX_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomSuffix(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += SUFFIX_ALPHABET[bytes[i]! % SUFFIX_ALPHABET.length];
  return out;
}

// Derives a partner ID from the organisation name rather than any internal identifier (row
// number, Stripe customer ID, etc.) — the code itself must never expose internal state.
function generatePartnerId(organisationName: string): string {
  const slug = organisationName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18);
  const base = slug || "PARTNER";
  return `${base}-${randomSuffix(4)}`;
}

function validatePartnerInput(body: Record<string, unknown>): { error: string } | {
  id: string; name: string; country: string | null; logo: string | null; website: string;
  discountPercent: number; discountCode: string; active: boolean; startDate: string | null; endDate: string | null; notes: string | null; type: PartnerType;
} {
  const id = typeof body["partnerId"] === "string" ? body["partnerId"].trim().toUpperCase() : "";
  const name = typeof body["name"] === "string" ? body["name"].trim() : "";
  const website = typeof body["website"] === "string" ? body["website"].trim() : "";
  const discountPercent = Number(body["discountPercent"]);
  const type: PartnerType = typeof body["type"] === "string" && PARTNER_TYPES.includes(body["type"] as PartnerType) ? (body["type"] as PartnerType) : "member_organisation";
  // Dealer partners are reached via their partner-ID link, so a manual discount code is
  // optional for them — default it to the partner ID rather than requiring admin input.
  const rawCode = typeof body["discountCode"] === "string" ? body["discountCode"].trim().toUpperCase() : "";
  const discountCode = rawCode || (type !== "member_organisation" ? id : "");

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
    type,
  };
}

type ApplicationStatus = "pending" | "approved" | "rejected";

type PartnerApplicationRow = {
  id: string;
  type: PartnerType;
  organisation_name: string;
  country: string | null;
  website: string;
  contact_name: string;
  contact_email: string;
  message: string | null;
  locale: Locale;
  status: ApplicationStatus;
  partner_id: string | null;
  reviewed_at: string | null;
  created_at: string;
};

function toApplicationPublic(row: PartnerApplicationRow) {
  return {
    id: row.id,
    type: row.type,
    organisationName: row.organisation_name,
    country: row.country,
    website: row.website,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    message: row.message,
    locale: row.locale,
    status: row.status,
    partnerId: row.partner_id,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function validateApplicationInput(body: Record<string, unknown>): { error: string } | {
  organisationName: string; country: string | null; website: string; contactName: string;
  contactEmail: string; message: string | null; locale: Locale; type: PartnerType;
} {
  const organisationName = typeof body["organisationName"] === "string" ? body["organisationName"].trim() : "";
  const website = typeof body["website"] === "string" ? body["website"].trim() : "";
  const contactName = typeof body["contactName"] === "string" ? body["contactName"].trim() : "";
  const contactEmail = typeof body["contactEmail"] === "string" ? body["contactEmail"].trim().toLowerCase() : "";
  const message = typeof body["message"] === "string" ? body["message"].trim() : "";
  const locale: Locale = typeof body["locale"] === "string" && APPLICATION_LOCALES.includes(body["locale"] as Locale) ? (body["locale"] as Locale) : "en";
  const type: PartnerType = typeof body["type"] === "string" && PARTNER_TYPES.includes(body["type"] as PartnerType) ? (body["type"] as PartnerType) : "member_organisation";

  if (!organisationName || organisationName.length > 160) return { error: "Organisation name is required." };
  if (!/^https?:\/\/.+/.test(website)) return { error: "Official website must be a valid URL." };
  if (!contactName || contactName.length > 160) return { error: "Contact name is required." };
  if (!EMAIL_RE.test(contactEmail) || contactEmail.length > 320) return { error: "Enter a valid contact email address." };
  if (message.length > 2000) return { error: "Message is too long." };

  return {
    organisationName,
    country: typeof body["country"] === "string" && body["country"].trim() ? body["country"].trim() : null,
    website,
    contactName,
    contactEmail,
    message: message || null,
    locale,
    type,
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
  // The public directory on /partners is the organisation-partner recruitment page —
  // dealer partners are only ever reached via their private partner-ID link, never listed here.
  const rows = (await sql`SELECT * FROM partners WHERE active = true AND type = 'member_organisation' ORDER BY created_at ASC`) as PartnerRow[];
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

type ParsedPartner = Exclude<ReturnType<typeof validatePartnerInput>, { error: string }>;

async function insertPartner(sql: ReturnType<typeof neon>, parsed: ParsedPartner) {
  await sql`
    INSERT INTO partners (id, name, country, logo, website, discount_percent, discount_code, active, start_date, end_date, notes, type)
    VALUES (${parsed.id}, ${parsed.name}, ${parsed.country}, ${parsed.logo}, ${parsed.website}, ${parsed.discountPercent}, ${parsed.discountCode}, ${parsed.active}, ${parsed.startDate}, ${parsed.endDate}, ${parsed.notes}, ${parsed.type})
  `;
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
    await insertPartner(sql, parsed);
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
        start_date = ${parsed.startDate}, end_date = ${parsed.endDate}, notes = ${parsed.notes}, type = ${parsed.type}, updated_at = now()
      WHERE id = ${id}
    `;
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Updating partner failed", error);
    response.status(409).json({ error: "This discount code is already used by another partner." });
  }
}

async function handleApplicationSubmit(request: Request, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(500).json({ error: "Application storage is not configured." });
    return;
  }
  const parsed = validateApplicationInput(parseBody(request.body));
  if ("error" in parsed) {
    response.status(400).json({ error: parsed.error });
    return;
  }
  try {
    const id = randomBytes(12).toString("hex");
    await sql`
      INSERT INTO partner_applications (id, type, organisation_name, country, website, contact_name, contact_email, message, locale)
      VALUES (${id}, ${parsed.type}, ${parsed.organisationName}, ${parsed.country}, ${parsed.website}, ${parsed.contactName}, ${parsed.contactEmail}, ${parsed.message}, ${parsed.locale})
    `;
    response.status(201).json({ ok: true });
  } catch (error) {
    console.error("Storing partner application failed", error);
    response.status(500).json({ error: "Could not submit your application right now." });
  }
}

async function handleApplicationsList(response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(200).json({ applications: [] });
    return;
  }
  const rows = (await sql`SELECT * FROM partner_applications ORDER BY created_at DESC`) as PartnerApplicationRow[];
  response.status(200).json({ applications: rows.map(toApplicationPublic) });
}

// Inlined rather than imported from src/lib — this file must stay a single self-contained
// module (matching every other api/*.ts file here), since a fresh cross-file relative import
// from api/ has been observed to fail to bundle on Vercel even though api/login.ts's
// pre-existing import of src/lib/auth works fine (likely a stale function-trace cache).
type PartnerEmailCopy = {
  subject: (organisationName: string) => string;
  heading: string;
  intro: (organisationName: string) => string;
  codeLabel: string;
  discountLabel: string;
  linkLabel: string;
  instructions: string;
  footerLink: string;
  supportLine: string;
};

const partnerEmailCopy: Record<Locale, PartnerEmailCopy> = {
  en: {
    subject: (org) => `AutoVere Partner Program — ${org} is approved!`,
    heading: "Welcome to the AutoVere Partner Program!",
    intro: (org) => `We're delighted to confirm that ${org} is now an official AutoVere partner.`,
    codeLabel: "Your partner code",
    discountLabel: "Member discount",
    linkLabel: "Your partner link",
    instructions: "Share your partner link or code with your members. Anyone who signs up for AutoVere Pro through the link, or enters the code at checkout, automatically gets the discount above — there's nothing for you to set up.",
    footerLink: "Visit AutoVere",
    supportLine: "Questions? Just reply to this email, or reach us at contact@autovere.com.",
  },
  de: {
    subject: (org) => `AutoVere Partnerprogramm — ${org} ist freigeschaltet!`,
    heading: "Willkommen im AutoVere Partnerprogramm!",
    intro: (org) => `Wir freuen uns, dir zu bestätigen, dass ${org} jetzt offizieller AutoVere-Partner ist.`,
    codeLabel: "Dein Partnercode",
    discountLabel: "Mitgliederrabatt",
    linkLabel: "Dein Partnerlink",
    instructions: "Teile deinen Partnerlink oder -code mit deinen Mitgliedern. Wer sich über den Link für AutoVere Pro anmeldet oder den Code beim Bezahlen eingibt, erhält automatisch den oben genannten Rabatt — du musst nichts weiter einrichten.",
    footerLink: "AutoVere besuchen",
    supportLine: "Fragen? Antworte einfach auf diese E-Mail, oder schreib uns an contact@autovere.com.",
  },
  nl: {
    subject: (org) => `AutoVere Partnerprogramma — ${org} is goedgekeurd!`,
    heading: "Welkom bij het AutoVere Partnerprogramma!",
    intro: (org) => `We bevestigen graag dat ${org} nu een officiële AutoVere-partner is.`,
    codeLabel: "Jouw partnercode",
    discountLabel: "Ledenkorting",
    linkLabel: "Jouw partnerlink",
    instructions: "Deel je partnerlink of -code met je leden. Iedereen die zich via de link aanmeldt voor AutoVere Pro, of de code invoert bij het afrekenen, krijgt automatisch de korting hierboven — er is niets voor je in te stellen.",
    footerLink: "Bezoek AutoVere",
    supportLine: "Vragen? Beantwoord deze e-mail gewoon, of mail ons op contact@autovere.com.",
  },
  no: {
    subject: (org) => `AutoVere Partnerprogram — ${org} er godkjent!`,
    heading: "Velkommen til AutoVere Partnerprogram!",
    intro: (org) => `Vi bekrefter med glede at ${org} nå er en offisiell AutoVere-partner.`,
    codeLabel: "Din partnerkode",
    discountLabel: "Medlemsrabatt",
    linkLabel: "Din partnerlenke",
    instructions: "Del partnerlenken eller -koden med medlemmene dine. Alle som melder seg på AutoVere Pro via lenken, eller taster inn koden ved kjøp, får automatisk rabatten over — det er ingenting du trenger å sette opp.",
    footerLink: "Besøk AutoVere",
    supportLine: "Spørsmål? Bare svar på denne e-posten, eller skriv til contact@autovere.com.",
  },
  pl: {
    subject: (org) => `Program Partnerski AutoVere — ${org} zatwierdzony!`,
    heading: "Witamy w Programie Partnerskim AutoVere!",
    intro: (org) => `Z przyjemnością potwierdzamy, że ${org} jest teraz oficjalnym partnerem AutoVere.`,
    codeLabel: "Twój kod partnera",
    discountLabel: "Zniżka dla członków",
    linkLabel: "Twój link partnerski",
    instructions: "Udostępnij swój link partnerski lub kod swoim członkom. Każdy, kto zarejestruje się w AutoVere Pro przez link lub wpisze kod przy płatności, automatycznie otrzyma powyższą zniżkę — nie musisz nic konfigurować.",
    footerLink: "Odwiedź AutoVere",
    supportLine: "Masz pytania? Po prostu odpowiedz na tego e-maila, lub napisz do nas na contact@autovere.com.",
  },
  sv: {
    subject: (org) => `AutoVere Partnerprogram — ${org} är godkänt!`,
    heading: "Välkommen till AutoVere Partnerprogram!",
    intro: (org) => `Vi bekräftar gärna att ${org} nu är en officiell AutoVere-partner.`,
    codeLabel: "Din partnerkod",
    discountLabel: "Medlemsrabatt",
    linkLabel: "Din partnerlänk",
    instructions: "Dela din partnerlänk eller -kod med dina medlemmar. Alla som registrerar sig för AutoVere Pro via länken, eller anger koden i kassan, får automatiskt rabatten ovan — det finns inget du behöver ställa in.",
    footerLink: "Besök AutoVere",
    supportLine: "Frågor? Svara bara på det här mejlet, eller skriv till contact@autovere.com.",
  },
  fr: {
    subject: (org) => `Programme Partenaire AutoVere — ${org} est approuvé !`,
    heading: "Bienvenue dans le Programme Partenaire AutoVere !",
    intro: (org) => `Nous avons le plaisir de confirmer que ${org} est désormais partenaire officiel d'AutoVere.`,
    codeLabel: "Votre code partenaire",
    discountLabel: "Réduction membre",
    linkLabel: "Votre lien partenaire",
    instructions: "Partagez votre lien ou code partenaire avec vos membres. Toute personne qui s'inscrit à AutoVere Pro via le lien, ou saisit le code au moment du paiement, bénéficie automatiquement de la réduction ci-dessus — vous n'avez rien à configurer.",
    footerLink: "Visiter AutoVere",
    supportLine: "Des questions ? Répondez simplement à cet e-mail, ou écrivez-nous à contact@autovere.com.",
  },
  da: {
    subject: (org) => `AutoVere Partnerprogram — ${org} er godkendt!`,
    heading: "Velkommen til AutoVere Partnerprogram!",
    intro: (org) => `Vi bekræfter med glæde, at ${org} nu er en officiel AutoVere-partner.`,
    codeLabel: "Din partnerkode",
    discountLabel: "Medlemsrabat",
    linkLabel: "Dit partnerlink",
    instructions: "Del dit partnerlink eller din kode med dine medlemmer. Alle, der tilmelder sig AutoVere Pro via linket, eller indtaster koden ved kassen, får automatisk rabatten ovenfor — der er intet, du selv skal sætte op.",
    footerLink: "Besøg AutoVere",
    supportLine: "Spørgsmål? Svar blot på denne e-mail, eller skriv til contact@autovere.com.",
  },
};

function escapeHtmlForEmail(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function buildPartnerConfirmationEmail(
  locale: Locale,
  params: { organisationName: string; partnerCode: string; discountPercent: number; partnerLink: string },
): { subject: string; html: string; text: string } {
  const copy = partnerEmailCopy[locale] ?? partnerEmailCopy.en;
  const { organisationName, partnerCode, discountPercent, partnerLink } = params;
  const siteUrl = "https://www.autovere.com";

  const subject = copy.subject(organisationName);
  const text = [
    copy.heading,
    "",
    copy.intro(organisationName),
    "",
    `${copy.codeLabel}: ${partnerCode}`,
    `${copy.discountLabel}: ${discountPercent}%`,
    `${copy.linkLabel}: ${partnerLink}`,
    "",
    copy.instructions,
    "",
    `${copy.footerLink}: ${siteUrl}`,
    copy.supportLine,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:520px">
    <h2 style="margin-bottom:4px">${escapeHtmlForEmail(copy.heading)}</h2>
    <p>${escapeHtmlForEmail(copy.intro(organisationName))}</p>
    <table style="margin:20px 0;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtmlForEmail(copy.codeLabel)}</strong></td><td style="padding:4px 0;font-family:monospace;font-size:15px">${escapeHtmlForEmail(partnerCode)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtmlForEmail(copy.discountLabel)}</strong></td><td style="padding:4px 0">${discountPercent}%</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtmlForEmail(copy.linkLabel)}</strong></td><td style="padding:4px 0"><a href="${escapeHtmlForEmail(partnerLink)}">${escapeHtmlForEmail(partnerLink)}</a></td></tr>
    </table>
    <p>${escapeHtmlForEmail(copy.instructions)}</p>
    <hr style="border:none;border-top:1px solid #e2e5ea;margin:20px 0" />
    <p><a href="${siteUrl}">${escapeHtmlForEmail(copy.footerLink)}</a></p>
    <p style="color:#667;font-size:13px">${escapeHtmlForEmail(copy.supportLine)}</p>
  </div>`;

  return { subject, html, text };
}

function partnerLinkFor(partnerId: string): string {
  const base = (process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").replace(/\/$/, "");
  return `${base}/?partner=${encodeURIComponent(partnerId)}`;
}

async function sendPartnerConfirmationEmail(locale: Locale, to: string, params: { organisationName: string; partnerCode: string; discountPercent: number; partnerLink: string }) {
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"]) {
    console.error("Skipping partner confirmation email — GMAIL_USER/GMAIL_APP_PASSWORD not configured");
    return;
  }
  const { subject, html, text } = buildPartnerConfirmationEmail(locale, params);
  try {
    await nodemailer.createTransport({ service: "gmail", auth: { user: process.env["GMAIL_USER"], pass: process.env["GMAIL_APP_PASSWORD"] } }).sendMail({
      from: process.env["GMAIL_USER"],
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Sending partner confirmation email failed", error);
  }
}

async function handleApprove(applicationId: string, request: Request, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(500).json({ error: "Partner storage is not configured." });
    return;
  }
  const appRows = (await sql`SELECT * FROM partner_applications WHERE id = ${applicationId}`) as PartnerApplicationRow[];
  const application = appRows[0];
  if (!application) {
    response.status(404).json({ error: "Application not found." });
    return;
  }
  if (application.status !== "pending") {
    response.status(409).json({ error: "This application has already been reviewed." });
    return;
  }

  const body = parseBody(request.body);
  const discountPercent = Number(body["discountPercent"]);
  if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 100) {
    response.status(400).json({ error: "Discount percent must be an integer between 1 and 100." });
    return;
  }
  const startDate = typeof body["startDate"] === "string" && body["startDate"] ? body["startDate"] : null;
  const endDate = typeof body["endDate"] === "string" && body["endDate"] ? body["endDate"] : null;
  const notes = typeof body["notes"] === "string" && body["notes"].trim() ? body["notes"].trim() : null;
  const overridePartnerId = typeof body["partnerId"] === "string" && body["partnerId"].trim() ? body["partnerId"].trim().toUpperCase() : null;
  const overrideCode = typeof body["discountCode"] === "string" && body["discountCode"].trim() ? body["discountCode"].trim().toUpperCase() : null;

  if (overridePartnerId && !PARTNER_ID_RE.test(overridePartnerId)) {
    response.status(400).json({ error: "Partner ID must be 2-24 uppercase letters/numbers/hyphens." });
    return;
  }
  if (overrideCode && !CODE_RE.test(overrideCode)) {
    response.status(400).json({ error: "Member discount code must be 3-32 uppercase letters/numbers/hyphens." });
    return;
  }

  let partnerId = overridePartnerId ?? generatePartnerId(application.organisation_name);
  const parsed: ParsedPartner = {
    id: partnerId,
    name: application.organisation_name,
    country: application.country,
    logo: null,
    website: application.website,
    discountPercent,
    discountCode: overrideCode ?? partnerId,
    active: true,
    startDate,
    endDate,
    notes,
    type: application.type,
  };

  let inserted = false;
  for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
    try {
      await insertPartner(sql, parsed);
      inserted = true;
    } catch (error) {
      // Only retry on an ID collision when we generated the ID ourselves — an admin-supplied
      // override or a discount-code clash should surface as a real error, not be silently retried.
      if (overridePartnerId || overrideCode) {
        console.error("Approving partner application failed", error);
        response.status(409).json({ error: "A partner with this ID or discount code already exists." });
        return;
      }
      partnerId = generatePartnerId(application.organisation_name);
      parsed.id = partnerId;
      parsed.discountCode = partnerId;
    }
  }
  if (!inserted) {
    response.status(500).json({ error: "Could not generate a unique partner ID. Please try again." });
    return;
  }

  await sql`
    UPDATE partner_applications SET status = 'approved', partner_id = ${partnerId}, reviewed_at = now() WHERE id = ${applicationId}
  `;

  await sendPartnerConfirmationEmail(application.locale, application.contact_email, {
    organisationName: application.organisation_name,
    partnerCode: parsed.discountCode,
    discountPercent,
    partnerLink: partnerLinkFor(partnerId),
  });

  response.status(200).json({ ok: true, partnerId, discountCode: parsed.discountCode });
}

async function handleReject(applicationId: string, response: Response) {
  const sql = requireDb();
  if (!sql) {
    response.status(500).json({ error: "Partner storage is not configured." });
    return;
  }
  const result = await sql`
    UPDATE partner_applications SET status = 'rejected', reviewed_at = now() WHERE id = ${applicationId} AND status = 'pending' RETURNING id
  `;
  if ((result as unknown[]).length === 0) {
    response.status(409).json({ error: "This application has already been reviewed, or does not exist." });
    return;
  }
  response.status(200).json({ ok: true });
}

export default async function handler(request: Request, response: Response) {
  const action = queryParam(request, "action");
  const id = queryParam(request, "id");
  const code = queryParam(request, "code");
  const admin = queryParam(request, "admin");

  if (request.method === "POST" && action === "admin-login") return handleAdminLogin(request, response);
  if (request.method === "POST" && action === "admin-logout") return handleAdminLogout(response);
  if (request.method === "POST" && action === "apply") return handleApplicationSubmit(request, response);

  if (request.method === "GET" && admin) {
    if (!isAdmin(request)) {
      response.status(401).json({ error: "Not authenticated." });
      return;
    }
    const view = queryParam(request, "view");
    if (view === "metrics") return handleMetrics(response);
    if (view === "applications") return handleApplicationsList(response);
    return handleAdminList(response);
  }

  if (request.method === "POST" && (action === "approve" || action === "reject")) {
    if (!isAdmin(request)) {
      response.status(401).json({ error: "Not authenticated." });
      return;
    }
    if (!id) {
      response.status(400).json({ error: "Missing application id." });
      return;
    }
    return action === "approve" ? handleApprove(id, request, response) : handleReject(id, response);
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
