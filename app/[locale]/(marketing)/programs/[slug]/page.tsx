import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { getProgram, programs, upcomingCohorts } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { CONSULTATION_URL } from "@/lib/links";

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
  return { title: `${p.name} — Coded`, description: t("summary") };
}

const letterColor = { S: "text-steam-s", T: "text-steam-t", E: "text-steam-e", A: "text-steam-a", M: "text-steam-m" } as const;

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3"><span aria-hidden className="text-accent-soft">—</span>{i}</li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-5 border-t border-mist/20 pt-8">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {children}
    </Reveal>
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
  const format = await getFormatter();
  const fmt = (d: string) => format.dateTime(new Date(`${d}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const pathway = tp.raw("pathway") as Record<"S" | "T" | "E" | "A" | "M", string> | string[];
  const visits = tp.raw("visits") as string[];
  const inclusions = tp.raw("inclusions") as string[];
  const notIncluded = tp.raw("notIncluded") as string[];
  const cohorts = upcomingCohorts(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: p.name,
    description: tp("summary"),
    provider: { "@type": "EducationalOrganization", name: "Coded" },
    hasCourseInstance: cohorts.map((d) => ({ "@type": "CourseInstance", courseMode: "onsite", startDate: d, location: tp("location") })),
  };

  return (
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="flex flex-col gap-6">
        <Link href="/programs" className="font-mono text-sm text-mist hover:text-paper">← {t("back")}</Link>
        <p className="font-mono text-sm text-mist">{tp("location")}</p>
        <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">{p.name}</h1>
        <p className="text-2xl">{tp("tagline")}</p>
        <p className="max-w-3xl text-lg text-mist">{tp("summary")}</p>
      </header>

      <section aria-labelledby="facts-title" className="rounded-[var(--radius-card)] bg-ink-2 p-8">
        <h2 id="facts-title" className="sr-only">{t("keyFacts")}</h2>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="font-mono text-sm text-mist">{t("location")}</dt><dd className="mt-1">{tp("location")}</dd></div>
          <div><dt className="font-mono text-sm text-mist">{t("ages")}</dt><dd className="mt-1">{t("agesValue", { min: p.ages[0], max: p.ages[1] })}</dd></div>
          <div><dt className="font-mono text-sm text-mist">{t("days")}</dt><dd className="mt-1">{p.days ? t("daysValue", { days: p.days }) : t("daysTbc")}</dd></div>
          <div>
            <dt className="font-mono text-sm text-mist">{t("cohorts")}</dt>
            <dd className="mt-1">
              {cohorts.length ? (
                <ul>{cohorts.map((d) => <li key={d}><time dateTime={d}>{fmt(d)}</time></li>)}</ul>
              ) : t("daysTbc")}
            </dd>
          </div>
        </dl>
      </section>

      <Block title={t("pathway")}>
        {Array.isArray(pathway) ? (
          <List items={pathway} />
        ) : (
          <ul className="flex flex-col gap-4">
            {(Object.keys(letterColor) as (keyof typeof letterColor)[]).map((l) => (
              <li key={l} className="flex gap-5">
                <span aria-hidden className={`font-display text-3xl font-semibold ${letterColor[l]}`}>{l}</span>
                <span className="pt-2 text-lg">{pathway[l]}</span>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block title={t("visits")}><List items={visits} /></Block>

      {inclusions.length ? (
        <Block title={t("inclusions")}>
          <List items={inclusions} />
          {tp.has("rooms") ? <p className="text-mist">{tp("rooms")}</p> : null}
          {notIncluded.length ? <p className="text-mist">{t("notIncluded")}: {notIncluded.join(", ")}</p> : null}
        </Block>
      ) : null}

      {p.extensions.length ? (
        <Block title={t("extensions")}>
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
        </Block>
      ) : null}

      <Block title={t("price")}>
        <p className="text-lg text-mist">{t("priceOnRequest")}</p>
      </Block>

      <section className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-accent/15 p-8">
        <p className="text-lg">{t("ctaBody")}</p>
        <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{t("cta")}</a>
      </section>
    </main>
  );
}
