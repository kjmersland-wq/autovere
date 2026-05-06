import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveVideo = {
  id: string;
  title: string;
  description: string;
  channel: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
};

type Options = { max?: number; channelId?: string; order?: "relevance" | "date" | "viewCount"; enabled?: boolean };

export function useYouTubeSearch(query: string | null | undefined, opts: Options = {}) {
  const { max = 9, channelId, order = "relevance", enabled = true } = opts;
  const [videos, setVideos] = useState<LiveVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ q: query, max: String(max), order });
    if (channelId) params.set("channelId", channelId);

    supabase.functions
      .invoke(`youtube-search?${params.toString()}`, { method: "GET" })
      .then(({ data, error: invokeError }) => {
        if (cancelled) return;
        if (invokeError) {
          setError(invokeError.message);
          setVideos([]);
        } else {
          setVideos((data as { videos: LiveVideo[] })?.videos ?? []);
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
  }, [query, max, channelId, order, enabled]);

  return { videos, loading, error };
}
