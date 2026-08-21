import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Minimal i18n layer. Add a new locale by adding a dictionary below —
 * every string in the UI resolves through useT().
 */
export const en = {
  brand: "AutoVere",
  tagline: "European toll, vignette & charging intelligence",
  heroTitle: "Know the real cost before you drive.",
  heroSub:
    "Instant, deterministic toll, vignette, fuel and charging estimates for any European road trip — built on open data, no accounts, no reseller markups.",
  from: "From",
  to: "To",
  fromPlaceholder: "Oslo, Norway",
  toPlaceholder: "Milan, Italy",
  vehicle: "Vehicle",
  petrol: "Petrol",
  diesel: "Diesel",
  ev: "Electric (EV)",
  batteryRange: "Real-world range",
  tripDuration: "Trip duration",
  days: "days",
  day: "day",
  calculate: "Calculate my trip",
  calculating: "Calculating…",
  comparison: "Route comparison",
  fastest: "Fastest Route",
  bypass: "Smart Bypass",
  tollfree: "100% Toll-Free",
  distance: "Distance",
  driveTime: "Drive time",
  fuel: "Fuel",
  charging: "Charging",
  tolls: "Distance tolls",
  vignettes: "Vignettes",
  total: "Total trip cost",
  openGoogle: "Open in Google Maps",
  openApple: "Open in Apple Maps",
  downloadGpx: "Download GPX",
  checklist: "Official vignette checklist",
  checklistSub:
    "Buy only from these official government portals. Resellers charge up to 300% markup for the same vignette.",
  chargingStops: "Charging stops",
  chargingTime: "Charging time",
  noVignettes: "No vignettes required on this route.",
  selected: "Selected",
  select: "Select route",
  savings: "saves",
  slower: "slower",
  faster: "faster",
} as const;

export type Dict = typeof en;
export const locales: Record<string, Dict> = { en };

const I18nContext = createContext<{ t: Dict; locale: string; setLocale: (l: string) => void }>({
  t: en,
  locale: "en",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en");
  const value = useMemo(
    () => ({ t: locales[locale] ?? en, locale, setLocale }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): Dict {
  return useContext(I18nContext).t;
}
