import { useTranslation } from "react-i18next";
import { getStripeEnvironment } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  const { t } = useTranslation();
  if (getStripeEnvironment() !== "test") return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      {t("banner.test_mode")}{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        {t("banner.read_more")}
      </a>
    </div>
  );
}
