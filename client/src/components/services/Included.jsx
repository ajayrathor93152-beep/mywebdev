import { motion } from "motion/react";
import { included } from "@/config/services";
import { fadeUp, inView, stagger } from "@/lib/motion";

export default function Included() {
  return (
    <section className="shell pb-28 md:pb-36">
      <motion.div
        {...inView}
        variants={stagger(0.05)}
        className="grid gap-10 rounded-[32px] bg-ink p-6 text-paper md:grid-cols-12 md:p-12"
      >
        <motion.div variants={fadeUp} className="md:col-span-4">
          <p className="eyebrow mb-4 !text-paper/50">Every project, no extra charge</p>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1] tracking-[-0.04em]">
            The <em className="font-serif font-normal italic text-volt">non-negotiables.</em>
          </h2>
        </motion.div>

        <ul className="grid gap-px overflow-hidden rounded-2xl bg-paper/10 sm:grid-cols-2 md:col-span-8">
          {included.map((item, i) => (
            <motion.li
              key={item}
              variants={fadeUp}
              className="group flex items-center gap-4 bg-ink p-5 transition-colors duration-300 hover:bg-paper/[0.04]"
            >
              <span className="font-mono text-xs text-paper/40 transition-colors group-hover:text-volt">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg tracking-[-0.02em]">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
