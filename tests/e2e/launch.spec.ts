import { expect, test, type Page } from "@playwright/test";
import { PATHS } from "../../app/sitemap";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

/** Console errors, minus the browser's own "Failed to load resource: 404" line on pages that are meant to 404. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => msg.type() === "error" && !/status of 404/.test(msg.text()) && errors.push(`${msg.text()} ${msg.location().url}`));
  return errors;
}

for (const [locale, m] of Object.entries({ es, en })) {
  for (const path of [`/${locale}/no-such-page`, `/${locale}/programs/no-such-program`, `/${locale}/blog/no-such-post`]) {
    test(`${path}: branded 404, noindex, axe clean`, async ({ page }) => {
      const errors = collectErrors(page);
      const res = await page.goto(path);
      expect(res!.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(m.errors.notFound.title);
      await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1); // stays after launch (SITE_INDEXING=on)
      await expect(page.getByRole("banner")).toBeVisible(); // marketing header still there
      await page.getByRole("main").getByRole("link", { name: m.errors.notFound.home }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
      expect(errors).toEqual([]);
    });
  }
}

test("a 404 page passes axe", async ({ page }) => {
  await page.goto("/es/no-such-page");
  expect(await axeViolations(page)).toEqual([]);
});

test("unprefixed unknown paths land on the Spanish 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res!.status()).toBe(404);
  expect(new URL(page.url()).pathname).toBe("/es/no-such-page");
});

test.describe("server", () => {
  test.skip(({ isMobile }) => isMobile, "device-independent");

  test("security headers on every response", async ({ request }) => {
    for (const url of ["/es", "/en/programs/orlando-steam-league", "/robots.txt", "/media/og-home.jpg"]) {
      const h = (await request.get(url)).headers();
      expect(h["content-security-policy"], url).toContain("frame-ancestors 'self'");
      expect(h["content-security-policy"], url).toContain("object-src 'none'");
      expect(h["x-content-type-options"], url).toBe("nosniff");
      expect(h["referrer-policy"], url).toBe("strict-origin-when-cross-origin");
      expect(h["strict-transport-security"], url).toMatch(/max-age=\d+/);
      expect(h["x-powered-by"], url).toBeUndefined();
    }
  });

  test("paths outside the two locales are a plain 404, never a server error", async ({ request }) => {
    for (const url of ["/favicon.ico", "/apple-touch-icon.png", "/wp-login.php"]) expect((await request.get(url)).status(), url).toBe(404);
  });

  test("program pages share their own link-preview card", async ({ page, request }) => {
    await page.goto("/es/programs/europe-steam-league");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(new URL(og!).pathname).toBe("/media/og-europe-steam-league.jpg");
    const res = await request.get(new URL(og!).pathname);
    expect(res.headers()["content-type"]).toBe("image/jpeg");
  });

  // Device matrix: smallest phone, tablet portrait/landscape. Desktop + Pixel 7 already run every other spec.
  // Scrolling the whole page also loads lazy media/3D, so a CSP violation anywhere shows up as a console error.
  const viewports = [
    { width: 320, height: 640 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ];
  for (const path of PATHS) {
    test(`/es${path}: no horizontal overflow or console errors at 320/768/1024`, async ({ page }) => {
      const errors = collectErrors(page);
      for (const vp of viewports) {
        await page.setViewportSize(vp);
        await page.goto(`/es${path}`);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 50));
          }
        });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${vp.width}px`).toBeLessThanOrEqual(0);
      }
      expect(errors).toEqual([]);
    });
  }
});
