import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "@/context/ThemeContext";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

export default function ThemeToggle({ className }) {
  const { theme, forced, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // A page that pins its own theme (e.g. the always-dark landing page) has nothing to toggle.
  if (forced) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-line text-fg",
        "transition-colors duration-300 hover:border-fg/30 hover:bg-fg/5",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="grid place-items-center"
        >
          {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
