import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/i18n/routing";
import { getLegalDoc } from "@/i18n/legal";

export default function Subscriptions() {
  const lang = useLang();
  const d = getLegalDoc(lang, "subscriptions");
  return <LegalPage {...d} />;
}
