export function PaymentTestModeBanner() {
  const token = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];
  if (token?.startsWith("live_")) return null;

  return (
    <div className="w-full border-b border-border bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
      {token?.startsWith("test_") ? "All payments made in the preview are in test mode." : "Production checkout is not configured. Complete go-live in the Payments tab to accept real payments."}
    </div>
  );
}
