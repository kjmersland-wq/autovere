import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { LEARN, getArticle } from "@/data/cars";

const NotFound = () => (
  <PageShell>
    <SEO title="Article not found · AutoVere" description="This article isn't published yet." />
    <div className="container py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">Not published yet.</h1>
      <Button asChild className="bg-gradient-primary"><Link to="/learn">Back to Learn</Link></Button>
    </div>
  </PageShell>
);

const LearnArticle = () => {
  const { slug = "" } = useParams();
  const a = getArticle(slug);
  if (!a) return <NotFound />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    articleSection: a.category,
  };

  return (
    <PageShell>
      <SEO title={`${a.title} · AutoVere Learn`} description={a.excerpt} type="article" jsonLd={jsonLd} />
      <article className="container max-w-3xl pt-16 pb-24">
        <Link to="/learn" className="text-xs uppercase tracking-wider text-accent mb-6 inline-block">← AutoVere Learn · {a.category}</Link>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-6">{a.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">{a.excerpt}</p>
        <div className="space-y-6 text-lg leading-relaxed">
          {a.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-16 glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Ready to put it into practice?</h2>
          <p className="text-muted-foreground mb-6">Talk to AutoVere and turn this into a car that fits your life.</p>
          <Button asChild className="bg-gradient-primary rounded-xl gap-2">
            <Link to="/#advisor">Talk to AutoVere <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </article>
    </PageShell>
  );
};

export default LearnArticle;

export const LearnIndex = () => {
  const categories = Array.from(new Set(LEARN.map((a) => a.category)));
  return (
    <PageShell>
      <SEO
        title="AutoVere Learn — calm, intelligent guides to choosing a car"
        description="Premium guides on EVs, winter driving, comparing cars, and what makes a car feel premium. Calm, human, no jargon."
      />
      <section className="container pt-12 pb-20 max-w-5xl">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">AutoVere Learn</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Calm, intelligent <span className="text-gradient">guidance.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you might wonder about choosing a car — written like a thoughtful friend would explain it.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-6">{cat}</div>
            <div className="grid md:grid-cols-2 gap-6">
              {LEARN.filter((a) => a.category === cat).map((a) => (
                <Link
                  key={a.slug}
                  to={`/learn/${a.slug}`}
                  className="group glass rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 block"
                >
                  <BookOpen className="w-5 h-5 text-accent mb-4" />
                  <h2 className="text-xl font-semibold tracking-tight mb-3">{a.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.excerpt}</p>
                  <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read the guide <ArrowRight className="w-3 h-3" />
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
