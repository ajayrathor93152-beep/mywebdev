const ITEMS = [
  "Custom websites",
  "E-commerce",
  "Smart QR menus",
  "SaaS MVPs",
  "Dashboards",
  "UI/UX design",
  "Payment integrations",
  "Brand identity",
];

function Row() {
  return ITEMS.map((item) => (
    <span key={item} className="flex shrink-0 items-center gap-8 pr-8">
      <span>{item}</span>
      <svg viewBox="0 0 24 24" className="size-5 text-violet" aria-hidden>
        <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
      </svg>
    </span>
  ));
}

export default function Marquee() {
  return (
    <section
      aria-label="What we build"
      className="group relative -rotate-1 overflow-hidden border-y border-ink bg-volt py-5 text-ink"
    >
      <div className="flex w-max animate-marquee text-2xl font-medium tracking-[-0.03em] group-hover:[animation-play-state:paused] md:text-4xl">
        <Row />
        <div aria-hidden className="flex">
          <Row />
        </div>
      </div>
    </section>
  );
}
