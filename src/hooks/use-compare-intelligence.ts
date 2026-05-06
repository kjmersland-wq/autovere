import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CompareVideo = {
  id: string;
  title: string;
  description: string;
  channel: string;
  publishedAt: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  trust?: number;
};

export type CompareInsight = {
  summary: string;
  contrasts: Array<{ dimension: string; a: string; b: string }>;
  videos: CompareVideo[];
  source_count: number;
  car_a_name: string;
  car_b_name: string;
};

export const useCompareIntelligence = (
  aSlug: string,
  bSlug: string,
  aName: string,
  bName: string,
) => {
  const [data, setData] = useState<CompareInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!aSlug || !bSlug) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke(
          "compare-intelligence",
          {
            body: null,
            // pass via query string — supabase-js .invoke supports it via headers? no — use fetch fallback
          },
        );
        // supabase.functions.invoke does not pass query params; use raw fetch instead
        if (!res || error) throw new Error("invoke failed");
      } catch {
        // fallback raw fetch
      }
      try {
        const params = new URLSearchParams({ a: aSlug, b: bSlug, aName, bName });
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/compare-intelligence?${params}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          },
        );
        const json = await res.json();
        if (active && json?.insight) setData(json.insight);
      } catch {
        /* swallow */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [aSlug, bSlug, aName, bName]);

  return { data, loading };
};
