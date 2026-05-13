import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronLeft, ChevronRight, Check, RotateCcw, Thermometer, Users, Wallet, MapPin, Route, Gauge, Battery } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { COMPARE_MODELS, type CompareModel } from "@/data/ev-compare";

interface StepOption { value: string; label: string; desc: string; icon?: string }
interface Step {
  id: string;
  question: string;
  subtitle: string;
  icon: React.ElementType;
  options: StepOption[];
}

const STEP_ICONS: Record<string, React.ElementType> = {
  budget: Wallet,
  climate: Thermometer,
  family: Users,
  driving: MapPin,
  charging: Battery,
  roadtrips: Route,
  priority: Gauge,
};

const STEP_OPTION_ICONS: Record<string, Record<string, string>> = {
  budget: { under35: "💚", "35to55": "💛", "55to75": "🧡", over75: "❤️" },
  climate: { nordic: "❄️", continental: "🌤️", atlantic: "🌧️", mediterranean: "☀️" },
  family: { solo: "👤", small: "👨‍👩‍👦", large: "👨‍👩‍👧‍👦", dog: "🐕" },
  driving: { city: "🏙️", mixed: "🛣️", highway: "🏎️", rural: "🌄" },
  charging: { home: "🏠", workplace: "🏢", mixed_access: "⚡", public_only: "📍" },
  roadtrips: { rarely: "🏡", monthly: "📅", weekly: "🗺️", cross_border: "🌍" },
  priority: { range: "🔋", charging: "⚡", comfort: "💺", value: "💶" },
};

interface Answers {
  budget?: string;
  climate?: string;
  family?: string;
  driving?: string;
  charging?: string;
  roadtrips?: string;
  priority?: string;
}

function scoreModel(model: CompareModel, answers: Answers): number {
  let score = 0;

  // Hard budget filter
  if (answers.budget === "under35" && model.priceFrom > 35000) return -1;
  if (answers.budget === "35to55" && (model.priceFrom < 35000 || model.priceFrom > 55000)) return -1;
  if (answers.budget === "55to75" && (model.priceFrom < 35000 || model.priceFrom > 75000)) {
    if (model.priceFrom > 75000) return -1;
  }

  // Climate scoring
  if (answers.climate === "nordic" || answers.climate === "continental") {
    score += (model.range.winter / 4);
  } else {
    score += (model.range.real / 6);
  }

  // Family
  if (answers.family === "large") {
    score += model.scores.practicality * 0.8;
    score += Math.min(model.cargoL / 25, 90);
  } else if (answers.family === "dog" || answers.family === "small") {
    score += model.scores.practicality * 0.5;
    score += Math.min(model.cargoL / 40, 60);
  } else {
    score += model.scores.comfort * 0.3;
  }

  // Driving
  if (answers.driving === "highway" || answers.driving === "rural") {
    score += model.scores.longDistance;
    score -= Math.max(0, (model.motorwayEfficiency - 180) / 3);
  } else if (answers.driving === "city") {
    score += model.scores.valueForMoney * 0.7;
    score += 25;
  } else {
    score += (model.scores.longDistance + model.scores.valueForMoney) / 2;
  }

  // Charging
  if (answers.charging === "public_only") {
    score += model.scores.networkCompat;
    score += (model.charging.maxDC - 150) / 5;
  } else if (answers.charging === "home") {
    score += model.charging.maxAC * 2;
  }

  // Road trips
  if (answers.roadtrips === "weekly" || answers.roadtrips === "cross_border") {
    score += model.scores.longDistance;
    score += (model.charging.maxDC - 150) / 3;
    score -= model.charging.time10to80 / 2;
  } else if (answers.roadtrips === "monthly") {
    score += model.scores.longDistance * 0.5;
  }

  // Priority
  if (answers.priority === "range") {
    score += model.range.real / 4;
    if (answers.climate === "nordic" || answers.climate === "continental") score += model.range.winter / 5;
  } else if (answers.priority === "charging") {
    score += (model.charging.maxDC - 100) / 2;
    score -= model.charging.time10to80;
  } else if (answers.priority === "comfort") {
    score += model.scores.comfort;
  } else if (answers.priority === "value") {
    score += model.scores.valueForMoney;
    score -= (model.priceFrom - 35000) / 2000;
  }

  return Math.max(0, score);
}

function getReasonText(model: CompareModel, answers: Answers, t: (k: string, o?: Record<string, unknown>) => string): string[] {
  const reasons: string[] = [];

  if (answers.climate === "nordic" && model.range.winter >= 300) {
    reasons.push(t("ev.advisor.reasons.nordic_winter", { km: model.range.winter }));
  }
  if (answers.family === "large" && model.cargoL > 800) {
    reasons.push(t("ev.advisor.reasons.family_cargo", { l: model.cargoL.toLocaleString() }));
  }
  if (answers.roadtrips === "weekly" && model.charging.time10to80 <= 24) {
    reasons.push(t("ev.advisor.reasons.charging_time", { min: model.charging.time10to80 }));
  }
  if (answers.priority === "value" && model.scores.valueForMoney >= 85) {
    reasons.push(t("ev.advisor.reasons.value_score", { score: model.scores.valueForMoney }));
  }
  if (answers.priority === "comfort" && model.scores.comfort >= 88) {
    reasons.push(t("ev.advisor.reasons.comfort_score", { score: model.scores.comfort }));
  }
  if (answers.charging === "public_only" && model.scores.networkCompat >= 85) {
    reasons.push(t("ev.advisor.reasons.network_score", { score: model.scores.networkCompat }));
  }
  if (reasons.length < 2) {
    reasons.push(t("ev.advisor.reasons.range_default", { km: model.range.real }));
    reasons.push(t("ev.advisor.reasons.annual_default", { cost: model.annualCostEur.toLocaleString() }));
  }

  return reasons.slice(0, 3);
}

interface OptionCardProps {
  option: Step["options"][0];
  selected: boolean;
  onSelect: () => void;
}

function OptionCard({ option, selected, onSelect }: OptionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 group ${
        selected
          ? "border-accent bg-accent/10"
          : "glass border-border/40 hover:border-border/80 hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl">{option.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm">{option.label}</span>
            {selected && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
        </div>
      </div>
    </button>
  );
}

export default function EVAdvisor() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const rawSteps = t("ev.advisor.steps", { returnObjects: true }) as Array<{
    id: string;
    question: string;
    subtitle: string;
    options: { value: string; label: string; desc: string }[];
  }>;
  const STEPS: Step[] = rawSteps.map((s) => ({
    id: s.id,
    question: s.question,
    subtitle: s.subtitle,
    icon: STEP_ICONS[s.id] ?? Wallet,
    options: s.options.map((o) => ({ ...o, icon: STEP_OPTION_ICONS[s.id]?.[o.value] })),
  }));

  const step = STEPS[currentStep];
  const currentAnswer = answers[step.id as keyof Answers];
  const isLast = currentStep === STEPS.length - 1;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (isLast) {
      setShowResults(true);
    } else {
      setCurrentStep((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep((p) => p - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const results = showResults
    ? COMPARE_MODELS
        .map((m) => ({ model: m, score: scoreModel(m, answers) }))
        .filter((r) => r.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const progress = ((currentStep + (currentAnswer ? 1 : 0)) / STEPS.length) * 100;

  return (
    <PageShell>
      <SEO
        title={t("ev.advisor.seo_title")}
        description={t("ev.advisor.seo_desc")}
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> {t("ev.nav.hub")}
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> {t("ev.advisor.eyebrow")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight break-words hyphens-auto mb-5 max-w-2xl">
            {t("ev.advisor.title")} <span className="text-gradient">{t("ev.advisor.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-lg">
            {t("ev.advisor.subtitle")}
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="max-w-2xl mx-auto">
          {!showResults ? (
            <div>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{t("ev.advisor.question_of", { current: currentStep + 1, total: STEPS.length })}</span>
                  <span>{t("ev.advisor.pct_complete", { n: Math.round(progress) })}</span>
                </div>
                <div className="h-1 rounded-full bg-card overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Step indicator dots */}
              <div className="flex gap-2 mb-10">
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                      i < currentStep
                        ? "bg-accent"
                        : i === currentStep
                        ? "bg-accent/50"
                        : "bg-border/40"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <step.icon className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">{step.question}</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-12">{step.subtitle}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-10">
                {step.options.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    option={opt}
                    selected={currentAnswer === opt.value}
                    onSelect={() => handleSelect(opt.value)}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> {t("ev.advisor.back")}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLast ? t("ev.advisor.see_matches") : t("ev.advisor.next")} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-4">
                  <Check className="w-3.5 h-3.5" /> {t("ev.advisor.your_results_eyebrow")}
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-3">{t("ev.advisor.your_matches")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("ev.advisor.matches_lead")}
                </p>
              </div>

              {results.length === 0 ? (
                <div className="glass rounded-2xl border border-border/40 p-10 text-center">
                  <p className="text-muted-foreground mb-4">{t("ev.advisor.no_match")}</p>
                  <button onClick={handleRestart} className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                    <RotateCcw className="w-3.5 h-3.5" /> {t("ev.advisor.restart")}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {results.map(({ model: m }, idx) => {
                    const reasons = getReasonText(m, answers);
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div
                        key={m.slug}
                        className={`glass rounded-2xl border p-6 ${idx === 0 ? "border-accent/30 bg-accent/5" : "border-border/40"}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{medals[idx]}</span>
                              <span className={`text-[10px] uppercase tracking-widest ${m.accentColor}`}>{m.brand} · {m.category}</span>
                            </div>
                            <h3 className="font-bold text-xl">{m.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">from €{m.priceFrom.toLocaleString()}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-2xl font-bold ${m.accentColor}`}>{m.range.real}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{t("ev.advisor.real_km")}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>{m.charging.maxDC} kW</div>
                            <div className="text-[9px] text-muted-foreground uppercase">{t("ev.advisor.dc_max")}</div>
                          </div>
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>{m.range.winter} km</div>
                            <div className="text-[9px] text-muted-foreground uppercase">{t("ev.advisor.winter_range")}</div>
                          </div>
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>€{m.annualCostEur.toLocaleString()}</div>
                            <div className="text-[9px] text-muted-foreground uppercase">{t("ev.advisor.annual_cost")}</div>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          {reasons.map((r, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-3 border-t border-border/20">
                          <Link
                            to={`/ev/models/${m.slug}`}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.accentColor} hover:underline`}
                          >
                            {t("ev.compare.full_deep_dive")}
                          </Link>
                          <Link
                            to={L("/ev/compare")}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {t("ev.advisor.compare_side")}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-10 text-center">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {t("ev.advisor.start_again")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
