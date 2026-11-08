import { expect, test } from "@playwright/test";
import { PATHS, POST_PATHS } from "../../app/sitemap";

test.describe.configure({ mode: "parallel" });
test.skip(({ isMobile }) => isMobile, "same HTML on every device");

for (const locale of ["es", "en"]) {
  for (const path of PATHS) {
    test(`/${locale}${path}: canonical, hreflang, OG`, async ({ page, request }) => {
      await page.goto(`/${locale}${path}`);
      const href = (sel: string) => page.locator(sel).getAttribute("href");
      expect(new URL((await href('link[rel="canonical"]'))!).pathname).toBe(`/${locale}${path}`);
      for (const [lang, l] of [["es", "es"], ["en", "en"], ["x-default", "es"]]) {
        expect(new URL((await href(`link[rel="alternate"][hreflang="${lang}"]`))!).pathname).toBe(`/${l}${path}`);
      }
      const title = await page.title();
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect((await request.get(new URL(og!).pathname)).ok()).toBe(true);
      // not launched: every page is noindex until SITE_INDEXING=on
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });
  }
}

test("robots.txt blocks crawling before launch", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Disallow: \/\s*$/m);
});

test("sitemap lists every route in both locales and each resolves", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  expect(locs.sort()).toEqual([...PATHS.flatMap((p) => [`/es${p}`, `/en${p}`]), ...POST_PATHS].sort());
  for (const loc of locs) expect((await request.get(loc)).status(), loc).toBe(200);
  expect(xml).toContain('hreflang="x-default"');
});

test("blog posts: one English canonical from both locales, no hreflang pair, article metadata", async ({ page }) => {
  const path = POST_PATHS[0]!;
  for (const url of [path, path.replace(/^\/en/, "/es")]) {
    await page.goto(url);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).pathname).toBe(path);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator("article")).toHaveAttribute("lang", "en");
  }
});
