import type { Locale } from "./i18n";
import type { ScenicCategory } from "./geo";

export type ScenicCategoryCopy = Record<ScenicCategory, string> & { hiddenGem: string; easyAccess: string };

export const scenicCategoryCopy: Record<Locale, ScenicCategoryCopy> = {
  en: { camping: "Camping & RV", lodging: "Hotels & Lodging", food: "Food & Cafes", sights: "Rest Stops", viewpoint: "Viewpoints & Nature", historic: "History & Culture", museum: "Museums", family: "Family", hiddenGem: "Hidden gem", easyAccess: "Easy access" },
  de: { camping: "Camping & Wohnmobil", lodging: "Hotels & Unterkünfte", food: "Essen & Cafés", sights: "Rastplätze", viewpoint: "Aussicht & Natur", historic: "Geschichte & Kultur", museum: "Museen", family: "Familie", hiddenGem: "Geheimtipp", easyAccess: "Leicht zugänglich" },
  nl: { camping: "Camping & Camper", lodging: "Hotels & Overnachten", food: "Eten & Cafés", sights: "Rustplaatsen", viewpoint: "Uitzicht & Natuur", historic: "Geschiedenis & Cultuur", museum: "Musea", family: "Familie", hiddenGem: "Verborgen parel", easyAccess: "Makkelijk toegankelijk" },
  no: { camping: "Camping & Bobil", lodging: "Hoteller & Overnatting", food: "Mat & Kafeer", sights: "Rasteplasser", viewpoint: "Utsikt & Natur", historic: "Historie & Kultur", museum: "Museer", family: "Familie", hiddenGem: "Skjult perle", easyAccess: "Lett tilgjengelig" },
  pl: { camping: "Kemping i kamper", lodging: "Hotele i noclegi", food: "Jedzenie i kawiarnie", sights: "Miejsca odpoczynku", viewpoint: "Widoki i przyroda", historic: "Historia i kultura", museum: "Muzea", family: "Rodzina", hiddenGem: "Ukryta perełka", easyAccess: "Łatwy dostęp" },
  sv: { camping: "Camping & husbil", lodging: "Hotell & boende", food: "Mat & caféer", sights: "Rastplatser", viewpoint: "Utsikt & natur", historic: "Historia & kultur", museum: "Museer", family: "Familj", hiddenGem: "Dold pärla", easyAccess: "Lätt tillgänglig" },
  fr: { camping: "Camping & Camping-car", lodging: "Hôtels & Hébergement", food: "Restauration & Cafés", sights: "Aires de repos", viewpoint: "Points de vue & Nature", historic: "Histoire & Culture", museum: "Musées", family: "Famille", hiddenGem: "Pépite cachée", easyAccess: "Accès facile" },
  da: { camping: "Camping & Autocamper", lodging: "Hoteller & Overnatning", food: "Mad & Caféer", sights: "Rastepladser", viewpoint: "Udsigt & Natur", historic: "Historie & Kultur", museum: "Museer", family: "Familie", hiddenGem: "Skjult perle", easyAccess: "Nem adgang" },
};
