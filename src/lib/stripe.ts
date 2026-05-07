import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeInstance(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not set");
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export function getStripeEnvironment(): "test" | "live" {
  return STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") ? "test" : "live";
}
