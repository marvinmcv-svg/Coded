import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { posts } from "@/content/blog";
import { Link } from "@/lib/i18n/navigation";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  return pageMetadata(locale, "/blog", `${t("title")} — Coded`, t("metaDescription"));
}

export default async function BlogIndex({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.blog");
  const format = await getFormatter();
  const [lead, ...rest] = posts;

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-mist/15 md:grid-cols-2 lg:grid-cols-3">
          {[lead!, ...rest].map((p, i) => (
            <li key={p.slug} className={`bg-ink ${i === 0 ? "md:col-span-2 lg:col-span-3" : ""}`}>
              <Reveal className="h-full">
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col gap-4 p-7 transition-colors hover:bg-ink-2 md:p-9">
                  <p className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest text-mist uppercase">
                    <time dateTime={p.date}>{format.dateTime(new Date(`${p.date}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
                    {p.categories.length ? (
                      <>
                        <span aria-hidden>·</span>
                        <span>{p.categories.join(", ")}</span>
                      </>
                    ) : null}
                  </p>
                  <h2 lang="en" className={`font-display font-semibold group-hover:text-accent-soft ${i === 0 ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"}`}>{p.title}</h2>
                  <p lang="en" className="text-mist">{p.description}</p>
                  <span aria-hidden className="mt-auto font-mono text-sm text-accent-soft">{t("read")} →</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
