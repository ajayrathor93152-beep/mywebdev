import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Counts from 0 to `value` the first time it scrolls into view. */
export default function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6, className }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const controls = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setDisplay });
    return () => controls.stop();
  }, [seen, value, duration]);

  const formatted = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
