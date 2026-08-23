// Static, offline reference data for European road charges and energy prices.
// Figures are indicative averages for passenger cars (category B / up to 3.5t).

export type VignetteTier = { maxDays: number; label: string; price: number };

export type VignetteCountry = {
  code: string;
  authority: string;
  url: string;
  tiers: VignetteTier[];
  note?: string;
};

export const VIGNETTES: Record<string, VignetteCountry> = {
  AT: {
    code: "AT",
    authority: "ASFINAG (official)",
    url: "https://www.asfinag.at/toll/vignette/",
    tiers: [
      { maxDays: 1, label: "1-day vignette", price: 9.3 },
      { maxDays: 10, label: "10-day vignette", price: 12.4 },
      { maxDays: 60, label: "2-month vignette", price: 30.6 },
      { maxDays: 365, label: "Annual vignette", price: 106.8 },
    ],
    note: "Special tolls (Brenner, Tauern, Arlberg tunnels) are charged separately.",
  },
  CH: {
    code: "CH",
    authority: "Swiss Federal Office for Customs (official)",
    url: "https://via.admin.ch/shop/dashboard",
    tiers: [{ maxDays: 365, label: "Annual e-vignette (CHF 40)", price: 42.0 }],
    note: "Switzerland only sells an annual vignette — no short-term option exists.",
  },
  SI: {
    code: "SI",
    authority: "DARS — evinjeta (official)",
    url: "https://evinjeta.dars.si/",
    tiers: [
      { maxDays: 1, label: "1-day e-vignette", price: 8.0 },
      { maxDays: 7, label: "7-day e-vignette", price: 16.0 },
      { maxDays: 30, label: "Monthly e-vignette", price: 32.0 },
      { maxDays: 365, label: "Annual e-vignette", price: 117.5 },
    ],
  },
  CZ: {
    code: "CZ",
    authority: "edalnice.cz (official)",
    url: "https://edalnice.cz/en/",
    tiers: [
      { maxDays: 1, label: "1-day e-vignette", price: 8.2 },
      { maxDays: 10, label: "10-day e-vignette", price: 10.9 },
      { maxDays: 30, label: "Monthly e-vignette", price: 17.4 },
      { maxDays: 365, label: "Annual e-vignette", price: 93.0 },
    ],
  },
  SK: {
    code: "SK",
    authority: "eznamka.sk (official)",
    url: "https://eznamka.sk/en/",
    tiers: [
      { maxDays: 1, label: "1-day e-vignette", price: 5.4 },
      { maxDays: 10, label: "10-day e-vignette", price: 12.0 },
      { maxDays: 30, label: "Monthly e-vignette", price: 17.0 },
      { maxDays: 365, label: "365-day e-vignette", price: 90.0 },
    ],
  },
  HU: {
    code: "HU",
    authority: "Nemzeti Útdíj (official)",
    url: "https://ematrica.nemzetiutdij.hu/en",
    tiers: [
      { maxDays: 1, label: "1-day e-matrica", price: 14.0 },
      { maxDays: 10, label: "10-day e-matrica", price: 14.0 },
      { maxDays: 30, label: "Monthly e-matrica", price: 22.5 },
      { maxDays: 365, label: "Annual e-matrica", price: 145.0 },
    ],
  },
  RO: {
    code: "RO",
    authority: "CNAIR — Rovinieta (official)",
    url: "https://www.erovinieta.ro/vignettes-portal-web/",
    tiers: [
      { maxDays: 1, label: "1-day rovinieta", price: 3.5 },
      { maxDays: 7, label: "7-day rovinieta", price: 6.0 },
      { maxDays: 30, label: "30-day rovinieta", price: 10.0 },
      { maxDays: 365, label: "Annual rovinieta", price: 50.0 },
    ],
  },
  BG: {
    code: "BG",
    authority: "BG TOLL (official)",
    url: "https://web.bgtoll.bg/",
    tiers: [
      { maxDays: 1, label: "Weekend vignette", price: 5.0 },
      { maxDays: 7, label: "7-day vignette", price: 8.0 },
      { maxDays: 30, label: "30-day vignette", price: 15.0 },
      { maxDays: 365, label: "Annual vignette", price: 50.0 },
    ],
  },
};

/** Indicative motorway toll cost per km driven on tolled motorways. */
export const DISTANCE_TOLLS: Record<string, { perKm: number; authority: string; url: string }> = {
  FR: {
    perKm: 0.095,
    authority: "Autoroutes.fr (official operators)",
    url: "https://www.autoroutes.fr/en/toll.htm",
  },
  IT: {
    perKm: 0.078,
    authority: "Autostrade per l'Italia (official)",
    url: "https://www.autostrade.it/en/home",
  },
  ES: { perKm: 0.035, authority: "Spanish DGT road info", url: "https://infocar.dgt.es/etraffic/" },
  PT: {
    perKm: 0.062,
    authority: "Infraestruturas de Portugal (official)",
    url: "https://www.infraestruturasdeportugal.pt/en",
  },
  HR: { perKm: 0.055, authority: "HAC — Croatian motorways", url: "https://hac.hr/en" },
  GR: { perKm: 0.048, authority: "Greek motorway operators", url: "https://www.olympiaodos.gr/en/" },
  PL: { perKm: 0.032, authority: "e-TOLL (official)", url: "https://etoll.gov.pl/en/" },
  NO: {
    perKm: 0.028,
    authority: "Norwegian toll roads (Statens vegvesen)",
    url: "https://www.vegvesen.no/en/traffic/travel-planning/toll-roads/",
  },
  DK: {
    perKm: 0,
    authority: "Storebælt / Øresund bridges",
    url: "https://storebaelt.dk/en/prices/",
  },
};

export const NORDIC_BRIDGES = {
  storebaelt: {
    label: "Storebælt bridge",
    detail: "Indicative passenger-car crossing fee",
    amount: 38,
    country: "DK",
    url: "https://storebaelt.dk/en/prices/",
  },
  oresund: {
    label: "Øresund bridge",
    detail: "Indicative passenger-car crossing fee",
    amount: 58,
    country: "DK",
    url: "https://www.oresundsbron.com/en/prices",
  },
} as const;

/** Indicative pump / charging prices per country (EUR). */
export const ENERGY_PRICES: Record<string, { petrol: number; diesel: number; kwh: number }> = {
  NO: { petrol: 1.86, diesel: 1.79, kwh: 0.55 },
  SE: { petrol: 1.62, diesel: 1.7, kwh: 0.52 },
  DK: { petrol: 1.85, diesel: 1.62, kwh: 0.58 },
  DE: { petrol: 1.76, diesel: 1.68, kwh: 0.65 },
  NL: { petrol: 2.05, diesel: 1.79, kwh: 0.69 },
  BE: { petrol: 1.79, diesel: 1.75, kwh: 0.62 },
  LU: { petrol: 1.6, diesel: 1.55, kwh: 0.55 },
  FR: { petrol: 1.82, diesel: 1.73, kwh: 0.6 },
  ES: { petrol: 1.61, diesel: 1.52, kwh: 0.52 },
  PT: { petrol: 1.75, diesel: 1.6, kwh: 0.5 },
  CH: { petrol: 1.83, diesel: 1.9, kwh: 0.62 },
  AT: { petrol: 1.6, diesel: 1.58, kwh: 0.58 },
  IT: { petrol: 1.85, diesel: 1.78, kwh: 0.79 },
  SI: { petrol: 1.53, diesel: 1.52, kwh: 0.44 },
  HR: { petrol: 1.5, diesel: 1.48, kwh: 0.45 },
  CZ: { petrol: 1.5, diesel: 1.46, kwh: 0.42 },
  SK: { petrol: 1.55, diesel: 1.53, kwh: 0.45 },
  HU: { petrol: 1.53, diesel: 1.56, kwh: 0.42 },
  PL: { petrol: 1.42, diesel: 1.44, kwh: 0.4 },
  RO: { petrol: 1.4, diesel: 1.45, kwh: 0.35 },
  BG: { petrol: 1.32, diesel: 1.38, kwh: 0.35 },
  GR: { petrol: 1.9, diesel: 1.7, kwh: 0.55 },
};

export const DEFAULT_ENERGY = { petrol: 1.75, diesel: 1.68, kwh: 0.58 };

export function vignetteFor(code: string, days: number): VignetteTier | null {
  const c = VIGNETTES[code];
  if (!c) return null;
  const tier = c.tiers.find((t) => days <= t.maxDays);
  return tier ?? c.tiers[c.tiers.length - 1]!;
}
