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
};

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

export function tripGpx(trip: SavedTrip) {
  const stops = trip.stops?.length ? trip.stops : [{ place: trip.destination, detail: trip.detail }];
  const wpts = stops
    .map(
      (s, i) =>
        `  <wpt lat="${(46 + i * 0.35).toFixed(4)}" lon="${(9 + i * 0.4).toFixed(4)}">\n    <name>${escapeXml(s.place)}</name>\n    <desc>${escapeXml(s.detail)}</desc>\n  </wpt>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AutoVere" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(trip.name)}</name>
    <desc>${escapeXml(trip.detail)}</desc>
  </metadata>
${wpts}
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
