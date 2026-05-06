import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Approved = {
  id: string;
  brand: string;
  name: string;
  type: string;
  why_it_fits: string;
  fit_themes: string[];
};

export const ApprovedAdditionsSection = () => {
  const [items, setItems] = useState<Approved[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("car_suggestions")
        .select("id, brand, name, type, why_it_fits, fit_themes")
        .eq("status", "approved")
        .order("reviewed_at", { ascending: false })
        .limit(6);
      if (!active || !data) return;
      setItems(
        data.map((d) => ({
          ...d,
          fit_themes: Array.isArray(d.fit_themes) ? (d.fit_themes as string[]) : [],
        })),
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border/40">
      <div className="container max-w-5xl py-20">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          New to the AutoVere library
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 max-w-2xl">
          Recently added with editorial approval.
        </h2>
        <p className="text-muted-foreground max-w-xl mb-10 leading-relaxed">
          AI proposes vehicles that match AutoVere's voice. Each one here was reviewed and approved
          before reaching you.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="group glass rounded-2xl p-6 border border-border/40 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.brand} <span className="text-foreground/70">{item.name}</span>
                  </h3>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.type}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3">{item.why_it_fits}</p>
              {item.fit_themes.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {item.fit_themes.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
