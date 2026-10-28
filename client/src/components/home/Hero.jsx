import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { ease } from "@/lib/motion";

// Each line is a list of words; `serif` words get the editorial italic treatment.
const HEADLINE = [
  [{ t: "Websites" }, { t: "that" }],
  [{ t: "earn", serif: true }, { t: "their" }, { t: "keep." }],
];

const AUDIENCES = ["cafés", "startups", "online stores", "restaurants", "founders"];

// Process promises, not vanity metrics — swap in real numbers as you collect them.
const PROOF = [
  { value: "100", label: "Lighthouse target on every build" },
  { value: "<1s", label: "Largest contentful paint goal" },
  { value: "0", label: "Templates. Ever." },
  { value: "1:1", label: "Direct line to the developer" },
];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % AUDIENCES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={AUDIENCES[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-block whitespace-nowrap font-medium text-fg"
        >
          {AUDIENCES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div className="animate-drift absolute -right-[10%] top-[8%] size-[42rem] rounded-full bg-volt opacity-[0.22] blur-[120px] dark:opacity-[0.14]" />
      <div className="animate-drift-slow absolute -left-[12%] top-[38%] size-[34rem] rounded-full bg-ember opacity-[0.16] blur-[130px] dark:opacity-[0.12]" />
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  let wordIndex = 0;

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center pb-20 pt-36">
      <Backdrop />

      <motion.div style={{ y, opacity }} className="shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="glass mb-10 inline-flex items-center gap-2.5 rounded-full border border-line py-1.5 pl-2 pr-4 text-sm"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-75" />
            <span className="relative size-2.5 rounded-full bg-volt ring-2 ring-ink/10" />
          </span>
          <span className="text-muted">Now booking projects for</span>
          <span className="font-medium">Q1 2027</span>
        </motion.div>

        <h1 className="text-[clamp(3rem,10.5vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.055em]">
          {HEADLINE.map((line, li) => (
            <span key={li} className="block">
              {line.map((word) => {
                const delay = 0.2 + wordIndex++ * 0.08;
                return (
                  <span key={word.t} className="mr-[0.22em] inline-flex overflow-hidden pb-[0.08em] last:mr-0">
                    <motion.span
                      initial={{ y: "110%", rotate: 4 }}
                      animate={{ y: "0%", rotate: 0 }}
                      transition={{ duration: 1.1, ease, delay }}
                      className={
                        word.serif
                          ? "inline-block pr-[0.04em] font-serif font-normal italic tracking-[-0.02em] text-volt-ink"
                          : "inline-block"
                      }
                    >
                      {word.t}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="mt-12 grid items-end gap-10 md:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.75 }}
            className="max-w-xl text-lg leading-relaxed text-muted md:col-span-7 md:text-xl"
          >
            Custom-built digital identities for <RotatingWord /> — designed from a blank canvas,
            engineered to load in under a second, and built to turn visitors into customers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="flex flex-wrap gap-3 md:col-span-5 md:justify-end"
          >
            <Button to="/work" size="lg">
              Explore our work
            </Button>
            <Button to="/contact" size="lg" variant="ghost">
              Get a quote
            </Button>
          </motion.div>
        </div>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.05 } } }}
          className="mt-20 grid grid-cols-2 border-t border-line md:grid-cols-4"
        >
          {PROOF.map((item) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
              }}
              className="border-line pt-6 pr-6 [&:not(:last-child)]:md:border-r md:pl-6 md:first:pl-0"
            >
              <dt className="sr-only">{item.label}</dt>
              <dd className="text-4xl font-medium tracking-[-0.04em] md:text-5xl">{item.value}</dd>
              <dd className="mt-2 text-sm text-muted">{item.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
