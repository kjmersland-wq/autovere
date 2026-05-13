import { useTranslation } from "react-i18next";

/**
 * EUR → NOK reference rate. Updated periodically; keep conservative so users
 * are never surprised by under-quoting. Source: Norges Bank reference rate.
 */
export const EUR_TO_NOK = 11.5;

export type PriceOpts = {
  /** Append per-unit suffix, e.g. "/kWh" or "/L". */
  per?: "kWh" | "L" | "km" | "100km" | "year" | "month";
  /** Force decimals (default: integer for ≥100, 2 decimals for <100). */
  decimals?: number;
  /** Show "+" sign for positive numbers (useful for savings deltas). */
  showSign?: boolean;
};

/**
 * Currency formatter aware of the user's selected language.
 * Norwegian → NOK (converted from the EUR amount in source data).
 * Everything else → EUR.
 */
export function useFormatPrice() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] ?? "en";
  const isNO = lang === "no";

  return (eurAmount: number | null | undefined, opts: PriceOpts = {}): string => {
    if (eurAmount == null || !Number.isFinite(eurAmount)) return "";
    const value = isNO ? eurAmount * EUR_TO_NOK : eurAmount;
    const abs = Math.abs(value);
    const decimals = opts.decimals ?? (abs >= 100 ? 0 : 2);
    const locale = isNO ? "nb-NO" : "en-IE";
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
    const symbol = isNO ? "kr" : "€";
    const sign = opts.showSign && value > 0 ? "+" : "";
    const suffix = opts.per ? `/${opts.per}` : "";
    return isNO ? `${sign}${formatted} ${symbol}${suffix}` : `${sign}${symbol}${formatted}${suffix}`;
  };
}

/** Plain unit label without amount, e.g. "kr/kWh" vs "€/kWh". */
export function useCurrencyUnit() {
  const { i18n } = useTranslation();
  const isNO = (i18n.language?.split("-")[0] ?? "en") === "no";
  return (per?: "kWh" | "L" | "km" | "100km" | "year" | "month"): string => {
    const symbol = isNO ? "kr" : "€";
    return per ? `${symbol}/${per}` : symbol;
  };
}
