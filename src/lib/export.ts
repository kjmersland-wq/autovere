import type { LatLng } from "./countries";
import { samplePolyline, type Charger, type Place } from "./geo";

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

export function appleMapsUrl(from: Place, to: Place): string {
  return `https://maps.apple.com/?saddr=${from.lat},${from.lon}&daddr=${to.lat},${to.lon}&dirflg=d`;
}

export function chargerWaypoints(stops: Charger[]) {
  return stops.map((s) => ({ lat: s.lat, lon: s.lon, name: `${s.name} (${s.powerKw ?? "?"} kW)` }));
}
