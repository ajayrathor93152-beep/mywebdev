import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Coffee, LayoutDashboard, MonitorSmartphone, Rocket, ShoppingCart } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { services } from "@/config/services";
import { cn } from "@/lib/cn";
import { ease, fadeUp, inView, stagger } from "@/lib/motion";

const ICONS = {
  website: MonitorSmartphone,
  ecommerce: ShoppingCart,
  restaurant: Coffee,
  mvp: Rocket,
  dashboard: LayoutDashboard,
};
const ACCENTS = ["var(--volt)", "var(--violet)", "var(--cyan)", "var(--volt)", "var(--violet)"];

const MotionLink = motion.create(Link);

function ServiceCard({ service, index }) {
  const Icon = ICONS[service.key];
  const accent = ACCENTS[index];
  const tagline = service.tagline.replace(/\*/g, "");

  return (
    <MotionLink
      to={`/work/${service.key}`}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease, delay: index * 0.07 }}
      whileHover={{ y: -8 }}
      className={cn(
        "glass-dark neon-border group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] p-7 sm:w-[23rem]",
        "before:opacity-0 before:transition-opacity before:duration-500 hover:animate-spin-border hover:before:opacity-100"
      )}
    >
      {/* Accent glow that blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40"
        style={{ background: accent }}
      />

      <div className="relative flex items-start justify-between">
        <span
          className="grid size-14 place-items-center rounded-2xl text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-12 group-hover:scale-110"
          style={{ background: accent, boxShadow: `0 10px 40px -10px ${accent}` }}
        >
          <Icon className="size-6" />
        </span>
        <span className="font-mono text-xs text-muted">0{index + 1} / 0{services.length}</span>
      </div>

      <h3 className="relative mt-8 text-balance text-2xl font-semibold leading-tight tracking-[-0.035em]">{service.title}</h3>
      <p className="relative mt-2 text-muted">{tagline}</p>

      <ul className="relative mt-6 space-y-2.5 text-sm">
        {service.deliverables.slice(0, 3).map((d) => (
          <li key={d} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0" style={{ color: accent }} />
            <span className="text-fg/85">{d}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto flex items-center justify-between pt-8">
        <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-muted">{service.timeline}</span>
        <span className="flex items-center gap-2 text-sm font-medium">
          See live sample
          <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-volt group-hover:text-ink">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      </div>
    </MotionLink>
  );
}

export default function ServicesShowcase() {
  const trackRef = useRef(null);
  const progress = useMotionValue(0);
  const width = useSpring(progress, { stiffness: 200, damping: 30 });

  // Fill = how far along the row the right edge of the viewport is (so it never starts empty).
  const measure = () => {
    const el = trackRef.current;
    if (el) progress.set(Math.min(1, (el.scrollLeft + el.clientWidth) / el.scrollWidth));
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const scrollByCard = (dir) => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    if (!card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="services-heading" className="relative py-28 md:py-36">
      <motion.div {...inView} variants={stagger(0.1)} className="shell mb-12 flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-3xl">
          <motion.p variants={fadeUp} className="eyebrow mb-5">What we build</motion.p>
          <motion.h2
            id="services-heading"
            variants={fadeUp}
            className="text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          >
            Five ways we make your business <span className="text-neon animate-gradient">impossible to ignore.</span>
          </motion.h2>
        </div>
        <motion.div variants={fadeUp} className="flex gap-2">
          {[
            [-1, ArrowLeft, "Previous services"],
            [1, ArrowRight, "Next services"],
          ].map(([dir, Icon, label]) => (
            <motion.button
              key={label}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollByCard(dir)}
              aria-label={label}
              className="glass-dark grid size-12 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              <Icon className="size-5" />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <div
        ref={trackRef}
        onScroll={measure}
        tabIndex={0}
        aria-label="Services — scroll horizontally"
        className={cn(
          "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-3 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Line the first card up with the page container, and let the last one scroll fully into view.
          "px-[max(1.25rem,calc((100vw-82rem)/2+1.25rem))] scroll-px-[max(1.25rem,calc((100vw-82rem)/2+1.25rem))]",
          "md:px-[max(2rem,calc((100vw-82rem)/2+2rem))] md:scroll-px-[max(2rem,calc((100vw-82rem)/2+2rem))]"
        )}
      >
        {services.map((s, i) => (
          <ServiceCard key={s.key} service={s} index={i} />
        ))}
      </div>

      <div className="shell mt-6">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--volt),var(--violet),var(--cyan))]"
            style={{ scaleX: width }}
            initial={false}
          />
        </div>
      </div>
    </section>
  );
}
