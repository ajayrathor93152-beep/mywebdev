import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

// Small, purely decorative product illustrations — one per service.

function Frame({ className, children }) {
  return (
    <div
      aria-hidden
      className={cn("relative h-full min-h-72 overflow-hidden rounded-3xl bg-surface-2 p-5", className)}
    >
      {children}
    </div>
  );
}

function useCycle(length, ms) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);
  return i;
}

const loop = { duration: 4.5, repeat: Infinity, ease: "easeInOut" };

/* ── Website: a browser with a cursor that clicks the CTA ── */
function WebsiteVisual() {
  return (
    <Frame className="grid place-items-center">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <span className="size-2 rounded-full bg-ember" />
          <span className="size-2 rounded-full bg-fg/20" />
          <span className="size-2 rounded-full bg-fg/20" />
          <span className="ml-3 h-4 flex-1 rounded-full bg-fg/[0.06]" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="h-2 w-10 rounded bg-fg/70" />
            <span className="flex gap-2">
              <span className="h-1.5 w-6 rounded bg-fg/15" />
              <span className="h-1.5 w-6 rounded bg-fg/15" />
              <span className="h-1.5 w-6 rounded bg-fg/15" />
            </span>
          </div>
          {["92%", "68%"].map((w, i) => (
            <motion.span
              key={w}
              initial={{ width: 0 }}
              whileInView={{ width: w }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease, delay: 0.2 + i * 0.12 }}
              className="block h-4 rounded-md bg-fg/80"
            />
          ))}
          <span className="block h-1.5 w-3/4 rounded bg-fg/15" />
          <motion.span
            animate={{ scale: [1, 1, 0.9, 1, 1] }}
            transition={{ ...loop, times: [0, 0.45, 0.52, 0.6, 1] }}
            className="block h-7 w-28 rounded-full bg-volt"
          />
          <span className="block h-20 rounded-xl bg-[linear-gradient(120deg,var(--ember),var(--volt))] opacity-80" />
        </div>

        <motion.svg
          viewBox="0 0 24 24"
          className="absolute size-6 drop-shadow"
          animate={{ left: ["78%", "26%", "26%", "78%"], top: ["80%", "56%", "56%", "80%"] }}
          transition={{ ...loop, times: [0, 0.45, 0.65, 1] }}
        >
          <path d="M4 2l16 9-7 2-3 7z" fill="var(--fg)" stroke="var(--bg)" strokeWidth="1.5" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </Frame>
  );
}

/* ── E-commerce: product cards + a cart badge that keeps ticking up ── */
function EcommerceVisual() {
  const count = useCycle(9, 2000) + 1;

  return (
    <Frame className="grid place-items-center">
      <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-2 text-sm">
        <ShoppingBag className="size-4" />
        <span className="relative grid size-5 place-items-center overflow-hidden rounded-full bg-ember text-[11px] font-semibold text-white">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <div className="mt-8 flex items-end gap-3">
        {[
          { tone: "var(--volt)", price: "$48", tilt: -4 },
          { tone: "var(--ember)", price: "$72", tilt: 3 },
        ].map((p, i) => (
          <motion.div
            key={p.price}
            initial={{ y: 30, opacity: 0, rotate: 0 }}
            whileInView={{ y: i * -18, opacity: 1, rotate: p.tilt }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: i * 0.12 }}
            className="w-36 rounded-2xl border border-line bg-bg p-2.5 shadow-[0_20px_40px_-25px_rgb(0_0_0/0.4)] sm:w-40"
          >
            <div
              className="aspect-square rounded-xl"
              style={{ background: `radial-gradient(circle at 35% 30%, ${p.tone}, transparent 65%), var(--surface-2)` }}
            />
            <span className="mt-3 block h-2 w-3/4 rounded bg-fg/70" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">{p.price}</span>
              <span className="rounded-full bg-fg px-2 py-1 text-[10px] font-medium text-bg">Add</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ── Restaurant: a phone menu that scrolls itself + a QR card ── */
const MENU = [
  { name: "Flat white", price: "180", tag: "Hot" },
  { name: "Iced Spanish latte", price: "240", tag: "Bestseller" },
  { name: "Avocado sourdough", price: "320", tag: "V" },
  { name: "Butter croissant", price: "160" },
  { name: "Matcha tonic", price: "260", tag: "New" },
  { name: "Shakshuka", price: "380", tag: "GF" },
  { name: "Basque cheesecake", price: "290" },
];

const QR_SIZE = 9;
// The three solid corner squares are what make it read as a QR code at a glance.
const isFinder = (r, c) =>
  [[0, 0], [0, QR_SIZE - 3], [QR_SIZE - 3, 0]].some(
    ([fr, fc]) => r >= fr && r < fr + 3 && c >= fc && c < fc + 3
  );
const QR_CELLS = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const r = Math.floor(i / QR_SIZE);
  const c = i % QR_SIZE;
  return isFinder(r, c) || (r * 7 + c * 13 + r * c) % 5 < 2;
});

function RestaurantVisual() {
  return (
    <Frame className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ rotate: 0, x: 20, opacity: 0 }}
        whileInView={{ rotate: -8, x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
        className="hidden rounded-2xl bg-paper p-3 text-ink shadow-lg sm:block"
      >
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)` }}>
          {QR_CELLS.map((on, i) => (
            <span key={i} className={cn("size-2 rounded-[1px]", on ? "bg-ink" : "bg-transparent")} />
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest">Scan · Table 4</p>
      </motion.div>

      <div className="relative h-[19rem] w-48 overflow-hidden rounded-[2rem] border-[5px] border-ink bg-bg shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
        <div className="relative z-10 bg-bg px-3 pb-2 pt-4">
          <p className="font-serif text-lg italic leading-none">Café Ember</p>
          <div className="mt-2 flex gap-1.5 text-[9px] font-medium">
            <span className="rounded-full bg-volt px-2 py-0.5 text-ink">Coffee</span>
            <span className="rounded-full bg-fg/10 px-2 py-0.5">Brunch</span>
            <span className="rounded-full bg-fg/10 px-2 py-0.5">Sweet</span>
          </div>
        </div>
        <motion.ul
          animate={{ y: [0, -150, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="space-y-2 px-3"
        >
          {MENU.map((item) => (
            <li key={item.name} className="flex items-center gap-2 rounded-xl bg-surface-2 p-2">
              <span className="size-8 shrink-0 rounded-lg bg-[linear-gradient(135deg,var(--ember),var(--volt))] opacity-80" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-medium">{item.name}</span>
                {item.tag && <span className="text-[8px] text-muted">{item.tag}</span>}
              </span>
              <span className="text-[10px] font-semibold">{item.price}</span>
            </li>
          ))}
        </motion.ul>
        <span className="absolute inset-x-3 bottom-3 z-10 rounded-full bg-ink py-2 text-center text-[10px] font-medium text-paper">
          Book a table
        </span>
      </div>
    </Frame>
  );
}

/* ── MVP: a growth curve that draws itself, with a launch marker ── */
function MvpVisual() {
  const path = "M0 150 C40 148 70 142 100 128 S160 100 190 74 S250 28 300 14";
  return (
    <Frame className="bg-grid flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Active users</p>
          <p className="mt-1 text-3xl font-medium tracking-[-0.04em]">Week 1 → 12</p>
        </div>
        <span className="rounded-full bg-volt px-3 py-1 text-xs font-medium text-ink">v1 live</span>
      </div>
      <svg viewBox="0 0 300 160" className="w-full overflow-visible">
        <defs>
          <linearGradient id="mvp-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--volt)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--volt)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${path} L300 160 L0 160Z`}
          fill="url(#mvp-fill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--volt-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease }}
        />
        <motion.g
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.8 }}
          style={{ originX: "100px", originY: "128px" }}
        >
          <circle cx="100" cy="128" r="10" fill="var(--ember)" opacity="0.25" />
          <circle cx="100" cy="128" r="5" fill="var(--ember)" />
        </motion.g>
      </svg>
    </Frame>
  );
}

/* ── Dashboard: KPI tiles + bars that re-flow with new "data" ── */
const BAR_SETS = [
  [40, 65, 52, 80, 58, 92, 74],
  [55, 48, 70, 62, 88, 66, 95],
  [35, 72, 60, 50, 78, 84, 68],
];

function DashboardVisual() {
  const bars = BAR_SETS[useCycle(BAR_SETS.length, 2400)];
  return (
    <Frame className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Revenue", "bg-volt"],
          ["Orders", "bg-ember"],
          ["Retention", "bg-fg/70"],
        ].map(([label, tone]) => (
          <div key={label} className="rounded-xl border border-line bg-bg p-3">
            <p className="text-[10px] text-muted">{label}</p>
            <span className="mt-2 block h-3 w-3/4 rounded bg-fg/80" />
            <span className={cn("mt-2 block h-1 w-1/2 rounded-full", tone)} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-2 rounded-xl border border-line bg-bg p-3">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.9, ease }}
            className={cn("flex-1 rounded-md", i === bars.indexOf(Math.max(...bars)) ? "bg-volt" : "bg-fg/15")}
          />
        ))}
      </div>
    </Frame>
  );
}

const VISUALS = {
  website: WebsiteVisual,
  ecommerce: EcommerceVisual,
  restaurant: RestaurantVisual,
  mvp: MvpVisual,
  dashboard: DashboardVisual,
};

export default function ServiceVisual({ kind }) {
  const Visual = VISUALS[kind];
  return Visual ? <Visual /> : null;
}
