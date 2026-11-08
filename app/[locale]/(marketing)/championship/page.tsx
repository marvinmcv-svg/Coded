import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { SplitWords } from "@/components/motion/SplitWords";
import { Countdown } from "@/components/sections/Countdown";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { photo } from "@/content/media";
import { getProgram, nextCohort } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { consultationHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

export const revalidate = 86400;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.championship" });
  return pageMetadata(locale, "/championship", `${t("metaTitle")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §3 (Tokyo 🟡) and §9a (road-to-Tokyo countries from Coded's own Instagram).
const steps = ["league", "qualify", "prepare", "present", "win"] as const;

export default async function ChampionshipPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.championship");
  const th = await getTranslations("home.championship");
  const tp = await getTranslations("programs.tokyo-steam-championship");
  const tm = await getTranslations("media");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const tokyo = getProgram("tokyo-steam-championship")!;
  const date = nextCohort(tokyo);
  const pathway = tp.raw("pathway") as string[];
  const visits = tp.raw("visits") as string[];
  const countries = t.raw("countries") as string[];
  const hero = photo("tokyo-group");

  return (
    <main id="main">
      {/* Hero — CSS intro; the photo is the backdrop, the h1 is the LCP text block on phones */}
      <section className="relative isolate overflow-hidden px-6 pt-24 pb-28 md:pt-36 md:pb-40">
        <div className="intro-mask absolute inset-0 -z-20">
          {/* Phones get a ~1 KB pre-blurred still (build-media.py) so the h1 stays the LCP; md+ gets the full photo. */}
          <picture>
            <source media="(min-width: 768px)" srcSet={hero.srcSet} sizes="100vw" />
            { }
            <img src="/media/tokyo-group-blur.webp" width={hero.width} height={hero.height} alt="" fetchPriority="high" decoding="async" className="size-full object-cover" />
          </picture>
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_13_18/.85),rgb(11_13_18/.7)_45%,rgb(11_13_18)),radial-gradient(70%_50%_at_50%_0%,rgb(206_54_223/.4),transparent)]" />
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-7 text-center">
          <p className="intro-fade font-mono text-sm tracking-[0.2em] text-steam-a uppercase">{th("eyebrow")}</p>
          <h1 aria-label={th("title")} className="intro-words font-display text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.96] font-semibold tracking-tight">
            <span aria-hidden className="md:hidden">{th("title")}</span>
            <span aria-hidden className="hidden md:inline"><SplitWords text={th("title")} /></span>
          </h1>
          <p className="intro-fade max-w-2xl text-lg text-mist md:text-xl" style={{ "--d": "600ms" } as React.CSSProperties}>{tp("tagline")}</p>
          {date ? (
            <div className="intro-fade flex flex-col items-center gap-5" style={{ "--d": "750ms" } as React.CSSProperties}>
              <p className="font-mono">
                {th("dateLabel")}:{" "}
                <time dateTime={date} className="text-paper">
                  {format.dateTime(new Date(`${date}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                </time>
              </p>
              <Countdown date={date} labels={th.raw("countdown")} />
            </div>
          ) : null}
          <div className="intro-fade flex flex-wrap justify-center gap-4" style={{ "--d": "900ms" } as React.CSSProperties}>
            <Magnetic>
              <Link prefetch={false} href={consultationHref({ audience: "school", program: "tokyo-steam-championship" })} className={`${buttonClass("primary")} shadow-[0_10px_40px_-10px_rgb(118_0_231/.8)]`}>{th("cta")}</Link>
            </Magnetic>
            <Link href="/programs/tokyo-steam-championship" className={buttonClass("ghost")}>{t("programLink")}</Link>
          </div>
        </div>
      </section>

      {/* The road to Tokyo */}
      <section aria-labelledby="road-title" className="mx-auto flex max-w-7xl flex-col gap-12 overflow-hidden px-6 py-24">
        <SectionHeading id="road-title" eyebrow={t("roadEyebrow")} title={t("roadTitle")} />
        <SlideRows className="flex flex-col">
          {steps.map((s, i) => (
            <li key={s} className="grid grid-cols-[3.5rem_1fr] gap-6 border-t border-mist/15 py-8 md:grid-cols-[8rem_1fr_1.2fr] md:items-baseline">
              <span aria-hidden className="font-display text-4xl font-semibold text-steam-a md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl font-semibold md:text-3xl">{t(`steps.${s}.title`)}</h3>
              <p className="col-start-2 text-lg text-mist md:col-start-3">{t(`steps.${s}.body`)}</p>
            </li>
          ))}
        </SlideRows>
      </section>

      {/* Who is on the road — countries tagged in Coded's own "road to Tokyo" posts */}
      <section aria-labelledby="countries-title" className="flex flex-col gap-10 overflow-hidden py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <SectionHeading id="countries-title" eyebrow={t("countriesEyebrow")} title={t("countriesTitle")} />
        </div>
        <Marquee seconds={40} controls={{ pause: tc("pause"), play: tc("play") }}>
          {countries.map((c, i) => (
            <span key={c} className={`pr-12 font-display text-[clamp(2.5rem,7vw,6rem)] leading-none font-semibold whitespace-nowrap ${i % 2 ? "text-outline" : "text-paper/90"}`}>{c}</span>
          ))}
        </Marquee>
      </section>

      {/* Challenge theme + what they build */}
      <section aria-labelledby="theme-title" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <SectionHeading id="theme-title" eyebrow={t("themeEyebrow")} title={tp("tagline")} />
        <Reveal className="flex flex-col gap-6">
          <p className="text-lg text-mist">{t("themeBody")}</p>
          <ul className="flex flex-wrap gap-3">
            {pathway.map((p) => <li key={p} className="rounded-full border border-mist/25 px-4 py-2 text-sm">{p}</li>)}
          </ul>
        </Reveal>
      </section>

      {/* Tokyo as a classroom — photo grid + venue list */}
      <section aria-labelledby="city-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <SectionHeading id="city-title" eyebrow={t("cityEyebrow")} title={t("cityTitle")} />
        <div className="grid gap-4 md:grid-cols-4 md:gap-6">
          {tokyo.gallery.slice(0, 4).map((k, i) => (
            <ClipReveal key={k} className={`aspect-[4/5] rounded-3xl bg-ink-2 ${i % 2 ? "md:mt-12" : ""}`} delay={i * 0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
              <img {...photo(k)} sizes="(min-width: 768px) 24vw, 90vw" alt={tm(k)} loading="lazy" decoding="async" className="size-full object-cover" />
            </ClipReveal>
          ))}
        </div>
        <Reveal>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {visits.map((v) => <li key={v} className="flex gap-3 border-b border-mist/10 pb-3"><span aria-hidden className="text-steam-a">—</span>{v}</li>)}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-accent/15 p-8 md:p-12">
          <h2 className="font-display text-3xl font-semibold">{t("ctaTitle")}</h2>
          <p className="text-lg text-mist">{t("ctaBody")}</p>
          <Link prefetch={false} href={consultationHref({ audience: "school", program: "tokyo-steam-championship" })} className={buttonClass("primary")}>{th("cta")}</Link>
        </Reveal>
      </section>
    </main>
  );
}
