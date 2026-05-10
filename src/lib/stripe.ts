export function getStripeEnvironment(): "test" | "live" {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
  return key?.startsWith("pk_test_") ? "test" : "live";
}
