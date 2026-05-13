import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronLeft, SlidersHorizontal, ArrowUpDown, TrendingDown, TrendingUp, BarChart2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { VEHICLES, TYPE_COLORS, type Vehicle, type VehicleType } from "@/data/vehicles";
import { VehicleSearch } from "@/components/VehicleSearch";
import { useFormatPrice } from "@/lib/price";

type SortKey = "priceFrom" | "tco.fiveYearTcoEur" | "tco.depreciationPct5yr" | "specs.realWorldRangeKm" | "specs.zeroTo100";

function getSortValue(v: Vehicle, key: SortKey): number {
  if (key === "priceFrom") return v.priceFrom;
  if (key === "tco.fiveYearTcoEur") return v.tco.fiveYearTcoEur;
  if (key === "tco.depreciationPct5yr") return v.tco.depreciationPct5yr;
  if (key === "specs.realWorldRangeKm") return v.specs.realWorldRangeKm ?? v.specs.totalRangeKm ?? 0;
  if (key === "specs.zeroTo100") return v.specs.zeroTo100;
  return 0;
}

function BrakeWearBadge({ wear }: { wear: Vehicle["tco"]["brakeWear"] }) {
  const { t } = useTranslation();
  const map: Record<typeof wear, { key: string; color: string }> = {
    "very-low": { key: "ev.database.brake_very_low", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    low: { key: "ev.database.brake_low", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
    moderate: { key: "ev.database.brake_moderate", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    high: { key: "ev.database.brake_high", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  };
  const d = map[wear];
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wide ${d.color}`}>
      {t(d.key)}
    </span>
  );
}

function VehicleCard({ vehicle, L }: { vehicle: Vehicle; L: (p: string) => string }) {
  const { t } = useTranslation();
  const fmt = useFormatPrice();
  const target = vehicle.evPageSlug ? L(`/ev/models/${vehicle.evPageSlug}`) : null;
  const typeLabels: Record<string, string> = {
    ev: t("ev.database.filter_ev"),
    phev: t("ev.database.plug_in_hybrid"),
    "mild-hybrid": t("ev.database.mild_hybrid"),
    diesel: t("ev.database.filter_diesel"),
  };

  return (
    <div className="glass rounded-2xl border border-border/40 hover:border-border/70 transition-all duration-200 hover:-translate-y-0.5 group overflow-hidden">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-medium ${TYPE_COLORS[vehicle.type]}`}>
                {typeLabels[vehicle.type] ?? vehicle.type}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{vehicle.body}</span>
            </div>
            <h3 className="font-semibold text-sm">{vehicle.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base font-bold text-gradient">{fmt(vehicle.priceFrom)}</div>
            <div className="text-[9px] text-muted-foreground">{t("ev.database.price_from_label")}</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{vehicle.tagline}</p>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border/20">
        {vehicle.type === "ev" ? (
          <>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-emerald-400">{vehicle.specs.realWorldRangeKm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{t("ev.database.unit_real_km")}</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-cyan-400">{vehicle.specs.winterRangeKm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{t("ev.database.unit_winter_km")}</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-violet-400">{vehicle.specs.maxDCKw}</div>
              <div className="text-[9px] text-muted-foreground uppercase">kW DC</div>
            </div>
          </>
        ) : vehicle.type === "phev" ? (
          <>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-cyan-400">{vehicle.specs.electricRangeKm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{t("ev.database.unit_ev_km")}</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-foreground">{vehicle.specs.totalRangeKm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{t("ev.database.unit_total_km")}</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-amber-400">{vehicle.specs.co2gkm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">g/km CO₂</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-amber-400">{vehicle.specs.fuelConsumptionL100km}</div>
              <div className="text-[9px] text-muted-foreground uppercase">L/100km</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-foreground">{vehicle.specs.co2gkm}</div>
              <div className="text-[9px] text-muted-foreground uppercase">g/km CO₂</div>
            </div>
            <div className="bg-card/50 p-3 text-center">
              <div className="text-sm font-bold text-foreground">{vehicle.specs.zeroTo100}s</div>
              <div className="text-[9px] text-muted-foreground uppercase">0–100</div>
            </div>
          </>
        )}
      </div>

      <div className="p-5 pt-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("ev.database.tco_label")}</span>
          <span className="font-semibold">{fmt(vehicle.tco.fiveYearTcoEur)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("ev.database.annual_fuel_charge")}</span>
          <span className="font-semibold">{fmt(vehicle.tco.annualFuelOrChargingEur)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("ev.database.brake_wear")}</span>
          <BrakeWearBadge wear={vehicle.tco.brakeWear} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("ev.database.depreciation_3yr")}</span>
          <span className={`font-semibold ${vehicle.tco.depreciationPct3yr <= 30 ? "text-emerald-400" : vehicle.tco.depreciationPct3yr <= 38 ? "text-amber-400" : "text-red-400"}`}>
            {vehicle.tco.depreciationPct3yr}%
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 flex items-center gap-3">
        {target ? (
          <Link
            to={target}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
          >
            {t("ev.database.full_deep_dive")} <ChevronRight className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">{t("ev.database.overview_only")}</span>
        )}
        <Link
          to={L("/ev/compare")}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <BarChart2 className="w-3 h-3" /> {t("ev.database.compare")}
        </Link>
      </div>
    </div>
  );
}

function TCOTable({ vehicles }: { vehicles: Vehicle[] }) {
  const { t } = useTranslation();
  const fmt = useFormatPrice();
  const typeLabels: Record<string, string> = {
    ev: t("ev.database.filter_ev"),
    phev: t("ev.database.plug_in_hybrid"),
    "mild-hybrid": t("ev.database.mild_hybrid"),
    diesel: t("ev.database.filter_diesel"),
  };
  const headers = [
    t("ev.database.tbl_vehicle"),
    t("ev.database.tbl_type"),
    t("ev.database.tbl_price_from"),
    t("ev.database.annual_fuel_charge"),
    t("ev.database.tbl_annual_service"),
    t("ev.database.tco_label"),
    t("ev.database.tbl_depreciation"),
    t("ev.database.brake_wear"),
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-xs">
        <thead>
          <tr className="border-b border-border/30">
            {headers.map((h) => (
              <th key={h} className="text-left text-muted-foreground font-normal py-3 px-3 first:pl-0 last:pr-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {vehicles.map((v) => (
            <tr key={v.slug} className="hover:bg-card/20 transition-colors">
              <td className="py-3 px-3 pl-0 font-medium">{v.name}</td>
              <td className="py-3 px-3">
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full border font-medium tracking-wide ${TYPE_COLORS[v.type]}`}>
                  {typeLabels[v.type] ?? v.type}
                </span>
              </td>
              <td className="py-3 px-3">{fmt(v.priceFrom)}</td>
              <td className="py-3 px-3">{fmt(v.tco.annualFuelOrChargingEur)}</td>
              <td className="py-3 px-3">{fmt(v.tco.annualServiceEur)}</td>
              <td className="py-3 px-3 font-semibold">{fmt(v.tco.fiveYearTcoEur)}</td>
              <td className="py-3 px-3">
                <span className={v.tco.depreciationPct3yr <= 30 ? "text-emerald-400" : v.tco.depreciationPct3yr <= 38 ? "text-amber-400" : "text-red-400"}>
                  {v.tco.depreciationPct3yr}%
                </span>
              </td>
              <td className="py-3 px-3 pr-0"><BrakeWearBadge wear={v.tco.brakeWear} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EVDatabase() {
  const { t } = useTranslation();
  const fmt = useFormatPrice();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const [typeFilter, setTypeFilter] = useState<VehicleType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("priceFrom");
  const [sortAsc, setSortAsc] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "priceFrom", label: t("ev.database.sort_price_from") },
    { value: "tco.fiveYearTcoEur", label: t("ev.database.sort_tco") },
    { value: "tco.depreciationPct5yr", label: t("ev.database.sort_depreciation") },
    { value: "specs.realWorldRangeKm", label: t("ev.database.sort_range") },
    { value: "specs.zeroTo100", label: t("ev.database.sort_0_100") },
  ];

  const typeGroups: { value: VehicleType | "all"; label: string; count: number }[] = [
    { value: "all", label: t("ev.database.all_vehicles"), count: VEHICLES.length },
    { value: "ev", label: t("ev.database.filter_ev"), count: VEHICLES.filter((v) => v.type === "ev").length },
    { value: "phev", label: t("ev.database.plug_in_hybrid"), count: VEHICLES.filter((v) => v.type === "phev").length },
    { value: "mild-hybrid", label: t("ev.database.mild_hybrid"), count: VEHICLES.filter((v) => v.type === "mild-hybrid").length },
    { value: "diesel", label: t("ev.database.filter_diesel"), count: VEHICLES.filter((v) => v.type === "diesel").length },
  ];

  const filtered = useMemo(() => {
    const base = typeFilter === "all" ? VEHICLES : VEHICLES.filter((v) => v.type === typeFilter);
    return [...base].sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      return sortAsc ? av - bv : bv - av;
    });
  }, [typeFilter, sortKey, sortAsc]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "";

  const stats = [
    { value: `${VEHICLES.length}`, label: t("ev.database.stat_count_label"), icon: TrendingUp },
    { value: `${VEHICLES.filter((v) => v.type === "ev").length}`, label: t("ev.database.stat_ev_label"), icon: Zap },
    { value: fmt(17000), label: t("ev.database.stat_lowest_label"), icon: TrendingDown },
    { value: fmt(42000), label: t("ev.database.stat_highest_label"), icon: TrendingUp },
  ];

  const tcoBoxes = [
    { label: t("ev.database.tco_box_fuel"), desc: "Based on 20,000 km/year. EVs use average home + public mix. ICE uses European average fuel price." },
    { label: t("ev.database.tco_box_service"), desc: "Manufacturer-recommended intervals. EVs have fewer service items — no oil, brake fluid, timing chains." },
    { label: t("ev.database.tco_box_tyres"), desc: "Based on realistic wear rates. Heavier EVs and performance vehicles consume tyres faster." },
    { label: t("ev.database.brake_wear"), desc: "EVs with strong regenerative braking use friction brakes minimally. ICE brakes wear at conventional rates." },
  ];

  return (
    <PageShell>
      <SEO
        title={t("ev.database.seo_title")}
        description={t("ev.database.seo_desc")}
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> {t("ev.nav.hub")}
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-accent mb-5">
            <Zap className="w-3.5 h-3.5" /> {t("ev.database.eyebrow")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl">
            {t("ev.database.title")} <span className="text-gradient">{t("ev.database.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg mb-8">
            {t("ev.database.subtitle")}
          </p>
          <VehicleSearch placeholder={t("ev.database.search_ph")} className="max-w-md" />
        </div>
      </section>

      <section className="border-y border-border/40 bg-card/30">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {typeGroups.map((g) => (
              <button
                key={g.value}
                onClick={() => setTypeFilter(g.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  typeFilter === g.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "glass border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {g.label} <span className="opacity-60 ml-1">{g.count}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 glass rounded-xl border border-border/40 px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="text-xs bg-transparent outline-none text-muted-foreground"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex glass rounded-xl border border-border/40 overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 text-xs transition-colors ${view === "grid" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("ev.database.cards")}
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-xs transition-colors ${view === "table" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("ev.database.table")}
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-6">
          {t("ev.database.results", { n: filtered.length })} · {t("ev.database.sorted_by")} {sortLabel} ({sortAsc ? t("ev.database.dir_asc") : t("ev.database.dir_desc")})
        </div>

        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} L={L} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl border border-border/40 p-6">
            <TCOTable vehicles={filtered} />
          </div>
        )}
      </section>

      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-8 md:p-12">
          <h2 className="text-xl font-bold tracking-tight mb-2">{t("ev.database.how_tco_title")}</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">{t("ev.database.how_tco_lead")}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tcoBoxes.map((item) => (
              <div key={item.label} className="bg-card/40 rounded-xl p-4">
                <div className="text-xs font-semibold mb-1.5">{item.label}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
