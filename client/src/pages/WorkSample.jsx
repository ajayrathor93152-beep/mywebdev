import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { getSample, samples } from "@/config/samples";
import { ease } from "@/lib/motion";
import NotFound from "@/pages/NotFound";

// Each sample is its own chunk — visiting the café never downloads the dashboard.
const SAMPLES = {
  website: lazy(() => import("@/components/samples/AgencySample")),
  ecommerce: lazy(() => import("@/components/samples/StoreSample")),
  restaurant: lazy(() => import("@/components/samples/CafeSample")),
  mvp: lazy(() => import("@/components/samples/SaasSample")),
  dashboard: lazy(() => import("@/components/samples/DashboardSample")),
};

function SampleBar({ sample, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.1 }}
      className="shell pb-6 pt-28 md:pt-32"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-surface p-3 pl-5">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/work"
            aria-label="Back to all samples"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <p className="eyebrow">
              Sample 0{index + 1} · {sample.kind}
            </p>
            <h1 className="truncate text-lg font-medium tracking-tight">{sample.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted lg:inline">
            “{sample.brand}” is a fictional brand — everything is clickable.
          </span>
          <Button to={`/contact?service=${sample.key}`} size="sm">
            Build one like this
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function NextSample({ sample }) {
  return (
    <section className="shell pt-24">
      <Link
        to={`/work/${sample.key}`}
        className="group flex flex-col gap-6 rounded-[32px] border border-line p-8 transition-colors duration-500 hover:bg-fg hover:text-bg md:flex-row md:items-end md:justify-between md:p-12"
      >
        <div>
          <p className="eyebrow mb-4 group-hover:!text-bg/60">Next sample</p>
          <p className="text-balance text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-[-0.045em]">
            {sample.title}
          </p>
        </div>
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
          <ArrowRight className="size-6" />
        </span>
      </Link>
    </section>
  );
}

export default function WorkSample() {
  const { category } = useParams();
  const sample = getSample(category);
  if (!sample) return <NotFound />;

  const index = samples.indexOf(sample);
  const Sample = SAMPLES[sample.key];
  const next = samples[(index + 1) % samples.length];

  return (
    <>
      <SampleBar sample={sample} index={index} />
      <div className="shell">
        {/* The sample is a site-within-a-site: its own colours, framed like a browser window. */}
        {/* overflow-clip (not hidden) so sticky sections inside a sample still pin to the viewport. */}
        <div className="overflow-clip rounded-[28px] border border-line shadow-[0_50px_100px_-50px_rgb(0_0_0/0.5)]">
          <Suspense fallback={<div className="min-h-[80svh] animate-pulse bg-surface-2" />}>
            <Sample />
          </Suspense>
        </div>
      </div>
      <NextSample sample={next} />
    </>
  );
}
