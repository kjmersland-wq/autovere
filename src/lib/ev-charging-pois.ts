/**
 * Full EV charger list for the results page. Imported dynamically — the two
 * generated datasets are ~13 MB and should never ship with the landing pages.
 */
import { GENERATED_AFDC_EV_CHARGING_POIS } from "@/lib/ev-charging-pois-afdc.generated";
import { GENERATED_EV_CHARGING_POIS } from "@/lib/ev-charging-pois.generated";
import { CURATED_EV_CHARGING_POIS, type EvChargingPoi, type RegionKey } from "@/lib/trip-data";

export const EV_CHARGING_POIS: Record<RegionKey, EvChargingPoi[]> = {
  eu: [...CURATED_EV_CHARGING_POIS.eu, ...(GENERATED_EV_CHARGING_POIS.eu as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.eu as unknown as EvChargingPoi[])],
  us: [...CURATED_EV_CHARGING_POIS.us, ...(GENERATED_EV_CHARGING_POIS.us as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.us as unknown as EvChargingPoi[])],
  ca: [...CURATED_EV_CHARGING_POIS.ca, ...(GENERATED_EV_CHARGING_POIS.ca as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.ca as unknown as EvChargingPoi[])],
};
