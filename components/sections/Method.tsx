import { getTranslations } from "next-intl/server";
import { HorizontalPin } from "@/components/motion/HorizontalPin";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { clip, photo } from "@/content/media";
import { Link } from "@/lib/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { key: "experts", media: { kind: "photo", k: "lab" } },
  { key: "workshops", media: { kind: "clip", k: "workshop-make" } },
  { key: "projects", media: { kind: "clip", k: "workshop-class" } },
  { key: "coding", media: { kind: "clip", k: "coding-tablet" } },
] as const;

/** Full tier: pinned horizontal journey through the 4 steps, each with a live clip. Lite/static: 2-col grid. */
export async function Method() {
  const t = await getTranslations("home.method");
  const tm = await getTranslations("media");
  return (
    <section id="method" aria-labelledby="method-title" className="scroll-mt-20 py-24">
      <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading id="method-title" eyebrow={t("eyebrow")} title={t("title")} />
        <Link href="/method" className="shrink-0 font-semibold underline underline-offset-4" data-cursor="">{t("more")} →</Link>
      </div>
      <HorizontalPin>
        {steps.map((s, i) => (
          <article key={s.key} className="relative grid shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-ink-2 md:w-[min(78vw,1100px)] md:grid-cols-[1fr_0.8fr]">
            <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
              <span aria-hidden className="text-outline font-display text-[clamp(5rem,12vw,10rem)] leading-none font-semibold">0{i + 1}</span>
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-3xl font-semibold md:text-5xl">{t(`steps.${s.key}.title`)}</h3>
                <p className="max-w-md text-lg text-mist">{t(`steps.${s.key}.body`)}</p>
                <div aria-hidden className="mt-4 h-1 w-full overflow-hidden rounded-full bg-mist/15">
                  <div className="h-full rounded-full bg-accent-soft" style={{ width: `${(i + 1) * 25}%` }} />
                </div>
              </div>
            </div>
            {s.media.kind === "clip" ? (
              <VideoLoop {...clip(s.media.k)} className="aspect-[3/4] md:aspect-auto md:h-[min(72svh,720px)]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp (content/media.ts)
              <img {...photo(s.media.k)} sizes="(min-width: 768px) 34vw, 100vw" alt={tm(s.media.k)} loading="lazy" decoding="async" className="aspect-[3/4] size-full object-cover md:aspect-auto md:h-[min(72svh,720px)]" />
            )}
          </article>
        ))}
      </HorizontalPin>
    </section>
  );
}
