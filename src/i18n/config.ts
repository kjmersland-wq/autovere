import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGS = ["en", "no", "de", "sv"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  no: "Norsk",
  de: "Deutsch",
  sv: "Svenska",
};

const resources = {
  en: {
    translation: {
      nav: {
        cars: "Cars",
        discover: "Discover",
        compare: "Compare",
        learn: "Learn",
        watch: "Watch",
        pricing: "Pricing",
        contact: "Contact",
      },
      hero: {
        eyebrow: "AutoVere intelligence",
        cta_primary: "Find your car",
        cta_secondary: "Explore the library",
      },
      footer: {
        tagline: "Calm, intelligent automotive guidance.",
        rights: "All rights reserved.",
        legal: "Legal",
      },
      common: { language: "Language" },
    },
  },
  no: {
    translation: {
      nav: {
        cars: "Biler",
        discover: "Oppdag",
        compare: "Sammenlign",
        learn: "Lær",
        watch: "Se",
        pricing: "Pris",
        contact: "Kontakt",
      },
      hero: {
        eyebrow: "AutoVere-intelligens",
        cta_primary: "Finn din bil",
        cta_secondary: "Utforsk biblioteket",
      },
      footer: {
        tagline: "Rolig, intelligent bilveiledning.",
        rights: "Alle rettigheter forbeholdt.",
        legal: "Juridisk",
      },
      common: { language: "Språk" },
    },
  },
  de: {
    translation: {
      nav: {
        cars: "Autos",
        discover: "Entdecken",
        compare: "Vergleichen",
        learn: "Lernen",
        watch: "Ansehen",
        pricing: "Preise",
        contact: "Kontakt",
      },
      hero: {
        eyebrow: "AutoVere-Intelligenz",
        cta_primary: "Finden Sie Ihr Auto",
        cta_secondary: "Bibliothek erkunden",
      },
      footer: {
        tagline: "Ruhige, intelligente Fahrzeugberatung.",
        rights: "Alle Rechte vorbehalten.",
        legal: "Rechtliches",
      },
      common: { language: "Sprache" },
    },
  },
  sv: {
    translation: {
      nav: {
        cars: "Bilar",
        discover: "Upptäck",
        compare: "Jämför",
        learn: "Lär",
        watch: "Se",
        pricing: "Priser",
        contact: "Kontakt",
      },
      hero: {
        eyebrow: "AutoVere-intelligens",
        cta_primary: "Hitta din bil",
        cta_secondary: "Utforska biblioteket",
      },
      footer: {
        tagline: "Lugn, intelligent bilvägledning.",
        rights: "Alla rättigheter förbehållna.",
        legal: "Juridiskt",
      },
      common: { language: "Språk" },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
});

export default i18n;
