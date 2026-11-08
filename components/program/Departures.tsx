import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { programs, upcomingCohorts } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";

const dot: Record<string, string> = {
  "steam-s": "bg-steam-s", "steam-t": "bg-steam-t", "steam-e": "bg-steam-e", "steam-a": "bg-steam-a", "steam-m": "bg-steam-m",
};

/** Every upcoming departure across programs, in date order. Past cohorts never appear (upcomingCohorts). */
export async function Departures() {
  const t = await getTranslations("programs.index");
  const tp = await getTranslations("programs");
  const format = await getFormatter();
  const rows = programs
    .flatMap((p) => upcomingCohorts(p).map((date) => ({ p, date })))
    .sort((a, b) => a.date.localeCompare(b.date));
  const d = (date: string, o: { day?: "numeric"; month?: "short"; year?: "numeric" }) => format.dateTime(new Date(`${date}T12:00:00Z`), { ...o, timeZone: "UTC" });

  return (
    <section id="departures" aria-labelledby="departures-title" className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-12 px-6 pb-24">
      <SectionHeading id="departures-title" eyebrow={t("calendarEyebrow")} title={t("calendarTitle")} />
      <ol className="flex flex-col">
        {rows.map(({ p, date }) => (
          <li key={`${p.slug}-${date}`}>
            <Reveal>
              <Link href={`/programs/${p.slug}`} className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-6 border-t border-mist/15 py-6 transition-colors hover:bg-ink-2/60 md:grid-cols-[9rem_1fr_auto] md:px-4">
                <time dateTime={date} className="flex flex-col">
                  <span className="font-display text-4xl leading-none font-semibold md:text-5xl">{d(date, { day: "numeric" })}</span>
                  <span className="font-mono text-xs tracking-widest text-mist uppercase">{d(date, { month: "short", year: "numeric" })}</span>
                </time>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-3 font-display text-lg font-semibold sm:text-xl group-hover:text-accent-soft md:text-2xl">
                    <span aria-hidden className={`size-2.5 rounded-full ${dot[p.accent]}`} />
                    {p.name}
                  </span>
                  <span className="text-mist">{tp(`${p.slug}.location`)}</span>
                </span>
                <span aria-hidden className="hidden font-mono text-sm text-mist group-hover:text-paper md:block">{t("view")} →</span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
