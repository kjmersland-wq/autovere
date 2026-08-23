import { samplePolyline, type Charger, type Place } from "./geo";
import { COUNTRY_NAMES, countryAt, type LatLng } from "./countries";

function esc(s: string) {
  return s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function buildGpx(opts: {
  name: string;
  coords: LatLng[];
  waypoints: { lat: number; lon: number; name: string }[];
}): string {
  const trkpts = samplePolyline(opts.coords, 0.5)
    .map(({ pt }) => `      <trkpt lat="${pt[0].toFixed(6)}" lon="${pt[1].toFixed(6)}" />`)
    .join("\n");
  const wpts = opts.waypoints
    .map(
      (w) =>
        `  <wpt lat="${w.lat.toFixed(6)}" lon="${w.lon.toFixed(6)}"><name>${esc(w.name)}</name></wpt>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AutoVere" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${esc(opts.name)}</name></metadata>
${wpts}
  <trk>
    <name>${esc(opts.name)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}

export function downloadGpx(filename: string, gpx: string) {
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildKml(opts: {
  name: string;
  coords: LatLng[];
  waypoints: { lat: number; lon: number; name: string }[];
}): string {
  const coordinates = opts.coords.map(([lat, lon]) => `${lon},${lat},0`).join(" ");
  const points = opts.waypoints
    .map(
      (waypoint) =>
        `    <Placemark><name>${esc(waypoint.name)}</name><Point><coordinates>${waypoint.lon},${waypoint.lat},0</coordinates></Point></Placemark>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
  <name>${esc(opts.name)}</name>
${points}
  <Placemark><name>${esc(opts.name)}</name><LineString><tessellate>1</tessellate><coordinates>${coordinates}</coordinates></LineString></Placemark>
</Document></kml>`;
}

export function routeWaypoints(
  coords: LatLng[],
  chargers: Charger[],
  borders: { pt: LatLng; from: string; to: string }[],
  vignetteCountries: string[],
  scenic: { lat: number; lon: number; name: string }[] = [],
) {
  const waypoints = chargers.map((charger) => ({
    lat: charger.lat,
    lon: charger.lon,
    name: `${charger.name} (${charger.powerKw ? `${Math.round(charger.powerKw)} kW` : "fast charger"}) · ${COUNTRY_NAMES[countryAt([charger.lat, charger.lon]) ?? ""] ?? "EU"}`,
  }));
  waypoints.push(
    ...borders.map((border) => ({
      lat: border.pt[0],
      lon: border.pt[1],
      name: `Border checkpoint: ${COUNTRY_NAMES[border.from] ?? border.from} → ${COUNTRY_NAMES[border.to] ?? border.to}`,
    })),
  );
  for (const code of vignetteCountries) {
    const checkpoint = coords.find((point) => countryAt(point) === code);
    if (checkpoint) {
      waypoints.push({
        lat: checkpoint[0],
        lon: checkpoint[1],
        name: `${COUNTRY_NAMES[code] ?? code} vignette terminal`,
      });
    }
  }
  waypoints.push(...scenic);
  return waypoints;
}

/** Pick evenly spaced shaping waypoints so navigation apps follow this exact route. */
export function shapingWaypoints(coords: LatLng[], count = 5): LatLng[] {
  const samples = samplePolyline(coords, 1);
  if (samples.length < count + 2) return [];
  const out: LatLng[] = [];
  for (let i = 1; i <= count; i++) {
    const s = samples[Math.round((samples.length * i) / (count + 1))];
    if (s) out.push(s.pt);
  }
  return out;
}

export function googleMapsUrl(from: Place, to: Place, via: LatLng[]): string {
  const params = new URLSearchParams({
    api: "1",
    origin: `${from.lat},${from.lon}`,
    destination: `${to.lat},${to.lon}`,
    travelmode: "driving",
  });
  if (via.length)
    params.set("waypoints", via.map(([lat, lon]) => `${lat.toFixed(5)},${lon.toFixed(5)}`).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

export function appleMapsUrl(from: Place, to: Place, via: LatLng[] = []): string {
  const params = new URLSearchParams({
    saddr: `${from.lat},${from.lon}`,
    daddr: `${to.lat},${to.lon}`,
    dirflg: "d",
  });
  if (via.length) params.set("waypoints", via.map(([lat, lon]) => `${lat},${lon}`).join(";"));
  return `https://maps.apple.com/?${params}`;
}

export function wazeUrl(to: LatLng): string {
  return `https://www.waze.com/ul?ll=${to[0]},${to[1]}&navigate=yes`;
}

export function chargerWaypoints(stops: Charger[]) {
  return stops.map((s) => ({ lat: s.lat, lon: s.lon, name: `${s.name} (${s.powerKw ?? "?"} kW)` }));
}
