export const SUPPORTED_LANGS = ["en", "no", "de", "sv", "fr", "pl", "it", "es"] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  no: "Norsk",
  de: "Deutsch",
  sv: "Svenska",
  fr: "Français",
  pl: "Polski",
  it: "Italiano",
  es: "Español",
};
