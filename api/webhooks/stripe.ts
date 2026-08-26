import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";

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
      // TODO: Persist the customer's plan and subscription access when accounts are added.
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
