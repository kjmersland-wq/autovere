import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { CARS, COLLECTIONS, PERSONALITIES } from "@/data/cars";

export const SiteFooter = () => (
  <footer className="border-t border-border/30 mt-20">
    <div className="container py-16 grid md:grid-cols-4 gap-10 text-sm">
      <div>
        <div className="flex items-center gap-2 font-semibold mb-4">
          <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          Lumen
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The future of choosing a car. Calm, intelligent, honest.
        </p>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Cars</div>
        <ul className="space-y-2">
          {CARS.slice(0, 5).map((c) => (
            <li key={c.slug}>
              <Link to={`/cars/${c.slug}`} className="hover:text-foreground text-muted-foreground transition-colors">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Discover</div>
        <ul className="space-y-2">
          {COLLECTIONS.slice(0, 5).map((c) => (
            <li key={c.slug}>
              <Link to={`/collections/${c.slug}`} className="hover:text-foreground text-muted-foreground transition-colors">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Personalities</div>
        <ul className="space-y-2">
          {PERSONALITIES.slice(0, 5).map((p) => (
            <li key={p.slug}>
              <Link to={`/personalities/${p.slug}`} className="hover:text-foreground text-muted-foreground transition-colors">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-border/30">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} Lumen Advisor — The future of choosing a car.</div>
        <div className="flex gap-6">
          <Link to="/learn" className="hover:text-foreground">Learn</Link>
          <Link to="/compare" className="hover:text-foreground">Compare</Link>
          <Link to="/#advisor" className="hover:text-foreground">Talk to Lumen</Link>
        </div>
      </div>
    </div>
  </footer>
);
