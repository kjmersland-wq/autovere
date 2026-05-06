import { useNavigate, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGS, LANG_LABELS, type Lang } from "@/i18n/config";
import { detectLangFromPath, localizePath } from "@/i18n/routing";

export const LanguageSwitcher = () => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const current = detectLangFromPath(pathname);

  // Strip current lang to get the canonical inner path
  const stripped = (() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    if (seg && (SUPPORTED_LANGS as readonly string[]).includes(seg)) {
      const rest = "/" + pathname.split("/").slice(2).join("/");
      return rest === "//" ? "/" : rest || "/";
    }
    return pathname;
  })();

  const switchTo = (lang: Lang) => {
    const next = localizePath(stripped, lang);
    navigate(next + search + hash);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md">
        <Globe className="w-3.5 h-3.5" />
        {current.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {SUPPORTED_LANGS.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchTo(l)}
            className={l === current ? "text-accent" : ""}
          >
            {LANG_LABELS[l]}
            <span className="ml-auto text-[10px] uppercase opacity-50">{l}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
