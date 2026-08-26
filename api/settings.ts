import type { IncomingMessage, ServerResponse } from "node:http";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function getSql() {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
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

const CURRENCIES = new Set(["EUR", "NOK", "SEK", "DKK", "GBP", "CHF"]);
const LOCALES = new Set(["en", "de", "nl", "no", "pl", "sv", "fr"]);
const UNIT_SYSTEMS = new Set(["metric", "imperial"]);

export default async function handler(request: Request, response: Response) {
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
  const sql = getSql();

  if (request.method === "GET") {
    type SettingsRow = { language: string | null; currency: string | null; units: string | null; notifications_email: boolean };
    const rows = (await sql`SELECT language, currency, units, notifications_email FROM user_settings WHERE user_email = ${email}`) as SettingsRow[];
    const row = rows[0];
    response.status(200).json({
      settings: row
        ? { language: row.language, currency: row.currency, units: row.units, notificationsEmail: row.notifications_email }
        : { language: null, currency: null, units: null, notificationsEmail: true },
    });
    return;
  }

  if (request.method === "PUT") {
    const body = parseBody(request.body);
    const language = typeof body["language"] === "string" && LOCALES.has(body["language"]) ? body["language"] : null;
    const currency = typeof body["currency"] === "string" && CURRENCIES.has(body["currency"]) ? body["currency"] : null;
    const units = typeof body["units"] === "string" && UNIT_SYSTEMS.has(body["units"]) ? body["units"] : null;
    const notificationsEmail = typeof body["notificationsEmail"] === "boolean" ? body["notificationsEmail"] : true;

    await sql`
      INSERT INTO user_settings (user_email, language, currency, units, notifications_email, updated_at)
      VALUES (${email}, ${language}, ${currency}, ${units}, ${notificationsEmail}, now())
      ON CONFLICT (user_email) DO UPDATE SET
        language = ${language}, currency = ${currency}, units = ${units}, notifications_email = ${notificationsEmail}, updated_at = now()
    `;
    response.status(200).json({ settings: { language, currency, units, notificationsEmail } });
    return;
  }

  response.status(405).json({ error: "Method not allowed" });
}
