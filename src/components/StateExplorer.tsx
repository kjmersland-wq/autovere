import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Fuel, Search, Snowflake, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CA_PROVINCES, US_STATES, type CaProvince, type UsState } from "@/lib/state-explorer";
import { cn } from "@/lib/utils";

type Props = {
  region: "us" | "ca";
  onPlanRoute?: (name: string) => void;
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <div className="mt-2 text-sm text-foreground/85">{children}</div>
    </div>
  );
}

export function StateExplorer({ region, onPlanRoute }: Props) {
  const isUs = region === "us";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<UsState | CaProvince | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list: (UsState | CaProvince)[] = isUs ? US_STATES : CA_PROVINCES;
    if (!q) return list;
    return list.filter(
      (i) => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q),
    );
  }, [isUs, query]);

  const usSelected = selected && "helmet" in selected ? (selected as UsState) : null;
  const caSelected = selected && "winterTires" in selected ? (selected as CaProvince) : null;

  const fuelUnit = isUs ? "$/gal" : "CAD/L";
  const kwhUnit = isUs ? "$/kWh" : "CAD/kWh";

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-8">
      <div className="glass-panel overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
        >
          <span>
            <span className="block text-lg font-semibold sm:text-xl">
              {isUs ? "🇺🇸 US State Explorer" : "🇨🇦 Canada Province & Territory Explorer"}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {isUs
                ? "All 50 states plus DC — fuel and charging averages, toll systems and helmet rules."
                : "All 13 provinces and territories — fuel and charging averages, winter tyre laws and toll systems."}
            </span>
          </span>
          <ChevronDown
            className={cn("size-5 shrink-0 text-primary transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="border-t border-border px-5 pb-7 pt-5 sm:px-7">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isUs ? "Search states…" : "Search provinces…"}
                className="h-10 border-border bg-background/60 pl-9"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="rounded-2xl border border-border bg-background/40 p-4 text-left transition hover:border-primary/50 hover:bg-background/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {item.code}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/75">
                    <span className="inline-flex items-center gap-1">
                      <Fuel className="size-3.5 text-primary" /> {item.petrol.toFixed(2)} {fuelUnit}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="size-3.5 text-primary" /> {item.charging.toFixed(2)} {kwhUnit}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs text-muted-foreground">{item.tollSystem}</p>
                </button>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">Nothing matched — try another name.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {isUs ? "🇺🇸" : "🇨🇦"} {selected.name}
                  {caSelected && caSelected.frName !== caSelected.name && (
                    <span className="ml-2 text-base font-normal text-muted-foreground">
                      {caSelected.frName}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Indicative averages — verify with the official portal before you travel.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Regular"
                  value={`${isUs ? "$" : "C$"}${selected.petrol.toFixed(2)}`}
                  hint={isUs ? "per gallon" : "per litre"}
                />
                <Stat
                  label="Diesel"
                  value={`${isUs ? "$" : "C$"}${selected.diesel.toFixed(2)}`}
                  hint={isUs ? "per gallon" : "per litre"}
                />
                <Stat
                  label="DC fast charge"
                  value={`${isUs ? "$" : "C$"}${selected.charging.toFixed(2)}`}
                  hint="per kWh"
                />
              </div>

              <Block title="Toll system">
                <p className="font-medium text-foreground">{selected.tollSystem}</p>
                <p className="mt-1">{selected.tollNote}</p>
              </Block>

              {usSelected && (
                <Block title="🏍️ Motorcycle helmet compliance">
                  <p className="font-medium text-foreground">{usSelected.helmet}</p>
                  <p className="mt-1">{usSelected.helmetNote}</p>
                </Block>
              )}

              {caSelected && (
                <>
                  <Block title="⚡ Charging networks">
                    <div className="flex flex-wrap gap-1.5">
                      {caSelected.networks.map((n) => (
                        <span
                          key={n}
                          className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </Block>
                  <Block title="Winter tyre law">
                    <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Snowflake className="size-4 text-primary" />
                      {caSelected.winterTires}
                    </p>
                    <p className="mt-1">{caSelected.winterWindow}</p>
                  </Block>
                </>
              )}

              {selected.portal && (
                <a
                  href={selected.portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Official portal · {selected.portal.label}
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  onPlanRoute?.(selected.name);
                  setSelected(null);
                }}
              >
                🚀 Plan Road Trip to {selected.name}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
