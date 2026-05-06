import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/i18n/routing";
import { getLegalDoc } from "@/i18n/legal";

export default function Cookies() {
  const lang = useLang();
  const d = getLegalDoc(lang, "cookies");
  return <LegalPage {...d} />;
}
