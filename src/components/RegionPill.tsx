import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useRegion } from "@/hooks/use-region";
import { listRegions } from "@/lib/region";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const RegionPill = () => {
  const { region, setRegion } = useRegion();
  const [open, setOpen] = useState(false);
  const regions = listRegions();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Region: ${region.name}`}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-medium">{region.flag} {region.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass border-border/50">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Tailor experience to
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {regions.map((r) => (
            <DropdownMenuItem
              key={r.code}
              onSelect={() => setRegion(r.code)}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{r.flag}</span>
                <span>{r.name}</span>
              </span>
              {r.code === region.code && <Check className="w-4 h-4 text-accent" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
