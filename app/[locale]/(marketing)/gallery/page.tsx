import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/sections/PageHero";
import { PhotoGrid, type GridPhoto } from "@/components/sections/PhotoGrid";
import { allPhotos } from "@/content/gallery";
import { photo } from "@/content/media";
import { programs } from "@/content/programs";
import { pageMetadata } from "@/lib/seo/meta";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });
  return pageMetadata(locale, "/gallery", `${t("title")} — Coded`, t("metaDescription"));
}

/** Every Coded photo the site may show (content/gallery.ts), filterable by program. No names beside faces. */
export default async function GalleryPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.gallery");
  const tm = await getTranslations("media");

  const photos: GridPhoto[] = allPhotos().map(({ key, tag }) => ({ key, tag, alt: tm(key), ...photo(key) }));
  const filters = [
    { tag: "all", label: t("all") },
    ...programs.map((p) => ({ tag: p.slug, label: p.name })),
    { tag: "life", label: t("life") },
  ];

  return (
    <main id="main">
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} intro={t("intro")} />
      <PhotoGrid
        photos={photos}
        filters={filters}
        labels={{ filter: t("filterLabel"), open: t("open"), close: t("close"), prev: t("prev"), next: t("next"), position: t.raw("position") as string, count: t.raw("count") as string }}
      />
      <CTA />
    </main>
  );
}
