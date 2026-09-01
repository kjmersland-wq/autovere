export type VehicleKind = "car" | "motorhome" | "motorcycle";

export type GarageVehicle = {
  id: string;
  kind: VehicleKind;
  name: string;
  fuel: "petrol" | "diesel" | "ev";
  tank: string;
  consumption: string;
  height?: string;
  tags: string[];
  /** Custom EV average consumption in kWh/100 km. */
  kwhPer100?: number;
  /** Usable battery capacity in kWh. */
  batteryKwh?: number;
  /** Preferred fast-charging operator, or "all" for no preference. */
  network?: string;
};

/** Charging operators the planner can prioritise along a corridor. */
export const CHARGING_NETWORKS = [
  "All networks",
  "Tesla Supercharger",
  "Ionity",
  "EnBW mobility+",
  "Fastned",
  "GreenWay Polska",
  "Orlen Charge",
  "Allego",
  "Recharge",
  "Mer",
  "Clever",
  "Electrify America",
  "EvGo",
  "Electrify Canada",
  "FLO",
  "Petro-Canada eV",
] as const;

export const ALL_NETWORKS = "All networks";

export type SavedTripStop = { place: string; detail: string };

export type SavedTrip = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  detail: string;
  when: string;
  distanceLabel?: string;
  driveTime?: string;
  budget?: number;
  currency?: string;
  tolls?: number;
  ferries?: number;
  energyCost?: number;
  stops?: SavedTripStop[];
  /** Real reverse-geocoded waypoints from the routed polyline. */
  points?: { name: string; detail: string; lat: number; lon: number }[];
  /** Thinned routed polyline [lat, lng] for GPX tracks. */
  coords?: [number, number][];
  countries?: string[];
};

export const VEHICLE_META: Record<VehicleKind, { emoji: string; label: string }> = {
  car: { emoji: "🚗", label: "Car" },
  motorhome: { emoji: "🚐", label: "Motorhome" },
  motorcycle: { emoji: "🏍️", label: "Touring motorcycle" },
};

export const FUEL_LABEL = {
  petrol: "⛽ Petrol",
  diesel: "🛢️ Diesel",
  ev: "⚡ Electric (EV)",
} as const;

export const TOLL_TAGS = [
  "AutoPASS",
  "EPASS24",
  "Telepass",
  "Bip&Go",
  "Fulli",
  "Via-T",
  "SunPass",
  "E-ZPass",
  "407 ETR",
];

const VEHICLE_KEY = "autovere.vehicles";
const ACTIVE_VEHICLE_KEY = "autovere.activeVehicle";
export const TRIPS_KEY = "autovere.savedTrips";

export const DEFAULT_VEHICLES: GarageVehicle[] = [
  {
    id: "seed-gs",
    kind: "motorcycle",
    name: "BMW R 1250 GS Adventure",
    fuel: "petrol",
    tank: "30 L",
    consumption: "4.8 L/100 km",
    tags: ["AutoPASS", "Telepass"],
  },
  {
    id: "seed-hymer",
    kind: "motorhome",
    name: "Hymer B-Klasse ML-T 580",
    fuel: "diesel",
    tank: "90 L",
    consumption: "11.5 L/100 km",
    height: "3.05 m · 3.5 t",
    tags: ["Telepass", "Bip&Go"],
  },
  {
    id: "seed-model-y",
    kind: "car",
    name: "Tesla Model Y Long Range",
    fuel: "ev",
    tank: "75 kWh",
    consumption: "18 kWh/100 km",
    kwhPer100: 18,
    batteryKwh: 75,
    network: "Tesla Supercharger",
    tags: ["AutoPASS", "SunPass"],
  },
];

export const DEFAULT_TRIPS: SavedTrip[] = [
  {
    id: "seed-amalfi",
    name: "Munich → Amalfi Coast",
    origin: "Munich",
    destination: "Amalfi",
    detail: "1,420 km · 14h 30m · €318 budget",
    when: "Saved 12 Aug",
    distanceLabel: "1,420 km",
    driveTime: "14h 30m",
    budget: 318,
    currency: "EUR",
    tolls: 96,
    ferries: 0,
    energyCost: 222,
  },
  {
    id: "seed-lofoten",
    name: "Oslo → Lofoten",
    origin: "Oslo",
    destination: "Lofoten",
    detail: "1,380 km · 19h 05m · NOK 4,210 budget",
    when: "Saved 2 Jul",
    distanceLabel: "1,380 km",
    driveTime: "19h 05m",
    budget: 4210,
    currency: "NOK",
    tolls: 820,
    ferries: 640,
    energyCost: 2750,
  },
  {
    id: "seed-bigsur",
    name: "Seattle → Big Sur",
    origin: "Seattle",
    destination: "Big Sur",
    detail: "1,890 km · 20h 40m · $412 budget",
    when: "Saved 18 Jun",
    distanceLabel: "1,175 mi",
    driveTime: "20h 40m",
    budget: 412,
    currency: "USD",
    tolls: 38,
    ferries: 24,
    energyCost: 350,
  },
  {
    id: "seed-banff",
    name: "Toronto → Banff",
    origin: "Toronto",
    destination: "Banff",
    detail: "3,420 km · 34h 10m · C$890 budget",
    when: "Saved 4 May",
    distanceLabel: "3,420 km",
    driveTime: "34h 10m",
    budget: 890,
    currency: "CAD",
    tolls: 74,
    ferries: 0,
    energyCost: 816,
  },
];

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadVehicles(): GarageVehicle[] {
  const stored = read<GarageVehicle[]>(VEHICLE_KEY, []);
  return stored.length ? stored : DEFAULT_VEHICLES;
}

export function saveVehicles(vehicles: GarageVehicle[]) {
  try {
    localStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicles));
  } catch {
    /* storage unavailable */
  }
}

export function loadTrips(): SavedTrip[] {
  const stored = read<Partial<SavedTrip>[]>(TRIPS_KEY, []);
  const normalised = stored.map((t, i) => ({
    id: t.id ?? `stored-${i}`,
    name: t.name ?? "Saved trip",
    origin: t.origin ?? (t.name ?? "").split("→")[0]?.trim() ?? "",
    destination: t.destination ?? (t.name ?? "").split("→")[1]?.trim() ?? "",
    detail: t.detail ?? "",
    when: t.when ?? "Saved",
    ...t,
  })) as SavedTrip[];
  return [...normalised, ...DEFAULT_TRIPS];
}

export function persistTrips(trips: SavedTrip[]) {
  try {
    const seedIds = new Set(DEFAULT_TRIPS.map((t) => t.id));
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips.filter((t) => !seedIds.has(t.id))));
  } catch {
    /* storage unavailable */
  }
}

/** GPX built from the real routed coordinates stored with the saved trip. */
export function tripGpx(trip: SavedTrip) {
  const wpts = (trip.points ?? [])
    .map(
      (p) =>
        `  <wpt lat="${p.lat.toFixed(5)}" lon="${p.lon.toFixed(5)}">\n    <name>${escapeXml(p.name)}</name>\n    <desc>${escapeXml(p.detail)}</desc>\n  </wpt>`,
    )
    .join("\n");
  const track = (trip.coords ?? [])
    .map(([lat, lon]) => `      <trkpt lat="${lat.toFixed(5)}" lon="${lon.toFixed(5)}" />`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AutoVere" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(trip.name)}</name>
    <desc>${escapeXml(trip.detail)}</desc>
  </metadata>
${wpts}
${track ? `  <trk>\n    <name>${escapeXml(trip.name)}</name>\n    <trkseg>\n${track}\n    </trkseg>\n  </trk>` : ""}
</gpx>`;
}

function escapeXml(value: string) {
  return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function googleMapsUrl(trip: SavedTrip) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(trip.origin)}&destination=${encodeURIComponent(trip.destination)}&travelmode=driving`;
}

export function wazeUrl(trip: SavedTrip) {
  return `https://www.waze.com/ul?q=${encodeURIComponent(trip.destination)}&navigate=yes`;
}

export function printTripSummary(trip: SavedTrip) {
  const w = window.open("", "_blank", "width=880,height=1000");
  if (!w) return false;
  const row = (label: string, value: string) =>
    `<tr><th>${escapeXml(label)}</th><td>${escapeXml(value)}</td></tr>`;
  const money = (v?: number) =>
    v === undefined ? "—" : `${trip.currency ?? "EUR"} ${v.toLocaleString("en-GB")}`;
  const stops = (trip.stops ?? [])
    .map((s) => `<li><strong>${escapeXml(s.place)}</strong> — ${escapeXml(s.detail)}</li>`)
    .join("");
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeXml(trip.name)} — AutoVere</title>
<style>
body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;margin:40px;}
h1{font-size:26px;margin:0 0 4px;} p.sub{color:#475569;margin:0 0 24px;}
table{border-collapse:collapse;width:100%;max-width:560px;margin-bottom:24px;}
th,td{border-bottom:1px solid #e2e8f0;padding:8px 10px;text-align:left;font-size:14px;}
th{width:200px;color:#475569;font-weight:600;}
ul{padding-left:18px;font-size:14px;line-height:1.6;}
footer{margin-top:36px;font-size:11px;color:#64748b;}
</style></head><body>
<h1>${escapeXml(trip.name)}</h1>
<p class="sub">${escapeXml(trip.detail)} · ${escapeXml(trip.when)}</p>
<table>
${row("Origin", trip.origin)}
${row("Destination", trip.destination)}
${row("Distance", trip.distanceLabel ?? "—")}
${row("Driving time", trip.driveTime ?? "—")}
${row("Tolls & vignettes", money(trip.tolls))}
${row("Ferries & passes", money(trip.ferries))}
${row("Fuel / charging", money(trip.energyCost))}
${row("Total budget", money(trip.budget))}
</table>
${stops ? `<h2 style="font-size:16px">Checkpoints &amp; stops</h2><ul>${stops}</ul>` : ""}
<footer>AutoVere by KM TECH LABS — indicative estimates only. Verify with official portals before travelling.</footer>
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
  return true;
}

export function duplicateTrip(trip: SavedTrip): SavedTrip {
  return {
    ...trip,
    id: newId(),
    name: `${trip.name} (copy)`,
    when: `Duplicated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
  };
}
