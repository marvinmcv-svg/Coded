import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { SplitWords } from "@/components/motion/SplitWords";
import { photo, type BuiltImage } from "@/content/media";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

type Props = { eyebrow: string; title: string; intro: string; image?: BuiltImage; calm?: boolean; children?: ReactNode };

/**
 * Inner-page hero (same pattern as the program pages): CSS intro (globals.css .intro-*) so the h1 and photo paint
 * without JS; one plain h1 text block on phones (LCP). `calm` (safety): fades only, no word rise or mask wipe.
 */
export async function PageHero({ eyebrow, title, intro, image, calm = false, children }: Props) {
  const tm = await getTranslations("media");
  const img = image ? photo(image) : null;
  const fade = calm ? "intro-calm" : "intro-fade";
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_45%_at_80%_20%,rgb(118_0_231/.45),transparent),radial-gradient(35%_35%_at_5%_90%,rgb(206_54_223/.2),transparent)]" />
      <div className={`mx-auto grid max-w-7xl items-end gap-12 px-6 pt-12 pb-16 md:pt-20 ${image ? "md:grid-cols-[1.1fr_0.9fr]" : ""}`}>
        <div className="flex flex-col gap-7">
          <p className={`${fade} flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase`}>
            <span aria-hidden className="h-px w-8 bg-accent-soft" />
            {eyebrow}
          </p>
          {calm ? (
            <h1 className="max-w-4xl font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] font-semibold tracking-tight">{title}</h1>
          ) : (
            <h1 aria-label={title} className="intro-words max-w-4xl font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] font-semibold tracking-tight">
              <span aria-hidden className="md:hidden">{title}</span>
              <span aria-hidden className="hidden md:inline"><SplitWords text={title} /></span>
            </h1>
          )}
          <p className={`${fade} max-w-xl text-lg text-mist md:text-xl`} style={d(450)}>{intro}</p>
          {children ? <div className={`${fade} flex flex-wrap items-center gap-4`} style={d(600)}>{children}</div> : null}
        </div>
        {image && img ? (
          <div className={`${calm ? "intro-calm" : "intro-mask"} relative hidden aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] shadow-[0_40px_120px_-30px_rgb(118_0_231/.6)] md:block`} data-cursor="">
            {/* md+ only. Phones fetch nothing (1×1 inline source) so the h1 stays the LCP element (CLAUDE.md). */}
            <picture>
              <source media="(max-width: 767px)" srcSet={BLANK} />
              <img {...img} sizes="40vw" alt={tm(image)} fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
            </picture>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
