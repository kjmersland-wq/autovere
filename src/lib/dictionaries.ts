/**
 * Partial UI dictionaries for the additional language routes (/se, /dk, /de, /nl, /fr, /pl).
 * Anything not translated here falls back to English at merge time.
 */

import { PL_DICT } from "@/lib/dict-pl";

type Dict = Record<string, unknown>;

export const PARTIAL_DICTS: Record<string, Dict> = {
  sv: {
    header: {
      regions: { eu: "Europa", us: "USA", ca: "Kanada" },
      nav: {
        "/planner": "Reseplanerare",
        "/tolls": "Vägtullar & vinjetter",
        "/scenic": "Bergspass & färjor",
        "/garage": "Mitt garage",
      },
      signIn: "Logga in",
      garageMenu: "🗺️ Mitt garage & resor",
      plansMenu: "✨ Abonnemang & uppgradering",
      signOut: "Logga ut",
      toggleNav: "Visa/dölj meny",
    },
    hero: {
      vehicles: { car: "Bil", motorhome: "Husbil", motorcycle: "Motorcykel" },
      fuels: { petrol: "Bensin", diesel: "Diesel", electric: "El (EV)" },
      origin: "Från",
      destination: "Till",
      originHint: "Startstad eller landmärke (t.ex. Stockholm, München)",
      destinationHint: "Vart är du på väg? (t.ex. Amalfikusten, Lofoten)",
      submit: "Beräkna reskostnad →",
      oneway: "Enkel resa",
      returnTrip: "Tur och retur / semester",
      duration: "Resans längd",
      fuelType: "Bränsle / drivmedel",
      footnote: "Vägtullar, vinjetter, bränsle, laddning och färjor — prissatta för exakt din rutt.",
    },
    footer: {
      quickLinks: "Genvägar",
      company: "Om oss",
      regions: "Regioner",
      howItWorks: "Så fungerar det",
      pricing: "Priser",
      faq: "Vanliga frågor",
      partners: "Partners",
      privacy: "Integritetspolicy",
      terms: "Användarvillkor",
      rights: "Alla rättigheter förbehållna.",
      disclaimer: "Endast vägledande uppskattningar — kontrollera hos officiella portaler.",
    },
  },
  da: {
    header: {
      regions: { eu: "Europa", us: "USA", ca: "Canada" },
      nav: {
        "/planner": "Ruteplanlægger",
        "/tolls": "Vejafgifter & vignetter",
        "/scenic": "Bjergpas & færger",
        "/garage": "Min garage",
      },
      signIn: "Log ind",
      garageMenu: "🗺️ Min garage & ture",
      plansMenu: "✨ Abonnement & opgradering",
      signOut: "Log ud",
      toggleNav: "Vis/skjul menu",
    },
    hero: {
      vehicles: { car: "Bil", motorhome: "Autocamper", motorcycle: "Motorcykel" },
      fuels: { petrol: "Benzin", diesel: "Diesel", electric: "El (EV)" },
      origin: "Fra",
      destination: "Til",
      originHint: "Startby eller landemærke (f.eks. København, München)",
      destinationHint: "Hvor skal du hen? (f.eks. Amalfikysten, Lofoten)",
      submit: "Beregn rejseomkostning →",
      oneway: "Enkeltrejse",
      returnTrip: "Tur-retur / ferie",
      duration: "Rejsens længde",
      fuelType: "Brændstof / drivmiddel",
      footnote: "Vejafgifter, vignetter, brændstof, opladning og færger — prissat til din rute.",
    },
    footer: {
      quickLinks: "Genveje",
      company: "Om os",
      regions: "Regioner",
      howItWorks: "Sådan virker det",
      pricing: "Priser",
      faq: "Ofte stillede spørgsmål",
      partners: "Partnere",
      privacy: "Privatlivspolitik",
      terms: "Brugerbetingelser",
      rights: "Alle rettigheder forbeholdes.",
      disclaimer: "Kun vejledende estimater — kontrollér hos officielle portaler.",
    },
  },
  de: {
    header: {
      regions: { eu: "Europa", us: "USA", ca: "Kanada" },
      nav: {
        "/planner": "Routenplaner",
        "/tolls": "Maut & Vignetten",
        "/scenic": "Pässe & Fähren",
        "/garage": "Meine Garage",
      },
      signIn: "Anmelden",
      garageMenu: "🗺️ Meine Garage & Reisen",
      plansMenu: "✨ Tarife & Upgrade",
      signOut: "Abmelden",
      toggleNav: "Menü ein-/ausblenden",
    },
    hero: {
      vehicles: { car: "Auto", motorhome: "Wohnmobil", motorcycle: "Motorrad" },
      fuels: { petrol: "Benzin", diesel: "Diesel", electric: "Elektro (EV)" },
      origin: "Start",
      destination: "Ziel",
      originHint: "Startstadt oder Wahrzeichen (z. B. München, Hamburg)",
      destinationHint: "Wohin geht die Reise? (z. B. Amalfiküste, Lofoten)",
      submit: "Reisekosten berechnen →",
      oneway: "Einfache Fahrt",
      returnTrip: "Hin- und Rückfahrt / Urlaub",
      duration: "Reisedauer",
      fuelType: "Kraftstoff / Antrieb",
      footnote: "Maut, Vignetten, Kraftstoff, Laden und Fähren — exakt für Ihre Route berechnet.",
    },
    footer: {
      quickLinks: "Schnellzugriff",
      company: "Unternehmen",
      regions: "Regionen",
      howItWorks: "So funktioniert's",
      pricing: "Preise",
      faq: "Häufige Fragen",
      partners: "Partner",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      rights: "Alle Rechte vorbehalten.",
      disclaimer: "Nur Richtwerte — bitte offizielle Portale prüfen.",
    },
  },
  nl: {
    header: {
      regions: { eu: "Europa", us: "VS", ca: "Canada" },
      nav: {
        "/planner": "Routeplanner",
        "/tolls": "Tol & vignetten",
        "/scenic": "Bergpassen & veerboten",
        "/garage": "Mijn garage",
      },
      signIn: "Inloggen",
      garageMenu: "🗺️ Mijn garage & reizen",
      plansMenu: "✨ Abonnement & upgrade",
      signOut: "Uitloggen",
      toggleNav: "Menu tonen/verbergen",
    },
    hero: {
      vehicles: { car: "Auto", motorhome: "Camper", motorcycle: "Motor" },
      fuels: { petrol: "Benzine", diesel: "Diesel", electric: "Elektrisch (EV)" },
      origin: "Vertrek",
      destination: "Bestemming",
      originHint: "Startplaats of oriëntatiepunt (bijv. Amsterdam, München)",
      destinationHint: "Waar ga je heen? (bijv. Amalfikust, Lofoten)",
      submit: "Bereken reiskosten →",
      oneway: "Enkele reis",
      returnTrip: "Heen en terug / vakantie",
      duration: "Reisduur",
      fuelType: "Brandstof / aandrijving",
      footnote: "Tol, vignetten, brandstof, laden en veerboten — precies voor jouw route berekend.",
    },
    footer: {
      quickLinks: "Snelkoppelingen",
      company: "Bedrijf",
      regions: "Regio's",
      howItWorks: "Hoe het werkt",
      pricing: "Prijzen",
      faq: "Veelgestelde vragen",
      partners: "Partners",
      privacy: "Privacybeleid",
      terms: "Gebruiksvoorwaarden",
      rights: "Alle rechten voorbehouden.",
      disclaimer: "Alleen indicatieve schattingen — controleer officiële portalen.",
    },
  },
  fr: {
    header: {
      regions: { eu: "Europe", us: "États-Unis", ca: "Canada" },
      nav: {
        "/planner": "Planificateur d'itinéraire",
        "/tolls": "Péages & vignettes",
        "/scenic": "Cols & ferries",
        "/garage": "Mon garage",
      },
      signIn: "Se connecter",
      garageMenu: "🗺️ Mon garage & voyages",
      plansMenu: "✨ Offres & mise à niveau",
      signOut: "Se déconnecter",
      toggleNav: "Afficher/masquer le menu",
    },
    hero: {
      vehicles: { car: "Voiture", motorhome: "Camping-car", motorcycle: "Moto" },
      fuels: { petrol: "Essence", diesel: "Diesel", electric: "Électrique (VE)" },
      origin: "Départ",
      destination: "Destination",
      originHint: "Ville de départ ou point de repère (ex. Lyon, Munich)",
      destinationHint: "Où allez-vous ? (ex. côte amalfitaine, Lofoten)",
      submit: "Calculer le coût du trajet →",
      oneway: "Aller simple",
      returnTrip: "Aller-retour / vacances",
      duration: "Durée du voyage",
      fuelType: "Carburant / motorisation",
      footnote: "Péages, vignettes, carburant, recharge et ferries — calculés pour votre itinéraire.",
    },
    footer: {
      quickLinks: "Liens rapides",
      company: "Société",
      regions: "Régions",
      howItWorks: "Comment ça marche",
      pricing: "Tarifs",
      faq: "Questions fréquentes",
      partners: "Partenaires",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      rights: "Tous droits réservés.",
      disclaimer: "Estimations indicatives — vérifiez auprès des portails officiels.",
    },
  },
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
};
