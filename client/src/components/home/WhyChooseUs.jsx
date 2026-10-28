import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ease, fadeUp, inView, stagger } from "@/lib/motion";

/* ── Card shell with a cursor-following spotlight ─────────── */
function SpotlightCard({ className, children }) {
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      variants={fadeUp}
      onPointerMove={onPointerMove}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-line bg-surface p-7 md:p-8",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),color-mix(in_oklab,var(--volt)_18%,transparent),transparent_60%)]",
        className
      )}
    >
      {children}
    </motion.article>
  );
}

function CardText({ index, title, children }) {
  return (
    <div className="relative">
      <p className="eyebrow mb-3">{index}</p>
      <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-[1.75rem]">{title}</h3>
      <p className="mt-3 max-w-md text-muted">{children}</p>
    </div>
  );
}

/* ── Visual 1: a layout that keeps re-composing itself ────── */
const LAYOUTS = [
  ["col-span-4 row-span-2", "col-span-2", "col-span-2", "col-span-3", "col-span-3"],
  ["col-span-2 row-span-2", "col-span-4", "col-span-2", "col-span-2", "col-span-6"],
  ["col-span-6", "col-span-3 row-span-2", "col-span-3", "col-span-3", "col-span-2"],
];
const BLOCK_TONES = ["bg-volt", "bg-fg/10", "bg-ember/80", "bg-fg/[0.06]", "bg-fg/15"];

function ShufflingLayout() {
  const [layout, setLayout] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLayout((n) => (n + 1) % LAYOUTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="grid h-48 grid-cols-6 grid-rows-3 gap-2 md:h-56">
      {LAYOUTS[layout].map((span, i) => (
        <motion.div
          key={i}
          layout
          transition={{ duration: 0.9, ease }}
          className={cn("rounded-xl", span, BLOCK_TONES[i])}
        />
      ))}
    </div>
  );
}

/* ── Visual 2: performance score that counts up in view ───── */
function ScoreRing() {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const progress = useMotionValue(0);
  const display = useTransform(progress, (v) => Math.round(v));
  const dash = useTransform(progress, (v) => `${(v / 100) * 251.3} 251.3`);

  useEffect(() => {
    if (!visible) return;
    const controls = animate(progress, 100, { duration: 1.8, ease });
    return () => controls.stop();
  }, [visible, progress]);

  return (
    <div ref={ref} aria-hidden className="relative grid size-36 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--line)" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--volt)"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
        />
      </svg>
      <motion.span className="text-4xl font-medium tabular-nums tracking-[-0.04em]">{display}</motion.span>
    </div>
  );
}

/* ── Visual 3: one layout breathing between breakpoints ───── */
function ResponsiveFrame() {
  return (
    <div aria-hidden className="flex h-44 items-end justify-center">
      <motion.div
        animate={{ width: ["92%", "60%", "34%", "92%"], height: ["70%", "88%", "100%", "70%"] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, times: [0, 0.33, 0.66, 1] }}
        className="flex flex-col gap-1.5 rounded-xl border border-line bg-bg p-2"
      >
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-ember" />
          <span className="size-1.5 rounded-full bg-fg/20" />
          <span className="size-1.5 rounded-full bg-fg/20" />
        </div>
        <div className="h-1/3 rounded-md bg-volt" />
        <div className="flex flex-1 gap-1.5">
          <div className="flex-1 rounded-md bg-fg/10" />
          <div className="flex-1 rounded-md bg-fg/[0.06]" />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Visual 4: tiny interactive controls (real micro-interactions) ── */
function MicroPlayground() {
  const [on, setOn] = useState(true);
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Demo toggle"
        onClick={() => setOn((v) => !v)}
        className={cn(
          "flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-300",
          on ? "justify-end bg-volt" : "justify-start bg-fg/15"
        )}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="size-7 rounded-full bg-ink shadow" />
      </button>
      <motion.button
        type="button"
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
        whileTap={{ scale: 0.85 }}
        className={cn(
          "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
          liked ? "border-ember bg-ember text-white" : "border-line text-fg hover:border-fg/30"
        )}
      >
        {liked ? "♥ Saved" : "♡ Save"}
      </motion.button>
      <span className="text-sm text-muted">← go on, press them</span>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="shell py-28 md:py-36">
      <motion.div {...inView} variants={stagger(0.1)} className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
        <motion.p variants={fadeUp} className="eyebrow md:col-span-12">
          Why teams choose us
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] md:col-span-8"
        >
          Not another theme with your logo{" "}
          <em className="font-serif font-normal italic text-volt-ink">dropped in.</em>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-lg text-muted md:col-span-4">
          Every project starts from a blank file. Your brand, your customers and your goals drive
          every pixel and every millisecond.
        </motion.p>
      </motion.div>

      <motion.div {...inView} variants={stagger(0.1)} className="grid gap-4 md:grid-cols-6">
        <SpotlightCard className="md:col-span-4">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <CardText index="01" title="Zero template vibe">
              Layouts composed for your content, not content squeezed into someone else&apos;s
              layout. Nothing here was downloaded from a marketplace.
            </CardText>
            <ShufflingLayout />
          </div>
        </SpotlightCard>

        <SpotlightCard className="flex flex-col justify-between gap-8 md:col-span-2">
          <ScoreRing />
          <CardText index="02" title="Lightning-fast">
            Code-split, image-optimised and edge-cached. Speed is a feature your customers feel
            and Google rewards.
          </CardText>
        </SpotlightCard>

        <SpotlightCard className="flex flex-col justify-between gap-6 md:col-span-3">
          <ResponsiveFrame />
          <CardText index="03" title="Modern, fluid layouts">
            Designed for the phone in your customer&apos;s hand first, then scaled up to
            look stunning on every screen.
          </CardText>
        </SpotlightCard>

        <SpotlightCard className="flex flex-col justify-between gap-8 md:col-span-3">
          <CardText index="04" title="Custom UI/UX">
            Interfaces with personality: considered motion, tactile feedback and flows tested
            with real users.
          </CardText>
          <MicroPlayground />
        </SpotlightCard>
      </motion.div>
    </section>
  );
}
