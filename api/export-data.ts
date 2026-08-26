import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage;
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

export default async function handler(request: Request, response: Response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }

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
