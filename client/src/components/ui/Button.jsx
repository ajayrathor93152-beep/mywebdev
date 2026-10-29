import { ArrowUpRight } from "lucide-react";
import { motion, useSpring } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const MotionLink = motion.create(Link);

const variants = {
  volt: "bg-volt text-ink hover:shadow-[0_10px_40px_-10px_var(--volt)]",
  solid: "bg-fg text-bg",
  ghost: "border border-line bg-transparent text-fg hover:border-fg/40",
  glass: "glass border border-line text-fg",
  // Dark glass with a rotating yellow → violet → cyan edge. Made for dark backgrounds.
  neon: "glass-dark neon-border animate-spin-border text-fg hover:shadow-[0_10px_50px_-12px_var(--violet)]",
};

const iconVariants = {
  volt: "bg-ink text-volt",
  solid: "bg-volt text-ink",
  ghost: "bg-fg text-bg",
  glass: "bg-fg text-bg",
  neon: "bg-violet text-white",
};

const sizes = {
  sm: "h-10 pl-4 pr-1.5 text-sm gap-3",
  md: "h-12 pl-6 pr-2 text-[0.95rem] gap-4",
  lg: "h-14 pl-7 pr-2 text-base gap-5",
};

const spring = { stiffness: 220, damping: 18, mass: 0.4 };

/**
 * Magnetic pill button. The label "rolls" on hover and the arrow chip rotates.
 * Renders a router <Link> when `to` is given, an <a> for `href`, else a <button>.
 */
export default function Button({
  to,
  href,
  variant = "volt",
  size = "md",
  icon = true,
  magnetic = true,
  className,
  children,
  ...props
}) {
  const ref = useRef(null);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onPointerMove = (e) => {
    if (!magnetic || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = to ? MotionLink : href ? motion.a : motion.button;
  const linkProps = to ? { to } : href ? { href } : { type: props.type ?? "button" };

  return (
    <Comp
      ref={ref}
      {...linkProps}
      {...props}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative inline-flex select-none items-center justify-between rounded-full font-medium tracking-tight",
        "transition-[box-shadow,border-color,background-color] duration-500",
        !icon && "pr-6",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span
          className={cn(
            "grid aspect-square h-[calc(100%-0.75rem)] place-items-center rounded-full",
            iconVariants[variant]
          )}
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
        </span>
      )}
    </Comp>
  );
}
