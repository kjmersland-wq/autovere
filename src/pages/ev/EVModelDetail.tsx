import { Link, useLocation, useParams } from "react-router-dom";
import { Battery, Zap, Thermometer, ArrowRight, CheckCircle, XCircle, ChevronLeft, Play, Star, Globe } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import NotFound from "@/pages/NotFound";
import { useState } from "react";

const fmt = (n: number) => n.toLocaleString();

function SocBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-right text-xs text-muted-foreground">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-card overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${(value / 800) * 100}%` }} />
      </div>
      <div className="w-16 text-xs font-medium">{value} km</div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function EVModelsIndex() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="EV Models — European Buyer's Guide | AUTOVERE"
        description="In-depth pages for every major European EV. Real-world range, charging data, winter performance and pricing by country."
      />
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Models
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            European EV buyer's guide. <span className="text-gradient">Honest data, no hype.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Real-world range, actual charging speeds, winter performance and full ownership analysis.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {EV_MODELS.map((model) => (
            <Link
              key={model.slug}
              to={L(`/ev/models/${model.slug}`)}
              className="glass rounded-2xl border border-border/40 p-6 hover:border-border/80 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{model.brand} · {model.category}</div>
              <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{model.tagline}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className="text-base font-bold text-gradient">{model.specs.range.realWorld}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Real km</div>
                </div>
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className="text-base font-bold text-cyan-400">{model.specs.charging.maxDC}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">kW DC</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">from €{fmt(model.priceEur.from)}</span>
                <span className="text-accent group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default function EVModelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const model = EV_MODELS.find((m) => m.slug === slug);
  if (!model) return <NotFound />;

  const alternatives = EV_MODELS.filter((m) => model.alternatives.includes(m.slug));

  return (
    <PageShell>
      <SEO
        title={`${model.name} Review — Real-World EV Guide | AUTOVERE`}
        description={`${model.name} honest review: ${model.specs.range.realWorld} km real-world range, ${model.specs.charging.maxDC} kW DC charging, winter performance and ownership analysis.`}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev/models")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> All EV models
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-accent mb-4">
            {model.brand} · {model.category} · {model.year}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{model.name}</h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-8">{model.tagline}</p>

          {/* Key stats bar */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Real range", value: `${model.specs.range.realWorld} km`, color: "text-foreground" },
              { label: "Winter range", value: `${model.specs.range.winter} km`, color: "text-cyan-400" },
              { label: "Max DC", value: `${model.specs.charging.maxDC} kW`, color: "text-emerald-400" },
              { label: "10–80%", value: `${model.specs.charging.time10to80} min`, color: "text-amber-400" },
              { label: "0–100 km/h", value: `${model.specs.performance.zeroTo100}s`, color: "text-violet-400" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl border border-border/40 px-5 py-3 text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Main content */}
          <div className="space-y-10">
            {/* AI summary */}
            <section className="glass rounded-2xl border border-border/40 p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-4">
                <Zap className="w-3.5 h-3.5" /> Ownership summary
              </div>
              <p className="text-muted-foreground leading-relaxed">{model.summary}</p>
            </section>

            {/* Range visualisation */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">Range — what to actually expect</h2>
              <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                <SocBar value={model.specs.range.wltp} label="WLTP" color="bg-muted-foreground/50" />
                <SocBar value={model.specs.range.realWorld} label="Real-world" color="bg-gradient-to-r from-primary to-accent" />
                <SocBar value={model.specs.range.winter} label="Winter (−10°C)" color="bg-cyan-500/60" />
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">{model.winterNote}</p>
              </div>
            </section>

            {/* Pros & Cons */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">Honest ownership analysis</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="glass rounded-2xl border border-emerald-500/20 p-6 bg-emerald-500/5">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-4">
                    <CheckCircle className="w-4 h-4" /> What reviewers love
                  </div>
                  <ul className="space-y-2.5">
                    {model.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-2xl border border-red-500/20 p-6 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-4">
                    <XCircle className="w-4 h-4" /> Watch out for
                  </div>
                  <ul className="space-y-2.5">
                    {model.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Charging networks */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">Charging network compatibility</h2>
              <div className="flex flex-wrap gap-2">
                {model.networks.map((n) => (
                  <span key={n} className="px-3 py-1.5 rounded-lg glass border border-border/40 text-sm">{n}</span>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">Video reviews</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {model.youtubeReviews.map((r) => (
                  <div key={r.videoId} className="glass rounded-xl border border-border/40 overflow-hidden">
                    <div className="relative aspect-video bg-card">
                      {playingVideo === r.videoId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${r.videoId}?autoplay=1`}
                          allow="autoplay; fullscreen"
                          className="w-full h-full"
                          title={r.title}
                        />
                      ) : (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${r.videoId}/mqdefault.jpg`}
                            alt={r.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setPlayingVideo(r.videoId)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-4 h-4 text-black ml-0.5" />
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-medium text-accent mb-0.5">{r.channel}</div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price by country */}
            <div className="glass rounded-2xl border border-border/40 p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-4">
                <Globe className="w-3.5 h-3.5" /> Pricing by country
              </div>
              {model.pricingByCountry.map((p) => (
                <div key={p.country} className="flex items-start justify-between py-2.5 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{p.country}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{fmt(p.price)}</div>
                    {p.note && <div className="text-[10px] text-muted-foreground">{p.note}</div>}
                  </div>
                </div>
              ))}
              <div className="mt-3 text-xs text-muted-foreground">
                from €{fmt(model.priceEur.from)} · to €{fmt(model.priceEur.to)}
              </div>
            </div>

            {/* Specs */}
            <div className="glass rounded-2xl border border-border/40 p-6">
              <h3 className="text-sm font-semibold mb-3">Full specifications</h3>
              <SpecRow label="Battery (usable)" value={`${model.specs.battery.usable} kWh`} />
              <SpecRow label="WLTP range" value={`${model.specs.range.wltp} km`} />
              <SpecRow label="Max AC charging" value={`${model.specs.charging.maxAC} kW`} />
              <SpecRow label="Max DC charging" value={`${model.specs.charging.maxDC} kW`} />
              <SpecRow label="10–80% time" value={`${model.specs.charging.time10to80} min`} />
              <SpecRow label="0–100 km/h" value={`${model.specs.performance.zeroTo100}s`} />
              <SpecRow label="Power" value={`${model.specs.performance.powerKw} kW`} />
              <SpecRow label="Top speed" value={`${model.specs.performance.topSpeed} km/h`} />
              <SpecRow label="Weight" value={`${fmt(model.specs.dimensions.weightKg)} kg`} />
              <SpecRow label="Cargo" value={`${model.specs.dimensions.cargoL} L`} />
            </div>

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div className="glass rounded-2xl border border-border/40 p-6">
                <h3 className="text-sm font-semibold mb-3">Compare alternatives</h3>
                <div className="space-y-2">
                  {alternatives.map((alt) => (
                    <Link
                      key={alt.slug}
                      to={`/ev/models/${alt.slug}`}
                      className="flex items-center justify-between py-2 hover:text-foreground transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium">{alt.name}</div>
                        <div className="text-xs text-muted-foreground">{alt.specs.range.realWorld} km · {alt.specs.charging.maxDC} kW</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
