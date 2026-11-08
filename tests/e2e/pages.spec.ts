import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";
import { reviews } from "../../content/reviews";

const pages = [
  ["schools", "schools"],
  ["world-citizens", "worldCitizens"],
  ["stories", "stories"],
  ["about", "about"],
  ["safety", "safety"],
  ["faq", "faq"],
  ["contact", "contact"],
  ["method", "method"],
] as const;

for (const [locale, m] of Object.entries({ es, en })) {
  for (const [path, key] of pages) {
    test(`/${locale}/${path}: renders, axe clean, no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

      await page.goto(`/${locale}/${path}`);
      const page_ = m.pages[key];
      // P4 pages lead with a hero line (heroTitle); the h1 name comes from aria-label on split headings.
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("heroTitle" in page_ ? page_.heroTitle : page_.title);
      expect(await axeViolations(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("FAQ exposes FAQPage JSON-LD matching the visible questions", async ({ page }) => {
  await page.goto("/en/faq");
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("FAQPage");
  expect(ld.mainEntity.map((q: { name: string }) => q.name)).toEqual(en.pages.faq.items.map((i) => i.q));
  await page.getByText(en.pages.faq.items[0]!.q).click();
  await expect(page.getByText(en.pages.faq.items[0]!.a)).toBeVisible();
});

test("header links reach the audience pages", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/es");
  const nav = page.getByRole("navigation", { name: es.home.nav.label });
  for (const path of ["schools", "world-citizens"]) await expect(nav.locator(`a[href="/es/${path}"]`)).toHaveCount(1);
});

test("/es/stories renders every verbatim review and the four Orlando diary reels", async ({ page }) => {
  await page.goto("/es/stories");
  await expect(page.locator("blockquote[lang]")).toHaveCount(reviews.length);
  await expect(page.locator(`section[aria-labelledby="diary-title"] ol > li`)).toHaveCount(es.programs["orlando-steam-league"].diary.length);
});

test("/es/schools lists only future departures", async ({ page }) => {
  await page.goto("/es/schools");
  const today = new Date().toISOString().slice(0, 10);
  const dates = await page.locator("time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
  expect(dates.length).toBeGreaterThan(0);
  for (const d of dates) expect(d > today, `${d} is in the past`).toBe(true);
});

test("footer links reach every content page", async ({ page }) => {
  await page.goto("/es");
  const footer = page.locator("footer");
  for (const [path] of pages) await expect(footer.locator(`a[href="/es/${path}"]`)).toHaveCount(1);
});

for (const [locale, m] of Object.entries({ es, en })) {
  test(`/${locale}/championship: renders, axe clean, future date only, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

    await page.goto(`/${locale}/championship`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(m.home.championship.title);
    await expect(page.getByRole("heading", { level: 3 })).toHaveCount(5); // the five road-to-Tokyo steps
    const today = new Date().toISOString().slice(0, 10);
    for (const d of await page.locator("time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!))) {
      expect(d > today, `${d} is in the past`).toBe(true);
    }
    expect(await axeViolations(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
