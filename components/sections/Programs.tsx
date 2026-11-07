import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { nextCohort, programs } from "@/content/programs";
import type { Locale } from "@/lib/i18n/routing";
import { SectionHeading } from "./SectionHeading";

const border: Record<string, string> = {
  "steam-s": "before:bg-steam-s", "steam-t": "before:bg-steam-t", "steam-e": "before:bg-steam-e",
  "steam-a": "before:bg-steam-a", "steam-m": "before:bg-steam-m",
};

export async function Programs() {
  const t = await getTranslations("home.programs");
  const format = await getFormatter();
  const locale = (await getLocale()) as Locale;

  return (
    <section id="programs" aria-labelledby="programs-title" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-12 px-6 py-24">
      <SectionHeading id="programs-title" eyebrow={t("eyebrow")} title={t("title")} />
      <ul className="grid gap-6 md:grid-cols-2">
        {programs.map((p) => {
          const next = nextCohort(p);
          return (
            <li key={p.slug}>
              <Reveal className={`relative flex h-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] bg-ink-2 p-8 before:absolute before:inset-x-0 before:top-0 before:h-1 ${border[p.accent]}`}>
                <p className="font-mono text-sm text-mist">{p.location[locale]}</p>
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="text-lg">{p.tagline[locale]}</p>
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
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
