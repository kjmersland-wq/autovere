import { useTranslation } from "react-i18next";

export type Lang = "en" | "no";
export type LocalizedString = string | Partial<Record<Lang, string>>;
export type LocalizedArray = string[] | Partial<Record<Lang, string[]>>;

const pickLang = (raw?: string): Lang =>
  raw && raw.toLowerCase().startsWith("no") ? "no" : "en";

export const loc = (v: LocalizedString | undefined | null, lang: Lang): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? Object.values(v)[0] ?? "";
};

export const locArr = (v: LocalizedArray | undefined | null, lang: Lang): string[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  return v[lang] ?? v.en ?? Object.values(v)[0] ?? [];
};

export const useLoc = () => {
  const { i18n } = useTranslation();
  const lang = pickLang(i18n.language);
  return {
    lang,
    l: (v: LocalizedString | undefined | null) => loc(v, lang),
    la: (v: LocalizedArray | undefined | null) => locArr(v, lang),
  };
};
