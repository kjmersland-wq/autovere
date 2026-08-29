import { AppLink as Link } from "@/components/AppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Fragment as ReactFragment, type ReactNode } from "react";

export function EmptyState({ title, body, icon: Icon }: { title: string; body: string; icon: LucideIcon }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border py-12 text-center">
      <Icon className="size-8 text-muted-foreground/50" />
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

// A nav item is normally a Section tab (switches the panel shown below via onSelect). Passing
// `href` instead turns it into a real navigation link styled identically — used for entries like
// Admin that must leave the account page entirely rather than switch to an in-page section.
export type AccountNavItem<Section extends string> =
  | { key: Section; label: string; icon: LucideIcon; href?: undefined }
  | { key: string; label: string; icon: LucideIcon; href: string };

export function AccountNav<Section extends string>({ items, active, onSelect, extraAfterFirst }: { items: AccountNavItem<Section>[]; active: Section; onSelect: (key: Section) => void; extraAfterFirst?: ReactNode }) {
  const itemClass = (isActive: boolean) =>
    `flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
    }`;
  return (
    <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {items.map((item, index) => (
        <ReactFragment key={item.key}>
          {item.href ? (
            <Link to={item.href} className={itemClass(false)}>
              <item.icon className="size-4 shrink-0" />
              <span className="whitespace-nowrap lg:whitespace-normal">{item.label}</span>
            </Link>
          ) : (
            <button type="button" onClick={() => onSelect(item.key as Section)} className={itemClass(active === item.key)}>
              <item.icon className="size-4 shrink-0" />
              <span className="whitespace-nowrap lg:whitespace-normal">{item.label}</span>
            </button>
          )}
          {index === 0 && extraAfterFirst}
        </ReactFragment>
      ))}
    </nav>
  );
}

export function AccountShell<Section extends string>({
  backLabel,
  eyebrow,
  title,
  subtitle,
  badge,
  nav,
  navExtra,
  active,
  onSelect,
  children,
}: {
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: ReactNode;
  nav: AccountNavItem<Section>[];
  navExtra?: ReactNode;
  active: Section;
  onSelect: (key: Section) => void;
  children: ReactNode;
}) {
  return (
    <main className="bg-scenic min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> {backLabel}
          </Link>
          <div className="flex items-center gap-2">
            {badge}
            <LanguageSwitcher />
          </div>
        </div>

        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <AccountNav items={nav} active={active} onSelect={onSelect} extraAfterFirst={navExtra} />
          <div className="min-w-0 space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
