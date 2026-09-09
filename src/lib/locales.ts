/** URL prefix ↔ language code registry. English lives at the root, every other language on /<prefix>. */
export const LOCALE_ROUTES = [
  { prefix: "no", code: "no", label: "Norsk", flag: "🇳🇴" },
  { prefix: "se", code: "sv", label: "Svenska", flag: "🇸🇪" },
  { prefix: "dk", code: "da", label: "Dansk", flag: "🇩🇰" },
  { prefix: "fi", code: "fi", label: "Suomi", flag: "🇫🇮" },
  { prefix: "us", code: "us", label: "US English", flag: "🇺🇸" },
  { prefix: "de", code: "de", label: "Deutsch", flag: "🇩🇪" },
  { prefix: "nl", code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { prefix: "fr", code: "fr", label: "Français", flag: "🇫🇷" },
  { prefix: "pl", code: "pl", label: "Polski", flag: "🇵🇱" },
  { prefix: "es", code: "es", label: "Español", flag: "🇪🇸" },
  { prefix: "it", code: "it", label: "Italiano", flag: "🇮🇹" },
  { prefix: "pt", code: "pt", label: "Português", flag: "🇵🇹" },
  { prefix: "ja", code: "ja", label: "日本語", flag: "🇯🇵" },
  { prefix: "zh", code: "zh", label: "简体中文", flag: "🇨🇳" },
] as const;

export type LocalePrefix = (typeof LOCALE_ROUTES)[number]["prefix"];

/** Pages that exist in every language tree. */
export const LOCALE_PAGES = [
  "planner",
  "tolls",
  "scenic",
  "garage",
  "faq",
  "how-it-works",
  "pricing",
  "partners",
  "privacy",
  "terms",
] as const;

export type LocalePage = (typeof LOCALE_PAGES)[number];

export function isLocalePrefix(value: string): value is LocalePrefix {
  return LOCALE_ROUTES.some((l) => l.prefix === value);
}

export function isLocalePage(value: string): value is LocalePage {
  return (LOCALE_PAGES as readonly string[]).includes(value);
}

/** The language prefix of the current path, or null for English (root). */
export function prefixFromPath(pathname: string): LocalePrefix | null {
  const first = pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  return isLocalePrefix(first) ? first : null;
}

/** Language code (for dictionaries) derived from the URL. */
export function codeFromPath(pathname: string): string {
  const prefix = prefixFromPath(pathname);
  return prefix ? (LOCALE_ROUTES.find((l) => l.prefix === prefix)!.code as string) : "en";
}

export function prefixForCode(code: string): LocalePrefix | null {
  return (LOCALE_ROUTES.find((l) => l.code === code)?.prefix as LocalePrefix | undefined) ?? null;
}

/** Strip any language prefix, returning the English equivalent path. */
export function stripLocale(pathname: string): string {
  const prefix = prefixFromPath(pathname);
  if (!prefix) return pathname;
  const rest = pathname.slice(prefix.length + 1);
  return rest === "" ? "/" : rest;
}

/* ------------------------------------------------------------------ */
/* Matrix routing: language and region are independent URL segments.   */
/* Shapes: /            /fr            /us          /fr/us            */
/*         /planner     /fr/planner    /us/planner  /fr/us/planner    */
/* ------------------------------------------------------------------ */

export const REGION_PREFIXES = ["us", "ca"] as const;
export type RegionPrefix = (typeof REGION_PREFIXES)[number];

export function isRegionPrefix(value: string): value is RegionPrefix {
  return (REGION_PREFIXES as readonly string[]).includes(value);
}

export type PathParts = {
  prefix: LocalePrefix | null;
  region: RegionPrefix | null;
  page: string | null;
};

/** Split any app path into its independent language / region / page parts. */
export function splitPath(pathname: string): PathParts {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  let i = 0;
  const prefix = isLocalePrefix(parts[i] ?? "") ? (parts[i] as LocalePrefix) : null;
  if (prefix) i += 1;
  const region = isRegionPrefix(parts[i] ?? "") ? (parts[i] as RegionPrefix) : null;
  if (region) i += 1;
  const page = parts[i] ?? null;
  return { prefix, region, page: page || null };
}

/** Rebuild a path from independent language / region / page parts. */
export function buildPath(parts: PathParts): string {
  const segs: string[] = [];
  if (parts.prefix) segs.push(parts.prefix);
  if (parts.region) segs.push(parts.region);
  if (parts.page) segs.push(parts.page);
  return segs.length ? `/${segs.join("/")}` : "/";
}

/** Translate the current path into the same page + region in another language. */
export function pathForCode(pathname: string, code: string): string {
  const { region, page } = splitPath(pathname);
  const prefix = prefixForCode(code);
  const keepPage = page && isLocalePage(page) ? page : null;
  return buildPath({ prefix, region, page: keepPage });
}

/** Switch region while keeping the active language and page. */
export function pathForRegion(pathname: string, region: "eu" | RegionPrefix): string {
  // Region prefixes ("us", "ca") double as locale prefixes ("us" = US English),
  // so a leading region segment must be parsed as a region, not a language.
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  let i = 0;
  let prefix: LocalePrefix | null = null;
  if (isRegionPrefix(parts[i] ?? "")) {
    i += 1;
  } else {
    if (isLocalePrefix(parts[i] ?? "")) {
      prefix = parts[i] as LocalePrefix;
      i += 1;
    }
    if (isRegionPrefix(parts[i] ?? "")) i += 1;
  }
  const page = parts[i] ?? null;
  const keepPage = page && isLocalePage(page) ? page : null;
  return buildPath({ prefix, region: region === "eu" ? null : region, page: keepPage });
}
