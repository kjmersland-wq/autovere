export const CURRENCIES = ["EUR", "NOK", "SEK", "DKK", "GBP", "CHF"] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  NOK: 11.7,
  SEK: 11.4,
  DKK: 7.46,
  GBP: 0.86,
  CHF: 0.95,
};

export function formatCurrency(amountEur: number, currency: CurrencyCode): string {
  const value = amountEur * EXCHANGE_RATES[currency];
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: value < 100 ? 2 : 0,
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}
