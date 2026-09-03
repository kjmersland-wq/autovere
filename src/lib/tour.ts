/**
 * Opt-in 5-step product tour (driver.js).
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
  steps: [Step, Step, Step, Step, Step];
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
        title: "1. Language & Currency",
        description:
          "Pick your preferred language and currency here. We automatically convert every toll, fuel price and vignette for you.",
      },
      {
        title: "2. Where to?",
        description:
          "Enter your start and destination — or tap one of the popular routes below for an instant calculation.",
      },
      {
        title: "3. Tailor your trip",
        description:
          "Set it up for a motorhome, EV or petrol car, and choose whether to enjoy mountain passes or steer clear of toll roads.",
      },
      {
        title: "4. Results & My Garage",
        description:
          "Get the full cost overview in one click. Subscribers can save trips to My Garage and repeat the journey any time with fresh prices.",
      },
      {
        title: "5. Send to car & navigation",
        description:
          "Push the route straight to the Tesla app, open it on your car screen via Apple CarPlay / Android Auto, or print the itinerary in your language.",
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
        title: "1. Språk og valuta",
        description:
          "Velg ditt foretrukne språk og valuta her. Vi regner automatisk om alle bompenger, drivstoffpriser og oblater.",
      },
      {
        title: "2. Hvor går turen?",
        description:
          "Skriv inn start og stopp, eller klikk på en av de populære rutene under for umiddelbar beregning.",
      },
      {
        title: "3. Skreddersy reisen",
        description:
          "Tilpass for bobil, elbil eller bensin, og velg om du vil nyte fjelloverganger eller styre unna bomveier.",
      },
      {
        title: "4. Resultat & Min Garasje",
        description:
          "Få full kostnadsoversikt med ett klikk. Abonnenter kan lagre turer i Min Garasje og gjenta reisen når som helst med ferske priser.",
      },
      {
        title: "5. Send til bil & navigasjon",
        description:
          "Send ruten rett til Tesla-appen, åpne den på bilskjermen via Apple CarPlay / Android Auto, eller print ut reiseplanen på ditt språk.",
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
        title: "1. Språk och valuta",
        description:
          "Välj ditt språk och din valuta här. Vi räknar automatiskt om alla vägtullar, bränslepriser och vinjetter.",
      },
      {
        title: "2. Vart går resan?",
        description:
          "Ange start och mål — eller klicka på en av de populära rutterna nedan för en direkt beräkning.",
      },
      {
        title: "3. Skräddarsy resan",
        description:
          "Anpassa för husbil, elbil eller bensin, och välj om du vill njuta av bergspass eller undvika vägtullar.",
      },
      {
        title: "4. Resultat & Mitt Garage",
        description:
          "Få hela kostnadsöversikten med ett klick. Prenumeranter kan spara resor i Mitt Garage och upprepa turen när som helst med färska priser.",
      },
      {
        title: "5. Skicka till bilen & navigation",
        description:
          "Skicka rutten direkt till Tesla-appen, öppna den på bilskärmen via Apple CarPlay / Android Auto, eller skriv ut reseplanen på ditt språk.",
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
        title: "1. Sprog og valuta",
        description:
          "Vælg dit foretrukne sprog og din valuta her. Vi omregner automatisk alle vejafgifter, brændstofpriser og vignetter.",
      },
      {
        title: "2. Hvor går turen hen?",
        description:
          "Indtast start og destination — eller tryk på en af de populære ruter nedenfor for en øjeblikkelig beregning.",
      },
      {
        title: "3. Tilpas turen",
        description:
          "Tilpas til autocamper, elbil eller benzin, og vælg om du vil nyde bjergpas eller undgå betalingsveje.",
      },
      {
        title: "4. Resultat & Min Garage",
        description:
          "Få det fulde omkostningsoverblik med ét klik. Abonnenter kan gemme ture i Min Garage og gentage rejsen når som helst med friske priser.",
      },
      {
        title: "5. Send til bilen & navigation",
        description:
          "Send ruten direkte til Tesla-appen, åbn den på bilskærmen via Apple CarPlay / Android Auto, eller print rejseplanen på dit sprog.",
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
        title: "1. Language & Currency",
        description:
          "Choose your language and currency right here. We automatically convert every toll, gas price and pass for you.",
      },
      {
        title: "2. Where to?",
        description:
          "Enter your start and destination — or tap one of the popular routes below for an instant estimate.",
      },
      {
        title: "3. Tailor your trip",
        description:
          "Set it up for an RV, EV or gas vehicle, and decide whether to enjoy scenic passes or skip toll roads entirely.",
      },
      {
        title: "4. Results & My Garage",
        description:
          "Get your full cost breakdown in one click. Members can save trips to My Garage and rerun them any time with fresh prices.",
      },
      {
        title: "5. Send to car & navigation",
        description:
          "Push the route straight to the Tesla app, open it on your dash via Apple CarPlay / Android Auto, or print the itinerary for the glovebox.",
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
        title: "1. Sprache & Währung",
        description:
          "Wählen Sie hier Sprache und Währung. Wir rechnen alle Mautgebühren, Kraftstoffpreise und Vignetten automatisch um.",
      },
      {
        title: "2. Wohin geht die Reise?",
        description:
          "Geben Sie Start und Ziel ein — oder tippen Sie unten auf eine beliebte Route für eine sofortige Berechnung.",
      },
      {
        title: "3. Reise anpassen",
        description:
          "Stellen Sie auf Wohnmobil, E-Auto oder Benziner um und entscheiden Sie, ob Sie Pässe genießen oder Mautstraßen meiden möchten.",
      },
      {
        title: "4. Ergebnis & Meine Garage",
        description:
          "Volle Kostenübersicht mit einem Klick. Abonnenten speichern Reisen in Meiner Garage und wiederholen sie jederzeit mit aktuellen Preisen.",
      },
      {
        title: "5. Ans Auto senden & Navigation",
        description:
          "Senden Sie die Route direkt an die Tesla-App, öffnen Sie sie über Apple CarPlay / Android Auto im Fahrzeug, oder drucken Sie den Reiseplan in Ihrer Sprache.",
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
        title: "1. Taal & valuta",
        description:
          "Kies hier je taal en valuta. We rekenen alle tol, brandstofprijzen en vignetten automatisch om.",
      },
      {
        title: "2. Waar gaat de reis heen?",
        description:
          "Vul start en bestemming in — of tik op een populaire route hieronder voor een directe berekening.",
      },
      {
        title: "3. Stem de reis af",
        description:
          "Stel in op camper, EV of benzine en kies of je bergpassen wilt meepakken of tolwegen wilt vermijden.",
      },
      {
        title: "4. Resultaat & Mijn Garage",
        description:
          "Volledig kostenoverzicht met één klik. Abonnees bewaren ritten in Mijn Garage en herhalen ze altijd met actuele prijzen.",
      },
      {
        title: "5. Naar de auto sturen & navigatie",
        description:
          "Stuur de route direct naar de Tesla-app, open hem in de auto via Apple CarPlay / Android Auto, of print de reisplanning in jouw taal.",
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
        title: "1. Langue et devise",
        description:
          "Choisissez ici votre langue et votre devise. Nous convertissons automatiquement péages, prix des carburants et vignettes.",
      },
      {
        title: "2. Où allez-vous ?",
        description:
          "Saisissez le départ et la destination — ou touchez un itinéraire populaire ci-dessous pour un calcul immédiat.",
      },
      {
        title: "3. Personnalisez le voyage",
        description:
          "Adaptez pour un camping-car, un véhicule électrique ou essence, et choisissez de savourer les cols ou d'éviter les péages.",
      },
      {
        title: "4. Résultats et Mon Garage",
        description:
          "Obtenez tout le budget en un clic. Les abonnés enregistrent leurs trajets dans Mon Garage et les relancent avec des prix actualisés.",
      },
      {
        title: "5. Envoyer à la voiture et navigation",
        description:
          "Envoyez l'itinéraire directement à l'app Tesla, ouvrez-le sur l'écran du véhicule via Apple CarPlay / Android Auto, ou imprimez le carnet de route dans votre langue.",
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
        title: "1. Język i waluta",
        description:
          "Wybierz tutaj język i walutę. Automatycznie przeliczamy wszystkie opłaty drogowe, ceny paliwa i winiety.",
      },
      {
        title: "2. Dokąd jedziesz?",
        description:
          "Wpisz start i cel — albo kliknij jedną z popularnych tras poniżej, aby od razu policzyć koszty.",
      },
      {
        title: "3. Dopasuj podróż",
        description:
          "Ustaw kampera, auto elektryczne lub benzynowe i zdecyduj, czy chcesz jechać przez przełęcze, czy omijać płatne drogi.",
      },
      {
        title: "4. Wynik i Mój Garaż",
        description:
          "Pełny przegląd kosztów jednym kliknięciem. Subskrybenci zapisują trasy w Moim Garażu i powtarzają je z aktualnymi cenami.",
      },
      {
        title: "5. Wyślij do auta i nawigacja",
        description:
          "Wyślij trasę prosto do aplikacji Tesla, otwórz ją na ekranie auta przez Apple CarPlay / Android Auto lub wydrukuj plan podróży w swoim języku.",
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
        title: "1. Idioma y moneda",
        description:
          "Elige aquí tu idioma y tu moneda. Convertimos automáticamente peajes, precios de combustible y viñetas.",
      },
      {
        title: "2. ¿Adónde vas?",
        description:
          "Introduce origen y destino — o toca una de las rutas populares de abajo para calcular al instante.",
      },
      {
        title: "3. Personaliza el viaje",
        description:
          "Configúralo para autocaravana, eléctrico o gasolina, y decide si disfrutar de los puertos de montaña o evitar peajes.",
      },
      {
        title: "4. Resultados y Mi Garaje",
        description:
          "Todo el presupuesto en un clic. Los suscriptores guardan viajes en Mi Garaje y los repiten cuando quieran con precios actualizados.",
      },
      {
        title: "5. Enviar al coche y navegación",
        description:
          "Envía la ruta directamente a la app de Tesla, ábrela en la pantalla del coche con Apple CarPlay / Android Auto, o imprime el itinerario en tu idioma.",
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
        title: "1. Lingua e valuta",
        description:
          "Scegli qui lingua e valuta. Convertiamo automaticamente pedaggi, prezzi del carburante e vignette.",
      },
      {
        title: "2. Dove vuoi andare?",
        description:
          "Inserisci partenza e destinazione — oppure tocca uno degli itinerari popolari qui sotto per un calcolo immediato.",
      },
      {
        title: "3. Personalizza il viaggio",
        description:
          "Imposta camper, elettrico o benzina e scegli se goderti i valichi alpini o evitare del tutto i pedaggi.",
      },
      {
        title: "4. Risultati e Il Mio Garage",
        description:
          "Il budget completo con un clic. Gli abbonati salvano i viaggi ne Il Mio Garage e li ripetono con prezzi aggiornati.",
      },
      {
        title: "5. Invia all'auto e navigazione",
        description:
          "Invia il percorso direttamente all'app Tesla, aprilo sullo schermo dell'auto con Apple CarPlay / Android Auto, oppure stampa l'itinerario nella tua lingua.",
      },
    ],
  },
  fi: {
    trigger: "💡 Pikaopas",
    next: "Seuraava",
    prev: "Takaisin",
    done: "Valmis",
    close: "Sulje / Ohita",
    steps: [
      {
        title: "1. Kieli ja valuutta",
        description:
          "Valitse haluamasi kieli ja valuutta täältä. Muunnamme automaattisesti kaikki tietullit, polttoainehinnat ja vinjetit.",
      },
      {
        title: "2. Minne matka suuntautuu?",
        description:
          "Kirjoita lähtöpaikka ja määränpää — tai napauta jotakin suosituista reiteistä alla saadaksesi arvion heti.",
      },
      {
        title: "3. Räätälöi matkasi",
        description:
          "Aseta matkailuauto, sähköauto tai bensiiniauto, ja valitse, haluatko nauttia vuoristosolista vai välttää maksullisia teitä.",
      },
      {
        title: "4. Tulokset ja Oma Autotalli",
        description:
          "Saat koko kustannusyhteenvedon yhdellä klikkauksella. Tilaajat voivat tallentaa matkoja Omaan Autotalliin ja toistaa matkan milloin tahansa tuorein hinnoin.",
      },
      {
        title: "5. Lähetä autoon ja navigaattoriin",
        description:
          "Lähetä reitti suoraan Tesla-sovellukseen, avaa se auton näytöllä Apple CarPlayn / Android Auton kautta, tai tulosta matkasuunnitelma omalla kielelläsi.",
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
    showButtons: ["previous", "next", "close"],
    overlayClickBehavior: "close",
    onPopoverRender: (popover) => {
      const btn = popover.closeButton;
      btn.textContent = copy.close;
      btn.setAttribute("aria-label", copy.close);
      btn.style.width = "auto";
      btn.style.fontSize = "0.75rem";
      btn.style.padding = "0 0.35rem";
    },
    onDestroyed: markSeen,
    steps: [
      {
        element: '[data-tour="locale"]',
        popover: {
          title: copy.steps[0].title,
          description: copy.steps[0].description,
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-tour="places"]',
        popover: { title: copy.steps[1].title, description: copy.steps[1].description, side: "bottom" },
      },
      {
        element: '[data-tour="preferences"]',
        popover: { title: copy.steps[2].title, description: copy.steps[2].description, side: "top" },
      },
      {
        element: '[data-tour="calculate"]',
        popover: {
          title: copy.steps[3].title,
          description: copy.steps[3].description,
          side: "top",
          align: "end",
        },
      },
      {
        element: "#send-to-car-hub",
        popover: {
          title: copy.steps[4].title,
          description: copy.steps[4].description,
          side: "top",
        },
      },
    ],
  });

  d.drive();
}
