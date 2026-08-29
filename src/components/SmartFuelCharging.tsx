import { Fuel, Lock, Plug, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppLink as Link } from "@/components/AppLink";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { SmartFuelCopy } from "@/lib/smart-fuel-i18n";
import type { FuelStation, SmartCharger } from "@/lib/geo";

const DISTANCE_OPTIONS = [5, 10, 25, 50] as const;

function CableBadge({ status, copy }: { status: "attached" | "bring_own" | "unavailable"; copy: SmartFuelCopy }) {
  const label = status === "attached" ? copy.cableAttached : status === "bring_own" ? copy.cableBringOwn : copy.cableUnavailable;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
      <Plug className="size-3" aria-hidden /> {label}
    </span>
  );
}

function chargerCableStatus(charger: SmartCharger): "attached" | "bring_own" | "unavailable" {
  if (!charger.connections.length) return "unavailable";
  if (charger.connections.some((c) => c.cableStatus === "attached")) return "attached";
  return "bring_own";
}

type ConnectorSummary = { type: string; currentType: "AC" | "DC"; powerKw: number | null };

function chargerConnectorSummaries(charger: SmartCharger): ConnectorSummary[] {
  const byType = new Map<string, ConnectorSummary>();
  for (const connection of charger.connections) {
    const existing = byType.get(connection.connectorType);
    if (!existing) {
      byType.set(connection.connectorType, { type: connection.connectorType, currentType: connection.currentType, powerKw: connection.powerKw });
    } else if (connection.powerKw != null && (existing.powerKw == null || connection.powerKw > existing.powerKw)) {
      existing.powerKw = connection.powerKw;
    }
  }
  return [...byType.values()];
}

type SmartFuelChargingProps = {
  copy: SmartFuelCopy;
  locale: string;
  currency: CurrencyCode;
  chargers: SmartCharger[];
  fuelStations: FuelStation[];
  loading: boolean;
  maxDistanceKm: number;
  onMaxDistanceChange: (km: number) => void;
  onAddStop: (place: { id: string; name: string; label: string; lat: number; lon: number }) => void;
};

export function SmartFuelCharging({ copy, locale, currency, chargers, fuelStations, loading, maxDistanceKm, onMaxDistanceChange, onAddStop }: SmartFuelChargingProps) {
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <section className="panel p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Zap className="size-4" aria-hidden />
            </span>
            {copy.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          {copy.distanceLabel}
          <select
            value={maxDistanceKm}
            onChange={(event) => onMaxDistanceChange(Number(event.target.value))}
            className="rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary/60"
          >
            {DISTANCE_OPTIONS.map((km) => (
              <option key={km} value={km}>{km} km</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Zap className="size-3.5" aria-hidden /> {copy.chargingTitle}
          </h3>
          <div className="mt-3 space-y-2">
            {loading && <p className="text-sm text-muted-foreground">…</p>}
            {!loading && chargers.length === 0 && <p className="text-sm text-muted-foreground">{copy.noChargers}</p>}
            {!loading && chargers.slice(0, 8).map((charger) => (
              <div key={charger.id} className="rounded-lg border border-border bg-surface-raised p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{charger.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {chargerConnectorSummaries(charger).map((connector) => (
                        <span key={connector.type} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {connector.currentType === "DC" && <Zap className="size-2.5" aria-hidden />}
                          {connector.type} · {connector.currentType}
                          {connector.powerKw ? ` · ${Math.round(connector.powerKw)} kW` : ""}
                        </span>
                      ))}
                      <CableBadge status={chargerCableStatus(charger)} copy={copy} />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onAddStop({ id: `smart-charger-${charger.id}`, name: charger.name, label: `${charger.name}, ${charger.operator ?? copy.chargingTitle}`, lat: charger.lat, lon: charger.lon })}
                  >
                    {copy.addStop}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Fuel className="size-3.5" aria-hidden /> {copy.fuelTitle}
          </h3>
          <div className="mt-3 space-y-2">
            {loading && <p className="text-sm text-muted-foreground">…</p>}
            {!loading && fuelStations.length === 0 && <p className="text-sm text-muted-foreground">{copy.noFuelStations}</p>}
            {!loading && fuelStations.slice(0, 8).map((station) => (
              <div key={station.id} className="rounded-lg border border-border bg-surface-raised p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{station.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {station.prices.length ? station.prices.map((price) => (
                        <span key={price.fuelType}>
                          <span className="font-bold text-foreground">{formatCurrency(price.amount, currency, locale)}</span> {price.fuelType}
                        </span>
                      )) : <span>{copy.priceUnavailable}</span>}
                    </div>
                    {station.prices[0] && <p className="mt-1 text-xs text-muted-foreground">{copy.updated(dateFormatter.format(new Date(station.prices[0].updatedAt)))}</p>}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onAddStop({ id: `smart-fuel-${station.id}`, name: station.name, label: `${station.name}, ${copy.fuelTitle}`, lat: station.lat, lon: station.lon })}
                  >
                    {copy.addStop}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{copy.attribution}</p>
    </section>
  );
}

export function SmartFuelChargingUpgrade({ copy }: { copy: SmartFuelCopy }) {
  return (
    <section className="panel flex flex-col items-start gap-3 border-dashed p-5 sm:p-7">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
        <Lock className="size-3.5" aria-hidden /> {copy.proLabel}
      </span>
      <h2 className="text-lg font-bold">{copy.upgradeTitle}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.upgradeBody}</p>
      <Link to="/pricing">
        <Button>{copy.upgradeCta}</Button>
      </Link>
    </section>
  );
}
