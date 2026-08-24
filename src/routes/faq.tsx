import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ContactModal } from "@/components/ContactModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqCopy, useLocale } from "@/lib/i18n";
import { marketingCopy } from "@/lib/marketing-i18n";
import { faqSchema } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(marketingCopy.en.categories)) }],
  }),
  component: FaqPage,
});
function FaqPage() {
  const { locale } = useLocale();
  const copy = faqCopy[locale];
  const marketing = marketingCopy[locale];
  const [query, setQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const filteredCategories = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return copy.categories;
    return copy.categories.map((category) => ({
      ...category,
      questions: category.questions.filter((item) => `${item.question} ${item.answer}`.toLocaleLowerCase().includes(search)),
    })).filter((category) => category.questions.length > 0);
  }, [copy.categories, query]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> {copy.back}</Link>
        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.subtitle}</p>
        </header>
        <label className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 focus-within:border-primary/60">
          <Search className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="sr-only">{copy.search}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </label>

        <div className="mt-8 space-y-4">
          {filteredCategories.map((category, categoryIndex) => (
            <section key={category.title} className="panel px-5 sm:px-7">
              <h2 className="pt-5 text-lg font-bold">{category.title}</h2>
              <Accordion type="single" collapsible className="mt-2">
                {category.questions.map((item, questionIndex) => <AccordionItem key={item.question} value={`${categoryIndex}-${questionIndex}`}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{item.answer}</AccordionContent></AccordionItem>)}
              </Accordion>
            </section>
          ))}
          {filteredCategories.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{copy.empty}</p>}
        </div>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-xl font-bold">{marketing.contactTitle}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{marketing.contactText}</p>
          <Button className="mt-5" onClick={() => setContactOpen(true)}>{marketing.contactAction}</Button>
        </section>
      </div>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </main>
  );
}

