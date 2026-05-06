import { Link } from "react-router-dom";
import { LegalPage } from "@/components/LegalPage";

export default function Refund() {
  return (
    <LegalPage
      eyebrow="Refund Policy"
      title="Fair, transparent refunds."
      intro="If AUTOVERE isn't right for you, we want the exit to feel as calm as the entry."
      updated="May 6, 2026"
      seoTitle="Refund Policy · AUTOVERE"
      seoDescription="How refunds work for AUTOVERE subscriptions and one-time purchases."
      sections={[
        {
          id: "subs",
          title: "Subscription refunds",
          body: (
            <p>
              You may request a full refund of your most recent subscription charge within{" "}
              <strong>14 days</strong> of payment, provided the service hasn't been used
              substantially during that period. Renewals can be cancelled at any time and will
              not be charged again.
            </p>
          ),
        },
        {
          id: "eu",
          title: "EU & EEA right of withdrawal",
          body: (
            <p>
              Customers in the EU and EEA have a statutory 14-day withdrawal right for digital
              services. By starting to use a paid feature you consent to the service beginning
              immediately and acknowledge that this right may be limited once the service has
              been performed.
            </p>
          ),
        },
        {
          id: "one-time",
          title: "One-time purchases",
          body: (
            <p>
              One-time purchases of digital content are refundable within 14 days of purchase if
              the content has not been substantially accessed.
            </p>
          ),
        },
        {
          id: "exceptions",
          title: "Exceptions",
          body: (
            <p>
              Refunds may be declined for accounts found to be in breach of our Terms of
              Service, or where evidence of abuse exists.
            </p>
          ),
        },
        {
          id: "how",
          title: "How to request a refund",
          body: (
            <p>
              Send us a refund request via the <Link to="/contact">contact form</Link> with the
              email address used to purchase. We aim to respond within one business day. Refunds
              are returned to the original payment method.
            </p>
          ),
        },
      ]}
    />
  );
}
