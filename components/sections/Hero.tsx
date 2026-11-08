import { getTranslations } from "next-intl/server";
import { HeroScrub } from "@/components/motion/HeroScrub";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitWords } from "@/components/motion/SplitWords";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { buttonClass } from "@/components/ui/Button";
import { clip, photo } from "@/content/media";
import { Link } from "@/lib/i18n/navigation";
import { consultationHref } from "@/lib/links";

const letters = [
  ["S", "text-steam-s"], ["T", "text-steam-t"], ["E", "text-steam-e"], ["A", "text-steam-a"], ["M", "text-steam-m"],
] as const;

/**
 * Intro is CSS-only (globals.css .intro-*): it runs on first paint, before hydration, so LCP never waits on JS.
 * LCP element = the portrait <img>; the reel fades in over it once playing (lite/full only).
 */
export async function Hero() {
  const t = await getTranslations("home.hero");
  const tm = await getTranslations("media");
  const tt = await getTranslations("home");
  const img = photo("hero-portrait");
  const side = photo("tokyo-cap");
  const reel = clip("hero-reel");
  const places = (tt.raw("ticker") as string[]).slice(5).join(" · ");

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(55%_45%_at_78%_18%,rgb(118_0_231/.55),transparent),radial-gradient(40%_40%_at_8%_85%,rgb(206_54_223/.25),transparent),radial-gradient(35%_35%_at_55%_100%,rgb(58_159_214/.22),transparent)]" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
      <HeroScrub className="mx-auto grid min-h-[92svh] max-w-7xl items-center gap-14 px-6 pt-20 pb-28 md:grid-cols-[1.25fr_0.75fr] md:pt-16">
        <div data-hero-copy className="flex flex-col gap-8">
          <p className="intro-fade flex items-center gap-3 font-mono text-sm text-mist" style={{ "--d": "60ms" } as React.CSSProperties}>
            <span aria-hidden className="flex gap-1 font-semibold">
              {letters.map(([l, c]) => <span key={l} className={c}>{l}</span>)}
            </span>
            {t("eyebrow")}
          </p>
          <h1 className="intro-words max-w-4xl font-display text-[clamp(2.75rem,7.2vw,6.25rem)] leading-[0.98] font-semibold tracking-tight">
            {/* Phones: one plain text block = one LCP candidate (word spans would each count alone). ≥ md: split + reveal. */}
            <span className="md:hidden">{t("headline")}</span>
            <span className="hidden md:inline"><SplitWords text={t("headline")} /></span>
          </h1>
          <p className="intro-fade max-w-xl text-lg text-mist md:text-xl" style={{ "--d": "650ms" } as React.CSSProperties}>{t("sub")}</p>
          <div className="intro-fade flex flex-wrap items-center gap-4" style={{ "--d": "800ms" } as React.CSSProperties}>
            <Magnetic>
              <Link prefetch={false} href={consultationHref()} className={`${buttonClass("primary")} shadow-[0_10px_40px_-10px_rgb(118_0_231/.8)]`}>{t("ctaPrimary")}</Link>
            </Magnetic>
            <a href="#programs" className={buttonClass("ghost")}>{t("ctaSecondary")}</a>
          </div>
        </div>

        <div data-hero-media className="relative mx-auto mt-16 w-full max-w-md md:mt-0 md:max-w-none">
          <div className="intro-mask relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] shadow-[0_40px_120px_-30px_rgb(118_0_231/.6)]" data-cursor="">
            {/* eslint-disable-next-line @next/next/no-img-element -- LCP: pre-sized webp + srcset (content/media.ts) */}
            <img {...img} sizes="(min-width: 768px) 34vw, 55vw" alt={tm("hero")} fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
            <VideoLoop {...reel} eager showPoster={false} className="absolute inset-0" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
            <p aria-hidden className="absolute bottom-5 left-5 font-mono text-xs tracking-widest text-paper/90 uppercase">{places}</p>
          </div>
          <div data-hero-float className="intro-fade absolute -bottom-10 -left-8 hidden w-36 rotate-[-7deg] overflow-hidden rounded-2xl border-4 border-ink shadow-2xl md:block lg:-left-16 lg:w-44" style={{ "--d": "900ms" } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative collage still */}
            <img {...side} sizes="176px" alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </HeroScrub>
      <div aria-hidden className="intro-fade absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-mist uppercase" style={{ "--d": "1200ms" } as React.CSSProperties}>
        {t("scroll")}
        <span className="scroll-cue block h-10 w-px origin-top bg-mist/60" />
      </div>
    </section>
  );
}
