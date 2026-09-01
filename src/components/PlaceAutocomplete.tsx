import { useEffect, useId, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { searchPlaces, type PlaceHit } from "@/lib/geo-search.functions";
import { cn } from "@/lib/utils";

export type { PlaceHit };

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  /** Fired when the user picks a suggestion — coordinates are then locked. */
  onSelect: (hit: PlaceHit | null) => void;
  region: "eu" | "us" | "ca";
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel: string;
};

/**
 * Live OSM place search with a 300 ms debounce. Picking a suggestion locks the
 * exact latitude, longitude and ISO country code into the caller's route state
 * so the router never has to guess what the typed text meant.
 */
export function PlaceAutocomplete({
  value,
  onValueChange,
  onSelect,
  region,
  placeholder,
  icon,
  className,
  ariaLabel,
}: Props) {
  const search = useServerFn(searchPlaces);
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const skipNext = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setHits([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await search({ data: { query: q, region } });
        if (cancelled) return;
        setHits(res);
        setActive(0);
        setOpen(res.length > 0);
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      setLoading(false);
    };
  }, [value, region, search]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const choose = (hit: PlaceHit) => {
    skipNext.current = true;
    onValueChange(hit.label);
    onSelect(hit);
    setOpen(false);
    setHits([]);
  };

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <label className="relative block">
        <span className="sr-only">{ariaLabel}</span>
        {icon}
        <Input
          value={value}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          onChange={(e) => {
            onValueChange(e.target.value);
            onSelect(null);
          }}
          onFocus={() => hits.length && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || !hits.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % hits.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + hits.length) % hits.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const hit = hits[active];
              if (hit) choose(hit);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="h-12 border-border bg-background/60 pl-9 pr-9 text-base placeholder:text-muted-foreground"
          placeholder={placeholder}
        />
        {loading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </label>

      {open && hits.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
        >
          {hits.map((hit, i) => (
            <li key={hit.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(hit)}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left text-sm transition-colors",
                  i === active ? "bg-primary/15 text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="font-medium text-foreground">{hit.name}</span>
                <span className="text-xs">
                  {[hit.state, hit.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
