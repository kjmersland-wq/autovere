import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Battery, Thermometer, Zap, Car, Shield, BarChart3, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";

interface Guide {
  id: string;
  icon: typeof Battery;
  category: string;
}

const GUIDES: Guide[] = [
  { id: "battery-longevity", icon: Battery, category: "Battery" },
  { id: "winter-driving", icon: Thermometer, category: "Winter" },
  { id: "regen-braking", icon: Zap, category: "Driving" },
  { id: "brake-discs", icon: Car, category: "Maintenance" },
  { id: "charging-etiquette", icon: Shield, category: "Charging" },
  { id: "tyre-wear", icon: Car, category: "Maintenance" },
  { id: "fast-charging", icon: Zap, category: "Charging" },
  { id: "long-term-ownership", icon: BarChart3, category: "Ownership" },
];

const CATEGORIES = ["All", ...Array.from(new Set(GUIDES.map((g) => g.category)))];

export default function EVGuides() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categoryLabel: Record<string, string> = {
    All: t("ev.guides.filter_all"),
    Battery: t("ev.guides.filter_battery"),
    Winter: t("ev.guides.filter_winter"),
    Driving: t("ev.guides.filter_driving"),
    Maintenance: t("ev.guides.filter_maintenance"),
    Charging: t("ev.guides.filter_charging"),
    Ownership: t("ev.guides.filter_ownership"),
  };

  const filtered = activeCategory === "All" ? GUIDES : GUIDES.filter((g) => g.category === activeCategory);

  return (
    <PageShell>
      <SEO
        title={t("ev.guides.seo_title")}
        description={t("ev.guides.seo_desc")}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-transparent to-orange-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-amber-400 mb-5">
            <BookOpen className="w-3.5 h-3.5" /> {t("ev.guides.eyebrow")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight break-words hyphens-auto mb-5 max-w-2xl">
            {t("ev.guides.title")} <span className="text-gradient">{t("ev.guides.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            {t("ev.guides.subtitle")}
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-20 z-30">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "glass border-border/40 text-muted-foreground hover:text-foreground"}`}
              >
                {categoryLabel[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {filtered.map((guide) => {
            const isOpen = expanded === guide.id;
            const title = t(`ev.guides.items.${guide.id}.title`);
            const summary = t(`ev.guides.items.${guide.id}.summary`);
            const body = t(`ev.guides.items.${guide.id}.body`, { returnObjects: true }) as string[];
            const tips = t(`ev.guides.items.${guide.id}.tips`, { returnObjects: true }) as string[];
            return (
              <div key={guide.id} className="glass rounded-2xl border border-border/40 overflow-hidden hover:border-border/70 transition-colors">
                {/* Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : guide.id)}
                  className="w-full flex items-start gap-5 p-6 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <guide.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{categoryLabel[guide.category] ?? guide.category}</div>
                    <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-foreground transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-border/40 pt-5">
                    <div className="space-y-4 mb-6">
                      {Array.isArray(body) && body.map((para, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
                      ))}
                    </div>
                    <div className="bg-card/50 rounded-xl p-4">
                      <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">{t("ev.guides.key_takeaways")}</div>
                      <ul className="space-y-2">
                        {Array.isArray(tips) && tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
