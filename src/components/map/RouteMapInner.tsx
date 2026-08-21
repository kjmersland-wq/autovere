import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import type { LatLng } from "@/lib/countries";
import { FLAGS, COUNTRY_NAMES } from "@/lib/countries";
import type { Charger } from "@/lib/geo";
import type { RouteVariantKey } from "@/lib/geo";

export type MapRoute = {
  key: RouteVariantKey;
  coords: LatLng[];
  color: string;
  active: boolean;
};

export type BorderMarker = { pt: LatLng; from: string; to: string };

function pin(html: string, bg: string, size = 30) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};color:#08111f;display:flex;align-items:center;justify-content:center;font:700 12px/1 Manrope,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.85)">${html}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ coords }: { coords: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length < 2) return;
    map.fitBounds(L.latLngBounds(coords.map(([a, b]) => L.latLng(a, b))), {
      padding: [40, 40],
    });
  }, [coords, map]);
  return null;
}

export default function RouteMapInner({
  routes,
  start,
  end,
  borders,
  chargers,
  showChargers,
}: {
  routes: MapRoute[];
  start: LatLng | null;
  end: LatLng | null;
  borders: BorderMarker[];
  chargers: Charger[];
  showChargers: boolean;
}) {
  const active = routes.find((r) => r.active)?.coords ?? [];
  return (
    <MapContainer
      center={[48.5, 10]}
      zoom={5}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <FitBounds coords={active} />

      {routes
        .slice()
        .sort((a, b) => Number(a.active) - Number(b.active))
        .map((r) => (
          <Polyline
            key={r.key}
            positions={r.coords}
            pathOptions={{
              color: r.color,
              weight: r.active ? 6 : 3.5,
              opacity: r.active ? 0.95 : 0.4,
              dashArray: r.active ? undefined : "8 8",
            }}
          />
        ))}

      {start && (
        <Marker position={start} icon={pin("A", "#7fe7d6", 32)}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {end && (
        <Marker position={end} icon={pin("B", "#ffd166", 32)}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {borders.map((b, i) => (
        <Marker key={`b-${i}`} position={b.pt} icon={pin(FLAGS[b.to] ?? "•", "#cfd8e6", 26)}>
          <Popup>
            Border: {COUNTRY_NAMES[b.from] ?? b.from} → {COUNTRY_NAMES[b.to] ?? b.to}
          </Popup>
        </Marker>
      ))}

      {showChargers &&
        chargers.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lon]} icon={pin("⚡", "#7fe7d6", 26)}>
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.powerKw ? `${Math.round(c.powerKw)} kW` : "High power"} ·{" "}
              {Math.round(c.atKm)} km into the trip
              {c.operator ? (
                <>
                  <br />
                  {c.operator}
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
