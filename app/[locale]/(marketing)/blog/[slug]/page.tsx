import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { buttonClass } from "@/components/ui/Button";
import { getPost, postHtml, posts } from "@/content/blog";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { consultationHref } from "@/lib/links";
import { SITE_URL } from "@/lib/seo/meta";

export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

// Posts are English (Q29): one canonical (/en/blog/<slug>) for both locales, no hreflang pair.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const url = `/en/blog/${p.slug}`;
  return {
    title: `${p.title} — Coded`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { type: "article", siteName: "Coded", title: p.title, description: p.description, url, locale: "en_US", publishedTime: p.date, images: [{ url: "/media/og-home.jpg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: ["/media/og-home.jpg"] },
  };
}

export default async function PostPage({ params }: Params) {
  const { locale, slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("pages.blog");
  const format = await getFormatter();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    inLanguage: "en",
    mainEntityOfPage: `${SITE_URL}/en/blog/${p.slug}`,
    author: { "@type": "Organization", name: "Coded Academic Department" },
    publisher: { "@type": "EducationalOrganization", name: "Coded" },
  };

  return (
    <main id="main" className="mx-auto flex max-w-3xl flex-col gap-10 px-6 pt-12 pb-24 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/blog" className="intro-fade w-fit font-mono text-sm text-mist hover:text-paper">← {t("back")}</Link>
      <header className="flex flex-col gap-5">
        <p className="intro-fade flex flex-wrap gap-3 font-mono text-xs tracking-widest text-mist uppercase">
          <time dateTime={p.date}>{format.dateTime(new Date(`${p.date}T12:00:00Z`), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
          <span aria-hidden>·</span>
          <span>{t("byline")}</span>
        </p>
        <h1 lang="en" className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight">{p.title}</h1>
        {locale !== "en" ? <p className="rounded-2xl border border-mist/20 px-4 py-3 text-sm text-mist">{t("englishOnly")}</p> : null}
      </header>
      <article lang="en" className="prose-coded" dangerouslySetInnerHTML={{ __html: postHtml(p.slug) }} />
      <aside className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-accent/15 p-8">
        <p className="font-display text-2xl font-semibold">{t("ctaTitle")}</p>
        <Link prefetch={false} href={consultationHref()} className={buttonClass("primary")}>{t("cta")}</Link>
      </aside>
    </main>
  );
}
