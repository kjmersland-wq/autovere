import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CurrencyCode = "EUR" | "USD" | "CAD" | "NOK" | "SEK" | "DKK" | "GBP" | "CHF";

export type CurrencyDef = {
  code: CurrencyCode;
  emoji: string;
  symbol: string;
  label: string;
  /** Symbol placed after the amount (Nordic style) */
  suffix?: boolean;
  decimals: number;
};

export const CURRENCIES: CurrencyDef[] = [
  { code: "EUR", emoji: "💶", symbol: "€", label: "Euro", decimals: 2 },
  { code: "USD", emoji: "💵", symbol: "$", label: "US Dollar", decimals: 2 },
  { code: "CAD", emoji: "🍁", symbol: "C$", label: "Canadian Dollar", decimals: 2 },
  { code: "NOK", emoji: "🇳🇴", symbol: "kr", label: "Norwegian Krone", suffix: true, decimals: 0 },
  { code: "SEK", emoji: "🇸🇪", symbol: "kr", label: "Swedish Krona", suffix: true, decimals: 0 },
  { code: "DKK", emoji: "🇩🇰", symbol: "kr", label: "Danish Krone", suffix: true, decimals: 0 },
  { code: "GBP", emoji: "🇬🇧", symbol: "£", label: "Pound Sterling", decimals: 2 },
  { code: "CHF", emoji: "🇨🇭", symbol: "CHF", label: "Swiss Franc", decimals: 2 },
];

export const CURRENCY_BY_CODE: Record<CurrencyCode, CurrencyDef> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
) as Record<CurrencyCode, CurrencyDef>;

/** Indicative reference rates, expressed as units per 1 EUR. */
export const RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  CAD: 1.47,
  NOK: 11.6,
  SEK: 11.3,
  DKK: 7.46,
  GBP: 0.85,
  CHF: 0.94,
};

export const RATES_UPDATED = "Indicative reference rates — refreshed for planning, not for settlement.";

export function convert(value: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return value;
  return (value / RATES[from]) * RATES[to];
}

export function formatCurrency(value: number, code: CurrencyCode, opts?: { decimals?: number }) {
  const def = CURRENCY_BY_CODE[code];
  const decimals = opts?.decimals ?? def.decimals;
  const n = value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return def.suffix ? `${n} ${def.symbol}` : `${def.symbol}${n}`;
}

export function rateNote(from: CurrencyCode, to: CurrencyCode) {
  if (from === to) return "";
  const r = convert(1, from, to);
  return `1 ${from} = ${r.toLocaleString("en-GB", { maximumFractionDigits: r < 10 ? 3 : 2 })} ${to}`;
}

/** Currency actually charged at the barrier for a given country / segment label. */
export function nativeCurrencyFor(countryLabel: string, fallback: CurrencyCode): CurrencyCode {
  const s = countryLabel.toLowerCase();
  if (s.includes("norway") || s.includes("norge")) return "NOK";
  if (s.includes("sweden") || s.includes("sverige")) return "SEK";
  if (s.includes("denmark") || s.includes("danmark")) return "DKK";
  if (s.includes("switzerland") || s.includes("swiss")) return "CHF";
  if (s.includes("united kingdom") || s.includes("britain") || s.includes("england") || s.includes("uk"))
    return "GBP";
  if (s.includes("canada") || s.includes("ontario") || s.includes("québec") || s.includes("quebec"))
    return "CAD";
  if (s.includes("united states") || s.includes("usa")) return "USD";
  return fallback;
}

export function currencyFromSymbol(symbol: string): CurrencyCode {
  if (symbol === "$") return "USD";
  if (symbol === "C$") return "CAD";
  if (symbol === "£") return "GBP";
  return "EUR";
}

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
};

const CurrencyContext = createContext<Ctx>({ currency: "EUR", setCurrency: () => {} });

const STORAGE_KEY = "autovere.currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (stored && stored in RATES) setCurrencyState(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

/**
 * Helpers bound to a base currency (the currency the trip figures are stored in)
 * and the user's selected display currency.
 */
export function useMoney(baseSymbol: string) {
  const { currency } = useCurrency();
  const base = currencyFromSymbol(baseSymbol);

  return useMemo(
    () => ({
      base,
      display: currency,
      /** Format a base-currency value in the user's selected currency. */
      fmt: (value: number, decimals?: number) =>
        formatCurrency(convert(value, base, currency), currency, decimals === undefined ? {} : { decimals }),
      /** Format a base-currency value in the currency actually charged locally. */
      native: (value: number, countryLabel: string) => {
        const nat = nativeCurrencyFor(countryLabel, base);
        return { code: nat, text: formatCurrency(convert(value, base, nat), nat) };
      },
      rateNote: (from: CurrencyCode = base) => rateNote(from, currency),
    }),
    [base, currency],
  );
}

/**
 * Rewrites inline EUR amounts in prose ("€4.90", "4,90 €", "€29") into the
 * user's selected display currency so pricing copy follows the header switcher.
 */
export function localizeEuroText(text: string, code: CurrencyCode): string {
  if (!text || code === "EUR") return text;
  const num = (raw: string) => Number(raw.replace(/\s/g, "").replace(",", "."));
  const out = (v: number, hadDecimals: boolean) =>
    formatCurrency(convert(v, "EUR", code), code, { decimals: hadDecimals ? 2 : 0 });

  return text
    .replace(/€\s?(\d+(?:[.,]\d{1,2})?)/g, (_m, d: string) => out(num(d), /[.,]/.test(d)))
    .replace(/(\d+(?:[.,]\d{1,2})?)\s?€/g, (_m, d: string) => out(num(d), /[.,]/.test(d)));
}
