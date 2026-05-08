import { DEFAULT_LANG, SUPPORTED_LANGS, type Lang } from "@/i18n/config";

export type LocalizedString = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export const resolveCatalogLang = (value?: string): Lang => {
  const candidate = (value || DEFAULT_LANG).toLowerCase().split("-")[0] as Lang;
  return SUPPORTED_LANGS.includes(candidate) ? candidate : DEFAULT_LANG;
};

export const sameText = (value: string): LocalizedString =>
  Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, value])) as LocalizedString;

export const sameList = (value: string[]): LocalizedList =>
  Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, value])) as LocalizedList;

const warnedMissingKeys = new Set<string>();

const reportMissingKey = (key: string, lang: Lang) => {
  const message = `[catalog-i18n] Missing locale content for ${key} (${lang})`;
  if (import.meta.env.DEV) {
    if (!warnedMissingKeys.has(message)) {
      console.warn(message);
      warnedMissingKeys.add(message);
    }
    return;
  }

  console.error(message);
};

export const resolveLocalizedString = (
  localized: LocalizedString,
  lang: string,
  key: string,
): string => {
  const resolvedLang = resolveCatalogLang(lang);
  const value = localized[resolvedLang];
  if (value) return value;

  reportMissingKey(key, resolvedLang);
  return localized[DEFAULT_LANG] ?? Object.values(localized)[0] ?? "";
};

export const resolveLocalizedList = (
  localized: LocalizedList,
  lang: string,
  key: string,
): string[] => {
  const resolvedLang = resolveCatalogLang(lang);
  const value = localized[resolvedLang];
  if (value) return value;

  reportMissingKey(key, resolvedLang);
  return localized[DEFAULT_LANG] ?? Object.values(localized)[0] ?? [];
};
