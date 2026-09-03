import { Fragment, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Download, MapPin, Printer, X } from "lucide-react";

import autovereLogo from "@/assets/autovere-logo.png";
import { Button } from "@/components/ui/button";
import { CURRENCY_BY_CODE, RATES_UPDATED, rateNote, useCurrency, useMoney } from "@/lib/currency";
import { CLEARANCE_ADVISORIES, detectLezZones, tagsForRegion } from "@/lib/compliance";
import { corridorPolyline, pointAt } from "@/lib/corridor-map";
import { buildTripGpx, downloadFile, tripFileBase } from "@/lib/trip-export";
import type { FuelKey, RegionKey, TripEstimate, VehicleKey } from "@/lib/trip-data";
import { useTr } from "@/lib/i18n";

const VEHICLE_LABEL: Record<VehicleKey, string> = {
  car: "🚗 Passenger car",
  motorhome: "🚐 Motorhome / campervan",
  motorcycle: "🏍️ Touring motorcycle",
};

const FUEL_LABEL: Record<FuelKey, string> = {
  petrol: "⛽ Petrol",
  diesel: "🛢️ Diesel",
  electric: "⚡ Electric (EV)",
};

function consumptionFor(vehicle: VehicleKey, fuel: FuelKey, units: "metric" | "imperial") {
  if (fuel === "electric") {
    const kwh = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
    return units === "imperial"
      ? `${(kwh / 1.60934).toFixed(0)} kWh / 100 mi`
      : `${kwh} kWh / 100 km`;
  }
  const l = vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  return units === "imperial" ? `${(235.215 / l).toFixed(1)} MPG (US)` : `${l.toFixed(1)} L / 100 km`;
}

/** Static, print-safe snapshot of the real routed polyline. */
function RouteSnapshot({
  seed,
  origin,
  destination,
  waypoints,
  coords,
}: {
  seed: string;
  origin: string;
  destination: string;
  waypoints: string[];
  coords: [number, number][];
}) {
  const tr = useTr();
  const line = useMemo(() => {
    if (coords.length > 3) {
      // Equirectangular projection of the real polyline into the 100x50 band.
      const lats = coords.map((c) => c[0]);
      const lngs = coords.map((c) => c[1]);
      const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const k = Math.cos((midLat * Math.PI) / 180);
      const xs = lngs.map((v) => v * k);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...lats);
      const maxY = Math.max(...lats);
      const spanX = maxX - minX || 1;
      const spanY = maxY - minY || 1;
      const scale = Math.min(88 / spanX, 38 / spanY);
      const offX = (100 - spanX * scale) / 2;
      const offY = (50 - spanY * scale) / 2;
      const step = Math.max(1, Math.ceil(coords.length / 240));
      return coords
        .filter((_, i) => i % step === 0 || i === coords.length - 1)
        .map((c) => ({
          x: offX + (c[1] * k - minX) * scale,
          y: 50 - (offY + (c[0] - minY) * scale),
        }));
    }
    return corridorPolyline(seed, 11).map((p) => ({ x: p.x, y: 5 + (p.y - 10) * 0.5 }));
  }, [coords, seed]);

  const path = line.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const start = line[0]!;
  const end = line[line.length - 1]!;
  const marks = waypoints.slice(0, 6).map((name, i) => {
    const idx = Math.round(((i + 1) / (Math.min(waypoints.length, 6) + 1)) * (line.length - 1));
    return { name, p: line[idx]! };
  });

  return (
    <figure className="print-map mt-3 overflow-hidden rounded-xl border border-border">
      <svg
        viewBox="0 0 100 50"
        className="h-auto w-full"
        role="img"
        aria-label={`Route corridor from ${origin} to ${destination}`}
      >
        <rect x="0" y="0" width="100" height="50" fill="#f4f6fb" />
        {[10, 20, 30, 40].map((v) => (
          <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke="#dde3ee" strokeWidth="0.25" />
        ))}
        {[20, 40, 60, 80].map((v) => (
          <line key={`v${v}`} x1={v} y1="0" x2={v} y2="50" stroke="#dde3ee" strokeWidth="0.25" />
        ))}
        <path d={path} fill="none" stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path} fill="none" stroke="#1d4ed8" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        {marks.map((mk) => (
          <circle key={mk.name} cx={mk.p.x} cy={mk.p.y} r="1.3" fill="#fff" stroke="#1d4ed8" strokeWidth="0.6" />
        ))}
        <circle cx={start.x} cy={start.y} r="1.9" fill="#16a34a" stroke="#fff" strokeWidth="0.6" />
        <circle cx={end.x} cy={end.y} r="1.9" fill="#dc2626" stroke="#fff" strokeWidth="0.6" />
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <span>🟢 {origin || tr("Start")}</span>
        <span>🔵 {marks.length} {tr("intermediate checkpoints")}</span>
        <span>🔴 {destination || tr("Destination")}</span>
      </figcaption>
    </figure>
  );
}

/** Google's encoded-polyline algorithm — needed for the Static Maps URL. */
function encodePolyline(coords: [number, number][]) {
  let lastLat = 0;
  let lastLng = 0;
  let out = "";
  const enc = (v: number) => {
    let val = v < 0 ? ~(v << 1) : v << 1;
    let chunk = "";
    while (val >= 0x20) {
      chunk += String.fromCharCode((0x20 | (val & 0x1f)) + 63);
      val >>= 5;
    }
    chunk += String.fromCharCode(val + 63);
    return chunk;
  };
  for (const [lat, lng] of coords) {
    const la = Math.round(lat * 1e5);
    const ln = Math.round(lng * 1e5);
    out += enc(la - lastLat) + enc(ln - lastLng);
    lastLat = la;
    lastLng = ln;
  }
  return out;
}

/** Sharp raster map for the printed dossier — canvas maps print blank. */
function staticMapUrl(coords: [number, number][]) {
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
  if (!key || coords.length < 2) return "";
  const step = Math.max(1, Math.ceil(coords.length / 90));
  const thin = coords.filter((_, i) => i % step === 0 || i === coords.length - 1);
  const start = thin[0]!;
  const end = thin[thin.length - 1]!;
  const params = new URLSearchParams({
    size: "640x320",
    scale: "2",
    maptype: "roadmap",
    format: "png",
    key,
  });
  params.append("path", `weight:4|color:0x1d4ed8ff|enc:${encodePolyline(thin)}`);
  params.append("markers", `color:0x16a34a|label:A|${start[0].toFixed(5)},${start[1].toFixed(5)}`);
  params.append("markers", `color:0xdc2626|label:B|${end[0].toFixed(5)},${end[1].toFixed(5)}`);
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function QrPanel({ url }: { url: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let alive = true;
    void import("qrcode").then(async (mod) => {
      const out = await mod.default.toString(url, {
        type: "svg",
        margin: 1,
        width: 132,
        color: { dark: "#0a0f1d", light: "#ffffff" },
      });
      if (alive) setSvg(out);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  if (!svg) return <div className="size-[132px] rounded-lg border border-border" aria-hidden />;
  return (
    <div
      className="size-[132px] shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1"
      aria-label="QR code to the live route on autovere.com"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function PrintItinerary({
  trip,
  origin,
  destination,
  vehicle,
  fuel,
  region = "eu",
  onClose,
}: {
  trip: TripEstimate;
  origin: string;
  destination: string;
  vehicle: VehicleKey;
  fuel: FuelKey;
  region?: RegionKey;
  onClose: () => void;
}) {
  const tr = useTr();
  const m = useMoney(trip.currency);
  const { currency } = useCurrency();
  const display = CURRENCY_BY_CODE[currency];

  const imperial = trip.units === "imperial";
  const distanceValue = imperial ? trip.distanceKm / 1.60934 : trip.distanceKm;
  const perUnit = distanceValue > 0 ? trip.budget / distanceValue : 0;
  const unitLabel = imperial ? "mile" : "km";

  const title = `${origin || tr("Your start")} → ${destination || tr("Your destination")}`;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const liveUrl = useMemo(() => {
    const params = new URLSearchParams({
      from: origin || "",
      to: destination || "",
      vehicle,
      fuel,
      route: trip.variant,
    });
    const base =
      typeof window === "undefined"
        ? "https://www.autovere.com"
        : `${window.location.origin}${window.location.pathname}`;
    return `${base}?${params.toString()}`;
  }, [origin, destination, vehicle, fuel, trip.variant]);

  const navGoogle = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin || "")}&destination=${encodeURIComponent(destination || "")}&travelmode=driving`;
  const navApple = `https://maps.apple.com/?saddr=${encodeURIComponent(origin || "")}&daddr=${encodeURIComponent(destination || "")}&dirflg=d`;

  const checkpoints = trip.segments.flatMap((s) => s.lines.map((l) => l.place));
  const portals = trip.segments
    .flatMap((s) => s.lines.filter((l) => l.portal).map((l) => ({ country: s.country, line: l })))
    .slice(0, 12);
  const tags = tagsForRegion(region);
  const lez = vehicle === "motorhome" ? detectLezZones(region, origin, destination).matched : [];

  const corridor = trip.corridor;
  const legs = trip.segments.map((segment, i) => {
    // Real per-country distance when the routed corridor resolved; otherwise
    // an even share of the indicative estimate.
    const real = corridor?.countries.find((c) => segment.country.includes(c.country));
    const share = trip.segments.length ? 1 / trip.segments.length : 1;
    const legDistance = distanceValue * share;
    return {
      index: i + 1,
      country: segment.country,
      distance:
        real?.distanceLabel ??
        `${legDistance.toLocaleString("en-GB", { maximumFractionDigits: 0 })} ${imperial ? "mi" : "km"}`,
      cost: m.fmt(segment.total),
      checkpoints: segment.lines.map((l) => l.place).join(" · ") || tr("No barrier stops"),
      border:
        corridor?.borders[i] ??
        (corridor
          ? tr("Arrival")
          : i < trip.segments.length - 1
            ? `${segment.country} → ${trip.segments[i + 1]!.country}`
            : tr("Arrival")),
    };
  });


  const downloadGpx = () => {
    downloadFile(
      buildTripGpx(trip, origin, destination),
      `${tripFileBase(origin, destination)}.gpx`,
      "application/gpx+xml",
    );
  };

  const overlay = (
    <div className="print-portal fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur-sm print:static print:overflow-visible print:bg-transparent print:p-0 print:backdrop-blur-none">
      <div className="print-sheet glass-panel mx-auto my-6 w-full max-w-3xl rounded-2xl p-6 sm:p-8">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {tr("PDF export preview")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> {tr("Download PDF / Print")}
            </Button>
            <Button size="sm" variant="secondary" onClick={downloadGpx}>
              <Download className="size-4" /> GPX
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="size-4" /> {tr("Close")}
            </Button>
          </div>
        </div>

        <header className="print-block border-b border-border pb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={autovereLogo} alt="AutoVere" width={28} height={28} className="size-7 rounded-md" />
              <p className="text-lg font-semibold tracking-tight">
                Auto<span className="text-primary">Vere</span>{" "}
                <span className="font-normal text-foreground/70">{tr("Road Trip Dossier")}</span>
              </p>
            </div>
            <div className="text-right text-[11px] leading-5 text-foreground/70">
              <p>{date}</p>
              <p>
                {tr("Trip ref")}: <span className="font-semibold">{tripRef}</span>
              </p>
              <p className="font-semibold">
                {tr("Currency")}: {display.code}
              </p>
            </div>
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-foreground/70">
            {tr("Road trip cost itinerary")} · {tr("Prepared")} {date} · {tr("All figures in")} {display.code} ({display.label})
          </p>
          <dl className="mt-3 grid grid-cols-4 gap-2">
            {(
              [
                [tr("Distance"), trip.distanceLabel],
                [tr("Driving time"), trip.driveTime],
                [tr("Total cost"), m.fmt(trip.budget, 0)],
                [`${tr("Per")} ${unitLabel}`, m.fmt(perUnit, 2)],
                [tr("Tolls & vignettes"), m.fmt(trip.tolls)],
                [tr("Ferries & passes"), m.fmt(trip.ferries)],
                [tr(trip.energyLabel), m.fmt(trip.energyCost)],
                [tr("Energy used"), trip.energyAmount],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border px-3 py-2">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-0.5 text-base font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="print-block mt-6">
          <h2 className="print-h2">{tr("Route corridor snapshot")}</h2>
          {staticMap && !mapFailed ? (
            <img
              src={staticMap}
              onError={() => setMapFailed(true)}
              alt={`${origin} → ${destination}`}
              className="print-map mt-3 h-[320px] w-full rounded-xl border border-border object-cover"
            />
          ) : (
            <RouteSnapshot
              seed={`${origin}-${destination}-${trip.variant}`}
              origin={origin}
              destination={destination}
              waypoints={checkpoints}
              coords={trip.corridor?.coords ?? []}
            />
          )}
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">{tr("Vehicle profile")}</h2>
          <table className="print-table mt-3 w-full text-sm">
            <tbody>
              <tr>
                <th scope="row">{tr("Vehicle")}</th>
                <td>{tr(VEHICLE_LABEL[vehicle])}</td>
              </tr>
              <tr>
                <th scope="row">{tr("Fuel / power")}</th>
                <td>{tr(FUEL_LABEL[fuel])}</td>
              </tr>
              <tr>
                <th scope="row">{tr("Consumption")}</th>
                <td>{consumptionFor(vehicle, fuel, trip.units)}</td>
              </tr>
              <tr>
                <th scope="row">{tr("Units")}</th>
                <td>{tr(imperial ? "Imperial — miles, MPG, $/gal" : "Metric — km, L/100 km, price per litre")}</td>
              </tr>
              <tr>
                <th scope="row">{tr("Route profile")}</th>
                <td className="capitalize">
                  {tr(trip.variant)} · {tr(trip.tripType === "return" ? "Return trip" : "One-way")}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">{tr("Cost intelligence — country & state breakdown")}</h2>
          <table className="print-table mt-3 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className="text-left">{tr("Country")}</th>
                <th scope="col" className="text-left">{tr("Distance & checkpoints")}</th>
                <th scope="col" className="text-right">{tr("Local")}</th>
                <th scope="col" className="text-right">{display.code}</th>
              </tr>
            </thead>
            <tbody>
              {trip.segments.map((segment) => {
                const real = corridor?.countries.find((c) => segment.country.includes(c.country));
                const nat = m.native(segment.total, segment.country);
                return (
                  <tr key={segment.country}>
                    <td className="font-semibold">{segment.country}</td>
                    <td className="text-foreground/70">
                      {real?.distanceLabel ? `${real.distanceLabel} · ` : ""}
                      {segment.lines.map((l) => l.place).join(" · ") || tr("No barrier stops")}
                    </td>
                    <td className="text-right">{nat.text}</td>
                    <td className="text-right font-semibold">{m.fmt(segment.total)}</td>
                  </tr>
                );
              })}
              <tr className="print-total-row">
                <td colSpan={3} className="font-semibold">{tr("Total tolls, vignettes & ferries")}</td>
                <td className="text-right font-semibold">{m.fmt(trip.tolls + trip.ferries)}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            {tr("Local column shows the currency actually charged at the barrier.")} {RATES_UPDATED}
          </p>
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">⚠️ {tr("Vignette & toll pass checklist")}</h2>
          <p className="mt-2 text-sm text-foreground/75">
            {tr(
              "Buy these before you cross the border — on-the-spot fines apply in Austria, Switzerland, Slovenia and Czechia, and Ontario's 407 ETR bills unregistered plates at a premium.",
            )}
          </p>
          <ul className="mt-3 grid gap-2 text-sm">
            {trip.vignette?.items.map((v) => (
              <li key={v.code} className="print-block rounded-lg border border-border px-3 py-2">
                <span className="font-semibold">☐ {v.flag} {v.country}</span> — {v.system}:{" "}
                {v.exempt ? tr("Exempt for this vehicle") : `${v.currency}${v.cost.toFixed(2)} · ${v.recommendation}`}
              </li>
            ))}
            {portals.map(({ country, line }) => (
              <li key={`${country}-${line.place}`} className="print-block rounded-lg border border-border px-3 py-2">
                <span className="font-semibold">☐ {line.place}</span> — {line.detail}
                {line.portal && (
                  <span className="block text-xs text-muted-foreground">
                    {tr("Official portal")}: {line.portal.label} —{" "}
                    <a href={line.portal.url} target="_blank" rel="noopener noreferrer">
                      {line.portal.url}
                    </a>
                  </span>
                )}
              </li>
            ))}
            {tags.map((tag) => (
              <li key={tag.id} className="print-block rounded-lg border border-border px-3 py-2">
                <span className="font-semibold">☐ {tag.emoji} {tag.label}</span> — {tag.scope}.{" "}
                <span className="text-xs text-muted-foreground">
                  {tag.portalLabel} — {tag.portalUrl}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">
            {vehicle === "motorhome"
              ? `🚐 ${tr("Motorhome advisories — clearance, weight & low-emission zones")}`
              : vehicle === "motorcycle"
                ? `🏍️ ${tr("Rider advisories — surface, weather & safety radar")}`
                : fuel === "electric"
                  ? `⚡ ${tr("EV advisories — charging intervals & networks")}`
                  : `🚗 ${tr("Driver advisories")}`}
          </h2>

          {vehicle === "motorhome" && (
            <div className="mt-3 grid gap-3 text-sm">
              {CLEARANCE_ADVISORIES.map((a) => (
                <div key={a.id} className="print-block rounded-lg border border-border px-3 py-2">
                  <p className="font-semibold">
                    {a.emoji} {a.title}
                    {a.triggerHeight ? ` — critical above ${a.triggerHeight.toFixed(1)} m` : ""}
                  </p>
                  <p className="mt-1 text-foreground/80">{a.body}</p>
                </div>
              ))}
              {lez.map((z) => (
                <div key={z.id} className="print-block rounded-lg border border-border px-3 py-2">
                  <p className="font-semibold">{z.flag} {z.country} — {z.scheme}</p>
                  <p className="mt-1 text-foreground/80">
                    {z.requirement} · {z.cost} · lead time {z.leadTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cities: {z.cities.join(", ")} · {z.portalLabel} — {z.portalUrl}
                  </p>
                </div>
              ))}
            </div>
          )}

          {(vehicle !== "motorhome" || trip.safety.sections.length > 0) && (
            <div className="mt-3 grid gap-4 text-sm">
              {trip.safety.sections.map((sec) => (
                <div key={sec.heading} className="print-block">
                  <p className="font-semibold">{sec.heading}</p>
                  <ul className="mt-1 list-disc pl-5">
                    {sec.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">
            {trip.optimizer.mode === "ev"
              ? `⚡ ${tr("Recommended charging intervals")}`
              : `⛽ ${tr("Recommended fuel stops")}`}
          </h2>
          <p className="mt-2 text-sm text-foreground/75">
            {trip.optimizer.rangeLabel} · {trip.optimizer.bufferLabel}
          </p>
          <table className="print-table mt-3 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className="text-left">#</th>
                <th scope="col" className="text-left">{tr("Stop")}</th>
                <th scope="col" className="text-left">{tr("At")}</th>
                <th scope="col" className="text-left">{tr("Power / network")}</th>
              </tr>
            </thead>
            <tbody>
              {trip.optimizer.stops.map((s, i) => (
                <tr key={`${s.name}-${i}`} className={s.preferred ? "font-semibold" : undefined}>
                  <td>{i + 1}</td>
                  <td className="font-medium">
                    {s.preferred ? "⭐ " : ""}
                    {s.name}
                  </td>
                  <td>{s.atLabel}</td>
                  <td>
                    {s.power}
                    {s.networks.length ? ` · ${s.networks.join(", ")}` : ""}
                    {s.fallback ? ` · ${tr("nearest high-power CCS hub")}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trip.optimizer.preferredNetwork && (
            <p className="mt-2 text-xs font-semibold">
              ⭐ {tr("Preferred network")}: {trip.optimizer.preferredNetwork}
            </p>
          )}
          {trip.optimizer.networks.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {tr("Networks on this corridor")}: {trip.optimizer.networks.join(" · ")}
            </p>
          )}
        </section>

        <section className="print-block mt-6">
          <h2 className="print-h2">{tr("Step-by-step itinerary & border crossings")}</h2>
          <ol className="mt-3 grid gap-3 text-sm">
            {legs.map((leg) => (
              <li key={leg.country} className="print-block rounded-lg border border-border px-3 py-2">
                <p className="font-semibold">
                  {tr("Leg")} {leg.index} · {leg.country} — {leg.distance} · {leg.cost}
                </p>
                <p className="mt-1 text-foreground/80">{tr("Checkpoints")}: {leg.checkpoints}</p>
                <p className="text-xs text-muted-foreground">{tr("Crossing")}: {leg.border}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="print-block mt-6 border-t border-border pt-5">
          <h2 className="print-h2">{tr("Live route & navigation")}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <QrPanel url={liveUrl} />
            <div className="min-w-[220px] flex-1 text-sm">
              <p className="font-semibold">{tr("Scan to reopen this route on autovere.com")}</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{liveUrl}</p>
              <div className="no-print mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={navGoogle} target="_blank" rel="noopener noreferrer">
                    <MapPin className="size-4" /> {tr("Open in Google Maps")}
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={navApple} target="_blank" rel="noopener noreferrer">
                    <MapPin className="size-4" /> {tr("Open in Apple Maps")}
                  </a>
                </Button>
                <Button size="sm" variant="secondary" onClick={downloadGpx}>
                  <Download className="size-4" /> {tr("GPX file")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="print-block mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          AutoVere · autovere.com — {tr("indicative planning estimates.")}{" "}
          {rateNote(m.base, currency) || tr("Base currency shown.")}{" "}
          {tr("Verify final prices with the official toll, vignette and ferry operators before travelling.")}
        </footer>
      </div>
    </div>
  );

  return typeof document === "undefined" ? overlay : createPortal(overlay, document.body);
}
