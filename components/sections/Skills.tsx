import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { SectionHeading } from "./SectionHeading";

const skills = [
  ["creativity", "bg-steam-a"], ["collaboration", "bg-steam-s"], ["adaptability", "bg-steam-e"],
  ["problemSolving", "bg-steam-t"], ["technical", "bg-steam-m"], ["criticalThinking", "bg-accent-soft"],
] as const;

/** Editorial stack of giant skill words sliding in from alternating sides; SDG line closes the section. */
export async function Skills() {
  const t = await getTranslations("home.skills");
  return (
    <section aria-labelledby="skills-title" className="mx-auto flex max-w-7xl flex-col gap-12 overflow-hidden px-6 py-24">
      <SectionHeading id="skills-title" eyebrow={t("eyebrow")} title={t("title")} />
      <SlideRows className="flex flex-col divide-y divide-mist/15 border-y border-mist/15">
        {skills.map(([k, dot], i) => (
          <li key={k} className="group flex items-center gap-5 py-4 md:gap-8 md:py-6">
            <span aria-hidden className="font-mono text-sm text-mist">0{i + 1}</span>
            <span aria-hidden className={`size-3 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-[2.2] md:size-4 ${dot}`} />
            <span className={`font-display text-[clamp(2rem,6.5vw,5.75rem)] leading-none font-semibold tracking-tight transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover:translate-x-3 ${i % 2 ? "text-outline" : ""}`}>
              {t(`items.${k}`)}
            </span>
          </li>
        ))}
      </SlideRows>
      <Reveal className="max-w-3xl border-l-2 border-accent-soft pl-6 text-xl md:text-2xl">{t("sdg")}</Reveal>
    </section>
  );
}
