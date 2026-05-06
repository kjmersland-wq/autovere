import { Shield, ShieldCheck, Sparkles, Heart, AlertCircle, Sun, Snowflake, Eye, Car, Users, Activity, Gauge } from "lucide-react";
import type { SafetyIntelligence, SafetyDimension } from "@/hooks/use-safety-intelligence";

const ICON_FOR_LABEL: Record<string, typeof Shield> = {
  "Family safety": Users,
  "Highway confidence": Car,
  "Winter confidence": Snowflake,
  "City visibility": Eye,
  "Pedestrian safety": Heart,
  "Active assistance": Activity,
  "Braking confidence": Gauge,
  "Child safety": Users,
};

const RATING_TONE: Record<SafetyDimension["rating"], string> = {
  Excellent: "text-accent",
  Strong: "text-accent",
  Good: "text-foreground",
  Mixed: "text-muted-foreground",
};

const RATING_BAR: Record<SafetyDimension["rating"], number> = {
  Excellent: 100,
  Strong: 82,
  Good: 65,
  Mixed: 45,
};

const SkeletonLine = ({ w = "w-full" }: { w?: string }) => (
  <div className={`h-3 ${w} rounded bg-secondary/40 animate-pulse`} />
);

export const SafetyConfidence = ({ data, loading }: { data: SafetyIntelligence | null; loading: boolean }) => {
  return (
    <section className="container pb-24">
      <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Safety & confidence
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight max-w-3xl">
        {loading || !data ? "How safe it actually feels." : data.safetyHeadline}
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
        {loading || !data ? (
          <span className="inline-block w-full space-y-2">
            <SkeletonLine />
            <SkeletonLine w="w-4/5" />
          </span>
        ) : (
          data.safetySummary
        )}
      </p>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        {/* Dimensions */}
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-6">
            <Shield className="w-3.5 h-3.5" /> Confidence dimensions
          </div>
          <div className="space-y-5">
            {loading || !data
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonLine w="w-1/3" />
                    <SkeletonLine />
                  </div>
                ))
              : data.safetyDimensions.map((d) => {
                  const Icon = ICON_FOR_LABEL[d.label] ?? Shield;
                  return (
                    <div key={d.label}>
                      <div className="flex items-center justify-between mb-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-accent" />
                          </div>
                          <div className="font-medium text-sm">{d.label}</div>
                        </div>
                        <div className={`text-xs uppercase tracking-wider font-semibold ${RATING_TONE[d.rating]}`}>
                          {d.rating}
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-secondary/40 overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-700"
                          style={{ width: `${RATING_BAR[d.rating]}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed pl-11">{d.note}</div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* AI insights */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-3">
              <Snowflake className="w-3.5 h-3.5" /> Winter notes
            </div>
            <p className="text-sm leading-relaxed">
              {loading || !data ? <SkeletonLine /> : data.winterNotes}
            </p>
          </div>
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-3">
              <Sun className="w-3.5 h-3.5" /> Long-term outlook
            </div>
            <p className="text-sm leading-relaxed">
              {loading || !data ? <SkeletonLine /> : data.longTermOutlook}
            </p>
          </div>
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Sources synthesised
            </div>
            <div className="flex flex-wrap gap-2">
              {(data?.sources ?? ["Euro NCAP", "IIHS", "Owner reviews", "Reviewer consensus"]).map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
              Lumen synthesises public safety testing and reviewer consensus. We never copy or fabricate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const OwnershipIntelligence = ({ data, loading, carName }: { data: SafetyIntelligence | null; loading: boolean; carName: string }) => {
  return (
    <section className="container pb-24">
      <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Ownership intelligence</div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight max-w-3xl">
        Living with the {carName}, in the words of those who do.
      </h2>
      <p className="text-base text-muted-foreground mb-10 max-w-2xl">
        Synthesised from owner communities, long-term reviews and trusted automotive publications.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-5">
            <Heart className="w-3.5 h-3.5" /> Things owners frequently love
          </div>
          <ul className="space-y-3">
            {loading || !data
              ? Array.from({ length: 4 }).map((_, i) => <li key={i}><SkeletonLine /></li>)
              : data.ownersLove.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
            <AlertCircle className="w-3.5 h-3.5" /> Commonly mentioned considerations
          </div>
          <ul className="space-y-3">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => <li key={i}><SkeletonLine /></li>)
              : data.ownersMention.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 mt-2 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="glass rounded-3xl p-7">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent mb-4">Best suited for</div>
          <ul className="space-y-2">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => <li key={i}><SkeletonLine /></li>)
              : data.bestSuitedFor.map((s) => (
                  <li key={s} className="text-sm leading-relaxed">{s}</li>
                ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-7">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">Less ideal for</div>
          <ul className="space-y-2">
            {loading || !data
              ? Array.from({ length: 2 }).map((_, i) => <li key={i}><SkeletonLine /></li>)
              : data.lessIdealFor.map((s) => (
                  <li key={s} className="text-sm leading-relaxed text-muted-foreground">{s}</li>
                ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-7">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent mb-4">Worth knowing before buying</div>
          <ul className="space-y-2">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => <li key={i}><SkeletonLine /></li>)
              : data.worthKnowing.map((s) => (
                  <li key={s} className="text-sm leading-relaxed">{s}</li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
