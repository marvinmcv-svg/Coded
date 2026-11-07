import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL } from "@/lib/links";
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
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">{t("title")}</h1>
        <p className="max-w-3xl text-lg text-mist">{t("intro")}</p>
      </header>

      <ol className="grid gap-6 md:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s}>
            <Reveal className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] bg-ink-2 p-7">
              <span aria-hidden className="font-mono text-sm text-accent-soft">0{i + 1}</span>
              <h2 className="font-display text-2xl font-semibold">{th(`method.steps.${s}.title`)}</h2>
              <p className="text-lg text-mist">{th(`method.steps.${s}.body`)}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="border-l-2 border-accent-soft pl-6 text-xl">{th("skills.sdg")}</Reveal>

      <section aria-labelledby="skills-title" className="flex flex-col gap-8">
        <h2 id="skills-title" className="font-display text-3xl font-semibold md:text-4xl">{t("skillsTitle")}</h2>
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {skills.map((k) => (
            <li key={k}>
              <Reveal className="flex flex-col gap-2 border-t border-mist/20 pt-5">
                <h3 className="font-display text-xl font-semibold">{th(`skills.items.${k}`)}</h3>
                <p className="text-mist">{t(`skills.${k}.body`)}</p>
                <p><span className="text-mist">{t("careersLabel")}:</span> {t(`skills.${k}.careers`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Reveal className="flex flex-col gap-3 border-t border-mist/20 pt-8">
        <h2 className="font-display text-2xl font-semibold">{t("groupsTitle")}</h2>
        <p className="text-lg text-mist">{t("groupsBody")}</p>
      </Reveal>

      <Reveal className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-accent/15 p-8">
        <h2 className="font-display text-2xl font-semibold">{th("cta.title")}</h2>
        <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{th("cta.button")}</a>
      </Reveal>
    </main>
  );
}
