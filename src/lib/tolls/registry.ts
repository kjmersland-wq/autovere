import type { TollConfidence } from "./types";

/** Land-for-land registry: the single source of truth for which toll data source backs each
 * country, how much to trust it, and where to send the user for a better number. Also drives
 * the FAQ "data sources" table — add a country here (and a provider in ./providers/) rather
 * than editing the FAQ copy by hand. See README.md for how to add a new country. */
export type CountryTollConfig = {
  code: string;
  countryName: string;
  providerId:
    | "norway-nvdb"
    | "austria-vignette"
    | "switzerland-vignette"
    | "germany-free"
    | "generic-vignette"
    | "generic-distance";
  accuracy: TollConfidence;
  sourceName: string;
  sourceUrl: string;
  externalCalculatorUrl?: string;
  lastUpdated: string;
};

const OFFICIAL_VIGNETTE_SOURCES: Record<
  string,
  { name: string; url: string; countryName: string }
> = {
  SI: {
    name: "DARS — evinjeta (official)",
    url: "https://evinjeta.dars.si/",
    countryName: "Slovenia",
  },
  CZ: { name: "edalnice.cz (official)", url: "https://edalnice.cz/en/", countryName: "Czechia" },
  SK: { name: "eznamka.sk (official)", url: "https://eznamka.sk/en/", countryName: "Slovakia" },
  HU: {
    name: "Nemzeti Útdíj (official)",
    url: "https://ematrica.nemzetiutdij.hu/en",
    countryName: "Hungary",
  },
  RO: {
    name: "CNAIR — Rovinieta (official)",
    url: "https://www.erovinieta.ro/vignettes-portal-web/",
    countryName: "Romania",
  },
  BG: { name: "BG TOLL (official)", url: "https://web.bgtoll.bg/", countryName: "Bulgaria" },
};

const OFFICIAL_DISTANCE_SOURCES: Record<
  string,
  { name: string; url: string; countryName: string }
> = {
  FR: {
    name: "Autoroutes.fr (official operators)",
    url: "https://www.autoroutes.fr/en/toll.htm",
    countryName: "France",
  },
  IT: {
    name: "Autostrade per l'Italia (official)",
    url: "https://www.autostrade.it/en/home",
    countryName: "Italy",
  },
  ES: {
    name: "Spanish DGT road info",
    url: "https://infocar.dgt.es/etraffic/",
    countryName: "Spain",
  },
  PT: {
    name: "Infraestruturas de Portugal (official)",
    url: "https://www.infraestruturasdeportugal.pt/en",
    countryName: "Portugal",
  },
  HR: { name: "HAC — Croatian motorways", url: "https://hac.hr/en", countryName: "Croatia" },
  GR: {
    name: "Greek motorway operators",
    url: "https://www.olympiaodos.gr/en/",
    countryName: "Greece",
  },
  PL: { name: "e-TOLL (official)", url: "https://etoll.gov.pl/en/", countryName: "Poland" },
};

export const TOLL_COUNTRY_REGISTRY: Record<string, CountryTollConfig> = {
  NO: {
    code: "NO",
    countryName: "Norway",
    providerId: "norway-nvdb",
    accuracy: "high",
    sourceName: "Statens vegvesen NVDB API (vegobjekttype 45 — bomstasjoner)",
    sourceUrl: "https://nvdbapiles.atlas.vegvesen.no/",
    externalCalculatorUrl: "https://bomkalk.no/",
    lastUpdated: "2026-09-10",
  },
  AT: {
    code: "AT",
    countryName: "Austria",
    providerId: "austria-vignette",
    accuracy: "medium",
    sourceName: "ASFINAG (official toll shop)",
    sourceUrl: "https://www.asfinag.at/toll/vignette/",
    externalCalculatorUrl: "https://shop.asfinag.at/en/toll-planner-route-planning/",
    lastUpdated: "2026-09-10",
  },
  CH: {
    code: "CH",
    countryName: "Switzerland",
    providerId: "switzerland-vignette",
    accuracy: "high",
    sourceName: "Swiss Federal Office for Customs and Border Security (BAZG)",
    sourceUrl: "https://via.admin.ch/shop/dashboard",
    externalCalculatorUrl: "https://via.admin.ch/shop/dashboard",
    lastUpdated: "2026-09-10",
  },
  DE: {
    code: "DE",
    countryName: "Germany",
    providerId: "germany-free",
    accuracy: "high",
    sourceName: "German federal motorway toll rules (passenger cars are toll-free)",
    sourceUrl: "https://www.toll-collect.de/en/",
    lastUpdated: "2026-09-10",
  },
  ...Object.fromEntries(
    Object.entries(OFFICIAL_VIGNETTE_SOURCES).map(([code, src]) => [
      code,
      {
        code,
        countryName: src.countryName,
        providerId: "generic-vignette" as const,
        accuracy: "medium" as const,
        sourceName: src.name,
        sourceUrl: src.url,
        externalCalculatorUrl: src.url,
        lastUpdated:
          "2025 pricing — not reverified for 2026, confirm on the official portal before travel",
      },
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(OFFICIAL_DISTANCE_SOURCES).map(([code, src]) => [
      code,
      {
        code,
        countryName: src.countryName,
        providerId: "generic-distance" as const,
        accuracy: "low" as const,
        sourceName: src.name,
        sourceUrl: src.url,
        externalCalculatorUrl: src.url,
        lastUpdated: "Indicative average €/km — not a per-route calculation",
      },
    ]),
  ),
};

export function tollConfigFor(code: string): CountryTollConfig | null {
  return TOLL_COUNTRY_REGISTRY[code] ?? null;
}
