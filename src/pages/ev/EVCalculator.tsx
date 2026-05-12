import { useMemo, useState } from "react";
import { Calculator, Zap, TrendingDown, Euro, Fuel, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";

const COUNTRIES = [
  { name: "Norway", homeRate: 0.12, publicRate: 0.38, gasPrice: 2.15 },
  { name: "Sweden", homeRate: 0.18, publicRate: 0.42, gasPrice: 1.98 },
  { name: "Germany", homeRate: 0.31, publicRate: 0.55, gasPrice: 1.82 },
  { name: "Netherlands", homeRate: 0.28, publicRate: 0.50, gasPrice: 1.96 },
  { name: "France", homeRate: 0.20, publicRate: 0.48, gasPrice: 1.75 },
  { name: "Denmark", homeRate: 0.34, publicRate: 0.60, gasPrice: 1.88 },
  { name: "Finland", homeRate: 0.16, publicRate: 0.40, gasPrice: 1.91 },
  { name: "Belgium", homeRate: 0.29, publicRate: 0.52, gasPrice: 1.78 },
  { name: "Spain", homeRate: 0.17, publicRate: 0.45, gasPrice: 1.62 },
  { name: "Poland", homeRate: 0.22, publicRate: 0.56, gasPrice: 1.55 },
];

const Slider = ({
  label, value, min, max, step, unit, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; format?: (v: number) => string; onChange: (v: number) => void;
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <span className="text-sm font-semibold">{format ? format(value) : value} {unit}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-card rounded-full appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
      <span>{min} {unit}</span>
      <span>{max} {unit}</span>
    </div>
  </div>
);

const StatCard = ({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) => (
  <div className={`rounded-2xl p-5 border ${highlight ? "bg-primary/10 border-primary/30" : "glass border-border/40"}`}>
    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</div>
    <div className={`text-2xl md:text-3xl font-bold tracking-tight ${highlight ? "text-gradient" : "text-foreground"}`}>{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

export default function EVCalculator() {
  const { t } = useTranslation();
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [batteryKwh, setBatteryKwh] = useState(75);
  const [efficiencyKwh, setEfficiencyKwh] = useState(18);
  const [annualKm, setAnnualKm] = useState(20000);
  const [homePercent, setHomePercent] = useState(70);
  const [gasConsumption, setGasConsumption] = useState(7);
  const [showGasComparison, setShowGasComparison] = useState(false);

  const results = useMemo(() => {
    const homeRate = country.homeRate;
    const publicRate = country.publicRate;
    const fastPercent = (100 - homePercent) / 100;
    const homeP = homePercent / 100;

    const kwhPer100 = efficiencyKwh;
    const totalKwhYear = (annualKm / 100) * kwhPer100;

    const homeKwh = totalKwhYear * homeP;
    const publicKwh = totalKwhYear * fastPercent;

    const yearCost = homeKwh * homeRate + publicKwh * publicRate;
    const monthCost = yearCost / 12;
    const per100Cost = (kwhPer100 * homeP * homeRate) + (kwhPer100 * fastPercent * publicRate);

    const fullChargeCost = batteryKwh * (homeP * homeRate + fastPercent * publicRate);
    const fullChargeRange = (batteryKwh / kwhPer100) * 100;

    const gasCostYear = (annualKm / 100) * gasConsumption * country.gasPrice;
    const yearlySaving = gasCostYear - yearCost;
    const fiveYearSaving = yearlySaving * 5;

    return { yearCost, monthCost, per100Cost, fullChargeCost, fullChargeRange, gasCostYear, yearlySaving, fiveYearSaving };
  }, [country, batteryKwh, efficiencyKwh, annualKm, homePercent, gasConsumption]);

  const fmt = (n: number) => n.toFixed(2);
  const fmtInt = (n: number) => Math.round(n).toLocaleString();

  return (
    <PageShell>
      <SEO
        title={t("ev.calculator.seo_title")}
        description={t("ev.calculator.seo_desc")}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-5">
            <Calculator className="w-3.5 h-3.5" /> {t("ev.calculator.eyebrow")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            {t("ev.calculator.title")} <span className="text-gradient">{t("ev.calculator.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            {t("ev.calculator.subtitle")}
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 max-w-5xl mx-auto">

          {/* Inputs */}
          <div className="glass rounded-3xl border border-border/40 p-8">
            <h2 className="font-semibold text-lg mb-8">{t("ev.calculator.your_situation")}</h2>

            {/* Country selector */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground block mb-2">{t("ev.calculator.country")}</label>
              <div className="relative">
                <select
                  value={country.name}
                  onChange={(e) => setCountry(COUNTRIES.find((c) => c.name === e.target.value) ?? COUNTRIES[0])}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  {COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
                <span>{t("ev.calculator.home_rate")}: €{country.homeRate}/kWh</span>
                <span>{t("ev.calculator.public_rate")}: €{country.publicRate}/kWh</span>
                {showGasComparison && <span>{t("ev.calculator.petrol_rate")}: €{country.gasPrice}/L</span>}
              </div>
            </div>

            <Slider label={t("ev.calculator.battery")} value={batteryKwh} min={30} max={130} step={1} unit="kWh" onChange={setBatteryKwh} />
            <Slider label={t("ev.calculator.consumption")} value={efficiencyKwh} min={12} max={30} step={0.5} unit="kWh/100 km" onChange={setEfficiencyKwh} />
            <Slider label={t("ev.calculator.annual_km")} value={annualKm} min={5000} max={60000} step={1000} unit="km" format={(v) => v.toLocaleString()} onChange={setAnnualKm} />
            <Slider label={t("ev.calculator.home_charging")} value={homePercent} min={0} max={100} step={5} unit="%" onChange={setHomePercent} />

            {/* Petrol comparison toggle */}
            <div className="mt-2">
              <button
                onClick={() => setShowGasComparison(!showGasComparison)}
                className="flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <Fuel className="w-3.5 h-3.5" />
                {showGasComparison ? t("ev.calculator.hide_petrol") : t("ev.calculator.add_petrol")}
              </button>
              {showGasComparison && (
                <div className="mt-4">
                  <Slider label={t("ev.calculator.petrol_consumption")} value={gasConsumption} min={4} max={18} step={0.5} unit="L/100 km" onChange={setGasConsumption} />
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <StatCard
              label={t("ev.calculator.per_100km")}
              value={`€ ${fmt(results.per100Cost)}`}
              sub={`${efficiencyKwh} kWh × ${t("ev.calculator.blended_rate")}`}
              highlight
            />
            <StatCard
              label={t("ev.calculator.monthly")}
              value={`€ ${fmtInt(results.monthCost)}`}
              sub={`${fmtInt(annualKm / 12)} ${t("ev.calculator.km_month")}`}
            />
            <StatCard
              label={t("ev.calculator.yearly")}
              value={`€ ${fmtInt(results.yearCost)}`}
              sub={t("ev.calculator.home_public", { home: homePercent })}
            />
            <StatCard
              label={t("ev.calculator.full_charge")}
              value={`€ ${fmt(results.fullChargeCost)}`}
              sub={`${batteryKwh} kWh → ~${Math.round(results.fullChargeRange)} km`}
            />

            {showGasComparison && (
              <div className="glass rounded-2xl border border-emerald-500/20 p-5 bg-emerald-500/5">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> {t("ev.calculator.vs_petrol")}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("ev.calculator.petrol_yearly")}</span>
                    <span className="font-semibold">€ {fmtInt(results.gasCostYear)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("ev.calculator.ev_yearly")}</span>
                    <span className="font-semibold">€ {fmtInt(results.yearCost)}</span>
                  </div>
                  <div className="h-px bg-border/40 my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{t("ev.calculator.annual_saving")}</span>
                    <span className={`font-bold text-lg ${results.yearlySaving > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {results.yearlySaving > 0 ? "+" : ""}€ {fmtInt(results.yearlySaving)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("ev.calculator.five_year")}</span>
                    <span className={results.fiveYearSaving > 0 ? "text-emerald-400" : "text-red-400"}>
                      {results.fiveYearSaving > 0 ? "+" : ""}€ {fmtInt(results.fiveYearSaving)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="glass rounded-2xl border border-border/40 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Euro className="w-3.5 h-3.5" />
                {t("ev.calculator.based_on", { country: country.name, year: new Date().getFullYear() })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
