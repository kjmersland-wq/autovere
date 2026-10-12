/** Shown only while the preview runs against the Creem test environment. */
export function PaymentTestModeBanner() {
  const testMode = (import.meta.env["VITE_CREEM_TEST_MODE"] as string | undefined) === "true";
  if (!testMode) return null;

  return (
    <div className="w-full border-b border-orange-300 bg-orange-100 px-4 py-2 text-center text-sm text-orange-800">
      All payments made in the preview are in test mode.
    </div>
  );
}
