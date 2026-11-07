import { getFormatter, getTranslations } from "next-intl/server";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { srcSet } from "@/content/media";
import { nextCohort, programs } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const border: Record<string, string> = {
  "steam-s": "before:bg-steam-s", "steam-t": "before:bg-steam-t", "steam-e": "before:bg-steam-e",
  "steam-a": "before:bg-steam-a", "steam-m": "before:bg-steam-m",
};

/** Home section, or the /programs index body when `asPage` (h1 + intro). */
export async function Programs({ asPage = false }: { asPage?: boolean }) {
  const t = await getTranslations("home.programs");
  const tp = await getTranslations("programs");
  const tm = await getTranslations("media");
  const format = await getFormatter();
  const Heading = asPage ? "h2" : "h3";

  return (
    <section id="programs" aria-labelledby="programs-title" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-12 px-6 py-24">
      {asPage ? (
        <div className="flex flex-col gap-4">
          <h1 id="programs-title" className="font-display text-4xl font-semibold md:text-6xl">{tp("index.title")}</h1>
          <p className="max-w-2xl text-lg text-mist">{tp("index.intro")}</p>
        </div>
      ) : (
        <SectionHeading id="programs-title" eyebrow={t("eyebrow")} title={t("title")} />
      )}
      <ul className="grid gap-6 md:grid-cols-2">
        {programs.map((p) => {
          const next = nextCohort(p);
          return (
            <li key={p.slug}>
              <Reveal className={`relative flex h-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] bg-ink-2 before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1 ${border[p.accent]}`}>
                <Parallax>
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset in public/media (content/media.ts) */}
                  <img {...srcSet(p.slug)} sizes="(min-width: 768px) 560px, 100vw" alt={tm(p.slug)} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
                </Parallax>
                <div className="flex flex-1 flex-col gap-4 px-8 pt-2 pb-8">
                  <p className="font-mono text-sm text-mist">{tp(`${p.slug}.location`)}</p>
                  {/* h2 on the index page so heading levels don't skip */}
                  <Heading className="font-display text-2xl font-semibold">
                    <Link href={`/programs/${p.slug}`} className="after:absolute after:inset-0">{p.name}</Link>
                  </Heading>
                  <p className="text-lg">{tp(`${p.slug}.tagline`)}</p>
                  <ul className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-mist">
                    <li>
                      {next ? (
                        <>
                          {t("next")}:{" "}
                          <time dateTime={next} className="text-paper">
                            {format.dateTime(new Date(`${next}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                          </time>
                        </>
                      ) : t("noDate")}
                    </li>
                    <li>{t("ages", { min: p.ages[0], max: p.ages[1] })}</li>
                    {p.days ? <li>{t("days", { days: p.days })}</li> : null}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
