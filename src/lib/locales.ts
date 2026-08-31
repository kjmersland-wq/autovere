/** URL prefix ↔ language code registry. English lives at the root, every other language on /<prefix>. */
export const LOCALE_ROUTES = [
  { prefix: "no", code: "no", label: "Norsk", flag: "🇳🇴" },
  { prefix: "se", code: "sv", label: "Svenska", flag: "🇸🇪" },
  { prefix: "dk", code: "da", label: "Dansk", flag: "🇩🇰" },
  { prefix: "de", code: "de", label: "Deutsch", flag: "🇩🇪" },
  { prefix: "nl", code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { prefix: "fr", code: "fr", label: "Français", flag: "🇫🇷" },
  { prefix: "pl", code: "pl", label: "Polski", flag: "🇵🇱" },
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

/** Translate the current path into the same page in another language. */
export function pathForCode(pathname: string, code: string): string {
  const base = stripLocale(pathname);
  const prefix = prefixForCode(code);
  if (!prefix) return base;
  const slug = base.replace(/^\/+/, "").split("/")[0] ?? "";
  if (!slug) return `/${prefix}`;
  return isLocalePage(slug) ? `/${prefix}/${slug}` : `/${prefix}`;
}
