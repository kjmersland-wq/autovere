import { useState, useCallback, useEffect } from "react";
import type { WatchlistEntry, WatchlistAlertType } from "@/data/ownership-tracking";

const WATCHLIST_KEY = "autovere_watchlist_v1";

function load(): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(entries: WatchlistEntry[]): void {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(entries));
  } catch { /* degrade silently */ }
}

const DEFAULT_ALERTS: WatchlistAlertType[] = ["price-change", "software-update", "network-expansion"];

export function useWatchlist() {
  const [entries, setEntries] = useState<WatchlistEntry[]>(load);

  useEffect(() => persist(entries), [entries]);

  const addToWatchlist = useCallback(
    (type: WatchlistEntry["type"], slug: string, alerts: WatchlistAlertType[] = DEFAULT_ALERTS) => {
      setEntries((prev) => {
        if (prev.some((e) => e.slug === slug && e.type === type)) return prev;
        return [...prev, { type, slug, enabledAlerts: alerts, addedAt: new Date().toISOString(), notificationCount: 0 }];
      });
    },
    []
  );

  const removeFromWatchlist = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const toggleAlert = useCallback((slug: string, alertType: WatchlistAlertType) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.slug !== slug) return e;
        const has = e.enabledAlerts.includes(alertType);
        return {
          ...e,
          enabledAlerts: has
            ? e.enabledAlerts.filter((a) => a !== alertType)
            : [...e.enabledAlerts, alertType],
        };
      })
    );
  }, []);

  const isWatching = useCallback((slug: string) => entries.some((e) => e.slug === slug), [entries]);

  return { entries, addToWatchlist, removeFromWatchlist, toggleAlert, isWatching, count: entries.length };
}
