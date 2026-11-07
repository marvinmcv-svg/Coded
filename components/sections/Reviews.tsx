import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { reviews } from "@/content/reviews";
import { SectionHeading } from "./SectionHeading";

/** Verbatim Google reviews (content/reviews.ts), each in its original language (`lang` set for screen readers). */
export async function Reviews() {
  const t = await getTranslations("home.reviews");
  const format = await getFormatter();

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-12 px-6 py-24">
      <SectionHeading id="reviews-title" eyebrow={t("eyebrow")} title={t("title")} />
      <ul className="columns-1 gap-6 md:columns-2 lg:columns-3">
        {reviews.map((r) => (
          <li key={r.name} className="mb-6 break-inside-avoid">
            <Reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-ink-2 p-7">
              <p className="font-mono text-accent-soft" role="img" aria-label={t("stars", { stars: r.stars })}>
                {"★".repeat(r.stars)}<span className="text-mist/40">{"★".repeat(5 - r.stars)}</span>
              </p>
              <blockquote lang={r.lang} className="text-lg whitespace-pre-line">“{r.text}”</blockquote>
              <p className="text-sm text-mist">
                <span className="text-paper">{r.name}</span> · {t("source")} ·{" "}
                <time dateTime={r.date}>{format.dateTime(new Date(`${r.date}T12:00:00Z`), { month: "long", year: "numeric", timeZone: "UTC" })}</time>
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
