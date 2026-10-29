import { ArrowLeft, ArrowRight, BarChart3, Bell, CheckCircle2, CreditCard, Gauge, ShoppingBag, Smartphone, Zap } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const AUTOPLAY_MS = 7000;

// Wrap a word in *asterisks* to give it the slide's neon accent.
const SLIDES = [
  {
    key: "web",
    tab: "Websites",
    accent: "var(--volt)",
    eyebrow: "Websites & brand experiences",
    lines: ["We build", "websites that", "*sell.*"],
    sub: "Custom-designed, hand-coded sites that load in under a second and turn visitors into paying customers.",
    cta: { label: "Start a project", to: "/contact?service=website" },
    Visual: WebVisual,
  },
  {
    key: "store",
    tab: "Stores",
    accent: "var(--violet)",
    eyebrow: "E-commerce & café ordering",
    lines: ["Stores built", "to *convert*", "every click."],
    sub: "Fast product pages, a friction-free checkout and UPI, Razorpay or Stripe payments that just work.",
    cta: { label: "Launch your store", to: "/contact?service=ecommerce" },
    Visual: StoreVisual,
  },
  {
    key: "mvp",
    tab: "MVPs",
    accent: "var(--cyan)",
    eyebrow: "Startup MVPs & dashboards",
    lines: ["From idea", "to *launch*", "in weeks."],
    sub: "Production-grade MVPs and dashboards — auth, billing, analytics — so you can validate fast and raise with confidence.",
    cta: { label: "Scope your MVP", to: "/contact?service=mvp" },
    Visual: MvpVisual,
  },
];

/* ── Shared bits for the floating visuals ─────────────────── */

function Chip({ className, icon: Icon, accent, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.35 + delay }}
      className={cn("absolute z-20", className)}
    >
      <div
        className="glass-dark flex animate-float items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm text-fg shadow-[0_20px_50px_-10px_rgb(0_0_0/0.8)]"
        // Near-opaque so the chip reads cleanly over the window it floats on.
        style={{ animationDelay: `${delay * -3}s`, background: "rgb(22 22 24 / 0.92)" }}
      >
        <span className="grid size-8 place-items-center rounded-xl text-ink" style={{ background: accent }}>
          <Icon className="size-4" />
        </span>
        {children}
      </div>
    </motion.div>
  );
}

function Window({ children, className }) {
  return (
    <div className={cn("glass-dark overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]", className)}>
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-3">
        <span className="size-2.5 rounded-full bg-volt" />
        <span className="size-2.5 rounded-full bg-violet" />
        <span className="size-2.5 rounded-full bg-cyan" />
        <span className="ml-3 h-4 flex-1 rounded-full bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

/* ── Slide visuals ────────────────────────────────────────── */

function WebVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <Window>
        <div className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-14 rounded bg-white/80" />
            <span className="flex gap-2">
              {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-7 rounded bg-white/15" />)}
            </span>
          </div>
          {["94%", "70%"].map((w, i) => (
            <motion.span
              key={w}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ duration: 1, ease, delay: 0.3 + i * 0.12 }}
              className="block h-5 rounded-md bg-white/85"
            />
          ))}
          <span className="block h-1.5 w-3/4 rounded bg-white/15" />
          <span className="block h-1.5 w-1/2 rounded bg-white/15" />
          <motion.span
            animate={{ boxShadow: ["0 0 0 0 rgb(255 214 10 / 0.5)", "0 0 0 14px rgb(255 214 10 / 0)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-2 block h-9 w-32 rounded-full bg-volt"
          />
          <span className="block h-24 animate-gradient rounded-2xl bg-[linear-gradient(110deg,var(--volt),var(--violet),var(--cyan))] bg-[length:200%_100%] opacity-90" />
        </div>
      </Window>
      <Chip icon={Gauge} accent="var(--volt)" className="-left-4 top-16 md:-left-14">
        <span><b className="block leading-none">100</b><span className="text-xs text-muted">Lighthouse target</span></span>
      </Chip>
      <Chip icon={Bell} accent="var(--cyan)" className="-right-3 bottom-10 md:-right-12" delay={0.15}>
        <span><b className="block leading-none">New lead</b><span className="text-xs text-muted">from your contact form</span></span>
      </Chip>
    </div>
  );
}

function StoreVisual() {
  const products = [
    { name: "Aero Runner", price: "₹4,299", tone: "var(--violet)" },
    { name: "Glow Hoodie", price: "₹2,499", tone: "var(--volt)" },
  ];
  return (
    <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-4 pt-6">
      {products.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ y: 40, opacity: 0, rotate: 0 }}
          animate={{ y: i ? 0 : -30, opacity: 1, rotate: i ? 4 : -5 }}
          transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.12 }}
          className="glass-dark w-44 rounded-3xl p-3 shadow-2xl sm:w-48"
        >
          <div
            className="aspect-square rounded-2xl"
            style={{ background: `radial-gradient(circle at 35% 30%, ${p.tone}, transparent 68%), rgb(255 255 255 / 0.04)` }}
          />
          <p className="mt-3 text-sm font-medium">{p.name}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted">{p.price}</span>
            <span className="rounded-full bg-volt px-3 py-1 text-xs font-semibold text-ink">Add</span>
          </div>
        </motion.div>
      ))}
      <Chip icon={ShoppingBag} accent="var(--violet)" className="-top-2 right-0 md:-right-8">
        <span><b className="block leading-none">Order placed</b><span className="text-xs text-muted">2 items · ₹6,798</span></span>
      </Chip>
      <Chip icon={CreditCard} accent="var(--cyan)" className="-bottom-10 -left-2 md:-left-12" delay={0.15}>
        <span className="text-sm font-medium">UPI · Cards · Wallets</span>
      </Chip>
    </div>
  );
}

const BARS = [38, 52, 44, 66, 58, 80, 92];

function MvpVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <Window>
        <div className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted">Active users</p>
              <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Week 1 → 12</p>
            </div>
            <span className="rounded-full bg-cyan/15 px-3 py-1 text-xs font-medium text-cyan">v1 live</span>
          </div>
          <div className="mt-6 flex h-36 items-end gap-2">
            {BARS.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}
                className="flex-1 rounded-t-md"
                style={{ background: i === BARS.length - 1 ? "var(--cyan)" : "rgb(255 255 255 / 0.12)" }}
              />
            ))}
          </div>
        </div>
      </Window>
      <Chip icon={Zap} accent="var(--volt)" className="-right-3 -top-5 md:-right-10">
        <span className="text-sm font-medium">Shipped in 8 weeks</span>
      </Chip>
      <Chip icon={CheckCircle2} accent="var(--cyan)" className="-left-3 bottom-8 md:-left-12" delay={0.15}>
        <span className="text-sm font-medium">Auth · Billing · Analytics</span>
      </Chip>
    </div>
  );
}

/* ── Background: drifting neon glows + a soft light that follows the cursor ── */

function Backdrop({ accent, mx, my }) {
  const spotlight = useTransform([mx, my], ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgb(255 255 255 / 0.05), transparent 70%)`);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Takes the active slide's accent; a CSS transition cross-fades it between slides. */}
      <div
        style={{ backgroundColor: accent }}
        className="absolute -right-[15%] top-[5%] size-[46rem] animate-drift rounded-full opacity-[0.16] blur-[140px] transition-[background-color] duration-1000"
      />
      <div className="absolute -left-[15%] top-[35%] size-[36rem] animate-drift-slow rounded-full bg-violet opacity-[0.18] blur-[140px]" />
      <div className="absolute bottom-[-20%] left-[35%] size-[30rem] animate-drift rounded-full bg-cyan opacity-[0.10] blur-[130px]" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

function Headline({ lines, accent }) {
  return (
    <h1 className="text-[clamp(2.9rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
      {lines.map((line, li) => (
        // The clip box is padded out (and pulled back with negative margins) so the accent word's glow isn't cut off.
        <span key={line} className="-mx-[0.4em] -my-[0.2em] block overflow-hidden px-[0.4em] pb-[0.26em] pt-[0.2em]">
          <motion.span
            className="block"
            initial={{ y: "140%", filter: "blur(8px)" }}
            // Drop the filter once settled — a lingering blur(0px) clips the accent word's glow to a box.
            animate={{ y: "0%", filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ y: "-140%", filter: "blur(8px)", transition: { duration: 0.3, ease, delay: li * 0.03 } }}
            transition={{ duration: 0.9, ease, delay: 0.1 + li * 0.09 }}
          >
            {line.split(/\*(.+?)\*/g).map((part, i) =>
              i % 2 ? (
                <span key={i} style={{ color: accent, textShadow: `0 0 32px color-mix(in oklab, ${accent} 60%, transparent)` }}>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const [[index, direction], setSlide] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const slide = SLIDES[index];
  const sectionRef = useRef(null);

  const go = useCallback((dir) => setSlide(([i]) => [(i + dir + SLIDES.length) % SLIDES.length, dir]), []);
  const goTo = (i) => setSlide(([cur]) => [i, i > cur ? 1 : -1]);

  // Autoplay — restarts whenever the slide changes, stops while hovered/focused or for reduced motion.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduceMotion, go]);

  // Pointer → spotlight position and a gentle 3D tilt on the visual.
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 });
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 md:pt-36"
    >
      <Backdrop accent={slide.accent} mx={mx} my={my} />

      <div className="shell">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(1);
            else if (info.offset.x > 70) go(-1);
          }}
          className="grid cursor-grab items-center gap-14 active:cursor-grabbing lg:grid-cols-12 lg:gap-8"
        >
          <div
            className="lg:col-span-7"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}`}
          >
            {/* Exits get their own quick timing (no entrance delays), so the hand-off between slides stays short. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={slide.key}>
                <motion.p
                  initial={{ opacity: 0, x: 20 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 * direction, transition: { duration: 0.3, ease } }}
                  transition={{ duration: 0.6, ease }}
                  className="glass-dark mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-sm"
                >
                  <span className="relative flex size-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full opacity-75" style={{ background: slide.accent }} />
                    <span className="relative size-2.5 rounded-full" style={{ background: slide.accent }} />
                  </span>
                  {slide.eyebrow}
                </motion.p>

                <Headline lines={slide.lines} accent={slide.accent} />

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease } }}
                  transition={{ duration: 0.7, ease, delay: 0.35 }}
                  className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
                >
                  {slide.sub}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease } }}
                  transition={{ duration: 0.7, ease, delay: 0.45 }}
                  className="mt-10 flex flex-wrap gap-3"
                >
                  <Button to={slide.cta.to} size="lg">
                    {slide.cta.label}
                  </Button>
                  <Button to="/work" size="lg" variant="neon">
                    See live samples
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }} className="relative lg:col-span-5">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={slide.key}
                custom={direction}
                initial={{ opacity: 0, x: 80 * direction, rotate: 4 * direction, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -80 * direction, rotate: -4 * direction, scale: 0.92, transition: { duration: 0.35, ease } }}
                transition={{ duration: 0.7, ease }}
                className="px-4 sm:px-8 lg:px-0"
              >
                <slide.Visual />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Controls: progress tabs + arrows */}
        <div className="mt-16 flex items-center justify-between gap-6">
          <div className="flex flex-1 gap-3" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => goTo(i)}
                className="group flex max-w-48 flex-1 flex-col gap-2 text-left"
              >
                <span className="relative h-1 overflow-hidden rounded-full bg-white/10">
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: s.accent }}
                      initial={{ width: paused || reduceMotion ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused || reduceMotion ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 bg-white/30" />}
                </span>
                <span className={cn("hidden font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:block", i === index ? "text-fg" : "text-muted group-hover:text-fg")}>
                  0{i + 1} · {s.tab}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              [-1, ArrowLeft, "Previous slide"],
              [1, ArrowRight, "Next slide"],
            ].map(([dir, Icon, label]) => (
              <motion.button
                key={label}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => go(dir)}
                aria-label={label}
                className="glass-dark grid size-12 place-items-center rounded-full transition-colors hover:bg-white/10"
              >
                <Icon className="size-5" />
              </motion.button>
            ))}
          </div>
        </div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
        >
          {[
            [Smartphone, "Mobile-first"],
            [Zap, "Sub-second loads"],
            [BarChart3, "SEO & analytics built in"],
          ].map(([Icon, label]) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-volt" /> {label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
