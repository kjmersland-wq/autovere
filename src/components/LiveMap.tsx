/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";

export type LiveMapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  emoji: string;
  title: string;
  subtitle?: string;
  mapUrl?: string;
  /** Charging / refuelling power, shown in the popup. */
  power?: string;
  /** Distance along the corridor, shown in the popup. */
  distanceLabel?: string;
};

/**
 * Crisp, high-contrast AutoVere styling: readable motorways, secondary roads,
 * water and city labels — no blackout. Works without a Cloud mapId.
 */
const CRISP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#eef2f7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 3 }] },
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8ecd6" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e7ecf2" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#94a3b8" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffe9b8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffcf5c" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e0a92a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#a9d6f5" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1d4ed8" }] },
];

let loaderPromise: Promise<void> | null = null;

/** Loads the Maps JS API once, asynchronously, via the documented callback. */
function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const w = window as unknown as { google?: { maps?: unknown } };
  if (w.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
  const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as string | undefined;
  if (!key) return Promise.reject(new Error("Missing Google Maps browser key"));

  loaderPromise = new Promise<void>((resolve, reject) => {
    const cbName = "__autovereInitMap";
    (window as unknown as Record<string, unknown>)[cbName] = () => resolve();
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=${cbName}` +
      (channel ? `&channel=${channel}` : "");
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

/** Teardrop pin drawn in the operator / endpoint colour. */
function pin(color: string): google.maps.Symbol {
  return {
    path: "M 0,0 C -3,-6 -9,-8 -9,-14 a 9,9 0 1,1 18,0 c 0,6 -6,8 -9,14 z",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#0f172a",
    strokeWeight: 1.6,
    scale: 1.35,
    labelOrigin: new google.maps.Point(0, -14),
  };
}

/**
 * Real, interactive Google Map with full controls.
 * Browser-only — always mount behind <ClientOnly> + React.lazy.
 */
export default function LiveMap({
  coords,
  markers,
  fromLabel,
  toLabel,
  height = 420,
}: {
  coords: [number, number][];
  markers: LiveMapMarker[];
  fromLabel: string;
  toLabel: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<Array<{ setMap: (m: google.maps.Map | null) => void }>>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !ref.current || coords.length < 2) return;

    const path = coords.map(([lat, lng]) => ({ lat, lng }));
    const map =
      mapRef.current ??
      new google.maps.Map(ref.current, {
        styles: CRISP_STYLES,
        disableDefaultUI: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
        },
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        scaleControl: true,
        scrollwheel: false,
        backgroundColor: "#eef2f7",
      });
    mapRef.current = map;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    const casing = new google.maps.Polyline({
      path,
      strokeColor: "#0f172a",
      strokeOpacity: 0.85,
      strokeWeight: 11,
      zIndex: 1,
      map,
    });
    const line = new google.maps.Polyline({
      path,
      strokeColor: "#00E5FF",
      strokeOpacity: 1,
      strokeWeight: 7,
      zIndex: 2,
      map,
    });
    overlaysRef.current.push(casing, line);

    const info = new google.maps.InfoWindow();

    const endpoint = (pos: google.maps.LatLngLiteral, label: string, color: string, glyph: string) => {
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: label,
        zIndex: 20,
        icon: pin(color),
        label: { text: glyph, fontSize: "12px" },
      });
      marker.addListener("click", () => {
        info.setContent(`<div style="color:#0f172a;font-size:13px"><strong>${label}</strong></div>`);
        info.open({ map, anchor: marker });
      });
      overlaysRef.current.push(marker);
    };

    endpoint(path[0]!, fromLabel, "#16a34a", "A");
    endpoint(path[path.length - 1]!, toLabel, "#dc2626", "B");

    markers.forEach((m) => {
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.title,
        zIndex: 10,
        label: { text: m.emoji, fontSize: "12px" },
        icon: pin(m.color),
      });
      marker.addListener("click", () => {
        const link = m.mapUrl
          ? `<div style="margin-top:4px"><a href="${m.mapUrl}" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8">Google Maps ↗</a></div>`
          : "";
        const meta = [m.power, m.distanceLabel].filter(Boolean).join(" · ");
        info.setContent(
          `<div style="color:#0f172a;font-size:13px;line-height:1.45"><strong>${m.title}</strong>` +
            (meta ? `<div style="font-weight:600">${meta}</div>` : "") +
            (m.subtitle ? `<div style="color:#475569">${m.subtitle}</div>` : "") +
            `${link}</div>`,
        );
        info.open({ map, anchor: marker });
      });
      overlaysRef.current.push(marker);
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 32);
  }, [ready, coords, markers, fromLabel, toLabel]);

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex w-full items-center justify-center rounded-2xl bg-background/40 px-6 text-center text-sm text-muted-foreground"
      >
        {error}
      </div>
    );
  }

  return <div ref={ref} style={{ height }} className="w-full overflow-hidden rounded-2xl bg-[#eef2f7]" />;
}
