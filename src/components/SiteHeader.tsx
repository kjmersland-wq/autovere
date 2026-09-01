import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";

import { CurrencySelector } from "@/components/CurrencySelector";
import { LocaleLink } from "@/components/LocaleLink";
import { FlagIcon } from "@/components/FlagIcon";
import { useAuth } from "@/lib/auth";
import { useLocale, useT } from "@/lib/i18n";
import { pathForCode, prefixFromPath } from "@/lib/locales";

import { LANGUAGES, NAV_LINKS, REGIONS, regionFromPath, type RegionKey } from "@/lib/trip-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/autovere-logo.png";

const US_NAV_LABELS: Record<string, string> = {
  "/planner": "Road Trip Planner",
  "/tolls": "Tolls & Express Lanes",
  "/scenic": "Scenic Byways & Ferries",
  "/garage": "My Garage",
};

function usLabel(to: string, region: RegionKey) {
  return region === "us" ? US_NAV_LABELS[to] : undefined;
}

export function SiteHeader({ region }: { region?: RegionKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const prefix = prefixFromPath(pathname);
  const activeRegion = region ?? regionFromPath(pathname);
  const t = useT();
  const locale = useLocale();
  const [lang, setLang] = useState(
    () => LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]!,
  );
  const [open, setOpen] = useState(false);
  const { user, openAuth, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-hidden px-4 py-3 sm:gap-4 sm:px-8">
        <LocaleLink to="/" className="flex min-w-0 shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight">
          <img
            src={logoMark}
            alt="AutoVere"
            width={1024}
            height={1024}
            className="size-8 shrink-0 rounded-[0.55rem] shadow-lg shadow-black/30 ring-1 ring-border/60"
          />
          <span className="hidden min-[380px]:inline">
            Auto<span className="text-primary">Vere</span>
          </span>
        </LocaleLink>

        <nav className="ml-2 hidden items-center gap-1 rounded-full border border-border bg-background/40 p-1 lg:flex">
          {REGIONS.map((r) => (
            <Link
              key={r.key}
              to={(r.key === "eu" && prefix ? `/${prefix}` : r.to) as "/"}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeRegion === r.key
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              <span className="mr-1.5">{r.flag}</span>
              {t.header.regions[r.key]}
            </Link>
          ))}
        </nav>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <LocaleLink
              key={l.to}
              to={l.to}
              activeClassName="text-primary"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {usLabel(l.to, activeRegion) ?? t.header.nav[l.to] ?? l.label}
            </LocaleLink>
          ))}
        </nav>

        <CurrencySelector className="ml-auto shrink-0 lg:ml-0" />

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/50 px-2.5 py-1.5 text-sm font-semibold tracking-wide transition-colors hover:bg-background/80 sm:px-3 lg:ml-0">
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
                  onSelect={() => {
                    setLang(l);
                    const target = pathForCode(pathname, l.code);
                    if (target !== pathname) void navigate({ to: target });
                  }}
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

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20">
              <UserRound className="size-4" />
              <span className="hidden max-w-[9rem] truncate sm:inline">{user.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl border-border bg-popover p-1.5">
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <LocaleLink to="/garage">{t.header.garageMenu}</LocaleLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <LocaleLink to="/pricing">{t.header.plansMenu}</LocaleLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg"
                onSelect={() => {
                  void signOut();
                }}
              >
                <LogOut className="size-4" /> {t.header.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            onClick={() => openAuth("signin")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserRound className="size-4" />
            <span className="hidden sm:inline">{t.header.signIn}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t.header.toggleNav}
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
                to={(r.key === "eu" && prefix ? `/${prefix}` : r.to) as "/"}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-sm",
                  activeRegion === r.key && "bg-primary text-primary-foreground",
                )}
              >
                {r.flag} {t.header.regions[r.key]}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            {NAV_LINKS.map((l) => (
              <LocaleLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/85"
              >
                {usLabel(l.to, activeRegion) ?? t.header.nav[l.to] ?? l.label}
              </LocaleLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
