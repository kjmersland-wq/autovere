import { Link, useLocation, useParams } from "react-router-dom";
import { Battery, Zap, ArrowRight, CheckCircle, XCircle, Play, Globe, GitCompare, Database, Calculator, Wifi } from "lucide-react";
import { EVBreadcrumb } from "@/components/EVBreadcrumb";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import NotFound from "@/pages/NotFound";
import { useState } from "react";
import { VehicleIntelligenceCard } from "@/components/VehicleIntelligenceCard";
import { SaveButton } from "@/components/SaveButton";
import { SignalFeedCompact } from "@/components/SignalFeed";
import { getVehicleIntelligence } from "@/data/vehicle-intelligence";
import { getSignalsForVehicle } from "@/data/automotive-signals";
import { useCarImage } from "@/hooks/useCarImage";

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
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title={t("ev.models.seo_title")}
        description={t("ev.models.seo_desc")}
      />
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> {t("ev.models.eyebrow")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            {t("ev.models.title")} <span className="text-gradient">{t("ev.models.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            {t("ev.models.subtitle")}
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
                  <div className="text-[9px] text-muted-foreground uppercase">{t("ev.database.unit_real_km")}</div>
                </div>
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className="text-base font-bold text-cyan-400">{model.specs.charging.maxDC}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">kW DC</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("ev.models.from")} €{fmt(model.priceEur.from)}</span>
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
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const model = EV_MODELS.find((m) => m.slug === slug);
  if (!model) return <NotFound />;

  const alternatives = EV_MODELS.filter((m) => model.alternatives.includes(m.slug));
  const intelligence = getVehicleIntelligence(model.slug);
  const vehicleSignals = getSignalsForVehicle(model.slug);

  const origin = "https://www.autovere.com";
  const modelUrl = `${origin}${lang !== "en" ? `/${lang}` : ""}/ev/models/${model.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Car",
      name: model.name,
      brand: { "@type": "Brand", name: model.brand },
      fuelType: "Electric",
      description: model.tagline,
      vehicleEngine: { "@type": "EngineSpecification", fuelType: "Electric" },
      offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: model.priceEur.from, highPrice: model.priceEur.to },
      url: modelUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("ev.nav.hub"), item: `${origin}${lang !== "en" ? `/${lang}` : ""}/ev` },
        { "@type": "ListItem", position: 2, name: t("ev.nav.models"), item: `${origin}${lang !== "en" ? `/${lang}` : ""}/ev/models` },
        { "@type": "ListItem", position: 3, name: model.name, item: modelUrl },
      ],
    },
  ];

  const heroStats = [
    { label: t("ev.models.real_range_label"), value: `${model.specs.range.realWorld} km`, color: "text-foreground" },
    { label: t("ev.models.winter_range_label"), value: `${model.specs.range.winter} km`, color: "text-cyan-400" },
    { label: "Max DC", value: `${model.specs.charging.maxDC} kW`, color: "text-emerald-400" },
    { label: "10–80%", value: `${model.specs.charging.time10to80} min`, color: "text-amber-400" },
    { label: "0–100 km/h", value: `${model.specs.performance.zeroTo100}s`, color: "text-violet-400" },
  ];

  const { image: heroImage } = useCarImage({ brand: model.brand, model: model.name });

  return (
    <PageShell>
      <SEO
        title={t("ev.models.detail_seo_title", { name: model.name })}
        description={t("ev.models.detail_seo_desc", { name: model.name, range: model.specs.range.realWorld, dc: model.specs.charging.maxDC })}
        jsonLd={jsonLd}
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        {heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
              style={{ backgroundImage: `url(${heroImage.url})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40 pointer-events-none" aria-hidden />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <EVBreadcrumb items={[
            { label: t("ev.nav.hub"), to: L("/ev") },
            { label: t("ev.nav.models"), to: L("/ev/models") },
            { label: model.name },
          ]} />
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-accent mb-4">
            {model.brand} · {model.category} · {model.year}
          </div>
          <div className="flex items-start gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex-1">{model.name}</h1>
            <SaveButton type="vehicle" slug={model.slug} className="mt-2 flex-shrink-0" />
          </div>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-8">{model.tagline}</p>

          <div className="flex flex-wrap gap-4">
            {heroStats.map((s) => (
              <div key={s.label} className="glass rounded-xl border border-border/40 px-5 py-3 text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          {heroImage && (
            <div className="mt-6 text-[10px] text-muted-foreground/70 uppercase tracking-wider">
              {t("ev.models.photo_credit")}: <a href={heroImage.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{heroImage.credit}</a> · {heroImage.source}
            </div>
          )}
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-10">
            <section className="glass rounded-2xl border border-border/40 p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-4">
                <Zap className="w-3.5 h-3.5" /> {t("ev.models.ownership_summary")}
              </div>
              <p className="text-muted-foreground leading-relaxed">{model.summary}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">{t("ev.models.range_heading")}</h2>
              <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                <SocBar value={model.specs.range.wltp} label={t("ev.models.wltp")} color="bg-muted-foreground/50" />
                <SocBar value={model.specs.range.realWorld} label={t("ev.models.real_world")} color="bg-gradient-to-r from-primary to-accent" />
                <SocBar value={model.specs.range.winter} label={t("ev.models.winter_temp")} color="bg-cyan-500/60" />
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">{model.winterNote}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">{t("ev.models.ownership_analysis")}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="glass rounded-2xl border border-emerald-500/20 p-6 bg-emerald-500/5">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-4">
                    <CheckCircle className="w-4 h-4" /> {t("ev.models.what_love")}
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
                    <XCircle className="w-4 h-4" /> {t("ev.models.watch_out")}
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

            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">{t("ev.models.networks")}</h2>
              <div className="flex flex-wrap gap-2">
                {model.networks.map((n) => (
                  <span key={n} className="px-3 py-1.5 rounded-lg glass border border-border/40 text-sm">{n}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">{t("ev.models.video_reviews")}</h2>
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

          <div className="space-y-5">
            <div className="glass rounded-2xl border border-border/40 p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-4">
                <Globe className="w-3.5 h-3.5" /> {t("ev.models.pricing")}
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
                {t("ev.models.price_range_label", { from: fmt(model.priceEur.from), to: fmt(model.priceEur.to) })}
              </div>
            </div>

            <div className="glass rounded-2xl border border-border/40 p-6">
              <h3 className="text-sm font-semibold mb-3">{t("ev.models.specs_title")}</h3>
              <SpecRow label={t("ev.models.spec_battery")} value={`${model.specs.battery.usable} kWh`} />
              <SpecRow label={t("ev.models.spec_wltp")} value={`${model.specs.range.wltp} km`} />
              <SpecRow label={t("ev.models.spec_ac")} value={`${model.specs.charging.maxAC} kW`} />
              <SpecRow label={t("ev.models.spec_dc")} value={`${model.specs.charging.maxDC} kW`} />
              <SpecRow label={t("ev.models.spec_charge_time")} value={`${model.specs.charging.time10to80} min`} />
              <SpecRow label={t("ev.models.spec_0_100")} value={`${model.specs.performance.zeroTo100}s`} />
              <SpecRow label={t("ev.models.spec_power")} value={`${model.specs.performance.powerKw} kW`} />
              <SpecRow label={t("ev.models.spec_top_speed")} value={`${model.specs.performance.topSpeed} km/h`} />
              <SpecRow label={t("ev.models.spec_weight")} value={`${fmt(model.specs.dimensions.weightKg)} kg`} />
              <SpecRow label={t("ev.models.spec_cargo")} value={`${model.specs.dimensions.cargoL} L`} />
            </div>

            {alternatives.length > 0 && (
              <div className="glass rounded-2xl border border-border/40 p-6">
                <h3 className="text-sm font-semibold mb-3">{t("ev.models.compare_alts")}</h3>
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

            {intelligence && <VehicleIntelligenceCard intelligence={intelligence} />}

            {vehicleSignals.length > 0 && (
              <div className="glass rounded-2xl border border-border/40 p-5">
                <div className="text-xs uppercase tracking-wider text-accent font-medium mb-3">{t("ev.models.latest_signals")}</div>
                {vehicleSignals.map((s) => (
                  <div key={s.id} className="py-2.5 border-b border-border/20 last:border-0">
                    <div className="text-xs font-medium leading-snug mb-0.5">{s.title}</div>
                    <div className="text-[10px] text-muted-foreground">{s.source} · {new Date(s.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="container pb-20">
        <h2 className="text-lg font-semibold mb-5">{t("ev.models.explore_more")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to={L(`/ev/compare?a=${model.slug}`)}
            className="glass rounded-2xl border border-border/40 p-5 hover:border-cyan-400/40 hover:-translate-y-0.5 transition-all group"
          >
            <GitCompare className="w-5 h-5 text-cyan-400 mb-3" />
            <div className="text-sm font-medium mb-1">{t("ev.nav.compare")}</div>
            <div className="text-xs text-muted-foreground">{t("ev.models.cta_compare")}</div>
          </Link>
          <Link
            to={L("/ev/database")}
            className="glass rounded-2xl border border-border/40 p-5 hover:border-violet-400/40 hover:-translate-y-0.5 transition-all group"
          >
            <Database className="w-5 h-5 text-violet-400 mb-3" />
            <div className="text-sm font-medium mb-1">{t("ev.nav.database")}</div>
            <div className="text-xs text-muted-foreground">{t("ev.models.cta_database")}</div>
          </Link>
          <Link
            to={L("/ev/calculator")}
            className="glass rounded-2xl border border-border/40 p-5 hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all group"
          >
            <Calculator className="w-5 h-5 text-emerald-400 mb-3" />
            <div className="text-sm font-medium mb-1">{t("ev.nav.calculator")}</div>
            <div className="text-xs text-muted-foreground">{t("ev.models.cta_calculator")}</div>
          </Link>
          <Link
            to={L("/ev/networks")}
            className="glass rounded-2xl border border-border/40 p-5 hover:border-amber-400/40 hover:-translate-y-0.5 transition-all group"
          >
            <Wifi className="w-5 h-5 text-amber-400 mb-3" />
            <div className="text-sm font-medium mb-1">{t("ev.nav.charging")}</div>
            <div className="text-xs text-muted-foreground">{t("ev.models.cta_networks")}</div>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
