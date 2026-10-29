import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import CtaBand from "@/components/home/CtaBand";
import ServiceVisual from "@/components/services/ServiceVisual";
import PageIntro from "@/components/ui/PageIntro";
import { samples } from "@/config/samples";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const MotionLink = motion.create(Link);

// Bento layout on large screens: two wide cards on top, three below. The odd fifth card goes full width on tablets.
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "md:col-span-2 lg:col-span-2"];

function SampleCard({ sample, index }) {
  return (
    <MotionLink
      to={`/work/${sample.key}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-4 transition-shadow duration-500",
        "hover:shadow-[0_40px_80px_-40px_rgb(0_0_0/0.45)]",
        spans[index]
      )}
    >
      <div className="relative">
        <ServiceVisual kind={sample.key} />
        <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 font-mono text-[11px] text-muted backdrop-blur">
          0{index + 1}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{sample.kind}</p>
          <span className="flex gap-1" aria-hidden>
            {sample.swatch.map((c) => (
              <span key={c} className="size-3 rounded-full ring-1 ring-line" style={{ background: c }} />
            ))}
          </span>
        </div>
        <h2 className="mt-3 text-balance text-2xl font-medium leading-tight tracking-[-0.035em] md:text-[1.75rem]">
          {sample.title}
        </h2>
        <p className="mt-3 text-muted">{sample.blurb}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <ul className="flex flex-wrap gap-1.5">
            {sample.features.map((f) => (
              <li key={f} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                {f}
              </li>
            ))}
          </ul>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-bg transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-volt group-hover:text-ink">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
      <span className="sr-only">Open the {sample.brand} sample</span>
    </MotionLink>
  );
}

export default function Work() {
  return (
    <>
      <PageIntro
        eyebrow="Work & samples"
        title={
          <>
            Don&apos;t imagine it. <em className="font-serif font-normal italic text-volt-ink">Click it.</em>
          </>
        }
      >
        <p>
          Five live samples, one for each thing we build. Every one is a working page — filter the
          store, book the café, flip the dashboard into dark mode.
        </p>
      </PageIntro>

      <section aria-label="Samples by service" className="shell grid gap-5 pb-32 md:grid-cols-2 lg:grid-cols-6">
        {samples.map((sample, i) => (
          <SampleCard key={sample.key} sample={sample} index={i} />
        ))}
      </section>

      <CtaBand />
    </>
  );
}
