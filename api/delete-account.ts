import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";

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
  response.setHeader("Set-Cookie", "autovere_user=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  response.status(200).json({ ok: true });
}
