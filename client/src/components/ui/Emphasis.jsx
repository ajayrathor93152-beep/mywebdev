import { cn } from "@/lib/cn";

/** Renders "plain *accent* plain" with the accent word in serif italic. */
export default function Emphasis({ text, className = "text-volt-ink" }) {
  return text.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 ? (
      <em key={i} className={cn("font-serif font-normal italic tracking-[-0.01em]", className)}>
        {part}
      </em>
    ) : (
      part
    )
  );
}
