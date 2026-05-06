import { Link } from "react-router-dom";
import { LegalPage } from "@/components/LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Your data, treated with care."
      intro="We collect only what's necessary to make AUTOVERE work beautifully — and we tell you exactly what that is."
      updated="May 6, 2026"
      seoTitle="Privacy Policy · AUTOVERE"
      seoDescription="How AUTOVERE collects, uses and protects your personal data. Privacy by design, in plain language."
      sections={[
        {
          id: "who",
          title: "Who we are",
          body: (
            <p>
              AUTOVERE is operated by <strong>Boutique24Shop v/ K.Mersland</strong>,
              based in Norway. We are the data controller for
              the personal data described below.
            </p>
          ),
        },
        {
          id: "what",
          title: "What we collect",
          body: (
            <>
              <p>
                <strong>Account data</strong> — name, email and authentication identifiers when
                you create an account.
              </p>
              <p>
                <strong>Usage data</strong> — pages viewed, searches, comparisons and advisor
                conversations, used to improve the product.
              </p>
              <p>
                <strong>Billing data</strong> — when you subscribe, our payment provider{" "}
                <strong>Paddle.com Market Limited</strong> ("Paddle") acts as Merchant of
                Record. Paddle hosts the checkout, processes your payment, calculates and
                remits sales tax/VAT, prevents fraud, and issues invoices. We never see or
                store your full card details.
              </p>
              <p className="!mb-2">
                <strong>Data collected and processed by Paddle (not by us):</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Full name and email address</li>
                <li>Billing address (street, city, postal code, state/region, country)</li>
                <li>Payment method details (full card number, expiry, CVC, or PayPal/Apple Pay/Google Pay token)</li>
                <li>Bank or card-issuer information used for authorisation and 3-D Secure</li>
                <li>IP address and approximate geolocation (used for fraud scoring and tax determination)</li>
                <li>Device and browser fingerprint (user-agent, language, timezone)</li>
                <li>Tax/VAT identification number (for business customers, where provided)</li>
                <li>Business name and tax country (for B2B invoicing)</li>
                <li>Currency and converted amount</li>
                <li>Transaction history, refunds, chargebacks and dispute records</li>
                <li>Communications with Paddle's customer support</li>
              </ul>
              <p className="!mb-2">
                <strong>Data we receive back from Paddle and store on your account:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Paddle customer ID and Paddle subscription ID (internal identifiers)</li>
                <li>Product ID and price ID of the plan you purchased (e.g. <code>premium_monthly</code>)</li>
                <li>Subscription status (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
                <li>Current billing period start and end dates</li>
                <li>Whether the subscription is scheduled to cancel at period end</li>
                <li>Environment flag (<code>sandbox</code> or <code>live</code>)</li>
                <li>Country code of the billing address (for tax compliance and localised pricing)</li>
                <li>Currency and amount of each transaction</li>
                <li>Last four digits and brand of the card used (e.g. "Visa •••• 4242")</li>
                <li>Transaction timestamps (created, paid, refunded)</li>
                <li>Invoice and receipt URLs hosted by Paddle</li>
              </ul>
              <p>
                We use this data to provision your subscription, gate Premium features, send
                renewal and receipt notifications, handle support requests, and meet our
                accounting and tax obligations. See{" "}
                <a
                  href="https://www.paddle.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Paddle's Privacy Policy
                </a>{" "}
                for how Paddle handles the data it collects.
              </p>
              <p>
                <strong>Messages you send us</strong> — anything you write in the contact form.
              </p>
            </>
          ),
        },
        {
          id: "why",
          title: "Why we use it",
          body: (
            <p>
              To provide the service, personalise recommendations, prevent abuse, comply with
              legal obligations, and respond to you when you reach out. We do not sell personal
              data, ever.
            </p>
          ),
        },
        {
          id: "ai",
          title: "AI and your data",
          body: (
            <p>
              Conversations with our AI advisor are processed through trusted AI providers to
              generate responses. We do not use your private conversations to train external
              models. Anonymised, aggregated patterns may be used to improve our own product.
            </p>
          ),
        },
        {
          id: "sharing",
          title: "Who we share with",
          body: (
            <>
              <p>
                Carefully selected processors that help us run AUTOVERE — hosting, analytics,
                email delivery and AI inference. Each is bound by data-processing agreements
                and may only use your data on our instructions.
              </p>
              <p>
                <strong>Paddle.com Market Limited</strong> — our Merchant of Record for all
                paid subscriptions. Paddle receives data necessary to process your payment,
                manage your subscription, calculate and remit sales tax/VAT, prevent fraud,
                and issue invoices. Paddle acts as an independent data controller for this
                processing. See{" "}
                <a
                  href="https://www.paddle.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Paddle's Privacy Policy
                </a>.
              </p>
              <p>
                <strong>Authorities and professional advisers</strong> — where required by law
                or to protect our legal rights.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: (
            <p>
              We keep personal data only as long as needed for the purposes above, or as
              required by law. Contact-form messages are retained for up to 24 months.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <p>
              Under GDPR you can request access, correction, deletion, portability or
              restriction of your data, and object to certain processing. To exercise any of
              these rights, <Link to="/contact">contact us</Link>. You also have the right to
              lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet).
            </p>
          ),
        },
        {
          id: "security",
          title: "Security",
          body: (
            <p>
              Data is encrypted in transit and at rest. Access to production systems is
              restricted, logged and reviewed. No system is perfectly secure — we work
              continuously to keep yours protected.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          body: (
            <p>
              We will update this policy as the product evolves. Material changes will be
              communicated in-app or by email.
            </p>
          ),
        },
      ]}
    />
  );
}
