import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Sparkles, Check } from "lucide-react";
import { checkEmail, type EmailCheck } from "@/lib/email-suggest";

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
  /** When true (signup/checkout), proactively suggest plus-alias for known providers */
  proactiveAlias?: boolean;
  /** Tag used in plus-alias, e.g. "autovere" → user+autovere@gmail.com */
  aliasTag?: string;
  placeholder?: string;
};

export const SmartEmailField = ({
  id = "email",
  label = "E-post",
  value,
  onChange,
  required,
  proactiveAlias = false,
  aliasTag = "autovere",
  placeholder = "deg@eksempel.com",
}: Props) => {
  const [touched, setTouched] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const result: EmailCheck | null = useMemo(() => {
    if (!value || value.length < 3) return null;
    return checkEmail(value, proactiveAlias ? { aliasTag } : undefined);
  }, [value, proactiveAlias, aliasTag]);

  // reset accepted state when value changes
  useEffect(() => { setAccepted(false); }, [value]);

  const showError = touched && result && !result.valid;
  const showAlias = touched && result?.valid && result.aliasSuggestion && !accepted && value !== result.aliasSuggestion;
  const isClean = touched && result?.valid && !result.aliasSuggestion;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError ? true : undefined}
          aria-describedby={showError ? `${id}-err` : showAlias ? `${id}-tip` : undefined}
          className={isClean ? "pr-9" : ""}
        />
        {isClean && (
          <Check className="w-4 h-4 text-accent absolute right-3 top-1/2 -translate-y-1/2" aria-hidden />
        )}
      </div>

      {showError && (
        <div id={`${id}-err`} className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span>{result!.error}</span>
            {result!.typoSuggestion && (
              <button
                type="button"
                onClick={() => { onChange(result!.typoSuggestion!); setTouched(true); }}
                className="ml-2 underline underline-offset-2 hover:text-foreground"
              >
                Bruk {result!.typoSuggestion}
              </button>
            )}
          </div>
        </div>
      )}

      {showAlias && (
        <div
          id={`${id}-tip`}
          className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed flex items-start gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <p className="text-muted-foreground">{result!.aliasReason}</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="px-2 py-1 rounded-md bg-secondary/60 text-foreground text-[11px]">
                {result!.aliasSuggestion}
              </code>
              <button
                type="button"
                onClick={() => { onChange(result!.aliasSuggestion!); setAccepted(true); }}
                className="text-accent hover:text-foreground underline underline-offset-2"
              >
                Bruk denne
              </button>
              <button
                type="button"
                onClick={() => setAccepted(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                Behold som er
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
