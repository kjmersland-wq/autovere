import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SafetyDimension = {
  label: string;
  rating: "Excellent" | "Strong" | "Good" | "Mixed";
  note: string;
};

export type SafetyIntelligence = {
  safetyHeadline: string;
  safetySummary: string;
  safetyDimensions: SafetyDimension[];
  ownersLove: string[];
  ownersMention: string[];
  bestSuitedFor: string[];
  lessIdealFor: string[];
  worthKnowing: string[];
  winterNotes: string;
  longTermOutlook: string;
  sources: string[];
};

export function useSafetyIntelligence(carName: string | undefined, carType?: string, context?: string) {
  const [data, setData] = useState<SafetyIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carName) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke("safety-intelligence", { body: { carName, carType, context } })
      .then(({ data: res, error: invErr }) => {
        if (cancelled) return;
        if (invErr) {
          setError(invErr.message);
          setData(null);
        } else {
          setData(res as SafetyIntelligence);
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [carName, carType, context]);

  return { data, loading, error };
}
