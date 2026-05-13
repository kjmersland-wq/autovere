import { Link, useLocation } from "react-router-dom";
import {
  Warehouse, CreditCard, Route, Zap, Calculator, BookOpen,
  Wrench, MessageCircle, ArrowRight, Shield, LogIn,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const TOPIC_VISUALS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  account: { icon: LogIn, color: "text-accent", bg: "bg-accent/10" },
  premium: { icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  garage: { icon: Warehouse, color: "text-violet-400", bg: "bg-violet-400/10" },
  planner: { icon: Route, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  networks: { icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
  calculator: { icon: Calculator, color: "text-rose-400", bg: "bg-rose-400/10" },
  articles: { icon: BookOpen, color: "text-teal-400", bg: "bg-teal-400/10" },
  trouble: { icon: Wrench, color: "text-orange-400", bg: "bg-orange-400/10" },
  privacy: { icon: Shield, color: "text-sky-400", bg: "bg-sky-400/10" },
  support: { icon: MessageCircle, color: "text-pink-400", bg: "bg-pink-400/10" },
};

interface TopicLink { label: string; to: string }
interface Topic { key: string; title: string; body: string; links: TopicLink[] }

export default function Help() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();
  const topics = (t("pages.help_full.topics", { returnObjects: true }) as Topic[]) || [];

  return (
    <PageShell>
      <SEO title={t("pages.help_full.seo_title")} description={t("pages.help_full.seo_desc")} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{t("pages.help_full.eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("pages.help_full.h1_a")} <span className="text-gradient">{t("pages.help_full.h1_b")}</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">{t("pages.help_full.lead")}</p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {topics.map((topic) => {
            const v = TOPIC_VISUALS[topic.key] ?? TOPIC_VISUALS.support;
            const Icon = v.icon;
            return (
              <div key={topic.key} className="glass rounded-2xl border border-border/40 p-6 hover:border-border/70 transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${v.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${v.color}`} />
                  </div>
                  <h2 className="text-sm font-semibold">{topic.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{topic.body}</p>
                {topic.links && topic.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border/20">
                    {topic.links.map((link) => (
                      <Link key={link.to} to={L(link.to)} className={`inline-flex items-center gap-1 text-xs font-medium ${v.color} hover:underline`}>
                        {link.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container pb-24">
        <div className="max-w-4xl">
          <div className="glass rounded-2xl border border-border/40 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">{t("pages.help_full.faq_h")}</h3>
              <p className="text-sm text-muted-foreground">{t("pages.help_full.faq_lead")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to={L("/faq")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border/40 hover:border-accent/40 text-sm font-medium transition-colors">
                {t("pages.help_full.faq_btn")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={L("/contact")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                {t("pages.help_full.contact_btn")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
