import { useState, useCallback } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useSavedContent, type SavedContentType } from "@/hooks/useSavedContent";

interface SaveButtonProps {
  type: SavedContentType;
  slug: string;
  variant?: "heart" | "bookmark";
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export function SaveButton({
  type,
  slug,
  variant = "heart",
  size = "md",
  className = "",
  label,
}: SaveButtonProps) {
  const { isSaved, toggleSave } = useSavedContent();
  const [pulse, setPulse] = useState(false);
  const active = isSaved(type, slug);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSave(type, slug);
      if (!active) {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    },
    [active, toggleSave, type, slug]
  );

  const Icon = variant === "heart" ? Heart : Bookmark;
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  const btnSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from saved" : "Save"}
      className={`
        relative inline-flex items-center justify-center rounded-xl
        glass border border-border/40 hover:border-border/70 transition-all duration-200
        ${btnSize} ${className}
        ${active ? "bg-rose-500/10 border-rose-500/30" : ""}
      `}
    >
      <Icon
        className={`
          ${sizeClass} transition-all duration-200
          ${active ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}
          ${variant === "bookmark" && active ? "fill-accent text-accent" : ""}
        `}
      />
      {/* Save pulse ring */}
      {pulse && (
        <span className="absolute inset-0 rounded-xl ring-2 ring-rose-500/60 animate-ping pointer-events-none" />
      )}
      {label && (
        <span className={`ml-1.5 text-xs font-medium ${active ? "text-rose-400" : "text-muted-foreground"}`}>
          {label}
        </span>
      )}
    </button>
  );
}
