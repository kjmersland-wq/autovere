import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "I want a family EV that handles snowy winters",
  "Something sporty but comfortable for daily driving",
  "Reliable SUV under $50k for long road trips",
  "A quiet city car that still feels premium",
];

export const Advisor = ({ initialPrompt }: { initialPrompt?: string }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) send(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/advisor`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) upsert("AutoVere is at capacity. Try again in a moment.");
        else if (resp.status === 402) upsert("AI credits required to continue.");
        else upsert("Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      upsert("Connection lost. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl shadow-elegant overflow-hidden flex flex-col h-[640px] max-h-[80vh]">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-60 animate-glow-pulse" />
          <div className="relative w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        <div>
          <div className="font-semibold tracking-tight">AutoVere</div>
          <div className="text-xs text-muted-foreground">Your AI car advisor</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="space-y-6 animate-fade-up">
            <p className="text-muted-foreground leading-relaxed">
              Tell me about your life — where you drive, who's in the car, what feels right.
              I'll find cars that actually fit you.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/40 transition-all hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] bg-gradient-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm"
                  : "max-w-[90%] text-foreground"
              }
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-foreground prose-strong:font-semibold prose-ul:my-2">
                  <ReactMarkdown>{m.content || "..."}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Thinking carefully...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="p-4 border-t border-border/50 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you're looking for..."
          className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:bg-secondary transition-colors"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-xl bg-gradient-primary hover:opacity-90 h-12 w-12">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
