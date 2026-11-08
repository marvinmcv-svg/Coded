import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.method" });
  return pageMetadata(locale, "/method", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §5 (🟡): 4-step path, SDG rule, power skills → careers (.us world-citizen); groups (.com FAQ).
const steps = ["experts", "workshops", "projects", "coding"] as const;
const skills = ["creativity", "collaboration", "adaptability", "problemSolving", "technical", "criticalThinking"] as const;

export default async function MethodPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.method");
  const th = await getTranslations("home");

  return (
    <main id="main">
      <PageHero eyebrow={th("method.eyebrow")} title={t("heroTitle")} intro={t("intro")} image="orl-sketch" />

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24">
        <ol className="grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s}>
              <Reveal className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] bg-ink-2 p-7">
                <span aria-hidden className="text-outline font-display text-7xl leading-none font-semibold">0{i + 1}</span>
                <h2 className="font-display text-2xl font-semibold">{th(`method.steps.${s}.title`)}</h2>
                <p className="text-lg text-mist">{th(`method.steps.${s}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="border-l-2 border-accent-soft pl-6 font-display text-2xl md:text-3xl">{th("skills.sdg")}</Reveal>

        <section aria-labelledby="skills-title" className="flex flex-col gap-8 overflow-hidden">
          <SectionHeading id="skills-title" eyebrow={th("skills.eyebrow")} title={t("skillsTitle")} />
          <SlideRows className="flex flex-col">
            {skills.map((k) => (
              <li key={k} className="grid gap-3 border-t border-mist/15 py-7 md:grid-cols-[1fr_1.4fr] md:gap-10">
                <h3 className="font-display text-2xl font-semibold md:text-3xl">{th(`skills.items.${k}`)}</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-lg">{t(`skills.${k}.body`)}</p>
                  <p className="text-mist">{t("careersLabel")}: {t(`skills.${k}.careers`)}</p>
                </div>
              </li>
            ))}
          </SlideRows>
        </section>

        <Reveal className="flex flex-col gap-3 border-t border-mist/20 pt-8">
          <h2 className="font-display text-2xl font-semibold">{t("groupsTitle")}</h2>
          <p className="text-lg text-mist">{t("groupsBody")}</p>
        </Reveal>
      </div>

      <CTA />
    </main>
  );
}
