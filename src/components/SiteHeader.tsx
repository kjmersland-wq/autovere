import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";

import { FlagIcon } from "@/components/FlagIcon";

import { LANGUAGES, NAV_LINKS, REGIONS, regionFromPath, type RegionKey } from "@/lib/trip-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SiteHeader({ region }: { region?: RegionKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeRegion = region ?? regionFromPath(pathname);
  const [lang, setLang] = useState(LANGUAGES[0]!);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Auto<span className="text-primary">Vere</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 rounded-full border border-border bg-background/40 p-1 lg:flex">
          {REGIONS.map((r) => (
            <Link
              key={r.key}
              to={r.to}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeRegion === r.key
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              <span className="mr-1.5">{r.flag}</span>
              {r.label}
            </Link>
          ))}
        </nav>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm font-semibold tracking-wide transition-colors hover:bg-background/80 lg:ml-0">
            <FlagIcon code={lang.flag} />
            <span>{lang.flag}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-24 rounded-xl border-border bg-popover p-1.5 shadow-2xl"
          >
            {LANGUAGES.map((l) => {
              const active = l.code === lang.code;
              return (
                <DropdownMenuItem
                  key={l.code}
                  onSelect={() => setLang(l)}
                  aria-label={l.label}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold tracking-wide transition-colors",
                    active
                      ? "bg-teal/10 text-teal focus:bg-teal/15 focus:text-teal"
                      : "text-foreground focus:bg-foreground/10 focus:text-foreground",
                  )}
                >
                  <FlagIcon code={l.flag} className="h-4 w-6" />
                  <span>{l.flag}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="rounded-full border border-border bg-background/50 p-2 lg:hidden"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-5 py-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <Link
                key={r.key}
                to={r.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-sm",
                  activeRegion === r.key && "bg-primary text-primary-foreground",
                )}
              >
                {r.flag} {r.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/85"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
