import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { LEARN, getArticle } from "@/data/cars";
import { useLoc } from "@/lib/loc";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.learn.not_found_seo_title")} description={t("pages.learn.not_found_seo_desc")} />
      <div className="container py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pages.learn.not_found_h1")}</h1>
        <Button asChild className="bg-gradient-primary"><Link to="/learn">{t("pages.learn.back_learn")}</Link></Button>
      </div>
    </PageShell>
  );
};

const LearnArticle = () => {
  const { t } = useTranslation();
  const { l, la } = useLoc();
  const { slug = "" } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound />;

  const title = l(a.title);
  const excerpt = l(a.excerpt);
  const category = l(a.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    articleSection: category,
  };

  return (
    <PageShell>
      <SEO title={`${title} · AUTOVERE`} description={excerpt} type="article" jsonLd={jsonLd} />
      <article className="container max-w-3xl pt-16 pb-24">
        <Link to="/learn" className="text-xs uppercase tracking-wider text-accent mb-6 inline-block">
          {t("pages.learn.back_to")} {category}
        </Link>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-6">{title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">{excerpt}</p>
        <div className="space-y-6 text-lg leading-relaxed">
          {la(a.body).map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-16 glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">{t("pages.learn.ready_h")}</h2>
          <p className="text-muted-foreground mb-6">{t("pages.learn.ready_lead")}</p>
          <Button asChild className="bg-gradient-primary rounded-xl gap-2">
            <Link to="/#advisor">{t("common.talk_to_autovere")} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </article>
    </PageShell>
  );
};

export default LearnArticle;

export const LearnIndex = () => {
  const { t } = useTranslation();
  const { l } = useLoc();
  const categories = Array.from(new Set(LEARN.map((a) => l(a.category))));
  return (
    <PageShell>
      <SEO title={t("pages.learn.index_seo_title")} description={t("pages.learn.index_seo_desc")} />
      <section className="container pt-12 pb-20 max-w-5xl">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.learn.index_eyebrow")}</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {t("pages.learn.index_h1_a")} <span className="text-gradient">{t("pages.learn.index_h1_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.learn.index_lead")}</p>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-6">{cat}</div>
            <div className="grid md:grid-cols-2 gap-6">
              {LEARN.filter((a) => l(a.category) === cat).map((a) => (
                <Link
                  key={a.slug}
                  to={`/learn/${a.slug}`}
                  className="group glass rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 block"
                >
                  <BookOpen className="w-5 h-5 text-accent mb-4" />
                  <h2 className="text-xl font-semibold tracking-tight mb-3">{l(a.title)}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{l(a.excerpt)}</p>
                  <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("common.read_guide")} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
};
