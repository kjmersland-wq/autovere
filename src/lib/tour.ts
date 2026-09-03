/**
 * Opt-in 3-step product tour (driver.js).
 * Never auto-starts: `startTour()` is only called from the "Quick tour" pill.
 */
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const TOUR_SEEN_KEY = "autovere_tour_seen";

type Step = { title: string; description: string };
export type TourCopy = {
  trigger: string;
  next: string;
  prev: string;
  done: string;
  close: string;
  steps: [Step, Step, Step];
};

export const TOUR_COPY: Record<string, TourCopy> = {
  en: {
    trigger: "💡 Quick tour",
    next: "Next",
    prev: "Back",
    done: "Done",
    close: "Close / Skip",
    steps: [
      {
        title: "1. Where are you heading?",
        description:
          "Type a city, address or airport in the start and destination fields — or simply tap one of the popular route badges below to fill them instantly.",
      },
      {
        title: "2. Tailor the route",
        description:
          "Prefer scenic mountain passes and coastal detours, dodge every toll road, or include ferry crossings. Your preferences shape the whole calculation.",
      },
      {
        title: "3. Your full cost overview",
        description:
          "Calculate to get an instant breakdown: tolls and vignettes, city emission badges, fuel or charging, ferries and mountain passes — all in one clear budget.",
      },
    ],
  },
  no: {
    trigger: "💡 Slik virker det",
    next: "Neste",
    prev: "Tilbake",
    done: "Ferdig",
    close: "Lukk / Hopp over",
    steps: [
      {
        title: "1. Hvor går turen?",
        description:
          "Skriv inn by, adresse eller flyplass i start- og målfeltet — eller trykk på en av de populære rutene under for å fylle ut alt med ett klikk.",
      },
      {
        title: "2. Skreddersy ruten",
        description:
          "Prioriter naturskjønne fjelloverganger og kystveier, unngå bomveier helt, eller ta med ferjestrekninger. Valgene dine styrer hele beregningen.",
      },
      {
        title: "3. Full kostnadsoversikt",
        description:
          "Beregn og få umiddelbar oversikt: bompenger og vignetter, miljømerker, drivstoff eller lading, ferjer og fjelloverganger — i ett tydelig budsjett.",
      },
    ],
  },
  sv: {
    trigger: "💡 Snabbguide",
    next: "Nästa",
    prev: "Tillbaka",
    done: "Klar",
    close: "Stäng / Hoppa över",
    steps: [
      {
        title: "1. Vart går resan?",
        description:
          "Skriv stad, adress eller flygplats i start- och målfältet — eller tryck på en av de populära rutterna nedan för att fylla i direkt.",
      },
      {
        title: "2. Skräddarsy rutten",
        description:
          "Prioritera natursköna bergspass och kustvägar, undvik alla vägtullar eller ta med färjor. Dina val styr hela beräkningen.",
      },
      {
        title: "3. Full kostnadsöversikt",
        description:
          "Beräkna och få direkt en uppdelning: vägtullar och vinjetter, miljömärken, bränsle eller laddning, färjor och bergspass i en tydlig budget.",
      },
    ],
  },
  da: {
    trigger: "💡 Hurtig rundvisning",
    next: "Næste",
    prev: "Tilbage",
    done: "Færdig",
    close: "Luk / Spring over",
    steps: [
      {
        title: "1. Hvor går turen hen?",
        description:
          "Skriv by, adresse eller lufthavn i start- og målfeltet — eller tryk på en af de populære ruter nedenfor for at udfylde med ét klik.",
      },
      {
        title: "2. Tilpas ruten",
        description:
          "Prioritér naturskønne bjergpas og kystveje, undgå alle betalingsveje, eller tag færger med. Dine valg former hele beregningen.",
      },
      {
        title: "3. Fuldt omkostningsoverblik",
        description:
          "Beregn og få straks et overblik: vejafgifter og vignetter, miljømærker, brændstof eller opladning, færger og bjergpas i ét klart budget.",
      },
    ],
  },
  us: {
    trigger: "💡 Quick tour",
    next: "Next",
    prev: "Back",
    done: "Done",
    close: "Close / Skip",
    steps: [
      {
        title: "1. Where are you headed?",
        description:
          "Type a city, address or airport into the start and destination fields — or just tap one of the popular route badges below to fill them instantly.",
      },
      {
        title: "2. Tailor the route",
        description:
          "Favor scenic mountain and coastal detours, skip every toll road and express lane, or include ferry crossings. Your picks shape the whole estimate.",
      },
      {
        title: "3. Your full cost overview",
        description:
          "Calculate for an instant breakdown: tolls and toll passes, restricted city zones, gas or charging, ferries and passes — all in one honest budget.",
      },
    ],
  },
  de: {
    trigger: "💡 Kurze Tour",
    next: "Weiter",
    prev: "Zurück",
    done: "Fertig",
    close: "Schließen / Überspringen",
    steps: [
      {
        title: "1. Wohin geht die Reise?",
        description:
          "Geben Sie Stadt, Adresse oder Flughafen in Start- und Zielfeld ein — oder tippen Sie unten auf eine beliebte Route, um beides sofort zu füllen.",
      },
      {
        title: "2. Route anpassen",
        description:
          "Bevorzugen Sie landschaftlich schöne Pässe und Küstenstraßen, meiden Sie jede Mautstraße oder nehmen Sie Fähren mit. Ihre Wahl prägt die Berechnung.",
      },
      {
        title: "3. Vollständige Kostenübersicht",
        description:
          "Berechnen Sie und erhalten Sie sofort die Aufschlüsselung: Maut und Vignetten, Umweltplaketten, Kraftstoff oder Laden, Fähren und Pässe.",
      },
    ],
  },
  nl: {
    trigger: "💡 Korte rondleiding",
    next: "Volgende",
    prev: "Terug",
    done: "Klaar",
    close: "Sluiten / Overslaan",
    steps: [
      {
        title: "1. Waar gaat de reis heen?",
        description:
          "Typ een stad, adres of luchthaven in het start- en bestemmingsveld — of tik op een populaire route hieronder om alles in één klik in te vullen.",
      },
      {
        title: "2. Stem de route af",
        description:
          "Kies voor schilderachtige bergpassen en kustwegen, vermijd elke tolweg of neem veerboten mee. Jouw voorkeuren bepalen de hele berekening.",
      },
      {
        title: "3. Volledig kostenoverzicht",
        description:
          "Bereken en zie direct de uitsplitsing: tol en vignetten, milieuzones, brandstof of laden, veerboten en bergpassen in één helder budget.",
      },
    ],
  },
  fr: {
    trigger: "💡 Visite rapide",
    next: "Suivant",
    prev: "Retour",
    done: "Terminé",
    close: "Fermer / Passer",
    steps: [
      {
        title: "1. Où allez-vous ?",
        description:
          "Saisissez une ville, une adresse ou un aéroport dans les champs départ et destination — ou touchez un itinéraire populaire ci-dessous pour tout remplir.",
      },
      {
        title: "2. Personnalisez l'itinéraire",
        description:
          "Privilégiez les cols de montagne et les routes côtières, évitez tous les péages ou incluez les traversées en ferry. Vos choix guident le calcul.",
      },
      {
        title: "3. Aperçu complet des coûts",
        description:
          "Calculez et obtenez le détail immédiat : péages et vignettes, vignettes environnementales, carburant ou recharge, ferries et cols.",
      },
    ],
  },
  pl: {
    trigger: "💡 Szybki przewodnik",
    next: "Dalej",
    prev: "Wstecz",
    done: "Gotowe",
    close: "Zamknij / Pomiń",
    steps: [
      {
        title: "1. Dokąd jedziesz?",
        description:
          "Wpisz miasto, adres lub lotnisko w polach startu i celu — albo kliknij jedną z popularnych tras poniżej, aby wypełnić oba pola od razu.",
      },
      {
        title: "2. Dopasuj trasę",
        description:
          "Wybierz widokowe przełęcze i drogi nadmorskie, omijaj płatne autostrady lub uwzględnij promy. Twoje ustawienia kształtują całe wyliczenie.",
      },
      {
        title: "3. Pełny przegląd kosztów",
        description:
          "Policz i zobacz natychmiastowy podział: opłaty i winiety, naklejki ekologiczne, paliwo lub ładowanie, promy i przełęcze w jednym budżecie.",
      },
    ],
  },
  es: {
    trigger: "💡 Tour rápido",
    next: "Siguiente",
    prev: "Atrás",
    done: "Listo",
    close: "Cerrar / Omitir",
    steps: [
      {
        title: "1. ¿Adónde vas?",
        description:
          "Escribe una ciudad, dirección o aeropuerto en los campos de origen y destino — o toca una de las rutas populares de abajo para rellenarlos al instante.",
      },
      {
        title: "2. Personaliza la ruta",
        description:
          "Prioriza puertos de montaña y carreteras costeras, evita todos los peajes o incluye travesías en ferry. Tus preferencias guían el cálculo.",
      },
      {
        title: "3. Resumen completo de costes",
        description:
          "Calcula y obtén el desglose al instante: peajes y viñetas, distintivos ambientales, combustible o recarga, ferris y puertos de montaña.",
      },
    ],
  },
  it: {
    trigger: "💡 Tour rapido",
    next: "Avanti",
    prev: "Indietro",
    done: "Fatto",
    close: "Chiudi / Salta",
    steps: [
      {
        title: "1. Dove vuoi andare?",
        description:
          "Digita città, indirizzo o aeroporto nei campi di partenza e destinazione — oppure tocca uno degli itinerari popolari qui sotto per compilarli subito.",
      },
      {
        title: "2. Personalizza il percorso",
        description:
          "Preferisci passi alpini e strade costiere, evita ogni pedaggio o includi i traghetti. Le tue scelte guidano l'intero calcolo.",
      },
      {
        title: "3. Panoramica completa dei costi",
        description:
          "Calcola e ottieni subito il dettaglio: pedaggi e vignette, bollini ambientali, carburante o ricarica, traghetti e valichi in un unico budget.",
      },
    ],
  },
};

export function tourCopy(locale: string): TourCopy {
  return TOUR_COPY[locale] ?? TOUR_COPY["en"]!;
}

/** Launches the tour. Strictly opt-in — call only from an explicit user action. */
export function startTour(locale: string) {
  const copy = tourCopy(locale);
  const markSeen = () => {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "true");
    } catch {
      /* storage unavailable — tour still works */
    }
  };

  const resultsTarget = document.querySelector('[data-tour="results"]')
    ? '[data-tour="results"]'
    : '[data-tour="calculate"]';

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayOpacity: 0.72,
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: "autovere-tour",
    nextBtnText: copy.next,
    prevBtnText: copy.prev,
    doneBtnText: copy.done,
    progressText: "{{current}} / {{total}}",
    onDestroyed: markSeen,
    steps: [
      {
        element: '[data-tour="places"]',
        popover: { title: copy.steps[0].title, description: copy.steps[0].description },
      },
      {
        element: '[data-tour="preferences"]',
        popover: { title: copy.steps[1].title, description: copy.steps[1].description },
      },
      {
        element: resultsTarget,
        popover: { title: copy.steps[2].title, description: copy.steps[2].description },
      },
    ],
  });

  d.drive();
}
