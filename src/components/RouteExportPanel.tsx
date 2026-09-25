import { Car, Download, FileText, Lock, MapPin, Printer, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useT } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { money, type TripEstimate } from "@/lib/trip-data";
import { buildExpenseCsv, buildKml, buildTripGpx, downloadFile, escapeXml } from "@/lib/trip-export";

function slug(value: string, fallback: string) {
  const s = value.toLowerCase().replace(/\W+/g, "-").replace(/^-|-$/g, "");
  return s || fallback;
}

const CONNECTED_VEHICLES = [
  {
    emoji: "🔋",
    label: "Tesla",
    hintKey: "tesla",
    url: (o: string, d: string) =>
      `https://www.tesla.com/tesla_account/trips?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "🅱️",
    label: "BMW iDrive",
    hintKey: "bmw",
    url: (_o: string, d: string) =>
      `https://www.bmw-connecteddrive.com/app/index.html#/send-to-car?destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "⭐",
    label: "Mercedes me",
    hintKey: "mercedes",
    url: (_o: string, d: string) =>
      `https://www.mercedes-benz.com/en/mercedes-me/?destination=${encodeURIComponent(d)}`,
  },
  {
    emoji: "📱",
    label: "Android Auto / CarPlay",
    hintKey: "phone",
    url: (o: string, d: string) =>
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}&travelmode=driving`,
  },
] as const;

export function RouteExportPanel({
  trip,
  origin,
  destination,
  locked = false,
  onLockedAction,
}: {
  trip: TripEstimate;
  origin: string;
  destination: string;
  /** Free-tier visitors: exports stay visible but open the paywall instead. */
  locked?: boolean;
  onLockedAction?: () => void;
}) {
  const t = useT();
  const from = origin || "Start";
  const to = destination || "Destination";
  const base = `autovere-${slug(`${origin}-${destination}`, "road-trip")}`;

  /** Wraps an export action: locked users get the paywall, not the file. */
  const guard = (action: () => void) => () => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    action();
  };

  const guardedLinkClick = (e: { preventDefault: () => void }) => {
    if (locked) {
      e.preventDefault();
      onLockedAction?.();
    }
  };

  const exportGpx = guard(() => {
    void trackEvent("export_gpx", { source: "export-panel" });
    downloadFile(buildTripGpx(trip, origin, destination), `${base}.gpx`, "application/gpx+xml");
    toast.success(t.export.gpxToast);
  });

  const exportKml = guard(() => {
    downloadFile(buildKml(trip, origin, destination), `${base}.kml`, "application/vnd.google-earth.kml+xml");
    toast.success(t.export.kmlToast);
  });

  const exportCsv = guard(() => {
    void trackEvent("export_csv", { source: "export-panel" });
    downloadFile(buildExpenseCsv(trip, origin, destination), `${base}.csv`, "text/csv;charset=utf-8");
  });

  const navLinks = [
    {
      emoji: "🗺️",
      label: t.export.google,
      href: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=driving`,
    },
    {
      emoji: "🍏",
      label: t.export.apple,
      href: `https://maps.apple.com/?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&dirflg=d`,
    },
    {
      emoji: "🚗",
      label: t.export.waze,
      href: `https://www.waze.com/ul?q=${encodeURIComponent(to)}&navigate=yes`,
    },
  ];

  const printItinerary = () => {
    void trackEvent("export_pdf", { source: "export-panel" });
    const rows = trip.segments
      .map(
        (s) => `
      <tr class="country"><td colspan="2">${escapeXml(s.country)}</td><td class="num">${escapeXml(money(trip.currency, s.total))}</td></tr>
      ${s.lines
        .map(
          (l) =>
            `<tr><td>${escapeXml(l.place)}</td><td>${escapeXml(l.detail)}</td><td class="num">${escapeXml(money(trip.currency, l.amount))}</td></tr>`,
        )
        .join("")}`,
      )
      .join("");
    const stops = trip.optimizer.stops
      .map(
        (s) =>
          `<li><strong>${escapeXml(s.name)}</strong> — ${escapeXml(s.atLabel)} · ${escapeXml(s.power)} · ${escapeXml(s.note)}</li>`,
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
<h2>Estimated ${trip.optimizer.mode === "ev" ? "charging" : "fuel"} stops</h2>
<ul>${stops || "<li>No mandatory stops on this leg — top up before departure.</li>"}</ul>
<footer>Indicative estimates only — verify with official portals before you travel. AutoVere by KM TECH LABS, Kristiansand, Norway.</footer>
</body></html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) {
      toast.error(t.export.popupError);
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  };

  return (
    <div data-tour="export-actions" className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Download className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">{t.export.title}</h3>
        {locked && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            🔒 Trip Pass / Pro
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        {t.export.intro}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="lg" className="font-semibold" onClick={exportGpx}>
          <Download className="size-4" /> {t.export.gpx}
        </Button>
        <Button size="lg" variant="secondary" onClick={exportKml}>
          <FileText className="size-4" /> {t.export.kml}
        </Button>
        <Button size="lg" variant="secondary" onClick={exportCsv}>
          <FileText className="size-4" /> {t.flow.expenseCsv}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {t.export.fileHint}
      </p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t.export.navTitle}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {navLinks.map((l) => (
            <Button key={l.label} asChild size="lg" variant="outline">
              <a href={l.href} target="_blank" rel="noopener noreferrer" onClick={guardedLinkClick}>
                <MapPin className="size-4" /> {l.emoji} {l.label}
                {locked && <Lock className="size-3.5 opacity-70" />}
              </a>
            </Button>
          ))}

          {locked ? (
            <Button size="lg" variant="outline" onClick={() => onLockedAction?.()}>
              <Send className="size-4" /> {t.export.sendToCar} <Lock className="size-3.5 opacity-70" />
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="lg" variant="outline">
                  <Send className="size-4" /> {t.export.sendToCar}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 space-y-1">
                <p className="px-1 pb-2 text-xs text-muted-foreground">
                  {t.export.handoffHint}
                </p>
                {CONNECTED_VEHICLES.map((v) => (
                  <a
                    key={v.label}
                    href={v.url(from, to)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => toast.success(t.export.handoffToast(v.label))}
                    className="flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-primary/10"
                  >
                    <span className="text-lg leading-none">{v.emoji}</span>
                    <span>
                      <span className="block text-sm font-semibold">{v.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.export.hints[v.hintKey]}</span>
                    </span>
                  </a>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button size="lg" variant="secondary" onClick={() => (locked ? onLockedAction?.() : printItinerary())}>
          <Printer className="size-4" /> {t.export.print}
          {locked && <Lock className="size-3.5 opacity-70" />}
        </Button>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Car className="size-3.5" /> {t.export.printHint}
        </span>
      </div>
    </div>
  );
}
