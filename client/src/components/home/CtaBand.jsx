import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { ease, fadeUp, inView, stagger } from "@/lib/motion";

// Decorative shapes that bob around the banner.
const SHAPES = [
  { className: "left-[6%] top-[14%] size-14 rounded-2xl border-[3px] border-ink/70", rotate: 25, delay: 0 },
  { className: "right-[8%] top-[18%] size-20 rounded-full border-[3px] border-ink/60", rotate: 0, delay: 1.2 },
  { className: "bottom-[14%] right-[22%] size-10 rotate-45 bg-ink/80", rotate: 45, delay: 0.6 },
  { className: "bottom-[18%] left-[16%] size-6 rounded-full bg-ink", rotate: 0, delay: 1.8 },
];

export default function CtaBand() {
  return (
    <section className="shell py-12">
      <motion.div
        {...inView}
        variants={stagger(0.1)}
        className="relative isolate overflow-hidden rounded-[36px] px-6 py-20 text-center text-ink md:px-16 md:py-28"
      >
        {/* Slowly panning neon gradient */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 animate-gradient bg-[linear-gradient(115deg,#ffd60a_0%,#ffd60a_25%,#a855f7_55%,#22d3ee_80%,#ffd60a_100%)] bg-[length:250%_100%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.25),transparent_70%)]" />

        {SHAPES.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={`absolute -z-10 hidden md:block ${s.className}`}
            animate={{ y: [0, -16, 0], rotate: [s.rotate, s.rotate + 20, s.rotate] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          />
        ))}

        <motion.p variants={fadeUp} className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-ink/70">
          Free consultation · Fixed-price quote
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto max-w-4xl text-balance text-[clamp(2.25rem,6vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
        >
          Ready to build something people can&apos;t stop clicking?
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg text-ink/75">
          Tell us about your project — you&apos;ll get honest advice and a clear quote within one business day.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-3">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease }}>
            <Link
              to="/contact"
              className="group inline-flex h-14 items-center gap-4 rounded-full bg-ink pl-7 pr-2 font-medium text-paper shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)]"
            >
              Start your project
              <span className="grid size-10 place-items-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease }}>
            <Link
              to="/work"
              className="inline-flex h-14 items-center rounded-full border-2 border-ink/80 px-7 font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              View our work
            </Link>
          </motion.div>
          <motion.a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Chat on WhatsApp"
            className="grid size-14 place-items-center rounded-full border-2 border-ink/80 transition-colors hover:bg-ink hover:text-paper"
          >
            <MessageCircle className="size-5" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
