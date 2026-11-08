import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { Championship } from "@/components/sections/Championship";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { Programs } from "@/components/sections/Programs";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Teachers } from "@/components/sections/Teachers";
import { Trust } from "@/components/sections/Trust";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

export const revalidate = 86400;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.schools" });
  return pageMetadata(locale, "/schools", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §1 (+20 countries 🟡), §3 (ages, daily structure from the .com guide, groups 🟡).
// Not shown until answered: STEAM Lab 360 (Q16), partner-school names/logos and results (Q20).
export default async function SchoolsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.schools");
  const facts = t.raw("facts") as { value: string; label: string }[];
  const days = t.raw("days") as { when: string; title: string; body: string }[];

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="classroom">
        <Magnetic>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={`${buttonClass("primary")} shadow-[0_10px_40px_-10px_rgb(118_0_231/.8)]`}>{t("cta")}</a>
        </Magnetic>
        <a href="#programs" className={buttonClass("ghost")}>{t("seePrograms")}</a>
      </PageHero>

      <section aria-label={t("factsLabel")} className="mx-auto max-w-7xl px-6">
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-2 bg-ink-2 p-7">
                <dt className="text-mist">{f.label}</dt>
                <dd className="font-display text-4xl font-semibold md:text-5xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <Programs />

      <section aria-labelledby="structure-title" className="mx-auto flex max-w-7xl flex-col gap-12 overflow-hidden px-6 pb-24">
        <SectionHeading id="structure-title" eyebrow={t("structureEyebrow")} title={t("structureTitle")} />
        <SlideRows className="flex flex-col">
          {days.map((d) => (
            <li key={d.when} className="grid grid-cols-[6rem_1fr] gap-6 border-t border-mist/15 py-7 md:grid-cols-[10rem_1fr_1.2fr] md:items-baseline">
              <span className="font-mono text-sm tracking-widest text-accent-soft uppercase">{d.when}</span>
              <h3 className="font-display text-2xl font-semibold md:text-3xl">{d.title}</h3>
              <p className="col-start-2 text-lg text-mist md:col-start-3">{d.body}</p>
            </li>
          ))}
        </SlideRows>
        <Reveal className="max-w-3xl border-l-2 border-accent-soft pl-6 text-lg text-mist">{t("structureNote")}</Reveal>
      </section>

      <Championship />
      <Teachers />
      <Trust />
      <CTA />
    </main>
  );
}
