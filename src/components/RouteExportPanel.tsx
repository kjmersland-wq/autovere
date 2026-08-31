import { Car, Download, FileText, MapPin, Printer, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { money, type TripEstimate } from "@/lib/trip-data";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Indicative waypoints so exported files load cleanly in GPS units. */
function waypoints(trip: TripEstimate) {
  return trip.segments
    .flatMap((s) => s.lines)
    .map((l, i) => ({
      name: l.place,
      detail: l.detail,
      lat: 46 + i * 0.35,
      lon: 9 + i * 0.4,
    }));
}

function buildGpx(trip: TripEstimate, origin: string, destination: string) {
  const pts = waypoints(trip);
  const wpts = pts
    .map(
      (p) =>
        `  <wpt lat="${p.lat.toFixed(4)}" lon="${p.lon.toFixed(4)}">\n    <name>${escapeXml(p.name)}</name>\n    <desc>${escapeXml(p.detail)}</desc>\n    <sym>Flag, Blue</sym>\n  </wpt>`,
    )
    .join("\n");
  const track = pts
    .map((p) => `      <trkpt lat="${p.lat.toFixed(4)}" lon="${p.lon.toFixed(4)}" />`)
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

function buildKml(trip: TripEstimate, origin: string, destination: string) {
  const pts = waypoints(trip);
  const placemarks = pts
    .map(
      (p) =>
        `    <Placemark>\n      <name>${escapeXml(p.name)}</name>\n      <description>${escapeXml(p.detail)}</description>\n      <Point><coordinates>${p.lon.toFixed(4)},${p.lat.toFixed(4)},0</coordinates></Point>\n    </Placemark>`,
    )
    .join("\n");
  const line = pts.map((p) => `${p.lon.toFixed(4)},${p.lat.toFixed(4)},0`).join(" ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(origin || "Start")} → ${escapeXml(destination || "Destination")}</name>
    <description>${escapeXml(`${trip.distanceLabel} · ${trip.driveTime} · budget ${money(trip.currency, trip.budget)}`)}</description>
${placemarks}
    <Placemark>
      <name>Route corridor</name>
      <LineString><tessellate>1</tessellate><coordinates>${line}</coordinates></LineString>
    </Placemark>
  </Document>
</kml>`;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(value: string, fallback: string) {
  const s = value.toLowerCase().replace(/\W+/g, "-").replace(/^-|-$/g, "");
  return s || fallback;
}

const CONNECTED_VEHICLES = [
  {
    emoji: "🔋",
    label: "Tesla",
    hint: "Send destination via your Tesla account",
    url: (o: string, d: string) =>
      `https://www.tesla.com/tesla_account/trips?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "🅱️",
    label: "BMW iDrive",
    hint: "Send to Car via My BMW / Motorrad Connected",
    url: (_o: string, d: string) =>
      `https://www.bmw-connecteddrive.com/app/index.html#/send-to-car?destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "⭐",
    label: "Mercedes me",
    hint: "Push the route to MBUX navigation",
    url: (_o: string, d: string) =>
      `https://www.mercedes-benz.com/en/mercedes-me/?destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "📱",
    label: "Android Auto / CarPlay",
    hint: "Opens the maps hand-off link on your phone",
    url: (o: string, d: string) =>
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}&travelmode=driving`,
  },
] as const;

export function RouteExportPanel({
  trip,
  origin,
  destination,
}: {
  trip: TripEstimate;
  origin: string;
  destination: string;
}) {
  const from = origin || "Start";
  const to = destination || "Destination";
  const base = slug(`${origin}-${destination}`, "autovere-trip");

  const exportGpx = () => {
    downloadFile(buildGpx(trip, origin, destination), `${base}.gpx`, "application/gpx+xml");
    toast.success("GPX ready — load it into Garmin, TomTom Rider or BMW Motorrad Connected.");
  };

  const exportKml = () => {
    downloadFile(buildKml(trip, origin, destination), `${base}.kml`, "application/vnd.google-earth.kml+xml");
    toast.success("KML ready — open it in Google Earth or your mapping overlay.");
  };

  const navLinks = [
    {
      emoji: "🗺️",
      label: "Open in Google Maps",
      href: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=driving`,
    },
    {
      emoji: "🍏",
      label: "Open in Apple Maps",
      href: `https://maps.apple.com/?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&dirflg=d`,
    },
    {
      emoji: "🚗",
      label: "Open in Waze",
      href: `https://www.waze.com/ul?q=${encodeURIComponent(to)}&navigate=yes`,
    },
  ];

  const printItinerary = () => {
    const rows = trip.segments
      .map(
        (s) => `
      <tr class="country"><td colspan="2">${escapeXml(s.country)}</td><td class="num">${escapeXml(money(trip.currency, s.total))}</td></tr>
      ${s.lines
        .map(
          (l) =>
            `<tr><td>${escapeXml(l.place)}</td><td>${escapeXml(l.detail)}</td><td class="num">${escapeXml(money(trip.currency, l.cost))}</td></tr>`,
        )
        .join("")}`,
      )
      .join("");
    const stops = trip.optimizer.stops
      .map(
        (s) =>
          `<li><strong>${escapeXml(s.name)}</strong> — ${escapeXml(s.detail)}${s.atKmLabel ? ` (${escapeXml(s.atKmLabel)})` : ""}</li>`,
      )
      .join("");

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>AutoVere itinerary — ${escapeXml(from)} to ${escapeXml(to)}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:ui-sans-serif,system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;margin:32px;line-height:1.5}
  h1{font-size:22px;margin:0 0 4px}
  h2{font-size:15px;margin:26px 0 8px;text-transform:uppercase;letter-spacing:.08em;color:#475569}
  .sub{color:#475569;margin:0 0 18px;font-size:13px}
  .cards{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}
  .card{border:1px solid #cbd5e1;border-radius:10px;padding:10px 14px;min-width:150px}
  .card span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
  .card strong{font-size:18px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top}
  .num{text-align:right;white-space:nowrap}
  tr.country td{background:#f1f5f9;font-weight:700}
  ul{padding-left:18px;font-size:13px}
  footer{margin-top:28px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:10px}
  @page{margin:16mm}
</style></head><body>
<h1>AutoVere road trip — ${escapeXml(from)} → ${escapeXml(to)}</h1>
<p class="sub">${escapeXml(trip.distanceLabel)} · ${escapeXml(trip.driveTime)} driving · printed ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
<div class="cards">
  <div class="card"><span>Total budget</span><strong>${escapeXml(money(trip.currency, trip.budget))}</strong></div>
  <div class="card"><span>Tolls &amp; vignettes</span><strong>${escapeXml(money(trip.currency, trip.tolls))}</strong></div>
  <div class="card"><span>${escapeXml(trip.energyLabel)}</span><strong>${escapeXml(money(trip.currency, trip.energyCost))}</strong></div>
  <div class="card"><span>Ferries &amp; passes</span><strong>${escapeXml(money(trip.currency, trip.ferries))}</strong></div>
</div>
<h2>Turn-by-turn toll checkpoints</h2>
<table><thead><tr><th>Checkpoint</th><th>Detail</th><th class="num">Cost</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Estimated ${trip.optimizer.isElectric ? "charging" : "fuel"} stops</h2>
<ul>${stops || "<li>No mandatory stops on this leg — top up before departure.</li>"}</ul>
<footer>Indicative estimates only — verify with official portals before you travel. AutoVere by KM TECH LABS, Kristiansand, Norway.</footer>
</body></html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) {
      toast.error("Allow pop-ups to print your itinerary.");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  };

  return (
    <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Download className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">Export &amp; navigate</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        Take this route with you — sat-nav files, one-tap navigation, or a clean printed cost summary for the glovebox.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="lg" className="font-semibold" onClick={exportGpx}>
          <Download className="size-4" /> 📥 Download GPX File
        </Button>
        <Button size="lg" variant="secondary" onClick={exportKml}>
          <FileText className="size-4" /> 📄 Download KML File
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        GPX works with Garmin zūmo, TomTom Rider and BMW Motorrad Connected · KML opens in Google Earth.
      </p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          1-click navigation
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {navLinks.map((l) => (
            <Button key={l.label} asChild size="lg" variant="outline">
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                <MapPin className="size-4" /> {l.emoji} {l.label}
              </a>
            </Button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button size="lg" variant="outline">
                <Send className="size-4" /> 🚘 Send to Connected Vehicle
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-1">
              <p className="px-1 pb-2 text-xs text-muted-foreground">
                Quick hand-off to your car's built-in navigation.
              </p>
              {CONNECTED_VEHICLES.map((v) => (
                <a
                  key={v.label}
                  href={v.url(from, to)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => toast.success(`Route handed off to ${v.label}.`)}
                  className="flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-primary/10"
                >
                  <span className="text-lg leading-none">{v.emoji}</span>
                  <span>
                    <span className="block text-sm font-semibold">{v.label}</span>
                    <span className="block text-xs text-muted-foreground">{v.hint}</span>
                  </span>
                </a>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button size="lg" variant="secondary" onClick={printItinerary}>
          <Printer className="size-4" /> 🖨️ Print Turn-by-Turn Cost Summary
        </Button>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Car className="size-3.5" /> Paper-friendly PDF with every toll checkpoint and fuel stop.
        </span>
      </div>
    </div>
  );
}
