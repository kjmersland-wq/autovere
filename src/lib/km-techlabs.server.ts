// Forward verified financial events; failures never block provider delivery.
import type Stripe from "stripe";
const DEFAULT_URL = "https://www.km-techlabs.com/api/public/ingest/payments";
export async function forwardToKmTechlabs(event: Stripe.Event, env: string) {
  const supported = ["invoice.paid", "charge.refunded", "customer.subscription.created", "customer.subscription.deleted", "checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!supported.includes(event.type)) return;
  const data = event.data.object;
  if (data.object === "checkout.session" && (data.mode === "subscription" || !["paid", "no_payment_required"].includes(data.payment_status))) return;
  const type = event.type === "customer.subscription.created" ? "subscription_created" : event.type === "customer.subscription.deleted" ? "subscription_canceled" : "payment";
  const minor = data.object === "invoice" ? data.amount_paid : data.object === "checkout.session" ? data.amount_total ?? 0 : data.object === "charge" ? -data.amount_refunded : 0;
  const currency = "currency" in data && typeof data.currency === "string" ? data.currency : "eur";
  const divisor = ["jpy", "krw", "vnd", "clp", "xof", "xaf"].includes(currency) ? 1 : ["bhd", "jod", "kwd", "omr", "tnd"].includes(currency) ? 1000 : 100;
  const customer = "customer" in data ? data.customer : null;
  const plan = "metadata" in data ? data.metadata?.plan : undefined;
  const payload = {
    site: "autovere.com", id: data.object === "checkout.session" ? `${data.id}-payment` : event.id,
    type, status: event.type === "charge.refunded" ? "refunded" : "status" in data ? String(data.status) : "paid",
    amount: minor / divisor, discount: data.object === "checkout.session" ? (data.total_details?.amount_discount ?? 0) / divisor : 0,
    currency: currency.toUpperCase(), customer: typeof customer === "string" ? customer : customer?.id,
    plan, environment: env, occurred_at: new Date(event.created * 1000).toISOString(),
  };
  try {
    const secret = process.env["AUTOVERE_INGEST_SECRET"];
    if (!secret) throw new Error("Accounting forwarding is not configured");
    const response = await fetch(process.env["KM_TECHLABS_WEBHOOK_URL"] || DEFAULT_URL, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.warn("Accounting forwarding failed", response.status);
  } catch (error) { console.warn("Accounting forwarding failed", error); }
}
