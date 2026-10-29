import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Moon,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Sun,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { CountUp } from "./shared";

// Orbit Analytics — a fictional admin dashboard with its own light/dark theme,
// independent of the site theme so visitors can flip it without touching ours.
const THEMES = {
  light: { bg: "#f5f6f8", panel: "#ffffff", fg: "#0f1115", muted: "#6b7280", line: "rgb(15 17 21 / 0.08)", accent: "#4f6ef7", track: "#e8ebf2", good: "#16a34a", bad: "#dc2626", warn: "#b45309" },
  dark: { bg: "#0f1115", panel: "#171a21", fg: "#eef0f4", muted: "#8b93a3", line: "rgb(238 240 244 / 0.08)", accent: "#7c9cff", track: "#232733", good: "#4ade80", bad: "#f87171", warn: "#fbbf24" },
};

const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: Package, label: "Products" },
  { icon: Users, label: "Customers" },
  { icon: Settings, label: "Settings" },
];
const RANGES = { "7d": 7, "30d": 30, "90d": 90 };
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Small deterministic PRNG so each range always shows the same "data".
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function buildData(days) {
  const rand = seeded(days * 97);
  const revenue = Array.from({ length: days }, (_, i) => Math.round(42000 + i * (900 / Math.sqrt(days)) * 10 + rand() * 18000));
  const total = revenue.reduce((a, b) => a + b, 0);
  const scale = days / 7;
  return {
    revenue,
    kpis: [
      { label: "Revenue", value: total, prefix: "₹", delta: 12.4 },
      { label: "Orders", value: Math.round(312 * scale + rand() * 40), delta: 8.1 },
      { label: "Active users", value: Math.round(2140 * Math.sqrt(scale)), delta: 3.6 },
      { label: "Conversion", value: 3.2 + rand() * 0.6, decimals: 2, suffix: "%", delta: -0.4 },
    ],
    weekday: WEEKDAYS.map((d, i) => ({ day: d, orders: Math.round((38 + rand() * 30 + (i > 3 ? 18 : 0)) * scale) })),
    channels: [
      { name: "Organic search", share: 38 },
      { name: "Instagram", share: 24 },
      { name: "Direct", share: 18 },
      { name: "WhatsApp", share: 12 },
      { name: "Referral", share: 8 },
    ],
  };
}

const ORDERS = [
  { id: "#4821", customer: "Riya Kapoor", total: 2490, status: "Paid" },
  { id: "#4820", customer: "Arjun Nair", total: 1180, status: "Pending" },
  { id: "#4819", customer: "Meera Shah", total: 5620, status: "Paid" },
  { id: "#4818", customer: "Kabir Singh", total: 890, status: "Refunded" },
  { id: "#4817", customer: "Zoya Ali", total: 3340, status: "Paid" },
];

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const compact = (n) => `₹${(n / 1000).toFixed(0)}k`;

function Panel({ t, className, children }) {
  return (
    <div className={cn("rounded-2xl border p-5", className)} style={{ background: t.panel, borderColor: t.line }}>
      {children}
    </div>
  );
}

function Kpi({ t, kpi, i }) {
  const up = kpi.delta >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: i * 0.06 }}>
      <Panel t={t}>
        <p className="text-sm" style={{ color: t.muted }}>{kpi.label}</p>
        <CountUp
          value={kpi.value}
          prefix={kpi.prefix}
          suffix={kpi.suffix}
          decimals={kpi.decimals}
          className="mt-2 block text-2xl font-semibold tracking-[-0.03em] md:text-3xl"
        />
        {/* Status colour is never alone — arrow + signed number carry the meaning too. */}
        <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: t.muted }}>
          <span className="inline-flex items-center gap-0.5 font-medium" style={{ color: up ? t.good : t.bad }}>
            <Arrow className="size-3.5" />
            {up ? "+" : ""}
            {kpi.delta}%
          </span>
          vs previous period
        </p>
      </Panel>
    </motion.div>
  );
}

/** Single-series area chart with a crosshair + tooltip. Stretched SVG for shapes, HTML overlay for text. */
function RevenueChart({ t, data, range }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data) * 1.1;
  const n = data.length;
  const pts = data.map((v, i) => [(i / (n - 1)) * 100, 100 - (v / max) * 100]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const area = `${line} L100 100 L0 100 Z`;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const ticks = [0.25, 0.5, 0.75, 1].map((f) => max * f);
  const dayLabel = (i) => `Day ${i + 1}`;

  return (
    <Panel t={t} className="lg:col-span-2">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">Revenue</h3>
        <p className="text-xs" style={{ color: t.muted }}>Daily · last {range}</p>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="flex h-56 flex-col-reverse justify-between pb-0 text-[10px] tabular-nums" style={{ color: t.muted }}>
          <span>₹0</span>
          {ticks.map((v) => <span key={v}>{compact(v)}</span>)}
        </div>
        <div className="relative h-56 flex-1 touch-none" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="orbit-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={t.accent} stopOpacity="0.28" />
                <stop offset="1" stopColor={t.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke={t.line} vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2="100" y1="100" y2="100" stroke={t.muted} strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
            <motion.path key={`a-${range}`} d={area} fill="url(#orbit-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
            <motion.path
              key={`l-${range}`}
              d={line}
              fill="none"
              stroke={t.accent}
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease }}
            />
            {hover !== null && (
              <line x1={pts[hover][0]} x2={pts[hover][0]} y1="0" y2="100" stroke={t.muted} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          {hover !== null && (
            <>
              <span
                className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{ left: `${pts[hover][0]}%`, top: `${pts[hover][1]}%`, background: t.accent, borderColor: t.panel }}
              />
              <div
                className="pointer-events-none absolute top-0 z-10 rounded-lg border px-3 py-2 text-xs shadow-lg"
                style={{
                  left: `${pts[hover][0]}%`,
                  transform: `translateX(${pts[hover][0] > 70 ? "calc(-100% - 10px)" : "10px"})`,
                  background: t.panel,
                  borderColor: t.line,
                }}
              >
                <p style={{ color: t.muted }}>{dayLabel(hover)}</p>
                <p className="font-semibold tabular-nums">{inr(data[hover])}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

function WeekdayBars({ t, data, range }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.orders));
  return (
    <Panel t={t}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">Orders by weekday</h3>
        <p className="text-xs" style={{ color: t.muted }}>{range}</p>
      </div>
      <div className="mt-4 flex h-56 items-end gap-2 border-b" style={{ borderColor: t.line }}>
        {data.map((d, i) => (
          <div
            key={d.day}
            className="relative flex h-full flex-1 cursor-default flex-col justify-end"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            {hover === i && (
              <span className="absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold shadow tabular-nums" style={{ bottom: `calc(${(d.orders / max) * 100}% + 6px)`, background: t.panel, borderColor: t.line }}>
                {d.orders} orders
              </span>
            )}
            <motion.span
              key={`${range}-${d.day}`}
              initial={{ height: 0 }}
              animate={{ height: `${(d.orders / max) * 100}%` }}
              transition={{ duration: 0.8, ease, delay: i * 0.05 }}
              className="block rounded-t-[4px] transition-opacity"
              style={{ background: t.accent, opacity: hover === null || hover === i ? 1 : 0.45 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-center text-[10px]" style={{ color: t.muted }}>
        {data.map((d) => <span key={d.day} className="flex-1">{d.day}</span>)}
      </div>
    </Panel>
  );
}

function Channels({ t, data }) {
  const max = Math.max(...data.map((c) => c.share));
  return (
    <Panel t={t}>
      <h3 className="font-medium">Traffic by channel</h3>
      <ul className="mt-5 space-y-4">
        {data.map((c, i) => (
          <li key={c.name}>
            <div className="flex justify-between text-sm">
              <span>{c.name}</span>
              <span className="tabular-nums" style={{ color: t.muted }}>{c.share}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full" style={{ background: t.track }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.share / max) * 100}%` }}
                transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.07 }}
                className="h-full rounded-full"
                style={{ background: t.accent }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const STATUS = {
  Paid: { icon: CheckCircle2, key: "good" },
  Pending: { icon: Clock3, key: "warn" },
  Refunded: { icon: XCircle, key: "bad" },
};

function RecentOrders({ t }) {
  return (
    <Panel t={t} className="lg:col-span-2">
      <h3 className="font-medium">Recent orders</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: t.muted }}>
              <th className="pb-3 font-normal">Order</th>
              <th className="pb-3 font-normal">Customer</th>
              <th className="pb-3 font-normal">Status</th>
              <th className="pb-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o, i) => {
              const { icon: Icon, key } = STATUS[o.status];
              return (
                <motion.tr key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }} className="border-t" style={{ borderColor: t.line }}>
                  <td className="py-3 font-mono text-xs">{o.id}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: t[key] }}>
                      <Icon className="size-3.5" /> {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-right tabular-nums">{inr(o.total)}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export default function DashboardSample() {
  const [mode, setMode] = useState("dark");
  const [range, setRange] = useState("30d");
  const [active, setActive] = useState("Overview");
  const t = THEMES[mode];
  const data = useMemo(() => buildData(RANGES[range]), [range]);

  return (
    <div className="flex min-h-[52rem] transition-colors duration-500" style={{ background: t.bg, color: t.fg }}>
      <aside className="hidden w-60 shrink-0 flex-col border-r p-5 md:flex" style={{ borderColor: t.line, background: t.panel }}>
        <p className="flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border-2" style={{ borderColor: t.accent }}>
            <span className="size-2.5 rounded-full" style={{ background: t.accent }} />
          </span>
          Orbit
        </p>
        <nav className="mt-10 space-y-1">
          {NAV.map(({ icon: Icon, label }) => (
            <button key={label} type="button" onClick={() => setActive(label)} className="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm" style={{ color: active === label ? t.fg : t.muted }}>
              {active === label && <motion.span layoutId="orbit-nav" className="absolute inset-0 rounded-xl" style={{ background: t.track }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <Icon className="relative size-4" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl p-4 text-sm" style={{ background: t.track }}>
          <p className="font-medium">Pro plan</p>
          <p className="mt-1 text-xs" style={{ color: t.muted }}>8 of 10 seats used</p>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: t.line }}>
            <div className="h-full w-4/5 rounded-full" style={{ background: t.accent }} />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-4 md:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <AnimatePresence mode="wait">
              <motion.h2 key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-2xl font-semibold tracking-[-0.03em]">
                {active}
              </motion.h2>
            </AnimatePresence>
            <p className="text-sm" style={{ color: t.muted }}>Welcome back, Priya.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="hidden h-10 items-center gap-2 rounded-xl border px-3 text-sm lg:flex" style={{ borderColor: t.line, background: t.panel, color: t.muted }}>
              <Search className="size-4" />
              <input placeholder="Search…" aria-label="Search" className="w-36 bg-transparent outline-none" style={{ color: t.fg }} />
            </label>
            <div role="radiogroup" aria-label="Date range" className="flex rounded-xl border p-1" style={{ borderColor: t.line, background: t.panel }}>
              {Object.keys(RANGES).map((r) => (
                <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => setRange(r)} className="relative rounded-lg px-3 py-1.5 text-xs font-medium" style={{ color: range === r ? t.fg : t.muted }}>
                  {range === r && <motion.span layoutId="orbit-range" className="absolute inset-0 rounded-lg" style={{ background: t.track }} />}
                  <span className="relative">{r}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
              aria-label={`Switch dashboard to ${mode === "dark" ? "light" : "dark"} mode`}
              className="grid size-10 place-items-center overflow-hidden rounded-xl border"
              style={{ borderColor: t.line, background: t.panel }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mode} initial={{ y: 20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -20, rotate: 90, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                  {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <span className="grid size-10 place-items-center rounded-xl text-sm font-semibold text-white" style={{ background: t.accent }}>P</span>
          </div>
        </header>

        {/* Mobile: the sidebar collapses into a scrollable tab row. */}
        <nav className="-mx-4 mt-4 flex gap-1 overflow-x-auto px-4 md:hidden [scrollbar-width:none]">
          {NAV.map(({ label }) => (
            <button key={label} type="button" onClick={() => setActive(label)} className="shrink-0 rounded-full px-3 py-1.5 text-sm" style={active === label ? { background: t.track, color: t.fg } : { color: t.muted }}>
              {label}
            </button>
          ))}
        </nav>

        <div key={range} className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          {data.kpis.map((k, i) => <Kpi key={k.label} t={t} kpi={k} i={i} />)}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <RevenueChart t={t} data={data.revenue} range={range} />
          <WeekdayBars t={t} data={data.weekday} range={range} />
          <RecentOrders t={t} />
          <Channels t={t} data={data.channels} />
        </div>
      </div>
    </div>
  );
}
