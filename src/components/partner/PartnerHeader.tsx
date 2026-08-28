type PartnerHeaderProps = {
  name: string;
  logo: string;
  website: string;
  visitLabel: (name: string) => string;
  partnerLabel: string;
  demoNote?: string;
};

export function PartnerHeader({ name, logo, website, visitLabel, partnerLabel, demoNote }: PartnerHeaderProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-1 border-b border-border bg-surface/70 duration-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2.5 px-4 py-2.5 sm:justify-start sm:gap-3 sm:px-8">
        <span className="font-display text-xs font-extrabold uppercase tracking-[0.15em] text-foreground">AutoVere</span>
        <span className="select-none text-sm text-muted-foreground/50" aria-hidden="true">×</span>
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={visitLabel(name)}
          className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-surface-raised px-2.5 py-1.5 transition-colors hover:border-primary/50"
        >
          <img src={logo} alt={name} className="h-5 w-auto max-w-[110px] shrink-0 object-contain sm:h-6 sm:max-w-[140px]" />
          <span className="truncate text-xs font-semibold text-muted-foreground">{name}</span>
        </a>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary sm:text-[11px]">
          {partnerLabel}
        </span>
        {demoNote && <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{demoNote}</span>}
      </div>
    </div>
  );
}
