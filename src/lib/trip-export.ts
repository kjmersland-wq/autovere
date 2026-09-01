import { money, type TripEstimate } from "@/lib/trip-data";

export function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Real waypoints from the routed polyline — never synthetic coordinates. */
export function tripWaypoints(trip: TripEstimate) {
  return trip.corridor?.points ?? [];
}

/** The routed polyline, thinned to a GPS-unit friendly point count. */
export function tripTrackPoints(trip: TripEstimate): [number, number][] {
  const coords = trip.corridor?.coords ?? [];
  if (coords.length <= 500) return coords;
  const step = Math.ceil(coords.length / 500);
  return coords.filter((_, i) => i % step === 0 || i === coords.length - 1);
}

export function buildTripGpx(trip: TripEstimate, origin: string, destination: string) {
  const pts = tripWaypoints(trip);
  const wpts = pts
    .map(
      (p) =>
        `  <wpt lat="${p.lat.toFixed(4)}" lon="${p.lon.toFixed(4)}">\n    <name>${escapeXml(p.name)}</name>\n    <desc>${escapeXml(p.detail)}</desc>\n    <sym>Flag, Blue</sym>\n  </wpt>`,
    )
    .join("\n");
  const track = tripTrackPoints(trip)
    .map(([lat, lon]) => `      <trkpt lat="${lat.toFixed(5)}" lon="${lon.toFixed(5)}" />`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AutoVere" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(origin || "Start")} to ${escapeXml(destination || "Destination")}</name>
    <desc>${escapeXml(`${trip.distanceLabel} · ${trip.driveTime} · budget ${money(trip.currency, trip.budget)}`)}</desc>
  </metadata>
${wpts}
  <trk>
    <name>${escapeXml(origin || "Start")} → ${escapeXml(destination || "Destination")}</name>
    <trkseg>
${track}
    </trkseg>
  </trk>
</gpx>`;
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function tripFileBase(origin: string, destination: string) {
  const s = `${origin}-${destination}`.toLowerCase().replace(/\W+/g, "-").replace(/^-|-$/g, "");
  return `autovere-${s || "road-trip"}`;
}
