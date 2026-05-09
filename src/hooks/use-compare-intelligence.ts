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
  enabled = true,
) => {
  const [data, setData] = useState<CompareInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !aSlug || !bSlug) return;
    let active = true;
    setLoading(true);
    setErrorCode(null);

    (async () => {
      const { data: res, error } = await supabase.functions.invoke("compare-intelligence", {
        body: {
          a: aSlug,
          b: bSlug,
          aName,
          bName,
        },
      });

      if (!active) return;

      if (error) {
        setData(null);
        const payload = (error as { context?: { json?: () => Promise<unknown> } })?.context;
        if (payload?.json) {
          try {
            const json = (await payload.json()) as { error?: { code?: string } };
            setErrorCode(json?.error?.code ?? "unknown");
          } catch {
            setErrorCode("unknown");
          }
        } else {
          setErrorCode("unknown");
        }
      } else {
        setData((res as { insight?: CompareInsight })?.insight ?? null);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [enabled, aSlug, bSlug, aName, bName]);

  return { data, loading, errorCode };
};
