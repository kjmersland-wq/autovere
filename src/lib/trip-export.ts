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

/** Google Earth / Maps file with the real routed line and the real toll points. */
export function buildKml(trip: TripEstimate, origin: string, destination: string) {
  const placemarks = tripWaypoints(trip)
    .map(
      (p) =>
        `    <Placemark>
      <name>${escapeXml(p.name)}</name>
      <description>${escapeXml(p.detail)}</description>
      <Point><coordinates>${p.lon.toFixed(5)},${p.lat.toFixed(5)},0</coordinates></Point>
    </Placemark>`,
    )
    .join("\n");
  const line = tripTrackPoints(trip)
    .map(([lat, lon]) => `${lon.toFixed(5)},${lat.toFixed(5)},0`)
    .join(" ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(origin || "Start")} → ${escapeXml(destination || "Destination")}</name>
    <description>${escapeXml(`${trip.distanceLabel} · ${trip.driveTime} · budget ${money(trip.currency, trip.budget)}`)}</description>
${placemarks}
    <Placemark>
      <name>Route</name>
      <LineString><tessellate>1</tessellate><coordinates>${line}</coordinates></LineString>
    </Placemark>
  </Document>
</kml>`;
}

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Expense-report attachment: one row per toll / ferry line, then the totals.
 * Semicolon-separated with a BOM so Norwegian Excel opens it correctly.
 */
export function buildExpenseCsv(trip: TripEstimate, origin: string, destination: string, date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  const trip_ = `${origin || "Start"} → ${destination || "Destination"}`;
  const rows: (string | number)[][] = [["Date", "Trip", "Distance", "Country", "Item", "Detail", "Amount", "Currency"]];
  for (const seg of trip.segments) {
    for (const l of seg.lines) {
      rows.push([day, trip_, trip.distanceLabel, seg.country, l.place, l.detail, l.amount.toFixed(2), trip.currency]);
    }
  }
  rows.push([day, trip_, trip.distanceLabel, "", "Tolls", "", trip.tolls.toFixed(2), trip.currency]);
  rows.push([day, trip_, trip.distanceLabel, "", "Ferries", "", trip.ferries.toFixed(2), trip.currency]);
  rows.push([day, trip_, trip.distanceLabel, "", "Energy", trip.energyLabel, trip.energyCost.toFixed(2), trip.currency]);
  rows.push([day, trip_, trip.distanceLabel, "", "Total", "", trip.budget.toFixed(2), trip.currency]);
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n");
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
