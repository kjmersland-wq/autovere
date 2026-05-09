import { useEffect, useState } from "react";
import { Check, X, Loader2, Lock, Sparkles, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Suggestion = {
  id: string;
  brand: string;
  name: string;
  type: string;
  why_it_fits: string;
  fit_themes: string[];
  confidence: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const KEY_STORAGE = "autovere_admin_key";
const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const Studio = () => {
  const { t } = useTranslation();
  const [adminKey, setAdminKey] = useState<string>("");
  const [keyInput, setKeyInput] = useState("");
  const [list, setList] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE);
    if (saved) setAdminKey(saved);
  }, []);

  const fetchList = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${FN_BASE}/admin-suggestions`, { headers: { "x-admin-key": key } });
      if (res.status === 401) {
        toast.error(t("pages.studio.invalid_key"));
        sessionStorage.removeItem(KEY_STORAGE);
        setAdminKey("");
        return;
      }
      const json = await res.json();
      setList(json.suggestions ?? []);
    } catch {
      toast.error(t("pages.studio.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) fetchList(adminKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const submitKey = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(KEY_STORAGE, keyInput);
    setAdminKey(keyInput);
  };

  const review = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`${FN_BASE}/admin-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      toast.success(action === "approve" ? t("pages.studio.approved") : t("pages.studio.rejected"));
      setList((prev) => prev.map((s) => (s.id === id ? { ...s, status: action === "approve" ? "approved" : "rejected" } : s)));
    } else {
      toast.error(t("pages.studio.action_failed"));
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${FN_BASE}/suggest-cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-refresh-key": adminKey },
        body: "{}",
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(t("pages.studio.generated_n", { n: json.inserted_count }));
        await fetchList(adminKey);
      } else {
        toast.error(json.error ?? t("pages.studio.gen_failed"));
      }
    } finally {
      setGenerating(false);
    }
  };

  if (!adminKey) {
    return (
      <PageShell>
        <SEO title={t("pages.studio.title")} description={t("pages.studio.auth_lead")} noindex />
        <section className="container max-w-md py-32">
          <div className="glass rounded-3xl p-10">
            <Lock className="w-6 h-6 text-accent mb-5" />
            <h1 className="text-2xl font-semibold tracking-tight mb-2">{t("pages.studio.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t("pages.studio.auth_lead")}</p>
            <form onSubmit={submitKey} className="space-y-4">
              <input
                type="password"
                autoFocus
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={t("pages.studio.admin_key") as string}
                className="w-full bg-background/50 border border-border/40 rounded-xl px-4 py-3 text-sm focus:border-accent/60 outline-none"
              />
              <Button type="submit" className="w-full">{t("pages.studio.enter")}</Button>
            </form>
          </div>
        </section>
      </PageShell>
    );
  }

  const pending = list.filter((s) => s.status === "pending");
  const reviewed = list.filter((s) => s.status !== "pending");

  return (
    <PageShell>
      <SEO title={t("pages.studio.title")} description={t("pages.studio.lead")} noindex />
      <section className="container max-w-5xl py-16">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{t("pages.studio.title")}</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{t("pages.studio.h1")}</h1>
            <p className="text-muted-foreground mt-3 max-w-xl">{t("pages.studio.lead")}</p>
          </div>
          <Button onClick={generate} disabled={generating} variant="outline">
            {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {t("pages.studio.generate")}
          </Button>
        </div>

        {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {t("pages.studio.pending")} · {pending.length}
          </div>
          {pending.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground/70 italic py-8">{t("pages.studio.no_pending")}</div>
          )}
          {pending.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h3 className="text-lg font-semibold">
                    {s.brand} <span className="text-foreground/70">{s.name}</span>
                  </h3>
                  <span className="text-xs text-muted-foreground">{s.type}</span>
                  <span className="text-[10px] uppercase tracking-wider text-accent">
                    {(s.confidence * 100).toFixed(0)}% {t("pages.studio.confidence")}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-2">{s.why_it_fits}</p>
                {s.fit_themes.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {s.fit_themes.map((th) => (
                      <span key={th} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {th}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => review(s.id, "reject")}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => review(s.id, "approve")}>
                  <Check className="w-4 h-4 mr-1" /> {t("pages.studio.approve")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {reviewed.length > 0 && (
          <div className="mt-16">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 flex items-center gap-2">
              {t("pages.studio.reviewed")} · {reviewed.length}
              <button onClick={() => fetchList(adminKey)} className="ml-2 hover:text-accent">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {reviewed.slice(0, 20).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-border/30 px-4 py-3 text-sm">
                  <span>
                    <span className="font-medium">{s.brand} {s.name}</span>{" "}
                    <span className="text-muted-foreground">· {s.type}</span>
                  </span>
                  <span className={`text-xs uppercase tracking-wider ${s.status === "approved" ? "text-emerald-400" : "text-muted-foreground/60"}`}>
                    {s.status === "approved" ? t("pages.studio.approved") : t("pages.studio.rejected")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Studio;
