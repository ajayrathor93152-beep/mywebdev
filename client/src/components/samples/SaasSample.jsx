import { ArrowRight, BarChart3, Bell, Bot, Check, Mail, Plug, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";

// Pipeline — a fictional sales-CRM startup. Palette: midnight, white, signal blue.
const C = { night: "#0b1220", night2: "#121b2e", fg: "#0b1220", muted: "#5b6577", blue: "#5b8cff", line: "rgb(11 18 32 / 0.08)" };

const ROTATING = ["faster", "smarter", "on autopilot"];
const LOGOS = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"];

const STAGES = ["Lead", "Demo", "Proposal", "Won"];
const DEALS = [
  { id: "a", name: "Hooli", value: "₹4.2L", tone: "#5b8cff" },
  { id: "b", name: "Globex", value: "₹1.8L", tone: "#33c4a0" },
  { id: "c", name: "Initech", value: "₹6.0L", tone: "#f2a93b" },
  { id: "d", name: "Acme", value: "₹2.4L", tone: "#ef6b8a" },
];

const FEATURES = [
  { icon: Bot, title: "AI follow-ups", body: "Drafts the next email from the call notes. You just hit send." },
  { icon: BarChart3, title: "Live forecasting", body: "See this quarter’s number update every time a deal moves." },
  { icon: Bell, title: "Deal alerts", body: "Get pinged the moment a hot lead opens your proposal." },
  { icon: Plug, title: "40+ integrations", body: "Gmail, WhatsApp, Slack, Razorpay and your calendar — in two clicks." },
  { icon: ShieldCheck, title: "Bank-grade security", body: "SSO, role-based access and encryption at rest by default." },
  { icon: Zap, title: "Set up in 10 minutes", body: "Import from a spreadsheet or your old CRM. No consultants." },
];

const PLANS = [
  { name: "Starter", monthly: 0, blurb: "For solo founders", perks: ["1 pipeline", "100 contacts", "Email sync"] },
  { name: "Growth", monthly: 1499, blurb: "For small sales teams", perks: ["Unlimited pipelines", "AI follow-ups", "Forecasting", "WhatsApp"], featured: true },
  { name: "Scale", monthly: 3999, blurb: "For revenue orgs", perks: ["Everything in Growth", "SSO & audit logs", "Dedicated success manager"] },
];

/** Deals hop one column to the right every couple of seconds — a pipeline that's visibly moving. */
function PipelineMock() {
  const [positions, setPositions] = useState({ a: 0, b: 1, c: 2, d: 0 });

  useEffect(() => {
    let turn = 0;
    const timer = setInterval(() => {
      const { id } = DEALS[turn++ % DEALS.length];
      setPositions((p) => ({ ...p, [id]: (p[id] + 1) % STAGES.length }));
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div aria-hidden className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_40px_120px_-30px_rgb(91_140_255/0.45)] backdrop-blur">
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-xs text-white/40">pipeline.app / Q4 deals</span>
      </div>
      <LayoutGroup>
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((stage, col) => (
            <div key={stage} className="min-h-56 rounded-xl bg-white/[0.04] p-2">
              <p className="mb-2 flex items-center justify-between px-1 text-[11px] text-white/50">
                {stage}
                <span>{DEALS.filter((d) => positions[d.id] === col).length}</span>
              </p>
              <div className="space-y-2">
                {DEALS.filter((d) => positions[d.id] === col).map((d) => (
                  <motion.div key={d.id} layoutId={`deal-${d.id}`} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="rounded-lg bg-white/[0.08] p-2">
                    <span className="block h-1 w-6 rounded-full" style={{ background: d.tone }} />
                    <p className="mt-2 truncate text-[11px] font-medium text-white">{d.name}</p>
                    <p className="text-[10px] text-white/50">{d.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}

function EmailCapture({ dark }) {
  const [state, setState] = useState("idle");
  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex h-14 items-center gap-2 font-medium" style={{ color: dark ? "#fff" : C.fg }}>
          <span className="grid size-6 place-items-center rounded-full text-white" style={{ background: C.blue }}><Check className="size-4" /></span>
          You’re on the list — check your inbox.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -8 }}
          onSubmit={(e) => {
            e.preventDefault();
            setState("done");
          }}
          className="flex w-full max-w-md items-center gap-2 rounded-full border p-1.5 pl-5"
          style={{ borderColor: dark ? "rgb(255 255 255 / 0.15)" : C.line, background: dark ? "rgb(255 255 255 / 0.05)" : "#fff" }}
        >
          <Mail className="size-4 shrink-0" style={{ color: dark ? "rgb(255 255 255 / 0.5)" : C.muted }} />
          <input type="email" required placeholder="you@company.com" aria-label="Work email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" style={{ color: dark ? "#fff" : C.fg }} />
          <motion.button whileTap={{ scale: 0.96 }} type="submit" className="flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white" style={{ background: C.blue }}>
            Start free <ArrowRight className="size-4" />
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  const [word, setWord] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % ROTATING.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-6 text-white md:px-12" style={{ background: C.night }}>
      <div aria-hidden className="absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]" style={{ background: `radial-gradient(${C.blue}, transparent 70%)` }} />
      <nav className="relative flex items-center justify-between py-4">
        <span className="flex items-center gap-2 font-semibold"><span className="grid size-7 place-items-center rounded-lg" style={{ background: C.blue }}><Sparkles className="size-4" /></span>Pipeline</span>
        <ul className="hidden gap-7 text-sm text-white/60 md:flex"><li>Product</li><li>Pricing</li><li>Customers</li><li>Docs</li></ul>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold" style={{ color: C.fg }}>Sign in</span>
      </nav>

      <div className="relative mx-auto mt-14 max-w-3xl text-center">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
          <span className="rounded-full px-2 py-0.5 font-semibold" style={{ background: C.blue }}>New</span> AI follow-ups are here <ArrowRight className="size-3" />
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.25 }} className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
          Close deals{" "}
          <span className="relative inline-grid overflow-hidden align-bottom">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={ROTATING[word]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, #9fd3ff)` }}
              >
                {ROTATING[word]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />without the spreadsheet.
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Pipeline is the CRM small sales teams actually use — tracks every deal, writes your follow-ups and tells you what to do next.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease }} className="mt-9 flex flex-col items-center gap-3">
          <EmailCapture dark />
          <p className="text-xs text-white/40">Free for 14 days · No credit card</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.7 }} className="relative mx-auto mt-16 max-w-4xl">
        <PipelineMock />
      </motion.div>

      <div className="relative mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-white/30">
        <span className="w-full text-center text-xs font-normal text-white/40">Trusted by 2,400+ sales teams</span>
        {LOGOS.map((l) => <span key={l}>{l}</span>)}
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    ["3.2×", "more follow-ups sent on time"],
    ["11 hrs", "saved per rep, every week"],
    ["27%", "higher win rate in 90 days"],
  ];
  return (
    <section className="grid gap-px border-b md:grid-cols-3" style={{ borderColor: C.line, background: C.line }}>
      {items.map(([n, l], i) => (
        <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: i * 0.1 }} className="bg-white px-8 py-12 text-center">
          <p className="text-5xl font-semibold tracking-[-0.04em]" style={{ color: C.blue }}>{n}</p>
          <p className="mt-2" style={{ color: C.muted }}>{l}</p>
        </motion.div>
      ))}
    </section>
  );
}

function FeatureCard({ f, i }) {
  // Spotlight follows the cursor via CSS variables — no re-renders.
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.article
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border bg-white p-7"
      style={{ borderColor: C.line }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), rgb(91 140 255 / 0.14), transparent 70%)` }} />
      <span className="relative grid size-11 place-items-center rounded-xl text-white" style={{ background: C.night }}>
        <f.icon className="size-5" />
      </span>
      <h4 className="relative mt-5 text-lg font-semibold">{f.title}</h4>
      <p className="relative mt-2" style={{ color: C.muted }}>{f.body}</p>
    </motion.article>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section className="px-6 py-24 md:px-12" style={{ background: "#f6f8fc" }}>
      <div className="text-center">
        <h3 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Simple pricing that scales with you</h3>
        <button type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((y) => !y)} className="mt-8 inline-flex items-center gap-3 text-sm font-medium">
          <span style={{ color: yearly ? C.muted : C.fg }}>Monthly</span>
          <span className="relative h-7 w-12 rounded-full p-1 transition-colors" style={{ background: yearly ? C.blue : "#cfd6e3" }}>
            <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="block size-5 rounded-full bg-white shadow" style={{ marginLeft: yearly ? "auto" : 0 }} />
          </span>
          <span style={{ color: yearly ? C.fg : C.muted }}>Yearly <span className="rounded-full px-2 py-0.5 text-xs text-white" style={{ background: C.blue }}>−20%</span></span>
        </button>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const price = Math.round(p.monthly * (yearly ? 0.8 : 1));
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              className="relative flex flex-col rounded-3xl border p-8"
              style={p.featured ? { background: C.night, color: "#fff", borderColor: C.night } : { background: "#fff", borderColor: C.line }}
            >
              {p.featured && <span className="absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: C.blue }}>Most popular</span>}
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm opacity-60">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-[-0.04em]">₹</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={price} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.35, ease }} className="text-4xl font-semibold tabular-nums tracking-[-0.04em]">
                    {price.toLocaleString("en-IN")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm opacity-60">/ user / mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2"><Check className="size-4" style={{ color: C.blue }} />{perk}</li>
                ))}
              </ul>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="button" className="mt-8 h-12 rounded-full text-sm font-semibold" style={p.featured ? { background: C.blue, color: "#fff" } : { background: C.night, color: "#fff" }}>
                {p.monthly ? "Start free trial" : "Get started"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default function SaasSample() {
  return (
    <div className="bg-white" style={{ color: C.fg }}>
      <Hero />
      <ValueProps />
      <section className="px-6 py-24 md:px-12">
        <p className="text-center text-sm font-semibold" style={{ color: C.blue }}>Everything in one place</p>
        <h3 className="mx-auto mt-3 max-w-2xl text-center text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Built for teams who’d rather sell than update a CRM</h3>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </section>
      <Pricing />
      <section className="px-6 py-20 text-center text-white md:px-12" style={{ background: C.night }}>
        <h3 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Your next quarter starts today.</h3>
        <div className="mt-8 flex justify-center"><EmailCapture dark /></div>
      </section>
    </div>
  );
}
