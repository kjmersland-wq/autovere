import { useState } from "react";
import type { MediaAttribution } from "@/data/articles";

interface MediaImageProps {
  media: MediaAttribution;
  className?: string;
  aspectClass?: string;
  showAttribution?: boolean;
  overlayGradient?: boolean;
}

export function MediaImage({
  media,
  className = "",
  aspectClass = "aspect-[16/9]",
  showAttribution = false,
  overlayGradient = false,
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
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform [transition-duration:700ms] group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />
      )}
      {showAttribution && media.source && (
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[9px] text-white/60 px-1.5 py-0.5 rounded pointer-events-none">
          {media.source}
        </div>
      )}
    </div>
  );
}
