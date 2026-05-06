import { Link, useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Heart, Snowflake, Car as CarIcon, Users, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CARS, getCar } from "@/data/cars";
import { useSafetyIntelligence } from "@/hooks/use-safety-intelligence";
import { CompareIntelligenceSection } from "@/components/CompareIntelligenceSection";
import { CompareNextStepsSection } from "@/components/CompareNextStepsSection";
import type { Car } from "@/data/cars";

const Row = ({ label, a, b, icon: Icon }: { label: string; a: string; b: string; icon?: typeof ShieldCheck }) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 md:gap-8 py-6 border-b border-border/30">
    <div className="text-xs uppercase tracking-wider text-muted-foreground self-start pt-1 flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
      {label}
    </div>
    <div className="text-sm leading-relaxed">{a}</div>
    <div className="text-sm leading-relaxed">{b}</div>
  </div>
);

const FeelCard = ({ car }: { car: Car }) => {
  const { data, loading } = useSafetyIntelligence(car.name, car.type, car.lifestyle);
  return (
    <div className="glass rounded-3xl p-7 space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Real-world feel · {car.name}
        </div>
        {loading || !data ? (
          <div className="space-y-2">
            <div className="h-4 w-4/5 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-3/5 bg-secondary/40 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-base leading-relaxed">{data.safetyHeadline}</p>
        )}
      </div>
      {data && (
        <>
          <div className="text-sm text-muted-foreground leading-relaxed italic">"{data.safetySummary}"</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {data.safetyDimensions.slice(0, 4).map((d) => (
              <div key={d.label}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{d.label}</div>
                <div className="text-sm font-medium">{d.rating}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


const NotFound = () => (
  <PageShell>
    <SEO title="Comparison not found · AutoVere" description="This comparison isn't ready yet." />
    <div className="container py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">We haven't framed that one yet.</h1>
      <Button asChild className="bg-gradient-primary"><Link to="/compare">Browse comparisons</Link></Button>
    </div>
  </PageShell>
);

const Compare = () => {
  const { slug = "" } = useParams();
  // pattern: a-vs-b where slugs may contain hyphens. Use " -vs- " split fallback.
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return <NotFound />;
  const [aSlug, bSlug] = parts;
  const a = getCar(aSlug);
  const b = getCar(bSlug);
  if (!a || !b) return <NotFound />;

  const title = `${a.name} vs ${b.name} — honest comparison · AutoVere`;
  const desc = `A real-world comparison of the ${a.name} and ${b.name}: feel, comfort, climate, lifestyle, and ownership — not a spec table.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${a.name} vs ${b.name}`,
    description: desc,
    about: [a.name, b.name],
  };

  return (
    <PageShell>
      <SEO title={title} description={desc} type="article" jsonLd={jsonLd} />

      {/* Split hero */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {[a, b].map((c, i) => (
            <Link key={c.slug} to={`/cars/${c.slug}`} className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden group">
              <img src={c.hero} alt={c.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2500ms]" />
              <div className={`absolute inset-0 bg-gradient-to-${i === 0 ? "r" : "l"} from-background via-background/30 to-transparent`} />
              <div className={`absolute inset-0 flex items-end p-10 ${i === 1 ? "justify-end text-right" : ""}`}>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">{c.brand}</div>
                  <div className="text-3xl md:text-5xl font-bold tracking-tighter">{c.name}</div>
                  <div className="text-muted-foreground mt-2">{c.fit}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
          <div className="glass w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-gradient">vs</div>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-20 max-w-3xl">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">AutoVere comparison</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {a.name} vs {b.name}: <span className="text-gradient">how they actually feel.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Spec tables hide the truth. Two cars with similar numbers can feel completely different to live with.
          Here's how the {a.name} and the {b.name} compare across the dimensions AutoVere weighs most: feel, comfort,
          climate, lifestyle, and ownership.
        </p>
      </section>

      {/* AI comparison intelligence — FIRST (emotional understanding before tech) */}
      <CompareIntelligenceSection
        aSlug={a.slug}
        bSlug={b.slug}
        aName={a.name}
        bName={b.name}
      />

      {/* Detailed dimension rows */}
      <section className="container pb-20">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">Detailed dimensions</div>
        <Row label="Driving feel" icon={CarIcon} a={a.summary} b={b.summary} />
        <Row label="Comfort" icon={Heart} a={a.comfort} b={b.comfort} />
        <Row label="Safety confidence" icon={ShieldCheck} a={`Strong real-world confidence; ${a.climate.toLowerCase()}`} b={`Strong real-world confidence; ${b.climate.toLowerCase()}`} />
        <Row label="Winter behaviour" icon={Snowflake} a={a.climate} b={b.climate} />
        <Row label="Family suitability" icon={Users} a={a.practicality} b={b.practicality} />
        <Row label="Ownership stress" a={a.ownership} b={b.ownership} />
        <Row label="Personality fit" a={a.personality} b={b.personality} />
        <Row label="Lifestyle" a={a.lifestyle} b={b.lifestyle} />
      </section>

      {/* AI real-world feel cards */}
      <section className="container pb-20">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">AI consensus</div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          What it actually feels like — by the numbers people don't print.
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeelCard car={a} />
          <FeelCard car={b} />
        </div>
      </section>

      {/* Region-aware continuation: dealers, test drives, official */}
      <CompareNextStepsSection a={a} b={b} />

      {/* Verdict */}
      <section className="container pb-24 grid md:grid-cols-2 gap-6">
        {[a, b].map((c) => (
          <div key={c.slug} className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-2">Choose the {c.name} if</div>
            <p className="text-lg leading-relaxed mb-4">{c.lifestyle}</p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to={`/cars/${c.slug}`}>Read the full {c.name} review <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="container pb-24">
        <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-40" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Still on the fence?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Tell AutoVere about your life — climate, family, commute. It'll pick the one that actually fits.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary rounded-xl gap-2">
              <Link to="/#advisor">Ask AutoVere <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Compare;

// Compare index — suggested matchups
export const CompareIndex = () => {
  const pairs: Array<[typeof CARS[number], typeof CARS[number]]> = [];
  CARS.forEach((c) => c.comparesWellWith.forEach((s) => {
    const o = getCar(s);
    if (o && !pairs.some(([x, y]) => (x.slug === o.slug && y.slug === c.slug))) pairs.push([c, o]);
  }));

  return (
    <PageShell>
      <SEO
        title="Car comparisons that go beyond spec sheets · AutoVere"
        description="Real-world comparisons of premium EVs — driving feel, comfort, climate, lifestyle, and ownership. Honest, human, useful."
      />
      <section className="container pt-12 pb-20">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Compare</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Comparisons that <span className="text-gradient">tell the truth.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We don't compare numbers. We compare the lived experience of owning the car.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {pairs.map(([x, y]) => (
            <Link
              key={`${x.slug}-${y.slug}`}
              to={`/compare/${x.slug}-vs-${y.slug}`}
              className="group glass rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-glow transition-all duration-500"
            >
              <div className="grid grid-cols-2 aspect-[16/7]">
                <img src={x.hero} alt={x.name} className="w-full h-full object-cover" loading="lazy" />
                <img src={y.hero} alt={y.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Comparison</div>
                  <div className="text-xl font-semibold">{x.name} vs {y.name}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};
