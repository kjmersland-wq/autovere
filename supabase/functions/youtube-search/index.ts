import { corsHeaders } from "@supabase/supabase-js/cors";

// Simple in-memory cache (per isolate) to avoid quota burn
const cache = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60 * 6; // 6h

type YTSearchItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
};

type YTVideoItem = {
  id: string;
  contentDetails: { duration: string };
  statistics?: { viewCount?: string };
};

// ISO 8601 -> "12:34"
const formatDuration = (iso: string): string => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const max = Math.min(parseInt(url.searchParams.get("max") ?? "9", 10) || 9, 24);
    const channelId = url.searchParams.get("channelId") ?? undefined;
    const order = url.searchParams.get("order") ?? "relevance"; // relevance | date | viewCount

    if (!q) {
      return new Response(JSON.stringify({ error: "Missing q" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "YOUTUBE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cacheKey = `${q}|${max}|${channelId ?? ""}|${order}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < TTL_MS) {
      return new Response(JSON.stringify({ videos: cached.data, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchParams = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      type: "video",
      maxResults: String(max),
      q,
      order,
      safeSearch: "moderate",
      relevanceLanguage: "en",
      videoEmbeddable: "true",
      videoSyndicated: "true",
    });
    if (channelId) searchParams.set("channelId", channelId);

    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
    if (!searchRes.ok) {
      const text = await searchRes.text();
      return new Response(JSON.stringify({ error: "YouTube search failed", detail: text }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const searchJson = (await searchRes.json()) as { items: YTSearchItem[] };
    const items = searchJson.items ?? [];
    const ids = items.map((i) => i.id.videoId).filter(Boolean);

    let durationMap = new Map<string, string>();
    let viewMap = new Map<string, string>();
    if (ids.length) {
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails,statistics&id=${ids.join(",")}`,
      );
      if (detailsRes.ok) {
        const detailsJson = (await detailsRes.json()) as { items: YTVideoItem[] };
        for (const v of detailsJson.items ?? []) {
          durationMap.set(v.id, formatDuration(v.contentDetails.duration));
          if (v.statistics?.viewCount) viewMap.set(v.id, v.statistics.viewCount);
        }
      }
    }

    const videos = items.map((i) => ({
      id: i.id.videoId,
      title: i.snippet.title,
      description: i.snippet.description,
      channel: i.snippet.channelTitle,
      channelId: i.snippet.channelId,
      publishedAt: i.snippet.publishedAt,
      thumbnail:
        i.snippet.thumbnails.high?.url ??
        i.snippet.thumbnails.medium?.url ??
        i.snippet.thumbnails.default?.url ??
        "",
      duration: durationMap.get(i.id.videoId) ?? "",
      viewCount: viewMap.get(i.id.videoId) ?? "",
    }));

    cache.set(cacheKey, { at: Date.now(), data: videos });

    return new Response(JSON.stringify({ videos, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
