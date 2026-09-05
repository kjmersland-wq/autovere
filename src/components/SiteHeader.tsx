import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";

import { CurrencySelector } from "@/components/CurrencySelector";
import { LocaleLink } from "@/components/LocaleLink";
import { FlagIcon } from "@/components/FlagIcon";
import { useAuth } from "@/lib/auth";
import { useLocale, useT } from "@/lib/i18n";
import { pathForCode, pathForRegion, prefixForCode } from "@/lib/locales";
import { isChallengeLang } from "@/lib/challenge-content";

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
import { regionStrings } from "@/lib/region-i18n";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/autovere-logo.png";

function regionLabel(to: string, region: RegionKey, locale: Parameters<typeof regionStrings>[0]) {
  const nav = regionStrings(locale, region).nav;
  const key = to.replace(/^\//, "") as keyof typeof nav;
  return nav[key];
}

/** Extract the language slug from /challenge or /challenge/<lang>. */
function challengeLangFromPath(pathname: string): string | null {
  if (pathname === "/challenge") return "en";
  const m = pathname.match(/^\/challenge\/([^/]+)$/);
  if (m && isChallengeLang(m[1]!)) return m[1]!;
  return null;
}

export function SiteHeader({ region }: { region?: RegionKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeRegion = region ?? regionFromPath(pathname);
  const t = useT();
  const locale = useLocale();
  const challengeLang = challengeLangFromPath(pathname);
  const isChallenge = challengeLang !== null;
  const displayLocale = challengeLang ?? locale;
  const lang = LANGUAGES.find((l) => l.code === displayLocale) ?? LANGUAGES[0]!;
  const [open, setOpen] = useState(false);
  const { user, openAuth, signOut } = useAuth();

  const challengeHref = displayLocale === "en"
    ? "/challenge"
    : `/challenge/${prefixForCode(displayLocale) ?? displayLocale}`;

  function languageTarget(code: string): string {
    if (isChallenge) {
      if (code === "en") return "/challenge";
      const prefix = prefixForCode(code);
      return prefix ? `/challenge/${prefix}` : `/challenge/${code}`;
    }
    return pathForCode(pathname, code);
  }

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
          <span className="hidden sm:inline">
            Auto<span className="text-primary">Vere</span>
          </span>
        </LocaleLink>

        <nav className="ml-2 hidden items-center gap-1 rounded-full border border-border bg-background/40 p-1 lg:flex">
          {REGIONS.map((r) => (
            <Link
              key={r.key}
              to={pathForRegion(pathname, r.key) as "/"}
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
              {regionLabel(l.to, activeRegion, locale) ?? t.header.nav[l.to] ?? l.label}
            </LocaleLink>
          ))}
          <Link
            to={challengeHref as "/challenge"}
            className="group flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" />
            {t.header.challenge}
          </Link>
        </nav>

        <div
          data-tour="locale"
          className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0"
        >
        <CurrencySelector />

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
                  asChild
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold tracking-wide transition-colors",
                    active
                      ? "bg-teal/10 text-teal focus:bg-teal/15 focus:text-teal"
                      : "text-foreground focus:bg-foreground/10 focus:text-foreground",
                  )}
                >
                  <Link to={languageTarget(l.code) as "/"} aria-label={l.label}>
                    <FlagIcon code={l.flag} className="h-4 w-6" />
                    <span>{l.flag}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>


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
          onClick={() => setOpen(true)}
          aria-label={t.header.toggleNav}
          aria-expanded={open}
          className="shrink-0 rounded-full border border-border bg-background/50 p-2 lg:hidden"
        >
          <Menu className="size-4" />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[min(20rem,85vw)] border-border bg-background p-0 lg:hidden">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle className="flex items-center gap-2.5 text-base">
              <img
                src={logoMark}
                alt="AutoVere"
                width={1024}
                height={1024}
                className="size-7 rounded-lg ring-1 ring-border/60"
              />
              Auto<span className="text-primary">Vere</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-5 py-5">
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Link
                  key={r.key}
                  to={pathForRegion(pathname, r.key) as "/"}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-sm transition-colors",
                    activeRegion === r.key
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  <span className="mr-1.5">{r.flag}</span>
                  {t.header.regions[r.key]}
                </Link>
              ))}
            </div>

            <nav className="grid gap-1">
              {NAV_LINKS.map((l) => (
                <LocaleLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeClassName="bg-primary/10 text-primary"
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted"
                >
                  {regionLabel(l.to, activeRegion, locale) ?? t.header.nav[l.to] ?? l.label}
                </LocaleLink>
              ))}
              <Link
                to={challengeHref as "/challenge"}
                onClick={() => setOpen(false)}
                className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted"
              >
                <span className="mr-2 inline-block size-1.5 rounded-full bg-primary" />
                {t.header.challenge}
              </Link>
              <LocaleLink
                to="/pricing"
                onClick={() => setOpen(false)}
                activeClassName="bg-primary/10 text-primary"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted"
              >
                {t.header.plansMenu}
              </LocaleLink>
            </nav>

            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => {
                const active = l.code === lang.code;
                return (
                  <Link
                    key={l.code}
                    to={languageTarget(l.code) as "/"}
                    aria-label={l.label}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold tracking-wide transition-colors",
                      active
                        ? "bg-teal/10 text-teal"
                        : "text-foreground hover:bg-foreground/10",
                    )}
                  >
                    <FlagIcon code={l.flag} className="h-4 w-6" />
                    <span>{l.flag}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </SheetContent>
      </Sheet>
    </header>
  );
}
