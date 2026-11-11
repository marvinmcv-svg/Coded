import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { SplitWords } from "@/components/motion/SplitWords";
import { Diary } from "@/components/program/Diary";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { photo, srcSet } from "@/content/media";
import { getProgram, nextCohort, pastEditions, programs, upcomingCohorts } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { consultationHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

export const revalidate = 86400;
export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => programs.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProgram(slug);
  if (!p) return {};
  const t = await getTranslations({ locale, namespace: `programs.${p.slug}` });
  return pageMetadata(locale, `/programs/${p.slug}`, `${p.name} — Coded`, t("summary"));
}

const letters = { S: "text-steam-s", T: "text-steam-t", E: "text-steam-e", A: "text-steam-a", M: "text-steam-m" } as const;

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3 border-b border-mist/10 pb-3"><span aria-hidden className="text-accent-soft">—</span>{i}</li>
      ))}
    </ul>
  );
}

export default async function ProgramPage({ params }: Params) {
  const { locale, slug } = await params;
  const p = getProgram(slug);
  if (!p) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("programs.detail");
  const tp = await getTranslations(`programs.${p.slug}`);
  const te = await getTranslations("programs.extensions");
  const tm = await getTranslations("media");
  const format = await getFormatter();
  const fmt = (d: string) => format.dateTime(new Date(`${d}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const pathway = tp.raw("pathway") as Record<keyof typeof letters, string> | string[];
  const visits = tp.raw("visits") as string[];
  const inclusions = tp.raw("inclusions") as string[];
  const notIncluded = tp.raw("notIncluded") as string[];
  const cohorts = upcomingCohorts(p);
  const next = nextCohort(p);
  const past = pastEditions(p);
  const others = programs.filter((o) => o.slug !== p.slug);
  const hero = srcSet(p.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: p.name,
    description: tp("summary"),
    provider: { "@type": "EducationalOrganization", name: "Coded" },
    hasCourseInstance: cohorts.map((d) => ({ "@type": "CourseInstance", courseMode: "onsite", startDate: d, location: tp("location") })),
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero — CSS intro (globals.css .intro-*) so the h1 and photo paint without waiting on JS. */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_45%_at_80%_20%,rgb(118_0_231/.45),transparent),radial-gradient(35%_35%_at_5%_90%,rgb(206_54_223/.2),transparent)]" />
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 pt-12 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
          <div className="flex flex-col gap-7">
            <Link href="/programs" className="intro-fade w-fit font-mono text-sm text-mist hover:text-paper">← {t("back")}</Link>
            <p className="intro-fade flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase" style={{ "--d": "60ms" } as React.CSSProperties}>
              <span aria-hidden className="h-px w-8 bg-accent-soft" />
              {tp("location")}
            </p>
            {/* Name comes from aria-label: the phone copy (one LCP text block) and the split copy would otherwise both be read. */}
            <h1 aria-label={p.name} className="intro-words font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] font-semibold tracking-tight">
              <span aria-hidden className="md:hidden">{p.name}</span>
              <span aria-hidden className="hidden md:inline"><SplitWords text={p.name} /></span>
            </h1>
            <p className="intro-fade text-2xl text-accent-soft" style={{ "--d": "450ms" } as React.CSSProperties}>{tp("tagline")}</p>
            <p className="intro-fade max-w-xl text-lg text-mist" style={{ "--d": "600ms" } as React.CSSProperties}>{tp("summary")}</p>
            <div className="intro-fade flex flex-wrap items-center gap-4" style={{ "--d": "750ms" } as React.CSSProperties}>
              <Magnetic>
                <Link prefetch={false} href={consultationHref({ program: p.slug })} className={`${buttonClass("primary")} shadow-[0_10px_40px_-10px_rgb(118_0_231/.8)]`}>{t("cta")}</Link>
              </Magnetic>
              {next ? <a href="#dates" className={buttonClass("ghost")}>{t("nextDeparture", { date: fmt(next) })}</a> : null}
            </div>
          </div>
          <div className="intro-mask relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] shadow-[0_40px_120px_-30px_rgb(118_0_231/.6)] md:aspect-[4/5]" data-cursor="">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
            <img {...hero} sizes="(min-width: 768px) 40vw, 90vw" alt={tm(p.slug)} fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section id="dates" aria-labelledby="facts-title" className="mx-auto max-w-7xl scroll-mt-20 px-6">
        <h2 id="facts-title" className="sr-only">{t("keyFacts")}</h2>
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [t("location"), tp("location")],
              [t("ages"), t("agesValue", { min: p.ages[0], max: p.ages[1] })],
              [t("days"), p.days ? t("daysValue", { days: p.days }) : t("daysTbc")],
              [t("english"), t("englishValue", { level: p.englishLevel })],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink-2 p-7">
                <dt className="font-mono text-xs tracking-widest text-mist uppercase">{k}</dt>
                <dd className="mt-2 font-display text-xl">{v}</dd>
              </div>
            ))}
            <div className="bg-ink-2 p-7 sm:col-span-2 lg:col-span-2">
              <dt className="font-mono text-xs tracking-widest text-mist uppercase">{t("cohorts")}</dt>
              <dd className="mt-2 font-display text-xl">
                {cohorts.length ? <ul>{cohorts.map((d) => <li key={d}><time dateTime={d}>{fmt(d)}</time></li>)}</ul> : t("daysTbc")}
              </dd>
            </div>
          </dl>
          {past.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 px-2 text-sm text-mist">
              <span className="font-mono text-xs tracking-widest uppercase">{t("pastEditions")}</span>
              {past.map((d) => (
                <time key={d} dateTime={d} data-past="" className="rounded-full border border-mist/25 px-3 py-0.5">✓ {fmt(d)}</time>
              ))}
            </p>
          )}
        </Reveal>
      </section>

      {/* STEAM pathway — one row per letter, rows slide in from alternating sides */}
      <section aria-labelledby="pathway-title" className="mx-auto flex max-w-7xl flex-col gap-12 overflow-hidden px-6 py-24">
        <SectionHeading id="pathway-title" eyebrow={t("pathway")} title={t("pathwayTitle")} />
        {Array.isArray(pathway) ? (
          <SlideRows className="flex flex-col">
            {pathway.map((item, i) => (
              <li key={item} className="flex items-baseline gap-6 border-t border-mist/15 py-6">
                <span aria-hidden className="font-mono text-sm text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl md:text-3xl">{item}</span>
              </li>
            ))}
          </SlideRows>
        ) : (
          <SlideRows className="flex flex-col">
            {(Object.keys(letters) as (keyof typeof letters)[]).map((l) => (
              <li key={l} className="grid grid-cols-[4.5rem_1fr] items-center gap-6 border-t border-mist/15 py-6 md:grid-cols-[8rem_1fr]">
                <span aria-hidden className={`font-display text-6xl leading-none font-semibold md:text-8xl ${letters[l]}`}>{l}</span>
                <span className="text-xl md:text-2xl">{pathway[l]}</span>
              </li>
            ))}
          </SlideRows>
        )}
      </section>

      {/* Last edition: Orlando reels with Coded's own Instagram captions (CONTENT_FACTS §9) */}
      <Diary program={p} />

      {/* Gallery — Coded's own photos from this program's pages */}
      <section aria-labelledby="gallery-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <SectionHeading id="gallery-title" eyebrow={t("galleryEyebrow")} title={t("galleryTitle")} />
        <ul className="columns-2 gap-4 md:columns-3 md:gap-6">
          {p.gallery.map((k, i) => (
            <li key={k} className={`group mb-4 break-inside-avoid md:mb-6 ${i % 3 === 1 ? "md:mt-16" : ""}`}>
              <ClipReveal className="aspect-[4/5] rounded-3xl bg-ink-2" from={i % 2 ? "left" : "bottom"} delay={(i % 3) * 0.08}>
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
                <img {...photo(k)} sizes="(min-width: 768px) 30vw, 45vw" alt={tm(k)} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
              </ClipReveal>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24">
        <Reveal className="flex flex-col gap-6">
          <h2 className="font-display text-3xl font-semibold">{t("visits")}</h2>
          <List items={visits} />
        </Reveal>

        {inclusions.length ? (
          <Reveal className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-semibold">{t("inclusions")}</h2>
            <List items={inclusions} />
            {tp.has("rooms") ? <p className="text-mist">{tp("rooms")}</p> : null}
            {notIncluded.length ? <p className="text-mist">{t("notIncluded")}: {notIncluded.join(", ")}</p> : null}
          </Reveal>
        ) : null}

        {p.extensions.length ? (
          <Reveal className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-semibold">{t("extensions")}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {p.extensions.map((e) => (
                <li key={e.key} className="rounded-2xl border border-mist/20 p-5">
                  <p className="font-display text-lg font-semibold">{te(e.key)}</p>
                  <p className="text-sm text-mist">
                    {[e.timing ? t(`timing.${e.timing}`) : null, e.days ? t("extensionDays", { days: e.days }) : null].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Reveal className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-accent/15 p-8 md:p-12">
          <h2 className="font-display text-3xl font-semibold">{t("price")}</h2>
          <p className="text-lg text-mist">{t("priceOnRequest")} {t("ctaBody")}</p>
          <Link prefetch={false} href={consultationHref({ program: p.slug })} className={buttonClass("primary")}>{t("cta")}</Link>
        </Reveal>
      </div>

      {/* Other programs */}
      <section aria-labelledby="more-title" className="border-t border-mist/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20">
          <h2 id="more-title" className="font-mono text-sm tracking-[0.2em] text-mist uppercase">{t("more")}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/programs/${o.slug}`} className="group flex flex-col gap-4">
                  <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-ink-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
                    <img {...srcSet(o.slug)} sizes="(min-width: 768px) 30vw, 90vw" alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
                  </div>
                  <span className="font-display text-2xl font-semibold group-hover:text-accent-soft">{o.name} <span aria-hidden>→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
