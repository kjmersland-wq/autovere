import { useEffect, useState, useCallback } from "react";
import { detectRegion, setRegion as persistRegion, type Region, type RegionCode } from "@/lib/region";

export function useRegion() {
  const [region, setRegionState] = useState<Region>(() => detectRegion());

  useEffect(() => {
    // re-detect on mount in case localStorage changed in another tab
    setRegionState(detectRegion());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "autovere.region") setRegionState(detectRegion());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setRegion = useCallback((code: RegionCode) => {
    persistRegion(code);
    setRegionState(detectRegion());
  }, []);

  return { region, setRegion };
}
