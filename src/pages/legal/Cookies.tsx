import { Link } from "react-router-dom";
import { LegalPage } from "@/components/LegalPage";

export default function Cookies() {
  return (
    <LegalPage
      eyebrow="Cookie Policy"
      title="A short, honest note about cookies."
      intro="We use a small number of cookies to keep AUTOVERE running smoothly and to learn what's working. No tracking pixels, no surveillance."
      updated="May 6, 2026"
      seoTitle="Cookie Policy · AUTOVERE"
      seoDescription="The cookies AUTOVERE uses, why we use them, and how you can control them."
      sections={[
        {
          id: "what",
          title: "What cookies are",
          body: (
            <p>
              Cookies are small text files stored on your device. We use them — and similar
              technologies like local storage — to make AUTOVERE work and to understand how it's
              used.
            </p>
          ),
        },
        {
          id: "essential",
          title: "Essential cookies",
          body: (
            <p>
              Required for the platform to function: keeping you signed in, remembering your
              preferences, securing payments and preventing abuse. These cannot be turned off.
            </p>
          ),
        },
        {
          id: "analytics",
          title: "Analytics",
          body: (
            <p>
              Privacy-respecting analytics help us understand which features people use, so we
              can make AUTOVERE better. We do not build advertising profiles.
            </p>
          ),
        },
        {
          id: "third",
          title: "Third parties",
          body: (
            <p>
              Our payment partner sets cookies during checkout so that transactions are secure.
              Embedded video players (e.g. YouTube) may set their own cookies when you press play.
            </p>
          ),
        },
        {
          id: "control",
          title: "Your control",
          body: (
            <p>
              You can clear or block cookies in your browser settings. Some essential cookies
              are required for AUTOVERE to function correctly. Questions?{" "}
              <Link to="/contact">Reach out</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
