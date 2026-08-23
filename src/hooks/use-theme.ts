import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "autovere-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = saved === "light" || saved === "dark" ? saved : systemTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");

    if (saved) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent) => {
      const next = event.matches ? "light" : "dark";
      setTheme(next);
      document.documentElement.classList.toggle("light", next === "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  return { theme, toggleTheme };
}
