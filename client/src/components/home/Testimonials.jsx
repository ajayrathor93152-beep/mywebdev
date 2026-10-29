import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { services } from "@/config/services";
import { testimonials } from "@/config/testimonials";
import { cn } from "@/lib/cn";
import { fadeUp, inView, stagger } from "@/lib/motion";

const ACCENTS = ["var(--volt)", "var(--violet)", "var(--cyan)"];
const serviceName = Object.fromEntries(services.map((s) => [s.key, s.short]));

function Card({ t, i }) {
  const accent = ACCENTS[i % ACCENTS.length];
  const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <figure className="glass-dark group relative flex w-[20rem] shrink-0 flex-col rounded-3xl p-6 transition-colors duration-500 hover:bg-white/[0.07] md:w-[24rem]">
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, s) => (
            <Star key={s} className="size-4 fill-volt text-volt" />
          ))}
        </span>
        <Quote className="size-6 opacity-30 transition-transform duration-500 group-hover:rotate-12" style={{ color: accent }} />
      </div>
      <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-fg/90">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full text-sm font-semibold text-ink" style={{ background: accent }}>
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{t.name}</span>
          <span className="block truncate text-xs text-muted">{t.role}</span>
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-muted">{serviceName[t.service]}</span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse, offset = 0 }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      {/* Four copies; the track slides half its width (two copies), so the loop is seamless even on ultra-wide screens. */}
      <div
        className={cn(
          "flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused] [animation-duration:60s]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <div key={i} aria-hidden={i >= items.length || undefined}>
            <Card t={t} i={i + offset} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section aria-labelledby="testimonials-heading" className="py-24 md:py-32">
      <motion.div {...inView} variants={stagger(0.1)} className="shell mb-14 text-center">
        <motion.p variants={fadeUp} className="eyebrow mb-5">Client success</motion.p>
        <motion.h2
          id="testimonials-heading"
          variants={fadeUp}
          className="mx-auto max-w-3xl text-balance text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
        >
          Don&apos;t take our word for it. <span className="text-neon animate-gradient">Take theirs.</span>
        </motion.h2>
      </motion.div>

      <div className="space-y-5">
        <Row items={testimonials.slice(0, half)} />
        <Row items={testimonials.slice(half)} reverse offset={1} />
      </div>
    </section>
  );
}
