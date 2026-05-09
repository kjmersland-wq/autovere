import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Sparkles, Shield, CreditCard, Bot, MessageCircle, Lock } from "lucide-react";
import { LLink } from "@/i18n/routing";

export default function Help() {
  const { t } = useTranslation();
  const TOPICS = [
    { icon: <Sparkles className="w-5 h-5" />, title: t("pages.help.topics.t1_t"), body: t("pages.help.topics.t1_b") },
    { icon: <CreditCard className="w-5 h-5" />, title: t("pages.help.topics.t2_t"), body: t("pages.help.topics.t2_b") },
    { icon: <Bot className="w-5 h-5" />, title: t("pages.help.topics.t3_t"), body: t("pages.help.topics.t3_b") },
    { icon: <Shield className="w-5 h-5" />, title: t("pages.help.topics.t4_t"), body: t("pages.help.topics.t4_b") },
    { icon: <Lock className="w-5 h-5" />, title: t("pages.help.topics.t5_t"), body: t("pages.help.topics.t5_b") },
    { icon: <MessageCircle className="w-5 h-5" />, title: t("pages.help.topics.t6_t"), body: t("pages.help.topics.t6_b") },
  ];

  return (
    <PageShell>
      <SEO title={t("pages.help.seo_title")} description={t("pages.help.seo_desc")} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-gradient-glow blur-3xl opacity-40" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5" /> {t("pages.help.eyebrow")}
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">{t("pages.help.h1")}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.help.lead")}</p>
          </div>
        </div>
      </section>

      <section className="container pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOPICS.map((tt) => (
          <LLink key={tt.title} to="/contact" className="glass rounded-2xl p-7 group hover:border-primary/40 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 border border-primary/20 flex items-center justify-center mb-5 text-primary">
              {tt.icon}
            </div>
            <div className="font-semibold mb-2">{tt.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tt.body}</p>
          </LLink>
        ))}
      </section>

      <section className="container pb-32">
        <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{t("pages.help.still_human")}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t("pages.help.still_human_lead")}</p>
          <LLink to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-sm font-medium">
            {t("pages.help.contact_team")} <Sparkles className="w-4 h-4" />
          </LLink>
        </div>
      </section>
    </PageShell>
  );
}
