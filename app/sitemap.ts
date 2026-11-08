import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { routing } from "@/lib/i18n/routing";
import { languageAlternates, SITE_URL } from "@/lib/seo/meta";

/** Every public marketing route × locale, each listing its hreflang siblings. Styleguide is excluded (noindex). */
export const PATHS = ["", "/programs", "/championship", ...programs.map((p) => `/programs/${p.slug}`), "/about", "/safety", "/world-citizens", "/faq", "/contact", "/method"];

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${SITE_URL}${p}`;
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(`/${locale}${path}`),
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, abs(v)])),
      },
    })),
  );
}
