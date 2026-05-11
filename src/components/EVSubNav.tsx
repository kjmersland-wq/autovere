import { NavLink, useLocation } from "react-router-dom";
import { detectLangFromPath, localizePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { DEFAULT_LANG } from "@/i18n/config";

type NavItem = {
  label: string;
  to: string;
  matches?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/ev" },
  { label: "Models", to: "/ev/models", matches: ["/ev/models/"] },
  { label: "Charging", to: "/ev/charging" },
  { label: "Route Planner", to: "/ev/route-planner" },
  { label: "Calculator", to: "/ev/calculator" },
  { label: "Compare", to: "/ev/compare" },
  { label: "Reviews", to: "/ev/reviews" },
  { label: "Networks", to: "/ev/networks", matches: ["/ev/networks/"] },
  { label: "Guides", to: "/ev/guides" },
  { label: "News", to: "/ev/news", matches: ["/ev/news/"] },
  { label: "Markets", to: "/ev/markets" },
];

const stripLocalePrefix = (pathname: string) => {
  const lang = detectLangFromPath(pathname);
  const localizedRoot = lang === DEFAULT_LANG ? "" : `/${lang}`;
  return localizedRoot && pathname.startsWith(localizedRoot)
    ? pathname.slice(localizedRoot.length) || "/"
    : pathname;
};

export function EVSubNav() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const normalizedPath = stripLocalePrefix(pathname);

  return (
    <div className="fixed inset-x-0 top-20 z-40">
      <div className="container">
        <div className="glass rounded-2xl border border-border/40 shadow-soft">
          <div
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide px-2 py-2 md:px-3"
            role="navigation"
            aria-label="EV ecosystem sections"
          >
            {NAV_ITEMS.map((item) => {
              const active =
                normalizedPath === item.to ||
                item.matches?.some((prefix) => normalizedPath.startsWith(prefix));

              return (
                <NavLink
                  key={item.to}
                  to={localizePath(item.to, lang)}
                  className={cn(
                    "group relative flex-shrink-0 rounded-xl px-3.5 py-2 text-xs md:text-sm font-medium transition-all duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-px origin-left rounded-full bg-gradient-to-r from-cyan-400 via-accent to-violet-400 transition-all duration-300",
                      active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70"
                    )}
                  />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
