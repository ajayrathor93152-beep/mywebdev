import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { site } from "@/config/site";
import { fadeUp, inView, stagger } from "@/lib/motion";

export default function CtaBand() {
  return (
    <section className="shell">
      <motion.div
        {...inView}
        variants={stagger(0.1)}
        className="relative isolate overflow-hidden rounded-[36px] bg-ink px-6 py-20 text-paper md:px-16 md:py-28"
      >
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 size-[28rem] rounded-full bg-volt opacity-25 blur-[100px]" />
        <div aria-hidden className="absolute -bottom-32 left-10 -z-10 size-[22rem] rounded-full bg-ember opacity-30 blur-[110px]" />

        <motion.p variants={fadeUp} className="eyebrow mb-6 !text-paper/60">
          Start a project
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="max-w-4xl text-balance text-[clamp(2.25rem,6vw,5.25rem)] font-medium leading-[0.96] tracking-[-0.045em]"
        >
          Your business deserves a website that{" "}
          <em className="font-serif font-normal italic text-volt">works as hard</em> as you do.
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-3">
          <Button to="/contact" size="lg">
            Get a free quote
          </Button>
          <Button
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            size="lg"
            variant="ghost"
            className="border-paper/20 text-paper hover:border-paper/50"
          >
            Chat on WhatsApp
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
