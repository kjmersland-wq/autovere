import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";

/* ────────────────────────────────────────────────────────────────────── */
/* Network catalog — name match (case-insensitive substring on Operator)  */
/* ────────────────────────────────────────────────────────────────────── */

export const NETWORKS = [
  { id: "tesla",     label: "Tesla",         match: ["tesla"],                              color: "#ef4444" },
  { id: "ionity",    label: "Ionity",        match: ["ionity"],                             color: "#3b82f6" },
  { id: "fastned",   label: "Fastned",       match: ["fastned"],                            color: "#facc15" },
  { id: "allego",    label: "Allego",        match: ["allego"],                             color: "#a855f7" },
  { id: "recharge",  label: "Recharge / Mer",match: ["recharge", "mer "],                   color: "#10b981" },
  { id: "shell",     label: "Shell Recharge",match: ["shell", "newmotion"],                 color: "#eab308" },
  { id: "circlek",   label: "Circle K",      match: ["circle k", "circlek"],                color: "#f97316" },
  { id: "bp",        label: "BP Pulse",      match: ["bp pulse", "bp chargemaster"],        color: "#22c55e" },
  { id: "chargepoint",label:"ChargePoint",   match: ["chargepoint"],                        color: "#06b6d4" },
  { id: "engie",     label: "Engie",         match: ["engie"],                              color: "#0ea5e9" },
  { id: "eon",       label: "E.ON Drive",    match: ["e.on", "eon"],                        color: "#dc2626" },
  { id: "vattenfall",label: "Vattenfall",    match: ["vattenfall"],                         color: "#0284c7" },
  { id: "totalenergies",label:"TotalEnergies",match:["total"],                              color: "#e11d48" },
] as const;

const OTHER_COLOR = "#9ca3af";

function networkFor(operatorTitle: string): { id: string; color: string } | null {
  const t = operatorTitle?.toLowerCase() ?? "";
  for (const n of NETWORKS) {
    if (n.match.some((m) => t.includes(m))) return { id: n.id, color: n.color };
  }
  return null;
}

/* ────────────────────────────────────────────────────────────────────── */
/* European countries — ISO codes + bbox [south, west, north, east]       */
/* ────────────────────────────────────────────────────────────────────── */

export const EU_COUNTRIES: { code: string; name: string; bbox: [number, number, number, number] }[] = [
  { code: "NO", name: "Norway",         bbox: [57.9, 4.0, 71.2, 31.5] },
  { code: "SE", name: "Sweden",         bbox: [55.0, 10.5, 69.1, 24.2] },
  { code: "DK", name: "Denmark",        bbox: [54.5, 8.0, 57.8, 12.7] },
  { code: "FI", name: "Finland",        bbox: [59.5, 19.5, 70.1, 31.6] },
  { code: "IS", name: "Iceland",        bbox: [63.3, -24.5, 66.6, -13.4] },
  { code: "DE", name: "Germany",        bbox: [47.2, 5.8, 55.1, 15.1] },
  { code: "FR", name: "France",         bbox: [41.3, -5.2, 51.1, 9.6] },
  { code: "GB", name: "United Kingdom", bbox: [49.8, -8.6, 60.9, 1.8] },
  { code: "IE", name: "Ireland",        bbox: [51.4, -10.7, 55.4, -5.9] },
  { code: "NL", name: "Netherlands",    bbox: [50.7, 3.3, 53.6, 7.2] },
  { code: "BE", name: "Belgium",        bbox: [49.5, 2.5, 51.5, 6.4] },
  { code: "LU", name: "Luxembourg",     bbox: [49.4, 5.7, 50.2, 6.5] },
  { code: "CH", name: "Switzerland",    bbox: [45.8, 5.9, 47.8, 10.5] },
  { code: "AT", name: "Austria",        bbox: [46.4, 9.5, 49.0, 17.2] },
  { code: "IT", name: "Italy",          bbox: [36.6, 6.6, 47.1, 18.5] },
  { code: "ES", name: "Spain",          bbox: [35.9, -9.3, 43.8, 4.3] },
  { code: "PT", name: "Portugal",       bbox: [36.9, -9.5, 42.2, -6.2] },
  { code: "PL", name: "Poland",         bbox: [49.0, 14.1, 54.8, 24.2] },
  { code: "CZ", name: "Czechia",        bbox: [48.5, 12.1, 51.1, 18.9] },
  { code: "SK", name: "Slovakia",       bbox: [47.7, 16.8, 49.6, 22.6] },
  { code: "HU", name: "Hungary",        bbox: [45.7, 16.1, 48.6, 22.9] },
  { code: "RO", name: "Romania",        bbox: [43.6, 20.2, 48.3, 29.7] },
  { code: "BG", name: "Bulgaria",       bbox: [41.2, 22.4, 44.2, 28.6] },
  { code: "GR", name: "Greece",         bbox: [34.8, 19.4, 41.7, 28.2] },
  { code: "HR", name: "Croatia",        bbox: [42.4, 13.5, 46.6, 19.4] },
  { code: "SI", name: "Slovenia",       bbox: [45.4, 13.4, 46.9, 16.6] },
  { code: "EE", name: "Estonia",        bbox: [57.5, 21.8, 59.7, 28.2] },
  { code: "LV", name: "Latvia",         bbox: [55.7, 20.9, 58.1, 28.2] },
  { code: "LT", name: "Lithuania",      bbox: [53.9, 20.9, 56.5, 26.9] },
];

const EUROPE_BBOX: [number, number, number, number] = [34, -25, 71, 35];

/* ────────────────────────────────────────────────────────────────────── */
/* OpenChargeMap fetch                                                    */
/* ────────────────────────────────────────────────────────────────────── */

interface POI {
  ID: number;
  AddressInfo?: { Title?: string; AddressLine1?: string; Town?: string; Country?: { Title?: string }; Latitude: number; Longitude: number };
  OperatorInfo?: { Title?: string };
  Connections?: { PowerKW?: number; ConnectionType?: { Title?: string } }[];
  NumberOfPoints?: number;
}

async function fetchPOIs(opts: { country?: string; bbox?: [number, number, number, number]; max: number }): Promise<POI[]> {
  const params: Record<string, string> = { maxresults: String(opts.max) };
  if (opts.country) params.countrycode = opts.country;
  if (opts.bbox) params.boundingbox = `(${opts.bbox[0]},${opts.bbox[1]}),(${opts.bbox[2]},${opts.bbox[3]})`;
  const qs = new URLSearchParams(params).toString();
  const { data, error } = await supabase.functions.invoke(`ocm-proxy?${qs}`, { method: "GET" });
  if (error) throw new Error(error.message);
  return (data as POI[]) ?? [];
}

/* ────────────────────────────────────────────────────────────────────── */
/* Map helpers                                                            */
/* ────────────────────────────────────────────────────────────────────── */

function FlyTo({ bbox }: { bbox: [number, number, number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyToBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
      { duration: 1.0, padding: [20, 20] }
    );
  }, [bbox, map]);
  return null;
}

function BoundsWatcher({ onChange }: { onChange: (b: [number, number, number, number]) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onChange([b.getSouth(), b.getWest(), b.getNorth(), b.getEast()]);
    },
  });
  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getSouth(), b.getWest(), b.getNorth(), b.getEast()]);
  }, [map, onChange]);
  return null;
}

function dotIcon(color: string, size = 14) {
  return L.divIcon({
    className: "ocm-dot",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="
      display:block;width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      box-shadow:0 0 0 2px hsl(var(--background)),0 0 12px ${color}55;
      "></span>`,
  });
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                              */
/* ────────────────────────────────────────────────────────────────────── */

export function EuropeChargingMap() {
  const { resolvedTheme } = useTheme();
  const [country, setCountry] = useState<string>("");           // "" = all Europe
  const [activeNetworks, setActiveNetworks] = useState<Set<string>>(new Set()); // empty = all
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bbox, setBbox] = useState<[number, number, number, number]>(EUROPE_BBOX);
  const fetchSeq = useRef(0);

  // Refetch on country change
  useEffect(() => {
    const seq = ++fetchSeq.current;
    setLoading(true);
    setError(null);
    const opts = country
      ? { country, max: 2000 }
      : { bbox, max: 1500 };
    fetchPOIs(opts)
      .then((data) => { if (seq === fetchSeq.current) setPois(data); })
      .catch((e) => { if (seq === fetchSeq.current) setError(e.message ?? "Could not load stations"); })
      .finally(() => { if (seq === fetchSeq.current) setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // When user pans map without a country selected, refetch with bbox (debounced)
  useEffect(() => {
    if (country) return;
    const t = setTimeout(() => {
      const seq = ++fetchSeq.current;
      setLoading(true);
      fetchPOIs({ bbox, max: 1500 })
        .then((data) => { if (seq === fetchSeq.current) setPois(data); })
        .catch(() => {})
        .finally(() => { if (seq === fetchSeq.current) setLoading(false); });
    }, 600);
    return () => clearTimeout(t);
  }, [bbox, country]);

  const filtered = useMemo(() => {
    if (activeNetworks.size === 0) return pois;
    return pois.filter((p) => {
      const n = networkFor(p.OperatorInfo?.Title ?? "");
      return n && activeNetworks.has(n.id);
    });
  }, [pois, activeNetworks]);

  // Counts per network for the chip badges
  const counts = useMemo(() => {
    const c: Record<string, number> = { _other: 0 };
    NETWORKS.forEach((n) => (c[n.id] = 0));
    pois.forEach((p) => {
      const n = networkFor(p.OperatorInfo?.Title ?? "");
      if (n) c[n.id]++; else c._other++;
    });
    return c;
  }, [pois]);

  const targetBbox: [number, number, number, number] | null = useMemo(() => {
    if (!country) return EUROPE_BBOX;
    return EU_COUNTRIES.find((c) => c.code === country)?.bbox ?? null;
  }, [country]);

  const isDark = resolvedTheme !== "light";
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const toggleNetwork = (id: string) => {
    setActiveNetworks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass rounded-2xl border border-border/40 p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-card border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
          >
            <option value="">All Europe (visible area)</option>
            {EU_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            {loading && <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading…</span>}
            <span><span className="text-foreground font-medium">{filtered.length}</span> stations shown</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveNetworks(new Set())}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeNetworks.size === 0
                ? "bg-primary/20 border-primary/50 text-primary"
                : "glass border-border/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            All networks ({pois.length})
          </button>
          {NETWORKS.map((n) => {
            const active = activeNetworks.has(n.id);
            const count = counts[n.id] ?? 0;
            return (
              <button
                key={n.id}
                onClick={() => toggleNetwork(n.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "glass border-border/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: n.color }} />
                {n.label}
                <span className="opacity-60 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-elegant">
        <MapContainer
          center={[54, 10]}
          zoom={4}
          minZoom={3}
          maxZoom={18}
          scrollWheelZoom
          worldCopyJump
          style={{ height: "min(75vh, 720px)", width: "100%", background: "hsl(var(--background))" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · stations from <a href="https://openchargemap.org">OpenChargeMap</a>'
            url={tileUrl}
          />
          {targetBbox && <FlyTo bbox={targetBbox} />}
          <BoundsWatcher onChange={setBbox} />
          {filtered.map((p) => {
            if (!p.AddressInfo) return null;
            const n = networkFor(p.OperatorInfo?.Title ?? "");
            const color = n?.color ?? OTHER_COLOR;
            const maxKw = Math.max(0, ...(p.Connections?.map((c) => c.PowerKW ?? 0) ?? []));
            return (
              <Marker
                key={p.ID}
                position={[p.AddressInfo.Latitude, p.AddressInfo.Longitude]}
                icon={dotIcon(color, maxKw >= 150 ? 16 : 12)}
              >
                <Popup>
                  <div className="text-[13px] leading-snug" style={{ minWidth: 220 }}>
                    <div className="font-semibold mb-1">{p.AddressInfo.Title || "Charging point"}</div>
                    {p.OperatorInfo?.Title && (
                      <div className="flex items-center gap-1.5 text-xs mb-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
                        {p.OperatorInfo.Title}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                      <MapPin className="w-3 h-3" />
                      {[p.AddressInfo.AddressLine1, p.AddressInfo.Town, p.AddressInfo.Country?.Title].filter(Boolean).join(", ")}
                    </div>
                    {maxKw > 0 && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Zap className="w-3 h-3" />
                        Up to <strong>{maxKw} kW</strong>
                        {p.NumberOfPoints ? <> · {p.NumberOfPoints} points</> : null}
                      </div>
                    )}
                    {p.Connections && p.Connections.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Array.from(new Set(p.Connections.map((c) => c.ConnectionType?.Title).filter(Boolean))).slice(0, 4).map((t) => (
                          <span key={t as string} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {error && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass border border-destructive/40 text-destructive text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
