import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const THEME_KEY = "akd-theme";

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * Tema durumu. İlk boyama <head>'deki boot betiğiyle yapılır; burada yalnızca
 * geçiş, kalıcılık ve sistem tercihi takibi yönetilir.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  const apply = useCallback((mode: Theme, persist: boolean) => {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 450);
    root.setAttribute("data-theme", mode);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#0d131b" : "#ffffff");

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch {
        /* yok say */
      }
    }
    setThemeState(mode);
  }, []);

  const toggle = useCallback(() => {
    apply(currentTheme() === "dark" ? "light" : "dark", true);
  }, [apply]);

  useEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        /* yok say */
      }
      if (stored !== "dark" && stored !== "light") {
        apply(e.matches ? "dark" : "light", false);
      }
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [apply]);

  return { theme, toggle };
}
