import type { Metadata } from "next";
import { routing } from "@/lib/i18n/routing";

/**
 * Canonical origin. SITE_URL wins (set it when the domain is chosen, Q0); on Vercel it falls back to the
 * project's production URL so canonicals/OG never point at localhost.
 */
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/** Search engines may index only when this is explicitly on — staging/vercel.app must not compete with the live sites. */
export const INDEXABLE = process.env.SITE_INDEXING === "on";

const OG_LOCALE = { es: "es_LA", en: "en_US" } as const;

/** `path` without locale, "" for home, e.g. "/programs/orlando-steam-league". */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${routing.defaultLocale}${path}`,
  };
}

/** Title/description + canonical, hreflang, Open Graph and Twitter card for one localized page. */
export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const url = `/${locale}${path}`;
  const images = [{ url: "/media/og-home.jpg", width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: "Coded",
      title,
      description,
      url,
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE] ?? OG_LOCALE.es,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
