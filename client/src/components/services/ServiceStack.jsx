import { Check } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Emphasis from "@/components/ui/Emphasis";
import { services } from "@/config/services";
import { scrollToId } from "@/hooks/useSmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import ServiceVisual from "./ServiceVisual";

const STACK_TOP = 96; // px below the viewport top where the first card pins
const STACK_STEP = 18; // each following card pins a little lower, so the edges peek out
const STACK_QUERY = "(min-width: 768px) and (min-height: 760px)";

const anchorOffset = (index, stacked) => -(stacked ? STACK_TOP + index * STACK_STEP : 96);

/** Chips under the page intro that jump to each service card. */
export function ServiceJumpLinks() {
  const stacked = useMediaQuery(STACK_QUERY);
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {services.map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => scrollToId(s.key, anchorOffset(i, stacked))}
          className="group flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg"
        >
          <span className="font-mono text-[11px] text-muted transition-colors group-hover:text-bg/60">
            0{i + 1}
          </span>
          {s.short}
        </button>
      ))}
    </div>
  );
}

function ServiceCard({ service, index, total, progress, stacked }) {
  // Cards behind the top one shrink slightly, so the stack reads as depth.
  const targetScale = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <>
      {/* Anchor sits in normal flow (not sticky) so jump links land in the right place. */}
      <div id={service.key} aria-hidden />
      <div
        className={cn("mb-6", stacked && "sticky")}
        style={stacked ? { top: STACK_TOP + index * STACK_STEP } : undefined}
      >
        <motion.article
          style={stacked ? { scale } : undefined}
          initial={stacked ? false : { opacity: 0, y: 30 }}
          whileInView={stacked ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid origin-top gap-8 rounded-[32px] border border-line bg-surface p-6 shadow-[0_-24px_60px_-40px_rgb(0_0_0/0.35)] md:grid-cols-12 md:gap-10 md:p-10"
        >
          <div className="flex flex-col md:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="eyebrow">
                0{index + 1} / 0{total}
              </span>
              <span className="rounded-full bg-fg/[0.06] px-3 py-1 font-mono text-[11px] text-muted">
                Typical timeline · {service.timeline}
              </span>
            </div>

            <h2 className="mt-6 text-balance text-[clamp(1.85rem,3.6vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {service.title}
            </h2>
            <p className="mt-3 text-xl tracking-[-0.02em] md:text-2xl">
              <Emphasis text={service.tagline} />
            </p>
            <p className="mt-4 max-w-xl text-muted">{service.description}</p>

            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[0.95rem]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-volt text-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
              <ul className="flex flex-wrap gap-1.5" aria-label="Typical stack">
                {service.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              <Button to={`/contact?service=${service.key}`} size="sm" variant="solid">
                Start this project
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:col-span-5">
            <div className="flex-1">
              <ServiceVisual kind={service.key} />
            </div>
            <p className="rounded-2xl border border-line px-4 py-3 text-sm">
              <span className="text-muted">Ideal for — </span>
              {service.idealFor}
            </p>
          </div>
        </motion.article>
      </div>
    </>
  );
}

export default function ServiceStack() {
  const ref = useRef(null);
  const stacked = useMediaQuery(STACK_QUERY);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} aria-label="Our services" className="shell relative pb-16">
      {services.map((service, i) => (
        <ServiceCard
          key={service.key}
          service={service}
          index={i}
          total={services.length}
          progress={scrollYProgress}
          stacked={stacked}
        />
      ))}
    </section>
  );
}
