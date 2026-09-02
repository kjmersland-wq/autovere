import type { Locale } from "@/lib/i18n";
import type { PlanTier } from "@/lib/stripe";
import type { RegionKey } from "@/lib/trip-data";


export type Tier = {
  id: PlanTier;
  name: string;
  emoji: string;
  tagline: string;
  monthly: string;
  yearly?: string;
  cta: string;
  highlight?: boolean;
  features: string[];
};

export type PricingCopy = {
  onPlan: string;
  retrying: string;
  until: (d: string) => string;
  renews: (d: string) => string;
  active: string;
  manage: string;
  monthly: string;
  yearly: string;
  forever: string;
  perYear: string;
  perMonth: string;
  mostLoved: string;
  proFine: string;
  current: string;
  switch: string;
  foot: string;
  checkout: string;
  freeToast: string;
  signupToast: string;
  portalError: string;
};

export type PricingHero = { eyebrow: string; title: string; intro: string };

/** BCP-47 tag used for date formatting per locale. */
export const DATE_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  no: "nb-NO",
  sv: "sv-SE",
  da: "da-DK",
  de: "de-DE",
  nl: "nl-NL",
  fr: "fr-FR",
  pl: "pl-PL",
  es: "es-ES",
  it: "it-IT",
};

const EN_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Everything you need for a first honest estimate.",
    monthly: "£0",
    cta: "Start planning free",
    features: [
      "Basic toll, vignette and fuel cost calculations",
      "OSRM routing across Europe, the USA and Canada",
      "One vehicle profile",
      "Country & state cost explorer",
      "Share a trip link",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "For the traveller who lives for the next pass.",
    monthly: "£4.49",
    yearly: "£39",
    cta: "Upgrade to Pro",
    highlight: true,
    features: [
      "Multi-vehicle garage (car, motorhome, motorcycle)",
      "GPX & KML export to Garmin, TomTom and CarPlay",
      "Real-time mountain pass & ferry alerts",
      "Offline turn-by-turn itinerary and print packs",
      "Motorcycle toll discounts & rider safety radar",
      "Unlimited saved adventures",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Fleet",
    emoji: "🚛",
    tagline: "Cross-border operations, consolidated.",
    monthly: "£17",
    cta: "Upgrade to Business",
    features: [
      "Multi-country toll invoice consolidation",
      "Team routing with shared trip libraries",
      "Heavy vehicle profiles (>3.5 t) and axle-based tolls",
      "Driver assignment & cost centre exports (CSV)",
      "Priority support from KM TECH LABS",
    ],
  },
];

const PL_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Wszystko, czego potrzebujesz do pierwszej uczciwej wyceny.",
    monthly: "0 €",
    cta: "Zacznij planować za darmo",
    features: [
      "Podstawowe wyliczenia opłat drogowych, winiet i paliwa",
      "Trasowanie OSRM w Europie, USA i Kanadzie",
      "Jeden profil pojazdu",
      "Przeglądarka kosztów według krajów i stanów",
      "Udostępnianie linku do podróży",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Dla podróżnika, który żyje kolejną przełęczą.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Przejdź na Pro",
    highlight: true,
    features: [
      "Garaż wielu pojazdów (samochód, kamper, motocykl)",
      "Eksport GPX i KML do Garmin, TomTom i CarPlay",
      "Alerty o przełęczach i promach w czasie rzeczywistym",
      "Trasa offline krok po kroku i pakiety do druku",
      "Zniżki motocyklowe i radar bezpieczeństwa kierowcy",
      "Nieograniczona liczba zapisanych podróży",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flota",
    emoji: "🚛",
    tagline: "Operacje transgraniczne w jednym miejscu.",
    monthly: "19 €",
    cta: "Przejdź na Business",
    features: [
      "Konsolidacja faktur za opłaty drogowe z wielu krajów",
      "Trasowanie zespołowe ze wspólną biblioteką podróży",
      "Profile pojazdów ciężkich (>3,5 t) i opłaty według osi",
      "Przypisanie kierowców i eksport centrów kosztów (CSV)",
      "Priorytetowe wsparcie od KM TECH LABS",
    ],
  },
];

const NO_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Alt du trenger for et første ærlig kostnadsanslag.",
    monthly: "0 kr",
    cta: "Begynn å planlegge gratis",
    features: [
      "Grunnleggende beregning av bompenger, vignetter og drivstoff",
      "OSRM-ruting i Europa, USA og Canada",
      "Én kjøretøyprofil",
      "Kostnadsutforsker for land og delstater",
      "Del en turlenke",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "For deg som lever for neste fjellovergang.",
    monthly: "99 kr",
    yearly: "790 kr",
    cta: "Oppgrader til Pro",
    highlight: true,
    features: [
      "Garasje med flere kjøretøy (bil, bobil, motorsykkel)",
      "GPX- og KML-eksport til Garmin, TomTom og CarPlay",
      "Sanntidsvarsler for fjelloverganger og ferger",
      "Offline reiserute og utskriftspakker",
      "Bomrabatter for MC og sikkerhetsradar for føreren",
      "Ubegrenset antall lagrede turer",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flåte",
    emoji: "🚛",
    tagline: "Grensekryssende drift, samlet på ett sted.",
    monthly: "199 kr",
    cta: "Oppgrader til Business",
    features: [
      "Samling av bomfakturaer fra flere land",
      "Teamruting med delt turbibliotek",
      "Profiler for tunge kjøretøy (>3,5 t) og akselbaserte bompenger",
      "Sjåførtildeling og eksport av kostnadssteder (CSV)",
      "Prioritert støtte fra KM TECH LABS",
    ],
  },
];

const SV_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Allt du behöver för en första ärlig kostnadsbild.",
    monthly: "0 kr",
    cta: "Börja planera gratis",
    features: [
      "Grundläggande beräkning av vägtullar, vinjetter och bränsle",
      "OSRM-ruttning i Europa, USA och Kanada",
      "En fordonsprofil",
      "Kostnadsutforskare för länder och delstater",
      "Dela en reselänk",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "För resenären som lever för nästa bergspass.",
    monthly: "59 kr",
    yearly: "490 kr",
    cta: "Uppgradera till Pro",
    highlight: true,
    features: [
      "Garage med flera fordon (bil, husbil, motorcykel)",
      "GPX- och KML-export till Garmin, TomTom och CarPlay",
      "Realtidsvarningar för bergspass och färjor",
      "Offline reseplan och utskriftspaket",
      "Tullrabatter för MC och säkerhetsradar för föraren",
      "Obegränsat antal sparade resor",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flotta",
    emoji: "🚛",
    tagline: "Gränsöverskridande verksamhet, samlad.",
    monthly: "119 kr",
    cta: "Uppgradera till Business",
    features: [
      "Konsolidering av vägtullsfakturor från flera länder",
      "Teamruttning med delat resebibliotek",
      "Profiler för tunga fordon (>3,5 t) och axelbaserade tullar",
      "Förartilldelning och export av kostnadsställen (CSV)",
      "Prioriterad support från KM TECH LABS",
    ],
  },
];

const DA_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Alt du skal bruge til et første ærligt overslag.",
    monthly: "0 kr",
    cta: "Begynd at planlægge gratis",
    features: [
      "Grundlæggende beregning af vejafgifter, vignetter og brændstof",
      "OSRM-ruteplanlægning i Europa, USA og Canada",
      "Én køretøjsprofil",
      "Omkostningsoversigt for lande og delstater",
      "Del et turlink",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Til rejsende, der lever for det næste bjergpas.",
    monthly: "39 kr",
    yearly: "329 kr",
    cta: "Opgrader til Pro",
    highlight: true,
    features: [
      "Garage med flere køretøjer (bil, autocamper, motorcykel)",
      "GPX- og KML-eksport til Garmin, TomTom og CarPlay",
      "Realtidsvarsler om bjergpas og færger",
      "Offline rejseplan og printpakker",
      "Vejafgiftsrabatter til MC og sikkerhedsradar for føreren",
      "Ubegrænset antal gemte ture",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flåde",
    emoji: "🚛",
    tagline: "Grænseoverskridende drift, samlet ét sted.",
    monthly: "139 kr",
    cta: "Opgrader til Business",
    features: [
      "Samling af vejafgiftsfakturaer fra flere lande",
      "Teamruteplanlægning med fælles turbibliotek",
      "Profiler for tunge køretøjer (>3,5 t) og akselbaserede afgifter",
      "Chaufførtildeling og eksport af omkostningssteder (CSV)",
      "Prioriteret support fra KM TECH LABS",
    ],
  },
];

const DE_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Alles für eine erste ehrliche Kostenschätzung.",
    monthly: "0 €",
    cta: "Kostenlos planen",
    features: [
      "Grundlegende Berechnung von Maut, Vignetten und Kraftstoff",
      "OSRM-Routing in Europa, den USA und Kanada",
      "Ein Fahrzeugprofil",
      "Kostenübersicht nach Ländern und Bundesstaaten",
      "Reiselink teilen",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Für alle, die für den nächsten Pass leben.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Auf Pro upgraden",
    highlight: true,
    features: [
      "Garage mit mehreren Fahrzeugen (Auto, Wohnmobil, Motorrad)",
      "GPX- und KML-Export zu Garmin, TomTom und CarPlay",
      "Echtzeit-Warnungen zu Pässen und Fähren",
      "Offline-Reiseplan und Druckpakete",
      "Motorrad-Mautrabatte und Sicherheitsradar",
      "Unbegrenzt gespeicherte Reisen",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flotte",
    emoji: "🚛",
    tagline: "Grenzüberschreitender Betrieb, gebündelt.",
    monthly: "19 €",
    cta: "Auf Business upgraden",
    features: [
      "Konsolidierung von Mautrechnungen aus mehreren Ländern",
      "Team-Routing mit gemeinsamer Reisebibliothek",
      "Profile für schwere Fahrzeuge (>3,5 t) und achsbasierte Maut",
      "Fahrerzuweisung und Kostenstellen-Export (CSV)",
      "Priorisierter Support von KM TECH LABS",
    ],
  },
];

const NL_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Alles voor een eerste eerlijke kostenraming.",
    monthly: "€ 0",
    cta: "Gratis beginnen met plannen",
    features: [
      "Basisberekening van tol, vignetten en brandstof",
      "OSRM-routering in Europa, de VS en Canada",
      "Eén voertuigprofiel",
      "Kostenverkenner per land en staat",
      "Deel een reislink",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Voor de reiziger die leeft voor de volgende bergpas.",
    monthly: "€ 4,99",
    yearly: "€ 39",
    cta: "Upgraden naar Pro",
    highlight: true,
    features: [
      "Garage met meerdere voertuigen (auto, camper, motor)",
      "GPX- en KML-export naar Garmin, TomTom en CarPlay",
      "Realtime meldingen over bergpassen en veerboten",
      "Offline routebeschrijving en printpakketten",
      "Tolkorting voor motoren en veiligheidsradar",
      "Onbeperkt opgeslagen reizen",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Wagenpark",
    emoji: "🚛",
    tagline: "Grensoverschrijdende operaties, gebundeld.",
    monthly: "€ 19",
    cta: "Upgraden naar Business",
    features: [
      "Consolidatie van tolfacturen uit meerdere landen",
      "Teamrouting met gedeelde reisbibliotheek",
      "Profielen voor zware voertuigen (>3,5 t) en astol",
      "Chauffeurstoewijzing en kostenplaats-export (CSV)",
      "Prioriteitssupport van KM TECH LABS",
    ],
  },
];

const FR_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Tout pour une première estimation honnête.",
    monthly: "0 €",
    cta: "Commencer gratuitement",
    features: [
      "Calcul de base des péages, vignettes et carburant",
      "Itinéraires OSRM en Europe, aux États-Unis et au Canada",
      "Un profil de véhicule",
      "Explorateur de coûts par pays et par état",
      "Partage d'un lien de voyage",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Pour le voyageur qui vit pour le prochain col.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Passer à Pro",
    highlight: true,
    features: [
      "Garage multi-véhicules (voiture, camping-car, moto)",
      "Export GPX et KML vers Garmin, TomTom et CarPlay",
      "Alertes en temps réel sur les cols et les ferries",
      "Feuille de route hors ligne et carnets à imprimer",
      "Réductions de péage moto et radar de sécurité",
      "Voyages enregistrés en illimité",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flotte",
    emoji: "🚛",
    tagline: "Opérations transfrontalières, centralisées.",
    monthly: "19 €",
    cta: "Passer à Business",
    features: [
      "Consolidation des factures de péage multi-pays",
      "Itinéraires d'équipe avec bibliothèque partagée",
      "Profils poids lourds (>3,5 t) et péages par essieu",
      "Affectation des conducteurs et export des centres de coûts (CSV)",
      "Support prioritaire de KM TECH LABS",
    ],
  },
];

const ES_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Todo lo que necesitas para una primera estimación honesta.",
    monthly: "0 €",
    cta: "Empieza a planificar gratis",
    features: [
      "Cálculo básico de peajes, viñetas y combustible",
      "Rutas OSRM por Europa, EE. UU. y Canadá",
      "Un perfil de vehículo",
      "Explorador de costes por país y estado",
      "Comparte un enlace de viaje",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Para quien vive para el próximo puerto de montaña.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Pasar a Pro",
    highlight: true,
    features: [
      "Garaje multivehículo (coche, autocaravana, moto)",
      "Exportación GPX y KML a Garmin, TomTom y CarPlay",
      "Alertas en tiempo real de puertos de montaña y ferris",
      "Itinerario offline paso a paso y packs para imprimir",
      "Descuentos de peaje para moto y radar de seguridad del conductor",
      "Viajes guardados ilimitados",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flota",
    emoji: "🚛",
    tagline: "Operaciones transfronterizas, centralizadas.",
    monthly: "19 €",
    cta: "Pasar a Business",
    features: [
      "Consolidación de facturas de peaje multipaís",
      "Rutas de equipo con biblioteca de viajes compartida",
      "Perfiles de vehículos pesados (>3,5 t) y peajes por eje",
      "Asignación de conductores y exportación de centros de coste (CSV)",
      "Soporte prioritario de KM TECH LABS",
    ],
  },
];

export const TIERS = EN_TIERS;
export const TIERS_PL = PL_TIERS;

const TIERS_BY_LOCALE: Record<Locale, Tier[]> = {
  en: EN_TIERS,
  no: NO_TIERS,
  sv: SV_TIERS,
  da: DA_TIERS,
  de: DE_TIERS,
  nl: NL_TIERS,
  fr: FR_TIERS,
  pl: PL_TIERS,
  es: ES_TIERS,
  it: EN_TIERS,
};

const COPY_BASE = {
  en: {
    onPlan: "You're on",
    retrying: " — payment retrying",
    until: (d) => `Access stays open until ${d}.`,
    renews: (d) => `Renews ${d}.`,
    active: "Active subscription.",
    manage: "Manage billing",
    monthly: "Monthly",
    yearly: "Yearly · save 35%",
    forever: "forever",
    perYear: "per year",
    perMonth: "per month",
    mostLoved: "Most loved",
    proFine: "£4.49/mo or £39/yr — cancel anytime.",
    current: "Your current plan",
    switch: "Switch plan in billing portal",
    foot: "Prices in EUR incl. applicable VAT. Payments and tax handled securely by Stripe. Cost estimates remain indicative — always verify with official toll portals.",
    checkout: "Secure checkout",
    freeToast: "You're on the Free plan — plan away!",
    signupToast: "Create your account first, then we'll take you straight to secure checkout.",
    portalError: "Could not open the billing portal.",
  },
  no: {
    onPlan: "Du har",
    retrying: " — betaling prøves på nytt",
    until: (d) => `Tilgangen varer til ${d}.`,
    renews: (d) => `Fornyes ${d}.`,
    active: "Aktivt abonnement.",
    manage: "Administrer betaling",
    monthly: "Månedlig",
    yearly: "Årlig · spar 35 %",
    forever: "for alltid",
    perYear: "per år",
    perMonth: "per måned",
    mostLoved: "Mest populær",
    proFine: "99 kr/mnd eller 790 kr/år — avbryt når du vil.",
    current: "Din nåværende plan",
    switch: "Bytt plan i betalingsportalen",
    foot: "Priser i EUR inkl. gjeldende mva. Betaling og skatt håndteres sikkert av Stripe. Kostnadsanslag er veiledende — sjekk alltid offisielle bomportaler.",
    checkout: "Sikker betaling",
    freeToast: "Du bruker Free-planen — god tur!",
    signupToast: "Opprett konto først, så tar vi deg rett til sikker betaling.",
    portalError: "Kunne ikke åpne betalingsportalen.",
  },
  sv: {
    onPlan: "Du har",
    retrying: " — betalningen görs om",
    until: (d) => `Åtkomsten gäller till ${d}.`,
    renews: (d) => `Förnyas ${d}.`,
    active: "Aktiv prenumeration.",
    manage: "Hantera betalning",
    monthly: "Månadsvis",
    yearly: "Årsvis · spara 35 %",
    forever: "för alltid",
    perYear: "per år",
    perMonth: "per månad",
    mostLoved: "Mest omtyckt",
    proFine: "59 kr/mån eller 490 kr/år — avsluta när du vill.",
    current: "Din nuvarande plan",
    switch: "Byt plan i betalportalen",
    foot: "Priser i EUR inkl. tillämplig moms. Betalningar och skatt hanteras säkert av Stripe. Kostnadsberäkningar är vägledande — kontrollera alltid officiella tullportaler.",
    checkout: "Säker betalning",
    freeToast: "Du använder Free-planen — planera loss!",
    signupToast: "Skapa ditt konto först, sedan tar vi dig direkt till säker betalning.",
    portalError: "Det gick inte att öppna betalportalen.",
  },
  da: {
    onPlan: "Du har",
    retrying: " — betaling forsøges igen",
    until: (d) => `Adgangen gælder til ${d}.`,
    renews: (d) => `Fornyes ${d}.`,
    active: "Aktivt abonnement.",
    manage: "Administrer betaling",
    monthly: "Månedligt",
    yearly: "Årligt · spar 35 %",
    forever: "for altid",
    perYear: "pr. år",
    perMonth: "pr. måned",
    mostLoved: "Mest populær",
    proFine: "39 kr/md. eller 329 kr/år — opsig når som helst.",
    current: "Din nuværende plan",
    switch: "Skift plan i betalingsportalen",
    foot: "Priser i EUR inkl. gældende moms. Betaling og skat håndteres sikkert af Stripe. Estimater er vejledende — tjek altid officielle vejafgiftsportaler.",
    checkout: "Sikker betaling",
    freeToast: "Du bruger Free-planen — god tur!",
    signupToast: "Opret din konto først, så sender vi dig direkte til sikker betaling.",
    portalError: "Betalingsportalen kunne ikke åbnes.",
  },
  de: {
    onPlan: "Ihr Tarif:",
    retrying: " — Zahlung wird erneut versucht",
    until: (d) => `Zugang bleibt bis ${d} bestehen.`,
    renews: (d) => `Verlängert sich am ${d}.`,
    active: "Aktives Abonnement.",
    manage: "Zahlungen verwalten",
    monthly: "Monatlich",
    yearly: "Jährlich · 35 % sparen",
    forever: "für immer",
    perYear: "pro Jahr",
    perMonth: "pro Monat",
    mostLoved: "Am beliebtesten",
    proFine: "4,99 €/Monat oder 39 €/Jahr — jederzeit kündbar.",
    current: "Ihr aktueller Tarif",
    switch: "Tarif im Zahlungsportal wechseln",
    foot: "Preise in EUR inkl. gesetzlicher MwSt. Zahlungen und Steuern werden sicher von Stripe abgewickelt. Kostenschätzungen sind Richtwerte — prüfen Sie stets die offiziellen Mautportale.",
    checkout: "Sichere Bezahlung",
    freeToast: "Sie nutzen den Free-Tarif — gute Fahrt!",
    signupToast: "Erstellen Sie zuerst Ihr Konto, danach geht es direkt zur sicheren Bezahlung.",
    portalError: "Das Zahlungsportal konnte nicht geöffnet werden.",
  },
  nl: {
    onPlan: "Je hebt",
    retrying: " — betaling wordt opnieuw geprobeerd",
    until: (d) => `Toegang blijft open tot ${d}.`,
    renews: (d) => `Verlengt op ${d}.`,
    active: "Actief abonnement.",
    manage: "Facturatie beheren",
    monthly: "Maandelijks",
    yearly: "Jaarlijks · bespaar 35%",
    forever: "voor altijd",
    perYear: "per jaar",
    perMonth: "per maand",
    mostLoved: "Meest gekozen",
    proFine: "€ 4,99/mnd of € 39/jaar — altijd opzegbaar.",
    current: "Je huidige abonnement",
    switch: "Wissel van abonnement in het betaalportaal",
    foot: "Prijzen in EUR incl. btw waar van toepassing. Betalingen en belasting worden veilig afgehandeld door Stripe. Kostenramingen zijn indicatief — controleer altijd de officiële tolportalen.",
    checkout: "Veilig afrekenen",
    freeToast: "Je gebruikt het Free-abonnement — plan er op los!",
    signupToast: "Maak eerst je account aan, daarna gaan we direct naar veilig afrekenen.",
    portalError: "Het betaalportaal kon niet worden geopend.",
  },
  fr: {
    onPlan: "Votre offre :",
    retrying: " — nouvelle tentative de paiement",
    until: (d) => `L'accès reste ouvert jusqu'au ${d}.`,
    renews: (d) => `Renouvellement le ${d}.`,
    active: "Abonnement actif.",
    manage: "Gérer la facturation",
    monthly: "Mensuel",
    yearly: "Annuel · économisez 35 %",
    forever: "pour toujours",
    perYear: "par an",
    perMonth: "par mois",
    mostLoved: "Le plus apprécié",
    proFine: "4,99 €/mois ou 39 €/an — annulable à tout moment.",
    current: "Votre offre actuelle",
    switch: "Changer d'offre dans le portail de facturation",
    foot: "Prix en EUR TVA applicable incluse. Paiements et taxes gérés en toute sécurité par Stripe. Les estimations restent indicatives — vérifiez toujours auprès des portails de péage officiels.",
    checkout: "Paiement sécurisé",
    freeToast: "Vous êtes sur l'offre Free — bonne route !",
    signupToast: "Créez d'abord votre compte, puis nous vous emmenons directement au paiement sécurisé.",
    portalError: "Impossible d'ouvrir le portail de facturation.",
  },
  pl: {
    onPlan: "Twój plan to",
    retrying: " — ponawiamy płatność",
    until: (d) => `Dostęp pozostaje otwarty do ${d}.`,
    renews: (d) => `Odnawia się ${d}.`,
    active: "Aktywna subskrypcja.",
    manage: "Zarządzaj płatnościami",
    monthly: "Miesięcznie",
    yearly: "Rocznie · oszczędzasz 35%",
    forever: "na zawsze",
    perYear: "rocznie",
    perMonth: "miesięcznie",
    mostLoved: "Najczęściej wybierany",
    proFine: "4,99 €/mies. lub 39 €/rok — anulujesz, kiedy chcesz.",
    current: "Twój obecny plan",
    switch: "Zmień plan w panelu płatności",
    foot: "Ceny w EUR z odpowiednim VAT. Płatności i podatki bezpiecznie obsługuje Stripe. Szacunki kosztów są orientacyjne — zawsze sprawdź je na oficjalnych portalach opłat drogowych.",
    checkout: "Bezpieczna płatność",
    freeToast: "Korzystasz z planu Free — planuj do woli!",
    signupToast: "Najpierw załóż konto, a potem przeniesiemy Cię prosto do bezpiecznej płatności.",
    portalError: "Nie udało się otworzyć panelu płatności.",
  },
  es: {
    onPlan: "Tu plan:",
    retrying: " — reintentando el pago",
    until: (d) => `El acceso sigue abierto hasta el ${d}.`,
    renews: (d) => `Se renueva el ${d}.`,
    active: "Suscripción activa.",
    manage: "Gestionar facturación",
    monthly: "Mensual",
    yearly: "Anual · ahorra 35 %",
    forever: "para siempre",
    perYear: "al año",
    perMonth: "al mes",
    mostLoved: "El más elegido",
    proFine: "4,99 €/mes o 39 €/año — cancela cuando quieras.",
    current: "Tu plan actual",
    switch: "Cambia de plan en el portal de facturación",
    foot: "Precios en EUR con el IVA aplicable incluido. Los pagos y los impuestos los gestiona Stripe de forma segura. Las estimaciones de coste son orientativas — verifica siempre en los portales oficiales de peaje.",
    checkout: "Pago seguro",
    freeToast: "Estás en el plan Free — ¡a planificar!",
    signupToast: "Crea primero tu cuenta y te llevaremos directo al pago seguro.",
    portalError: "No se pudo abrir el portal de facturación.",
  },
} satisfies Partial<Record<Locale, PricingCopy>>;

const COPY: Record<Locale, PricingCopy> = { ...COPY_BASE, es: COPY_BASE.es, it: COPY_BASE.en };

const HERO_BASE = {
  en: {
    eyebrow: "Plans & pricing",
    title: "Pick the plan that matches your road ahead.",
    intro:
      "Every plan starts with honest numbers. Upgrade when you want a full garage, offline navigation and fleet-grade toll invoicing — cancel whenever the season ends.",
  },
  no: {
    eyebrow: "Planer og priser",
    title: "Velg planen som passer veien videre.",
    intro:
      "Hver plan starter med ærlige tall. Oppgrader når du vil ha full garasje, offline navigasjon og bomfakturering for flåte — avbryt når sesongen er over.",
  },
  sv: {
    eyebrow: "Planer och priser",
    title: "Välj planen som matchar vägen framåt.",
    intro:
      "Varje plan börjar med ärliga siffror. Uppgradera när du vill ha fullt garage, offlinenavigering och vägtullsfakturering för flottan — avsluta när säsongen är slut.",
  },
  da: {
    eyebrow: "Planer og priser",
    title: "Vælg den plan, der passer til vejen forude.",
    intro:
      "Hver plan starter med ærlige tal. Opgrader, når du vil have fuld garage, offline navigation og flådefakturering af vejafgifter — opsig når sæsonen slutter.",
  },
  de: {
    eyebrow: "Tarife & Preise",
    title: "Wählen Sie den Tarif, der zu Ihrer Route passt.",
    intro:
      "Jeder Tarif beginnt mit ehrlichen Zahlen. Upgraden Sie, wenn Sie eine volle Garage, Offline-Navigation und Mautabrechnung für Flotten möchten — jederzeit kündbar.",
  },
  nl: {
    eyebrow: "Abonnementen & prijzen",
    title: "Kies het abonnement dat past bij de weg die voor je ligt.",
    intro:
      "Elk abonnement begint met eerlijke cijfers. Upgrade wanneer je een volle garage, offline navigatie en tolfacturatie voor wagenparken wilt — altijd opzegbaar.",
  },
  fr: {
    eyebrow: "Offres et tarifs",
    title: "Choisissez l'offre qui correspond à votre route.",
    intro:
      "Chaque offre commence par des chiffres honnêtes. Passez au niveau supérieur pour un garage complet, la navigation hors ligne et la facturation des péages en flotte — annulable à tout moment.",
  },
  pl: {
    eyebrow: "Plany i cennik",
    title: "Wybierz plan dopasowany do drogi, która przed Tobą.",
    intro:
      "Każdy plan zaczyna się od uczciwych liczb. Ulepsz go, gdy zechcesz mieć pełny garaż, nawigację offline i rozliczenia opłat dla floty — anulujesz, kiedy sezon się kończy.",
  },
  es: {
    eyebrow: "Planes y precios",
    title: "Elige el plan que se ajuste a tu próxima ruta.",
    intro:
      "Todos los planes empiezan con cifras honestas. Mejora tu plan cuando quieras un garaje completo, navegación offline y facturación de peajes para flotas — cancela cuando termine la temporada.",
  },
};

const HERO: Record<Locale, PricingHero> = { ...HERO_BASE, es: HERO_BASE.es, it: HERO_BASE.en };

/**
 * Regional price overrides. The tier structure, features and copy stay identical
 * across every region — only the displayed amounts and currency change.
 */
const REGION_PRICES: Partial<Record<RegionKey, Partial<Record<PlanTier, { monthly: string; yearly?: string }>>>> = {
  us: {
    free: { monthly: "$0" },
    pro: { monthly: "$5.99", yearly: "$49" },
    fleet: { monthly: "$24" },
  },
  ca: {
    free: { monthly: "$0 CAD" },
    pro: { monthly: "$6.99 CAD", yearly: "$59 CAD" },
    fleet: { monthly: "$29 CAD" },
  },
};

export function tiersFor(locale: Locale, region?: RegionKey): Tier[] {
  const base = TIERS_BY_LOCALE[locale] ?? EN_TIERS;
  const overrides = region ? REGION_PRICES[region] : undefined;
  if (!overrides) return base;
  return base.map((tier) => {
    const price = overrides[tier.id];
    if (!price) return tier;
    const { yearly: baseYearly, ...rest } = tier;
    const yearly = price.yearly ?? baseYearly;
    return { ...rest, monthly: price.monthly, ...(yearly ? { yearly } : {}) };
  });
}


export function pricingCopy(locale: Locale): PricingCopy {
  return COPY[locale] ?? COPY.en;
}

export function pricingHero(locale: Locale): PricingHero {
  return HERO[locale] ?? HERO.en;
}
