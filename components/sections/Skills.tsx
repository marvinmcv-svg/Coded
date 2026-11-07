import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const skills = [
  ["creativity", "border-steam-a/50"], ["collaboration", "border-steam-s/50"], ["adaptability", "border-steam-e/50"],
  ["problemSolving", "border-steam-t/50"], ["technical", "border-steam-m/50"], ["criticalThinking", "border-mist/40"],
] as const;

export async function Skills() {
  const t = await getTranslations("home.skills");
  return (
    <section aria-labelledby="skills-title" className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24">
      <SectionHeading id="skills-title" eyebrow={t("eyebrow")} title={t("title")} />
      <Reveal>
        <ul className="flex flex-wrap gap-3">
          {skills.map(([k, c]) => (
            <li key={k} className={`rounded-[var(--radius-pill)] border px-5 py-3 text-lg ${c}`}>{t(`items.${k}`)}</li>
          ))}
        </ul>
      </Reveal>
      <p className="max-w-2xl text-mist">{t("sdg")}</p>
    </section>
  );
}
