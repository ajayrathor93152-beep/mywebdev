import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { faqs } from "@/config/services";
import { cn } from "@/lib/cn";
import { ease, fadeUp, inView, stagger } from "@/lib/motion";

function FaqItem({ q, a, open, onToggle }) {
  const id = useId();
  return (
    <motion.li variants={fadeUp} className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-[-0.02em] md:text-xl"
        >
          {q}
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo",
              open ? "rotate-45 border-volt bg-volt text-ink" : "group-hover:border-fg/40"
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="shell grid gap-12 pb-28 md:grid-cols-12 md:pb-36">
      <motion.div {...inView} variants={stagger(0.1)} className="md:col-span-4">
        <motion.p variants={fadeUp} className="eyebrow mb-6">
          FAQ
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.045em]"
        >
          Good <em className="font-serif font-normal italic text-volt-ink">questions.</em>
        </motion.h2>
      </motion.div>

      <motion.ul {...inView} variants={stagger(0.06)} className="border-t border-line md:col-span-8">
        {faqs.map((f, i) => (
          <FaqItem
            key={f.q}
            {...f}
            open={open === i}
            onToggle={() => setOpen((cur) => (cur === i ? null : i))}
          />
        ))}
      </motion.ul>
    </section>
  );
}
