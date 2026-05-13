import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import no from "./locales/no";

export const SUPPORTED_LANGS = ["en", "no"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  no: "Norsk",
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    no: { translation: no },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
