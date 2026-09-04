import { useEffect, useState } from "react";

import type { AdminDataResult } from "@/lib/admin-data.functions";

/** Fetches one isolated Admin data operation on mount and exposes its
 * loading/result state. Each panel calls this with its own server function
 * so a failure in one section never affects another. */
export function useAdminQuery<T>(call: () => Promise<AdminDataResult<T>>) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AdminDataResult<T> | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setResult(null);
    void call()
      .then((r) => {
        if (alive) setResult(r);
      })
      .catch(() => {
        if (alive) setResult({ status: "error", message: "Uventet feil ved henting av data." });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, result };
}

export function statusMessage(status: "unauthenticated" | "unauthorized" | "error", message?: string): string {
  if (status === "unauthenticated") return "Økten er utløpt. Logg inn på nytt.";
  if (status === "unauthorized") return "Denne kontoen har ikke admin-tilgang.";
  return message ?? "Uventet feil.";
}
