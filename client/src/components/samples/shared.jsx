import { cn } from "@/lib/cn";

export { default as CountUp } from "@/components/ui/CountUp";

/**
 * Art-directed image placeholder: layered gradients + a caption, so samples look finished
 * without shipping stock photos. Swap for <img> when real photography exists.
 */
export function Placeholder({ from, via, to, label, className, children }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 20% 15%, ${from}, transparent 60%),
                     radial-gradient(90% 80% at 85% 90%, ${to}, transparent 65%),
                     ${via}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {children}
    </div>
  );
}
