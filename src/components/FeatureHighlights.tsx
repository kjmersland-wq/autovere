import { Mountain, ShieldCheck, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";

export function FeatureHighlights() {
  const t = useT();
  const features = [
    { icon: Zap, title: t.featureEvTitle, description: t.featureEvDescription },
    { icon: ShieldCheck, title: t.featureMarkupTitle, description: t.featureMarkupDescription },
    { icon: Mountain, title: t.featureScenicTitle, description: t.featureScenicDescription },
  ];
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <div key={title} className="panel bg-surface/70 p-4 backdrop-blur-sm">
          <Icon className="size-5 text-primary" aria-hidden />
          <h2 className="mt-3 text-sm font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
}
