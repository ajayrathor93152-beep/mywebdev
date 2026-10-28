import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

export default function Logo({ className }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-2 text-fg", className)}
    >
      <span className="relative grid size-8 place-items-center rounded-[9px] bg-fg text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <path
            d="M8 24 16 7l8 17"
            fill="none"
            stroke="var(--volt)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="19.5" r="2.2" fill="var(--ember)" />
        </svg>
      </span>
      <span className="text-[1.15rem] font-semibold tracking-[-0.04em]">{site.name.toLowerCase()}</span>
    </Link>
  );
}
