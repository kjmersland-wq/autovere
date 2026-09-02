/**
 * Full UI dictionaries for the additional language routes (/se, /dk, /de, /nl, /fr, /pl).
 * Anything missing falls back to English at merge time.
 */

import { DA_DICT } from "@/lib/dict-da";
import { DE_DICT } from "@/lib/dict-de";
import { FR_DICT } from "@/lib/dict-fr";
import { NL_DICT } from "@/lib/dict-nl";
import { PL_DICT } from "@/lib/dict-pl";
import { SV_DICT } from "@/lib/dict-sv";

type Dict = Record<string, unknown>;

export const PARTIAL_DICTS: Record<string, Dict> = {
  sv: SV_DICT,
  da: DA_DICT,
  de: DE_DICT,
  nl: NL_DICT,
  fr: FR_DICT,
  pl: PL_DICT,
};

/** Hero copy per language for the localized landing page. */
export const LOCALE_LANDING: Record<
  string,
  { eyebrow: string; title: string; subtitle: string; metaTitle: string; metaDescription: string }
> = {
  sv: {
    eyebrow: "Europa · 30+ länder",
    title: "Planera en gång. Njut av varje kilometer.",
    subtitle:
      "Berätta var du startar och vart du drömmer dig bort — vi sköter vägtullar, vinjetter, bränsle, laddning och färjor.",
    metaTitle: "AutoVere Sverige — Vägtullar, vinjetter och reskostnader",
    metaDescription:
      "Planera bilsemestern med exakta vägtullar, vinjetter, bränsle, laddning och färjor för bil, husbil och motorcykel.",
  },
  da: {
    eyebrow: "Europa · 30+ lande",
    title: "Planlæg én gang. Nyd hver eneste kilometer.",
    subtitle:
      "Fortæl os hvor du starter, og hvor du drømmer dig hen — vi klarer vejafgifter, vignetter, brændstof, opladning og færger.",
    metaTitle: "AutoVere Danmark — Vejafgifter, vignetter og rejseomkostninger",
    metaDescription:
      "Planlæg bilferien med præcise vejafgifter, vignetter, brændstof, opladning og færger for bil, autocamper og motorcykel.",
  },
  de: {
    eyebrow: "Europa · 30+ Länder",
    title: "Einmal planen. Jeden Kilometer genießen.",
    subtitle:
      "Sagen Sie uns, wo Sie starten und wovon Sie träumen — wir übernehmen Maut, Vignetten, Kraftstoff, Laden und Fähren.",
    metaTitle: "AutoVere Deutschland — Maut, Vignetten und Reisekosten",
    metaDescription:
      "Planen Sie Ihre Autoreise mit exakter Maut, Vignetten, Kraftstoff, Ladekosten und Fähren für Auto, Wohnmobil und Motorrad.",
  },
  nl: {
    eyebrow: "Europa · 30+ landen",
    title: "Eén keer plannen. Van elke kilometer genieten.",
    subtitle:
      "Vertel ons waar je start en waar je van droomt — wij regelen tol, vignetten, brandstof, laden en veerboten.",
    metaTitle: "AutoVere Nederland — Tol, vignetten en reiskosten",
    metaDescription:
      "Plan je autovakantie met precieze tol, vignetten, brandstof, laadkosten en veerboten voor auto, camper en motor.",
  },
  fr: {
    eyebrow: "Europe · 30+ pays",
    title: "Planifiez une fois. Savourez chaque kilomètre.",
    subtitle:
      "Dites-nous d'où vous partez et où vous rêvez d'aller — nous gérons péages, vignettes, carburant, recharge et ferries.",
    metaTitle: "AutoVere France — Péages, vignettes et coûts de voyage",
    metaDescription:
      "Planifiez votre road trip avec des péages, vignettes, carburant, recharge et ferries précis pour voiture, camping-car et moto.",
  },
  pl: {
    eyebrow: "Europa · 30+ krajów",
    title: "Zaplanuj raz. Ciesz się każdym kilometrem.",
    subtitle:
      "Powiedz nam, skąd ruszasz i dokąd marzysz dojechać — zajmiemy się opłatami, winietami, paliwem, ładowaniem i promami.",
    metaTitle: "AutoVere Polska — Opłaty drogowe, winiety i koszty podróży",
    metaDescription:
      "Zaplanuj podróż samochodem z dokładnymi opłatami, winietami, paliwem, ładowaniem i promami dla auta, kampera i motocykla.",
  },
  // Placeholder: English copy until translations land.
  es: {
    eyebrow: "Europe · 30+ countries",
    title: "Plan it once. Enjoy every kilometre.",
    subtitle:
      "Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries.",
    metaTitle: "AutoVere España — Tolls, vignettes and road trip costs",
    metaDescription:
      "Plan your road trip with exact tolls, vignettes, fuel, charging and ferry costs for cars, motorhomes and motorcycles.",
  },
  it: {
    eyebrow: "Europe · 30+ countries",
    title: "Plan it once. Enjoy every kilometre.",
    subtitle:
      "Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries.",
    metaTitle: "AutoVere Italia — Tolls, vignettes and road trip costs",
    metaDescription:
      "Plan your road trip with exact tolls, vignettes, fuel, charging and ferry costs for cars, motorhomes and motorcycles.",
  },
};
