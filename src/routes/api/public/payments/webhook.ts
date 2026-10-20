import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { createStripeClient, verifyWebhook, type StripeEnv } from "@/lib/stripe.server";
import { passDays } from "@/lib/pass-durations";
import { forwardToKmTechlabs } from "@/lib/km-techlabs.server";

const iso = (seconds: number | null | undefined) => seconds ? new Date(seconds * 1000).toISOString() : null;
const idOf = (value: string | { id: string } | null | undefined) => typeof value === "string" ? value : value?.id ?? null;
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: { handlers: { POST: async ({ request }) => {
    const environment = new URL(request.url).searchParams.get("env");
    if (environment !== "sandbox" && environment !== "live") return new Response("Invalid environment", { status: 400 });
    const env: StripeEnv = environment;
    let event: Stripe.Event;
    try { event = await verifyWebhook(request, env); }
    catch { return new Response("Invalid signature", { status: 400 }); }
    try {
      const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
      const { data: processed, error: readError } = await db.from("payment_webhook_events").select("id").eq("id", event.id).eq("environment", env).maybeSingle();
      if (readError) throw readError;
      if (processed) return Response.json({ received: true });
      const stripe = createStripeClient(env);
      const writeSubscription = async (id: string) => {
        // Read current provider state rather than trust out-of-order event snapshots.
        const sub = await stripe.subscriptions.retrieve(id);
        const userId = sub.metadata.userId;
        const item = sub.items.data[0];
        if (!userId || !item) return;
        const priceId = item.price.lookup_key ?? item.price.metadata.lovable_external_id;
        if (!priceId) throw new Error("Missing plan lookup key");
        const { error } = await db.from("subscriptions").upsert({
          user_id: userId, provider: "stripe", payment_subscription_id: sub.id,
          payment_customer_id: idOf(sub.customer), product_id: idOf(item.price.product) ?? "",
          price_id: priceId, status: sub.status,
          current_period_start: iso(item.current_period_start), current_period_end: iso(item.current_period_end),
          cancel_at_period_end: sub.cancel_at_period_end, environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: "payment_subscription_id,environment" });
        if (error) throw error;
      };
      const fulfill = async (session: Stripe.Checkout.Session) => {
        if (!["paid", "no_payment_required"].includes(session.payment_status)) return;
        if (session.mode === "subscription") {
          const subId = idOf(session.subscription);
          if (subId) await writeSubscription(subId);
          return;
        }
        const userId = session.metadata?.userId;
        const priceId = session.metadata?.plan;
        const days = priceId ? passDays(priceId) : undefined;
        if (!userId || !priceId || !days) throw new Error("Missing pass metadata");
        // Use immutable payment/session timestamps and ignore duplicates: retries never extend access.
        const start = session.created * 1000;
        const { error } = await db.from("subscriptions").upsert({
          user_id: userId, provider: "stripe", payment_subscription_id: session.id,
          payment_customer_id: idOf(session.customer), product_id: priceId, price_id: priceId,
          status: "active", current_period_start: new Date(start).toISOString(),
          current_period_end: new Date(start + days * 86400000).toISOString(), cancel_at_period_end: true,
          environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: "payment_subscription_id,environment", ignoreDuplicates: true });
        if (error) throw error;
        const { error: ledgerError } = await db.from("payment_transactions").upsert({
          id: session.id, environment: env, user_id: userId, subscription_id: null,
          customer_id: idOf(session.customer), customer_email: session.customer_details?.email,
          price_id: priceId, amount: (session.amount_total ?? 0) / 100, currency: session.currency?.toUpperCase() ?? "EUR",
          status: "paid", billed_at: iso(session.created) ?? new Date().toISOString(),
        }, { onConflict: "id,environment" });
        if (ledgerError) throw ledgerError;
      };
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await writeSubscription((event.data.object as Stripe.Subscription).id);
          break;
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded":
          await fulfill(event.data.object as Stripe.Checkout.Session);
          break;
        case "invoice.paid":
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const subId = idOf(invoice.parent?.subscription_details?.subscription);
          if (subId) await writeSubscription(subId);
          if (event.type === "invoice.paid") {
            const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
            const { error } = await db.from("payment_transactions").upsert({
              id: invoice.id, environment: env, user_id: sub?.metadata.userId,
              subscription_id: subId, customer_id: idOf(invoice.customer), customer_email: invoice.customer_email,
              price_id: sub?.items.data[0]?.price.lookup_key ?? null,
              amount: invoice.amount_paid / 100, currency: invoice.currency.toUpperCase(), status: "paid",
              billed_at: iso(invoice.status_transitions.paid_at ?? invoice.created) ?? new Date().toISOString(),
            }, { onConflict: "id,environment" });
            if (error) throw error;
          }
          break;
        }
        case "charge.refunded": {
          const charge = event.data.object as Stripe.Charge;
          const intentId = idOf(charge.payment_intent);
          if (intentId && charge.refunded) {
            const sessions = await stripe.checkout.sessions.list({ payment_intent: intentId, limit: 10 });
            for (const session of sessions.data) {
              const { error } = await db.from("subscriptions").update({ status: "expired", updated_at: new Date().toISOString() }).eq("payment_subscription_id", session.id).eq("environment", env);
              if (error) throw error;
              const { error: ledgerError } = await db.from("payment_transactions").update({ status: "refunded" }).eq("id", session.id).eq("environment", env);
              if (ledgerError) throw ledgerError;
            }
          }
          break;
        }
        default: break;
      }
      await forwardToKmTechlabs(event, env);
      const { error } = await db.from("payment_webhook_events").upsert({ id: event.id, environment: env, event_created: event.created }, { onConflict: "id,environment", ignoreDuplicates: true });
      if (error) throw error;
      return Response.json({ received: true });
    } catch (error) {
      console.error("Payment event processing failed", event.id, error);
      return new Response("Payment event processing failed", { status: 500 });
    }
  } } },
});
