import { SplitWords } from "@/components/motion/SplitWords";
import { TextReveal } from "@/components/motion/TextReveal";

/** Eyebrow + h2 whose words rise out of a mask on scroll (lite/full). The h2 keeps its real text for AT. */
export function SectionHeading({ id, eyebrow, title, className }: { id: string; eyebrow: string; title: string; className?: string }) {
  return (
    <TextReveal className={`flex flex-col gap-4 ${className ?? ""}`}>
      <p className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
        <span aria-hidden className="h-px w-8 bg-accent-soft" />
        {eyebrow}
      </p>
      <h2 id={id} className="max-w-4xl font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-tight">
        <SplitWords text={title} />
      </h2>
    </TextReveal>
  );
}
