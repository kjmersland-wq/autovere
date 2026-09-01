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
};

/** Dark AutoVere styling — works without a Cloud mapId. */
const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1120" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1120" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050a14" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
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

/**
 * Real, interactive Google Map in AutoVere's dark theme.
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
        styles: DARK_STYLES,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        scrollwheel: false,
        backgroundColor: "#070c18",
      });
    mapRef.current = map;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    const glow = new google.maps.Polyline({
      path,
      strokeColor: "#f59e0b",
      strokeOpacity: 0.2,
      strokeWeight: 10,
      map,
    });
    const line = new google.maps.Polyline({
      path,
      strokeColor: "#fb923c",
      strokeOpacity: 0.95,
      strokeWeight: 4,
      map,
    });
    overlaysRef.current.push(glow, line);

    const info = new google.maps.InfoWindow();

    const endpoint = (pos: google.maps.LatLngLiteral, label: string, color: string) => {
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: label,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#070c18",
          strokeWeight: 3,
        },
      });
      overlaysRef.current.push(marker);
    };

    endpoint(path[0]!, fromLabel, "#e2e8f0");
    endpoint(path[path.length - 1]!, toLabel, "#f59e0b");

    markers.forEach((m) => {
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.title,
        label: { text: m.emoji, fontSize: "12px" },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: "#070c18",
          fillOpacity: 1,
          strokeColor: m.color,
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => {
        const link = m.mapUrl
          ? `<br/><a href="${m.mapUrl}" target="_blank" rel="noopener noreferrer" style="color:#b45309">Google Maps ↗</a>`
          : "";
        info.setContent(
          `<div style="color:#0f172a;font-size:13px"><strong>${m.title}</strong>${
            m.subtitle ? `<br/>${m.subtitle}` : ""
          }${link}</div>`,
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

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full overflow-hidden rounded-2xl bg-[#070c18]"
    />
  );
}
