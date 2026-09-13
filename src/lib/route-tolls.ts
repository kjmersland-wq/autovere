/**
 * Real-corridor toll & vignette engine.
 *
 * Everything here is derived from the countries / states that the routed OSRM
 * polyline actually passes through — no static "European grand tour" fallback.
 */

import type { RouteBorder, RouteCountry, RouteGeo } from "@/lib/route-geo.functions";
import type { NoTollStation } from "@/lib/toll-data.functions";
import type { TollLine } from "@/lib/trip-data";

export type RouteSegmentOptions = {
  /** Real AutoPASS gantries (NVDB) — when present, Norway is priced per gantry, not per km. */
  noTolls?: NoTollStation[] | undefined;
  /** NOK per 1 EUR, used to express gantry rates in the trip's base currency. */
  nokPerEur?: number | undefined;
  /** Zero-emission vehicles pay a reduced rate in Norwegian schemes. */
  electric?: boolean | undefined;
  /** Base currency of the trip figures (EUR, USD or CAD). */
  baseCode?: "EUR" | "USD" | "CAD" | undefined;
};

/** Nearest distance from a point to the polyline plus the position along it (km). */
function projectOnCorridor(coords: [number, number][], lat: number, lng: number): { distKm: number; atKm: number } | null {
  if (coords.length < 2) return null;
  const cosLat = Math.cos((lat * Math.PI) / 180);
  const kmPerDegLat = 111.32;
  const toXY = (p: [number, number]) => [(p[1] - lng) * kmPerDegLat * cosLat, (p[0] - lat) * kmPerDegLat] as const;
  let best = Number.POSITIVE_INFINITY;
  let bestAt = 0;
  let cum = 0;
  let prev = toXY(coords[0]!);
  for (let i = 1; i < coords.length; i += 1) {
    const cur = toXY(coords[i]!);
    const dx = cur[0] - prev[0];
    const dy = cur[1] - prev[1];
    const len2 = dx * dx + dy * dy;
    const segLen = Math.sqrt(len2);
    // Only bother with segments whose bounding box comes within ~1.5 km.
    if (Math.min(Math.abs(prev[0]), Math.abs(cur[0])) < 1.5 + segLen && Math.min(Math.abs(prev[1]), Math.abs(cur[1])) < 1.5 + segLen) {
      const t = len2 > 0 ? Math.max(0, Math.min(1, (-prev[0] * dx - prev[1] * dy) / len2)) : 0;
      const px = prev[0] + t * dx;
      const py = prev[1] + t * dy;
      const d = Math.sqrt(px * px + py * py);
      if (d < best) {
        best = d;
        bestAt = cum + t * segLen;
      }
    }
    cum += segLen;
    prev = cur;
  }
  return Number.isFinite(best) ? { distKm: best, atKm: bestAt } : null;
}

/** Match radius: gantries sit on the carriageway; 120 m absorbs polyline simplification. */
const GANTRY_RADIUS_KM = 0.12;

/**
 * Price Norway from the real gantries the corridor passes. Returns one line per
 * toll scheme (bompengeanlegg) with the number of gantries charged.
 */
export function norwayGantryLines(geo: RouteGeo, opts: RouteSegmentOptions): TollLine[] | null {
  const stations = opts.noTolls;
  if (!stations?.length || geo.coords.length < 2) return null;

  // Bounding box prefilter around the polyline.
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  for (const [la, lo] of geo.coords) {
    if (la < minLat) minLat = la;
    if (la > maxLat) maxLat = la;
    if (lo < minLng) minLng = lo;
    if (lo > maxLng) maxLng = lo;
  }
  const pad = 0.02;
  type Hit = { station: NoTollStation; atKm: number };
  const hits: Hit[] = [];
  for (const s of stations) {
    if (s.lat < minLat - pad || s.lat > maxLat + pad || s.lng < minLng - pad || s.lng > maxLng + pad) continue;
    const proj = projectOnCorridor(geo.coords, s.lat, s.lng);
    if (proj && proj.distKm <= GANTRY_RADIUS_KM) hits.push({ station: s, atKm: proj.atKm });
  }
  if (!hits.length) return [];
  hits.sort((a, b) => a.atKm - b.atKm);

  // One-way gantries come in pairs (one per carriageway) — charge the spot once.
  const passages: Hit[] = [];
  for (const h of hits) {
    const twin = passages.find(
      (p) => p.station.facility === h.station.facility && Math.abs(p.atKm - h.atKm) < 0.4 && p.station.direction !== "both" && h.station.direction !== "both",
    );
    if (twin) {
      if (h.station.car > twin.station.car) twin.station = h.station;
      continue;
    }
    passages.push({ ...h });
  }

  // Hourly rule (timesregel): within a scheme that publishes one, consecutive
  // passages inside the window are charged once. ~60 km/h urban average.
  const charged: Hit[] = [];
  const lastChargedAt = new Map<string, number>();
  for (const p of passages) {
    const rule = p.station.timeRuleMin;
    const key = p.station.facility;
    const last = lastChargedAt.get(key);
    if (rule && last !== undefined && p.atKm - last < (rule / 60) * 60) continue;
    charged.push(p);
    lastChargedAt.set(key, p.atKm);
  }

  const rate = (s: NoTollStation) => (opts.electric ? (s.ev ?? Math.round(s.car * 0.7 * 100) / 100) : s.car);
  const nok = opts.nokPerEur ?? 11.7;
  const perEur = opts.baseCode === "USD" ? nok / 1.17 : opts.baseCode === "CAD" ? nok / 1.6 : nok;

  const byFacility = new Map<string, Hit[]>();
  for (const c of charged) {
    const list = byFacility.get(c.station.facility) ?? [];
    list.push(c);
    byFacility.set(c.station.facility, list);
  }
  const lines: TollLine[] = [];
  for (const [facility, list] of byFacility) {
    const totalNok = list.reduce((sum, h) => sum + rate(h.station), 0);
    if (totalNok <= 0) continue;
    const names = list.map((h) => `${h.station.name || "gantry"} ${rate(h.station).toLocaleString("nb-NO")} kr`).join(", ");
    lines.push({
      place: facility.replace(/^Bompengeanlegg\s+/i, ""),
      detail: `${list.length} AutoPASS ${list.length === 1 ? "gantry" : "gantries"} · ${names} · standard rate, 20% less with an AutoPASS tag${opts.electric ? " · zero-emission rate (70% of standard where the scheme publishes no EV rate)" : ""}`,
      amount: round2(totalNok / perEur),
      badge: `${Math.round(totalNok).toLocaleString("nb-NO")} kr`,
      portal: { label: "AutoPASS", url: list[0]?.station.url ?? "https://www.autopass.no/en/" },
      freeForMotorcycle: true,
    });
  }
  return lines;
}

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
      detail: "10-day digital vignette, 2026 tariff (EUR 12.80 car · EUR 5.10 motorcycle)",
      amount: 12.8,
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
      detail: "10-day e-vignette, 2026 tariff (CZK 290 ≈ EUR 11.80)",
      amount: 11.8,
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
export function buildRouteSegments(geo: RouteGeo, opts: RouteSegmentOptions = {}): RouteSegments {
  const perLabel = new Map<string, TollLine[]>();
  const order: string[] = [];
  // Real gantry pricing for Norway when the NVDB dataset is available.
  const norwayLines = geo.countries.some((c) => c.code === "NO") ? norwayGantryLines(geo, opts) : null;

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
      if (country.code === "NO" && norwayLines) {
        if (bucket.length === 0) {
          if (norwayLines.length) bucket.push(...norwayLines);
          else
            bucket.push({
              place: "No AutoPASS gantry on this corridor",
              detail: "Checked against Statens vegvesen's national gantry register — none of the tolled points lie on the routed road.",
              amount: 0,
            });
        }
        continue;
      }
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

  // Fixed links (bridges) the polyline physically crosses — priced from the
  // operators' published 2026 tariffs. The label must contain "Ferries" so the
  // estimator books it under ferries & passes, not tolls.
  const links = fixedLinkLines(geo);
  if (links.length) {
    segments.push({ country: "⛴️ Bridges & Ferries", total: round2(links.reduce((s, l) => s + l.amount, 0)), lines: links });
  }

  return { segments, codes: geo.countries.map((c) => c.code) };
}

const DKK_PER_EUR = 7.46; // ERM II central rate — DKK is pegged to the euro.

type FixedLink = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  /** Standard one-way car price at the toll plaza, in local currency. */
  car: number;
  currency: "DKK";
  detail: string;
  motoFactor: number;
  portal: { label: string; url: string };
};

const FIXED_LINKS: FixedLink[] = [
  {
    id: "storebaelt",
    name: "Storebælt Bridge (Fyn ↔ Sjælland)",
    lat: 55.3417,
    lng: 11.0,
    radiusKm: 1.5,
    car: 235,
    currency: "DKK",
    detail: "2026 tariff, card/cash at the plaza · 205 DKK with Bizz or number-plate payment",
    motoFactor: 0.53,
    portal: { label: "storebaelt.dk", url: "https://storebaelt.dk/en/prices-and-discounts/private/" },
  },
  {
    id: "oresund",
    name: "Øresund Bridge (Copenhagen ↔ Malmö)",
    lat: 55.5714,
    lng: 12.8459,
    radiusKm: 1.5,
    car: 470,
    currency: "DKK",
    detail: "2026 standard price at the plaza · 182 DKK per crossing with ØresundGO, online tickets in between",
    motoFactor: 0.5,
    portal: { label: "oresundsbron.com", url: "https://www.oresundsbron.com/en/prices" },
  },
];

function fixedLinkLines(geo: RouteGeo): TollLine[] {
  const coords = geo.coords ?? [];
  if (coords.length < 2) return [];
  const lines: TollLine[] = [];
  for (const link of FIXED_LINKS) {
    const hit = projectOnCorridor(coords, link.lat, link.lng);
    if (!hit || hit.distKm > link.radiusKm) continue;
    const amount = round2(link.car / DKK_PER_EUR);
    lines.push({
      place: link.name,
      detail: `${link.detail} · ${link.car} ${link.currency} · at ${Math.round(hit.atKm)} km`,
      amount,
      badge: "Fixed link",
      portal: link.portal,
      motoFactor: link.motoFactor,
    });
  }
  return lines;
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
