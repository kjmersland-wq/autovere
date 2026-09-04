import { BarChart3, FileText, Globe2, LayoutGrid, LineChart, Wallet } from "lucide-react";

export type AdminSectionId = "oversikt" | "trafikk" | "markeder" | "abonnement" | "okonomi" | "rapporter";

export const ADMIN_NAV: { id: AdminSectionId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "oversikt", label: "Oversikt", icon: LayoutGrid },
  { id: "trafikk", label: "Trafikk", icon: LineChart },
  { id: "markeder", label: "Markeder", icon: Globe2 },
  { id: "abonnement", label: "Abonnement", icon: BarChart3 },
  { id: "okonomi", label: "Økonomi", icon: Wallet },
  { id: "rapporter", label: "Rapporter", icon: FileText },
];
