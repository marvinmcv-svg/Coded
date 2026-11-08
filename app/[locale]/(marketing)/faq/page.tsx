import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL, EMAIL, PHONE, PHONE_HREF } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };
type Faq = { q: string; a: string };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return pageMetadata(locale, "/faq", `${t("title")} — Coded`, t("metaDescription"));
}

// Answers from CONTENT_FACTS §2–4 (🟡) and Q2 (✅ no prices: "ask us"). Cancellation tiers (🔴 C10), English
// level and durations (🔴) are not answered here until confirmed.
export default async function FaqPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.faq");
  const faqs = t.raw("items") as Faq[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Reveal className="flex flex-col divide-y divide-mist/20 border-y border-mist/20">
          {faqs.map((f, i) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-baseline gap-5 font-display text-xl font-semibold md:text-2xl">
                <span aria-hidden className="font-mono text-sm text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 group-hover:text-accent-soft">{f.q}</span>
                <span aria-hidden className="text-2xl text-accent-soft transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 pl-10 text-lg text-mist">{f.a}</p>
            </details>
          ))}
        </Reveal>

        <aside aria-labelledby="ask-title" className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-accent/15 p-8 lg:sticky lg:top-24">
          <h2 id="ask-title" className="font-display text-2xl font-semibold">{t("askTitle")}</h2>
          <p className="text-mist">{t("askBody")}</p>
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{t("cta")}</a>
          <p className="text-sm text-mist">
            <a href={`mailto:${EMAIL}`} className="text-paper underline underline-offset-4">{EMAIL}</a>
            {" · "}<a href={PHONE_HREF} className="text-paper underline underline-offset-4">{PHONE}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}
