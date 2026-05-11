import { useState, useCallback, useEffect } from "react";

export type SavedContentType = "vehicle" | "article" | "network" | "comparison";

interface SavedState {
  vehicle: string[];
  article: string[];
  network: string[];
  comparison: string[];
}

const STORAGE_KEY = "autovere_saved_content_v1";

function load(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { vehicle: [], article: [], network: [], comparison: [] };
    return { vehicle: [], article: [], network: [], comparison: [], ...JSON.parse(raw) };
  } catch {
    return { vehicle: [], article: [], network: [], comparison: [] };
  }
}

function persist(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // degrade silently
  }
}

export function useSavedContent() {
  const [saved, setSaved] = useState<SavedState>(load);

  useEffect(() => {
    persist(saved);
  }, [saved]);

  const isSaved = useCallback(
    (type: SavedContentType, slug: string) => saved[type].includes(slug),
    [saved]
  );

  const toggleSave = useCallback((type: SavedContentType, slug: string) => {
    setSaved((prev) => {
      const list = prev[type];
      const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      return { ...prev, [type]: next };
    });
  }, []);

  const getSaved = useCallback(
    (type: SavedContentType): string[] => saved[type],
    [saved]
  );

  const clearAll = useCallback(() => {
    setSaved({ vehicle: [], article: [], network: [], comparison: [] });
  }, []);

  const totalSaved = saved.vehicle.length + saved.article.length + saved.network.length + saved.comparison.length;

  return { isSaved, toggleSave, getSaved, clearAll, totalSaved, saved };
}
