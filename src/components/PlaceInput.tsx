import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { searchPlaces, type Place } from "@/lib/geo";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  placeholder: string;
  value: Place | null;
  onChange: (p: Place | null) => void;
};

export function PlaceInput({ label, placeholder, value, onChange }: Props) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && query === value.name) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      searchPlaces(query, ctrl.signal)
        .then((r) => {
          setResults(r);
          setOpen(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 320);
    return () => {
      clearTimeout(t);
      ctrl.abort();
      setLoading(false);
    };
  }, [query, value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 transition-all",
          "focus-within:border-primary/60 focus-within:panel-glow",
        )}
      >
        <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
        <input
          className="w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
          }}
          onFocus={() => results.length && setOpen(true)}
          autoComplete="off"
          aria-label={label}
        />
        {loading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-elevated)]">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                onClick={() => {
                  onChange(r);
                  setQuery(r.name);
                  setOpen(false);
                }}
              >
                <span className="text-sm font-semibold text-foreground">{r.name}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
