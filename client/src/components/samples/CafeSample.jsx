import { CalendarCheck, Clock, Flame, Leaf, MapPin, Minus, Plus, Wheat } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { scrollToId } from "@/hooks/useSmoothScroll";
import { ease } from "@/lib/motion";
import { Placeholder } from "./shared";

// Ember & Oak — a fictional all-day café & wood-fire kitchen. Palette: espresso, cream, amber.
const C = { bg: "#1f140e", panel: "#2a1c14", fg: "#f3e6d3", muted: "#b8a58e", amber: "#e0913a", line: "rgb(243 230 211 / 0.12)" };

const TAGS = {
  V: { icon: Leaf, label: "Vegetarian" },
  GF: { icon: Wheat, label: "Gluten-free" },
  HOT: { icon: Flame, label: "Spicy" },
};

const MENU = {
  Coffee: [
    { name: "Single-origin pour over", desc: "Chikmagalur estate, rotating roast", price: 240, tags: ["V"] },
    { name: "Cortado", desc: "Double ristretto, equal steamed milk", price: 190, tags: ["V"] },
    { name: "Iced jaggery latte", desc: "House jaggery syrup, oat milk", price: 260, tags: ["V", "GF"] },
    { name: "Cold brew tonic", desc: "18-hour cold brew, citrus, tonic", price: 280, tags: ["V", "GF"] },
  ],
  Brunch: [
    { name: "Wood-fired shakshuka", desc: "Smoked tomato, eggs, feta, sourdough", price: 420, tags: ["V"] },
    { name: "Masala croissant toastie", desc: "Spiced potato, cheddar, green chutney", price: 360, tags: ["V", "HOT"] },
    { name: "Ricotta hotcakes", desc: "Burnt honey, berries, mascarpone", price: 390, tags: ["V"] },
  ],
  Dinner: [
    { name: "Ember-roasted chicken", desc: "Half bird, chimichurri, charred lemon", price: 690, tags: ["GF", "HOT"] },
    { name: "Wild mushroom risotto", desc: "Arborio, porcini, aged parmesan", price: 590, tags: ["V", "GF"] },
    { name: "Coal-baked flatbread", desc: "Nduja, hot honey, stracciatella", price: 520, tags: ["HOT"] },
    { name: "Grilled river fish", desc: "Kokum butter, curry leaf, greens", price: 740, tags: ["GF"] },
  ],
  Desserts: [
    { name: "Basque cheesecake", desc: "Burnt top, salted caramel", price: 340, tags: ["V", "GF"] },
    { name: "Filter coffee tiramisu", desc: "Decoction-soaked sponge, cocoa", price: 320, tags: ["V"] },
  ],
};

const SPECIALS = [
  { name: "Smoked butter prawns", note: "Chef's pick", price: 780, tones: ["#e0913a", "#5a2a14"] },
  { name: "Burrata & stone fruit", note: "Seasonal", price: 560, tones: ["#f3d9b0", "#a3532c"] },
  { name: "Saffron crème brûlée", note: "Weekend only", price: 360, tones: ["#f2c46b", "#6b3a16"] },
];

const SLOTS = ["12:30", "1:30", "7:00", "8:00", "9:00", "10:00"];

// YYYY-MM-DD in the visitor's own timezone (toISOString alone would use UTC).
const localToday = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function Steam() {
  return (
    <svg viewBox="0 0 60 80" className="absolute -top-16 left-1/2 h-20 w-16 -translate-x-1/2" aria-hidden>
      {[10, 30, 50].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 78 C${x - 8} 60 ${x + 8} 45 ${x} 28 S${x - 6} 8 ${x} 2`}
          fill="none"
          stroke={C.fg}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.5, 0], y: [0, -8, -16] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

function OpenBadge() {
  const text = "OPEN DAILY · 8AM — 11PM · WOOD-FIRE KITCHEN · ";
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="size-28 md:size-32"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      aria-label="Open daily, 8am to 11pm"
    >
      <defs>
        <path id="badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
      </defs>
      <circle cx="50" cy="50" r="49" fill={C.amber} />
      <text fontSize="8.2" letterSpacing="1.6" fill={C.bg} fontFamily="Geist Mono, monospace">
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </motion.svg>
  );
}

function Hero() {
  return (
    <section className="relative grid gap-10 px-6 pb-20 pt-8 md:grid-cols-12 md:px-12">
      <div className="md:col-span-7">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm" style={{ color: C.amber }}>
          Café · Bakery · Wood-fire kitchen — Bandra West
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
          className="mt-5 font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-[-0.02em]"
        >
          Slow coffee. <br />
          <em style={{ color: C.amber }}>Open fire.</em> <br />
          Long tables.
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.5 }} className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={() => scrollToId("ember-reserve")} className="rounded-full px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-105" style={{ background: C.amber, color: C.bg }}>
            Reserve a table
          </button>
          <button type="button" onClick={() => scrollToId("ember-menu")} className="rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5" style={{ borderColor: C.line }}>
            See the menu
          </button>
        </motion.div>
      </div>
      <div className="relative md:col-span-5">
        <motion.div initial={{ opacity: 0, scale: 0.92, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease, delay: 0.3 }}>
          <Placeholder from="#e0913a" via="#3a2418" to="#7a3b1c" label="Latte art on a walnut table" className="aspect-[4/5] rounded-[2rem]">
            <div className="absolute left-1/2 top-[58%] size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#f3e6d3] bg-[radial-gradient(circle,#c98a52_0%,#7a4320_70%)] shadow-2xl">
              <Steam />
            </div>
          </Placeholder>
        </motion.div>
        <div className="absolute -bottom-8 -left-4 md:-left-10"><OpenBadge /></div>
      </div>
    </section>
  );
}

function Specials() {
  return (
    <section className="px-6 py-20 md:px-12" style={{ background: C.panel }}>
      <h3 className="font-serif text-4xl md:text-5xl">This week’s <em style={{ color: C.amber }}>specials</em></h3>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {SPECIALS.map((s, i) => (
          <motion.article
            key={s.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease, delay: i * 0.1 }}
            whileHover={{ y: -8, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }}
            className="overflow-hidden rounded-3xl"
            style={{ background: C.bg }}
          >
            <Placeholder from={s.tones[0]} via="#3a2418" to={s.tones[1]} label={s.name} className="aspect-[4/3]">
              <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: C.fg, color: C.bg }}>{s.note}</span>
            </Placeholder>
            <div className="flex items-center justify-between p-5">
              <p className="font-serif text-2xl">{s.name}</p>
              <span style={{ color: C.amber }}>₹{s.price}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Menu() {
  const tabs = Object.keys(MENU);
  const [tab, setTab] = useState(tabs[0]);

  return (
    <section id="ember-menu" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-center font-serif text-5xl md:text-6xl">The <em style={{ color: C.amber }}>menu</em></h3>
        <div className="mt-10 flex justify-center">
          <div role="tablist" className="flex flex-wrap justify-center gap-1 rounded-full border p-1" style={{ borderColor: C.line }}>
            {tabs.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative rounded-full px-5 py-2 text-sm" style={{ color: tab === t ? C.bg : C.fg }}>
                {tab === t && <motion.span layoutId="ember-tab" className="absolute inset-0 rounded-full" style={{ background: C.amber }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative font-medium">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            role="tabpanel"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-12 space-y-7"
          >
            {MENU[tab].map((item) => (
              <motion.li key={item.name} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl">{item.name}</span>
                  <span aria-hidden className="flex-1 border-b border-dotted" style={{ borderColor: C.muted }} />
                  <span className="tabular-nums" style={{ color: C.amber }}>₹{item.price}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm" style={{ color: C.muted }}>
                  {item.desc}
                  {item.tags.map((t) => {
                    const { icon: Icon, label } = TAGS[t];
                    return (
                      <span key={t} title={label} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: C.line }}>
                        <Icon className="size-3" /> {label}
                      </span>
                    );
                  })}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Reservation() {
  const [guests, setGuests] = useState(2);
  const [slot, setSlot] = useState("8:00");
  const [date, setDate] = useState(localToday);
  const [booked, setBooked] = useState(false);

  const pretty = new Date(`${date}T00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="ember-reserve" className="grid gap-10 px-6 py-24 md:grid-cols-2 md:px-12" style={{ background: C.panel }}>
      <div>
        <h3 className="font-serif text-5xl leading-none md:text-6xl">Save us a <em style={{ color: C.amber }}>seat</em></h3>
        <ul className="mt-10 space-y-4" style={{ color: C.muted }}>
          <li className="flex items-center gap-3"><Clock className="size-4" style={{ color: C.amber }} /> Mon–Sun · 8am – 11pm (kitchen till 10:30)</li>
          <li className="flex items-center gap-3"><MapPin className="size-4" style={{ color: C.amber }} /> 14 Chapel Road, Bandra West, Mumbai</li>
        </ul>
      </div>

      <div className="relative min-h-[26rem] rounded-3xl p-6 md:p-8" style={{ background: C.bg }}>
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="grid h-full place-items-center text-center">
              <div>
                <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} className="mx-auto grid size-16 place-items-center rounded-full" style={{ background: C.amber, color: C.bg }}>
                  <CalendarCheck className="size-7" />
                </motion.span>
                <p className="mt-6 font-serif text-3xl">See you soon!</p>
                <p className="mt-2" style={{ color: C.muted }}>
                  Table for {guests} · {pretty} · {slot} pm
                </p>
                <button type="button" onClick={() => setBooked(false)} className="mt-6 text-sm underline underline-offset-4" style={{ color: C.amber }}>
                  Make another booking
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={(e) => {
                e.preventDefault();
                setBooked(true);
              }}
              className="space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm" style={{ color: C.muted }}>
                  Date
                  <input
                    type="date"
                    required
                    value={date}
                    min={localToday()}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 block h-12 w-full rounded-xl border bg-transparent px-4 [color-scheme:dark]"
                    style={{ borderColor: C.line, color: C.fg }}
                  />
                </label>
                <div className="text-sm" style={{ color: C.muted }}>
                  Guests
                  <div className="mt-2 flex h-12 items-center justify-between rounded-xl border px-2" style={{ borderColor: C.line, color: C.fg }}>
                    <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid size-8 place-items-center rounded-lg hover:bg-white/5"><Minus className="size-4" /></button>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={guests} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="text-lg tabular-nums">{guests}</motion.span>
                    </AnimatePresence>
                    <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="grid size-8 place-items-center rounded-lg hover:bg-white/5"><Plus className="size-4" /></button>
                  </div>
                </div>
              </div>
              <fieldset>
                <legend className="text-sm" style={{ color: C.muted }}>Time (pm)</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {SLOTS.map((s) => (
                    <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className="h-11 rounded-xl border text-sm transition-colors" style={slot === s ? { background: C.amber, color: C.bg, borderColor: C.amber } : { borderColor: C.line }}>
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm" style={{ color: C.muted }}>
                Name
                <input required placeholder="Your name" className="mt-2 block h-12 w-full rounded-xl border bg-transparent px-4 placeholder:text-[#b8a58e]/50" style={{ borderColor: C.line, color: C.fg }} />
              </label>
              <motion.button whileTap={{ scale: 0.98 }} type="submit" className="h-12 w-full rounded-full font-semibold" style={{ background: C.amber, color: C.bg }}>
                Confirm reservation
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function CafeSample() {
  return (
    <div style={{ background: C.bg, color: C.fg }}>
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <span className="font-serif text-2xl">Ember <em style={{ color: C.amber }}>&amp;</em> Oak</span>
        <ul className="hidden gap-8 text-sm md:flex" style={{ color: C.muted }}>
          <li><button type="button" onClick={() => scrollToId("ember-menu")} className="hover:text-[#f3e6d3]">Menu</button></li>
          <li>Story</li><li>Events</li>
          <li><button type="button" onClick={() => scrollToId("ember-reserve")} className="hover:text-[#f3e6d3]">Reserve</button></li>
        </ul>
      </nav>
      <Hero />
      <Specials />
      <Menu />
      <Reservation />
    </div>
  );
}
