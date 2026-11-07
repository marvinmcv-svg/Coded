import { getTranslations } from "next-intl/server";
import { Marquee } from "@/components/motion/Marquee";
import { photo, type BuiltImage } from "@/content/media";
import { SectionHeading } from "./SectionHeading";

const rows: BuiltImage[][] = [
  ["class-laptops", "tokyo-build", "lab-coat", "vr", "purple-laptop", "worksheet", "tokyo-temple"],
  ["presenting", "tablets", "activity", "tokyo-cap", "lab", "student-laptop", "boys-laptop", "laptops-room"],
];

/** "This is Coded": two photo rows drifting in opposite directions; scroll speed pushes them (full tier). */
export async function Gallery() {
  const t = await getTranslations("home.gallery");
  const tm = await getTranslations("media");
  const tc = await getTranslations("common");
  return (
    <section aria-labelledby="gallery-title" className="flex flex-col gap-12 overflow-hidden py-24">
      <SectionHeading id="gallery-title" eyebrow={t("eyebrow")} title={t("title")} className="mx-auto w-full max-w-7xl px-6" />
      <div className="flex -rotate-2 flex-col gap-4 md:gap-6">
        {rows.map((row, r) => (
          <Marquee key={r} seconds={r ? 70 : 60} reverse={r === 1} controls={{ pause: tc("pause"), play: tc("play") }}>
            {row.map((k) => (
              <figure key={k} className="group mr-4 w-[58vw] shrink-0 overflow-hidden rounded-3xl md:mr-6 md:w-[24vw]" data-cursor="">
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
                <img {...photo(k)} sizes="(min-width: 768px) 24vw, 58vw" alt={tm(k)} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
