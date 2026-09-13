import { createServerFn } from "@tanstack/react-start";

/**
 * Norwegian AutoPASS toll gantries from Statens vegvesen's national road
 * database (NVDB, object type 45 "Bomstasjon"). Rates are the published
 * standard small-vehicle rate in NOK, before any tag discount.
 */
export type NoTollStation = {
  id: number;
  name: string;
  facility: string;
  lat: number;
  lng: number;
  /** Standard rate, small vehicle (≤ 3.5 t), NOK, without tag discount. */
  car: number;
  carRush?: number;
  /** Explicit zero-emission rate when the scheme publishes one. */
  ev?: number;
  heavy?: number;
  direction: "both" | "one";
  timeRuleMin?: number;
  url?: string;
};

export type NoTollDataset = {
  asOf: string;
  source: string;
  live: boolean;
  stations: NoTollStation[];
};

export const getNorwayTollStations = createServerFn({ method: "GET" }).handler(async (): Promise<NoTollDataset> => {
  const src = await import("@/lib/price-sources.server");
  const live = await src.loadNorwayTolls();
  if (live) {
    return { asOf: live.fetchedAt.slice(0, 10), source: live.value.source, live: !live.stale, stations: live.value.stations };
  }
  const fallback = (await import("@/data/no_toll_stations.json")).default as { asOf: string; source: string; stations: NoTollStation[] };
  return { asOf: fallback.asOf, source: `${fallback.source} — bundled snapshot`, live: false, stations: fallback.stations };
});
