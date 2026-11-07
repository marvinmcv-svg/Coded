import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
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
    <section id="championship" aria-labelledby="championship-title" className="scroll-mt-20 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(255_61_127/.18),transparent)] px-6 py-28">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-wide text-steam-a uppercase">{t("eyebrow")}</p>
        <h2 id="championship-title" className="font-display text-4xl leading-tight font-semibold md:text-7xl">{t("title")}</h2>
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
        <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("secondary")}>{t("cta")}</a>
      </Reveal>
    </section>
  );
}
