import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchPartner, readStoredPartner, storePartner, type PartnerRecord } from "./partners";

const Context = createContext<{ partner: PartnerRecord | null }>({ partner: null });

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<PartnerRecord | null>(() => readStoredPartner());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("partner");
    if (!id) return;
    let cancelled = false;
    void fetchPartner(id).then((record) => {
      if (cancelled || !record) return;
      storePartner(record);
      setPartner(record);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <Context.Provider value={{ partner }}>{children}</Context.Provider>;
}

export function usePartner(): PartnerRecord | null {
  return useContext(Context).partner;
}
