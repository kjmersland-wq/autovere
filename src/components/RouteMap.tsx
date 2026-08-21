import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { LatLng } from "@/lib/countries";
import type { Charger, RouteVariantKey } from "@/lib/geo";

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

export function RouteMap(props: {
  routes: MapRoute[];
  start: LatLng | null;
  end: LatLng | null;
  borders: BorderMarker[];
  chargers: Charger[];
  showChargers: boolean;
}) {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <Suspense fallback={<Skeleton />}>
        <Inner {...props} />
      </Suspense>
    </ClientOnly>
  );
}
