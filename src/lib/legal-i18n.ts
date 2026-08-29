import type { Locale } from "./i18n";

export type LegalCopy = {
  legalTitle: string;
  privacyTitle: string;
  termsTitle: string;
  close: string;
  legal: string[];
  privacy: string[];
  terms: string[];
};

// Shared by the homepage's legal/privacy/terms modal and the standalone /legal, /privacy and
// /terms pages, so both surfaces always show the same content in every language from one source.
export const legalCopy: Record<Locale, LegalCopy> = {
  no: {
    legalTitle: "Juridisk informasjon",
    privacyTitle: "Personvern",
    termsTitle: "Vilkår og ansvarsfraskrivelse",
    close: "Lukk",
    legal: [
      "Utviklet og driftes av: KM TECH LABS",
      "Sted: Kristiansand, Norge",
      "Organisasjonsnummer: 934 044 029",
      "E-post: contact@autovere.com",
      "Formål: Uavhengig ruteøkonomi, bompenge- og ladekalkulator for europeiske veier.",
    ],
    privacy: [
      "100 % lokal beregning på klientsiden i nettleseren.",
      "Ingen lagring eller sporing av din eksakte posisjonshistorikk.",
      "Ingen salg av data eller tredjeparts-annonsesporing. Fullt GDPR-kompatibel.",
    ],
    terms: [
      "Bompenge-, vignett-, lade- og drivstoffberegninger er veiledende estimater basert på åpne kilder (OpenStreetMap, OSRM, Overpass).",
      "Sjåføren er selv fullt ansvarlig for å overholde gjeldende skilting, fartsgrenser og offisielle takster.",
    ],
  },
  en: {
    legalTitle: "Legal Notice",
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms & Disclaimer",
    close: "Close",
    legal: [
      "Developed and operated by: KM TECH LABS",
      "Location: Kristiansand, Norway",
      "Organization no.: 934 044 029",
      "Email: contact@autovere.com",
      "Purpose: Independent route cost, toll and charging calculator for European roads.",
    ],
    privacy: [
      "100% local calculation in the browser.",
      "No storage or tracking of your exact position history.",
      "No data resale or third-party ad tracking. Fully GDPR-compliant.",
    ],
    terms: [
      "Toll, vignette, charging and fuel estimates are indicative and based on open sources (OpenStreetMap, OSRM, Overpass).",
      "The driver is solely responsible for complying with current road signs, speed limits and official tariffs.",
    ],
  },
  de: {
    legalTitle: "Impressum",
    privacyTitle: "Datenschutzerklärung",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    close: "Schließen",
    legal: [
      "Entwickelt und betrieben von: KM TECH LABS",
      "Ort: Kristiansand, Norwegen",
      "Organisationsnummer: 934 044 029",
      "E-Mail: contact@autovere.com",
      "Zweck: Unabhängiger Routen-, Maut- und Lade-Rechner für europäische Straßen.",
    ],
    privacy: [
      "100 % lokale Berechnung direkt im Browser.",
      "Keine Speicherung oder Verfolgung Ihrer genauen Standorthistorie.",
      "Kein Datenverkauf oder Tracking durch Drittanbieter. Vollständig DSGVO-konform.",
    ],
    terms: [
      "Maut-, Vignette-, Lade- und Kraftstoffschätzungen sind orientierende Berechnungen auf Basis offener Datenquellen (OpenStreetMap, OSRM, Overpass).",
      "Der Fahrer ist allein verantwortlich für die Einhaltung aktueller Beschilderung, Geschwindigkeitsbegrenzungen und offizieller Tarife.",
    ],
  },
  nl: {
    legalTitle: "Juridische informatie",
    privacyTitle: "Privacybeleid",
    termsTitle: "Voorwaarden en disclaimer",
    close: "Sluiten",
    legal: [
      "Ontwikkeld en beheerd door: KM TECH LABS",
      "Locatie: Kristiansand, Noorwegen",
      "Organisatienummer: 934 044 029",
      "E-mail: contact@autovere.com",
      "Doel: een onafhankelijke route-, tol- en laadcalculator voor Europese wegen.",
    ],
    privacy: [
      "Alle berekeningen worden lokaal in je browser uitgevoerd.",
      "We slaan je exacte locatiegeschiedenis niet op en volgen die niet.",
      "We verkopen geen gegevens en gebruiken geen tracking voor advertenties van derden.",
    ],
    terms: [
      "Schattingen voor tol, vignetten, laden en brandstof zijn indicatief en gebaseerd op open bronnen zoals OpenStreetMap, OSRM en Overpass.",
      "De bestuurder blijft zelf verantwoordelijk voor actuele verkeersborden, snelheidslimieten en officiële tarieven.",
    ],
  },
  pl: {
    legalTitle: "Nota prawna",
    privacyTitle: "Polityka prywatności",
    termsTitle: "Warunki i wyłączenie odpowiedzialności",
    close: "Zamknij",
    legal: [
      "Opracowane i prowadzone przez: KM TECH LABS",
      "Lokalizacja: Kristiansand, Norwegia",
      "Numer organizacji: 934 044 029",
      "E-mail: contact@autovere.com",
      "Cel: Niezależny kalkulator tras, opłat i ładowania dla europejskich dróg.",
    ],
    privacy: [
      "100% lokalne obliczenia w przeglądarce.",
      "Brak przechowywania ani śledzenia dokładnej historii położenia.",
      "Brak sprzedaży danych ani reklamowych śledzeń firm trzecich. W pełni zgodne z RODO.",
    ],
    terms: [
      "Szacunki opłat, winiet, ładowania i paliwa są orientacyjne i opierają się na otwartych źródłach (OpenStreetMap, OSRM, Overpass).",
      "Kierowca jest wyłącznie odpowiedzialny za przestrzeganie aktualnych znaków drogowych, limitów prędkości i oficjalnych stawek.",
    ],
  },
  sv: {
    legalTitle: "Juridisk information",
    privacyTitle: "Integritetspolicy",
    termsTitle: "Villkor och ansvarsfriskrivning",
    close: "Stäng",
    legal: [
      "AutoVere utvecklas och drivs av KM TECH LABS i Kristiansand, Norge.",
      "Org.nr: 934 044 029",
      "E-post: contact@autovere.com",
      "Syfte: Oberoende beräkning av resrutter, vägavgifter och laddning för europeiska vägar.",
    ],
    privacy: [
      "100 % lokal beräkning på klientsidan i webbläsaren.",
      "Ingen lagring eller spårning av din exakta positionshistorik.",
      "Ingen försäljning av data eller tredjeparts annonsspårning. Fullt GDPR-kompatibel.",
    ],
    terms: [
      "Beräkningar av vägavgifter, vinjetter, laddning och drivmedel är vägledande uppskattningar baserade på öppna källor som OpenStreetMap, OSRM och Overpass.",
      "Föraren ansvarar själv för att följa aktuell skyltning, hastighetsbegränsningar, trafikregler och officiella avgifter.",
    ],
  },
  fr: {
    legalTitle: "Mentions légales",
    privacyTitle: "Politique de confidentialité",
    termsTitle: "Conditions et clause de non-responsabilité",
    close: "Fermer",
    legal: [
      "Développé et exploité par : KM TECH LABS",
      "Lieu : Kristiansand, Norvège",
      "Numéro d'organisation : 934 044 029",
      "E-mail : contact@autovere.com",
      "Objet : Calculateur indépendant de coûts de trajet, péages et recharge pour les routes européennes.",
    ],
    privacy: [
      "Calcul 100 % local, directement dans le navigateur.",
      "Aucun stockage ni suivi de votre historique de position exact.",
      "Aucune revente de données ni suivi publicitaire tiers. Entièrement conforme au RGPD.",
    ],
    terms: [
      "Les estimations de péages, vignettes, recharge et carburant sont indicatives et basées sur des sources ouvertes (OpenStreetMap, OSRM, Overpass).",
      "Le conducteur est seul responsable du respect de la signalisation en vigueur, des limitations de vitesse et des tarifs officiels.",
    ],
  },
  da: {
    legalTitle: "Juridisk information",
    privacyTitle: "Privatlivspolitik",
    termsTitle: "Vilkår og ansvarsfraskrivelse",
    close: "Luk",
    legal: [
      "Udviklet og drevet af: KM TECH LABS",
      "Sted: Kristiansand, Norge",
      "Organisationsnummer: 934 044 029",
      "E-mail: contact@autovere.com",
      "Formål: Uafhængig ruteberegner for omkostninger, vejafgifter og opladning på europæiske veje.",
    ],
    privacy: [
      "100 % lokal beregning direkte i browseren.",
      "Ingen lagring eller sporing af din præcise positionshistorik.",
      "Intet videresalg af data eller tredjeparts annoncesporing. Fuldt GDPR-kompatibel.",
    ],
    terms: [
      "Vejafgifts-, vignet-, opladnings- og brændstofestimater er vejledende og baseret på åbne kilder (OpenStreetMap, OSRM, Overpass).",
      "Føreren er selv fuldt ansvarlig for at overholde gældende skiltning, hastighedsgrænser og officielle takster.",
    ],
  },
};
