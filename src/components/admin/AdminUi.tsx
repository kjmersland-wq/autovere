import type { ReactNode } from "react";

export function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5 print:border print:border-neutral-300 print:bg-white">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground print:text-neutral-600">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight print:text-neutral-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-foreground/60 print:text-neutral-600">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="glass-panel rounded-2xl p-5 print:break-inside-avoid print:border print:border-neutral-300 print:bg-white">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
