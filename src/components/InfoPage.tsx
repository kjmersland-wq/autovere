import { SiteHeader } from "@/components/SiteHeader";
import { localizeEuroText, useCurrency } from "@/lib/currency";

export type InfoSection = {
  heading: string;
  body?: string;
  items?: string[];
  links?: { label: string; url: string }[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  note?: string | undefined;
};

export function InfoPage({ eyebrow, title, intro, sections, note }: InfoPageProps) {
  const { currency } = useCurrency();
  const cur = (text: string) => localizeEuroText(text, currency);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{cur(intro)}</p>

        <div className="mt-12 space-y-6">
          {sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-foreground">{cur(section.heading)}</h2>
              {section.body ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cur(section.body)}</p>
              ) : null}
              {section.items ? (
                <ul className="mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/80" />
                      <span>{cur(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.links ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-300/20"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {note ? (
          <p className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-muted-foreground">
            {cur(note)}
          </p>
        ) : null}
      </div>
    </main>
  );
}
