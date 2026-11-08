import { getTranslations } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { VideoLoop } from "@/components/motion/VideoLoop";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { clip } from "@/content/media";
import type { Program } from "@/content/programs";

/** "Last edition": a program's reels with Coded's own Instagram captions (CONTENT_FACTS §9a). */
export async function Diary({ program }: { program: Program }) {
  const t = await getTranslations("programs.detail");
  const tp = await getTranslations(`programs.${program.slug}`);
  if (!program.diary.length) return null;
  const diary = tp.raw("diary") as { when: string; title: string; body: string }[];

  return (
    <section aria-labelledby="diary-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
      <SectionHeading id="diary-title" eyebrow={t("diaryEyebrow")} title={t("diaryTitle")} />
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {program.diary.map((key, i) => (
          <li key={key} className="flex flex-col gap-4">
            <ClipReveal className="aspect-[3/4] rounded-3xl bg-ink-2" delay={i * 0.08}>
              <VideoLoop {...clip(key)} className="size-full" />
            </ClipReveal>
            <p className="font-mono text-xs tracking-widest text-accent-soft uppercase">{diary[i]?.when}</p>
            <h3 className="font-display text-xl font-semibold">{diary[i]?.title}</h3>
            <p className="text-mist">{diary[i]?.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
