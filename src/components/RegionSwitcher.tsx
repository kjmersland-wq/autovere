import { Link, useRouterState } from "@tanstack/react-router";
import { Check, ChevronDown, Globe2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { groupedRegions, regionEntry, type RegionEntry } from "@/lib/regions.config";
import { pathForRegion } from "@/lib/locales";
import { useT } from "@/lib/i18n";
import type { RegionKey } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

function useRegionName() {
  const t = useT();
  return (r: RegionEntry) => t.header.regions[r.key as RegionKey] ?? r.name;
}

/** Compact, scalable region selector for the desktop header. */
export function RegionSwitcher({ activeRegion }: { activeRegion: RegionKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nameOf = useRegionName();
  const active = regionEntry(activeRegion);
  const groups = groupedRegions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Select region"
        className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:border-primary/40 hover:bg-background/80"
      >
        <Globe2 className="size-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
        <span className="flex items-center gap-1.5">
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary ring-1 ring-primary/25">
            {active?.code ?? "EU"}
          </span>
          <span className="hidden xl:inline">{active ? nameOf(active) : ""}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 rounded-2xl border-white/10 bg-popover/85 p-2 shadow-2xl backdrop-blur-xl"
      >
        {groups.map((g) => (
          <div key={g.id} className="py-1">
            <DropdownMenuLabel className="px-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {g.label}
            </DropdownMenuLabel>
            {g.items.map((r) => {
              const isActive = r.key === activeRegion;
              if (r.status === "soon") {
                return (
                  <div
                    key={r.key}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground/70"
                  >
                    <span className="text-base">{r.flag}</span>
                    <span className="flex-1">{r.name}</span>
                    <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest">
                      Soon
                    </span>
                  </div>
                );
              }
              return (
                <DropdownMenuItem
                  key={r.key}
                  asChild
                  className={cn(
                    "cursor-pointer rounded-xl px-2.5 py-2 text-sm transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground",
                  )}
                >
                  <Link to={pathForRegion(pathname, r.key as "eu") as "/"}>
                    <span className="text-base">{r.flag}</span>
                    <span className="flex-1">{nameOf(r)}</span>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {r.code}
                    </span>
                    {isActive ? <Check className="size-4" /> : null}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Thumb-friendly region list for the mobile slide-out menu. */
export function RegionSwitcherMobile({
  activeRegion,
  onSelect,
}: {
  activeRegion: RegionKey;
  onSelect: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nameOf = useRegionName();
  const groups = groupedRegions();

  return (
    <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
      <p className="flex items-center gap-2 px-1 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Globe2 className="size-3.5 text-primary" /> Region
      </p>
      {groups.map((g) => (
        <div key={g.id} className="pb-1">
          <p className="px-1 pb-1 pt-1 text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            {g.label}
          </p>
          <div className="grid gap-1.5">
            {g.items.map((r) => {
              const isActive = r.key === activeRegion;
              if (r.status === "soon") {
                return (
                  <div
                    key={r.key}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground/70"
                  >
                    <span className="text-base">{r.flag}</span>
                    <span className="flex-1">{r.name}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest">Soon</span>
                  </div>
                );
              }
              return (
                <Link
                  key={r.key}
                  to={pathForRegion(pathname, r.key as "eu") as "/"}
                  onClick={onSelect}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm font-medium transition-all active:scale-[0.98]",
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/10 text-foreground/85 hover:bg-muted",
                  )}
                >
                  <span className="text-base">{r.flag}</span>
                  <span className="flex-1">{nameOf(r)}</span>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {r.code}
                  </span>
                  {isActive ? <Check className="size-4" /> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
