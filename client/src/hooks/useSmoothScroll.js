import Lenis from "lenis";
import { useEffect } from "react";

// Module-level handle so other code (route changes, anchor links) can drive the same instance.
export const lenisRef = { current: null };

export function scrollToTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/** Smooth-scrolls to an element id, leaving `offset` px (negative = above) for the fixed navbar. */
export function scrollToId(id, offset = -110) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;

    let frame;
    const loop = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
}
