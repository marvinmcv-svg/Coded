import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/Button";
import { srcSet } from "@/content/media";
import { CONSULTATION_URL } from "@/lib/links";

const letters = [
  ["S", "text-steam-s"], ["T", "text-steam-t"], ["E", "text-steam-e"], ["A", "text-steam-a"], ["M", "text-steam-m"],
] as const;

export async function Hero() {
  const t = await getTranslations("home.hero");
  const tm = await getTranslations("media");
  const img = srcSet("hero");
  return (
    <section className="relative overflow-hidden">
      {/* Art-directed backdrop (brand hues) behind the hero photo; video pending originals (Q1). Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_80%_20%,rgb(118_0_231/.45),transparent),radial-gradient(40%_40%_at_10%_80%,rgb(206_54_223/.22),transparent),radial-gradient(35%_35%_at_60%_90%,rgb(58_159_214/.2),transparent)]" />
      <div className="mx-auto grid min-h-[88svh] max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-8">
          <p className="flex items-center gap-3 font-mono text-sm text-mist">
            <span aria-hidden className="flex gap-1 font-semibold">
              {letters.map(([l, c]) => <span key={l} className={c}>{l}</span>)}
            </span>
            {t("eyebrow")}
          </p>
          <h1 className="max-w-4xl font-display text-5xl leading-[1.02] font-semibold tracking-tight lg:text-6xl">{t("headline")}</h1>
          <p className="max-w-2xl text-lg text-mist md:text-xl">{t("sub")}</p>
          <div className="flex flex-wrap gap-4">
            <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{t("ctaPrimary")}</a>
            <a href="#programs" className={buttonClass("ghost")}>{t("ctaSecondary")}</a>
          </div>
        </div>
        {/* LCP element: a real <img>, eager + high priority. Motion tiers enhance around it, never replace it. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset in public/media (content/media.ts) */}
        <img
          {...img}
          sizes="(min-width: 768px) 45vw, 100vw"
          alt={tm("hero")}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/3] w-full rounded-[var(--radius-card)] object-cover"
        />
      </div>
    </section>
  );
}
