import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { site } from "@/config/site";
import { lenisRef } from "@/hooks/useSmoothScroll";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

export default function Navbar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  // Glass pill after leaving the top; tuck away while scrolling down, return on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 480);
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock page scroll (both native and Lenis) while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
    return () => {
      document.body.style.overflow = "";
      lenisRef.current?.start();
    };
  }, [menuOpen]);

  const activeIndex = site.nav.findIndex((l) =>
    l.to === "/" ? pathname === "/" : pathname.startsWith(l.to)
  );
  const pillIndex = hovered ?? activeIndex;

  return (
    <motion.header
      animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
      transition={{ duration: 0.45, ease }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border py-2 pl-4 pr-2 transition-all duration-500 ease-out-expo",
          scrolled || menuOpen
            ? "glass border-line shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)]"
            : "border-transparent"
        )}
      >
        <Logo />

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {site.nav.map((link, i) => (
            <li key={link.to} className="relative" onMouseEnter={() => setHovered(i)}>
              <NavLink
                to={link.to}
                className={cn(
                  "relative z-10 block px-4 py-2 text-sm transition-colors duration-300",
                  i === pillIndex ? "text-fg" : "text-muted hover:text-fg"
                )}
              >
                {link.label}
              </NavLink>
              {i === pillIndex && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-fg/[0.06]"
                />
              )}
              {i === activeIndex && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-violet"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button to="/contact" size="sm" className="hidden sm:inline-flex">
            Get a quote
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-full bg-fg text-bg md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo",
                  menuOpen && "top-1/2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo",
                  menuOpen && "bottom-auto top-1/2 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl border border-line p-3 md:hidden"
          >
            <ul>
              {site.nav.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-2xl font-medium tracking-tight",
                        isActive ? "bg-fg/[0.06] text-fg" : "text-muted"
                      )
                    }
                  >
                    {link.label}
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <Button to="/contact" className="mt-3 w-full">
              Get a quote
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
