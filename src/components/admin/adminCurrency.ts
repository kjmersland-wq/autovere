import { formatCurrency } from "@/lib/currency";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import type { ExchangeRates } from "@/lib/admin-data.functions";

/** Converts a EUR amount (the base currency all Admin revenue is computed in)
 * into the selected display currency using live rates. Display-only — never
 * changes the underlying Stripe/database figures, which stay in EUR. */
export function convertFromEur(valueEur: number, currency: AdminCurrency, rates: ExchangeRates | null): number {
  if (currency === "EUR" || !rates) return valueEur;
  return valueEur * rates[currency];
}

export function formatAdminCurrency(valueEur: number, currency: AdminCurrency, rates: ExchangeRates | null): string {
  return formatCurrency(convertFromEur(valueEur, currency, rates), currency);
}
