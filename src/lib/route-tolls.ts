/**
 * Real-corridor toll & vignette engine.
 *
 * Everything here is derived from the countries / states that the routed OSRM
 * polyline actually passes through — no static "European grand tour" fallback.
 */

import type { RouteBorder, RouteCountry, RouteGeo } from "@/lib/route-geo.functions";
import type { TollLine } from "@/lib/trip-data";

type Portal = { label: string; url: string };

type CountryRule = {
  name?: string;
  /** Nationwide vignette / motorway sticker. */
  vignette?: {
    place: string;
    detail: string;
    /** Price of the shortest tourist tier (car). */
    amount: number;
    badge?: string;
    portal: Portal;
    /** Motorcycles usually pay less — 0 means exempt. */
    motoFactor?: number;
  };
  /** Distance-based motorway tolls. */
  distance?: {
    label: string;
    detail: string;
    /** € (or local unit) per km on tolled sections. */
    perKm: number;
    /** Share of the in-country distance that actually runs on toll road. */
    share: number;
    badge?: string;
    portal?: Portal;
  };
  /** Shown when the country is genuinely toll-free for the vehicle. */
  freeNote?: string;
};

export const EU_RULES: Record<string, CountryRule> = {
  DK: {
    freeNote:
      "No motorway toll in Denmark — only the Storebælt and Øresund bridges are charged, and only if you cross them.",
  },
  DE: { freeNote: "German autobahns are toll-free for cars and motorhomes up to 7.5 t." },
  NL: { freeNote: "Dutch motorways are free — only the Westerschelde and Kil tunnels charge." },
  BE: { freeNote: "Belgian motorways are free for cars; the Liefkenshoek tunnel is the exception." },
  LU: { freeNote: "Luxembourg motorways are toll-free (and the cheapest fuel on the corridor)." },
  SE: { freeNote: "Swedish motorways are free; only Stockholm/Göteborg congestion charges apply." },
  FI: { freeNote: "Finnish roads are toll-free." },
  EE: { freeNote: "Estonian roads are toll-free for passenger vehicles." },
  LV: { freeNote: "Latvian roads are toll-free for passenger vehicles." },
  LT: { freeNote: "Lithuanian roads are toll-free for passenger vehicles." },
  IE: { freeNote: "Only individual toll plazas (M50 eFlow) charge — none on this corridor." },
  GB: { freeNote: "UK motorways are free apart from the M6 Toll and Dartford Crossing." },

  PL: {
    distance: {
      label: "A1 / A2 / A4 concession sections",
      detail: "Private concession segments only — state-run e-TOLL motorways are free for cars",
      perKm: 0.045,
      share: 0.35,
      badge: "e-TOLL / A2 gate",
      portal: { label: "e-TOLL", url: "https://etoll.gov.pl/en/" },
    },
  },
  FR: {
    distance: {
      label: "Autoroute péage network",
      detail: "Ticket system, charged per kilometre",
      perKm: 0.09,
      share: 0.8,
      badge: "Télépéage",
      portal: { label: "Ulys", url: "https://ulys.vinci-autoroutes.com/en" },
    },
  },
  IT: {
    distance: {
      label: "Autostrada network",
      detail: "Ticket system, charged per kilometre",
      perKm: 0.075,
      share: 0.8,
      badge: "Telepass",
      portal: { label: "Telepass", url: "https://www.telepass.com/en/" },
    },
  },
  ES: {
    distance: {
      label: "AP toll motorways",
      detail: "Remaining concession sections",
      perKm: 0.055,
      share: 0.3,
      portal: { label: "Via-T", url: "https://www.bipdrive.com/" },
    },
  },
  PT: {
    distance: {
      label: "Portugal tolls & electronic gantries",
      detail: "Includes electronic-only motorways",
      perKm: 0.06,
      share: 0.55,
      badge: "Via Verde",
      portal: { label: "Via Verde", url: "https://www.viaverde.pt/" },
    },
  },
  HR: {
    distance: {
      label: "A1 / A3 motorway toll",
      detail: "Ticket system, charged per kilometre",
      perKm: 0.06,
      share: 0.8,
      badge: "ENC",
      portal: { label: "HAC", url: "https://hac.hr/en" },
    },
  },
  GR: {
    distance: {
      label: "Motorway toll plazas",
      detail: "Fixed plaza charges along the corridor",
      perKm: 0.05,
      share: 0.6,
      portal: { label: "Aegean Motorway", url: "https://www.aegeanmotorway.gr/en" },
    },
  },
  NO: {
    distance: {
      label: "AutoPASS gantries",
      detail: "Automatic tolling — motorcycles pass free",
      perKm: 0.022,
      share: 1,
      badge: "AutoPASS",
      portal: { label: "AutoPASS", url: "https://www.autopass.no/en/" },
    },
  },
  AT: {
    vignette: {
      place: "ASFINAG digital vignette",
      detail: "10-day pass, valid nationwide",
      amount: 12.4,
      badge: "Buy online",
      portal: { label: "ASFINAG", url: "https://shop.asfinag.at/" },
      motoFactor: 0.4,
    },
  },
  CH: {
    vignette: {
      place: "Swiss e-vignette",
      detail: "Annual e-vignette, plate-linked (no short tier exists)",
      amount: 42.5,
      badge: "Buy online",
      portal: { label: "via.admin.ch", url: "https://via.admin.ch/shop/dashboard" },
    },
  },
  SI: {
    vignette: {
      place: "DARS e-vinjeta",
      detail: "7-day e-vignette",
      amount: 16,
      badge: "Buy online",
      portal: { label: "DARS", url: "https://evinjeta.dars.si/" },
      motoFactor: 0.5,
    },
  },
  CZ: {
    vignette: {
      place: "Czech e-známka",
      detail: "10-day electronic vignette",
      amount: 14.5,
      badge: "Buy online",
      portal: { label: "edalnice.cz", url: "https://edalnice.cz/en/" },
      motoFactor: 0,
    },
  },
  SK: {
    vignette: {
      place: "Slovak e-známka",
      detail: "10-day electronic vignette",
      amount: 12,
      badge: "Buy online",
      portal: { label: "eznamka.sk", url: "https://eznamka.sk/en/" },
      motoFactor: 0,
    },
  },
  HU: {
    vignette: {
      place: "Hungarian e-matrica",
      detail: "10-day national e-vignette",
      amount: 13.2,
      badge: "Buy online",
      portal: { label: "nemzetiutdij.hu", url: "https://nemzetiutdij.hu/en" },
      motoFactor: 0.6,
    },
  },
  BG: {
    vignette: {
      place: "Bulgarian e-vignette",
      detail: "Weekend/weekly e-vignette",
      amount: 15,
      badge: "Buy online",
      portal: { label: "bgtoll.bg", url: "https://check.bgtoll.bg/" },
    },
  },
  RO: {
    vignette: {
      place: "Romanian rovinieta",
      detail: "7-day road vignette",
      amount: 6,
      badge: "Buy online",
      portal: { label: "erovinieta.ro", url: "https://www.erovinieta.ro/" },
    },
  },
};

/** US states with real toll exposure — everything else is free. */
const US_STATE_RULES: Record<string, CountryRule> = {
  Illinois: { distance: { label: "Illinois Tollway", detail: "I-PASS rate", perKm: 0.035, share: 0.7, badge: "I-PASS", portal: { label: "Illinois Tollway", url: "https://www.illinoistollway.com/" } } },
  Indiana: { distance: { label: "Indiana Toll Road", detail: "E-ZPass rate", perKm: 0.035, share: 0.8, badge: "E-ZPass", portal: { label: "E-ZPass", url: "https://www.e-zpassiag.com/" } } },
  Ohio: { distance: { label: "Ohio Turnpike", detail: "E-ZPass rate", perKm: 0.03, share: 0.7, badge: "E-ZPass", portal: { label: "Ohio Turnpike", url: "https://www.ohioturnpike.org/" } } },
  Pennsylvania: { distance: { label: "PA Turnpike", detail: "Toll-by-plate discounted with E-ZPass", perKm: 0.05, share: 0.7, badge: "E-ZPass", portal: { label: "PA Turnpike", url: "https://www.paturnpike.com/" } } },
  "New Jersey": { distance: { label: "NJ Turnpike / GSP", detail: "E-ZPass rate", perKm: 0.045, share: 0.8, badge: "E-ZPass", portal: { label: "NJ Turnpike", url: "https://www.njta.com/" } } },
  "New York": { distance: { label: "NY Thruway & crossings", detail: "E-ZPass rate", perKm: 0.035, share: 0.7, badge: "E-ZPass", portal: { label: "Thruway", url: "https://www.thruway.ny.gov/" } } },
  Massachusetts: { distance: { label: "Mass Pike (I-90)", detail: "All-electronic tolling", perKm: 0.03, share: 0.8, badge: "E-ZPass", portal: { label: "MassDOT", url: "https://www.mass.gov/ezdrivema" } } },
  Maine: { distance: { label: "Maine Turnpike", detail: "E-ZPass rate", perKm: 0.03, share: 0.7, badge: "E-ZPass", portal: { label: "Maine Turnpike", url: "https://www.maineturnpike.com/" } } },
  Maryland: { distance: { label: "Maryland tolls", detail: "Bridges, tunnels and I-95 express", perKm: 0.03, share: 0.5, badge: "E-ZPass", portal: { label: "E-ZPass MD", url: "https://www.ezpassmd.com/" } } },
  Delaware: { distance: { label: "Delaware Turnpike", detail: "I-95 mainline plaza", perKm: 0.05, share: 0.6, badge: "E-ZPass", portal: { label: "E-ZPass DE", url: "https://www.ezpassde.com/" } } },
  Virginia: { distance: { label: "Virginia express lanes", detail: "Dynamic pricing on I-95/I-495", perKm: 0.03, share: 0.4, badge: "E-ZPass Flex", portal: { label: "E-ZPass VA", url: "https://www.ezpassva.com/" } } },
  Florida: { distance: { label: "Florida Turnpike system", detail: "SunPass rate", perKm: 0.045, share: 0.7, badge: "SunPass", portal: { label: "SunPass", url: "https://www.sunpass.com/" } } },
  Texas: { distance: { label: "Texas toll roads", detail: "TxTag rate", perKm: 0.04, share: 0.4, badge: "TxTag", portal: { label: "TxTag", url: "https://www.txtag.org/" } } },
  Oklahoma: { distance: { label: "Oklahoma turnpikes", detail: "PIKEPASS rate", perKm: 0.03, share: 0.8, badge: "PIKEPASS", portal: { label: "PIKEPASS", url: "https://pikepass.com/" } } },
  Kansas: { distance: { label: "Kansas Turnpike", detail: "K-TAG rate", perKm: 0.025, share: 0.8, badge: "K-TAG", portal: { label: "K-TAG", url: "https://www.ksturnpike.com/" } } },
  "West Virginia": { distance: { label: "WV Turnpike", detail: "E-ZPass rate", perKm: 0.03, share: 0.7, badge: "E-ZPass", portal: { label: "WV Turnpike", url: "https://transportation.wv.gov/turnpike/" } } },
  Colorado: { distance: { label: "E-470 / express lanes", detail: "ExpressToll rate", perKm: 0.05, share: 0.3, badge: "ExpressToll", portal: { label: "ExpressToll", url: "https://www.expresstoll.com/" } } },
  California: { distance: { label: "Bay Area bridges & express lanes", detail: "FasTrak rate", perKm: 0.02, share: 0.2, badge: "FasTrak", portal: { label: "FasTrak", url: "https://www.bayareafastrak.org/" } } },
};

/** Canadian provinces with real toll exposure. */
const CA_PROVINCE_RULES: Record<string, CountryRule> = {
  Ontario: { distance: { label: "Highway 407 ETR (optional bypass)", detail: "Transponder rate — the free 401 alternative is used by default", perKm: 0.03, share: 0.15, badge: "407 tag", portal: { label: "407 ETR", url: "https://www.407etr.com/" } } },
  Quebec: { distance: { label: "A25 / A30 crossings", detail: "Electronic tolling", perKm: 0.02, share: 0.1, badge: "A25", portal: { label: "A25", url: "https://a25.com/en/" } } },
  Québec: { distance: { label: "A25 / A30 crossings", detail: "Electronic tolling", perKm: 0.02, share: 0.1, badge: "A25", portal: { label: "A25", url: "https://a25.com/en/" } } },
  "Nova Scotia": { distance: { label: "Cobequid Pass (Highway 104)", detail: "Fixed plaza charge", perKm: 0.02, share: 0.3, portal: { label: "Cobequid Pass", url: "https://novascotia.ca/tran/highways/cobequid.asp" } } },
  "New Brunswick": { freeNote: "New Brunswick highways are toll-free." },
  "British Columbia": { freeNote: "BC highways are toll-free since the Port Mann and Golden Ears tolls ended." },
  Alberta: { freeNote: "Alberta highways are toll-free." },
  Manitoba: { freeNote: "Manitoba highways are toll-free." },
  Saskatchewan: { freeNote: "Saskatchewan highways are toll-free." },
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function distanceLine(rule: CountryRule, km: number): TollLine | null {
  const d = rule.distance;
  if (!d) return null;
  const tolled = km * d.share;
  const amount = round2(tolled * d.perKm);
  if (amount <= 0) return null;
  const line: TollLine = {
    place: d.label,
    detail: `${d.detail} · ~${Math.round(tolled)} km tolled of ${Math.round(km)} km driven`,
    amount,
  };
  if (d.badge) line.badge = d.badge;
  if (d.portal) line.portal = d.portal;
  return line;
}

function rulesFor(country: RouteCountry): { rule: CountryRule; label: string }[] {
  if (country.code === "US" || country.code === "CA") {
    const table = country.code === "US" ? US_STATE_RULES : CA_PROVINCE_RULES;
    const states = country.states.length ? country.states : [country.country];
    return states.map((state) => ({
      rule: table[state] ?? { freeNote: `No toll roads on the routed corridor through ${state}.` },
      label: `${country.flag} ${state}`,
    }));
  }
  return [
    {
      rule: EU_RULES[country.code] ?? {
        freeNote: `No national toll or vignette scheme detected for ${country.country} on this corridor.`,
      },
      label: `${country.flag} ${country.country}`,
    },
  ];
}

export type RouteSegments = {
  segments: { country: string; total: number; lines: TollLine[] }[];
  /** ISO codes actually entered, in travel order. */
  codes: string[];
};

/**
 * Build the country-by-country cost breakdown from the real routed corridor.
 * Amounts are one-way, car-rate — the trip estimator applies vehicle and
 * route-variant factors on top.
 */
export function buildRouteSegments(geo: RouteGeo): RouteSegments {
  const perLabel = new Map<string, TollLine[]>();
  const order: string[] = [];

  for (const country of geo.countries) {
    const share = geo.countries.length ? country.distanceKm : geo.distanceKm;
    for (const { rule, label } of rulesFor(country)) {
      const kmForRule =
        country.states.length > 1 ? share / country.states.length : share;
      const line = distanceLine(rule, kmForRule);
      if (!perLabel.has(label)) {
        perLabel.set(label, []);
        order.push(label);
      }
      const bucket = perLabel.get(label)!;
      if (rule.vignette && !bucket.some((l) => l.place === rule.vignette!.place)) {
        const v = rule.vignette;
        const vl: TollLine = { place: v.place, detail: v.detail, amount: v.amount, portal: v.portal, isVignette: true };
        if (v.badge) vl.badge = v.badge;
        if (v.motoFactor === 0) vl.freeForMotorcycle = true;
        if (v.motoFactor !== undefined) vl.motoFactor = v.motoFactor;
        bucket.push(vl);
      }
      if (line) bucket.push(line);
      if (!line && !rule.vignette && rule.freeNote && bucket.length === 0) {
        bucket.push({ place: "No toll on this corridor", detail: rule.freeNote, amount: 0 });
      }
    }
  }

  const segments = order.map((label) => {
    const lines = perLabel.get(label)!;
    return { country: label, total: round2(lines.reduce((s, l) => s + l.amount, 0)), lines };
  });

  return { segments, codes: geo.countries.map((c) => c.code) };
}

/** Human-readable border crossing list, e.g. "🇩🇰 Denmark → 🇩🇪 Germany near Flensburg". */
export function borderLabels(borders: RouteBorder[], imperial: boolean): string[] {
  return borders.map((b) => {
    const at = imperial
      ? `${Math.round(b.atKm * 0.621371)} mi`
      : `${Math.round(b.atKm)} km`;
    return `${b.fromCountry} → ${b.toCountry}${b.place ? ` near ${b.place}` : ""} · at ${at}`;
  });
}
