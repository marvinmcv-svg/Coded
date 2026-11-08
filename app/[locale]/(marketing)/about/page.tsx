import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { TextReveal } from "@/components/motion/TextReveal";
import { CTA } from "@/components/sections/CTA";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Teachers } from "@/components/sections/Teachers";
import { programs } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return pageMetadata(locale, "/about", `${t("title")} — Coded`, t("metaDescription"));
}

// CONTENT_FACTS §1 (mission, "borderless STEAM school", offices, Seller of Travel, STEM.org, +20 countries 🟡), §5 (method 🟡).
// Not shown until answered: vision (🔴 empty), founders/team (Q19), UN partnership (Q14), superlatives (Q15), legal name (Q12).
const steps = ["experts", "workshops", "projects", "coding"] as const;

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");
  const tm = await getTranslations("home.method");
  const tt = await getTranslations("home.trust");
  const tf = await getTranslations("home.footer");
  const tp = await getTranslations("programs");

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="uk-lecture" />

      <section aria-labelledby="mission-title" className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-24">
        <p id="mission-title" className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-mist uppercase">
          <span aria-hidden className="h-px w-8 bg-accent-soft" />
          {t("missionLabel")}
        </p>
        <TextReveal>
          <blockquote className="max-w-6xl font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.08] font-semibold tracking-tight">
            <SplitWords text={t("mission")} />
          </blockquote>
        </TextReveal>
      </section>

      <section aria-labelledby="where-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <SectionHeading id="where-title" eyebrow={t("whereEyebrow")} title={t("whereTitle")} />
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <li key={p.slug} className="bg-ink-2">
              <Link href={`/programs/${p.slug}`} className="group flex h-full flex-col gap-2 p-7 hover:bg-ink-2/60">
                <span className="font-mono text-xs tracking-widest text-mist uppercase">{tp(`${p.slug}.location`)}</span>
                <span className="font-display text-xl font-semibold group-hover:text-accent-soft">{p.name} <span aria-hidden>→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="how-title" eyebrow={tm("eyebrow")} title={tm("title")} />
          <Link href="/method" className="shrink-0 font-semibold underline underline-offset-4">{tm("more")} →</Link>
        </div>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s}>
              <Reveal className="flex h-full flex-col gap-3 border-t border-mist/20 pt-5">
                <span aria-hidden className="text-outline font-display text-6xl leading-none font-semibold">0{i + 1}</span>
                <h3 className="font-display text-xl font-semibold">{tm(`steps.${s}.title`)}</h3>
                <p className="text-mist">{tm(`steps.${s}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Teachers />
      <Gallery />

      <section aria-labelledby="credentials-title" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <Reveal className="flex flex-col gap-4">
          <h2 id="credentials-title" className="font-display text-3xl font-semibold">{tt("credentials")}</h2>
          <ul className="flex flex-col">
            {[tt("sellerOfTravel"), tt("stemOrg"), tt("countries")].map((c) => (
              <li key={c} className="flex gap-3 border-b border-mist/10 py-3"><span aria-hidden className="text-accent-soft">—</span>{c}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-semibold">{tf("offices")}</h2>
          <ul className="flex flex-col">
            {[tf("miami"), tf("london")].map((o) => (
              <li key={o} className="flex gap-3 border-b border-mist/10 py-3"><span aria-hidden className="text-accent-soft">—</span>{o}</li>
            ))}
          </ul>
          <Link href="/contact" className="w-fit font-semibold underline underline-offset-4">{t("contactLink")} →</Link>
        </Reveal>
      </section>

      <CTA />
    </main>
  );
}
