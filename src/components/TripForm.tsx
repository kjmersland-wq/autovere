import { Fuel, Zap, Droplets, CalendarDays, ArrowRight, Loader2, Plus, X } from "lucide-react";
import { PlaceInput } from "./PlaceInput";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Place } from "@/lib/geo";
import type { VehicleType } from "@/lib/calc";
import { autoPassLabels, durationLabels, useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type TripFormState = {
  from: Place | null;
  stops: (Place | null)[];
  to: Place | null;
  vehicle: VehicleType;
  fuelType: "EV" | "ICE";
  autoPass: boolean;
  evRangeKm: number;
  days: number;
  durationMode: "preset" | "custom";
};

export type DemoRoute = "oslo-garda" | "munich-split" | "paris-nice";

const DAY_PRESETS = [1, 10, 30, 365];

export function TripForm({
  state,
  setState,
  onSubmit,
  loading,
  onDemo,
}: {
  state: TripFormState;
  setState: (s: TripFormState) => void;
  onSubmit: () => void;
  loading: boolean;
  onDemo?: (demo: DemoRoute) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const vehicles: { key: VehicleType; label: string; icon: typeof Fuel }[] = [
    { key: "petrol", label: t.petrol, icon: Fuel },
    { key: "diesel", label: t.diesel, icon: Droplets },
    { key: "ev", label: t.ev, icon: Zap },
  ];
  const customDuration = state.durationMode === "custom";
  const durationIsValid = Number.isInteger(state.days) && state.days >= 1 && state.days <= 3650;

  return (
    <form
      className="panel rounded-2xl border-border/60 bg-card/80 p-5 shadow-2xl backdrop-blur-md sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!durationIsValid) return;
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceInput
          label={t.from}
          placeholder={t.fromPlaceholder}
          value={state.from}
          onChange={(from) => setState({ ...state, from, autoPass: from?.country === "NO" ? true : state.autoPass })}
        />
        <div className="space-y-3">
          {state.stops.map((stop, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <PlaceInput
                  label={`${t.stop} ${index + 1}`}
                  placeholder={t.stopPlaceholder}
                  value={stop}
                  onChange={(next) => {
                    const stops = [...state.stops];
                    stops[index] = next;
                    setState({ ...state, stops });
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setState({ ...state, stops: state.stops.filter((_, i) => i !== index) })}
                className="mb-1 rounded-lg border border-border bg-surface-raised p-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`${t.remove} ${t.stop} ${index + 1}`}
                title={t.remove}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setState({ ...state, stops: [...state.stops, null] })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground"
          >
            <Plus className="size-4" aria-hidden /> {t.addStop}
          </button>
        </div>
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
                  onClick={() => setState({ ...state, vehicle: v.key, fuelType: v.key === "ev" ? "EV" : "ICE" })}
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
          <label className="mt-3 flex items-center justify-between gap-3 text-sm text-foreground">
            <span>{autoPassLabels[locale]}</span>
            <input
              type="checkbox"
              checked={state.autoPass}
              onChange={(e) => setState({ ...state, autoPass: e.target.checked })}
              className="size-4 accent-primary"
            />
          </label>
        </div>

        <div>
          <span className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden /> {t.tripDuration}
          </span>
          <div className="flex flex-wrap gap-2">
            {DAY_PRESETS.map((d) => {
              const active = state.durationMode === "preset" && state.days === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setState({ ...state, days: d, durationMode: "preset" })}
                  className={cn(
                    "numeric rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all",
                    active
                      ? "border-primary/70 bg-primary/15 text-primary"
                      : "border-border bg-surface-raised text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d === 365 ? `1 ${t.year}` : `${d} ${d === 1 ? t.day : t.days}`}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setState({ ...state, durationMode: "custom", days: durationIsValid ? state.days : 1 })}
              className={cn(
                "numeric rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all",
                customDuration
                  ? "border-primary/70 bg-primary/15 text-primary"
                  : "border-border bg-surface-raised text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={customDuration}
            >
              {durationLabels[locale].custom}
            </button>
          </div>
          {customDuration && (
            <div className="mt-3 space-y-1.5">
              <label htmlFor="custom-trip-days" className="text-xs font-semibold text-muted-foreground">
                {durationLabels[locale].custom}
              </label>
              <input
                id="custom-trip-days"
                type="number"
                inputMode="numeric"
                min={1}
                max={3650}
                step={1}
                value={state.days}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  const isWholeNumber = /^\d*$/.test(rawValue);
                  const value = rawValue === "" ? 0 : Number(rawValue);
                  setState({ ...state, durationMode: "custom", days: isWholeNumber ? value : 0 });
                }}
                className={cn(
                  "numeric w-full rounded-lg border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60",
                  !durationIsValid ? "border-destructive" : "border-border",
                )}
                aria-invalid={!durationIsValid}
                aria-describedby="custom-trip-days-error"
              />
              {!durationIsValid && <p id="custom-trip-days-error" className="text-xs text-destructive">{durationLabels[locale].invalid}</p>}
            </div>
          )}
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
            {t.chargingBuffer}
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!state.from || !state.to || loading || !durationIsValid}
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
      {onDemo && (
        <div className="mt-4">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.popularRoutes}
          </p>
          <div className="flex flex-wrap gap-2">
            {(["oslo-garda", "munich-split", "paris-nice"] as DemoRoute[]).map((demo) => (
              <button
                key={demo}
                type="button"
                onClick={() => onDemo(demo)}
                className="cursor-pointer rounded-full border border-border bg-surface-raised px-3 py-2 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
              >
                {demo === "oslo-garda" ? t.osloGarda : demo === "munich-split" ? t.munichSplit : t.parisNice}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
