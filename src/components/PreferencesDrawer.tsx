import { useState, useCallback } from "react";
import { Settings2, Snowflake, Sun, Cloud, Thermometer, Car, Route, Navigation, Users, Zap, Home, Building2, Globe, X, Check } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { loadPreferences, savePreferences } from "@/lib/personalization";
import type { ClimateProfile, DrivingProfile, HouseholdType, ChargingSetup, UserPreferences } from "@/lib/personalization";
import { toast } from "sonner";

// ─── Chip button helper ──────────────────────────────────────────────────────

interface ChipProps {
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  label: string;
  color?: string;
}

function Chip({ active, onClick, icon: Icon, label, color = "text-accent" }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
        active
          ? `bg-accent/10 border-accent/40 ${color}`
          : "glass border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70"
      }`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? color : ""}`} />}
      {label}
      {active && <Check className="w-3 h-3 ml-0.5" />}
    </button>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────

function PrefSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// ─── Slider row ──────────────────────────────────────────────────────────────

function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{label}</p>
        <span className="text-xs font-semibold tabular-nums">{value.toLocaleString()} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-border cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-glow"
      />
      <div className="flex justify-between text-[9px] text-muted-foreground/70">
        <span>{min.toLocaleString()} {unit}</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
}

// ─── Country options ─────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "NO", label: "Norway" },
  { code: "DE", label: "Germany" },
  { code: "SE", label: "Sweden" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
  { code: "GB", label: "United Kingdom" },
  { code: "PL", label: "Poland" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "DK", label: "Denmark" },
  { code: "FI", label: "Finland" },
  { code: "AT", label: "Austria" },
  { code: "BE", label: "Belgium" },
  { code: "CH", label: "Switzerland" },
];

// ─── Main component ──────────────────────────────────────────────────────────

export function PreferencesDrawer() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadPreferences());

  const patch = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const save = () => {
    savePreferences(prefs);
    toast.success("Preferences saved — content is now personalised to you.", { duration: 3000 });
    setOpen(false);
  };

  const reset = () => {
    const { loadPreferences: _, savePreferences: __, patchPreferences: ___, ...rest } = {} as never;
    void rest;
    import("@/lib/personalization").then(({ DEFAULT_PREFERENCES }) => {
      setPrefs(DEFAULT_PREFERENCES);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="w-9 h-9 rounded-lg glass border border-border/40 flex items-center justify-center hover:border-accent/40 hover:text-accent transition-colors"
          aria-label="Personalisation settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/30 flex-shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Settings2 className="w-4 h-4 text-accent" />
            Your preferences
          </SheetTitle>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Set your profile once — every score, article ranking, and insight adapts to you.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Climate */}
          <PrefSection label="Climate">
            {(
              [
                { value: "arctic", label: "Arctic", icon: Snowflake, color: "text-sky-400" },
                { value: "cold", label: "Cold", icon: Cloud, color: "text-blue-400" },
                { value: "temperate", label: "Temperate", icon: Thermometer, color: "text-emerald-400" },
                { value: "warm", label: "Warm", icon: Sun, color: "text-amber-400" },
              ] as { value: ClimateProfile; label: string; icon: React.ElementType; color: string }[]
            ).map((c) => (
              <Chip
                key={c.value}
                active={prefs.climate === c.value}
                onClick={() => patch("climate", c.value)}
                icon={c.icon}
                label={c.label}
                color={c.color}
              />
            ))}
          </PrefSection>

          {/* Driving profile */}
          <PrefSection label="Driving style">
            {(
              [
                { value: "city", label: "City", icon: Navigation },
                { value: "mixed", label: "Mixed", icon: Car },
                { value: "motorway", label: "Motorway", icon: Route },
                { value: "touring", label: "Touring", icon: Globe },
              ] as { value: DrivingProfile; label: string; icon: React.ElementType }[]
            ).map((d) => (
              <Chip
                key={d.value}
                active={prefs.drivingProfile === d.value}
                onClick={() => patch("drivingProfile", d.value)}
                icon={d.icon}
                label={d.label}
              />
            ))}
          </PrefSection>

          {/* Household */}
          <PrefSection label="Household">
            {(
              [
                { value: "single", label: "Single" },
                { value: "couple", label: "Couple" },
                { value: "family", label: "Family", icon: Users },
                { value: "business", label: "Business", icon: Building2 },
              ] as { value: HouseholdType; label: string; icon?: React.ElementType }[]
            ).map((h) => (
              <Chip
                key={h.value}
                active={prefs.householdType === h.value}
                onClick={() => patch("householdType", h.value)}
                icon={h.icon}
                label={h.label}
              />
            ))}
          </PrefSection>

          {/* Charging setup */}
          <PrefSection label="Charging setup">
            {(
              [
                { value: "home", label: "Home charging", icon: Home },
                { value: "workplace", label: "Workplace", icon: Building2 },
                { value: "public-only", label: "Public only", icon: Zap },
              ] as { value: ChargingSetup; label: string; icon: React.ElementType }[]
            ).map((c) => (
              <Chip
                key={c.value}
                active={prefs.chargingSetup === c.value}
                onClick={() => patch("chargingSetup", c.value)}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </PrefSection>

          {/* Country */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Country</p>
            <select
              value={prefs.country}
              onChange={(e) => patch("country", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50 transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Annual km */}
          <SliderRow
            label="Annual mileage"
            value={prefs.annualKm}
            min={5000}
            max={60000}
            step={1000}
            unit="km"
            onChange={(v) => patch("annualKm", v)}
          />

          {/* Budget */}
          <SliderRow
            label="Budget"
            value={prefs.budgetEur}
            min={20000}
            max={120000}
            step={5000}
            unit="€"
            onChange={(v) => patch("budgetEur", v)}
          />

          {/* Priorities */}
          <PrefSection label="Priorities">
            {(
              [
                { key: "prioritizeWinter" as const, label: "Winter range", icon: Snowflake },
                { key: "prioritizeRange" as const, label: "Long range", icon: Route },
                { key: "prioritizeCharging" as const, label: "Fast charging", icon: Zap },
                { key: "prioritizeFamily" as const, label: "Family space", icon: Users },
                { key: "prioritizeEfficiency" as const, label: "Cost efficiency", icon: Globe },
              ]
            ).map((p) => (
              <Chip
                key={p.key}
                active={prefs[p.key] as boolean}
                onClick={() => patch(p.key, !(prefs[p.key] as boolean))}
                icon={p.icon}
                label={p.label}
              />
            ))}
          </PrefSection>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border/30 flex-shrink-0 flex items-center gap-3">
          <button
            onClick={save}
            className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Save preferences
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl glass border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
