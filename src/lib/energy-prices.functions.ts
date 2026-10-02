import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CHARGING_EUR, REFERENCE_EUR } from "@/lib/fuel-reference";

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
