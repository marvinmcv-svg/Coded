import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL } from "@/lib/links";

export type PageKey = "about" | "safety" | "worldCitizens" | "faq";
type Section = { title: string; body?: string; items?: string[] };
type Faq = { q: string; a: string };

export async function contentMetadata(locale: string, key: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `pages.${key}` });
  return { title: `${t("title")} — Coded`, description: t("metaDescription") };
}

/** Text pages rendered from `pages.<key>` in messages. Safety is calm (fade-only). */
export async function ContentPage({ pageKey }: { pageKey: PageKey }) {
  const t = await getTranslations(`pages.${pageKey}`);
  const th = await getTranslations("home.cta");
  const calm = pageKey === "safety";
  const sections = t.has("sections") ? (t.raw("sections") as Section[]) : [];
  const faqs = t.has("items") ? (t.raw("items") as Faq[]) : [];

  const jsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  return (
    <main id="main" className="mx-auto flex max-w-4xl flex-col gap-14 px-6 py-16">
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-4xl leading-tight font-semibold md:text-6xl">{t("title")}</h1>
        <p className="max-w-3xl text-lg text-mist">{t("intro")}</p>
      </header>

      {sections.map((s) => (
        <Reveal key={s.title} calm={calm} className="flex flex-col gap-4 border-t border-mist/20 pt-8">
          <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
          {s.body ? <p className="text-lg text-mist">{s.body}</p> : null}
          {s.items ? (
            <ul className="flex flex-col gap-2">
              {s.items.map((i) => <li key={i} className="flex gap-3"><span aria-hidden className="text-accent-soft">—</span>{i}</li>)}
            </ul>
          ) : null}
        </Reveal>
      ))}

      {faqs.length ? (
        <div className="flex flex-col divide-y divide-mist/20 border-y border-mist/20">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                {f.q}
                <span aria-hidden className="text-accent-soft transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      ) : null}

      <section className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-accent/15 p-8">
        <p className="text-lg">{th("body")}</p>
        <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={buttonClass("primary")}>{th("button")}</a>
      </section>
    </main>
  );
}
