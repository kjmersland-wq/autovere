export type PartnerRecord = {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
  website: string;
  discountPercent: number;
  discountCode: string;
};

const STORAGE_KEY = "autovere_partner";

export function readStoredPartner(): PartnerRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PartnerRecord) : null;
  } catch {
    return null;
  }
}

export function storePartner(partner: PartnerRecord): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(partner));
  } catch {
    /* sessionStorage unavailable — partner context simply won't persist across navigations */
  }
}

export async function fetchPartner(id: string): Promise<PartnerRecord | null> {
  try {
    const response = await fetch(`/api/partners?id=${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    const data = (await response.json()) as { partner?: PartnerRecord };
    return data.partner ?? null;
  } catch {
    return null;
  }
}

export async function fetchActivePartners(): Promise<PartnerRecord[]> {
  try {
    const response = await fetch("/api/partners");
    if (!response.ok) return [];
    const data = (await response.json()) as { partners?: PartnerRecord[] };
    return data.partners ?? [];
  } catch {
    return [];
  }
}
