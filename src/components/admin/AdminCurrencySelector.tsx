import { ADMIN_CURRENCIES, type AdminCurrency } from "@/components/admin/adminFormat";
import { cn } from "@/lib/utils";

/** Discrete NOK / EUR / USD display-currency toggle for Økonomi/Rapporter. */
export function AdminCurrencySelector({
  value,
  onChange,
}: {
  value: AdminCurrency;
  onChange: (c: AdminCurrency) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background/50 p-1">
      {ADMIN_CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={value === c}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
            value === c ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
