import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";

type Request = IncomingMessage & { headers: IncomingMessage["headers"] };
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

function siteUrl(): string {
  const raw = (process.env["AUTH_BASE_URL"] || process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").trim();
  const embedded = raw.match(/https?:\/\/[^\s\])'"]+/);
  const configured = (embedded ? embedded[0] : raw.replace(/^['"]|['"]$/g, "").trim()).replace(/\/$/, "");
  return /^https?:\/\//.test(configured) ? configured : `https://${configured}`;
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
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
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${siteUrl()}/account`,
    });
    response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Creating billing portal session failed", error);
    response.status(500).json({ error: "Could not open billing management right now." });
  }
}
