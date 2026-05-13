import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Brain, Zap, Route, Database, Shield, Clock, Globe, Sliders, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const SECTION_VISUALS: Record<string, { icon: React.ElementType; color: string }> = {
  about: { icon: Brain, color: "text-accent" },
  scores: { icon: Database, color: "text-cyan-400" },
  tools: { icon: Route, color: "text-emerald-400" },
  networks: { icon: Zap, color: "text-amber-400" },
  premium: { icon: Shield, color: "text-violet-400" },
  content: { icon: Clock, color: "text-rose-400" },
  countries: { icon: Globe, color: "text-teal-400" },
  personal: { icon: Sliders, color: "text-orange-400" },
};

interface Item { q: string; a: string }
interface Section { key: string; title: string; items: Item[] }

function AccordionItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-medium hover:text-accent transition-colors"
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[600px] pb-4" : "max-h-0"}`}>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();
  const sections = (t("pages.faq_full.sections", { returnObjects: true }) as Section[]) || [];

  return (
    <PageShell>
      <SEO
        title={t("pages.faq_full.seo_title")}
        description={t("pages.faq_full.seo_desc")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: sections.flatMap((s) =>
            s.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            }))
          ),
        }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{t("pages.faq_full.eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("pages.faq_full.h1_a")}<br />
              <span className="text-gradient">{t("pages.faq_full.h1_b")}</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">{t("pages.faq_full.lead")}</p>
          </div>
        </div>
      </section>

      <section className="container py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 max-w-5xl">
          <nav className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              {sections.map((s) => {
                const v = SECTION_VISUALS[s.key] ?? SECTION_VISUALS.about;
                const Icon = v.icon;
                return (
                  <a key={s.key} href={`#${s.key}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card/60 transition-colors">
                    <Icon className={`w-3.5 h-3.5 ${v.color} flex-shrink-0`} />
                    {s.title}
                  </a>
                );
              })}
            </div>
          </nav>

          <div className="space-y-8">
            {sections.map((s) => {
              const v = SECTION_VISUALS[s.key] ?? SECTION_VISUALS.about;
              const Icon = v.icon;
              return (
                <div key={s.key} id={s.key} className="glass rounded-2xl border border-border/40 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-8 h-8 rounded-lg bg-card/80 flex items-center justify-center ${v.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-semibold">{s.title}</h2>
                  </div>
                  <div>
                    {s.items.map((item) => (
                      <AccordionItem key={item.q} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 max-w-5xl">
          <div className="glass rounded-2xl border border-border/40 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">{t("pages.faq_full.still_h")}</h3>
              <p className="text-sm text-muted-foreground">{t("pages.faq_full.still_lead")}</p>
            </div>
            <Link to={L("/contact")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
              {t("pages.faq_full.contact_btn")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
