import { Link } from "react-router-dom";
import { LegalPage } from "@/components/LegalPage";

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title="The agreement between you and AUTOVERE."
      intro="These terms describe how AUTOVERE works, what you can expect from us, and what we expect from you. Written in plain language — because trust starts with clarity."
      updated="May 6, 2026"
      seoTitle="Terms of Service · AUTOVERE"
      seoDescription="The terms that govern your use of AUTOVERE — a calmer, intelligent way to discover your next car."
      sections={[
        {
          id: "seller",
          title: "Who you are contracting with",
          body: (
            <p>
              AUTOVERE is operated by <strong>Boutique24Shop v/ K.Mersland</strong> ("we", "us",
              "AUTOVERE"), based in Norway. By using AUTOVERE you enter into a binding agreement
              with Boutique24Shop v/ K.Mersland.
            </p>
          ),
        },
        {
          id: "acceptance",
          title: "Acceptance of terms",
          body: (
            <p>
              By using AUTOVERE you agree to these terms. If you do not agree, please do not
              use the service. We may update these terms from time to time; we will note the
              date at the top whenever we do.
            </p>
          ),
        },
        {
          id: "service",
          title: "What AUTOVERE is",
          body: (
            <>
              <p>
                AUTOVERE is an intelligent automotive discovery platform. We help people explore,
                compare and understand vehicles using curated content, public data, official
                manufacturer resources and AI-assisted insights.
              </p>
              <p>
                AUTOVERE is <strong>not</strong> a dealership or marketplace. We do not sell vehicles
                and we are not party to any purchase you make from a third party.
              </p>
            </>
          ),
        },
        {
          id: "accounts",
          title: "Accounts and eligibility",
          body: (
            <p>
              You must be at least 16 years old to use AUTOVERE. You are responsible for keeping
              your account credentials safe and for activity that takes place under your account.
            </p>
          ),
        },
        {
          id: "subscriptions",
          title: "Subscriptions and billing",
          body: (
            <>
              <p>
                Some AUTOVERE features are available through a paid subscription. Pricing,
                billing cycles and renewal terms are presented on the{" "}
                <Link to="/pricing">Pricing page</Link> and at checkout.
              </p>
              <p>
                Subscriptions renew automatically until cancelled. You can cancel at any time —
                see the <Link to="/legal/subscriptions">Subscription Terms</Link> for details.
              </p>
              <p>
                Our order process is conducted by our online reseller <strong>Paddle.com</strong>.
                Paddle.com is the Merchant of Record for all our orders. Paddle provides all
                customer service inquiries and handles returns.
              </p>
            </>
          ),
        },
        {
          id: "ai",
          title: "AI-assisted recommendations",
          body: (
            <>
              <p>
                AUTOVERE uses AI to help you compare and understand vehicles. Recommendations are
                generated from public sources, manufacturer information, reviewer consensus and
                model analysis.
              </p>
              <p>
                AI insights are intended as guidance, not professional advice. Vehicle data,
                specifications and availability vary by region. Always verify final details
                directly with the manufacturer or seller before purchase.
              </p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          body: (
            <p>
              Don't use AUTOVERE to break the law, infringe others' rights, scrape or resell our
              content at scale, attempt to disrupt the service, or misuse our AI features. We may
              suspend access if these terms are violated.
            </p>
          ),
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: (
            <p>
              AUTOVERE, the AutoVere advisor, our editorial content and design are protected by
              intellectual property laws. Vehicle names, marks and imagery belong to their
              respective manufacturers and are used for editorial purposes.
            </p>
          ),
        },
        {
          id: "warranty",
          title: "Disclaimers and liability",
          body: (
            <p>
              AUTOVERE is provided "as is". To the maximum extent permitted by law, we exclude
              implied warranties and limit our liability to the amount you paid us in the 12
              months before the event giving rise to the claim.
            </p>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: (
            <p>
              These terms are governed by the laws of Norway. Disputes that cannot be resolved
              informally fall under the jurisdiction of the Norwegian courts.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these terms? <Link to="/contact">Get in touch</Link> with our team.
            </p>
          ),
        },
      ]}
    />
  );
}
