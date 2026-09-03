import type { InfoSection } from "@/components/InfoPage";
import { LOCALE_PAGES, LOCALE_ROUTES, type LocalePage, type LocalePrefix } from "@/lib/locales";

export const BASE_URL = "https://www.autovere.com";

export function absUrl(path: string) {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Country/market word used to keep regional metadata unique. */
export const LOCALE_MARKET: Record<LocalePrefix, string> = {
  no: "Norge",
  se: "Sverige",
  dk: "Danmark",
  de: "Deutschland",
  nl: "Nederland",
  fr: "France",
  pl: "Polska",
  es: "España",
  it: "Italia",
  usa: "United States",
  fi: "Suomi",
};

type PageMeta = { title: string; description: string };

/** Localized 1200x630 social share images, one per language tree. */
const OG_IMAGE_BY_PREFIX: Record<LocalePrefix, string> = {
  no: "/og/og-no.jpg",
  se: "/og/og-sv.jpg",
  dk: "/og/og-da.jpg",
  usa: "/og/og-us.jpg",
  de: "/og/og-de.jpg",
  nl: "/og/og-nl.jpg",
  fr: "/og/og-fr.jpg",
  pl: "/og/og-pl.jpg",
  es: "/og/og-es.jpg",
  it: "/og/og-it.jpg",
  fi: "/og/og-fi.png",
};

/** Absolute URL of the share image for a language prefix (null = English root). */
export function ogImageUrl(prefix: LocalePrefix | null | undefined): string {
  return absUrl(prefix ? (OG_IMAGE_BY_PREFIX[prefix] ?? "/og-image.jpg") : "/og-image.jpg");
}

/** The og:image / secure_url / twitter:image trio for a fully qualified image URL. */
export function ogImageMeta(image: string) {
  return [
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: image.endsWith(".png") ? "image/png" : "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:image", content: image },
  ];
}

/** Titles for the app pages that have no per-language info content. */
const APP_PAGE_META_BASE = {
  no: {
    planner: {
      title: "Ruteplanlegger — bompenger, drivstoff og ferjer | AutoVere Norge",
      description:
        "Planlegg ruten og se bompenger, vignetter, drivstoff, lading og ferjer i ett tydelig budsjett.",
    },
    tolls: {
      title: "Bompenger og vignetter — komplett guide | AutoVere Norge",
      description:
        "Bompenger, vignetter og bombrikker i Europa, USA og Canada, forklart for bil, bobil og motorsykkel.",
    },
    scenic: {
      title: "Fjelloverganger og ferjer | AutoVere Norge",
      description: "Alpepass, kystveier og bilferjer med sesong, høydebegrensninger og bookingtips.",
    },
    garage: {
      title: "Min Garasje — kjøretøy, bombrikker og turer | AutoVere Norge",
      description: "Lagre kjøretøy, tankvolum og bombrikker, og hent fram alle lagrede reiseruter.",
    },
  },
  se: {
    planner: {
      title: "Ruttplanerare — vägtullar, bränsle och färjor | AutoVere Sverige",
      description: "Planera resan och se vägtullar, vinjetter, bränsle, laddning och färjor i en budget.",
    },
    tolls: {
      title: "Vägtullar och vinjetter — guide | AutoVere Sverige",
      description: "Vägtullar, vinjetter och transpondrar i Europa, USA och Kanada för bil, husbil och MC.",
    },
    scenic: {
      title: "Fjällpass och färjor | AutoVere Sverige",
      description: "Alppass, kustvägar och bilfärjor med säsong, höjdgränser och bokningstips.",
    },
    garage: {
      title: "Mitt Garage — fordon, transpondrar och resor | AutoVere Sverige",
      description: "Spara fordon, tankvolym och transpondrar samt alla dina sparade reserutter.",
    },
  },
  dk: {
    planner: {
      title: "Ruteplanlægger — vejafgifter, brændstof og færger | AutoVere Danmark",
      description: "Planlæg ruten og se vejafgifter, vignetter, brændstof, opladning og færger i ét samlet budget.",
    },
    tolls: {
      title: "Vejafgifter og vignetter — guide | AutoVere Danmark",
      description: "Vejafgifter, vignetter og vejafgiftsbrikker i Europa, USA og Canada for bil, autocamper og MC.",
    },
    scenic: {
      title: "Bjergpas og færger | AutoVere Danmark",
      description: "Alpepas, kystveje og bilfærger med sæson, højdegrænser og bookingtips.",
    },
    garage: {
      title: "Min Garage — køretøjer, vejafgiftsbrikker og ture | AutoVere Danmark",
      description: "Gem køretøjer, tankstørrelse og vejafgiftsbrikker samt alle dine gemte ruter.",
    },
  },
  de: {
    planner: {
      title: "Routenplaner — Maut, Kraftstoff und Fähren | AutoVere Deutschland",
      description: "Planen Sie die Route und sehen Sie Maut, Vignetten, Kraftstoff, Laden und Fähren.",
    },
    tolls: {
      title: "Maut und Vignetten — Ratgeber | AutoVere Deutschland",
      description: "Maut, Vignetten und Transponder in Europa, den USA und Kanada für Auto, Wohnmobil und Motorrad.",
    },
    scenic: {
      title: "Bergpässe und Fähren | AutoVere Deutschland",
      description: "Passstraßen, Küstenrouten und Autofähren mit Saison, Höhenlimits und Buchungstipps.",
    },
    garage: {
      title: "Meine Garage — Fahrzeuge, Transponder und Touren | AutoVere Deutschland",
      description: "Fahrzeuge, Tankgrößen und Transponder speichern und alle gespeicherten Touren abrufen.",
    },
  },
  nl: {
    planner: {
      title: "Routeplanner — tol, brandstof en veerboten | AutoVere Nederland",
      description: "Plan je route en zie tol, vignetten, brandstof, laden en veerboten in één budget.",
    },
    tolls: {
      title: "Tol en vignetten — gids | AutoVere Nederland",
      description: "Tol, vignetten en tolkastjes in Europa, de VS en Canada voor auto, camper en motor.",
    },
    scenic: {
      title: "Bergpassen en veerboten | AutoVere Nederland",
      description: "Alpenpassen, kustroutes en autoveerboten met seizoen, hoogtelimieten en boekingstips.",
    },
    garage: {
      title: "Mijn Garage — voertuigen, tolkastjes en ritten | AutoVere Nederland",
      description: "Bewaar voertuigen, tankinhoud en tolkastjes plus al je opgeslagen routes.",
    },
  },
  fr: {
    planner: {
      title: "Planificateur d'itinéraire — péages, carburant et ferries | AutoVere France",
      description: "Planifiez la route et visualisez péages, vignettes, carburant, recharge et ferries dans un budget clair.",
    },
    tolls: {
      title: "Péages et vignettes — le guide | AutoVere France",
      description: "Péages, vignettes et badges de télépéage en Europe, aux États-Unis et au Canada pour voiture, camping-car et moto.",
    },
    scenic: {
      title: "Cols de montagne et ferries | AutoVere France",
      description: "Cols alpins, routes côtières et ferries automobiles avec saison, gabarits et conseils de réservation.",
    },
    garage: {
      title: "Mon Garage — véhicules, badges de télépéage et voyages | AutoVere France",
      description: "Enregistrez véhicules, capacités de réservoir et badges de télépéage, avec tous vos itinéraires sauvegardés.",
    },
  },
  pl: {
    planner: {
      title: "Planer trasy — opłaty drogowe, paliwo i promy | AutoVere Polska",
      description:
        "Zaplanuj trasę i zobacz opłaty drogowe, winiety, paliwo, ładowanie i promy w jednym przejrzystym budżecie.",
    },
    tolls: {
      title: "Opłaty drogowe i winiety — przewodnik | AutoVere Polska",
      description: "Opłaty drogowe, winiety i transpondery w Europie, USA i Kanadzie dla auta, kampera i motocykla.",
    },
    scenic: {
      title: "Przełęcze górskie i promy | AutoVere Polska",
      description: "Alpejskie przełęcze, trasy nadmorskie i promy samochodowe: sezon, limity wysokości i rezerwacje.",
    },
    garage: {
      title: "Mój Garaż — pojazdy, transpondery i trasy | AutoVere Polska",
      description: "Zapisz pojazdy, pojemność baku i transpondery oraz wszystkie zapisane trasy.",
    },
  },
};

const APP_PAGE_META: Record<LocalePrefix, Partial<Record<LocalePage, PageMeta>>> = {
  ...APP_PAGE_META_BASE,
  usa: {},
  fi: {},
  es: {
    planner: {
      title: "Planificador de viajes por carretera — peajes, combustible y ferris | AutoVere España",
      description:
        "Planifica tu ruta y consulta peajes, viñetas, combustible, recarga eléctrica y ferris en un presupuesto claro para coches, autocaravanas y motos.",
    },
    tolls: {
      title: "Peajes y viñetas explicados — Europa, EE. UU. y Canadá | AutoVere España",
      description:
        "Guía clara y actualizada sobre peajes, viñetas y dispositivos de telepeaje en Europa, Estados Unidos y Canadá para coches, autocaravanas y motos.",
    },
    scenic: {
      title: "Puertos de montaña y ferris — las rutas que merecen el desvío | AutoVere España",
      description:
        "Puertos alpinos, carreteras costeras y ferris para vehículos en Europa, Estados Unidos y Canadá, con temporadas, limitaciones de altura y consejos de reserva.",
    },
    garage: {
      title: "Mi Garaje y viajes — vehículos, dispositivos de peaje y rutas guardadas | AutoVere España",
      description:
        "Guarda tus coches, autocaravanas y motos, sus capacidades de depósito y dispositivos de telepeaje, además de cada itinerario listo para descargar en GPX.",
    },
  },
  it: {
    planner: {
      title: "Pianifica il viaggio — pedaggi, carburante e traghetti | AutoVere Italia",
      description:
        "Pianifica il percorso e scopri pedaggi, vignette, carburante, ricarica elettrica e traghetti in un budget chiaro per auto, camper e moto.",
    },
    tolls: {
      title: "Pedaggi e vignette spiegati — Europa, USA e Canada | AutoVere Italia",
      description:
        "Guida chiara e aggiornata su pedaggi, vignette e Telepass in Europa, Stati Uniti e Canada, per auto, camper e moto.",
    },
    scenic: {
      title: "Passi di montagna e traghetti — le strade che meritano la deviazione | AutoVere Italia",
      description:
        "Passi alpini, strade costiere e traghetti per auto in Europa, Stati Uniti e Canada, con stagionalità, limiti di altezza e consigli di prenotazione.",
    },
    garage: {
      title: "Il mio Garage e i viaggi — veicoli, Telepass e percorsi salvati | AutoVere Italia",
      description:
        "Salva le tue auto, i camper e le moto, la capacità del serbatoio e i dispositivi di telepedaggio, oltre a ogni itinerario pronto per il download in GPX.",
    },
  },
};

export function appPageMeta(prefix: LocalePrefix, page: LocalePage): PageMeta | null {
  return APP_PAGE_META[prefix]?.[page] ?? null;
}

/** Make shared English info content unique per language tree. */
export function regionalize(prefix: LocalePrefix, meta: PageMeta): PageMeta {
  const market = LOCALE_MARKET[prefix];
  const title = meta.title.includes("| AutoVere")
    ? meta.title.replace("| AutoVere", `| AutoVere ${market}`)
    : `${meta.title} | AutoVere ${market}`;
  return { title, description: `AutoVere ${market}: ${meta.description}` };
}

/** FAQPage JSON-LD built from InfoPage sections (heading = question, body = answer). */
export function faqJsonLd(sections: InfoSection[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections
      .filter((s) => s.heading && s.body)
      .map((s) => ({
        "@type": "Question",
        name: s.heading,
        acceptedAnswer: { "@type": "Answer", text: s.body },
      })),
  };
}

export function faqScript(sections: InfoSection[]) {
  return [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(sections)) }];
}

export const ALL_LOCALE_PATHS = LOCALE_ROUTES.flatMap((l) => [
  `/${l.prefix}`,
  ...LOCALE_PAGES.map((p) => `/${l.prefix}/${p}`),
]);
