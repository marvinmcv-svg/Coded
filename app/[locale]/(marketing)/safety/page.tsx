import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { consultationHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.safety" });
  return pageMetadata(locale, "/safety", `${t("title")} — Coded`, t("metaDescription"));
}

type Group = { title: string; body?: string; items: string[] };

// CONTENT_FACTS §4 (🟡). Deliberately calm: fades only, light paper theme. Custody/"responsible at all times"
// wording, "Supervision" and the empty "Monitoring" duty are 🔴 (C16, Q11, Q17) and are not shown; nor is
// "24/7 supervision" (🔴 §1). Accommodation "24/7 on-site staff" is 🟡 (.com FAQ).
export default async function SafetyPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.safety");
  const tt = await getTranslations("home.trust");
  const groups = t.raw("groups") as Group[];
  const outing = t.raw("outing") as { title: string; body: string; steps: string[] };

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} image="tokyo-team" calm />

      <div className="bg-paper text-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-24">
          <Reveal calm className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-baseline">
            <h2 className="font-display text-3xl font-semibold md:text-5xl">{t("guardianTitle")}</h2>
            <p className="text-xl text-ink/75 md:text-2xl">{t("guardianBody")}</p>
          </Reveal>

          <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {groups.map((g) => (
              <li key={g.title}>
                <Reveal calm className="flex flex-col gap-4 border-t border-ink/15 pt-6">
                  <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
                  {g.body ? <p className="text-ink/75">{g.body}</p> : null}
                  <ul className="flex flex-col gap-2">
                    {g.items.map((i) => <li key={i} className="flex gap-3"><span aria-hidden className="text-accent">—</span>{i}</li>)}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal calm className="flex flex-col gap-8 rounded-[var(--radius-card)] bg-ink/5 p-8 md:p-12">
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-3xl font-semibold">{outing.title}</h2>
              <p className="text-lg text-ink/75">{outing.body}</p>
            </div>
            <ol className="grid gap-6 md:grid-cols-3">
              {outing.steps.map((s, i) => (
                <li key={s} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
                  <span aria-hidden className="font-display text-4xl font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg">{s}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal calm className="flex flex-col gap-3 border-t border-ink/15 pt-6">
            <h2 className="font-mono text-sm tracking-wide uppercase">{tt("credentials")}</h2>
            <ul className="flex flex-col gap-2">
              <li>{tt("sellerOfTravel")}</li>
              <li>{tt("stemOrg")}</li>
            </ul>
          </Reveal>

          <Reveal calm className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-ink p-8 text-paper md:p-12">
            <h2 className="font-display text-3xl font-semibold">{t("ctaTitle")}</h2>
            <p className="text-lg text-mist">{t("ctaBody")}</p>
            <Link prefetch={false} href={consultationHref()} className={buttonClass("primary")}>{t("cta")}</Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
