import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { LLink } from "@/i18n/routing";
import { Sparkles, ChevronRight } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface Props {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  seoTitle: string;
  seoDescription: string;
}

export const LegalPage = ({ eyebrow, title, intro, updated, sections, seoTitle, seoDescription }: Props) => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={seoTitle} description={seoDescription} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-gradient-glow blur-3xl opacity-40" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">{title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{intro}</p>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70 mt-8">
              {t("legal.last_updated")} · {updated}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-28 grid lg:grid-cols-[260px_1fr] gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-1.5 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">{t("legal.on_this_page")}</div>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        <article className="max-w-2xl space-y-14 leading-relaxed">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">{s.title}</h2>
              <div className="space-y-4 text-[15px] text-muted-foreground [&_strong]:text-foreground/90 [&_a]:text-foreground [&_a]:underline-offset-4 hover:[&_a]:underline">
                {s.body}
              </div>
            </section>
          ))}

          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            {t("legal.have_question")}{" "}
            <LLink to="/contact" className="text-foreground underline-offset-4 hover:underline">
              {t("legal.contact_team")}
            </LLink>{" "}
            {t("legal.every_message")}
          </div>

          <div className="text-xs text-muted-foreground/80 leading-relaxed border-t border-border/30 pt-8">
            <div className="text-foreground/90 font-medium mb-1">{t("legal.operator")}</div>
            {t("legal.org_line")}
          </div>
        </article>
      </section>
    </PageShell>
  );
};
