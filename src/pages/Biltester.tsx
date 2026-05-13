import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ShieldCheck, Snowflake, Zap, Battery, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS, type EVModel } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { useCarImage } from "@/hooks/useCarImage";

type Variant = "no" | "en";

const COPY = {
  no: {
    eyebrow: "Uavhengige biltester",
    h1: "Biltester 2026",
    lede:
      "Uavhengige tester av nye biler — med ekte rekkevidde, vintertall fra Norge, ladekurver og europeiske priser. Ingen presseturer, ingen skjult sponsing.",
    title: "Biltester 2026 — uavhengige tester av nye biler | AUTOVERE",
    description:
      "Uavhengige biltester med ekte vinterrekkevidde, ladekurver og europeiske priser. Tesla, Porsche, Kia, Hyundai, BMW, Volvo og flere — testet for norske forhold.",
    listingTitle: "Alle biltester",
    listingSub: "Sortert etter mest etterspurt. Klikk for full test, spesifikasjoner og videoer.",
    metricRange: "Vinter­rekkevidde",
    metricCharge: "10–80 % lading",
    metricPower: "Effekt",
    metricPrice: "Fra (NOK)",
    readTest: "Les hele testen",
    watchVideos: "Se videotester",
    relatedTitle: "Mer fra Autovere",
    relatedItems: [
      { to: "/ev/reviews", label: "Videotest-konsensus", desc: "Hva sier de mest pålitelige YouTube-kanalene?" },
      { to: "/ev/charging", label: "Ladekart for Norge", desc: "Alle hurtigladere, sanntid." },
      { to: "/ev/calculator", label: "Elbilkalkulator", desc: "Hva koster bilen din i drift?" },
      { to: "/ev/markets", label: "Markedet", desc: "Hva selger best — og hvorfor." },
    ],
    methodTitle: "Slik tester vi",
    methodItems: [
      { icon: Snowflake, label: "Vinterrekkevidde målt ved -10 °C, ikke WLTP." },
      { icon: Zap, label: "Ladekurver fra reelle 10–80 %-stopp på Ionity og Supercharger." },
      { icon: Battery, label: "Brukbar batterikapasitet, ikke brutto." },
      { icon: ShieldCheck, label: "Kryssjekket mot Bjørn Nyland, Fully Charged og InsideEVs." },
    ],
    nokRate: 11.5,
  },
  en: {
    eyebrow: "Independent car reviews",
    h1: "Car Reviews 2026",
    lede:
      "Independent reviews of new cars — with real-world range, Nordic winter figures, charging curves and European prices. No press junkets, no hidden sponsorship.",
    title: "Car Reviews 2026 — independent tests of new cars | AUTOVERE",
    description:
      "Independent car reviews with real winter range, charging curves and European pricing. Tesla, Porsche, Kia, Hyundai, BMW, Volvo and more — tested for real-world conditions.",
    listingTitle: "All car reviews",
    listingSub: "Sorted by demand. Click for the full review, specs and video tests.",
    metricRange: "Winter range",
    metricCharge: "10–80% charge",
    metricPower: "Power",
    metricPrice: "From (EUR)",
    readTest: "Read full review",
    watchVideos: "Watch video reviews",
    relatedTitle: "More from Autovere",
    relatedItems: [
      { to: "/ev/reviews", label: "Video review consensus", desc: "What the most trusted YouTube channels actually say." },
      { to: "/ev/charging", label: "European charging map", desc: "Every fast charger, live status." },
      { to: "/ev/calculator", label: "EV cost calculator", desc: "What will it actually cost to run?" },
      { to: "/ev/markets", label: "Market intelligence", desc: "What sells — and why." },
    ],
    methodTitle: "How we test",
    methodItems: [
      { icon: Snowflake, label: "Winter range measured at -10 °C, not WLTP." },
      { icon: Zap, label: "Charging curves from real 10–80% stops on Ionity and Supercharger." },
      { icon: Battery, label: "Usable battery capacity, not gross." },
      { icon: ShieldCheck, label: "Cross-checked against Bjørn Nyland, Fully Charged and InsideEVs." },
    ],
    nokRate: 11.5,
  },
} as const;

// Manual editorial scores for AggregateRating snippets.
const SCORES: Record<string, number> = {
  "tesla-model-y": 4.4,
  "porsche-macan-ev": 4.7,
  "kia-ev9": 4.5,
  "hyundai-ioniq5": 4.4,
  "bmw-i5": 4.5,
  "audi-q6-etron": 4.6,
  "volvo-ex30": 4.2,
  "bmw-ix": 4.4,
};

function formatPrice(model: EVModel, variant: Variant) {
  if (variant === "no") {
    const nok = Math.round((model.priceEur.from * COPY.no.nokRate) / 1000) * 1000;
    return new Intl.NumberFormat("nb-NO").format(nok) + " kr";
  }
  return "€" + new Intl.NumberFormat("en-GB").format(model.priceEur.from);
}

interface CardProps {
  model: EVModel;
  variant: Variant;
  langPrefix: string;
}

function ReviewCard({ model, variant, langPrefix }: CardProps) {
  const c = COPY[variant];
  const { image } = useCarImage({ brand: model.brand, model: model.name });
  const score = SCORES[model.slug];

  return (
    <article
      className="glass rounded-3xl border border-border/40 overflow-hidden flex flex-col hover:border-border/70 transition-colors group"
      itemScope
      itemType="https://schema.org/Review"
    >
      <Link
        to={`${langPrefix}/ev/models/${model.slug}`}
        className="relative block aspect-[16/10] bg-card overflow-hidden"
      >
        {image ? (
          <img
            src={image.url}
            alt={`${model.brand} ${model.name} – ${variant === "no" ? "biltest" : "car review"} ${model.year}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-card animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-white bg-black/60 backdrop-blur px-2 py-1 rounded">
            {model.brand}
          </span>
          {score && (
            <span className="text-[10px] uppercase tracking-widest text-black bg-accent px-2 py-1 rounded inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {score.toFixed(1)}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white" itemProp="itemReviewed">
            {model.name}
          </h3>
          <p className="text-xs text-white/80 line-clamp-1">{model.tagline}</p>
        </div>
        {image?.credit && (
          <div className="absolute bottom-1 right-2 text-[9px] text-white/60">
            {image.credit}
          </div>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.metricRange}</div>
            <div className="font-semibold">{model.specs.range.winter} km</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.metricCharge}</div>
            <div className="font-semibold">{model.specs.charging.time10to80} min</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.metricPower}</div>
            <div className="font-semibold">{model.specs.performance.powerKw} kW</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.metricPrice}</div>
            <div className="font-semibold">{formatPrice(model, variant)}</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3" itemProp="reviewBody">
          {model.summary}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link
            to={`${langPrefix}/ev/models/${model.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {c.readTest} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`${langPrefix}/ev/reviews`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {c.watchVideos}
          </Link>
        </div>
      </div>
    </article>
  );
}

function BiltesterPage({ variant }: { variant: Variant }) {
  const c = COPY[variant];
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const langPrefix = lang === "no" ? "/no" : lang === "en" ? "/en" : "";

  const sortedModels = useMemo(() => {
    return [...EV_MODELS].sort((a, b) => (SCORES[b.slug] ?? 0) - (SCORES[a.slug] ?? 0));
  }, []);

  const canonicalPath = variant === "no" ? "/biltester" : "/car-reviews";
  const canonical =
    "https://www.autovere.com" + (lang === "no" ? "/no" : lang === "en" ? "/en" : "") + canonicalPath;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.h1,
    description: c.description,
    itemListElement: sortedModels.slice(0, 20).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.autovere.com${langPrefix}/ev/models/${m.slug}`,
      name: `${m.brand} ${m.name}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AUTOVERE", item: "https://www.autovere.com/" },
      { "@type": "ListItem", position: 2, name: c.h1, item: canonical },
    ],
  };

  return (
    <PageShell>
      <SEO
        title={c.title}
        description={c.description}
        canonical={canonical}
        jsonLd={[itemListLd, breadcrumbLd]}
      />

      {/* Hero */}
      <section className="relative border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-4">{c.eyebrow}</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gradient">
              {c.h1}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{c.lede}</p>
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-10">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {c.methodTitle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.methodItems.map((it, i) => (
              <div key={i} className="flex items-start gap-3 glass rounded-xl border border-border/40 p-4">
                <it.icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{it.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{c.listingTitle}</h2>
            <p className="text-sm text-muted-foreground mt-1">{c.listingSub}</p>
          </div>
          <div className="text-xs text-muted-foreground hidden md:block">
            {sortedModels.length} {variant === "no" ? "biler" : "cars"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModels.map((m) => (
            <ReviewCard key={m.slug} model={m} variant={variant} langPrefix={langPrefix} />
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {c.relatedTitle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.relatedItems.map((it) => (
              <Link
                key={it.to}
                to={localizePath(it.to, lang)}
                className="glass rounded-xl border border-border/40 p-5 hover:border-accent/60 transition-colors group"
              >
                <div className="font-semibold mb-1 group-hover:text-accent transition-colors">
                  {it.label}
                </div>
                <div className="text-xs text-muted-foreground">{it.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export const Biltester = () => <BiltesterPage variant="no" />;
export const CarReviews = () => <BiltesterPage variant="en" />;

export default Biltester;
