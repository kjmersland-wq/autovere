/**
 * Small site-wide constants and helpers used by the header, footer and
 * currency provider. Kept out of trip-data.ts so every page doesn't download
 * the trip engine and its multi-megabyte charger datasets.
 */
import type { FlagCode } from "@/components/FlagIcon";
import { LOCALE_ROUTES } from "@/lib/locales";

export type RegionKey = "eu" | "us" | "ca";

export const REGIONS: { key: RegionKey; label: string; flag: string; to: "/" | "/us" | "/ca" }[] = [
  { key: "eu", label: "Europe", flag: "🇪🇺", to: "/" },
  { key: "us", label: "USA", flag: "🇺🇸", to: "/us" },
  { key: "ca", label: "Canada", flag: "🇨🇦", to: "/ca" },
];

export const LANGUAGES: { code: string; flag: FlagCode; label: string }[] = [
  { code: "en", flag: "GB", label: "English" },
  { code: "no", flag: "NO", label: "Norsk" },
  { code: "sv", flag: "SE", label: "Svenska" },
  { code: "da", flag: "DK", label: "Dansk" },
  { code: "fi", flag: "FI", label: "Suomi" },
  { code: "us", flag: "US", label: "US" },
  { code: "de", flag: "DE", label: "Deutsch" },
  { code: "nl", flag: "NL", label: "Nederlands" },
  { code: "fr", flag: "FR", label: "Français" },
  { code: "pl", flag: "PL", label: "Polski" },
  { code: "es", flag: "ES", label: "Español" },
  { code: "it", flag: "IT", label: "Italiano" },
  { code: "pt", flag: "PT", label: "Português" },
  { code: "ja", flag: "JP", label: "日本語" },
  { code: "zh", flag: "CN", label: "简体中文" },
];

export const NAV_LINKS = [
  { to: "/planner", label: "Road Trip Planner" },
  { to: "/tolls", label: "Tolls & Vignettes" },
  { to: "/scenic", label: "Scenic Passes & Ferries" },
  { to: "/garage", label: "My Garage" },
] as const;

/** Region is independent from language: /us, /ca, /fr/us, /no/ca all resolve here. */
export function regionFromPath(pathname: string): RegionKey {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const first = parts[0] ?? "";
  if (first === "us") return "us";
  if (first === "ca") return "ca";
  // Matrix routes only: /<language>/<region>/<page>, e.g. /fr/us/planner.
  const seg = LOCALE_ROUTES.some((l) => l.prefix === first) ? (parts[1] ?? "") : first;
  if (seg === "us") return "us";
  if (seg === "ca") return "ca";
  return "eu";
}
