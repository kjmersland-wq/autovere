import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Compass, Scale, ShieldCheck, MapPin, Brain, ChevronDown, Zap, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Advisor } from "@/components/Advisor";
import { CinematicSection } from "@/components/CinematicSection";
import { Personality } from "@/components/Personality";
import { SEO } from "@/components/SEO";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EVNavProvider } from "@/contexts/EVNavContext";
import { CarCard } from "@/components/CarCard";
import { HomepageIntelligence } from "@/components/HomepageIntelligence";
import { SignalFeedCompact } from "@/components/SignalFeed";
import { LLink } from "@/i18n/routing";
import { CARS, COLLECTIONS as DATA_COLLECTIONS } from "@/data/cars";
import { useLoc } from "@/lib/loc";
import heroCar from "@/assets/hero-car.jpg";
import sceneNight from "@/assets/scene-night-drive.jpg";
import sceneNordic from "@/assets/scene-nordic.jpg";
import sceneRoad from "@/assets/scene-roadtrip.jpg";
import sceneQuiet from "@/assets/scene-quiet.jpg";
import sceneCity from "@/assets/scene-city.jpg";

const HOME_COLLECTIONS = DATA_COLLECTIONS.slice(0, 4);
const SAMPLE_CARS = CARS.slice(0, 3);

const Index = () => {
  const { t } = useTranslation();
  const { l } = useLoc();
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

  const FEATURES = [
    { icon: Brain, title: t("pages.index.features.f1_t"), desc: t("pages.index.features.f1_d") },
    { icon: Compass, title: t("pages.index.features.f2_t"), desc: t("pages.index.features.f2_d") },
    { icon: Scale, title: t("pages.index.features.f3_t"), desc: t("pages.index.features.f3_d") },
    { icon: ShieldCheck, title: t("pages.index.features.f4_t"), desc: t("pages.index.features.f4_d") },
  ];

  const FAQS = [
    { q: t("pages.index.faqs.q1"), a: t("pages.index.faqs.a1") },
    { q: t("pages.index.faqs.q2"), a: t("pages.index.faqs.a2") },
    { q: t("pages.index.faqs.q3"), a: t("pages.index.faqs.a3") },
    { q: t("pages.index.faqs.q4"), a: t("pages.index.faqs.a4") },
  ];

  const popular = [
    t("pages.index.popular_1"),
    t("pages.index.popular_2"),
    t("pages.index.popular_3"),
  ];

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.autovere.com";
  const seoJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AUTOVERE",
      url: origin,
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/cars?q={query}`,
        "query-input": "required name=query",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AUTOVERE",
      url: origin,
      logo: `${origin}/favicon.ico`,
      sameAs: ["https://www.autovere.com"],
    },
  ];

  return (
    <EVNavProvider>
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title={t("pages.index.seo_title")}
        description={t("pages.index.seo_desc")}
        jsonLd={seoJsonLd}
      />
      <SiteHeader />

      {/* ───────────────────────── HERO — cinematic full-bleed ───────────────────────── */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-background">
        {/* Cinematic backdrop (Unsplash — European alpine road, dark moody) */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80"
            alt="Premium European automotive landscape at dusk"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.25}px) scale(1.08)` }}
            loading="eager"
          />
          {/* Layered cinematic vignette — Porsche/Rivian darkness */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_85%)] opacity-70" />
        </div>

        {/* Mechanical-precision corner markers */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute top-28 left-6 md:left-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
            <span className="w-8 h-px bg-foreground/30" />
            <span>N 59°54′ · E 10°45′</span>
          </div>
          <div className="absolute top-28 right-6 md:right-10 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
            EU · 01 / 04
          </div>
          <div className="absolute bottom-8 left-6 md:left-10 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
            {t("pages.index.hero_caption_a")}
          </div>
          <div className="absolute bottom-8 right-6 md:right-10 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 italic">
            {t("pages.index.hero_caption_b")}
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-20 min-h-[100svh] flex flex-col justify-center pt-32 pb-24">
          <div className="max-w-5xl space-y-10 animate-fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-[11px] uppercase tracking-[0.3em] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
              {t("pages.index.hero_pill")}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[8.5rem] font-bold leading-[0.95] tracking-[-0.04em]">
              {t("pages.index.hero_h1_a")}
              <br />
              <span className="text-gradient">{t("pages.index.hero_h1_b")}</span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
              {t("pages.index.hero_lead")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-none h-14 px-8 text-sm uppercase tracking-[0.2em] gap-3 shadow-elegant"
              >
                {t("pages.index.hero_cta_advisor")} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none h-14 px-8 text-sm uppercase tracking-[0.2em] gap-3 border-foreground/30 hover:border-foreground/60 bg-transparent backdrop-blur"
              >
                <LLink to="/ev/route-planner">
                  {t("pages.index.hero_cta_routes")} <ArrowRight className="w-4 h-4" />
                </LLink>
              </Button>
            </div>

            {/* Inline advisor input — quick prompt */}
            <form
              onSubmit={(e) => { e.preventDefault(); if (heroInput.trim()) startWith(heroInput); }}
              className="max-w-2xl pt-6"
            >
              <div className="glass rounded-none p-2 flex items-center gap-2 border border-foreground/20 focus-within:border-foreground/50 transition-colors">
                <Sparkles className="w-4 h-4 text-accent ml-3 shrink-0" />
                <input
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  placeholder={t("pages.index.hero_placeholder")}
                  className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder:text-muted-foreground/60"
                />
                <Button type="submit" variant="ghost" className="rounded-none uppercase tracking-[0.2em] text-xs gap-2">
                  {t("pages.index.start")} <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                <span>{t("pages.index.popular")}</span>
                {popular.map((p) => (
                  <button key={p} onClick={() => startWith(p)} className="hover:text-foreground transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-float pointer-events-none">
          <ChevronDown className="w-5 h-5 text-foreground/40" />
        </div>
      </section>

      {/* ───────────────────────── FEATURE STRIP — mechanical precision ───────────────────────── */}
      <section id="how" className="py-32 relative border-t border-border/40">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-4">
              <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">— {t("pages.index.how_eyebrow")}</div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-8">
                {t("pages.index.how_title_a")} <span className="text-gradient">{t("pages.index.how_title_b")}</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">{t("pages.index.how_lead")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-border/40">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group relative p-8 border-b border-border/40 lg:border-b-0 lg:border-r last:border-r-0 hover:bg-secondary/20 transition-colors duration-500"
              >
                <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
                  0{i + 1}
                </div>
                <f.icon className="w-6 h-6 text-accent mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="font-semibold text-xl mb-3 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="advisor" className="py-32 relative">
        <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.advisor_eyebrow")}</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {t("pages.index.advisor_title_a")} <br />{t("pages.index.advisor_title_b")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("pages.index.advisor_lead")}</p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  { icon: MapPin, t: t("pages.index.advisor_b1") },
                  { icon: Heart, t: t("pages.index.advisor_b2") },
                  { icon: Zap, t: t("pages.index.advisor_b3") },
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

      <section id="cars" className="py-32 relative">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
            <div>
              <div className="max-w-2xl mb-16">
                <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.sample_eyebrow")}</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t("pages.index.sample_title")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.index.sample_lead")}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {SAMPLE_CARS.map((c) => <CarCard key={c.slug} car={c} />)}
              </div>
              <div className="mt-10">
                <LLink to="/cars" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium">
                  {t("pages.index.browse_library")} <ArrowRight className="w-4 h-4" />
                </LLink>
              </div>
            </div>
            {/* Live signals sidebar */}
            <div className="hidden lg:block pt-2">
              <SignalFeedCompact limit={6} />
            </div>
          </div>
        </div>
      </section>

      {/* EV Intelligence — ranked by signal */}
      <HomepageIntelligence />

      <CinematicSection
        image={sceneNordic}
        eyebrow={t("pages.index.cinematic_nordic_eyebrow")}
        title={<>{t("pages.index.cinematic_nordic_title_a")} <span className="text-gradient">{t("pages.index.cinematic_nordic_title_b")}</span></>}
        body={t("pages.index.cinematic_nordic_body")}
      />

      <section className="py-32 relative">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.collections_eyebrow")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t("pages.index.collections_title_a")} <span className="text-gradient">{t("pages.index.collections_title_b")}</span>{t("pages.index.collections_title_c")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.index.collections_lead")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {HOME_COLLECTIONS.map((c) => (
              <LLink
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="group relative overflow-hidden rounded-3xl text-left aspect-[16/10] border border-border/40 hover:border-primary/50 transition-all duration-700 hover:-translate-y-1 hover:shadow-glow block"
              >
                <img src={c.image} alt={l(c.title)} loading="lazy" width={1280} height={800} className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform [transition-duration:2500ms] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{l(c.title)}</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-3">{l(c.description)}</p>
                  <div className="text-xs text-accent flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                    {t("common.open_collection")} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </LLink>
            ))}
          </div>
          <div className="mt-8">
            <LLink to="/collections" className="text-accent hover:underline text-sm font-medium">{t("pages.index.all_collections")}</LLink>
          </div>
        </div>
      </section>

      <CinematicSection
        image={sceneRoad}
        eyebrow={t("pages.index.cinematic_road_eyebrow")}
        title={<>{t("pages.index.cinematic_road_title_a")} <span className="text-gradient">{t("pages.index.cinematic_road_title_b")}</span></>}
        body={t("pages.index.cinematic_road_body")}
        align="right"
      />

      <section className="py-32 relative">
        <div className="absolute inset-x-0 top-1/4 h-96 bg-gradient-glow blur-3xl opacity-30 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-2xl mb-14">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.personality_eyebrow")}</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t("pages.index.personality_title_a")} <br />{t("pages.index.personality_title_b")} <span className="text-gradient">{t("pages.index.personality_title_c")}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.index.personality_lead")}</p>
          </div>
          <Personality onPick={startWith} />
        </div>
      </section>

      <CinematicSection
        image={sceneQuiet}
        eyebrow={t("pages.index.cinematic_quiet_eyebrow")}
        title={<>{t("pages.index.cinematic_quiet_title_a")} <span className="text-gradient">{t("pages.index.cinematic_quiet_title_b")}</span></>}
        body={t("pages.index.cinematic_quiet_body")}
      />

      <section className="py-32 relative">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.under_eyebrow")}</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {t("pages.index.under_title_a")} <br />{t("pages.index.under_title_b")} <span className="text-gradient">{t("pages.index.under_title_c")}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t("pages.index.under_lead")}</p>
              <button
                onClick={() => startWith(t("pages.index.under_cta"))}
                className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium"
              >
                {t("pages.index.under_cta")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/40 group">
              <img src={sceneCity} alt="Underestimated cars" loading="lazy" width={1920} height={1280} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform [transition-duration:2500ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("pages.index.under_card_eyebrow")}</div>
                  <div className="text-2xl font-semibold">{t("pages.index.under_card_title")}</div>
                </div>
                <div className="glass rounded-full p-3 group-hover:bg-primary/30 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CinematicSection
        image={sceneNight}
        eyebrow={t("pages.index.cinematic_night_eyebrow")}
        title={<>{t("pages.index.cinematic_night_title_a")} <span className="text-gradient">{t("pages.index.cinematic_night_title_b")}</span></>}
        body={t("pages.index.cinematic_night_body")}
        align="center"
        height="h-[80vh]"
      />

      <section id="help" className="py-32 relative">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.index.help_eyebrow")}</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t("pages.index.help_title")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.index.help_lead")}</p>
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

      <section className="py-32 relative">
        <div className="container">
          <div className="relative max-w-4xl mx-auto glass rounded-3xl p-12 md:p-20 text-center overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-gradient-glow opacity-40" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                {t("pages.index.cta_title_a")} <span className="text-gradient">{t("pages.index.cta_title_b")}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{t("pages.index.cta_lead")}</p>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2 h-14 px-8 text-base shadow-glow" onClick={() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth" })}>
                {t("common.talk_to_autovere")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
    </EVNavProvider>
  );
};

export default Index;
