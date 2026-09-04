import { LOCALE_ROUTES } from "@/lib/locales";

export type SiteOption = { value: string; label: string; flag: string };

/** The canonical list of AutoVere sites, sourced from the existing locale
 * registry rather than hardcoded per-component — adding a new country/site
 * to LOCALE_ROUTES makes it show up here automatically. */
export const SITE_OPTIONS: SiteOption[] = [
  { value: "en", label: "Engelsk (hovedsiden)", flag: "🌍" },
  ...LOCALE_ROUTES.map((l) => ({ value: l.prefix, label: l.label, flag: l.flag })),
];

export function siteLabel(value: string): string {
  const opt = SITE_OPTIONS.find((o) => o.value === value);
  return opt ? `${opt.flag} ${opt.label}` : value;
}
