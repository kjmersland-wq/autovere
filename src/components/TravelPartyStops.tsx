import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocale, useTr } from "@/lib/i18n";
import { loadTravelProfile, saveTravelProfile } from "@/lib/garage";
import {
  POI_GROUPS,
  POI_INTERESTS,
  poiLabel,
  type PoiInterestId,
} from "@/lib/poi-interests";

/**
 * Travel-party POI personalisation across the 14 unified interest categories.
 * Free visitors can browse and toggle the chips; injecting them into the
 * corridor and the exports is a Trip Pass / Pro feature.
 */
export function TravelPartyStops({
  onApply,
  counts,
}: {
  onApply: (selected: PoiInterestId[]) => void;
  counts?: Partial<Record<PoiInterestId, number>>;
}) {
  const tr = useTr();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PoiInterestId[]>([]);

  // Prefill from the saved My Garage travel profile so both places agree.
  useEffect(() => {
    const saved = loadTravelProfile().interests.filter((i) =>
      POI_INTERESTS.some((c) => c.id === i),
    ) as PoiInterestId[];
    if (saved.length) setSelected(saved);
  }, []);

  const grouped = useMemo(
    () => POI_GROUPS.map((g) => ({ group: g, items: POI_INTERESTS.filter((i) => i.group === g) })),
    [],
  );

  const toggle = (id: PoiInterestId) =>
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      const profile = loadTravelProfile();
      saveTravelProfile({ ...profile, interests: next });
      return next;
    });

  return (
    <Collapsible
      data-tour="personalize-stops"
      open={open}
      onOpenChange={setOpen}
      className="glass-panel mt-6 rounded-2xl p-5 sm:p-6"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 text-left">
        <span className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            {tr("Personalize stops for your travel party (POI & Rest Stops)")}
          </span>
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-4 grid gap-5">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {poiLabel(locale, group)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {items.map((item) => {
                  const active = selected.includes(item.id);
                  const count = counts?.[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={active}
                      title={tr(item.hint)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-border bg-background/40 text-foreground/80 hover:bg-background/70"
                      }`}
                    >
                      <span>{poiLabel(locale, item.id)}</span>
                      {typeof count === "number" && (
                        <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Button className="mt-5 font-semibold" onClick={() => onApply(selected)}>
          {tr("Apply stops to route")}
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}
