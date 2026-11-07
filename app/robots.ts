import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/seo/meta";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/styleguide" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
