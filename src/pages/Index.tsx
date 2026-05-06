import { useState } from "react";
import { ArrowRight, Sparkles, Compass, Scale, ShieldCheck, MapPin, Brain, ChevronDown, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Advisor } from "@/components/Advisor";
import heroCar from "@/assets/hero-car.jpg";
import carSnow from "@/assets/car-snow.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carFamily from "@/assets/car-family.jpg";

const SAMPLE_CARS = [
  {
    name: "Polestar 3",
    type: "Electric SUV",
    fit: "Quiet confidence",
    desc: "Calm, refined, Scandinavian. Handles harsh winters with composure and feels effortless on long drives.",
    score: 96,
    image: carSnow,
    tag: "Best for cold climates",
  },
  {
    name: "BMW i5",
    type: "Executive EV",
    fit: "Spirited & refined",
    desc: "Drives like a sports sedan but pampers like a flagship. Tech that feels considered, not flashy.",
    score: 93,
    image: carSedan,
    tag: "Best for daily drivers",
  },
  {
    name: "Volvo EX90",
    type: "Family SUV",
    fit: "Quietly capable",
    desc: "Spacious enough for the whole family. Safety-first, beautifully understated, made for road trips.",
    score: 95,
    image: carFamily,
    tag: "Best for families",
  },
];

const FEATURES = [
  { icon: Brain, title: "Understands you", desc: "Tell Lumen about your life. It listens for what actually matters — not just specs." },
  { icon: Compass, title: "Lifestyle-first match", desc: "Recommendations based on climate, family, commute, and how you actually drive." },
  { icon: Scale, title: "Honest tradeoffs", desc: "No hype. Every match comes with the real strengths and the real compromises." },
  { icon: ShieldCheck, title: "Built to be trusted", desc: "We translate specifications into human meaning. So you choose with confidence." },
];

const FAQS = [
  { q: "How does Lumen actually work?", a: "You describe your life — where you drive, who's with you, what feels important. Lumen interprets the signals (climate, space, budget, personality) and matches you with a small, curated set of cars that genuinely fit. No endless filters, no overwhelm." },
  { q: "Why only 2–3 recommendations?", a: "Choice paralysis is real. Showing you 47 cars doesn't help — it stresses you out. Lumen narrows it to the few that actually deserve your attention, then explains why." },
  { q: "Can I trust the matches?", a: "Lumen is honest about tradeoffs. Every recommendation includes what's great and what isn't. We'd rather you walk away informed than excited about the wrong car." },
  { q: "Does it work for my country?", a: "English first, with multilingual and regional support rolling out. Climate, currency, and availability awareness are part of the roadmap — designed in from day one." },
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [seedPrompt, setSeedPrompt] = useState<string | undefined>();
  const [heroInput, setHeroInput] = useState("");

  const startWith = (text: string) => {
    setSeedPrompt(text + " #" + Date.now());
    setTimeout(() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/30">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            Lumen
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#advisor" className="hover:text-foreground transition-colors">Advisor</a>
            <a href="#cars" className="hover:text-foreground transition-colors">Discover</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#help" className="hover:text-foreground transition-colors">Help</a>
          </nav>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 rounded-xl" onClick={() => document.getElementById("advisor")?.scrollIntoView({ behavior: "smooth" })}>
            Try Lumen
          </Button>
        </div>
      </header>

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
              Lumen is a calm, intelligent advisor that learns how you live —
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

          {/* Hero image */}
          <div className="relative mt-20 max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-glow blur-3xl opacity-40" />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/50">
              <img src={heroCar} alt="Premium electric car" width={1920} height={1280} className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
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
              Lumen does the opposite — it asks the right questions, then quietly does the thinking.
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
              <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Meet Lumen</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                A conversation, <br />not a search box.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Tell Lumen about your daily drive, your climate, your family,
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
              Sample matches Lumen surfaces — each chosen for a specific kind of life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_CARS.map((c) => (
              <article key={c.name} className="glass rounded-2xl p-6 hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{c.type}</div>
                    <h3 className="text-2xl font-semibold tracking-tight">{c.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Match</div>
                    <div className="text-2xl font-bold text-gradient">{c.score}</div>
                  </div>
                </div>
                <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-secondary to-muted/50 mb-6 flex items-center justify-center relative overflow-hidden border border-border/30">
                  <div className="absolute inset-0 bg-gradient-glow opacity-30" />
                  <c.icon className="w-16 h-16 text-accent/60 relative z-10" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-secondary/60 border border-border/50 mb-3">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {c.tag}
                </div>
                <div className="font-medium mb-2 text-foreground">{c.fit}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                Talk to Lumen <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            Lumen — The future of choosing a car.
          </div>
          <div>© {new Date().getFullYear()} Lumen Advisor</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
