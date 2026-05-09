import { useTranslation } from "react-i18next";

export function PaymentTestModeBanner() {
  const { t } = useTranslation();
  const isTestMode = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_");
  if (!isTestMode) return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      {t("banner.test_mode")}{" "}
      <a
        href="https://stripe.com/docs/testing"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        {t("banner.read_more")}
      </a>
    </div>
  );
}
