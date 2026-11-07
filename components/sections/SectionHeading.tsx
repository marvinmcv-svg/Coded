export function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-sm tracking-wide text-mist uppercase">{eyebrow}</p>
      <h2 id={id} className="max-w-3xl font-display text-3xl leading-tight font-semibold md:text-5xl">{title}</h2>
    </div>
  );
}
