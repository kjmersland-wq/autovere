import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronLeft, Check, Trophy, TrendingDown, TrendingUp, Info } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { COMPARE_MODELS, COMPARE_CATEGORIES, getNestedValue, getBestValue, type CompareModel } from "@/data/ev-compare";

const MAX_SELECTIONS = 3;

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 100);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="h-1.5 rounded-full bg-card overflow-hidden w-full">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function ModelSelector({ models, selected, onToggle }: {
  models: CompareModel[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {models.map((m) => {
        const isSelected = selected.includes(m.slug);
        const isDisabled = !isSelected && selected.length >= MAX_SELECTIONS;
        return (
          <button
            key={m.slug}
            onClick={() => !isDisabled && onToggle(m.slug)}
            disabled={isDisabled}
            className={`relative text-left rounded-2xl border p-4 transition-all duration-200 ${
              isSelected
                ? "border-accent bg-accent/10"
                : isDisabled
                ? "border-border/20 opacity-40 cursor-not-allowed"
                : "glass border-border/40 hover:border-border/80 hover:-translate-y-0.5"
            }`}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div className={`text-[9px] uppercase tracking-widest mb-1 ${m.accentColor}`}>{m.brand}</div>
            <div className="font-semibold text-sm leading-tight mb-1">{m.name}</div>
            <div className="text-[10px] text-muted-foreground">{m.category}</div>
            <div className={`text-sm font-bold mt-2 ${m.accentColor}`}>
              {m.range.real} km
            </div>
            <div className="text-[9px] text-muted-foreground">real-world range</div>
          </button>
        );
      })}
    </div>
  );
}

function ComparisonTable({ selected }: { selected: CompareModel[] }) {
  const accentColors: Record<string, string> = {
    "text-red-400": "bg-red-400",
    "text-yellow-400": "bg-yellow-400",
    "text-emerald-400": "bg-emerald-400",
    "text-cyan-400": "bg-cyan-400",
    "text-blue-400": "bg-blue-400",
    "text-violet-400": "bg-violet-400",
    "text-sky-400": "bg-sky-400",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            <th className="text-left text-xs text-muted-foreground font-normal pb-4 pr-4 w-48">Metric</th>
            {selected.map((m) => (
              <th key={m.slug} className="text-center pb-4 px-2">
                <div className={`text-[9px] uppercase tracking-widest mb-0.5 ${m.accentColor}`}>{m.brand}</div>
                <div className="font-semibold text-sm">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">from €{m.priceFrom.toLocaleString()}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_CATEGORIES.map((cat, idx) => {
            const values = selected.map((m) => getNestedValue(m, cat.key));
            const bestValue = getBestValue(selected, cat.key, cat.higherBetter);

            return (
              <tr
                key={cat.key}
                className={`border-t border-border/20 ${idx % 2 === 0 ? "" : "bg-card/20"}`}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{cat.label}</span>
                    <div className="group relative">
                      <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-1 w-48 p-2 glass rounded-lg border border-border/40 text-[10px] text-muted-foreground hidden group-hover:block z-10 leading-relaxed">
                        {cat.description}
                      </div>
                    </div>
                  </div>
                </td>
                {selected.map((m, mi) => {
                  const value = values[mi];
                  const isBest = value === bestValue;
                  const barColor = accentColors[m.accentColor] || "bg-accent";

                  return (
                    <td key={m.slug} className="py-3 px-2 text-center">
                      <div className={`text-sm font-semibold mb-1 ${isBest ? m.accentColor : "text-foreground"}`}>
                        {cat.type === "cost" ? `€${value.toLocaleString()}` : cat.unit === "€" ? `€${value.toLocaleString()}` : `${value}${cat.unit}`}
                        {isBest && selected.length > 1 && (
                          <Trophy className="w-3 h-3 inline ml-1 text-amber-400" />
                        )}
                      </div>
                      {cat.type === "score" && (
                        <ScoreBar value={value} max={100} color={isBest ? barColor : "bg-muted-foreground/40"} />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VerdictCards({ selected }: { selected: CompareModel[] }) {
  return (
    <div className={`grid gap-6 ${selected.length === 2 ? "md:grid-cols-2" : selected.length === 3 ? "lg:grid-cols-3" : "grid-cols-1"}`}>
      {selected.map((m) => (
        <div key={m.slug} className={`glass rounded-2xl border p-6 space-y-4`} style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div>
            <div className={`text-[10px] uppercase tracking-widest mb-1 ${m.accentColor}`}>{m.brand} · {m.category}</div>
            <h3 className="font-semibold text-lg">{m.name}</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card/60 rounded-lg p-2 text-center">
              <div className={`text-base font-bold ${m.accentColor}`}>{m.range.real}</div>
              <div className="text-[9px] text-muted-foreground uppercase">Real km</div>
            </div>
            <div className="bg-card/60 rounded-lg p-2 text-center">
              <div className={`text-base font-bold ${m.accentColor}`}>{m.charging.maxDC}</div>
              <div className="text-[9px] text-muted-foreground uppercase">kW DC</div>
            </div>
            <div className="bg-card/60 rounded-lg p-2 text-center">
              <div className={`text-base font-bold ${m.accentColor}`}>{m.charging.time10to80}</div>
              <div className="text-[9px] text-muted-foreground uppercase">min 10–80%</div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{m.verdict}</p>

          <div className="space-y-2 pt-2 border-t border-border/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-emerald-400 font-medium">Best for: </span>{m.bestFor}</p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingDown className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-red-400 font-medium">Not ideal: </span>{m.worstFor}</p>
            </div>
          </div>

          <Link
            to={`/ev/models/${m.slug}`}
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.accentColor} hover:underline`}
          >
            Full model deep-dive →
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function EVCompare() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const [selected, setSelected] = useState<string[]>(["tesla-model-y", "audi-q6-etron"]);

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const selectedModels = COMPARE_MODELS.filter((m) => selected.includes(m.slug));

  return (
    <PageShell>
      <SEO
        title="EV Comparison Engine — Best European EVs Compared | AUTOVERE"
        description="Compare Tesla Model Y, Porsche Macan EV, BMW i5, Audi Q6 e-tron, Kia EV9, Hyundai Ioniq 5 and more. Real-world range, charging speed, winter performance and ownership cost."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> EV Hub
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Compare
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl">
            EV comparison engine. <span className="text-gradient">Honest data, real verdicts.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Select up to {MAX_SELECTIONS} EVs. Compare real-world range, charging performance, ownership costs and expert analysis side by side.
          </p>
        </div>
      </section>

      {/* Model selector */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Select models to compare</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {selected.length} of {MAX_SELECTIONS} selected
            </p>
          </div>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>
        <ModelSelector models={COMPARE_MODELS} selected={selected} onToggle={toggle} />
      </section>

      {/* Comparison table */}
      {selectedModels.length >= 2 && (
        <section className="container pb-16">
          <div className="glass rounded-3xl border border-border/40 p-6 md:p-10">
            <h2 className="text-xl font-bold tracking-tight mb-8">Side-by-side comparison</h2>
            <ComparisonTable selected={selectedModels} />
          </div>
        </section>
      )}

      {selectedModels.length === 1 && (
        <section className="container pb-16">
          <div className="glass rounded-2xl border border-border/40 p-8 text-center text-muted-foreground">
            <p className="text-sm">Select at least one more model to begin comparing.</p>
          </div>
        </section>
      )}

      {selectedModels.length === 0 && (
        <section className="container pb-16">
          <div className="glass rounded-2xl border border-border/40 p-8 text-center text-muted-foreground">
            <p className="text-sm">Select 2–3 models above to start your comparison.</p>
          </div>
        </section>
      )}

      {/* AI verdicts */}
      {selectedModels.length >= 1 && (
        <section className="container pb-24">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-2">Analysis</p>
            <h2 className="text-2xl font-bold tracking-tight">Expert ownership verdicts</h2>
            <p className="text-sm text-muted-foreground mt-1">Synthesised from real-world data, reviewer consensus and ownership analysis.</p>
          </div>
          <VerdictCards selected={selectedModels} />
        </section>
      )}

      {/* CTA */}
      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Not sure which EV fits your life?</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-7 text-sm leading-relaxed">
              Our AI buying advisor asks 7 questions and matches you to the best EV for your budget, climate, family and driving habits.
            </p>
            <Link
              to={L("/ev/advisor")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Start the advisor →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
