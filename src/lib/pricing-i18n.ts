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
  pt: "pt-PT",
  us: "en-US",
  fi: "fi-FI",
  ja: "ja-JP",
  zh: "zh-CN",
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

const IT_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Tutto quello che ti serve per una prima stima onesta.",
    monthly: "0 €",
    cta: "Inizia a pianificare gratis",
    features: [
      "Calcolo di base di pedaggi, vignette e carburante",
      "Instradamento OSRM in Europa, negli USA e in Canada",
      "Un profilo veicolo",
      "Esplora i costi per paese e stato",
      "Condividi un link di viaggio",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Per chi vive per il prossimo passo di montagna.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Passa a Pro",
    highlight: true,
    features: [
      "Garage multi-veicolo (auto, camper, moto)",
      "Esportazione GPX e KML verso Garmin, TomTom e CarPlay",
      "Avvisi in tempo reale su passi di montagna e traghetti",
      "Itinerario offline passo-passo e pacchetti da stampare",
      "Sconti pedaggio per la moto e radar di sicurezza per il conducente",
      "Viaggi salvati illimitati",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flotta",
    emoji: "🚛",
    tagline: "Operazioni transfrontaliere, centralizzate.",
    monthly: "19 €",
    cta: "Passa a Business",
    features: [
      "Consolidamento delle fatture di pedaggio multi-paese",
      "Instradamento di squadra con libreria di viaggi condivisa",
      "Profili per veicoli pesanti (>3,5 t) e pedaggi per asse",
      "Assegnazione conducenti ed esportazione centri di costo (CSV)",
      "Supporto prioritario di KM TECH LABS",
    ],
  },
];

const FI_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Kaikki, mitä tarvitset ensimmäiseen rehelliseen kustannusarvioon.",
    monthly: "0 €",
    cta: "Aloita suunnittelu ilmaiseksi",
    features: [
      "Tietullien, vinjettien ja polttoaineen peruskustannuslaskelmat",
      "OSRM-reititys Euroopassa, USA:ssa ja Kanadassa",
      "Yksi ajoneuvoprofiili",
      "Maa- ja osavaltiokohtainen kustannusselain",
      "Jaa matkalinkki",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Matkailijalle, joka elää seuraavaa vuoristosolaa varten.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Päivitä Prohon",
    highlight: true,
    features: [
      "Monen ajoneuvon autotalli (auto, matkailuauto, moottoripyörä)",
      "GPX- ja KML-vienti Garminiin, TomTomiin ja CarPlayhin",
      "Reaaliaikaiset hälytykset vuoristosoluista ja lautoista",
      "Offline-reittiopas ja tulostuspaketit",
      "Moottoripyörien tietullialennukset ja kuljettajan turvallisuustutka",
      "Rajattomasti tallennettuja matkoja",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Kalusto",
    emoji: "🚛",
    tagline: "Rajat ylittävä toiminta, koottuna yhteen.",
    monthly: "19 €",
    cta: "Päivitä Businekseen",
    features: [
      "Monen maan tietullilaskujen yhdistäminen",
      "Tiimin reititys jaetulla matkakirjastolla",
      "Raskaan kaluston profiilit (>3,5 t) ja akselipohjaiset tietullit",
      "Kuljettajien osoittaminen ja kustannuspaikkaviennit (CSV)",
      "Ensisijainen tuki KM TECH LABSilta",
    ],
  },
];

const PT_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Tudo o que precisa para uma primeira estimativa honesta.",
    monthly: "0 €",
    cta: "Começar a planear grátis",
    features: [
      "Cálculo básico de portagens, vinhetas e combustível",
      "Rota OSRM em toda a Europa, nos EUA e no Canadá",
      "Um perfil de veículo",
      "Explorador de custos por país e estado",
      "Partilhar um link de viagem",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Para quem vive para a próxima passagem de montanha.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Passar a Pro",
    highlight: true,
    features: [
      "Garagem multi-veículo (carro, autocaravana, mota)",
      "Exportação GPX e KML para Garmin, TomTom e CarPlay",
      "Alertas em tempo real de passagens de montanha e ferries",
      "Itinerário offline passo a passo e pacotes para imprimir",
      "Descontos de portagem para motas e radar de segurança do condutor",
      "Viagens guardadas ilimitadas",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Frota",
    emoji: "🚛",
    tagline: "Operações transfronteiriças, tudo num só lugar.",
    monthly: "19 €",
    cta: "Passar a Business",
    features: [
      "Consolidação de faturas de portagem multi-país",
      "Planeamento de equipa com bibliotecas de viagens partilhadas",
      "Perfis de veículos pesados (>3,5 t) e portagens por eixo",
      "Atribuição de condutores e exportação de centros de custo (CSV)",
      "Suporte prioritário da KM TECH LABS",
    ],
  },
];

const JA_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "まずは無料で、正直な費用の目安から。",
    monthly: "0 €",
    cta: "無料で始める",
    features: [
      "通行料金・ビニエット・燃料費の基本計算",
      "ヨーロッパ・アメリカ・カナダ全域のOSRMルート検索",
      "車両登録1台まで",
      "国・州別の費用データベース",
      "旅のリンクを共有",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "次の峠道を待ちわびる旅人のために。",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Proにアップグレード",
    highlight: true,
    features: [
      "複数車両のガレージ管理（車・キャンピングカー・バイク）",
      "Garmin・TomTom・CarPlayへのGPX/KMLエクスポート",
      "山岳峠・フェリーのリアルタイム通知",
      "オフライン旅程表と印刷パック",
      "バイクの通行料金割引・安全レーダー",
      "旅の保存件数は無制限",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / フリート",
    emoji: "🚛",
    tagline: "国境をまたぐ運行管理を、ひとつにまとめて。",
    monthly: "19 €",
    cta: "Businessにアップグレード",
    features: [
      "複数国にまたがる通行料金請求の一元管理",
      "チームでのルート共有ライブラリ",
      "大型車両（3.5t超）プロファイルと車軸別課金対応",
      "ドライバー割り当てとコストセンターのCSVエクスポート",
      "KM TECH LABSによる優先サポート",
    ],
  },
];

const ZH_TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "先看清真实的费用，再决定要不要上路——完全免费。",
    monthly: "0 €",
    cta: "免费开始规划",
    features: [
      "基础的过路费、电子通行凭证与油耗计算",
      "覆盖欧洲、美国与加拿大全境的OSRM路线规划",
      "可保存1辆车",
      "按国家/州查询费用参考",
      "分享行程链接",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "献给总是惦记着下一个山口的旅行者。",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "升级至 Pro",
    highlight: true,
    features: [
      "多车库管理（汽车、房车、摩托车）",
      "支持导出GPX与KML格式，适配Garmin、TomTom与CarPlay",
      "山口与渡轮实时提醒",
      "离线逐向导航与可打印行程手册",
      "摩托车通行优惠与骑行安全提醒",
      "行程保存数量不限",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / 车队版",
    emoji: "🚛",
    tagline: "跨国运营，账单统一管理。",
    monthly: "19 €",
    cta: "升级至 Business",
    features: [
      "多国过路费账单一站整合",
      "团队路线共享库",
      "重型车辆（超过3.5吨）与按轴计费方案",
      "司机分配与成本中心导出（CSV）",
      "KM TECH LABS 优先支持",
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
  it: IT_TIERS,
  pt: PT_TIERS,
  us: EN_TIERS,
  fi: FI_TIERS,
  ja: JA_TIERS,
  zh: ZH_TIERS,
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
  it: {
    onPlan: "Il tuo piano:",
    retrying: " — nuovo tentativo di pagamento",
    until: (d) => `L'accesso resta attivo fino al ${d}.`,
    renews: (d) => `Si rinnova il ${d}.`,
    active: "Abbonamento attivo.",
    manage: "Gestisci fatturazione",
    monthly: "Mensile",
    yearly: "Annuale · risparmia il 35%",
    forever: "per sempre",
    perYear: "all'anno",
    perMonth: "al mese",
    mostLoved: "Il più scelto",
    proFine: "4,99 €/mese o 39 €/anno — annulla quando vuoi.",
    current: "Il tuo piano attuale",
    switch: "Cambia piano nel portale di fatturazione",
    foot: "Prezzi in EUR, IVA applicabile inclusa. Pagamenti e imposte gestiti in sicurezza da Stripe. Le stime di costo restano indicative — verifica sempre sui portali ufficiali dei pedaggi.",
    checkout: "Pagamento sicuro",
    freeToast: "Sei sul piano Free — buona pianificazione!",
    signupToast: "Crea prima il tuo account: ti porteremo direttamente al pagamento sicuro.",
    portalError: "Impossibile aprire il portale di fatturazione.",
  },
  pt: {
    onPlan: "O seu plano:",
    retrying: " — a repetir o pagamento",
    until: (d) => `O acesso mantém-se até ${d}.`,
    renews: (d) => `Renova a ${d}.`,
    active: "Subscrição ativa.",
    manage: "Gerir faturação",
    monthly: "Mensal",
    yearly: "Anual · poupe 35%",
    forever: "para sempre",
    perYear: "por ano",
    perMonth: "por mês",
    mostLoved: "O mais escolhido",
    proFine: "4,99 €/mês ou 39 €/ano — cancele quando quiser.",
    current: "O seu plano atual",
    switch: "Mudar de plano no portal de faturação",
    foot: "Preços em EUR com o IVA aplicável incluído. Pagamentos e impostos geridos com segurança pela Stripe. As estimativas de custo são indicativas — confirme sempre nos portais oficiais de portagens.",
    checkout: "Pagamento seguro",
    freeToast: "Está no plano Free — boas viagens a planear!",
    signupToast: "Crie primeiro a sua conta e depois levamo-lo diretamente ao pagamento seguro.",
    portalError: "Não foi possível abrir o portal de faturação.",
  },
  fi: {
    onPlan: "Tilauksesi:",
    retrying: " — maksuyritys toistetaan",
    until: (d) => `Käyttöoikeus on voimassa ${d} asti.`,
    renews: (d) => `Uusiutuu ${d}.`,
    active: "Aktiivinen tilaus.",
    manage: "Hallinnoi laskutusta",
    monthly: "Kuukausittain",
    yearly: "Vuosittain - säästä 35%",
    forever: "ikuisesti",
    perYear: "vuodessa",
    perMonth: "kuukaudessa",
    mostLoved: "Suosituin",
    proFine: "4,99 €/kk tai 39 €/vuosi — peru milloin tahansa.",
    current: "Nykyinen tilauksesi",
    switch: "Vaihda tilausta laskutusportaalissa",
    foot: "Hinnat euroissa sis. soveltuva ALV. Maksut ja verot käsittelee turvallisesti Stripe. Kustannusarviot ovat suuntaa-antavia — tarkista aina viralliset tietullipalvelut.",
    checkout: "Turvallinen maksu",
    freeToast: "Käytät Free-tilausta — suunnittele vapaasti!",
    signupToast: "Luo tili ensin, niin viemme sinut suoraan turvalliseen maksuun.",
    portalError: "Laskutusportaalia ei voitu avata.",
  },
  ja: {
    onPlan: "現在のプラン：",
    retrying: "（お支払いを再試行中）",
    until: (d) => `${d}まで引き続きご利用いただけます。`,
    renews: (d) => `${d}に更新されます。`,
    active: "有効なサブスクリプションです。",
    manage: "請求情報を管理",
    monthly: "月払い",
    yearly: "年払い・35%お得",
    forever: "ずっと無料",
    perYear: "年あたり",
    perMonth: "月あたり",
    mostLoved: "人気No.1",
    proFine: "月額4.99€、または年額39€——いつでも解約できます。",
    current: "現在のプラン",
    switch: "請求ポータルでプランを変更",
    foot: "価格は該当するVATを含むEUR表示です。お支払いと税務処理はStripeが安全に行います。費用の見積もりはあくまで目安ですので、必ず公式の通行料金ポータルでご確認ください。",
    checkout: "安全なお支払い",
    freeToast: "Freeプランをご利用中です。さっそく計画を立てましょう。",
    signupToast: "まずはアカウントを作成してください。そのあと、安全なお支払い画面にご案内します。",
    portalError: "請求ポータルを開けませんでした。",
  },
  zh: {
    onPlan: "您当前的套餐：",
    retrying: "（付款重试中）",
    until: (d) => `访问权限将保留至${d}。`,
    renews: (d) => `将于${d}续费。`,
    active: "订阅已生效。",
    manage: "管理账单",
    monthly: "按月",
    yearly: "按年 · 立省35%",
    forever: "长期免费",
    perYear: "/年",
    perMonth: "/月",
    mostLoved: "最受欢迎",
    proFine: "每月4.99欧元或每年39欧元——随时可以取消。",
    current: "您当前的套餐",
    switch: "在账单管理页面更换套餐",
    foot: "价格以欧元计价，已含适用增值税。付款与税务处理由Stripe安全完成。费用预估仅供参考——请以官方过路费平台的信息为准。",
    checkout: "安全支付",
    freeToast: "您正在使用免费套餐——尽情规划旅程吧。",
    signupToast: "请先创建账户，随后我们会立即为您跳转至安全支付页面。",
    portalError: "账单管理页面暂时无法打开。",
  },
} satisfies Partial<Record<Locale, PricingCopy>>;

const COPY: Record<Locale, PricingCopy> = {
  ...COPY_BASE,
  es: COPY_BASE.es,
  it: COPY_BASE.it,
  pt: COPY_BASE.pt,
  us: COPY_BASE.en,
  fi: COPY_BASE.fi,
  ja: COPY_BASE.ja,
  zh: COPY_BASE.zh,
};

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
  it: {
    eyebrow: "Piani e prezzi",
    title: "Scegli il piano più adatto al tuo prossimo viaggio.",
    intro:
      "Ogni piano parte da numeri onesti. Passa a un livello superiore quando vuoi un garage completo, la navigazione offline e la fatturazione dei pedaggi per la tua flotta — annulla quando finisce la stagione.",
  },
  pt: {
    eyebrow: "Planos e preços",
    title: "Escolha o plano que combina com a sua próxima estrada.",
    intro:
      "Todos os planos começam com números honestos. Faça upgrade quando quiser uma garagem completa, navegação offline e faturação de portagens para frotas — cancele quando a época terminar.",
  },
  fi: {
    eyebrow: "Suunnitelmat ja hinnat",
    title: "Valitse matkaasi parhaiten sopiva tilaus",
    intro:
      "Jokainen tilaus alkaa rehellisillä luvuilla. Päivitä kattavampaan versioon, kun haluat tallentaa useampia ajoneuvoja ja viedä reitit navigaattoriin.",
  },
  ja: {
    eyebrow: "プランと料金",
    title: "これからの旅に合うプランを選びましょう。",
    intro:
      "どのプランも、正直な数字から始まります。ガレージを増やしたいとき、オフラインナビや複数国のフリート請求管理が必要になったときにアップグレードを——シーズンが終わればいつでも解約できます。",
  },
  zh: {
    eyebrow: "套餐与价格",
    title: "选择契合你下一段旅程的套餐。",
    intro:
      "每个套餐都从真实、诚实的数字开始。当你需要完整的车库管理、离线导航，或跨国车队的过路费账单管理时，再考虑升级——季节结束时随时可以取消。",
  },
};

const HERO: Record<Locale, PricingHero> = {
  ...HERO_BASE,
  es: HERO_BASE.es,
  it: HERO_BASE.it,
  pt: HERO_BASE.pt,
  us: HERO_BASE.en,
  fi: HERO_BASE.fi,
  ja: HERO_BASE.ja,
  zh: HERO_BASE.zh,
};

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
