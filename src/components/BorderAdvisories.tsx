import { useState } from "react";
import { AlertTriangle, Ban, ChevronDown, Dog, Luggage, Pill, ShieldAlert } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTr } from "@/lib/i18n";
import { rulesForRoute, type BorderRule, type BorderRuleCategory, type BorderRuleSeverity } from "@/data/border-regulations";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<BorderRuleCategory, typeof Pill> = {
  medication: Pill,
  pets: Dog,
  customs: Luggage,
  prohibited_gear: ShieldAlert,
  substances: Ban,
};

const CATEGORY_LABEL: Record<BorderRuleCategory, string> = {
  medication: "Medications",
  pets: "Traveling with pets",
  customs: "Customs · alcohol & tobacco",
  prohibited_gear: "Prohibited vehicle gear",
  substances: "Controlled substances",
};

const SEVERITY_CLASS: Record<BorderRuleSeverity, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  info: "border-primary/40 bg-primary/10 text-primary",
};

const SEVERITY_LABEL: Record<BorderRuleSeverity, string> = {
  critical: "Critical",
  warning: "Good to know",
  info: "Info",
};

function RuleCard({ rule }: { rule: BorderRule }) {
  const tr = useTr();
  return (
    <article className={cn("rounded-xl border p-4", SEVERITY_CLASS[rule.severity])}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{tr(rule.title)}</p>
        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", SEVERITY_CLASS[rule.severity])}>
          {tr(SEVERITY_LABEL[rule.severity])}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-foreground/75">{tr(rule.detail)}</p>
    </article>
  );
}

/**
 * Collapsible "Border Crossing Advisories" module — medications, pets,
 * customs, prohibited vehicle gear and controlled substances, matched
 * against the real countries this route actually touches. General
 * guidance only, never a substitute for checking official sources.
 */
export function BorderAdvisories({ countryCodes }: { countryCodes: string[] }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  const rules = rulesForRoute(countryCodes);
  if (!rules.length) return null;

  const grouped = (Object.keys(CATEGORY_LABEL) as BorderRuleCategory[])
    .map((category) => ({ category, items: rules.filter((r) => r.category === category) }))
    .filter((g) => g.items.length > 0);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="glass-panel mt-6 rounded-2xl p-5 sm:p-6"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 text-left">
        <span className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            {tr("Border Crossing Advisories")}
          </span>
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <p className="mt-1 text-sm text-foreground/70">
          {tr(
            "General entry-requirement guidance for the countries on this route — medications, pets, customs, and gear that's banned or restricted at some borders. Always confirm with an official source before you travel.",
          )}
        </p>

        <div className="mt-4 grid gap-5">
          {grouped.map(({ category, items }) => {
            const Icon = CATEGORY_ICON[category];
            return (
              <div key={category}>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Icon className="size-3.5" /> {tr(CATEGORY_LABEL[category])}
                </p>
                <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                  {items.map((rule) => (
                    <RuleCard key={rule.id} rule={rule} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
