import { useState } from "react";
import type { MediaAttribution } from "@/data/articles";

interface MediaImageProps {
  media: MediaAttribution;
  className?: string;
  aspectClass?: string;
  showAttribution?: boolean;
}

export function MediaImage({
  media,
  className = "",
  aspectClass = "aspect-[16/9]",
  showAttribution = false,
}: MediaImageProps) {
  const [failed, setFailed] = useState(!media.url);
  const gradient = media.gradient ?? "from-slate-900 to-slate-800";

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {!failed && media.url ? (
        <img
          src={media.url}
          alt={media.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}
      {showAttribution && (
        <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm text-[9px] text-muted-foreground px-1.5 py-0.5 rounded pointer-events-none">
          {media.source} · {media.license}
        </div>
      )}
    </div>
  );
}
