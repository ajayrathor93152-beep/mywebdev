import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);

// What's painted right now (may be a page's forced theme).
const readTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

// What the visitor actually chose — independent of any page that forces a theme.
function readPreference() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function paintTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function applyTheme(theme) {
  paintTheme(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable (private mode) — theme still applies for this visit */
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readPreference);
  // A page can pin a theme while it's mounted (see useForcedTheme). The saved preference is untouched.
  const [forced, setForced] = useState(null);

  useLayoutEffect(() => {
    const effective = forced ?? theme;
    if (readTheme() === effective) return;
    const root = document.documentElement;
    root.classList.add("theme-fade");
    paintTheme(effective);
    const id = window.setTimeout(() => root.classList.remove("theme-fade"), 500);
    return () => window.clearTimeout(id);
  }, [forced, theme]);

  /**
   * Toggles theme with a circular "ink spill" reveal that grows out of the
   * button that was pressed. Falls back to a colour cross-fade where the
   * View Transitions API isn't available or reduced motion is requested.
   */
  const toggleTheme = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      const commit = () => {
        applyTheme(next);
        setTheme(next);
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!document.startViewTransition || reduceMotion) {
        const root = document.documentElement;
        root.classList.add("theme-fade");
        commit();
        window.setTimeout(() => root.classList.remove("theme-fade"), 500);
        return;
      }

      const rect = event?.currentTarget?.getBoundingClientRect?.();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : 0;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => flushSync(commit));
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [theme]
  );

  const value = useMemo(
    () => ({ theme: forced ?? theme, forced: forced !== null, toggleTheme, setForced }),
    [theme, forced, toggleTheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Pins the site to `theme` while the calling page is mounted, then restores the visitor's choice. */
export function useForcedTheme(theme) {
  const { setForced } = useTheme();
  useLayoutEffect(() => {
    setForced(theme);
    return () => setForced(null);
  }, [theme, setForced]);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
