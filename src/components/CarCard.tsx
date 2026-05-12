import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Car } from "@/data/cars";

export const CarCard = ({ car }: { car: Car }) => (
  <Link
    to={`/cars/${car.slug}`}
    className="group relative glass rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-700 hover:shadow-glow block"
  >
    <div className="relative aspect-[16/11] overflow-hidden">
      <img
        src={car.hero}
        alt={`${car.name} — ${car.fit}`}
        loading="lazy"
        width={1280}
        height={800}
        className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform [transition-duration:2200ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full glass">
        <span className="w-1 h-1 rounded-full bg-accent animate-glow-pulse" />
        {car.tag}
      </div>
      <div className="absolute top-4 right-4 glass rounded-2xl px-3 py-2 text-right">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</div>
        <div className="text-xl font-bold text-gradient leading-none">{car.score}</div>
      </div>
      <div className="absolute bottom-4 left-5 right-5">
        <div className="text-xs text-muted-foreground mb-1">{car.type}</div>
        <h3 className="text-2xl font-semibold tracking-tight">{car.name}</h3>
      </div>
    </div>
    <div className="p-6">
      <div className="font-medium mb-2 text-foreground">{car.fit}</div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{car.tagline}</p>
      <div className="text-xs text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        Explore {car.name} <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </Link>
);
