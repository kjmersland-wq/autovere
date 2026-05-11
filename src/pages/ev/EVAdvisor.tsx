import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronLeft, ChevronRight, Check, RotateCcw, ArrowRight, Thermometer, Users, Wallet, MapPin, Route, Gauge, Battery } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { COMPARE_MODELS, type CompareModel } from "@/data/ev-compare";

interface Step {
  id: string;
  question: string;
  subtitle: string;
  icon: React.ElementType;
  options: { value: string; label: string; desc: string; icon?: string }[];
}

const STEPS: Step[] = [
  {
    id: "budget",
    question: "What's your budget?",
    subtitle: "This is the single biggest filter. We'll only show you what fits.",
    icon: Wallet,
    options: [
      { value: "under35", label: "Under €35,000", desc: "Compact EVs with strong value", icon: "💚" },
      { value: "35to55", label: "€35,000 – €55,000", desc: "Mid-range and family EVs", icon: "💛" },
      { value: "55to75", label: "€55,000 – €75,000", desc: "Premium and large SUVs", icon: "🧡" },
      { value: "over75", label: "Over €75,000", desc: "Flagship performance EVs", icon: "❤️" },
    ],
  },
  {
    id: "climate",
    question: "Where do you live and drive most?",
    subtitle: "Climate dramatically affects real-world EV range — especially in winter.",
    icon: Thermometer,
    options: [
      { value: "nordic", label: "Nordic / Alpine", desc: "Norway, Sweden, Finland, mountain regions — cold winters", icon: "❄️" },
      { value: "continental", label: "Continental Europe", desc: "Germany, Poland, France — cold winters, warm summers", icon: "🌤️" },
      { value: "atlantic", label: "Atlantic / British Isles", desc: "UK, Ireland, coastal France — mild but wet", icon: "🌧️" },
      { value: "mediterranean", label: "Mediterranean", desc: "Spain, Italy, southern France — warm, mild winters", icon: "☀️" },
    ],
  },
  {
    id: "family",
    question: "Who's riding with you?",
    subtitle: "Family size determines cargo space and seat count priorities.",
    icon: Users,
    options: [
      { value: "solo", label: "Solo or couple", desc: "Two adults, minimal luggage needs", icon: "👤" },
      { value: "small", label: "Small family", desc: "2 adults, 1–2 children, occasional cargo", icon: "👨‍👩‍👦" },
      { value: "large", label: "Large family", desc: "3+ children or regular 5+ adult travel", icon: "👨‍👩‍👧‍👦" },
      { value: "dog", label: "Dog or gear", desc: "Regular large cargo, sports equipment, pets", icon: "🐕" },
    ],
  },
  {
    id: "driving",
    question: "How do you mostly drive?",
    subtitle: "Urban and highway driving have very different EV efficiency profiles.",
    icon: MapPin,
    options: [
      { value: "city", label: "Mostly city", desc: "Short trips, stop-start, under 50 km daily", icon: "🏙️" },
      { value: "mixed", label: "Mixed city and highway", desc: "Commuting plus occasional longer trips", icon: "🛣️" },
      { value: "highway", label: "Mostly highway", desc: "Long commutes, frequent motorway use", icon: "🏎️" },
      { value: "rural", label: "Rural and regional", desc: "Varied terrain, longer distances, fewer chargers", icon: "🌄" },
    ],
  },
  {
    id: "charging",
    question: "Where will you charge?",
    subtitle: "Home charging dramatically changes EV economics and convenience.",
    icon: Battery,
    options: [
      { value: "home", label: "Home garage or driveway", desc: "Can install a wallbox — ideal EV setup", icon: "🏠" },
      { value: "workplace", label: "Workplace charging", desc: "Employer provides charging access", icon: "🏢" },
      { value: "mixed_access", label: "Home + public mix", desc: "Some home access, some public top-ups", icon: "⚡" },
      { value: "public_only", label: "Public charging only", desc: "No home access — network compatibility critical", icon: "📍" },
    ],
  },
  {
    id: "roadtrips",
    question: "How often do you road trip?",
    subtitle: "Charging stop frequency and network coverage matter more for frequent travellers.",
    icon: Route,
    options: [
      { value: "rarely", label: "Rarely", desc: "Mostly local driving, occasional longer trip", icon: "🏡" },
      { value: "monthly", label: "Monthly", desc: "A long drive roughly once a month", icon: "📅" },
      { value: "weekly", label: "Weekly", desc: "Regular long-distance travel", icon: "🗺️" },
      { value: "cross_border", label: "International", desc: "Regularly cross European borders", icon: "🌍" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    subtitle: "If you could only optimise one thing, what would it be?",
    icon: Gauge,
    options: [
      { value: "range", label: "Maximum range", desc: "I want the most km possible between charges", icon: "🔋" },
      { value: "charging", label: "Fastest charging", desc: "Charge stop time matters more than range", icon: "⚡" },
      { value: "comfort", label: "Comfort and quality", desc: "Interior, ride quality, refinement", icon: "💺" },
      { value: "value", label: "Best value", desc: "Most capability per euro spent", icon: "💶" },
    ],
  },
];

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

function getReasonText(model: CompareModel, answers: Answers): string[] {
  const reasons: string[] = [];

  if (answers.climate === "nordic" && model.range.winter >= 300) {
    reasons.push(`${model.range.winter} km winter range — reliable in cold conditions`);
  }
  if (answers.family === "large" && model.cargoL > 800) {
    reasons.push(`${model.cargoL.toLocaleString()} L cargo — genuine family capacity`);
  }
  if (answers.roadtrips === "weekly" && model.charging.time10to80 <= 24) {
    reasons.push(`${model.charging.time10to80}-min charge time — efficient stop strategy`);
  }
  if (answers.priority === "value" && model.scores.valueForMoney >= 85) {
    reasons.push(`${model.scores.valueForMoney}/100 value score — strong cost-capability ratio`);
  }
  if (answers.priority === "comfort" && model.scores.comfort >= 88) {
    reasons.push(`${model.scores.comfort}/100 comfort score — premium ride quality`);
  }
  if (answers.charging === "public_only" && model.scores.networkCompat >= 85) {
    reasons.push(`${model.scores.networkCompat}/100 network score — broad charging compatibility`);
  }
  if (reasons.length < 2) {
    reasons.push(`${model.range.real} km real-world range`);
    reasons.push(`€${model.annualCostEur.toLocaleString()} estimated annual charging cost`);
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

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

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
        title="EV Buying Advisor — Find Your Perfect EV | AUTOVERE"
        description="Answer 7 questions and get personalised EV recommendations matched to your budget, climate, family size and driving habits. European EVs compared honestly."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> EV Hub
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Advisor
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Find your perfect EV. <span className="text-gradient">7 questions.</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-lg">
            Tell us about your life. We'll match you to the right electric car — not the most popular one, the right one.
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
                  <span>Question {currentStep + 1} of {STEPS.length}</span>
                  <span>{Math.round(progress)}% complete</span>
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
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLast ? "See my matches" : "Next"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-4">
                  <Check className="w-3.5 h-3.5" /> Your personalised results
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-3">Your best EV matches</h2>
                <p className="text-sm text-muted-foreground">
                  Based on your budget, climate, lifestyle and priorities — ranked by fit score.
                </p>
              </div>

              {results.length === 0 ? (
                <div className="glass rounded-2xl border border-border/40 p-10 text-center">
                  <p className="text-muted-foreground mb-4">No perfect match found for your exact combination. Try adjusting your budget or priorities.</p>
                  <button onClick={handleRestart} className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                    <RotateCcw className="w-3.5 h-3.5" /> Restart advisor
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
                            <div className="text-[10px] text-muted-foreground uppercase">Real km</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>{m.charging.maxDC} kW</div>
                            <div className="text-[9px] text-muted-foreground uppercase">DC max</div>
                          </div>
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>{m.range.winter} km</div>
                            <div className="text-[9px] text-muted-foreground uppercase">Winter range</div>
                          </div>
                          <div className="bg-card/60 rounded-lg p-2 text-center">
                            <div className={`text-sm font-bold ${m.accentColor}`}>€{m.annualCostEur.toLocaleString()}</div>
                            <div className="text-[9px] text-muted-foreground uppercase">Annual cost</div>
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
                            Full deep-dive <ArrowRight className="w-3 h-3" />
                          </Link>
                          <Link
                            to={L("/ev/compare")}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Compare side by side →
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
                  <RotateCcw className="w-3.5 h-3.5" /> Start again with different preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
