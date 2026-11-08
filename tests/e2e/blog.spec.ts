import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import { posts } from "../../content/blog";
import { PATHS, POST_PATHS } from "../../app/sitemap";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

for (const [locale, m] of Object.entries({ es, en })) {
  test(`/${locale}/blog lists every migrated post, axe clean, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    await page.goto(`/${locale}/blog`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(m.pages.blog.heroTitle);
    await expect(page.locator("main ol > li")).toHaveCount(posts.length);
    expect(await axeViolations(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("a post renders its article, axe clean, with no links back to the old site", async ({ page }) => {
  const p = posts.find((x) => x.slug === "what-is-steam-education")!;
  await page.goto(`/en/blog/${p.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
  await expect(page.locator("article h2").first()).toBeVisible();
  await expect(page.locator('article a[href*="codingeducation.us"]')).toHaveCount(0);
  // the 🔴 "9-day" claim is redacted (scripts/build-blog.py, Q34)
  await expect(page.locator("article")).not.toContainText("9-day");
  expect(await axeViolations(page)).toEqual([]);
});

test("every migrated post responds 200 with its title", async ({ request }, info) => {
  test.skip(info.project.name !== "desktop", "server output, device-independent");
  for (const p of posts) {
    const html = await (await request.get(`/en/blog/${p.slug}`)).text();
    expect(html, p.slug).toContain(p.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;"));
  }
});

test("zero broken internal links across every sitemap page", async ({ request }, info) => {
  test.skip(info.project.name !== "desktop", "server output, device-independent");
  test.setTimeout(180_000);
  const pages = [...PATHS.flatMap((p) => [`/es${p}`, `/en${p}`]), ...POST_PATHS];
  const links = new Map<string, string>(); // href → first page it was seen on
  for (const url of pages) {
    const html = await (await request.get(url)).text();
    for (const [, raw] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
      const href = raw!.replace(/&amp;/g, "&");
      if (href.startsWith("/") && !href.startsWith("//") && !links.has(href.split("#")[0]!)) links.set(href.split("#")[0]!, url);
    }
  }
  const broken: string[] = [];
  for (const [href, from] of links) {
    const res = await request.get(href, { maxRedirects: 0 });
    if (res.status() !== 200) broken.push(`${href} (${res.status()}) on ${from}`);
  }
  expect(links.size).toBeGreaterThan(30);
  expect(broken).toEqual([]);
});
