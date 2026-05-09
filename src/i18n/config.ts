import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import no from "./locales/no";
import de from "./locales/de";
import sv from "./locales/sv";
import fr from "./locales/fr";
import pl from "./locales/pl";
import it from "./locales/it";
import es from "./locales/es";
import { SUPPORTED_LANGS, type Lang, DEFAULT_LANG, LANG_LABELS } from "./locales";

export { SUPPORTED_LANGS, DEFAULT_LANG, LANG_LABELS };
export type { Lang };

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    no: { translation: no },
    de: { translation: de },
    sv: { translation: sv },
    fr: { translation: fr },
    pl: { translation: pl },
    it: { translation: it },
    es: { translation: es },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
