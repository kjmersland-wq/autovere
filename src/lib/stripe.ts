export function getStripeEnvironment(): "test" | "live" {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  if (!key) return "test";
  return key.startsWith("pk_live_") ? "live" : "test";
}
