import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Loader2, MapPin, ArrowDownUp, Zap, Fuel, Clock, Euro,
  Route as RouteIcon, Calendar, ChevronDown, Info, TrendingDown,
} from "lucide-react";
import {
  DEFAULT_VEHICLE, VehicleProfile, computePlan, samplePath, formatDuration,
  addMinutes, formatTime, RoutePlan, TOLL_BY_COUNTRY, CountrySegment,
  CHARGING_NETWORKS, networkById, effectivePrice, ChargingNetworkId,
} from "@/lib/route-cost";
import { SendToCar } from "@/components/SendToCar";

// ─── Types ────────────────────────────────────────────────────────────
interface PhotonHit {
  label: string;
  lat: number;
  lon: number;
  country?: string;
  city?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────
const dotIcon = (color: string, size = 14) =>
  L.divIcon({
    className: "rp-dot",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,.4)"></div>`,
    iconSize: [size, size], iconAnchor: [size/2, size/2],
  });

const flagIcon = (label: string, color: string) =>
  L.divIcon({
    className: "rp-flag",
    html: `<div style="display:flex;align-items:center;gap:4px;background:${color};color:white;padding:3px 8px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.4)">${label}</div>`,
    iconSize: [60, 22], iconAnchor: [30, 11],
  });

async function photonSearch(q: string): Promise<PhotonHit[]> {
  if (q.trim().length < 2) return [];
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=en`;
  const r = await fetch(url);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.features ?? []).map((f: any) => {
    const p = f.properties ?? {};
    const [lon, lat] = f.geometry?.coordinates ?? [0, 0];
    const city = p.city ?? p.name ?? p.town ?? p.village ?? "";
    const parts = [p.name, p.city && p.city !== p.name ? p.city : null, p.state, p.country]
      .filter(Boolean);
    return { label: parts.join(", "), lat, lon, country: p.countrycode, city };
  });
}

async function reverseCountry(lat: number, lon: number): Promise<string | null> {
  try {
    const r = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=en`);
    if (!r.ok) return null;
    const j = await r.json();
    return j.features?.[0]?.properties?.countrycode?.toUpperCase() ?? null;
  } catch { return null; }
}

interface OsrmResult {
  distanceKm: number;
  durationMin: number;
  coords: [number, number][]; // lon,lat
}

async function osrmRoute(from: PhotonHit, to: PhotonHit): Promise<OsrmResult | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const route = j.routes?.[0];
  if (!route) return null;
  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    coords: route.geometry.coordinates,
  };
}

// ─── Autocomplete input ───────────────────────────────────────────────
function CityInput({
  value, setValue, placeholder, onPick,
}: { value: PhotonHit | null; setValue: (v: PhotonHit | null) => void; placeholder: string; onPick?: () => void }) {
  const [text, setText] = useState(value?.label ?? "");
  const [hits, setHits] = useState<PhotonHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tRef = useRef<number | null>(null);

  useEffect(() => { setText(value?.label ?? ""); }, [value]);

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    if (text.length < 2 || text === value?.label) { setHits([]); return; }
    setLoading(true);
    tRef.current = window.setTimeout(async () => {
      const res = await photonSearch(text);
      setHits(res);
      setOpen(true);
      setLoading(false);
    }, 250);
  }, [text, value?.label]);

  return (
    <div className="relative flex-1">
      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); setValue(null); }}
        onFocus={() => hits.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full bg-card border border-border/50 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-primary/50"
      />
      {loading && <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />}
      {open && hits.length > 0 && (
        <div className="absolute z-[1000] left-0 right-0 mt-1 glass border border-border/50 rounded-lg overflow-hidden shadow-elegant max-h-72 overflow-y-auto">
          {hits.map((h, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); setValue(h); setText(h.label); setOpen(false); onPick?.(); }}
              className="block w-full text-left px-3 py-2 text-xs hover:bg-accent/10 border-b border-border/20 last:border-b-0"
            >
              <span className="text-foreground">{h.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main planner ─────────────────────────────────────────────────────
export function RoutePlanner() {
  const [from, setFrom] = useState<PhotonHit | null>(null);
  const [to, setTo] = useState<PhotonHit | null>(null);
  const [departAt, setDepartAt] = useState<string>(() => {
    const d = new Date(); d.setMinutes(d.getMinutes() + 30 - (d.getMinutes() % 15));
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [vehicle, setVehicle] = useState<VehicleProfile>(DEFAULT_VEHICLE);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<OsrmResult | null>(null);
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [stopOverrides, setStopOverrides] = useState<Record<number, ChargingNetworkId>>({});

  // Reset per-stop overrides whenever a new plan is computed
  useEffect(() => { setStopOverrides({}); }, [plan]);

  // Apply per-stop network overrides to derive display stops + adjusted totals
  const displayStops = useMemo(() => {
    if (!plan) return [];
    return plan.stops.map((s) => {
      const overrideId = stopOverrides[s.index];
      if (!overrideId) return s;
      const net = networkById(overrideId);
      const price = effectivePrice(net, !!vehicle.hasMembership, vehicle.evPricePerKwh);
      return {
        ...s,
        networkId: net.id,
        networkName: net.name,
        pricePerKwh: Math.round(price * 100) / 100,
        cost: Math.round(s.energyKwh * price * 100) / 100,
      };
    });
  }, [plan, stopOverrides, vehicle.hasMembership, vehicle.evPricePerKwh]);

  const adjustedEvCost = useMemo(
    () => Math.round(displayStops.reduce((sum, s) => sum + s.cost, 0) * 100) / 100,
    [displayStops],
  );
  const adjustedTotalEv = useMemo(
    () => plan ? Math.round((adjustedEvCost + plan.tollEv) * 100) / 100 : 0,
    [adjustedEvCost, plan],
  );
  const adjustedSavings = useMemo(
    () => plan ? Math.round((plan.totalIce - adjustedTotalEv) * 100) / 100 : 0,
    [adjustedTotalEv, plan],
  );

  const swap = () => { setFrom(to); setTo(from); };

  const calculate = async () => {
    if (!from || !to) { setError("Velg både start og destinasjon"); return; }
    setLoading(true); setError(null); setRoute(null); setPlan(null);
    try {
      const r = await osrmRoute(from, to);
      if (!r) throw new Error("Fant ikke rute mellom disse byene");
      setRoute(r);

      // Sample 6 points along the route, reverse-geocode countries, build segments
      const samples = samplePath(r.coords, 6);
      const countries = await Promise.all(
        samples.map(([lon, lat]) => reverseCountry(lat, lon))
      );
      const segments: CountrySegment[] = [];
      const perSegmentKm = r.distanceKm / Math.max(1, samples.length - 1);
      for (let i = 0; i < samples.length - 1; i++) {
        const c = countries[i] ?? countries[i+1] ?? from.country?.toUpperCase() ?? "DE";
        const last = segments[segments.length - 1];
        if (last && last.country === c) last.km += perSegmentKm;
        else segments.push({ country: c, km: perSegmentKm });
      }

      const p = computePlan(r.distanceKm, r.durationMin, r.coords, segments, vehicle);
      setPlan(p);
    } catch (e: any) {
      setError(e?.message ?? "Klarte ikke beregne ruten");
    } finally {
      setLoading(false);
    }
  };

  const departureDate = useMemo(() => new Date(departAt), [departAt]);
  const arrivalDate = useMemo(() => plan ? addMinutes(departureDate, plan.totalMinutes) : null, [departureDate, plan]);

  const center: [number, number] = useMemo(() => {
    if (route?.coords?.length) {
      const mid = route.coords[Math.floor(route.coords.length / 2)];
      return [mid[1], mid[0]];
    }
    return [54, 10];
  }, [route]);

  const polyline = useMemo<[number, number][]>(
    () => route?.coords.map(([lon, lat]) => [lat, lon]) ?? [],
    [route]
  );

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="glass rounded-2xl border border-border/40 p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <CityInput value={from} setValue={setFrom} placeholder="Fra (by, adresse, land)" />
          <button
            onClick={swap}
            className="self-center p-2 rounded-lg border border-border/40 hover:bg-accent/10 transition-colors"
            aria-label="Bytt fra/til"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <CityInput value={to} setValue={setTo} placeholder="Til (by, adresse, land)" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1.5">Avreise</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="datetime-local"
                value={departAt}
                onChange={(e) => setDepartAt(e.target.value)}
                className="w-full bg-card border border-border/50 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={calculate}
              disabled={loading || !from || !to}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RouteIcon className="w-4 h-4" />}
              Beregn rute
            </button>
          </div>
        </div>

        {/* Charging network selector — always visible */}
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ladenettverk</label>
            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!vehicle.hasMembership}
                onChange={(e) => setVehicle({ ...vehicle, hasMembership: e.target.checked })}
                className="accent-cyan-400"
              />
              Jeg har medlemskap / abonnement
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CHARGING_NETWORKS.map((n) => {
              const active = (vehicle.network ?? "cheapest") === n.id;
              const price = effectivePrice(n, !!vehicle.hasMembership, vehicle.evPricePerKwh);
              return (
                <button
                  key={n.id}
                  onClick={() => setVehicle({ ...vehicle, network: n.id })}
                  className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                    active
                      ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_-4px_rgba(34,211,238,0.4)]"
                      : "bg-card/40 border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                  title={n.note}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: n.color }} />
                  {n.name}
                  {n.id !== "cheapest" && (
                    <span className="tabular-nums opacity-70">€{price.toFixed(2)}/kWh</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-muted-foreground mt-2">
            {networkById(vehicle.network).note}
            {vehicle.hasMembership && networkById(vehicle.network).memberPerKwh
              ? " · medlemspris brukt"
              : ""}
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Bil og priser <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border/30">
            <NumField label="EV forbruk (kWh/100km)" value={vehicle.evConsumptionKwhPer100} onChange={(v) => setVehicle({ ...vehicle, evConsumptionKwhPer100: v })} step={0.5} />
            <NumField label="EV rekkevidde (km)" value={vehicle.evRangeKm} onChange={(v) => setVehicle({ ...vehicle, evRangeKm: v })} step={10} />
            <NumField label="Egen strømpris (€/kWh)" value={vehicle.evPricePerKwh} onChange={(v) => setVehicle({ ...vehicle, evPricePerKwh: v })} step={0.05} />
            <NumField label="Lading per stopp (min)" value={vehicle.evChargeMinutesPerStop} onChange={(v) => setVehicle({ ...vehicle, evChargeMinutesPerStop: v })} step={5} />
            <NumField label="Diesel/bensin (L/100km)" value={vehicle.iceConsumptionLPer100} onChange={(v) => setVehicle({ ...vehicle, iceConsumptionLPer100: v })} step={0.5} />
            <NumField label="Drivstoffpris (€/L)" value={vehicle.icePricePerL} onChange={(v) => setVehicle({ ...vehicle, icePricePerL: v })} step={0.05} />
          </div>
        )}

        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</div>
        )}
      </div>

      {/* Results */}
      {plan && route && arrivalDate && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border/40 shadow-elegant">
              <MapContainer center={center} zoom={6} style={{ height: 480, width: "100%", background: "hsl(var(--background))" }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OSM &copy; CARTO · routing OSRM'
                />
                {polyline.length > 0 && (
                  <Polyline positions={polyline} pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.85 }} />
                )}
                {from && <Marker position={[from.lat, from.lon]} icon={flagIcon("Start", "#10b981")} />}
                {to && <Marker position={[to.lat, to.lon]} icon={flagIcon("Mål", "#ef4444")} />}
                {displayStops.map((s) => {
                  const net = networkById(s.networkId);
                  return (
                    <Marker key={s.index} position={[s.lat, s.lon]} icon={dotIcon(net.color, 16)}>
                      <Popup>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span className="inline-block w-2 h-2 rounded-full" style={{ background: net.color }} />
                            Ladestopp {s.index} · {s.networkName}
                          </div>
                          <div>~{s.approxKmFromStart} km · {s.energyKwh} kWh · {s.minutes} min</div>
                          <div>€ {s.cost.toFixed(2)} <span className="opacity-60">(€{s.pricePerKwh.toFixed(2)}/kWh)</span></div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <SummaryCard
                icon={<Clock className="w-4 h-4 text-cyan-400" />}
                label="Total reisetid"
                primary={formatDuration(plan.totalMinutes)}
                secondary={`${formatDuration(plan.drivingMinutes)} kjøring + ${formatDuration(plan.chargingMinutes)} lading`}
              />
              <SummaryCard
                icon={<Calendar className="w-4 h-4 text-violet-400" />}
                label="Avreise → ankomst"
                primary={formatTime(arrivalDate)}
                secondary={`Start ${formatTime(departureDate)}`}
              />
              <SummaryCard
                icon={<RouteIcon className="w-4 h-4 text-accent" />}
                label="Distanse"
                primary={`${plan.distanceKm.toLocaleString("nb-NO")} km`}
                secondary={`${plan.stops.length} ladestopp · ${plan.evEnergyKwh} kWh totalt`}
              />
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Du sparer på EV</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 tabular-nums">€ {adjustedSavings.toFixed(2)}</div>
                <div className="text-[11px] text-muted-foreground mt-1">vs samme tur med bensin/diesel</div>
              </div>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CostCard
              title="Elbil"
              icon={<Zap className="w-4 h-4 text-emerald-400" />}
              total={adjustedTotalEv}
              rows={[
                { label: `Lading (${plan.evEnergyKwh} kWh)`, value: adjustedEvCost },
                { label: "Bompenger (estimert)", value: plan.tollEv },
              ]}
              accent="emerald"
            />
            <CostCard
              title="Diesel/bensin"
              icon={<Fuel className="w-4 h-4 text-rose-400" />}
              total={plan.totalIce}
              rows={[
                { label: `Drivstoff (${plan.iceFuelL.toFixed(1)} L)`, value: plan.iceCost },
                { label: "Bompenger (estimert)", value: plan.tollIce },
              ]}
              accent="rose"
            />
          </div>

          {/* Toll breakdown */}
          {plan.tollBreakdown.length > 0 && (plan.tollEv > 0 || plan.tollIce > 0) && (
            <div className="glass rounded-2xl border border-border/40 p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Euro className="w-4 h-4 text-amber-400" /> Bompenger pr land
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {plan.tollBreakdown.map((b) => {
                  const note = TOLL_BY_COUNTRY[b.country]?.note;
                  return (
                    <div key={b.country} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-card/60 border border-border/30">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold">{b.country} <span className="text-muted-foreground font-normal">· {b.km} km</span></div>
                        {note && <div className="text-[10px] text-muted-foreground truncate">{note}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-400">€ {b.ev.toFixed(2)}</div>
                        <div className="text-[10px] text-muted-foreground line-through">€ {b.ice.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Charging stops */}
          {plan.stops.length > 0 && (
            <div className="glass rounded-2xl border border-border/40 p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Ladestopp på ruten
              </h3>
              <div className="space-y-2">
                {plan.stops.map((s) => {
                  const t = addMinutes(departureDate,
                    Math.round((plan.drivingMinutes * (s.approxKmFromStart / plan.distanceKm)) + (s.index - 1) * vehicle.evChargeMinutesPerStop)
                  );
                  return (
                    <div key={s.index} className="flex items-center gap-4 p-3 rounded-xl bg-card/60 border border-border/30">
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                        {s.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold flex items-center gap-2">
                          ~{s.approxKmFromStart} km fra start
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[10px] font-medium text-cyan-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {s.networkName}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Ankomst ca {formatTime(t)} · {s.energyKwh} kWh tilført · €{s.pricePerKwh.toFixed(2)}/kWh
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold tabular-nums">{s.minutes} min</div>
                        <div className="text-[10px] text-muted-foreground">€ {s.cost.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Send to car */}
          {from && to && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-accent/30 bg-accent/5">
              <div>
                <div className="text-sm font-semibold mb-0.5">Klar til å kjøre?</div>
                <div className="text-[11px] text-muted-foreground">Send hele ruten direkte til bilens navigasjon — Tesla, CarPlay, Android Auto eller Waze.</div>
              </div>
              <SendToCar
                from={{ label: from.label, lat: from.lat, lon: from.lon }}
                to={{ label: to.label, lat: to.lat, lon: to.lon }}
                stops={plan.stops.map((s) => ({ lat: s.lat, lon: s.lon }))}
              />
            </div>
          )}

          <div className="text-[10px] text-muted-foreground flex items-start gap-1.5">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>Alle priser er estimater basert på gjennomsnittlige bom-, strøm- og drivstoffpriser i Europa. Faktisk pris varierer med ladenettverk, tid på året og spesifikk rute. Justér tallene under "Bil og priser" for nøyaktigere beregning.</span>
          </div>
        </>
      )}
    </div>
  );
}

function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground block mb-1">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-card border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
      />
    </label>
  );
}

function SummaryCard({ icon, label, primary, secondary }: { icon: React.ReactNode; label: string; primary: string; secondary?: string }) {
  return (
    <div className="glass rounded-2xl border border-border/40 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold tabular-nums">{primary}</div>
      {secondary && <div className="text-[11px] text-muted-foreground mt-0.5">{secondary}</div>}
    </div>
  );
}

function CostCard({ title, icon, total, rows, accent }: {
  title: string; icon: React.ReactNode; total: number;
  rows: { label: string; value: number }[]; accent: "emerald" | "rose";
}) {
  const ring = accent === "emerald" ? "border-emerald-500/30" : "border-rose-500/30";
  const text = accent === "emerald" ? "text-emerald-400" : "text-rose-400";
  return (
    <div className={`rounded-2xl border ${ring} bg-card/40 p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${text}`}>€ {total.toFixed(2)}</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="tabular-nums">€ {r.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
