import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTr } from "@/lib/i18n";

const POI_TAGS = [
  "Family & Playgrounds",
  "Local Food",
  "Nature",
  "Scenic Views",
] as const;

/**
 * Preview of the travel-party POI personalisation. Free visitors can browse and
 * toggle the tags; applying them to the corridor is a Trip Pass feature.
 */
export function TravelPartyStops({ onApply }: { onApply: () => void }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) =>
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  return (
    <Collapsible
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
        <div className="mt-4 flex flex-wrap gap-2">
          {POI_TAGS.map((tag) => {
            const active = selected.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-foreground/80 hover:bg-background/70"
                }`}
              >
                {tr(tag)}
              </button>
            );
          })}
        </div>

        <Button className="mt-5 font-semibold" onClick={onApply}>
          {tr("Apply stops to route")}
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}
