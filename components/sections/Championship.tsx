import { getFormatter, getTranslations } from "next-intl/server";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { TextReveal } from "@/components/motion/TextReveal";
import { photo } from "@/content/media";
import { buttonClass } from "@/components/ui/Button";
import { nextCohort, programs } from "@/content/programs";
import { CONSULTATION_URL } from "@/lib/links";
import { Countdown } from "./Countdown";

export async function Championship() {
  const t = await getTranslations("home.championship");
  const format = await getFormatter();
  const tokyo = programs.find((p) => p.slug === "tokyo-steam-championship");
  const date = tokyo ? nextCohort(tokyo) : null;

  return (
    <section id="championship" aria-labelledby="championship-title" className="relative isolate scroll-mt-20 overflow-hidden px-6 py-32 md:py-44">
      <Parallax className="absolute inset-0 -z-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop (content/media.ts) */}
        <img {...photo("tokyo-group")} sizes="100vw" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_13_18/.92),rgb(11_13_18/.72)_40%,rgb(11_13_18/.95)),radial-gradient(70%_50%_at_50%_10%,rgb(206_54_223/.35),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 opacity-30">
        <Marquee seconds={50}>
          <span className="text-outline pr-16 font-display text-[clamp(6rem,18vw,16rem)] leading-none font-semibold whitespace-nowrap">{t("bigword")}</span>
        </Marquee>
      </div>
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-steam-a uppercase">{t("eyebrow")}</p>
        <TextReveal>
          <h2 id="championship-title" className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.98] font-semibold tracking-tight"><SplitWords text={t("title")} /></h2>
        </TextReveal>
        <p className="max-w-2xl text-lg text-mist">{t("body")}</p>
        <p className="text-mist">{t("frequency")}</p>
        {date ? (
          <p className="font-mono">
            {t("dateLabel")}:{" "}
            <time dateTime={date} className="text-paper">
              {format.dateTime(new Date(`${date}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            </time>
          </p>
        ) : null}
        {date ? <Countdown date={date} labels={t.raw("countdown")} /> : null}
        <Magnetic>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("secondary")}>{t("cta")}</a>
        </Magnetic>
      </Reveal>
    </section>
  );
}
