import type { Locale } from "./i18n";
import type { MotorhomeCategory } from "./geo";

export type MotorhomeCopy = {
  title: string;
  subtitle: string;
  proLabel: string;
  distanceLabel: string;
  selectAll: string;
  clearAll: string;
  categories: Record<MotorhomeCategory, string>;
  addStop: string;
  added: string;
  empty: string;
  emptyNoCategories: string;
  fee: string;
  feeYes: string;
  feeNo: string;
  attribution: string;
  upgradeTitle: string;
  upgradeBody: string;
  upgradeCta: string;
};

const categoriesEn: Record<MotorhomeCategory, string> = { dump_station: "Dump station", fresh_water: "Fresh water", camping: "Camping", parking: "Motorhome / caravan parking", lpg: "LPG / gas", workshop: "Workshop", tyre_service: "Tyre service", washing: "Washing" };
const categoriesDe: Record<MotorhomeCategory, string> = { dump_station: "Entsorgungsstation", fresh_water: "Frischwasser", camping: "Camping", parking: "Wohnmobil-/Caravanstellplatz", lpg: "Flüssiggas (LPG)", workshop: "Werkstatt", tyre_service: "Reifenservice", washing: "Waschanlage" };
const categoriesNl: Record<MotorhomeCategory, string> = { dump_station: "Stortplaats", fresh_water: "Vers water", camping: "Camping", parking: "Camper-/caravanplaats", lpg: "LPG / gas", workshop: "Werkplaats", tyre_service: "Bandenservice", washing: "Wasstraat" };
const categoriesNo: Record<MotorhomeCategory, string> = { dump_station: "Tømmestasjon", fresh_water: "Ferskvann", camping: "Camping", parking: "Bobil-/campingvognplass", lpg: "LPG / gass", workshop: "Verksted", tyre_service: "Dekkservice", washing: "Bilvask" };
const categoriesPl: Record<MotorhomeCategory, string> = { dump_station: "Zrzutnia", fresh_water: "Świeża woda", camping: "Camping", parking: "Miejsce dla kampera / przyczepy", lpg: "LPG / gaz", workshop: "Warsztat", tyre_service: "Serwis opon", washing: "Myjnia" };
const categoriesSv: Record<MotorhomeCategory, string> = { dump_station: "Tömningsstation", fresh_water: "Färskvatten", camping: "Camping", parking: "Husbils-/husvagnsplats", lpg: "LPG / gasol", workshop: "Verkstad", tyre_service: "Däckservice", washing: "Biltvätt" };
const categoriesFr: Record<MotorhomeCategory, string> = { dump_station: "Vidange", fresh_water: "Eau propre", camping: "Camping", parking: "Aire camping-car / caravane", lpg: "GPL / gaz", workshop: "Garage", tyre_service: "Service pneus", washing: "Lavage" };
const categoriesDa: Record<MotorhomeCategory, string> = { dump_station: "Tømningsstation", fresh_water: "Ferskvand", camping: "Camping", parking: "Autocamper-/campingvognplads", lpg: "LPG / gas", workshop: "Værksted", tyre_service: "Dækservice", washing: "Bilvask" };

export const motorhomeCopy: Record<Locale, MotorhomeCopy> = {
  en: {
    title: "Motorhome & Camping",
    subtitle: "Dump stations, water, camping and services along your route.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Max distance from route",
    selectAll: "Select all",
    clearAll: "Clear all",
    categories: categoriesEn,
    addStop: "Add as a stop",
    added: "Added to route",
    empty: "Nothing found within this distance for the selected categories.",
    emptyNoCategories: "Choose at least one category to see results.",
    fee: "Fee",
    feeYes: "Fee applies",
    feeNo: "Free",
    attribution: "Locations from OpenStreetMap contributors, available under the Open Database License.",
    upgradeTitle: "Motorhome & Camping is an AutoVere Pro feature",
    upgradeBody: "Find dump stations, water, camping and motorhome services along your route, with clear detour distances.",
    upgradeCta: "See AutoVere Pro",
  },
  de: {
    title: "Wohnmobil & Camping",
    subtitle: "Entsorgungsstationen, Wasser, Camping und Service entlang deiner Route.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Max. Entfernung von der Route",
    selectAll: "Alle auswählen",
    clearAll: "Alle abwählen",
    categories: categoriesDe,
    addStop: "Als Stopp hinzufügen",
    added: "Zur Route hinzugefügt",
    empty: "Nichts gefunden in dieser Entfernung für die gewählten Kategorien.",
    emptyNoCategories: "Wähle mindestens eine Kategorie, um Ergebnisse zu sehen.",
    fee: "Gebühr",
    feeYes: "Kostenpflichtig",
    feeNo: "Kostenlos",
    attribution: "Standorte von OpenStreetMap-Mitwirkenden, verfügbar unter der Open Database License.",
    upgradeTitle: "Wohnmobil & Camping ist eine AutoVere-Pro-Funktion",
    upgradeBody: "Finde Entsorgungsstationen, Wasser, Camping und Wohnmobil-Service entlang deiner Route mit klaren Umwegdistanzen.",
    upgradeCta: "AutoVere Pro ansehen",
  },
  nl: {
    title: "Camper & Camping",
    subtitle: "Stortplaatsen, water, camping en service langs je route.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Max. afstand tot de route",
    selectAll: "Alles selecteren",
    clearAll: "Alles wissen",
    categories: categoriesNl,
    addStop: "Toevoegen als stop",
    added: "Aan route toegevoegd",
    empty: "Niets gevonden binnen deze afstand voor de gekozen categorieën.",
    emptyNoCategories: "Kies minstens één categorie om resultaten te zien.",
    fee: "Kosten",
    feeYes: "Kosten van toepassing",
    feeNo: "Gratis",
    attribution: "Locaties van OpenStreetMap-bijdragers, beschikbaar onder de Open Database License.",
    upgradeTitle: "Camper & Camping is een AutoVere Pro-functie",
    upgradeBody: "Vind stortplaatsen, water, camping en camperservice langs je route, met duidelijke omrijafstanden.",
    upgradeCta: "Bekijk AutoVere Pro",
  },
  no: {
    title: "Bobil & Camping",
    subtitle: "Tømmestasjoner, vann, camping og service langs ruten din.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Maks avstand fra ruten",
    selectAll: "Velg alle",
    clearAll: "Fjern alle",
    categories: categoriesNo,
    addStop: "Legg til som stopp",
    added: "Lagt til på ruten",
    empty: "Fant ingenting innenfor denne avstanden for de valgte kategoriene.",
    emptyNoCategories: "Velg minst én kategori for å se resultater.",
    fee: "Avgift",
    feeYes: "Avgift påløper",
    feeNo: "Gratis",
    attribution: "Steder fra OpenStreetMap-bidragsytere, tilgjengelig under Open Database License.",
    upgradeTitle: "Bobil & Camping er en AutoVere Pro-funksjon",
    upgradeBody: "Finn tømmestasjoner, vann, camping og bobilservice langs ruten din, med tydelige omveisavstander.",
    upgradeCta: "Se AutoVere Pro",
  },
  pl: {
    title: "Kamper & Camping",
    subtitle: "Zrzutnie, woda, kemping i serwis wzdłuż trasy.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Maks. odległość od trasy",
    selectAll: "Zaznacz wszystko",
    clearAll: "Odznacz wszystko",
    categories: categoriesPl,
    addStop: "Dodaj jako przystanek",
    added: "Dodano do trasy",
    empty: "Nie znaleziono niczego w tej odległości dla wybranych kategorii.",
    emptyNoCategories: "Wybierz co najmniej jedną kategorię, aby zobaczyć wyniki.",
    fee: "Opłata",
    feeYes: "Płatne",
    feeNo: "Bezpłatne",
    attribution: "Lokalizacje od współtwórców OpenStreetMap, dostępne na licencji Open Database License.",
    upgradeTitle: "Kamper & Camping to funkcja AutoVere Pro",
    upgradeBody: "Znajdź zrzutnie, wodę, kemping i serwis dla kamperów wzdłuż trasy, z jasnymi odległościami objazdu.",
    upgradeCta: "Zobacz AutoVere Pro",
  },
  sv: {
    title: "Husbil & Camping",
    subtitle: "Tömningsstationer, vatten, camping och service längs din rutt.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Max avstånd från rutten",
    selectAll: "Välj alla",
    clearAll: "Rensa alla",
    categories: categoriesSv,
    addStop: "Lägg till som stopp",
    added: "Tillagd på rutten",
    empty: "Inget hittades inom detta avstånd för de valda kategorierna.",
    emptyNoCategories: "Välj minst en kategori för att se resultat.",
    fee: "Avgift",
    feeYes: "Avgift tillkommer",
    feeNo: "Gratis",
    attribution: "Platser från OpenStreetMap-bidragsgivare, tillgängliga under Open Database License.",
    upgradeTitle: "Husbil & Camping är en AutoVere Pro-funktion",
    upgradeBody: "Hitta tömningsstationer, vatten, camping och husbilsservice längs din rutt, med tydliga omvägsavstånd.",
    upgradeCta: "Se AutoVere Pro",
  },
  fr: {
    title: "Camping-car & Camping",
    subtitle: "Vidanges, eau, camping et services le long de votre itinéraire.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Distance max. depuis l'itinéraire",
    selectAll: "Tout sélectionner",
    clearAll: "Tout désélectionner",
    categories: categoriesFr,
    addStop: "Ajouter comme arrêt",
    added: "Ajouté à l'itinéraire",
    empty: "Rien trouvé dans cette distance pour les catégories sélectionnées.",
    emptyNoCategories: "Choisissez au moins une catégorie pour voir les résultats.",
    fee: "Frais",
    feeYes: "Payant",
    feeNo: "Gratuit",
    attribution: "Emplacements des contributeurs OpenStreetMap, disponibles sous licence Open Database License.",
    upgradeTitle: "Camping-car & Camping est une fonctionnalité AutoVere Pro",
    upgradeBody: "Trouvez vidanges, eau, camping et services camping-car le long de votre itinéraire, avec des distances de détour claires.",
    upgradeCta: "Découvrir AutoVere Pro",
  },
  da: {
    title: "Autocamper & Camping",
    subtitle: "Tømningsstationer, vand, camping og service langs din rute.",
    proLabel: "AutoVere Pro",
    distanceLabel: "Maks. afstand fra ruten",
    selectAll: "Vælg alle",
    clearAll: "Ryd alle",
    categories: categoriesDa,
    addStop: "Tilføj som stop",
    added: "Tilføjet til ruten",
    empty: "Intet fundet inden for denne afstand for de valgte kategorier.",
    emptyNoCategories: "Vælg mindst én kategori for at se resultater.",
    fee: "Gebyr",
    feeYes: "Gebyr gælder",
    feeNo: "Gratis",
    attribution: "Placeringer fra OpenStreetMap-bidragydere, tilgængelige under Open Database License.",
    upgradeTitle: "Autocamper & Camping er en AutoVere Pro-funktion",
    upgradeBody: "Find tømningsstationer, vand, camping og autocamperservice langs din rute, med tydelige omvejsafstande.",
    upgradeCta: "Se AutoVere Pro",
  },
};
