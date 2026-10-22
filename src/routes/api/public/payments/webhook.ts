import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, getPaddleClient, EventName, type PaddleEnv } from "@/lib/paddle.server";
import { passDays } from "@/lib/pass-durations";
import { forwardToKmTechlabs } from "@/lib/km-techlabs.server";

const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND"]);
const toMajor = (amount: string | number | null | undefined, currency: string) => {
  const value = Number(amount ?? 0);
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? value : value / 100;
};

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: { handlers: { POST: async ({ request }) => {
    const environment = new URL(request.url).searchParams.get("env");
    if (environment !== "sandbox" && environment !== "live") return new Response("Invalid environment", { status: 400 });
    const env: PaddleEnv = environment;
    let event: any;
    try { event = await verifyWebhook(request, env); }
    catch { return new Response("Invalid signature", { status: 400 }); }
    try {
      const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
      const eventId: string = event.eventId;
      const { data: processed, error: readError } = await db.from("payment_webhook_events").select("id").eq("id", eventId).eq("environment", env).maybeSingle();
      if (readError) throw readError;
      if (processed) return Response.json({ received: true });

      const writeSubscription = async (sub: any) => {
        const userId = sub.customData?.userId;
        const item = sub.items?.[0];
        if (!userId || !item) return;
        const priceId = item.price?.importMeta?.externalId;
        const productId = item.product?.importMeta?.externalId ?? item.price?.productId ?? "";
        if (!priceId) {
          console.warn("Skipping subscription: missing importMeta.externalId", { rawPriceId: item.price?.id });
          return;
        }
        const { error } = await db.from("subscriptions").upsert({
          user_id: userId, provider: "paddle", payment_subscription_id: sub.id,
          payment_customer_id: sub.customerId, product_id: productId,
          price_id: priceId, status: sub.status,
          current_period_start: sub.currentBillingPeriod?.startsAt ?? null,
          current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
          cancel_at_period_end: sub.scheduledChange?.action === "cancel",
          environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: "payment_subscription_id,environment" });
        if (error) throw error;
      };

      const fulfillOneTime = async (txn: any) => {
        const userId = txn.customData?.userId;
        const item = txn.items?.[0];
        const priceId = item?.price?.importMeta?.externalId;
        const days = priceId ? passDays(priceId) : undefined;
        if (!userId || !priceId || !days) throw new Error("Missing pass metadata");
        // Use immutable transaction timestamps and ignore duplicates: retries never extend access.
        const start = Date.parse(txn.createdAt ?? new Date().toISOString());
        const { error } = await db.from("subscriptions").upsert({
          user_id: userId, provider: "paddle", payment_subscription_id: txn.id,
          payment_customer_id: txn.customerId, product_id: priceId, price_id: priceId,
          status: "active", current_period_start: new Date(start).toISOString(),
          current_period_end: new Date(start + days * 86400000).toISOString(), cancel_at_period_end: true,
          environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: "payment_subscription_id,environment", ignoreDuplicates: true });
        if (error) throw error;
      };

      const writeLedger = async (txn: any, status: string) => {
        const currency: string = txn.currencyCode ?? "EUR";
        const { error } = await db.from("payment_transactions").upsert({
          id: txn.id, environment: env, user_id: txn.customData?.userId ?? null,
          subscription_id: txn.subscriptionId ?? null,
          customer_id: txn.customerId ?? null, customer_email: null,
          price_id: txn.items?.[0]?.price?.importMeta?.externalId ?? null,
          amount: toMajor(txn.details?.totals?.total, currency), currency: currency.toUpperCase(),
          status, billed_at: txn.billedAt ?? txn.createdAt ?? new Date().toISOString(),
        }, { onConflict: "id,environment" });
        if (error) throw error;
      };

      const occurredAt = event.occurredAt ? new Date(event.occurredAt).toISOString() : new Date().toISOString();

      switch (event.eventType) {
        case EventName.SubscriptionCreated: {
          await writeSubscription(event.data);
          const currency: string = event.data.currencyCode ?? "EUR";
          await forwardToKmTechlabs({
            site: "autovere.com", id: eventId, type: "subscription_created", status: event.data.status ?? "active",
            amount: toMajor(event.data.items?.[0]?.price?.unitPrice?.amount, currency), discount: 0,
            currency: currency.toUpperCase(), customer: event.data.customerId ?? null,
            plan: event.data.items?.[0]?.price?.importMeta?.externalId ?? null, environment: env, occurred_at: occurredAt,
          });
          break;
        }
        case EventName.SubscriptionUpdated:
          await writeSubscription(event.data);
          break;
        case EventName.SubscriptionCanceled: {
          await db.from("subscriptions").update({ status: "canceled", updated_at: new Date().toISOString() })
            .eq("payment_subscription_id", event.data.id).eq("environment", env);
          await forwardToKmTechlabs({
            site: "autovere.com", id: eventId, type: "subscription_canceled", status: "canceled",
            amount: 0, discount: 0, currency: (event.data.currencyCode ?? "EUR").toUpperCase(),
            customer: event.data.customerId ?? null, plan: event.data.items?.[0]?.price?.importMeta?.externalId ?? null,
            environment: env, occurred_at: occurredAt,
          });
          break;
        }
        case EventName.TransactionCompleted: {
          const txn = event.data;
          if (txn.subscriptionId) {
            // Refresh the subscription from the provider rather than trust the snapshot.
            const sub = await getPaddleClient(env).subscriptions.get(txn.subscriptionId);
            await writeSubscription(sub);
          } else {
            await fulfillOneTime(txn);
          }
          await writeLedger(txn, "paid");
          const currency: string = txn.currencyCode ?? "EUR";
          await forwardToKmTechlabs({
            site: "autovere.com", id: `${txn.id}-payment`, type: "payment", status: "paid",
            amount: toMajor(txn.details?.totals?.total, currency),
            discount: toMajor(txn.details?.totals?.discount, currency),
            currency: currency.toUpperCase(), customer: txn.customerId ?? null,
            plan: txn.items?.[0]?.price?.importMeta?.externalId ?? null, environment: env, occurred_at: occurredAt,
          });
          break;
        }
        case EventName.TransactionPaymentFailed:
          console.warn("Payment failed", event.data?.id);
          break;
        default:
          console.log("Unhandled event:", event.eventType);
      }

      const { error } = await db.from("payment_webhook_events").upsert(
        { id: eventId, environment: env, event_created: occurredAt },
        { onConflict: "id,environment", ignoreDuplicates: true },
      );
      if (error) throw error;
      return Response.json({ received: true });
    } catch (error) {
      console.error("Payment event processing failed", event?.eventId, error);
      return new Response("Payment event processing failed", { status: 500 });
    }
  } } },
});
