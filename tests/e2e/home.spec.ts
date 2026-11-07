import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";
import { reviews } from "../../content/reviews";
import { teachers } from "../../content/teachers";

const locales = { es, en } as const;

for (const [locale, m] of Object.entries(locales)) {
  test.describe(`/${locale} home`, () => {
    test("renders every section, no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
      page.on("pageerror", (err) => errors.push(err.message));

      await page.goto(`/${locale}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(m.home.hero.headline);
      for (const id of ["programs-title", "method-title", "skills-title", "gallery-title", "championship-title", "teachers-title", "reviews-title", "safety-title", "contact-title"]) {
        await expect(page.locator(`#${id}`)).toBeVisible();
      }
      expect(errors).toEqual([]);
    });

    test("hero and program photos load with localized alt text", async ({ page }) => {
      await page.goto(`/${locale}`);
      const hero = page.getByRole("img", { name: m.media.hero, exact: true });
      await expect(hero).toHaveAttribute("fetchpriority", "high");
      const cards = page.locator("#programs img");
      await expect(cards).toHaveCount(4);
      for (const img of [hero, ...(await cards.all())]) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        expect(Object.values(m.media)).toContain(await img.getAttribute("alt"));
      }
    });

    test("axe: no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(`/${locale}`);
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test("reviews render verbatim, in their own language", async ({ page }) => {
  await page.goto("/en");
  const quotes = page.locator("#reviews blockquote");
  await expect(quotes).toHaveCount(reviews.length);
  for (const [i, r] of reviews.entries()) {
    await expect(quotes.nth(i)).toHaveAttribute("lang", r.lang);
    expect(await quotes.nth(i).textContent()).toBe(`“${r.text}”`);
  }
});

test("teachers render with names and roles", async ({ page }) => {
  await page.goto("/es");
  const items = page.locator("#teachers li");
  await expect(items).toHaveCount(teachers.length);
  for (const p of teachers) await expect(page.locator("#teachers h3", { hasText: p.name })).toHaveCount(1);
});

test("moving photo rows can be paused (WCAG 2.2.2)", async ({ page }) => {
  await page.goto("/en");
  const button = page.getByRole("button", { name: en.common.pause }).first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(page.getByRole("button", { name: en.common.play }).first()).toHaveAttribute("aria-pressed", "true");
});

test("no past cohort dates are shown", async ({ page }) => {
  await page.goto("/en");
  const today = new Date().toISOString().slice(0, 10);
  // cohort/event dates only — review dates (#reviews) are in the past by nature
  const dates = await page
    .locator("time[datetime]")
    .evaluateAll((els) => els.filter((e) => !e.closest("#reviews")).map((e) => e.getAttribute("datetime")!));
  expect(dates.length).toBeGreaterThan(0);
  for (const d of dates) expect(d > today, `${d} is not in the future`).toBe(true);
});
