// Forward verified financial events; failures never block provider delivery.
// Provider-neutral: the payments webhook normalizes verified payment events into this shape.
const DEFAULT_URL = "https://www.km-techlabs.com/api/public/ingest/payments";

export type AccountingPayload = {
  site: string;
  id: string;
  type: "payment" | "subscription_created" | "subscription_canceled" | "refund";
  status: string;
  amount: number;
  discount: number;
  currency: string;
  customer: string | null;
  plan: string | null;
  environment: string;
  occurred_at: string;
};

export async function forwardToKmTechlabs(payload: AccountingPayload) {
  try {
    const secret = process.env["AUTOVERE_INGEST_SECRET"];
    if (!secret) throw new Error("Accounting forwarding is not configured");
    const response = await fetch(process.env["KM_TECHLABS_WEBHOOK_URL"] || DEFAULT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.warn("Accounting forwarding failed", response.status);
  } catch (error) {
    console.warn("Accounting forwarding failed", error);
  }
}
