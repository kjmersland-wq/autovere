import { useEffect, useMemo, useRef, useState } from "react";
import { Layers3, MapPin, Radio } from "lucide-react";
import { CHARGING_PROVIDER_META, type ChargingProvider, type ChargingStation } from "@/data/ev-charging";

type MapViewport = { lat: number; lng: number; distanceKm: number; zoom: number };

interface GoogleChargingMapProps {
  stations: ChargingStation[];
  selectedId: number;
  countryName: string;
  isLoading: boolean;
  isFallback: boolean;
  onSelect: (id: number) => void;
  onViewportChange: (viewport: MapViewport) => void;
  countryCenter: { lat: number; lng: number };
}

interface GoogleLatLngLike {
  lat: () => number;
  lng: () => number;
}

interface GoogleBoundsLike {
  getNorthEast: () => GoogleLatLngLike;
  getSouthWest: () => GoogleLatLngLike;
}

interface GoogleMapLike {
  getCenter: () => GoogleLatLngLike | null;
  getBounds: () => GoogleBoundsLike | null;
  getZoom: () => number | undefined;
  setCenter: (coords: { lat: number; lng: number }) => void;
  panTo: (coords: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  addListener: (eventName: string, handler: () => void) => { remove: () => void };
}

interface GoogleMarkerLike {
  setMap: (map: GoogleMapLike | null) => void;
  addListener: (eventName: string, handler: () => void) => { remove: () => void };
}

interface GoogleMapsLike {
  maps: {
    Map: new (el: HTMLElement, options: Record<string, unknown>) => GoogleMapLike;
    Marker: new (options: Record<string, unknown>) => GoogleMarkerLike;
    SymbolPath: { CIRCLE: number };
    Size: new (width: number, height: number) => unknown;
    event: { clearInstanceListeners: (instance: unknown) => void };
  };
}

const GOOGLE_SCRIPT_ID = "autovere-google-maps-script";
const FALLBACK_DISTANCE_KM = 140;

const PROVIDER_MARKER_COLORS: Record<string, string> = {
  Tesla: "#ef4444",
  Ionity: "#60a5fa",
  Recharge: "#34d399",
  "Circle K": "#fb923c",
  Eviny: "#22d3ee",
  "Uno-X": "#facc15",
  Mer: "#d946ef",
  Kople: "#a78bfa",
  Fastned: "#fcd34d",
  Allego: "#a3e635",
  "E.ON": "#2dd4bf",
  "Shell Recharge": "#fdba74",
  Other: "#94a3b8",
};

const DARK_CINEMATIC_MAP_STYLE: Array<Record<string, unknown>> = [
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8aa0b8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1220" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1f3346" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#111a2a" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7189a3" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c2a3d" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#233a55" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#162335" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050d18" }] },
];

type ClusterPoint = {
  id: string;
  lat: number;
  lng: number;
  count: number;
  stationIds: number[];
  provider: ChargingProvider | "Other";
};

function getGoogleMaps(): GoogleMapsLike | null {
  const g = (window as Window & { google?: unknown }).google;
  if (!g || typeof g !== "object") return null;
  const maps = (g as { maps?: unknown }).maps;
  if (!maps || typeof maps !== "object") return null;
  return g as GoogleMapsLike;
}

function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function clusterStations(stations: ChargingStation[], zoom: number): ClusterPoint[] {
  if (zoom >= 11) {
    return stations.map((s) => ({
      id: `station-${s.id}`,
      lat: s.coordinates.lat,
      lng: s.coordinates.lng,
      count: 1,
      stationIds: [s.id],
      provider: s.provider ?? "Other",
    }));
  }

  const cell = zoom >= 9 ? 0.12 : zoom >= 7 ? 0.3 : 0.65;
  const buckets = new Map<string, ClusterPoint>();
  for (const s of stations) {
    const key = `${Math.round(s.coordinates.lat / cell)}:${Math.round(s.coordinates.lng / cell)}`;
    const existing = buckets.get(key);
    if (!existing) {
      buckets.set(key, {
        id: key,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
        count: 1,
        stationIds: [s.id],
        provider: s.provider ?? "Other",
      });
      continue;
    }
    existing.count += 1;
    existing.stationIds.push(s.id);
    existing.lat = (existing.lat * (existing.count - 1) + s.coordinates.lat) / existing.count;
    existing.lng = (existing.lng * (existing.count - 1) + s.coordinates.lng) / existing.count;
  }
  return [...buckets.values()];
}

function useGoogleMapsReady(apiKey: string) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setFailed(true);
      return;
    }

    if (getGoogleMaps()) {
      setReady(true);
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      existing.addEventListener("error", () => setFailed(true));
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=quarterly`;
    script.onload = () => setReady(true);
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, [apiKey]);

  return { ready, failed };
}

export function GoogleChargingMap({
  stations,
  selectedId,
  countryName,
  isLoading,
  isFallback,
  onSelect,
  onViewportChange,
  countryCenter,
}: GoogleChargingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMapLike | null>(null);
  const markerRefs = useRef<GoogleMarkerLike[]>([]);
  const listenersRef = useRef<Array<{ remove: () => void }>>([]);
  const [zoom, setZoom] = useState(6);

  const apiKey = String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "");
  const { ready, failed } = useGoogleMapsReady(apiKey);

  const clustered = useMemo(() => clusterStations(stations, zoom), [stations, zoom]);

  useEffect(() => {
    if (!ready || !mapContainerRef.current || mapRef.current) return;
    const g = getGoogleMaps();
    if (!g) return;

    mapRef.current = new g.maps.Map(mapContainerRef.current, {
      center: countryCenter,
      zoom: 6,
      minZoom: 4,
      maxZoom: 15,
      styles: DARK_CINEMATIC_MAP_STYLE,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: "greedy",
      clickableIcons: false,
      zoomControl: true,
      disableDefaultUI: false,
    });

    const idleListener = mapRef.current.addListener("idle", () => {
      const map = mapRef.current;
      if (!map) return;
      const center = map.getCenter();
      const bounds = map.getBounds();
      const currentZoom = map.getZoom() ?? 6;
      setZoom(currentZoom);
      if (!center || !bounds) {
        onViewportChange({
          lat: countryCenter.lat,
          lng: countryCenter.lng,
          distanceKm: FALLBACK_DISTANCE_KM,
          zoom: currentZoom,
        });
        return;
      }
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const diagonalKm = kmBetween(
        { lat: ne.lat(), lng: ne.lng() },
        { lat: sw.lat(), lng: sw.lng() },
      );
      onViewportChange({
        lat: center.lat(),
        lng: center.lng(),
        distanceKm: Math.max(30, Math.min(320, diagonalKm / 2)),
        zoom: currentZoom,
      });
    });
    listenersRef.current.push(idleListener);
  }, [countryCenter, onViewportChange, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo(countryCenter);
    map.setZoom(6);
  }, [countryCenter]);

  useEffect(() => {
    const map = mapRef.current;
    const g = getGoogleMaps();
    if (!map || !g) return;

    markerRefs.current.forEach((marker) => {
      g.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    markerRefs.current = [];

    clustered.forEach((point) => {
      const isCluster = point.count > 1;
      const isActive = !isCluster && point.stationIds[0] === selectedId;
      const color = PROVIDER_MARKER_COLORS[point.provider] ?? PROVIDER_MARKER_COLORS.Other;

      const marker = new g.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map,
        title: isCluster
          ? `${point.count} stations nearby`
          : stations.find((s) => s.id === point.stationIds[0])?.name ?? "Charging station",
        label: isCluster
          ? {
              text: String(point.count),
              color: "#f8fafc",
              fontSize: "11px",
              fontWeight: "700",
            }
          : undefined,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          fillColor: isCluster ? "#0891b2" : color,
          fillOpacity: isCluster ? 0.9 : 1,
          strokeColor: isActive ? "#ecfeff" : "#0f172a",
          strokeWeight: isActive ? 2.8 : 1.8,
          scale: isCluster ? Math.min(20, 9 + point.count * 0.8) : isActive ? 10 : 7,
        },
      });

      marker.addListener("click", () => {
        if (isCluster) {
          map.panTo({ lat: point.lat, lng: point.lng });
          map.setZoom(Math.min(15, (map.getZoom() ?? 6) + 2));
          return;
        }
        onSelect(point.stationIds[0]);
      });

      markerRefs.current.push(marker);
    });
  }, [clustered, onSelect, selectedId, stations]);

  useEffect(() => () => {
    const g = getGoogleMaps();
    markerRefs.current.forEach((marker) => {
      if (g) g.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    markerRefs.current = [];
    listenersRef.current.forEach((l) => l.remove());
    listenersRef.current = [];
  }, []);

  const liveBadge = isFallback ? "Representative fallback data" : "Live · Open Charge Map";

  return (
    <div className="glass rounded-3xl border border-border/40 overflow-hidden">
      <div className="p-5 border-b border-border/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cyan-400 mb-2">
            <Layers3 className="w-3.5 h-3.5" />
            Google Maps charging canvas
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {countryName} · live EV infrastructure
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          {liveBadge}
        </span>
      </div>

      <div className="relative h-[48vh] min-h-[380px] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/60">
        <div ref={mapContainerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-4 bottom-4 rounded-2xl border border-border/40 bg-background/72 px-4 py-3 backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Coverage</div>
          <div className="text-sm font-medium">{stations.length} mapped stations</div>
          <div className="text-xs text-muted-foreground mt-1">Clustered by zoom · tap marker for station detail</div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-background/25 backdrop-blur-[1px] flex items-center justify-center">
            <div className="rounded-2xl border border-border/40 bg-background/80 px-5 py-3 text-sm text-muted-foreground">
              Loading live map infrastructure…
            </div>
          </div>
        )}

        {(failed || !apiKey) && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-8 text-center">
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
              <p className="font-medium mb-1">Google Maps unavailable</p>
              <p className="text-sm text-muted-foreground">
                Set <code>VITE_GOOGLE_MAPS_API_KEY</code> to enable the live map canvas.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-border/30 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
        <Radio className="w-3 h-3 text-cyan-400" />
        Google Maps © Google · Data © Open Charge Map contributors.
      </div>
    </div>
  );
}
