import { getPaddleEnvironment } from "@/lib/paddle";

/** Shown only while the preview runs against the test payments environment. */
export function PaymentTestModeBanner() {
  if (getPaddleEnvironment() !== "sandbox") return null;

  return (
    <div className="w-full border-b border-orange-300 bg-orange-100 px-4 py-2 text-center text-sm text-orange-800">
      All payments made in the preview are in test mode.
    </div>
  );
}
