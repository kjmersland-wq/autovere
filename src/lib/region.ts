// Region-aware automotive intelligence
// Detects user region from browser locale + timezone, returns localized links/insights.

import { getOwnershipText, getRegionLabel, interpolate } from "@/i18n/localized-content";

export type RegionCode = "NO" | "SE" | "DE" | "GB" | "US" | "CA" | "FR" | "NL" | "DK" | "FI" | "IT" | "ES" | "AU" | "EU" | "GLOBAL";

export type Region = {
  code: RegionCode;
  name: string;
  language: string;
  currency: string;
  chargingStandard: "CCS" | "NACS" | "CCS/NACS" | "CCS/CHAdeMO";
  climate: "nordic-winter" | "continental" | "temperate" | "mediterranean" | "north-american" | "oceanic";
  flag: string;
};

const REGIONS: Record<RegionCode, Region> = {
  NO: { code: "NO", name: "Norway", language: "no", currency: "EUR", chargingStandard: "CCS", climate: "nordic-winter", flag: "🇳🇴" },
  SE: { code: "SE", name: "Sweden", language: "sv", currency: "EUR", chargingStandard: "CCS", climate: "nordic-winter", flag: "🇸🇪" },
  DK: { code: "DK", name: "Denmark", language: "da", currency: "EUR", chargingStandard: "CCS", climate: "nordic-winter", flag: "🇩🇰" },
  FI: { code: "FI", name: "Finland", language: "fi", currency: "EUR", chargingStandard: "CCS", climate: "nordic-winter", flag: "🇫🇮" },
  DE: { code: "DE", name: "Germany", language: "de", currency: "EUR", chargingStandard: "CCS", climate: "continental", flag: "🇩🇪" },
  GB: { code: "GB", name: "United Kingdom", language: "en", currency: "EUR", chargingStandard: "CCS", climate: "oceanic", flag: "🇬🇧" },
  FR: { code: "FR", name: "France", language: "fr", currency: "EUR", chargingStandard: "CCS", climate: "temperate", flag: "🇫🇷" },
  NL: { code: "NL", name: "Netherlands", language: "nl", currency: "EUR", chargingStandard: "CCS", climate: "oceanic", flag: "🇳🇱" },
  IT: { code: "IT", name: "Italy", language: "it", currency: "EUR", chargingStandard: "CCS", climate: "mediterranean", flag: "🇮🇹" },
  ES: { code: "ES", name: "Spain", language: "es", currency: "EUR", chargingStandard: "CCS", climate: "mediterranean", flag: "🇪🇸" },
  US: { code: "US", name: "United States", language: "en", currency: "EUR", chargingStandard: "CCS/NACS", climate: "north-american", flag: "🇺🇸" },
  CA: { code: "CA", name: "Canada", language: "en", currency: "EUR", chargingStandard: "CCS/NACS", climate: "north-american", flag: "🇨🇦" },
  AU: { code: "AU", name: "Australia", language: "en", currency: "EUR", chargingStandard: "CCS", climate: "temperate", flag: "🇦🇺" },
  EU: { code: "EU", name: "Europe", language: "en", currency: "EUR", chargingStandard: "CCS", climate: "temperate", flag: "🇪🇺" },
  GLOBAL: { code: "GLOBAL", name: "Global", language: "en", currency: "EUR", chargingStandard: "CCS", climate: "temperate", flag: "🌍" },
};

const STORAGE_KEY = "autovere.region";

export function detectRegion(): Region {
  if (typeof window === "undefined") return REGIONS.GLOBAL;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as RegionCode | null;
    if (stored && REGIONS[stored]) return REGIONS[stored];
  } catch {}

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const locale = (navigator.languages?.[0] || navigator.language || "en-US").toLowerCase();
  const country = locale.split("-")[1]?.toUpperCase();

  // timezone hints first (more specific)
  if (tz.includes("Oslo")) return REGIONS.NO;
  if (tz.includes("Stockholm")) return REGIONS.SE;
  if (tz.includes("Copenhagen")) return REGIONS.DK;
  if (tz.includes("Helsinki")) return REGIONS.FI;
  if (tz.includes("Berlin") || tz.includes("Frankfurt")) return REGIONS.DE;
  if (tz.includes("London")) return REGIONS.GB;
  if (tz.includes("Paris")) return REGIONS.FR;
  if (tz.includes("Amsterdam")) return REGIONS.NL;
  if (tz.includes("Rome")) return REGIONS.IT;
  if (tz.includes("Madrid")) return REGIONS.ES;
  if (tz.startsWith("America/")) return tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") ? REGIONS.CA : REGIONS.US;
  if (tz.startsWith("Australia/")) return REGIONS.AU;

  if (country && REGIONS[country as RegionCode]) return REGIONS[country as RegionCode];
  return REGIONS.GLOBAL;
}

export function setRegion(code: RegionCode) {
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
}

export function listRegions(): Region[] {
  return [REGIONS.NO, REGIONS.SE, REGIONS.DK, REGIONS.FI, REGIONS.DE, REGIONS.GB, REGIONS.FR, REGIONS.NL, REGIONS.IT, REGIONS.ES, REGIONS.US, REGIONS.CA, REGIONS.AU];
}

export function getRegionDisplayName(region: Region, lang: string) {
  return getRegionLabel(lang, region.code);
}

// ---- Manufacturer ecosystem links (region-aware) ----

type BrandLinks = {
  official: (region: Region, model: string) => string;
  configurator: (region: Region, model: string) => string;
  testDrive: (region: Region, model: string) => string;
  dealerLocator: (region: Region) => string;
  charging?: (region: Region) => string;
};

const tld = (region: Region, map: Record<string, string>, fallback = "com") =>
  map[region.code] || map[region.language] || fallback;

export const BRAND_LINKS: Record<string, BrandLinks> = {
  Polestar: {
    official: (r, m) => `https://www.polestar.com/${r.code.toLowerCase()}/${m}/`,
    configurator: (r, m) => `https://www.polestar.com/${r.code.toLowerCase()}/${m}/order/`,
    testDrive: (r, m) => `https://www.polestar.com/${r.code.toLowerCase()}/test-drive/`,
    dealerLocator: (r) => `https://www.polestar.com/${r.code.toLowerCase()}/spaces/`,
    charging: () => `https://www.polestar.com/charging/`,
  },
  Volvo: {
    official: (r, m) => `https://www.volvocars.com/${r.code.toLowerCase()}/cars/${m}-electric/`,
    configurator: (r, m) => `https://www.volvocars.com/${r.code.toLowerCase()}/build/${m}/`,
    testDrive: (r, m) => `https://www.volvocars.com/${r.code.toLowerCase()}/book-test-drive/`,
    dealerLocator: (r) => `https://www.volvocars.com/${r.code.toLowerCase()}/dealers/`,
    charging: () => `https://www.volvocars.com/intl/v/cars/charging/`,
  },
  BMW: {
    official: (r, m) => `https://www.bmw.${tld(r, { US: "com", CA: "ca", GB: "co.uk", DE: "de", NO: "no", SE: "se" }, "com")}/${r.language}/all-models/${m}.html`,
    configurator: (r, m) => `https://www.bmw.${tld(r, { US: "com", CA: "ca", GB: "co.uk", DE: "de", NO: "no", SE: "se" })}/${r.language}/configurator.html`,
    testDrive: (r, m) => `https://www.bmw.${tld(r, { US: "com", CA: "ca", GB: "co.uk", DE: "de", NO: "no", SE: "se" })}/${r.language}/forms/test-drive.html`,
    dealerLocator: (r) => `https://www.bmw.${tld(r, { US: "com", CA: "ca", GB: "co.uk", DE: "de", NO: "no", SE: "se" })}/${r.language}/general/dealer-locator.html`,
    charging: () => `https://www.bmw.com/en/innovation/electromobility-charging.html`,
  },
  "Mercedes-Benz": {
    official: (r, m) => `https://www.mercedes-benz.${tld(r, { US: "com", CA: "ca", GB: "co.uk", DE: "de", NO: "no", SE: "se" })}/passengercars/mercedes-benz-cars/models.html`,
    configurator: (r, m) => `https://www.mercedes-benz.${tld(r, { US: "com", DE: "de", GB: "co.uk", NO: "no", SE: "se" })}/passengercars/configurator.html`,
    testDrive: (r, m) => `https://www.mercedes-benz.${tld(r, { US: "com", DE: "de", GB: "co.uk", NO: "no", SE: "se" })}/test-drive.html`,
    dealerLocator: (r) => `https://www.mercedes-benz.${tld(r, { US: "com", DE: "de", GB: "co.uk", NO: "no", SE: "se" })}/dealer-locator.html`,
    charging: () => `https://www.mercedes-benz.com/en/vehicles/electric-mobility/charging/`,
  },
  Kia: {
    official: (r, m) => `https://www.kia.com/${r.code.toLowerCase()}/vehicles/${m}.html`,
    configurator: (r, m) => `https://www.kia.com/${r.code.toLowerCase()}/build-your-kia/${m}.html`,
    testDrive: (r, m) => `https://www.kia.com/${r.code.toLowerCase()}/forms/test-drive.html`,
    dealerLocator: (r) => `https://www.kia.com/${r.code.toLowerCase()}/dealers/find-a-dealer.html`,
    charging: () => `https://www.kia.com/dam/kwcms/kme/global/en/assets/vehicles/charging/`,
  },
};

export function brandLinks(brand: string, region: Region, modelSlug: string) {
  const base = BRAND_LINKS[brand];
  if (!base) {
    return {
      official: `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${modelSlug} official ${region.name}`)}`,
      configurator: `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${modelSlug} configurator`)}`,
      testDrive: `https://www.google.com/search?q=${encodeURIComponent(`${brand} test drive ${region.name}`)}`,
      dealerLocator: `https://www.google.com/search?q=${encodeURIComponent(`${brand} dealer ${region.name}`)}`,
      charging: undefined as string | undefined,
    };
  }
  return {
    official: base.official(region, modelSlug),
    configurator: base.configurator(region, modelSlug),
    testDrive: base.testDrive(region, modelSlug),
    dealerLocator: base.dealerLocator(region),
    charging: base.charging?.(region),
  };
}

// ---- Localized ownership intelligence ----

export type OwnershipInsight = { icon: "snow" | "highway" | "city" | "charge" | "incentive" | "comfort"; title: string; body: string };

export function regionalOwnership(region: Region, brand: string, lang = "en"): OwnershipInsight[] {
  const localized = getOwnershipText(lang, region.climate);
  if (localized?.length) {
    const regionLabel = getRegionDisplayName(region, lang);
    const iconMap: Record<string, OwnershipInsight["icon"][]> = {
      "nordic-winter": ["snow", "comfort", "charge"],
      continental: ["highway", "charge", "incentive"],
      oceanic: ["city", "charge", "incentive"],
      mediterranean: ["comfort", "charge", "incentive"],
      "north-american": ["highway", "charge", "incentive"],
      temperate: ["comfort", "charge", "incentive"],
    };
    return localized.map((entry, index) => ({
      icon: iconMap[region.climate]?.[index] ?? "comfort",
      title: interpolate(entry.title, { region: regionLabel, standard: region.chargingStandard, brand }),
      body: interpolate(entry.body, { region: regionLabel, standard: region.chargingStandard, brand }),
    }));
  }
  const climate = region.climate;
  const insights: OwnershipInsight[] = [];

  if (climate === "nordic-winter") {
    insights.push(
      { icon: "snow", title: "Cold-weather range", body: `Expect ~25–30% range loss at −10°C. Heat pump + pre-conditioning while plugged in protect daily usable range in ${region.name}.` },
      { icon: "comfort", title: "Snow-road composure", body: "AWD with progressive torque blending stays planted on packed snow and slush — confidence on dark winter commutes." },
      { icon: "charge", title: `${region.chargingStandard} network`, body: `${region.name} has one of the densest fast-charging networks in the world. Plan stops every 250–300 km in winter.` },
    );
  } else if (climate === "north-american") {
    insights.push(
      { icon: "highway", title: "Long-distance highway travel", body: `Designed for the open road. Steady 110 km/h cruising and Supercharger-class fast charging make cross-state trips effortless.` },
      { icon: "charge", title: `${region.chargingStandard} compatibility`, body: `Adapter-ready for the growing NACS ecosystem — Tesla Superchargers + Electrify America cover most corridors in ${region.name}.` },
      { icon: "incentive", title: "Federal & state incentives", body: "Up to €7,500 equivalent incentive support on qualifying EVs, with additional state and utility rebates depending on ZIP code." },
    );
  } else if (climate === "continental") {
    insights.push(
      { icon: "highway", title: "Autobahn comfort", body: "Stable at 180+ km/h with calm cabin acoustics and recuperation tuned for long, fast continental drives." },
      { icon: "charge", title: "European HPC network", body: "IONITY, EnBW, Fastned and Tesla open-network sites give you 250–350 kW corridors across Germany and beyond." },
      { icon: "incentive", title: "Company-car taxation", body: "Favorable Dienstwagen taxation makes premium EVs notably cheaper as company cars than equivalent ICE models." },
    );
  } else if (climate === "oceanic") {
    insights.push(
      { icon: "city", title: "Urban manoeuvrability", body: "Tight turning circle and slim parking footprint — at home in narrow streets and multi-storey car parks." },
      { icon: "charge", title: "Public charging access", body: "Dense rapid network on motorways; home charging via 7 kW wallbox covers most weekly use." },
      { icon: "incentive", title: "BIK & ULEZ benefits", body: "Low Benefit-in-Kind and zero ULEZ charges keep total monthly cost competitive in city living." },
    );
  } else {
    insights.push(
      { icon: "comfort", title: "Daily liveability", body: "Refined ride, calm cabin, and intuitive ownership — the kind of car that disappears in the best way during daily life." },
      { icon: "charge", title: `${region.chargingStandard} compatibility`, body: "Standard fast-charging support compatible with the regional public network." },
      { icon: "incentive", title: "Local incentives", body: `Check current EV incentives in ${region.name} — they can change quarterly.` },
    );
  }
  return insights;
}
