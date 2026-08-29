import { useCallback, useEffect, useRef, useState } from "react";
import { CURRENCIES, type CurrencyCode, getRatesMeta, loadCachedRates, onRatesChange, refreshExchangeRates, type RatesMeta } from "@/lib/currency";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "autovere-currency";

// A sensible first guess only — never applied once the user (or their saved account
// preference) has made an actual choice. Eurozone-associated languages default to EUR.
const LOCALE_DEFAULT_CURRENCY: Record<Locale, CurrencyCode> = {
  en: "EUR", de: "EUR", nl: "EUR", fr: "EUR", pl: "PLN", no: "NOK", sv: "SEK", da: "DKK",
};

function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

export function useCurrency(locale: Locale): { currency: CurrencyCode; setCurrency: (next: CurrencyCode) => void; ratesMeta: RatesMeta } {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");
  const [ratesMeta, setRatesMeta] = useState<RatesMeta>(getRatesMeta());
  const explicitChoice = useRef(false);

  useEffect(() => {
    loadCachedRates();
    setRatesMeta(getRatesMeta());
    void refreshExchangeRates().then(() => setRatesMeta(getRatesMeta()));
    return onRatesChange(() => setRatesMeta(getRatesMeta()));
  }, []);

  // An anonymous or previously-set local preference on this device.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isCurrencyCode(saved)) {
        explicitChoice.current = true;
        setCurrencyState(saved);
      }
    } catch {
      // Private browsing / storage disabled — fall through to the locale-based default.
    }
  }, []);

  // A logged-in user's saved account preference. Applied once it loads, unless a more
  // specific local choice on this device has already taken precedence.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/account?view=settings")
      .then(async (response) => {
        if (!response.ok || cancelled) return;
        const body = (await response.json()) as { settings?: { currency?: string | null } };
        const saved = body.settings?.currency;
        if (isCurrencyCode(saved) && !explicitChoice.current) {
          setCurrencyState(saved);
        }
      })
      .catch(() => {
        // Not logged in, or account settings unavailable — keep the local/default currency.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Locale-based first guess, only while nothing more specific has been chosen yet. Reacts to
  // locale so it still applies correctly once a saved language finishes loading from storage.
  useEffect(() => {
    if (explicitChoice.current) return;
    setCurrencyState(LOCALE_DEFAULT_CURRENCY[locale] ?? "EUR");
  }, [locale]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    explicitChoice.current = true;
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — the choice still applies for this session.
    }
    fetch("/api/account?view=settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: next }),
    }).catch(() => {
      // Not logged in, or save failed — the local preference above still applies.
    });
  }, []);

  return { currency, setCurrency, ratesMeta };
}
