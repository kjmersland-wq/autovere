import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";

import { LANGUAGES, NAV_LINKS, REGIONS, type RegionKey } from "@/lib/trip-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SiteHeader({ region }: { region?: RegionKey }) {
  const [lang, setLang] = useState(LANGUAGES[0]);
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
                region === r.key
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
          <DropdownMenuTrigger className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-background/80 lg:ml-0">
            <span>{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {LANGUAGES.map((l) => (
              <DropdownMenuItem key={l.code} onSelect={() => setLang(l)}>
                <span className="mr-2">{l.flag}</span>
                {l.label}
              </DropdownMenuItem>
            ))}
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
                  region === r.key && "bg-primary text-primary-foreground",
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
