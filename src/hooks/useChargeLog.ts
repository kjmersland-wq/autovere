import { useState, useCallback, useEffect } from "react";
import type { ChargeSession, ServiceEntry } from "@/data/ownership-tracking";

const CHARGE_KEY = "autovere_charge_sessions_v1";
const SERVICE_KEY = "autovere_service_log_v1";

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* degrade silently */ }
}

let sessionCounter = Date.now();

export function useChargeLog() {
  const [sessions, setSessions] = useState<ChargeSession[]>(() => load(CHARGE_KEY));
  const [serviceLog, setServiceLog] = useState<ServiceEntry[]>(() => load(SERVICE_KEY));

  useEffect(() => persist(CHARGE_KEY, sessions), [sessions]);
  useEffect(() => persist(SERVICE_KEY, serviceLog), [serviceLog]);

  const addChargeSession = useCallback((session: Omit<ChargeSession, "id">) => {
    const full: ChargeSession = { ...session, id: String(++sessionCounter) };
    setSessions((prev) => [full, ...prev]);
    return full;
  }, []);

  const removeChargeSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addServiceEntry = useCallback((entry: Omit<ServiceEntry, "id">) => {
    const full: ServiceEntry = { ...entry, id: String(++sessionCounter) };
    setServiceLog((prev) => [full, ...prev]);
    return full;
  }, []);

  const removeServiceEntry = useCallback((id: string) => {
    setServiceLog((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSessionsForVehicle = useCallback(
    (slug: string) => sessions.filter((s) => s.vehicleSlug === slug),
    [sessions]
  );

  const getServiceForVehicle = useCallback(
    (slug: string) => serviceLog.filter((s) => s.vehicleSlug === slug),
    [serviceLog]
  );

  return {
    sessions,
    serviceLog,
    addChargeSession,
    removeChargeSession,
    addServiceEntry,
    removeServiceEntry,
    getSessionsForVehicle,
    getServiceForVehicle,
  };
}
