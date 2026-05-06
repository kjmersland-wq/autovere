import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EditorialPulse = {
  id: string;
  title: string;
  dek: string;
  body: string;
  theme: string;
  featured_slugs: string[];
  refreshed_at: string;
};

export const useLatestPulse = () => {
  const [pulse, setPulse] = useState<EditorialPulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("editorial_pulse")
        .select("id, title, dek, body, theme, featured_slugs, refreshed_at")
        .eq("status", "published")
        .order("refreshed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (data) {
        setPulse({
          ...data,
          featured_slugs: Array.isArray(data.featured_slugs)
            ? (data.featured_slugs as string[])
            : [],
        });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { pulse, loading };
};
