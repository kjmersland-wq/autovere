// Forwards verified Paddle events to KM TECH LABS (km-techlabs.com).
// Matches the receiver at /api/public/ingest/payments: Bearer auth with the
// shared secret AUTOVERE_INGEST_SECRET, one event per POST.
// Never throws: a failed forward must not make Paddle retry the webhook.

const DEFAULT_URL = "https://www.km-techlabs.com/api/public/ingest/payments";

type IngestType = "payment" | "discount" | "subscription_created" | "subscription_canceled";

function mapType(eventType: string): IngestType {
  if (eventType.startsWith("subscription.canceled")) return "subscription_canceled";
  if (eventType.startsWith("subscription.created")) return "subscription_created";
  return "payment"; // transaction.completed, transaction.payment_failed, subscription.updated, ...
}

// Paddle totals are in minor units (cents); the receiver stores major units.
function toMajor(minor: unknown): number {
  const n = Number(minor);
  return Number.isFinite(n) ? n / 100 : 0;
}

function planLabel(data: any): string | undefined {
  const item = data?.items?.[0];
  return item?.price?.import_meta?.external_id ?? item?.price?.id ?? undefined;
}

export async function forwardToKmTechlabs(
  event: { event_id?: string; event_type: string; occurred_at?: string; data: any },
  env: string,
) {
  try {
    const data = event.data ?? {};
    const totals = data?.details?.totals;
    const discountTotal = toMajor(totals?.discount);
    const type = mapType(event.event_type);

    const payload = {
      site: "autovere.com",
      id: event.event_id ?? data?.id ?? `${event.event_type}-${Date.now()}`,
      type,
      status: String(data?.status ?? ""),
      amount: toMajor(totals?.total),
      discount: discountTotal,
      currency: String(data?.currency_code ?? "EUR").toUpperCase(),
      customer: data?.customer_id ? String(data.customer_id) : undefined,
      plan: planLabel(data),
      environment: env,
      occurred_at: event.occurred_at ?? new Date().toISOString(),
    };

    const url = process.env["KM_TECHLABS_WEBHOOK_URL"] || DEFAULT_URL;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = process.env["AUTOVERE_INGEST_SECRET"];
    if (secret) headers["Authorization"] = `Bearer ${secret}`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn("KM TECH LABS forward failed:", res.status, await res.text().catch(() => ""));

    // Discounts on payments are reported inside the payment event above.
    // A pure discount event is only sent when there is a discount but no total
    // (e.g. subscription.created with a discounted first period).
    if (type !== "payment" && discountTotal > 0) {
      const discountPayload = { ...payload, id: `${payload.id}-discount`, type: "discount" as const, amount: 0 };
      const res2 = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(discountPayload),
        signal: AbortSignal.timeout(5000),
      });
      if (!res2.ok) console.warn("KM TECH LABS discount forward failed:", res2.status);
    }
  } catch (e) {
    console.warn("KM TECH LABS forward error:", e);
  }
}
