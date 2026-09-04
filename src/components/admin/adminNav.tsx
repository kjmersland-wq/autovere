import { BarChart3, FileText, Globe2, LayoutGrid, LineChart, Sparkles, Wallet } from "lucide-react";

export type AdminSectionId = "oversikt" | "trafikk" | "markeder" | "abonnement" | "okonomi" | "analyse" | "rapporter";

export const ADMIN_NAV: { id: AdminSectionId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "oversikt", label: "Oversikt", icon: LayoutGrid },
  { id: "trafikk", label: "Trafikk", icon: LineChart },
  { id: "markeder", label: "Markeder", icon: Globe2 },
  { id: "abonnement", label: "Abonnement", icon: BarChart3 },
  { id: "okonomi", label: "Økonomi", icon: Wallet },
  { id: "analyse", label: "Analyse", icon: Sparkles },
  { id: "rapporter", label: "Rapporter", icon: FileText },
];
