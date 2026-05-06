import { ArrowRight, ExternalLink, MapPin, CalendarCheck, Zap, BadgePercent } from "lucide-react";
import { useRegion } from "@/hooks/use-region";
import { brandLinks } from "@/lib/region";
import type { Car } from "@/data/cars";

type Props = { a: Car; b: Car };

export const CompareNextStepsSection = ({ a, b }: Props) => {
  const { region } = useRegion();

  const cars = [a, b].map((c) => {
    const modelSlug = c.slug.split("-").slice(1).join("-") || c.slug;
    const links = brandLinks(c.brand, region, modelSlug);
    return { car: c, links };
  });

  return (
    <section className="container pb-24" aria-labelledby="compare-next-steps">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-3">
        <div>
          <div className="text-sm text-accent font-medium tracking-wide uppercase">Continue with confidence</div>
          <h2 id="compare-next-steps" className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            Your <span className="text-gradient">next calm step</span>.
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Tailored for <span className="text-foreground font-medium">{region.flag} {region.name}</span>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mb-10">
        No pressure, no funnels. Just the right doors to walk through when you're ready.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {cars.map(({ car, links }) => (
          <div key={car.slug} className="glass rounded-3xl p-8 border border-border/40 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-glow opacity-30" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{car.brand}</div>
              <div className="text-2xl font-bold tracking-tight mb-1">{car.name}</div>
              <div className="text-sm text-muted-foreground mb-6">{car.fit}</div>
              <ul className="space-y-2.5">
                <Step href={links.testDrive} icon={CalendarCheck} label="Book a calm test drive" />
                <Step href={links.dealerLocator} icon={MapPin} label={`Find ${car.brand} near ${region.name}`} />
                <Step href={links.official} icon={ExternalLink} label="Official manufacturer page" />
                {links.charging && <Step href={links.charging} icon={Zap} label={`${region.chargingStandard} charging compatibility`} />}
                <Step href={`https://www.google.com/search?q=${encodeURIComponent(`${car.brand} ${car.name} incentives ${region.name}`)}`} icon={BadgePercent} label={`Local incentives in ${region.name}`} />
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Step = ({ href, icon: Icon, label }: { href: string; icon: typeof ExternalLink; label: string }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border border-border/40 hover:border-accent/50 hover:bg-secondary/40 transition-all"
    >
      <span className="flex items-center gap-3 text-sm">
        <Icon className="w-4 h-4 text-accent" />
        {label}
      </span>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
    </a>
  </li>
);
