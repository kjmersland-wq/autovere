import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ocmToStation, type OcmLiveStation } from "@/lib/ocm";
import { EV_CHARGING_DEMO_STATIONS, type ChargingStation } from "@/data/ev-charging";

interface UseOCMChargingOptions {
  countryCode: string;    // ISO 3166-1 alpha-2
  lat?: number;           // optional centre point override
  lng?: number;
  distance?: number;      // km radius (default 80)
  maxResults?: number;    // 1-100 (default 50)
  page?: number;
}

export interface UseOCMChargingResult {
  stations: ChargingStation[];
  isLoading: boolean;
  isError: boolean;
  isFallback: boolean;    // true when showing demo data after a live error
  total: number;
  cached: boolean;
  refetch: () => void;
}

const DEBOUNCE_MS = 400;

export function useOCMCharging(options: UseOCMChargingOptions): UseOCMChargingResult {
  const { countryCode, lat, lng, distance = 80, maxResults = 50, page = 0 } = options;

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [total, setTotal] = useState(0);
  const [cached, setCached] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setIsError(false);
      setIsFallback(false);

      // Cancel any in-flight previous request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const params: Record<string, string> = {
          countrycode: countryCode,
          maxresults: String(maxResults),
          pageindex: String(page),
        };
        if (lat !== undefined && lng !== undefined) {
          params.lat = String(lat);
          params.lng = String(lng);
          params.distance = String(distance);
        }

        const { data, error } = await supabase.functions.invoke("ev-charging-data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: null,
          // Supabase JS passes query params via the function URL when using GET
        } as Parameters<typeof supabase.functions.invoke>[1]);

        // The Supabase JS SDK doesn't natively forward GET query params via
        // functions.invoke; we call the function URL directly instead.
        throw { _useDirectFetch: true, params };
      } catch (err: unknown) {
        const sentinel = err as { _useDirectFetch?: boolean; params?: Record<string, string> };
        if (sentinel?._useDirectFetch && sentinel.params) {
          // Direct fetch via Supabase project URL
          try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
            const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
            const qs = new URLSearchParams(sentinel.params).toString();
            const res = await globalThis.fetch(
              `${supabaseUrl}/functions/v1/ev-charging-data?${qs}`,
              {
                headers: {
                  apikey: anonKey,
                  Authorization: `Bearer ${anonKey}`,
                },
                signal: abortRef.current?.signal,
              },
            );

            if (!res.ok) throw new Error(`OCM proxy error: ${res.status}`);
            const json = await res.json() as {
              stations: OcmLiveStation[];
              total: number;
              cached: boolean;
            };

            const mapped = json.stations.map(ocmToStation);
            setStations(mapped);
            setTotal(json.total ?? mapped.length);
            setCached(json.cached ?? false);
            setIsError(false);
            setIsFallback(false);
          } catch (fetchErr) {
            if ((fetchErr as Error).name === "AbortError") return;
            // Fall back gracefully to demo data
            const fallback = EV_CHARGING_DEMO_STATIONS.filter(
              (s) => s.country === "Norway" || countryCode === "NO",
            );
            setStations(countryCode === "NO" ? fallback : []);
            setTotal(countryCode === "NO" ? fallback.length : 0);
            setIsError(true);
            setIsFallback(countryCode === "NO");
          }
        } else {
          setIsError(true);
          setIsFallback(false);
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [countryCode, distance, lat, lng, maxResults, page]);

  useEffect(() => {
    fetch();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetch]);

  return { stations, isLoading, isError, isFallback, total, cached, refetch: fetch };
}
