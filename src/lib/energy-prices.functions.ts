import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Live energy pricing feed.
 *
 * - Road fuel for Europe comes from the French government open-data instant
 *   feed (data.economie.gouv.fr), the only station-level feed that is free and
 *   keyless, and is used as the live European reference average.
 * - USD / CAD prices are the euro reference converted with the daily ECB rates
 *   published by frankfurter.dev, so North-American costs move every day too.
 * - Everything is cached for six hours per worker instance.
 */

export type EnergyPrices = {
  /** Currency symbol the numbers below are expressed in. */
  currency: "€" | "$" | "C$";
  currencyCode: "EUR" | "USD" | "CAD";
  /** Petrol price per litre (per US gallon for the us region). */
  petrol: number;
  diesel: number;
  /** Public DC fast-charging price per kWh. */
  kwh: number;
  unit: "litre" | "gallon";
  source: string;
  updated: string;
  live: boolean;
};

type Snapshot = { at: number; eurPetrol: number; eurDiesel: number; usd: number; cad: number; live: boolean };

let snapshot: Snapshot | null = null;
const TTL_MS = 6 * 60 * 60 * 1000;

/** Fallback reference levels (EUR/L) if both feeds are unreachable. */
const REF_PETROL = 1.78;
const REF_DIESEL = 1.7;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

async function loadSnapshot(): Promise<Snapshot> {
  if (snapshot && Date.now() - snapshot.at < TTL_MS) return snapshot;

  let eurPetrol = REF_PETROL;
  let eurDiesel = REF_DIESEL;
  let usd = 1.09;
  let cad = 1.48;
  let live = false;

  try {
    const res = await fetch(
      "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records" +
        "?select=avg(gazole_prix)%20as%20diesel%2Cavg(sp95_prix)%20as%20petrol&limit=1",
      { headers: { Accept: "application/json" } },
    );
    if (res.ok) {
      const json = (await res.json()) as { results?: { diesel?: number; petrol?: number }[] };
      const row = json.results?.[0];
      if (row?.diesel && row?.petrol) {
        // The feed mixes €/L and c€/L rows depending on the station software.
        const norm = (v: number) => (v > 10 ? v / 100 : v);
        eurDiesel = clamp(norm(row.diesel), 1.2, 2.4);
        eurPetrol = clamp(norm(row.petrol), 1.2, 2.4);
        live = true;
      }
    }
  } catch {
    /* keep reference levels */
  }

  try {
    const fx = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,CAD", {
      headers: { Accept: "application/json" },
    });
    if (fx.ok) {
      const json = (await fx.json()) as { rates?: { USD?: number; CAD?: number } };
      if (json.rates?.USD) usd = json.rates.USD;
      if (json.rates?.CAD) cad = json.rates.CAD;
    }
  } catch {
    /* keep reference rates */
  }

  snapshot = { at: Date.now(), eurPetrol, eurDiesel, usd, cad, live };
  return snapshot;
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export const getEnergyPrices = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ region: z.enum(["eu", "us", "ca"]).default("eu") }).parse(data))
  .handler(async ({ data }): Promise<EnergyPrices> => {
    const s = await loadSnapshot();
    const updated = new Date(s.at).toISOString();

    if (data.region === "us") {
      // US pump prices are structurally lower (far less fuel duty): the euro
      // reference is converted and adjusted by the long-run duty differential.
      const perLitre = s.eurPetrol * s.usd * 0.55;
      const dieselL = s.eurDiesel * s.usd * 0.62;
      return {
        currency: "$",
        currencyCode: "USD",
        petrol: round3(perLitre * 3.785),
        diesel: round3(dieselL * 3.785),
        kwh: round3(0.44 * s.usd),
        unit: "gallon",
        source: "French government instant fuel feed + ECB daily FX",
        updated,
        live: s.live,
      };
    }

    if (data.region === "ca") {
      return {
        currency: "C$",
        currencyCode: "CAD",
        petrol: round3(s.eurPetrol * s.cad * 0.82),
        diesel: round3(s.eurDiesel * s.cad * 0.85),
        kwh: round3(0.4 * s.cad),
        unit: "litre",
        source: "French government instant fuel feed + ECB daily FX",
        updated,
        live: s.live,
      };
    }

    return {
      currency: "€",
      currencyCode: "EUR",
      petrol: round3(s.eurPetrol),
      diesel: round3(s.eurDiesel),
      kwh: 0.55,
      unit: "litre",
      source: "prix-carburants (French Ministry of Economy open data)",
      updated,
      live: s.live,
    };
  });
