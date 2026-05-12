import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 rounded-lg glass border border-border/40 flex items-center justify-center hover:border-accent/40 transition-colors ${className}`}
      aria-label="Toggle colour theme"
    >
      {/* Sun visible in dark mode, Moon in light mode */}
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}
