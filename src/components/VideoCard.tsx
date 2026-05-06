import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import type { Video } from "@/data/media";

export const VideoCard = ({
  video,
  size = "md",
}: {
  video: Video;
  size?: "sm" | "md" | "lg";
}) => {
  const [open, setOpen] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group relative block w-full text-left overflow-hidden rounded-2xl border border-border/40 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow ${
          size === "lg" ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <img
          src={thumb}
          alt={video.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2200ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-[11px] font-medium">
            {video.duration}
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full glass uppercase tracking-wider">
          <span className="w-1 h-1 rounded-full bg-accent animate-glow-pulse" />
          {video.reviewer.trust}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-muted-foreground mb-1">{video.reviewer.channel} · {video.category}</div>
          <div className={`font-semibold tracking-tight leading-snug ${size === "lg" ? "text-2xl md:text-3xl" : "text-base"}`}>
            {video.title}
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-secondary/60 transition-colors"
          >
            Close
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute bottom-6 right-6 glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-secondary/60 transition-colors"
          >
            Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </>
  );
};
