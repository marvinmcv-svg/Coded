import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Diary } from "@/components/program/Diary";
import { CTA } from "@/components/sections/CTA";
import { EventCalendar } from "@/components/sections/EventCalendar";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Videos } from "@/components/sections/Videos";
import { programPhotos } from "@/content/gallery";
import { photo } from "@/content/media";
import { allEditions, nextCohort, pastEditions, programs } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/meta";

export const revalidate = 86400; // an edition moves from "upcoming" to "completed" on its start date

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.events" });
  return pageMetadata(locale, "/events", `${t("title")} — Coded`, t("metaDescription"));
}

const dot: Record<string, string> = { "steam-s": "bg-steam-s", "steam-t": "bg-steam-t", "steam-e": "bg-steam-e", "steam-a": "bg-steam-a", "steam-m": "bg-steam-m" };

/**
 * Events: the full 2026–2027 calendar (dates from codingeducation.us, CONTENT_FACTS §3/§3a) and, per program, what an
 * edition looks like — Coded's own photos from that program's pages, plus the Orlando diary (§9a). Photos are grouped
 * by program, not by edition: the crawl doesn't say which edition each photo is from.
 */
export default async function EventsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.events");
  const tg = await getTranslations("home.gallery");
  const tm = await getTranslations("media");
  const format = await getFormatter();
  const fmt = (d: string) => format.dateTime(new Date(`${d}T12:00:00Z`), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  const editions = allEditions();
  const stats = [
    [String(editions.filter((e) => e.past).length), t("stats.past")],
    [String(editions.filter((e) => !e.past).length), t("stats.next")],
    [String(programs.length), t("stats.programs")],
    [t("stats.countriesValue"), t("stats.countries")],
  ] as const;

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="orl-main-street" />

      <section aria-label={t("calendarEyebrow")} className="mx-auto max-w-7xl px-6">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse gap-2 bg-ink-2 p-7">
                <dt className="font-mono text-xs tracking-widest text-mist uppercase">{label}</dt>
                <dd className="font-display text-5xl leading-none font-semibold md:text-6xl">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <EventCalendar />

      <section aria-labelledby="inside-title" className="mx-auto flex max-w-7xl flex-col gap-4 px-6">
        <SectionHeading id="inside-title" eyebrow={t("insideEyebrow")} title={t("insideTitle")} />
      </section>

      {programs.map((p) => {
        const shots = programPhotos(p.slug);
        const past = pastEditions(p);
        const next = nextCohort(p);
        const story = `stories.${p.slug}` as const;
        const tours = t.has(`${story}.tours`) ? (t.raw(`${story}.tours`) as string[]) : [];
        return (
          <div key={p.slug}>
            <section id={p.slug} aria-labelledby={`${p.slug}-story`} className="mx-auto grid max-w-7xl scroll-mt-20 gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <Reveal className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                <p className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
                  <span aria-hidden className={`size-2.5 rounded-full ${dot[p.accent]}`} />
                  {p.name}
                </p>
                <h3 id={`${p.slug}-story`} className="font-display text-3xl leading-tight font-semibold md:text-4xl">{t(`${story}.title`)}</h3>
                <p className="text-lg text-mist">{t(`${story}.body`)}</p>
                {tours.length ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-mono text-xs tracking-widest text-mist uppercase">{t("toursTitle")}</p>
                    <ul className="flex flex-wrap gap-2">{tours.map((x) => <li key={x} className="rounded-full border border-mist/25 px-3 py-1 text-sm">{x}</li>)}</ul>
                  </div>
                ) : null}
                <dl className="flex flex-col gap-3 text-sm">
                  {past.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <dt className="mr-1 font-mono text-xs tracking-widest text-mist uppercase">{t("editions")}</dt>
                      {past.map((d) => <dd key={d}><time dateTime={d} data-past="" className="block rounded-full border border-steam-s/40 px-3 py-0.5 text-steam-s">✓ {fmt(d)}</time></dd>)}
                    </div>
                  ) : null}
                  {next ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <dt className="mr-1 font-mono text-xs tracking-widest text-mist uppercase">{t("nextDeparture")}</dt>
                      <dd><time dateTime={next} className="block rounded-full bg-accent px-3 py-0.5 text-paper">{fmt(next)}</time></dd>
                    </div>
                  ) : null}
                </dl>
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
                  <Link href={`/programs/${p.slug}`} className="text-accent-soft hover:text-paper">{p.name} →</Link>
                  <Link href={`/gallery#${p.slug}`} className="text-mist hover:text-paper">{tg("all", { count: shots.length })} →</Link>
                </div>
              </Reveal>

              {/* Bento: one large photo, eight small ones */}
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                {shots.slice(0, 9).map((k, i) => (
                  <li key={k} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                    <ClipReveal className={`group relative rounded-2xl bg-ink-2 ${i === 0 ? "aspect-[4/5] sm:aspect-auto sm:size-full" : "aspect-[4/5]"}`} from={i % 3 === 0 ? "left" : "bottom"} delay={(i % 4) * 0.06}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
                      <img {...photo(k)} sizes={i === 0 ? "(min-width: 1024px) 34vw, 90vw" : "(min-width: 1024px) 16vw, 45vw"} alt={tm(k)} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
                    </ClipReveal>
                  </li>
                ))}
              </ul>
            </section>
            {p.diary.length ? <Diary program={p} /> : null}
          </div>
        );
      })}

      <Videos keys={["recap", "orlando-2026", "europe-highlights", "ai"]} />
      <CTA />
    </main>
  );
}
