import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CURRENCIES, CURRENCY_BY_CODE, useCurrency } from "@/lib/currency";

/** Compact dropdown used in the sticky header. */
export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const active = CURRENCY_BY_CODE[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Select display currency"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm font-semibold tracking-wide transition-colors hover:bg-background/80",
          className,
        )}
      >
        <span>{active.emoji}</span>
        <span>{active.code}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border bg-popover p-1.5 shadow-2xl">
        {CURRENCIES.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onSelect={() => setCurrency(c.code)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              c.code === currency
                ? "bg-primary/15 text-primary focus:bg-primary/20 focus:text-primary"
                : "text-foreground focus:bg-foreground/10",
            )}
          >
            <span>{c.emoji}</span>
            <span className="font-semibold">{c.code}</span>
            <span className="ml-auto text-xs text-muted-foreground">{c.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Pill row used in the results summary. */
export function CurrencyPills({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {CURRENCIES.map((c) => {
        const on = c.code === currency;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => setCurrency(c.code)}
            aria-pressed={on}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              on
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-background/40 text-foreground/75 hover:border-primary/50 hover:text-foreground",
            )}
          >
            <span>{c.emoji}</span>
            {c.code}
          </button>
        );
      })}
    </div>
  );
}
