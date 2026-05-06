import { Link, NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/cars", label: "Cars" },
  { to: "/collections", label: "Discover" },
  { to: "/personalities", label: "Personalities" },
  { to: "/watch", label: "Watch" },
  { to: "/compare", label: "Compare" },
  { to: "/learn", label: "Learn" },
];

export const SiteHeader = () => (
  <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/30">
    <div className="container flex items-center justify-between py-4">
      <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        Lumen
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
      <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 rounded-xl">
        <Link to="/#advisor">Try Lumen</Link>
      </Button>
    </div>
  </header>
);
