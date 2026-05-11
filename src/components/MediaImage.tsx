import { useEffect, useState } from "react";
import type { MediaAttribution } from "@/data/articles";

interface MediaImageProps {
  media: MediaAttribution;
  className?: string;
  aspectClass?: string;
  showAttribution?: boolean;
  variant?: "hero" | "card";
}

export function MediaImage({
  media,
  className = "",
  aspectClass = "aspect-[16/9]",
  showAttribution = false,
  variant = "card",
}: MediaImageProps) {
  const resolvedUrl = variant === "hero" ? (media.heroUrl ?? media.url) : (media.thumbnailUrl ?? media.url);
  const [failed, setFailed] = useState(!resolvedUrl);
  const [loaded, setLoaded] = useState(false);
  const gradient = media.gradient ?? "from-slate-900 to-slate-800";
  const fallbackGridColor = "hsl(var(--foreground) / 0.18)";

  useEffect(() => {
    setFailed(!resolvedUrl);
    setLoaded(false);
  }, [resolvedUrl]);

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {!failed && resolvedUrl ? (
        <>
          <img
            src={resolvedUrl}
            alt={media.alt}
            loading={variant === "hero" ? "eager" : "lazy"}
            fetchPriority={variant === "hero" ? "high" : "auto"}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent pointer-events-none" />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          {/* Subtle grid overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                `linear-gradient(${fallbackGridColor} 1px, transparent 1px), linear-gradient(90deg, ${fallbackGridColor} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Alt text as centred label */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="text-white/20 text-xs font-medium text-center leading-relaxed max-w-xs">
              {media.alt}
            </p>
          </div>
        </>
      )}
      {showAttribution && (
        <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm text-[9px] text-muted-foreground px-1.5 py-0.5 rounded pointer-events-none">
          {media.source} · {media.license}
        </div>
      )}
    </div>
  );
}
