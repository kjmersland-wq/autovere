import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Compass, Scale, ShieldCheck, MapPin, Brain, ChevronDown, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Advisor } from "@/components/Advisor";
import { CinematicSection } from "@/components/CinematicSection";
import { Personality } from "@/components/Personality";
import { SEO } from "@/components/SEO";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CarCard } from "@/components/CarCard";
import { CARS, COLLECTIONS as DATA_COLLECTIONS } from "@/data/cars";
import heroCar from "@/assets/hero-car.jpg";
import sceneNight from "@/assets/scene-night-drive.jpg";
import sceneNordic from "@/assets/scene-nordic.jpg";
import sceneRoad from "@/assets/scene-roadtrip.jpg";
import sceneQuiet from "@/assets/scene-quiet.jpg";
import sceneCity from "@/assets/scene-city.jpg";

const HOME_COLLECTIONS = DATA_COLLECTIONS.slice(0, 4);
const SAMPLE_CARS = CARS.slice(0, 3);

const FEATURES = [
  { icon: Brain, title: "Understands you", desc: "Tell AutoVere about your life. It listens for what actually matters — not just specs." },
  { icon: Compass, title: "Lifestyle-first match", desc: "Recommendations based on climate, family, commute, and how you actually drive." },
  { icon: Scale, title: "Honest tradeoffs", desc: "No hype. Every match comes with the real strengths and the real compromises." },
  { icon: ShieldCheck, title: "Built to be trusted", desc: "We translate specifications into human meaning. So you choose with confidence." },
];

const FAQS = [
  { q: "How does AutoVere actually work?", a: "You describe your life — where you drive, who's with you, what feels important. AutoVere interprets the signals (climate, space, budget, personality) and matches you with a small, curated set of cars that genuinely fit. No endless filters, no overwhelm." },
  { q: "Why only 2–3 recommendations?", a: "Choice paralysis is real. Showing you 47 cars doesn't help — it stresses you out. AutoVere narrows it to the few that actually deserve your attention, then explains why." },
  { q: "Can I trust the matches?", a: "AutoVere is honest about tradeoffs. Every recommendation includes what's great and what isn't. We'd rather you walk away informed than excited about the wrong car." },
  { q: "Does it work for my country?", a: "English first, with multilingual and regional support rolling out. Climate, currency, and availability awareness are part of the roadmap — designed in from day one." },
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [seedPrompt, setSeedPrompt] = useState<string | undefined>();
  const [heroInput, setHeroInput] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const startWith = (text: string) => {
    setSeedPrompt(text + " #" + Date.now());
    setTimeout(() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };


  const seoJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AutoVere",
    url: typeof window !== "undefined" ? window.location.origin : "",
    description: "AutoVere is an emotionally intelligent AI car advisor — calm, honest, and lifestyle-first.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="AutoVere — The future of choosing a car"
        description="AutoVere is a calm, intelligent AI advisor that learns how you live and matches you to the few cars worth your attention."
        jsonLd={seoJsonLd}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-40 pb-32 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-glow blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-glow blur-3xl opacity-50" />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
              The future of choosing a car
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter">
              Find the car that
              <br />
              <span className="text-gradient">actually fits you.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AutoVere is a calm, intelligent advisor that learns how you live —
              then guides you to the few cars worth your attention.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); if (heroInput.trim()) startWith(heroInput); }}
              className="max-w-2xl mx-auto pt-4"
            >
              <div className="glass rounded-2xl p-2 flex items-center gap-2 shadow-elegant focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Sparkles className="w-5 h-5 text-accent ml-3 shrink-0" />
                <input
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  placeholder="Try: 'A reliable EV for snowy mountain weekends'"
                  className="flex-1 bg-transparent py-3 text-base focus:outline-none placeholder:text-muted-foreground/70"
                />
                <Button type="submit" className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2">
                  Start <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Popular:</span>
                {["family EV", "weekend sports car", "city commuter"].map((t) => (
                  <button key={t} onClick={() => startWith("I'm looking for a " + t)} className="hover:text-foreground underline underline-offset-4 decoration-border">
                    {t}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Hero image with parallax */}
          <div className="relative mt-20 max-w-6xl mx-auto" style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
            <div className="absolute inset-0 bg-gradient-glow blur-3xl opacity-40" />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/50 group">
              <img
                src={heroCar}
                alt="Premium electric car at night"
                width={1920}
                height={1280}
                className="w-full h-auto transition-transform duration-[3000ms] group-hover:scale-105"
                style={{ transform: `scale(${1 + scrollY * 0.0001})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex flex-wrap items-end justify-between gap-4 opacity-90">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A AutoVere story · Volume 01</div>
                <div className="text-sm text-muted-foreground italic">"The right car doesn't shout. It fits."</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="py-32 relative">
        <div className="container">
          <div className="max-w-2xl mb-20">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">How it works</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Less searching. <span className="text-gradient">More clarity.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most car platforms throw 200 listings at you and call it choice.
              AutoVere does the opposite — it asks the right questions, then quietly does the thinking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-500 group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor */}
      <section id="advisor" className="py-32 relative">
        <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Meet AutoVere</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                A conversation, <br />not a search box.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Tell AutoVere about your daily drive, your climate, your family,
                what makes you smile behind the wheel. It listens — then recommends
                with the kind of nuance you'd expect from a thoughtful friend who happens to know cars.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  { icon: MapPin, t: "Climate & region aware" },
                  { icon: Heart, t: "Personality matched" },
                  { icon: Zap, t: "Real tradeoffs, no hype" },
                ].map((i) => (
                  <li key={i.t} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <i.icon className="w-4 h-4 text-accent" />
                    </div>
                    {i.t}
                  </li>
                ))}
              </ul>
            </div>
            <Advisor initialPrompt={seedPrompt} />
          </div>
        </div>
      </section>

      {/* Sample cars */}
      <section id="cars" className="py-32 relative">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">A glimpse</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Curated, not catalogued.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sample matches AutoVere surfaces — each chosen for a specific kind of life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_CARS.map((c) => <CarCard key={c.slug} car={c} />)}
          </div>
          <div className="mt-10">
            <Link to="/cars" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium">
              Browse the full AutoVere library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cinematic 1 — Nordic */}
      <CinematicSection
        image={sceneNordic}
        eyebrow="Cars for Nordic winters"
        title={<>Composed when <span className="text-gradient">the road isn't.</span></>}
        body="Quiet AWD. Heated everything. A cabin that feels like staying indoors at -15°. AutoVere knows which cars actually deliver — and which only pretend."
      />

      {/* Curated collections */}
      <section className="py-32 relative">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Curated collections</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Discover by <span className="text-gradient">moment</span>, not by spec.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Themes AutoVere returns to often. Tap one and start a conversation from there.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {HOME_COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="group relative overflow-hidden rounded-3xl text-left aspect-[16/10] border border-border/40 hover:border-primary/50 transition-all duration-700 hover:-translate-y-1 hover:shadow-glow block"
              >
                <img src={c.image} alt={c.title} loading="lazy" width={1280} height={800} className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[2500ms] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-3">{c.description}</p>
                  <div className="text-xs text-accent flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                    Open the collection <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/collections" className="text-accent hover:underline text-sm font-medium">All collections →</Link>
          </div>
        </div>
      </section>

      {/* Cinematic 2 — Long drives */}
      <CinematicSection
        image={sceneRoad}
        eyebrow="Designed for long drives"
        title={<>Six hours <span className="text-gradient">should feel like one.</span></>}
        body="Seats that don't betray you at hour four. Range you stop thinking about. Sound systems worth the silence between songs. AutoVere ranks for reality, not the spec sheet."
        align="right"
      />

      {/* Driving personality */}
      <section className="py-32 relative">
        <div className="absolute inset-x-0 top-1/4 h-96 bg-gradient-glow blur-3xl opacity-30 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-2xl mb-14">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Driving personality</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              The car you choose <br />says <span className="text-gradient">who you are.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AutoVere builds a profile from how you talk about driving — not a quiz, just a conversation.
              Recognize yourself in one of these?
            </p>
          </div>
          <Personality onPick={startWith} />
        </div>
      </section>

      {/* Cinematic 3 — Quiet luxury */}
      <CinematicSection
        image={sceneQuiet}
        eyebrow="Quiet luxury"
        title={<>Presence, <span className="text-gradient">without permission.</span></>}
        body="The cars that don't need to announce themselves. Thoughtful interiors, considered details, no chrome theater. The badge matters less than the silence inside."
      />

      {/* Underestimated */}
      <section className="py-32 relative">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Cars people underestimated</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                The ones <br />you'll <span className="text-gradient">be glad you tried.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Not every great car arrives with a marketing budget. AutoVere surfaces the quietly excellent —
                cars that owners love more after a year, not less.
              </p>
              <button
                onClick={() => startWith("Show me cars I probably haven't considered but would love.")}
                className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium"
              >
                Surface my hidden matches <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/40 group">
              <img src={sceneCity} alt="Underestimated cars" loading="lazy" width={1920} height={1280} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2500ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Tonight in Tokyo</div>
                  <div className="text-2xl font-semibold">A car you wouldn't expect to love.</div>
                </div>
                <div className="glass rounded-full p-3 group-hover:bg-primary/30 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic 4 — Night drive emotional */}
      <CinematicSection
        image={sceneNight}
        eyebrow="Why we built AutoVere"
        title={<>Choosing a car <span className="text-gradient">should feel like this.</span></>}
        body="Calm. Considered. Yours. Not 47 open tabs at 1am. Not spec sheets you'll forget by Tuesday. Just a quiet conversation, and a car that finally fits."
        align="center"
        height="h-[80vh]"
      />

      {/* Help */}

      <section id="help" className="py-32 relative">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Help & guidance</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Everything you might wonder.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Calm answers. No fine print.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <div key={f.q} className="glass rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="font-medium tracking-tight">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-fade-up">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="container">
          <div className="relative max-w-4xl mx-auto glass rounded-3xl p-12 md:p-20 text-center overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-gradient-glow opacity-40" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                Your next car is <span className="text-gradient">waiting to be understood.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Skip the spec sheets. Start a conversation.
              </p>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2 h-14 px-8 text-base shadow-glow" onClick={() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth" })}>
                Talk to AutoVere <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
