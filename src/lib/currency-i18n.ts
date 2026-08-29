import type { Locale } from "./i18n";

export const exchangeRatesNote: Record<Locale, (date: string) => string> = {
  en: (date) => `Exchange rates as of ${date} · European Central Bank`,
  de: (date) => `Wechselkurse Stand ${date} · Europäische Zentralbank`,
  nl: (date) => `Wisselkoersen per ${date} · Europese Centrale Bank`,
  no: (date) => `Valutakurser per ${date} · Den europeiske sentralbanken`,
  pl: (date) => `Kursy walut na dzień ${date} · Europejski Bank Centralny`,
  sv: (date) => `Växelkurser per ${date} · Europeiska centralbanken`,
  fr: (date) => `Taux de change au ${date} · Banque centrale européenne`,
  da: (date) => `Valutakurser pr. ${date} · Den Europæiske Centralbank`,
};
