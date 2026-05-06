import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const COLS = [
  {
    label: "Discover",
    links: [
      { to: "/cars", label: "Cars" },
      { to: "/collections", label: "Collections" },
      { to: "/personalities", label: "Personalities" },
      { to: "/watch", label: "Watch" },
    ],
  },
  {
    label: "Decide",
    links: [
      { to: "/compare", label: "Compare" },
      { to: "/learn", label: "Learn" },
      { to: "/pricing", label: "Premium" },
      { to: "/#advisor", label: "Talk to Lumen" },
    ],
  },
  {
    label: "Company",
    links: [
      { to: "/contact", label: "Contact" },
      { to: "/contact", label: "Help center" },
      { to: "/contact", label: "Privacy" },
      { to: "/contact", label: "Terms" },
    ],
  },
];

export const SiteFooter = () => (
  <footer className="relative mt-32 border-t border-border/30">
    <div className="absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-glow blur-3xl opacity-20 pointer-events-none" />

    <div className="container relative pt-20 pb-10">
      <div className="grid lg:grid-cols-[1.3fr_2fr] gap-16 mb-16">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            AUTOVERE
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A calmer, more intelligent way to discover your next car. Built around
            transparency, responsible AI, and the people who drive what we make.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {COLS.map((c) => (
            <div key={c.label}>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">
                {c.label}
              </div>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} AUTOVERE. The future of choosing a car.</div>
        <div className="opacity-80">
          Developed and operated by{" "}
          <span className="text-foreground/90 font-medium">KM TECH LABS</span>, Kristiansand, Norway.
        </div>
      </div>
    </div>
  </footer>
);
