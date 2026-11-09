import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { pastEditions, programs, upcomingCohorts } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";

const dot: Record<string, string> = {
  "steam-s": "bg-steam-s", "steam-t": "bg-steam-t", "steam-e": "bg-steam-e", "steam-a": "bg-steam-a", "steam-m": "bg-steam-m",
};

/**
 * Every upcoming departure across programs, in date order (past cohorts never appear there), then the editions already
 * run (pastEditions), newest first: a muted track record, never bookable.
 */
export async function Departures() {
  const t = await getTranslations("programs.index");
  const tp = await getTranslations("programs");
  const format = await getFormatter();
  const rows = programs
    .flatMap((p) => upcomingCohorts(p).map((date) => ({ p, date })))
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = programs
    .flatMap((p) => pastEditions(p).map((date) => ({ p, date })))
    .sort((a, b) => b.date.localeCompare(a.date));
  const d = (date: string, o: { day?: "numeric"; month?: "short"; year?: "numeric" }) => format.dateTime(new Date(`${date}T12:00:00Z`), { ...o, timeZone: "UTC" });

  return (
    <>
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

      {past.length > 0 && (
        <section id="editions" aria-labelledby="editions-title" className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-8 px-6 pb-24">
          <SectionHeading id="editions-title" eyebrow={t("pastEyebrow")} title={t("pastTitle")} />
          <p className="-mt-4 max-w-2xl text-lg text-mist">{t("pastIntro")}</p>
          <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 sm:grid-cols-2">
            {past.map(({ p, date }) => (
              <li key={`${p.slug}-${date}`} className="bg-ink">
                <Reveal>
                  <Link href={`/programs/${p.slug}`} className="group flex items-center gap-5 p-6 transition-colors hover:bg-ink-2/60">
                    <time dateTime={date} className="w-20 shrink-0 font-mono text-xs leading-relaxed tracking-widest text-mist uppercase">
                      {d(date, { day: "numeric", month: "short" })}
                      <br />
                      {d(date, { year: "numeric" })}
                    </time>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex items-center gap-3 font-display text-lg font-semibold group-hover:text-accent-soft">
                        <span aria-hidden className={`size-2 shrink-0 rounded-full ${dot[p.accent]}`} />
                        {p.name}
                      </span>
                      <span className="text-sm text-mist">{tp(`${p.slug}.location`)}</span>
                    </span>
                    <span className="shrink-0 rounded-full border border-steam-s/40 px-3 py-1 font-mono text-[11px] tracking-wider text-steam-s uppercase">✓ {t("completed")}</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
