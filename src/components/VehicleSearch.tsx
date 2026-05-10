import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Zap, ChevronRight } from "lucide-react";
import { searchVehicles, TYPE_LABELS, TYPE_COLORS, type Vehicle, type VehicleType } from "@/data/vehicles";

const TYPE_FILTERS: { value: VehicleType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ev", label: "Electric" },
  { value: "phev", label: "Plug-in Hybrid" },
  { value: "mild-hybrid", label: "Mild Hybrid" },
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
];

function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

interface VehicleResultProps {
  vehicle: Vehicle;
  query: string;
  onSelect: () => void;
}

function VehicleResult({ vehicle, query, onSelect }: VehicleResultProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (vehicle.evPageSlug) {
      navigate(`/ev/models/${vehicle.evPageSlug}`);
    } else {
      navigate(`/ev/database?vehicle=${vehicle.slug}`);
    }
    onSelect();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-card/60 transition-colors text-left group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-sm font-medium"
            dangerouslySetInnerHTML={{ __html: highlightMatch(vehicle.name, query) }}
          />
          <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 ${TYPE_COLORS[vehicle.type]}`}>
            {TYPE_LABELS[vehicle.type]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{vehicle.tagline}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-semibold text-muted-foreground">€{vehicle.priceFrom.toLocaleString()}</div>
        {vehicle.specs.realWorldRangeKm && (
          <div className="text-[10px] text-emerald-400">{vehicle.specs.realWorldRangeKm} km</div>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </button>
  );
}

interface VehicleSearchProps {
  className?: string;
  placeholder?: string;
  compact?: boolean;
}

export function VehicleSearch({ className = "", placeholder = "Search vehicles...", compact = false }: VehicleSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const results = searchVehicles(query, typeFilter).slice(0, 8);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setTypeFilter("all");
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? handleClose() : handleOpen();
      }
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleOpen, handleClose]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, handleClose]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 rounded-xl glass border border-border/40 hover:border-border/70 transition-colors ${compact ? "px-3 py-2" : "px-4 py-2.5"} ${className}`}
      >
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {!compact && (
          <>
            <span className="text-sm text-muted-foreground">{placeholder}</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/60 border border-border/40 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      {/* Search overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
          <div
            ref={overlayRef}
            className="relative w-full max-w-xl glass rounded-2xl border border-border/60 shadow-2xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BMW iX3, diesel estate, winter EV, family SUV..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={handleClose} className="text-[10px] text-muted-foreground/60 border border-border/40 rounded px-1.5 py-0.5 hover:text-muted-foreground transition-colors">
                ESC
              </button>
            </div>

            {/* Type filters */}
            <div className="flex gap-1.5 px-4 py-2.5 border-b border-border/20 overflow-x-auto scrollbar-hide">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors border ${
                    typeFilter === f.value
                      ? "bg-accent text-primary-foreground border-accent"
                      : "glass border-border/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/20">
              {results.length > 0 ? (
                results.map((v) => (
                  <VehicleResult key={v.slug} vehicle={v} query={query} onSelect={handleClose} />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No vehicles found for "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Zap className="w-3 h-3 text-accent" />
                {results.length} of {searchVehicles("", typeFilter).length} vehicles
              </div>
              <span className="text-[10px] text-muted-foreground">
                ↑↓ navigate · Enter select · Esc close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
