export const CURRENCIES = ["EUR", "NOK", "SEK", "DKK", "CHF", "GBP", "PLN", "CZK", "HUF", "RON", "BGN", "ISK"] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

// The Bulgarian Lev is fixed by law to the euro under Bulgaria's currency-board arrangement
// (in force since 1997, unchanged): exactly 1 EUR = 1.95583 BGN. This is not an estimate and
// is not part of the live feed below (the ECB/Frankfurter reference-rate list does not carry
// BGN, precisely because it is a hard peg rather than a floating rate) — it never needs
// refreshing and is always used for BGN regardless of live-rate availability.
const BGN_FIXED_PEG = 1.95583;

// Last-resort static fallback ONLY, for every currency except BGN. Used when the live rate
// service (European Central Bank reference rates, via the free api.frankfurter.dev proxy)
// cannot be reached AND no cached rates exist locally yet — e.g. a user's very first visit
// with no network access to the API. Not authoritative and not refreshed automatically; real
// rates always take priority when available. See refreshExchangeRates() below.
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1, NOK: 11.7, SEK: 11.4, DKK: 7.46, CHF: 0.95, GBP: 0.86,
  PLN: 4.3, CZK: 25.2, HUF: 404, RON: 4.98, BGN: BGN_FIXED_PEG, ISK: 145,
};

export type RatesMeta = { source: "fallback" | "cached" | "live"; date: string | null };

let activeRates: Record<CurrencyCode, number> = { ...FALLBACK_RATES };
let ratesMeta: RatesMeta = { source: "fallback", date: null };
const listeners = new Set<() => void>();

const STORAGE_KEY = "autovere-fx-rates";

function notify() {
  for (const listener of listeners) listener();
}

export function onRatesChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRatesMeta(): RatesMeta {
  return ratesMeta;
}

export function loadCachedRates() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { rates?: Partial<Record<CurrencyCode, number>>; date?: string };
    if (!parsed.rates || !parsed.date) return;
    activeRates = { ...FALLBACK_RATES, ...parsed.rates, EUR: 1 };
    ratesMeta = { source: "cached", date: parsed.date };
    notify();
  } catch {
    // Corrupt or unavailable cache — keep the static fallback.
  }
}

let refreshInFlight: Promise<void> | null = null;

export function refreshExchangeRates(): Promise<void> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const symbols = CURRENCIES.filter((code) => code !== "EUR").join(",");
      const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=EUR&symbols=${symbols}`);
      if (!response.ok) throw new Error(`Exchange rate service responded ${response.status}`);
      const data = (await response.json()) as { date?: string; rates?: Record<string, number> };
      if (!data.date || !data.rates) throw new Error("Unexpected exchange rate response shape");
      const rates: Record<CurrencyCode, number> = { ...FALLBACK_RATES };
      for (const code of CURRENCIES) {
        if (code === "EUR" || code === "BGN") continue; // EUR is the base; BGN is a fixed peg, see above.
        const value = data.rates[code];
        if (typeof value === "number" && value > 0) rates[code] = value;
      }
      activeRates = rates;
      ratesMeta = { source: "live", date: data.date };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ rates, date: data.date }));
      notify();
    } catch (error) {
      console.error("Fetching live exchange rates failed; using cached/fallback rates", error);
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export function formatCurrency(amountEur: number, currency: CurrencyCode, locale: string = "en"): string {
  const value = amountEur * (activeRates[currency] ?? 1);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: value < 100 ? 2 : 0,
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}
