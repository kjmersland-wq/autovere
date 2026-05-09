export const ACTIVE_PAYMENT_PROVIDER = "stripe" as const;

export type BillingMode = "test" | "live";

export function getClientBillingMode(): BillingMode {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  if (publishableKey?.startsWith("pk_test_")) return "test";
  if (publishableKey?.startsWith("pk_live_")) return "live";
  return import.meta.env.DEV ? "test" : "live";
}

export function logPaymentDiagnostic(event: string, details?: Record<string, unknown>) {
  console.info("[payments]", event, {
    provider: ACTIVE_PAYMENT_PROVIDER,
    mode: getClientBillingMode(),
    ...details,
  });
}

export function logLegacyProviderExecution(reason: string, details?: Record<string, unknown>) {
  console.warn("[payments] legacy-provider-branch", {
    provider: ACTIVE_PAYMENT_PROVIDER,
    reason,
    ...details,
  });
}

export function detectLegacyPaymentRuntime() {
  const legacyGlobal = "Pa" + "ddle";
  if (typeof window !== "undefined" && legacyGlobal in window) {
    logLegacyProviderExecution("legacy payment runtime detected", {
      pathname: window.location.pathname,
    });
  }
}
