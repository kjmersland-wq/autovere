import { LOCALE_ROUTES } from "@/lib/locales";
import { REGIONS } from "@/lib/trip-data";

export type SiteOption = { value: string; label: string; flag: string };

/** The canonical list of AutoVere sites, sourced from the existing locale
 * registry rather than hardcoded per-component — adding a new country/site
 * to LOCALE_ROUTES makes it show up here automatically. Region-only sites
 * (/us, /ca — independent of any language prefix) come from the same
 * REGIONS registry the real site header's region switcher uses; "eu" is
 * excluded since it's the default region already covered by the language
 * sites above, not a distinct site of its own. */
export const SITE_OPTIONS: SiteOption[] = [
  { value: "en", label: "Engelsk (hovedsiden)", flag: "🌍" },
  ...LOCALE_ROUTES.map((l) => ({ value: l.prefix, label: l.label, flag: l.flag })),
  ...REGIONS.filter((r) => r.key !== "eu").map((r) => ({ value: r.key, label: r.label, flag: r.flag })),
];

export function siteLabel(value: string): string {
  const opt = SITE_OPTIONS.find((o) => o.value === value);
  return opt ? `${opt.flag} ${opt.label}` : value;
}
