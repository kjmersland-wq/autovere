import { ClientOnly } from "@tanstack/react-router";
import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { LatLng } from "@/lib/countries";
import type { Charger, RouteVariantKey, ScenicHighlight } from "@/lib/geo";
import type { Theme } from "@/hooks/use-theme";
import { useLocale } from "@/lib/i18n";
import { chargerCopy } from "@/lib/charger-i18n";

const Inner = lazy(() => import("./map/RouteMapInner"));

export type MapRoute = {
  key: RouteVariantKey;
  coords: LatLng[];
  color: string;
  active: boolean;
};

export type BorderMarker = { pt: LatLng; from: string; to: string };

function Skeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

type MapErrorBoundaryProps = { children: ReactNode };
type MapErrorBoundaryState = { failed: boolean };

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  state: MapErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route map failed to load", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">
            The map is temporarily unavailable. Your route calculation is still ready below.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RouteMap(props: {
  routes: MapRoute[];
  start: LatLng | null;
  end: LatLng | null;
  borders: BorderMarker[];
  chargers: Charger[];
  showChargers: boolean;
  theme: Theme;
  scenic: ScenicHighlight[];
  onAddCharger?: (charger: Charger) => void;
}) {
  const [chargerFilter, setChargerFilter] = useState<"all" | "tesla" | "highPower">("all");
  const { locale } = useLocale();
  const chargerText = chargerCopy[locale];
  const visibleChargers = props.chargers.filter((charger) => {
    if (chargerFilter === "highPower") return (charger.powerKw ?? 0) > 150;
    if (chargerFilter === "tesla") return /tesla/i.test(`${charger.operator ?? ""} ${charger.name}`);
    return true;
  });
  return (
    <div className="relative h-full w-full">
      {props.showChargers && props.chargers.length > 0 && (
        <div className="absolute left-3 top-3 z-[500] flex gap-1 rounded-xl border border-border bg-background/90 p-1 shadow-lg backdrop-blur-md">
          {(["all", "tesla", "highPower"] as const).map((filter) => (
            <button key={filter} type="button" onClick={() => setChargerFilter(filter)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${chargerFilter === filter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {filter === "all" ? chargerText.all : filter === "tesla" ? chargerText.tesla : chargerText.highPower}
            </button>
          ))}
        </div>
      )}
      <MapErrorBoundary>
        <ClientOnly fallback={<Skeleton />}>
          <Suspense fallback={<Skeleton />}>
            <Inner {...props} chargers={visibleChargers} />
          </Suspense>
        </ClientOnly>
      </MapErrorBoundary>
    </div>
  );
}
