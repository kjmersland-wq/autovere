import { Link, useParams } from "react-router-dom";
import { ArrowRight, Wind, Crown, Building2, Mountain, Flame, Snowflake } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { PERSONALITIES, getPersonality, getCar } from "@/data/cars";

const ICONS: Record<string, any> = {
  "calm-explorer": Wind,
  "quiet-executive": Crown,
  "weekend-escapist": Mountain,
  "urban-minimalist": Building2,
  "performance-romantic": Flame,
  "nordic-adventurer": Snowflake,
};

const NotFound = () => (
  <PageShell>
    <SEO title="Personality not found · AutoVere" description="This personality isn't in the framework yet." />
    <div className="container py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">Not part of the framework yet.</h1>
      <Button asChild className="bg-gradient-primary"><Link to="/personalities">All personalities</Link></Button>
    </div>
  </PageShell>
);

const PersonalityDetail = () => {
  const { slug = "" } = useParams();
  const p = getPersonality(slug);
  if (!p) return <NotFound />;
  const Icon = ICONS[p.slug] ?? Wind;
  const cars = p.matches.map(getCar).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <PageShell>
      <SEO
        title={`${p.name} — driving personality · AutoVere`}
        description={`${p.tagline} ${p.description}`}
        type="article"
      />
      <section className="container pt-12 pb-20 max-w-4xl">
        <div className="text-xs uppercase tracking-[0.3em] text-accent mb-6">Driving personality</div>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Icon className="w-9 h-9 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">{p.name}</h1>
            <p className="text-lg text-muted-foreground italic mt-2">"{p.tagline}"</p>
          </div>
        </div>
        <p className="text-xl text-muted-foreground leading-relaxed mb-10">{p.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-3">Who you are</div>
            <p className="leading-relaxed">{p.whoYouAre}</p>
          </div>
          <div className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-3">What you value</div>
            <ul className="space-y-2">
              {p.whatYouValue.map((v) => (
                <li key={v} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> {v}</li>
              ))}
            </ul>
          </div>
        </div>

        <Button asChild size="lg" className="bg-gradient-primary rounded-xl gap-2">
          <Link to={`/#advisor`}>Show my matches <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </section>

      <section className="container pb-24">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Matches</div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          Cars AutoVere often suggests for a {p.name}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((c) => <CarCard key={c.slug} car={c} />)}
        </div>
      </section>
    </PageShell>
  );
};

export default PersonalityDetail;

export const PersonalitiesIndex = () => (
  <PageShell>
    <SEO
      title="Driving personalities — find which one is yours · AutoVere"
      description="Six driving personalities — Calm Explorer, Quiet Executive, Nordic Adventurer and more. Find the one that fits and the cars that match."
    />
    <section className="container pt-12 pb-20">
      <div className="max-w-2xl mb-14">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Driving personalities</div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
          The car you choose <br />says <span className="text-gradient">who you are.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Six personalities. Recognise yourself in one — and let AutoVere match you to the cars that fit.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSONALITIES.map((p) => {
          const Icon = ICONS[p.slug] ?? Wind;
          return (
            <Link
              key={p.slug}
              to={`/personalities/${p.slug}`}
              className="group glass rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 block"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:shadow-glow">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">{p.name}</h2>
              <p className="text-sm italic text-muted-foreground mb-3">"{p.tagline}"</p>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">{p.description}</p>
              <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                Read the profile <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  </PageShell>
);
