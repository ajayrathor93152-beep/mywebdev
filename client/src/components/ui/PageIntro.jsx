import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";

/** Shared top-of-page header for inner pages. */
export default function PageIntro({ eyebrow, title, children }) {
  return (
    <motion.header
      variants={stagger(0.1, 0.15)}
      initial="hidden"
      animate="show"
      className="shell pb-16 pt-40 md:pt-48"
    >
      <motion.p variants={fadeUp} className="eyebrow mb-6">
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="max-w-4xl text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em]"
      >
        {title}
      </motion.h1>
      {children && (
        <motion.div variants={fadeUp} className="mt-8 max-w-2xl text-lg text-muted">
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}
