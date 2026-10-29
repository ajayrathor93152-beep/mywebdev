import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { processSteps } from "@/config/services";
import { fadeUp, inView, stagger } from "@/lib/motion";

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="shell py-28 md:py-36">
      <motion.div {...inView} variants={stagger(0.1)} className="mb-16 max-w-3xl">
        <motion.p variants={fadeUp} className="eyebrow mb-6">
          How we work
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em]"
        >
          Four steps. <em className="font-serif font-normal italic text-volt-ink">Zero</em> guesswork.
        </motion.h2>
      </motion.div>

      <div className="relative">
        {/* Progress rail: horizontal on desktop, vertical on mobile — filled by scroll position. */}
        <div aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-line md:block">
          <motion.div style={{ scaleX: fill }} className="h-full origin-left bg-fg" />
        </div>
        <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:hidden">
          <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-fg" />
        </div>

        <motion.ol {...inView} variants={stagger(0.12)} className="grid gap-12 md:grid-cols-4 md:gap-8">
          {processSteps.map((step, i) => (
            <motion.li key={step.title} variants={fadeUp} className="relative pl-12 md:pl-0 md:pt-14">
              <span className="absolute left-0 top-0 grid size-6 place-items-center rounded-full border border-fg bg-bg">
                <span className="size-2 rounded-full bg-violet" />
              </span>
              <p className="font-mono text-xs text-muted">
                0{i + 1} · {step.when}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-3 text-muted">{step.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
