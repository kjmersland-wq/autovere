import { loadStripe, type Stripe } from "@stripe/stripe-js";
export type StripeEnv = "sandbox" | "live";
const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];
let stripePromise: Promise<Stripe | null> | null = null;
export function getStripeEnvironment(): StripeEnv {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error("Payments are not configured. Complete go-live in the Payments tab to enable production checkout.");
}
export function getStripe() {
  getStripeEnvironment();
  if (!stripePromise) stripePromise = loadStripe(clientToken as string);
  return stripePromise;
}