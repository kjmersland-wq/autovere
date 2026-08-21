import { Fuel, Zap, Droplets, CalendarDays, ArrowRight, Loader2 } from "lucide-react";
import { PlaceInput } from "./PlaceInput";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Place } from "@/lib/geo";
import type { VehicleType } from "@/lib/calc";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type TripFormState = {
  from: Place | null;
  to: Place | null;
  vehicle: VehicleType;
  evRangeKm: number;
  days: number;
};

const DAY_PRESETS = [1, 3, 7, 10, 30, 365];

export function TripForm({
  state,
  setState,
  onSubmit,
  loading,
}: {
  state: TripFormState;
  setState: (s: TripFormState) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const t = useT();
  const vehicles: { key: VehicleType; label: string; icon: typeof Fuel }[] = [
    { key: "petrol", label: t.petrol, icon: Fuel },
    { key: "diesel", label: t.diesel, icon: Droplets },
    { key: "ev", label: t.ev, icon: Zap },
  ];

  return (
    <form
      className="panel p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceInput
          label={t.from}
          placeholder={t.fromPlaceholder}
          value={state.from}
          onChange={(from) => setState({ ...state, from })}
        />
        <PlaceInput
          label={t.to}
          placeholder={t.toPlaceholder}
          value={state.to}
          onChange={(to) => setState({ ...state, to })}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.vehicle}
          </span>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface-raised p-1.5">
            {vehicles.map((v) => {
              const active = state.vehicle === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setState({ ...state, vehicle: v.key })}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  <v.icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden /> {t.tripDuration}
          </span>
          <div className="flex flex-wrap gap-2">
            {DAY_PRESETS.map((d) => {
              const active = state.days === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setState({ ...state, days: d })}
                  className={cn(
                    "numeric rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all",
                    active
                      ? "border-primary/70 bg-primary/15 text-primary"
                      : "border-border bg-surface-raised text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d === 365 ? "1 year" : `${d} ${d === 1 ? t.day : t.days}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {state.vehicle === "ev" && (
        <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-foreground">{t.batteryRange}</span>
            <span className="numeric text-lg font-bold text-primary">{state.evRangeKm} km</span>
          </div>
          <Slider
            min={300}
            max={600}
            step={10}
            value={[state.evRangeKm]}
            onValueChange={([v]) => setState({ ...state, evRangeKm: v ?? 400 })}
            aria-label={t.batteryRange}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Charging stops are planned at 75% of this range so you always arrive with a buffer.
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!state.from || !state.to || loading}
        className="mt-6 h-13 w-full rounded-xl text-base font-bold"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" /> {t.calculating}
          </>
        ) : (
          <>
            {t.calculate} <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}
