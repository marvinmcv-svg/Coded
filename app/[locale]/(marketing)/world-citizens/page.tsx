import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SlideRows } from "@/components/motion/SlideRows";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { Programs } from "@/components/sections/Programs";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { photo } from "@/content/media";
import { Link } from "@/lib/i18n/navigation";
import { consultationHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";
import { Videos } from "@/components/sections/Videos";

export const revalidate = 86400;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.worldCitizens" });
  return pageMetadata(locale, "/world-citizens", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §2 (apply in 3 steps, booking, Parent Portal forms 🟡) and §4 (Guardian, chat groups 🟡).
// "First brand to empower students from Latam…" is 🔴 (superlative) and is not used.
function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((i) => <li key={i} className="flex gap-3 border-b border-mist/10 py-3"><span aria-hidden className="text-accent-soft">—</span>{i}</li>)}
    </ul>
  );
}

export default async function WorldCitizensPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.worldCitizens");
  const tm = await getTranslations("media");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="tokyo-friends">
        <Magnetic>
          <Link prefetch={false} href={consultationHref({ audience: "parent" })} className={`${buttonClass("primary")} shadow-[0_10px_40px_-10px_rgb(118_0_231/.8)]`}>{t("cta")}</Link>
        </Magnetic>
        <a href="#apply" className={buttonClass("ghost")}>{t("howToApply")}</a>
      </PageHero>

      <section id="apply" aria-labelledby="apply-title" className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-12 overflow-hidden px-6 py-24">
        <SectionHeading id="apply-title" eyebrow={t("applyEyebrow")} title={t("applyTitle")} />
        <SlideRows className="flex flex-col">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-6 border-t border-mist/15 py-8 md:grid-cols-[8rem_1fr_1.2fr] md:items-baseline">
              <span aria-hidden className="font-display text-4xl font-semibold text-accent-soft md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl font-semibold md:text-3xl">{s.title}</h3>
              <p className="col-start-2 text-lg text-mist md:col-start-3">{s.body}</p>
            </li>
          ))}
        </SlideRows>
      </section>

      <section aria-labelledby="care-title" className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 md:grid-cols-2">
        <ClipReveal className="aspect-[4/5] rounded-[var(--radius-card)] bg-ink-2" from="left">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
          <img {...photo("tokyo-metro")} sizes="(min-width: 768px) 45vw, 90vw" alt={tm("tokyo-metro")} loading="lazy" decoding="async" className="size-full object-cover" />
        </ClipReveal>
        <div className="flex flex-col gap-8">
          <SectionHeading id="care-title" eyebrow={t("careEyebrow")} title={t("careTitle")} />
          <Reveal className="flex flex-col gap-6">
            <p className="text-lg text-mist">{t("careBody")}</p>
            <List items={t.raw("careItems") as string[]} />
            <Link href="/safety" className="w-fit font-semibold underline underline-offset-4">{t("safetyLink")} →</Link>
          </Reveal>
        </div>
      </section>

      <Programs />

      <section aria-labelledby="enroll-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <SectionHeading id="enroll-title" eyebrow={t("enrollEyebrow")} title={t("enrollTitle")} />
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-ink-2 p-8">
            <h3 className="font-display text-2xl font-semibold">{t("payTitle")}</h3>
            <List items={t.raw("payItems") as string[]} />
            <p className="text-mist">{t("price")}</p>
          </Reveal>
          <Reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-ink-2 p-8">
            <h3 className="font-display text-2xl font-semibold">{t("formsTitle")}</h3>
            <List items={t.raw("formsItems") as string[]} />
            <Link href="/faq" className="w-fit text-mist underline underline-offset-4 hover:text-paper">{t("faqLink")} →</Link>
          </Reveal>
        </div>
      </section>

      <Videos keys={["world-citizen"]} />
      <CTA />
    </main>
  );
}
