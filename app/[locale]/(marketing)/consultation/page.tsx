import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsultationForm, type FormLabels } from "@/components/sections/ConsultationForm";
import { PageHero } from "@/components/sections/PageHero";
import { programs } from "@/content/programs";
import { AUDIENCES, EMAIL, PHONE, PHONE_HREF } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ audience?: string; program?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.consultation" });
  return pageMetadata(locale, "/consultation", `${t("title")} — Coded`, t("metaDescription"));
}

// PLAN §3: every "Book a call" lands here (?audience=school|parent|student&program=<slug>).
export default async function ConsultationPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { audience, program } = await searchParams;
  const t = await getTranslations("pages.consultation");

  const labels: FormLabels = {
    audienceLegend: t("audienceLegend"),
    audience: Object.fromEntries(AUDIENCES.map((a) => [a, t(`audience.${a}`)])) as FormLabels["audience"],
    name: t("name"),
    email: t("email"),
    country: t("country"),
    program: t("program"),
    programs: [...programs.map((p) => ({ value: p.slug, label: p.name })), { value: "unsure", label: t("unsure") }],
    submit: t("submit"),
    sending: t("sending"),
    privacy: t("privacy"),
    errorSummary: t("errorSummary"),
    errors: t.raw("errors") as FormLabels["errors"],
    bookTitle: t("bookTitle"),
    bookBody: t("bookBody"),
    bookFrame: t("bookFrame"),
    bookFallback: t("bookFallback"),
  };
  const steps = t.raw("steps") as string[];

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <ConsultationForm labels={labels} defaults={{ audience, program }} />
        <aside aria-labelledby="next-title" className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-ink-2 p-8 lg:sticky lg:top-24">
          <h2 id="next-title" className="font-display text-xl font-semibold">{t("nextTitle")}</h2>
          <ol className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span aria-hidden className="font-mono text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-mist">{s}</span>
              </li>
            ))}
          </ol>
          <p className="border-t border-mist/15 pt-5 text-sm text-mist">
            {t("orWrite")}{" "}
            <a href={`mailto:${EMAIL}`} className="text-paper underline underline-offset-4">{EMAIL}</a>
            {" · "}<a href={PHONE_HREF} className="text-paper underline underline-offset-4">{PHONE}</a>
          </p>
        </aside>
      </div>
    </main>
  );
}
