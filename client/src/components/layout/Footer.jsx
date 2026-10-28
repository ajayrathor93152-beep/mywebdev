import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { site } from "@/config/site";
import { ease } from "@/lib/motion";

function LocalTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: site.timeZone,
      timeZoneName: "short",
    }).format(new Date());

  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-line">
      <div className="shell grid gap-16 pb-10 pt-20 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow mb-6">Have a project in mind?</p>
          <Link
            to="/contact"
            className="group inline-flex items-end gap-4 text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.045em]"
          >
            <span>
              Let&apos;s build it <em className="font-serif font-normal italic text-volt-ink">together</em>
            </span>
            <span className="mb-1 grid size-12 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45 md:size-16">
              <ArrowUpRight className="size-6" />
            </span>
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block text-lg text-muted underline decoration-line underline-offset-8 transition-colors hover:text-fg hover:decoration-ember"
          >
            {site.email}
          </a>
        </div>

        <nav className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3" aria-label="Footer">
          <div>
            <p className="eyebrow mb-4">Sitemap</p>
            <ul className="space-y-2.5">
              {site.nav.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-fg/80 transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Social</p>
            <ul className="space-y-2.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg/80 transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-4">Studio</p>
            <p className="text-fg/80">{site.location}</p>
            <p className="mt-2 text-muted">
              Local time <LocalTime />
            </p>
            <div className="mt-6 flex items-center gap-3">
              <ThemeToggle />
              <span className="text-sm text-muted">Theme</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Oversized wordmark that rises into view */}
      <div className="shell overflow-hidden" aria-hidden>
        <motion.p
          initial={{ y: "60%" }}
          whileInView={{ y: "18%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="select-none text-center text-[22vw] font-semibold leading-[0.8] tracking-[-0.07em] text-fg/[0.06]"
        >
          {site.name.toLowerCase()}
        </motion.p>
      </div>

      <div className="shell flex flex-col justify-between gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.legalName}. Designed &amp; built in-house.
        </p>
        <p>No templates were harmed in the making of this site.</p>
      </div>
    </footer>
  );
}
