import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ease } from "@/lib/motion";
import { CountUp, Placeholder } from "./shared";

// Northfold & Co. — a fictional strategy & design agency. Palette: graphite, bone, brass.
const C = { bg: "#111318", panel: "#181b22", fg: "#e8e4dc", muted: "#9a968d", gold: "#c8a46a", line: "rgb(232 228 220 / 0.1)" };

const HEADLINE = ["We", "build", "brands", "that", "outlast", "the", "trend", "cycle."];
const CLIENTS = ["Halden", "Marrow", "Vessel", "Okto", "Lumen Bank", "Ferro", "Pallas", "Quill"];

const CAPABILITIES = [
  { title: "Brand strategy", body: "Positioning, naming and messaging grounded in customer research — the foundation every other decision sits on." },
  { title: "Identity & design systems", body: "Logos, type, colour and component libraries that scale from a business card to a product UI." },
  { title: "Websites & digital", body: "Editorial, high-performance websites with a CMS your marketing team will actually want to use." },
  { title: "Campaigns & content", body: "Launch films, photography direction and always-on social content built from the same system." },
];

const CASES = [
  { client: "Lumen Bank", work: "Rebrand + digital banking site", stat: "+212% sign-ups", colors: ["#c8a46a", "#20242d", "#5c4a2e"] },
  { client: "Okto Health", work: "Patient app & design system", stat: "4.8★ app rating", colors: ["#7fa39a", "#1a2224", "#2f4a45"] },
  { client: "Ferro Studio", work: "Architecture portfolio", stat: "3× time on site", colors: ["#b9805f", "#231b18", "#5a3424"] },
  { client: "Pallas", work: "SaaS brand & launch", stat: "$4M seed raised", colors: ["#9a95c7", "#1b1b26", "#3b3760"] },
];

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative grid gap-12 px-6 pb-24 pt-10 md:grid-cols-12 md:px-12 md:pb-32">
      <motion.div style={{ opacity: fade }} className="md:col-span-7">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: C.gold }}>
          Strategy · Identity · Digital — Est. 2011
        </p>
        <h2 className="text-[clamp(2.6rem,6.5vw,5.75rem)] font-light leading-[0.95] tracking-[-0.04em]">
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.3 + i * 0.06 }}
              >
                {word === "outlast" ? <em className="font-serif italic" style={{ color: C.gold }}>{word}</em> : word}
                &nbsp;
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
          className="mt-8 max-w-md text-lg"
          style={{ color: C.muted }}
        >
          An independent studio of 24 strategists, designers and engineers working with ambitious companies
          across finance, health and culture.
        </motion.p>
      </motion.div>

      <div className="relative h-[22rem] md:col-span-5 md:h-auto">
        <motion.div style={{ y: yBack }} className="absolute right-0 top-0 h-[78%] w-[72%]">
          <Placeholder from="#c8a46a" via="#1d2028" to="#3a3f4c" label="Studio interior" className="size-full rounded-2xl" />
        </motion.div>
        <motion.div style={{ y: yFront }} className="absolute bottom-0 left-0 h-[55%] w-[55%] shadow-2xl">
          <Placeholder from="#e8e4dc" via="#4a4235" to="#c8a46a" label="Brand book spread" className="size-full rounded-2xl">
            <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] text-white backdrop-blur">
              Lumen — Brand book
            </span>
          </Placeholder>
        </motion.div>
      </div>
    </section>
  );
}

function ClientMarquee() {
  return (
    <div className="overflow-hidden border-y py-6" style={{ borderColor: C.line }}>
      <div className="flex w-max animate-marquee gap-16 pr-16">
        {[...CLIENTS, ...CLIENTS].map((c, i) => (
          <span key={i} className="font-serif text-3xl italic" style={{ color: C.muted }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { value: 140, suffix: "+", label: "Brands launched" },
    { value: 13, suffix: " yrs", label: "Independent" },
    { value: 38, suffix: "", label: "Design awards" },
    { value: 96, suffix: "%", label: "Clients who return" },
  ];
  return (
    <section className="grid grid-cols-2 gap-px md:grid-cols-4" style={{ background: C.line }}>
      {stats.map((s) => (
        <div key={s.label} className="px-6 py-12 md:px-10" style={{ background: C.bg }}>
          <CountUp value={s.value} suffix={s.suffix} className="block text-5xl font-light tracking-[-0.04em] md:text-6xl" />
          <p className="mt-3 text-sm" style={{ color: C.muted }}>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function Capabilities() {
  const [open, setOpen] = useState(0);
  return (
    <section className="grid gap-12 px-6 py-24 md:grid-cols-12 md:px-12">
      <h3 className="text-3xl font-light tracking-[-0.03em] md:col-span-4 md:text-4xl">
        What we <em className="font-serif italic" style={{ color: C.gold }}>do</em>
      </h3>
      <ul className="md:col-span-8">
        {CAPABILITIES.map((cap, i) => (
          <li key={cap.title} className="border-b" style={{ borderColor: C.line }}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="flex items-baseline gap-5">
                <span className="font-mono text-xs" style={{ color: C.gold }}>0{i + 1}</span>
                <span className="text-2xl tracking-[-0.02em] md:text-3xl">{cap.title}</span>
              </span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.4, ease }}>
                <Plus className="size-5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="max-w-xl overflow-hidden pl-10 text-lg"
                  style={{ color: C.muted }}
                >
                  <span className="block pb-6">{cap.body}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CaseCard({ c, i }) {
  return (
    <article className="group w-[78vw] shrink-0 sm:w-[26rem]">
      <Placeholder from={c.colors[0]} via={c.colors[1]} to={c.colors[2]} label={`${c.client} project`} className="aspect-[4/5] rounded-2xl">
        <span className="absolute left-4 top-4 font-mono text-xs text-white/70">0{i + 1}</span>
        <span className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="size-5" />
        </span>
      </Placeholder>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h4 className="text-xl">{c.client}</h4>
          <p className="text-sm" style={{ color: C.muted }}>{c.work}</p>
        </div>
        <span className="shrink-0 font-mono text-xs" style={{ color: C.gold }}>{c.stat}</span>
      </div>
    </article>
  );
}

/** Desktop: vertical scroll drives the rail sideways while the section is pinned. Mobile: native swipe. */
function CaseRail() {
  const ref = useRef(null);
  const pinned = useMediaQuery("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  const heading = (
    <div className="mb-10 flex items-end justify-between gap-6 px-6 md:px-12">
      <h3 className="text-3xl font-light tracking-[-0.03em] md:text-4xl">
        Selected <em className="font-serif italic" style={{ color: C.gold }}>work</em>
      </h3>
      <span className="font-mono text-xs" style={{ color: C.muted }}>{pinned ? "Keep scrolling →" : "Swipe →"}</span>
    </div>
  );

  if (!pinned) {
    return (
      <section className="py-20">
        {heading}
        <div className="flex snap-x gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
          {CASES.map((c, i) => (
            <div key={c.client} className="snap-start"><CaseCard c={c} i={i} /></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {heading}
        <motion.div style={{ x }} className="flex gap-8 pl-12">
          {CASES.map((c, i) => <CaseCard key={c.client} c={c} i={i} />)}
        </motion.div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="px-6 py-24 text-center md:px-12 md:py-32">
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
        className="mx-auto max-w-3xl font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] italic leading-tight"
      >
        “Northfold didn’t just redesign our brand — they gave the whole company a sharper idea of who we are.”
        <footer className="mt-6 font-sans text-sm not-italic" style={{ color: C.muted }}>
          Aanya Mehta, CMO — Lumen Bank
        </footer>
      </motion.blockquote>
      <button
        type="button"
        className="mt-14 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium transition-transform duration-500 hover:scale-105"
        style={{ background: C.gold, color: C.bg }}
      >
        Start a conversation <ArrowUpRight className="size-4" />
      </button>
    </section>
  );
}

export default function AgencySample() {
  return (
    <div style={{ background: C.bg, color: C.fg }}>
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <span className="text-lg tracking-tight">
          Northfold <span className="font-serif italic" style={{ color: C.gold }}>&amp; Co.</span>
        </span>
        <ul className="hidden gap-8 text-sm md:flex" style={{ color: C.muted }}>
          {["Work", "Studio", "Thinking", "Careers"].map((l) => (
            <li key={l} className="cursor-pointer transition-colors hover:text-[#e8e4dc]">{l}</li>
          ))}
        </ul>
        <span className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: C.line }}>Contact</span>
      </nav>
      <Hero />
      <ClientMarquee />
      <Stats />
      <Capabilities />
      <CaseRail />
      <Closing />
    </div>
  );
}
