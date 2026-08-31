import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

/**
 * Free, keyless map: OpenStreetMap data rendered with CARTO dark tiles.
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
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · routing by OSRM',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerRef.current;
    if (!map || !group || coords.length < 2) return;
    group.clearLayers();

    L.polyline(coords, { color: "#f59e0b", weight: 9, opacity: 0.18, lineCap: "round" }).addTo(group);
    L.polyline(coords, { color: "#fb923c", weight: 4, opacity: 0.95, lineCap: "round" }).addTo(group);

    const endpoint = (pos: [number, number], label: string, color: string) =>
      L.marker(pos, {
        icon: L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px rgba(7,12,24,.9),0 0 14px ${color}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      })
        .bindTooltip(label, { direction: "top", offset: [0, -10] })
        .addTo(group);

    endpoint(coords[0]!, fromLabel, "#e2e8f0");
    endpoint(coords[coords.length - 1]!, toLabel, "#f59e0b");

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#070c18;border:2px solid ${m.color};font-size:11px;line-height:1">${m.emoji}</span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).addTo(group);
      const link = m.mapUrl
        ? `<br/><a href="${m.mapUrl}" target="_blank" rel="noopener noreferrer" style="color:#fbbf24">Google Maps ↗</a>`
        : "";
      marker.bindPopup(
        `<strong>${m.title}</strong>${m.subtitle ? `<br/>${m.subtitle}` : ""}${link}`,
      );
    });

    map.fitBounds(L.latLngBounds(coords), { padding: [28, 28] });
  }, [coords, markers, fromLabel, toLabel]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full overflow-hidden rounded-2xl [&_.leaflet-container]:bg-[#070c18]"
    />
  );
}
