import type { Locale } from "./i18n";

export type ChargerCopy = {
  all: string;
  tesla: string;
  highPower: string;
  operator: string;
  outlets: string;
  status: string;
  addStop: string;
  added: string;
};

export const chargerCopy: Record<Locale, ChargerCopy> = {
  en: { all: "Show all", tesla: "Tesla only", highPower: ">150 kW", operator: "Operator", outlets: "Outlets", status: "Status", addStop: "Add as charging stop", added: "Added to route" },
  de: { all: "Alle anzeigen", tesla: "Nur Tesla", highPower: ">150 kW", operator: "Betreiber", outlets: "Anschlüsse", status: "Status", addStop: "Als Ladestopp hinzufügen", added: "Zur Route hinzugefügt" },
  nl: { all: "Alles tonen", tesla: "Alleen Tesla", highPower: ">150 kW", operator: "Aanbieder", outlets: "Aansluitingen", status: "Status", addStop: "Als laadstop toevoegen", added: "Aan route toegevoegd" },
  no: { all: "Vis alle", tesla: "Kun Tesla", highPower: ">150 kW", operator: "Operatør", outlets: "Uttak", status: "Status", addStop: "Legg til som ladestopp", added: "Lagt til på ruten" },
  pl: { all: "Pokaż wszystkie", tesla: "Tylko Tesla", highPower: ">150 kW", operator: "Operator", outlets: "Złącza", status: "Status", addStop: "Dodaj jako przystanek", added: "Dodano do trasy" },
  sv: { all: "Visa alla", tesla: "Endast Tesla", highPower: ">150 kW", operator: "Operatör", outlets: "Uttag", status: "Status", addStop: "Lägg till som laddstopp", added: "Tillagd på rutten" },
  fr: { all: "Tout afficher", tesla: "Tesla uniquement", highPower: ">150 kW", operator: "Opérateur", outlets: "Prises", status: "État", addStop: "Ajouter comme arrêt de recharge", added: "Ajouté à l'itinéraire" },
};
