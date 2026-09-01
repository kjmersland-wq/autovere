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
  power?: string | undefined;
  /** Distance along the corridor, shown in the popup. */
  distanceLabel?: string | undefined;
  /** Price lines rendered in the popup accent colour, e.g. "Est. 4,85 kr / kWh". */
  priceLines?: string[] | undefined;
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

/** Dark AutoVere skin for every Google InfoWindow bubble. */
const INFO_CSS = `
.gm-style .gm-style-iw.gm-style-iw-c{
  background:#0f172a;border:1px solid #334155;border-radius:12px;
  box-shadow:0 18px 40px rgba(2,6,23,.55);padding:14px 16px;
}
.gm-style .gm-style-iw-d{background:#0f172a;overflow:auto!important;}
.gm-style .gm-style-iw-tc::after{background:#0f172a;}
.gm-style .gm-style-iw-c button.gm-ui-hover-effect{top:4px!important;right:4px!important;opacity:1!important;}
.gm-style .gm-style-iw-c button.gm-ui-hover-effect>span{background-color:#f8fafc!important;}
.autovere-iw{font-family:inherit;color:#f8fafc;font-size:13px;line-height:1.5;max-width:250px;}
.autovere-iw h4{margin:0;font-size:14px;font-weight:700;color:#f8fafc;}
.autovere-iw .meta{color:#94a3b8;font-size:12px;margin-top:2px;}
.autovere-iw .power{color:#38bdf8;font-weight:600;margin-top:4px;}
.autovere-iw .price{color:#34d399;font-weight:600;margin-top:2px;}
.autovere-iw .dist{color:#f59e0b;font-weight:600;margin-top:2px;}
.autovere-iw a{color:#38bdf8;font-weight:600;text-decoration:none;display:inline-block;margin-top:8px;}
.autovere-iw a:hover{text-decoration:underline;}
`;

function injectInfoCss() {
  if (typeof document === "undefined" || document.getElementById("autovere-iw-css")) return;
  const style = document.createElement("style");
  style.id = "autovere-iw-css";
  style.textContent = INFO_CSS;
  document.head.appendChild(style);
}

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
  openLabel = "Open in Google Maps",
}: {
  coords: [number, number][];
  markers: LiveMapMarker[];
  fromLabel: string;
  toLabel: string;
  height?: number;
  openLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<Array<{ setMap: (m: google.maps.Map | null) => void }>>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    injectInfoCss();
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
        info.setContent(`<div class="autovere-iw"><h4>${label}</h4></div>`);
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
          ? `<a href="${m.mapUrl}" target="_blank" rel="noopener noreferrer">${openLabel} ↗</a>`
          : "";
        const prices = (m.priceLines ?? [])
          .map((p) => `<div class="price">${p}</div>`)
          .join("");
        info.setContent(
          `<div class="autovere-iw"><h4>${m.title}</h4>` +
            (m.power ? `<div class="power">${m.power}</div>` : "") +
            prices +
            (m.distanceLabel ? `<div class="dist">${m.distanceLabel}</div>` : "") +
            (m.subtitle ? `<div class="meta">${m.subtitle}</div>` : "") +
            `${link}</div>`,
        );
        info.open({ map, anchor: marker });
      });
      overlaysRef.current.push(marker);
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 32);
  }, [ready, coords, markers, fromLabel, toLabel, openLabel]);

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
