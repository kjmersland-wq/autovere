import { Globe2, Mountain, ShieldCheck, Zap } from "lucide-react";
import { useLocale, useT } from "@/lib/i18n";
import { europeCoverageCopy } from "@/lib/feature-i18n";

export function FeatureHighlights() {
  const t = useT();
  const { locale } = useLocale();
  const coverage = europeCoverageCopy[locale] ?? europeCoverageCopy.en;
  const features = [
    { icon: Zap, title: t.featureEvTitle, description: t.featureEvDescription },
    { icon: ShieldCheck, title: t.featureMarkupTitle, description: t.featureMarkupDescription },
    { icon: Mountain, title: t.featureScenicTitle, description: t.featureScenicDescription },
    { icon: Globe2, title: coverage.title, description: coverage.description },
  ];
  return (
    <div id="features" className="mt-4 grid scroll-mt-6 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {features.map(({ icon: Icon, title, description }) => (
        <div key={title} className="panel bg-gradient-to-br from-surface/90 via-surface/70 to-primary/5 p-4 backdrop-blur-sm transition-colors hover:border-primary/30">
          <Icon className="size-5 text-primary" aria-hidden />
          <h2 className="mt-3 text-sm font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
}
