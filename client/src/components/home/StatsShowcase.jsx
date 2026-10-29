import { Accessibility, BadgeCheck, Code2, Gauge, LifeBuoy, Lock, MessageSquareText, Search, Smartphone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import { ease, fadeUp, inView, stagger } from "@/lib/motion";

// These are commitments every project ships with (see config/services.js), not vanity metrics.
// Swap in real totals — projects shipped, happy clients — as you collect them.
const STATS = [
  { value: 100, label: "Lighthouse score we target on every build", icon: Gauge, accent: "var(--volt)" },
  { value: 30, suffix: " days", label: "Free support & fixes after launch", icon: LifeBuoy, accent: "var(--violet)" },
  { value: 100, suffix: "%", label: "Code & design ownership — no lock-in", icon: Code2, accent: "var(--cyan)" },
  { value: 24, suffix: "h", label: "Reply to every enquiry, guaranteed", icon: MessageSquareText, accent: "var(--volt)" },
];

const BADGES = [
  { icon: BadgeCheck, label: "Fixed-price quotes" },
  { icon: Smartphone, label: "Mobile-first" },
  { icon: Search, label: "SEO-ready" },
  { icon: Accessibility, label: "WCAG AA" },
  { icon: Lock, label: "SSL & hardened" },
  { icon: Sparkles, label: "Zero templates" },
];

export default function StatsShowcase() {
  return (
    <section aria-labelledby="stats-heading" className="shell py-20 md:py-28">
      <div className="glass-dark neon-border animate-spin-border relative overflow-hidden rounded-[36px] p-6 md:p-12">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-violet opacity-20 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-cyan opacity-15 blur-[100px]" />

        <motion.div {...inView} variants={stagger(0.1)} className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.p variants={fadeUp} className="eyebrow mb-4">The numbers we hold ourselves to</motion.p>
            <motion.h2
              id="stats-heading"
              variants={fadeUp}
              className="max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1] tracking-[-0.045em]"
            >
              Built fast. Built right. <span className="text-volt">Built to last.</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Button to="/contact" size="md">Get a free quote</Button>
          </motion.div>
        </motion.div>

        <motion.ul {...inView} variants={stagger(0.1, 0.1)} className="relative mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {STATS.map(({ value, suffix, label, icon: Icon, accent }) => (
            <motion.li
              key={label}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5 md:p-7"
            >
              <span
                aria-hidden
                className="absolute -right-8 -top-8 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: accent }}
              />
              <Icon className="relative size-5" style={{ color: accent }} />
              <p className="relative mt-6 whitespace-nowrap text-[clamp(1.85rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.05em]">
                <CountUp value={value} suffix={suffix} duration={2} />
              </p>
              <p className="relative mt-3 text-sm text-muted">{label}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.ul {...inView} variants={stagger(0.05, 0.2)} className="relative mt-10 flex flex-wrap gap-2" aria-label="Included with every project">
          {BADGES.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } } }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition-colors hover:border-volt/60 hover:text-volt"
            >
              <Icon className="size-4" /> {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
