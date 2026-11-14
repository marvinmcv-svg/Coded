import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubLine } from "@/components/motion/ScrubLine";
import { allEditions, type Edition } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const dot: Record<string, string> = {
  "steam-s": "bg-steam-s", "steam-t": "bg-steam-t", "steam-e": "bg-steam-e", "steam-a": "bg-steam-a", "steam-m": "bg-steam-m",
};

/**
 * Every edition, run and upcoming (allEditions), like the calendar on codingeducation.us — past ones are marked
 * completed and never bookable. `compact` (home): one swipeable strip + link to /events. Full (/events): one block per
 * year with a 12-month rail (decorative) and the edition cards (the content).
 */
export async function EventCalendar({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("home.events");
  const te = await getTranslations("pages.events");
  const tp = await getTranslations("programs");
  const format = await getFormatter();
  const editions = allEditions();
  const fmt = (date: string, o: { day?: "numeric"; month?: "short"; year?: "numeric" }) => format.dateTime(new Date(`${date}T12:00:00Z`), { ...o, timeZone: "UTC" });

  const card = (e: Edition) => (
    <Link
      href={`/programs/${e.program.slug}`}
      data-past={e.past ? "" : undefined}
      className={`group flex h-full flex-col gap-5 rounded-[var(--radius-card)] border p-6 transition-colors ${e.past ? "border-mist/15 bg-ink" : "border-accent-soft/30 bg-ink-2 hover:border-accent-soft"}`}
    >
      <time dateTime={e.date} className="flex items-end gap-3">
        <span className={`font-display text-5xl leading-none font-semibold ${e.past ? "text-mist" : ""}`}>{fmt(e.date, { day: "numeric" })}</span>
        <span className="pb-1 font-mono text-xs tracking-widest text-mist uppercase">{fmt(e.date, { month: "short", year: "numeric" })}</span>
      </time>
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2.5 font-display text-lg font-semibold group-hover:text-accent-soft">
          <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${dot[e.program.accent]}`} />
          {e.program.name}
        </span>
        <span className="text-sm text-mist">{tp(`${e.program.slug}.location`)}</span>
      </span>
      <span className={`mt-auto w-fit rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase ${e.past ? "border border-steam-s/40 text-steam-s" : "bg-accent text-paper"}`}>
        {e.past ? `✓ ${t("completed")}` : t("upcoming")}
      </span>
    </Link>
  );

  if (compact) {
    return (
      <section aria-labelledby="events-title" className="flex flex-col gap-10 py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6">
          <SectionHeading id="events-title" eyebrow={t("eyebrow")} title={t("title")} />
          <Link href="/events" className="font-mono text-sm text-mist hover:text-paper">{t("more")} →</Link>
        </div>
        <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:thin] md:mx-auto md:w-full md:max-w-7xl">
          {editions.map((e) => (
            <li key={`${e.program.slug}-${e.date}`} className="w-60 shrink-0 snap-start">
              {card(e)}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const years = [...new Set(editions.map((e) => e.date.slice(0, 4)))];
  const months = Array.from({ length: 12 }, (_, i) => fmt(`2026-${String(i + 1).padStart(2, "0")}-15`, { month: "short" }));

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-16 px-6 py-24">
      <SectionHeading id="calendar-title" eyebrow={te("calendarEyebrow")} title={te("calendarTitle")} />
      {years.map((year) => {
        const rows = editions.filter((e) => e.date.startsWith(year));
        return (
          <section key={year} aria-labelledby={`year-${year}`} className="flex flex-col gap-8">
            <h3 id={`year-${year}`} className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.8] font-semibold tracking-tight text-outline">
              {year}
            </h3>
            {/* Month rail: where each edition falls in the year (decorative; the cards below carry the dates). */}
            <div aria-hidden className="relative hidden pt-8 sm:block">
              <div className="h-px bg-mist/20" />
              <ScrubLine className="-mt-px" />
              <div className="mt-3 grid grid-cols-12 font-mono text-[11px] tracking-widest text-mist uppercase">
                {months.map((m) => <span key={m}>{m}</span>)}
              </div>
              {rows.map((e) => {
                const [, m, d] = e.date.split("-").map(Number);
                const left = ((m! - 1 + (d! - 1) / 31) / 12) * 100;
                return (
                  <span key={`${e.program.slug}-${e.date}`} className="absolute top-8 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%` }}>
                    <span className={`block size-3.5 rounded-full ring-4 ring-ink ${dot[e.program.accent]} ${e.past ? "opacity-50" : ""}`} />
                  </span>
                );
              })}
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rows.map((e) => (
                <li key={`${e.program.slug}-${e.date}`}>
                  <Reveal className="h-full">
                    {card(e)}
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </section>
  );
}
