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
                <strong>Billing data</strong> — handled by our payment processor; we receive only
                limited transaction metadata, never full card details.
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
            <p>
              Carefully selected processors that help us run AUTOVERE — hosting, analytics,
              email delivery, payments and AI inference. Each is bound by data-processing
              agreements and may only use your data on our instructions.
            </p>
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
