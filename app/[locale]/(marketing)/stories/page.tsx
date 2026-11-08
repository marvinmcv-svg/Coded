import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Diary } from "@/components/program/Diary";
import { CTA } from "@/components/sections/CTA";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { Reviews } from "@/components/sections/Reviews";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { getProgram } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.stories" });
  return pageMetadata(locale, "/stories", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §7 (verbatim Google reviews 🟡), §9a (Coded's own Instagram: Orlando diary, road-to-Tokyo countries 🟡).
// Not shown until answered: school names, the 3rd-place result and the press feature (Q20); students are never named.
export default async function StoriesPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.stories");
  const tc = await getTranslations("pages.championship");
  const countries = tc.raw("countries") as string[];

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="presenting" />

      {/* Reviews (text only) first: keeps the diary posters out of Chrome's early lazy-load range, so the hero stays fast. */}
      <Reviews />
      <Diary program={getProgram("orlando-steam-league")!} />
      <Gallery />

      <section aria-labelledby="road-title" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <SectionHeading id="road-title" eyebrow={tc("countriesEyebrow")} title={tc("countriesTitle")} />
        <Reveal className="flex flex-col items-start gap-8">
          <ul className="flex flex-wrap gap-3">
            {countries.map((c) => <li key={c} className="rounded-full border border-mist/25 px-4 py-2">{c}</li>)}
          </ul>
          <p className="text-lg text-mist">{t("roadBody")}</p>
          <Link href="/championship" className={buttonClass("ghost")}>{t("roadLink")} →</Link>
        </Reveal>
      </section>

      <CTA />
    </main>
  );
}
