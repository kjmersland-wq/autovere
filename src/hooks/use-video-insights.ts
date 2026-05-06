import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LiveVideo } from "@/hooks/use-youtube-search";

export type VideoInsights = {
  strengths: string[];
  criticisms: string[];
  feel: string;
  headline: string;
};

export function useVideoInsights(
  carName: string | undefined,
  videos: LiveVideo[],
  carSlug?: string,
) {
  const [insights, setInsights] = useState<VideoInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carName || videos.length === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke("video-insights", {
        body: {
          carName,
          carSlug,
          videos: videos.slice(0, 10).map((v) => ({
            title: v.title,
            channel: v.channel,
            description: v.description,
          })),
        },
      })
      .then(({ data, error: invErr }) => {
        if (cancelled) return;
        if (invErr) {
          setError(invErr.message);
          setInsights(null);
        } else {
          setInsights(data as VideoInsights);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [carName, carSlug, videos.length, videos[0]?.id]);

  return { insights, loading, error };
}
