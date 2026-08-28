import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export const config = { api: { bodyParser: false } };

function getStripe() {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

async function rawBody(request: VercelRequest): Promise<Buffer> {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === "string") return Buffer.from(request.body);
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const secret = process.env["STRIPE_WEBHOOK_SECRET"];
  const signature = request.headers["stripe-signature"];
  const stripe = getStripe();
  if (!stripe || !secret || typeof signature !== "string") {
    response.status(400).json({ error: "Missing Stripe webhook configuration." });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await rawBody(request), signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    response.status(400).json({ error: "Invalid webhook signature." });
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("Stripe checkout completed", { sessionId: session.id, customerId: session.customer, subscriptionId: session.subscription });
      const partnerId = session.metadata?.["partnerId"];
      const databaseUrl = process.env["DATABASE_URL"];
      const email = session.customer_details?.email ?? null;
      if (partnerId && databaseUrl) {
        try {
          const sql = neon(databaseUrl);
          await sql`
            INSERT INTO partner_referrals (id, partner_id, email, stripe_customer_id, stripe_subscription_id)
            VALUES (${randomUUID()}, ${partnerId}, ${email}, ${typeof session.customer === "string" ? session.customer : null}, ${typeof session.subscription === "string" ? session.subscription : null})
          `;
          // A completed, discounted checkout is the only server-verified moment we trust to
          // register a partner membership — never taken from the client or the URL alone.
          if (email) {
            const partnerRows = (await sql`SELECT discount_percent FROM partners WHERE id = ${partnerId}`) as { discount_percent: number }[];
            const discountPercent = partnerRows[0]?.discount_percent;
            if (discountPercent) {
              const validUntil = new Date();
              validUntil.setFullYear(validUntil.getFullYear() + 1);
              await sql`
                INSERT INTO partner_memberships (user_email, partner_id, discount_percent, valid_until, linked_at, source)
                VALUES (${email}, ${partnerId}, ${discountPercent}, ${validUntil.toISOString().slice(0, 10)}, now(), 'checkout')
                ON CONFLICT (user_email) DO UPDATE SET
                  partner_id = ${partnerId}, discount_percent = ${discountPercent}, valid_until = ${validUntil.toISOString().slice(0, 10)}, linked_at = now(), source = 'checkout'
              `;
            }
          }
        } catch (error) {
          console.error("Recording partner referral or membership failed", error);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.info("Stripe subscription deleted", { subscriptionId: subscription.id, customerId: subscription.customer });
      // TODO: Revoke the customer's plan access when accounts are added.
      break;
    }
    default:
      break;
  }

  response.status(200).json({ received: true });
}
