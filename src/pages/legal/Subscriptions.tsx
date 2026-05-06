import { Link } from "react-router-dom";
import { LegalPage } from "@/components/LegalPage";

export default function Subscriptions() {
  return (
    <LegalPage
      eyebrow="Subscription Terms"
      title="How AUTOVERE subscriptions work."
      intro="Predictable billing, easy cancellation, and no surprises. Here's exactly what to expect."
      updated="May 6, 2026"
      seoTitle="Subscription Terms · AUTOVERE"
      seoDescription="Billing cycles, renewals, cancellation and changes for AUTOVERE subscriptions."
      sections={[
        {
          id: "plans",
          title: "Plans and pricing",
          body: (
            <p>
              Current plans, features and prices are listed on the{" "}
              <Link to="/pricing">Pricing page</Link>. Prices are shown inclusive of applicable
              taxes where required.
            </p>
          ),
        },
        {
          id: "billing",
          title: "Billing cycles",
          body: (
            <p>
              Subscriptions are billed in advance on a monthly or yearly cycle, depending on the
              plan you choose. Your billing cycle starts on the day of purchase.
            </p>
          ),
        },
        {
          id: "renewal",
          title: "Automatic renewal",
          body: (
            <p>
              Subscriptions renew automatically at the end of each billing cycle using your
              saved payment method, until cancelled. We will email you a receipt for every
              charge.
            </p>
          ),
        },
        {
          id: "cancel",
          title: "Cancellation",
          body: (
            <p>
              You can cancel at any time from your account settings. Cancellation stops the next
              renewal — you keep access until the end of the current billing period.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Price changes",
          body: (
            <p>
              If we ever change the price of a plan you are on, we will notify you at least 30
              days in advance. You can cancel before the change takes effect if it doesn't suit
              you.
            </p>
          ),
        },
        {
          id: "tax",
          title: "Taxes",
          body: (
            <p>
              Sales tax, VAT and similar taxes are calculated at checkout based on your billing
              location and handled by our payment partner acting as merchant of record.
            </p>
          ),
        },
        {
          id: "refunds",
          title: "Refunds",
          body: (
            <p>
              See our <Link to="/legal/refund">Refund Policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
