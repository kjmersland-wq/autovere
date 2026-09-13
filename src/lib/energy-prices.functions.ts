import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Live energy pricing feed — country by country, from open official sources.
 *
 * - EU-27 pump prices: European Commission Weekly Oil Bulletin (weekly, with taxes)
 * - France: refreshed from the government instant station feed (median of ~9,000 stations)
 * - Norway: Statistics Norway (SSB) monthly pump prices in NOK
 * - United States: U.S. EIA weekly retail update (USD/gal)
 * - Canada: Statistics Canada monthly retail prices (¢/L)
 * - FX: ECB reference rates (frankfurter.dev)
 *
 * Countries without an open feed (UK, Switzerland, Iceland …) use a dated
 * reference level that is clearly labelled as such in the UI.
 */

export type CountryFuelPrice = {
  code: string;
  /** Pump price per litre, expressed in the response currency. */
  petrol: number;
  diesel: number;
  /** Public DC fast-charging reference per kWh, response currency. */
  kwh: number;
  /** Same prices in the currency actually charged at the pump. */
  local: { currency: string; petrol: number; diesel: number };
  source: string;
  sourceUrl: string;
  asOf: string;
  live: boolean;
};

export type EnergyPrices = {
  /** Currency symbol the numbers below are expressed in. */
  currency: "€" | "$" | "C$";
  currencyCode: "EUR" | "USD" | "CAD";
  /** Region-default petrol price per litre (per US gallon for the us region). */
  petrol: number;
  diesel: number;
  /** Region-default public DC fast-charging price per kWh. */
  kwh: number;
  unit: "litre" | "gallon";
  source: string;
  updated: string;
  live: boolean;
  /** ISO-3166 alpha-2 → country price, all in `currencyCode` per litre / kWh. */
  countries: Record<string, CountryFuelPrice>;
  /** Units per 1 EUR (ECB reference rates). */
  fx: Record<string, number>;
  fxAsOf: string;
};

/** Reference levels (EUR/L, with taxes) used only when a live source is unreachable. */
const REFERENCE_EUR: Record<string, { petrol: number; diesel: number; asOf: string; source: string; sourceUrl: string }> = {
  AT: { petrol: 1.91, diesel: 2.13, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  BE: { petrol: 1.94, diesel: 2.25, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  BG: { petrol: 1.57, diesel: 1.81, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  HR: { petrol: 1.73, diesel: 1.91, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  CZ: { petrol: 1.81, diesel: 1.96, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  DK: { petrol: 2.63, diesel: 2.43, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  EE: { petrol: 1.81, diesel: 1.92, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  FI: { petrol: 2.32, diesel: 2.48, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  FR: { petrol: 2.11, diesel: 2.26, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  DE: { petrol: 2.33, diesel: 2.33, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  GR: { petrol: 2.09, diesel: 2.05, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  HU: { petrol: 1.64, diesel: 1.86, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  IE: { petrol: 1.85, diesel: 1.95, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  IT: { petrol: 2.03, diesel: 2.14, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  LV: { petrol: 1.94, diesel: 2.05, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  LT: { petrol: 1.88, diesel: 2.13, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  LU: { petrol: 1.87, diesel: 2.02, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  NL: { petrol: 2.47, diesel: 2.44, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  PL: { petrol: 1.81, diesel: 1.98, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  PT: { petrol: 2.09, diesel: 2.1, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  RO: { petrol: 1.85, diesel: 1.94, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  SK: { petrol: 1.77, diesel: 1.91, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  SI: { petrol: 1.63, diesel: 1.88, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  ES: { petrol: 1.82, diesel: 1.8, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  SE: { petrol: 1.59, diesel: 1.9, asOf: "2026-09-07", source: "EU Weekly Oil Bulletin (reference)", sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
  NO: { petrol: 1.68, diesel: 1.74, asOf: "2026-07", source: "Statistics Norway (reference)", sourceUrl: "https://www.ssb.no/statbank/table/09654" },
  GB: { petrol: 1.7, diesel: 1.79, asOf: "2026-09", source: "UK weekly road fuel prices (reference)", sourceUrl: "https://www.gov.uk/government/statistics/weekly-road-fuel-prices" },
  CH: { petrol: 1.95, diesel: 2.05, asOf: "2026-09", source: "TCS / BFS reference", sourceUrl: "https://www.tcs.ch/" },
  IS: { petrol: 2.2, diesel: 2.25, asOf: "2026-09", source: "Reference level", sourceUrl: "https://www.fib.is/" },
  US: { petrol: 0.94, diesel: 1.35, asOf: "2026-09-07", source: "U.S. EIA (reference)", sourceUrl: "https://www.eia.gov/petroleum/gasdiesel/" },
  CA: { petrol: 1.09, diesel: 1.34, asOf: "2026-07", source: "Statistics Canada (reference)", sourceUrl: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000101" },
  MX: { petrol: 1.15, diesel: 1.2, asOf: "2026-09", source: "Reference level", sourceUrl: "https://www.gob.mx/cre" },
};

/** Indicative public DC fast-charging price, EUR/kWh (no open feed exists for this). */
const CHARGING_EUR: Record<string, number> = {
  NO: 0.55, SE: 0.5, DK: 0.55, FI: 0.45, IS: 0.4,
  DE: 0.58, NL: 0.62, BE: 0.55, LU: 0.49, FR: 0.59, GB: 0.72, IE: 0.55,
  AT: 0.57, CH: 0.65, IT: 0.69, ES: 0.52, PT: 0.5,
  PL: 0.45, CZ: 0.45, SK: 0.45, HU: 0.5, SI: 0.5, HR: 0.5, RO: 0.45, BG: 0.45, GR: 0.5,
  EE: 0.45, LV: 0.45, LT: 0.42,
  US: 0.38, CA: 0.27, MX: 0.3,
};

const LOCAL_CURRENCY: Record<string, string> = {
  NO: "NOK", SE: "SEK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", CH: "CHF", GB: "GBP", IS: "ISK",
  US: "USD", CA: "CAD", MX: "MXN",
};

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export const getEnergyPrices = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ region: z.enum(["eu", "us", "ca"]).default("eu") }).parse(data))
  .handler(async ({ data }): Promise<EnergyPrices> => {
    const src = await import("@/lib/price-sources.server");
    const [fx, wob, fr, no, us, ca] = await Promise.all([
      src.loadFx(),
      src.loadOilBulletin(),
      src.loadFranceInstant(),
      src.loadNorwaySsb(),
      src.loadUsEia(),
      src.loadCanadaStatcan(),
    ]);

    const rates: Record<string, number> = fx?.value.rates ?? { EUR: 1, USD: 1.17, CAD: 1.6, NOK: 11.7, SEK: 11.1, DKK: 7.46, GBP: 0.86, CHF: 0.93, PLN: 4.27, CZK: 24.3, HUF: 390, RON: 5.08, ISK: 143, JPY: 172, CNY: 8.2, MXN: 21.5 };
    const fxAsOf = fx?.value.date ?? "reference";

    // Build the EUR/L table first, then convert to the region's base currency.
    type Row = { petrol: number; diesel: number; source: string; sourceUrl: string; asOf: string; live: boolean };
    const eur: Record<string, Row> = {};
    for (const [code, ref] of Object.entries(REFERENCE_EUR)) eur[code] = { ...ref, live: false };

    if (wob) {
      for (const [code, p] of Object.entries(wob.value.countries)) {
        eur[code] = {
          petrol: p.petrol,
          diesel: p.diesel,
          source: `EU Weekly Oil Bulletin${wob.stale ? " (last available)" : ""}`,
          sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
          asOf: wob.value.asOf,
          live: true,
        };
      }
    }
    if (fr) {
      eur["FR"] = {
        petrol: fr.value.petrol,
        diesel: fr.value.diesel,
        source: `prix-carburants.gouv.fr · median of ${fr.value.stations.toLocaleString("en-GB")} stations`,
        sourceUrl: "https://www.prix-carburants.gouv.fr/",
        asOf: fr.value.asOf,
        live: true,
      };
    }
    if (no && rates["NOK"]) {
      eur["NO"] = {
        petrol: no.value.petrolNok / rates["NOK"],
        diesel: no.value.dieselNok / rates["NOK"],
        source: "Statistics Norway (SSB) monthly pump prices",
        sourceUrl: "https://www.ssb.no/statbank/table/09654",
        asOf: no.value.asOf,
        live: true,
      };
    }
    if (us && rates["USD"]) {
      eur["US"] = {
        petrol: us.value.petrolUsdGal / 3.78541 / rates["USD"],
        diesel: us.value.dieselUsdGal / 3.78541 / rates["USD"],
        source: "U.S. EIA weekly retail gasoline & diesel update",
        sourceUrl: "https://www.eia.gov/petroleum/gasdiesel/",
        asOf: us.value.asOf,
        live: true,
      };
    }
    if (ca && rates["CAD"]) {
      eur["CA"] = {
        petrol: ca.value.petrolCadL / rates["CAD"],
        diesel: ca.value.dieselCadL / rates["CAD"],
        source: `Statistics Canada monthly retail prices (diesel: ${ca.value.dieselCities}-city average)`,
        sourceUrl: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000101",
        asOf: ca.value.asOf,
        live: true,
      };
    }

    const baseCode = data.region === "us" ? "USD" : data.region === "ca" ? "CAD" : "EUR";
    const toBase = rates[baseCode] ?? 1;
    const countries: Record<string, CountryFuelPrice> = {};
    for (const [code, row] of Object.entries(eur)) {
      const localCode = LOCAL_CURRENCY[code] ?? "EUR";
      const localRate = rates[localCode] ?? 1;
      countries[code] = {
        code,
        petrol: round3(row.petrol * toBase),
        diesel: round3(row.diesel * toBase),
        kwh: round3((CHARGING_EUR[code] ?? 0.55) * toBase),
        local: {
          currency: localCode,
          petrol: code === "NO" && no ? no.value.petrolNok : round3(row.petrol * localRate),
          diesel: code === "NO" && no ? no.value.dieselNok : round3(row.diesel * localRate),
        },
        source: row.source,
        sourceUrl: row.sourceUrl,
        asOf: row.asOf,
        live: row.live,
      };
    }

    const updated = new Date().toISOString();
    if (data.region === "us") {
      const c = countries["US"]!;
      return {
        currency: "$",
        currencyCode: "USD",
        petrol: round3(c.petrol * 3.78541),
        diesel: round3(c.diesel * 3.78541),
        kwh: c.kwh,
        unit: "gallon",
        source: c.source,
        updated,
        live: c.live,
        countries,
        fx: rates,
        fxAsOf,
      };
    }
    if (data.region === "ca") {
      const c = countries["CA"]!;
      return {
        currency: "C$",
        currencyCode: "CAD",
        petrol: c.petrol,
        diesel: c.diesel,
        kwh: c.kwh,
        unit: "litre",
        source: c.source,
        updated,
        live: c.live,
        countries,
        fx: rates,
        fxAsOf,
      };
    }
    const eu27 = wob?.value.eu27 ?? { petrol: 2.04, diesel: 2.11 };
    return {
      currency: "€",
      currencyCode: "EUR",
      petrol: round3(eu27.petrol),
      diesel: round3(eu27.diesel),
      kwh: 0.55,
      unit: "litre",
      source: wob ? "EU Weekly Oil Bulletin (EU-27 weighted average)" : "EU-27 reference level",
      updated,
      live: Boolean(wob),
      countries,
      fx: rates,
      fxAsOf,
    };
  });

/** Live ECB reference rates (units per EUR) for the display-currency switcher. */
export const getFxRates = createServerFn({ method: "GET" }).handler(async () => {
  const src = await import("@/lib/price-sources.server");
  const fx = await src.loadFx();
  return fx ? { rates: fx.value.rates, date: fx.value.date } : null;
});
