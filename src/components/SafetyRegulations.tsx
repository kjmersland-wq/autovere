import { useState } from "react";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COUNTRY_NAMES, FLAGS } from "@/lib/countries";
import { useLocale } from "@/lib/i18n";
import { getCountryRule, type CountryRule } from "@/data/countryRules";

const copy = {
  en: { title: "Driving rules and requirements for your route", subtitle: "A quick country-by-country reminder. Rules can change, so check local signs and official guidance before you leave.", speed: "Speed limits", motorway: "Motorway", rural: "Rural roads", urban: "Built-up areas", equipment: "Required equipment", vest: "Reflective vest for each person", triangle: "Warning triangle", firstAid: "First-aid kit", alcohol: "Drink-drive limit", environmental: "Environmental sticker", lights: "Daytime lights recommended or required", packing: "Car packing checklist", packed: "packed", empty: "No countries were detected on this route." },
  de: { title: "Verkehrsregeln und Pflichten für deine Route", subtitle: "Ein schneller Überblick je Land. Prüfe vor der Abfahrt immer Schilder und offizielle Hinweise.", speed: "Tempolimits", motorway: "Autobahn", rural: "Landstraße", urban: "Ortschaft", equipment: "Pflichtausrüstung", vest: "Warnweste für jede Person", triangle: "Warndreieck", firstAid: "Erste-Hilfe-Set", alcohol: "Promillegrenze", environmental: "Umweltplakette", lights: "Tagfahrlicht empfohlen oder vorgeschrieben", packing: "Packliste fürs Auto", packed: "eingepackt", empty: "Für diese Route wurden keine Länder erkannt." },
  nl: { title: "Verkeersregels en verplichtingen voor je route", subtitle: "Een snelle herinnering per land. Controleer voor vertrek altijd borden en officiële informatie.", speed: "Snelheidslimieten", motorway: "Snelweg", rural: "Buiten de bebouwde kom", urban: "Bebouwde kom", equipment: "Verplichte uitrusting", vest: "Reflecterend vest voor iedereen", triangle: "Gevarendriehoek", firstAid: "EHBO-set", alcohol: "Maximaal alcoholpromillage", environmental: "Milieusticker", lights: "Dagrijverlichting aanbevolen of verplicht", packing: "Inpaklijst voor de auto", packed: "ingepakt", empty: "Voor deze route zijn geen landen gevonden." },
  no: { title: "Kjøreregler og påbud for din rute", subtitle: "En rask påminnelse for hvert land. Sjekk alltid skilt og offisiell informasjon før avreise.", speed: "Fartsgrenser", motorway: "Motorvei", rural: "Landevei", urban: "By", equipment: "Påbudt utstyr", vest: "Refleksvest til hver person", triangle: "Varseltrekant", firstAid: "Førstehjelpsskrin", alcohol: "Promillegrense", environmental: "Miljøoblat", lights: "Kjørelys på dagtid anbefalt eller påbudt", packing: "Pakkesjekkliste for bilen", packed: "pakket", empty: "Fant ingen land på denne ruten." },
  pl: { title: "Przepisy i obowiązki na Twojej trasie", subtitle: "Szybkie przypomnienie dla każdego kraju. Przed wyjazdem sprawdź znaki i oficjalne informacje.", speed: "Limity prędkości", motorway: "Autostrada", rural: "Drogi poza miastem", urban: "Teren zabudowany", equipment: "Obowiązkowe wyposażenie", vest: "Kamizelka odblaskowa dla każdej osoby", triangle: "Trójkąt ostrzegawczy", firstAid: "Apteczka", alcohol: "Dopuszczalny poziom alkoholu", environmental: "Naklejka ekologiczna", lights: "Światła dzienne zalecane lub wymagane", packing: "Lista rzeczy do auta", packed: "spakowane", empty: "Nie wykryto krajów na tej trasie." },
} as const;

type RuleRowProps = { rule: CountryRule; text: (typeof copy)[keyof typeof copy] };

function RuleRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0"><span className="text-sm text-muted-foreground">{label}</span><strong className="numeric text-sm text-foreground">{value}</strong></div>;
}

export function SafetyRegulations({ countryCodes }: { countryCodes: string[] }) {
  const { locale } = useLocale();
  const text = copy[locale];
  const codes = [...new Set(countryCodes)];
  const [packed, setPacked] = useState<Record<string, boolean>>({});
  const checklist = [text.vest, text.triangle, text.firstAid];

  return (
    <section className="panel p-5 sm:p-6 print-break-before">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-foreground">{text.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{text.subtitle}</p>
        </div>
      </div>

      {codes.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">{text.empty}</p> : <Accordion type="multiple" defaultValue={codes} className="mt-4">{codes.map((code) => { const rule = getCountryRule(code); return <AccordionItem key={code} value={code} className="border-border/70"><AccordionTrigger><span className="flex items-center gap-2"><span className="text-xl" aria-hidden>{FLAGS[code] ?? "🌍"}</span>{COUNTRY_NAMES[code] ?? code}</span></AccordionTrigger><AccordionContent><div className="grid gap-4 md:grid-cols-2"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{text.speed}</p><RuleRow label={text.motorway} value={`${rule.motorwayKmh} km/h`} /><RuleRow label={text.rural} value={`${rule.ruralKmh} km/h`} /><RuleRow label={text.urban} value={`${rule.urbanKmh} km/h`} /><RuleRow label={text.alcohol} value={rule.alcoholLimit} /></div><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{text.equipment}</p><p className="border-b border-border/60 py-2 text-sm text-muted-foreground">{rule.reflectiveVestPerPerson ? <><Check className="mr-2 inline size-4 text-success" />{text.vest}</> : text.vest}</p><p className="border-b border-border/60 py-2 text-sm text-muted-foreground">{rule.warningTriangle ? <><Check className="mr-2 inline size-4 text-success" />{text.triangle}</> : text.triangle}</p><p className="border-b border-border/60 py-2 text-sm text-muted-foreground">{rule.firstAidKit ? <><Check className="mr-2 inline size-4 text-success" />{text.firstAid}</> : text.firstAid}</p><p className="border-b border-border/60 py-2 text-sm text-muted-foreground">{text.environmental}: {rule.environmentalSticker}</p>{rule.daytimeLights && <p className="py-2 text-sm text-signal">{text.lights}</p>}</div></div></AccordionContent></AccordionItem>; })}</Accordion>}

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-base font-bold text-foreground">{text.packing}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">{checklist.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-muted-foreground"><input type="checkbox" checked={!!packed[item]} onChange={(event) => setPacked({ ...packed, [item]: event.target.checked })} className="size-4 accent-[var(--primary)]" /> <span className={packed[item] ? "text-foreground line-through" : ""}>{item}</span></label>)}</div><p className="mt-2 text-xs text-muted-foreground">{Object.values(packed).filter(Boolean).length}/{checklist.length} {text.packed}</p>
      </div>
    </section>
  );
}
