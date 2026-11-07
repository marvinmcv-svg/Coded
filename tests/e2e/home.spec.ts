import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

const locales = { es, en } as const;

for (const [locale, m] of Object.entries(locales)) {
  test.describe(`/${locale} home`, () => {
    test("renders every section, no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
      page.on("pageerror", (err) => errors.push(err.message));

      await page.goto(`/${locale}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(m.home.hero.headline);
      for (const id of ["programs-title", "method-title", "skills-title", "championship-title", "safety-title", "contact-title"]) {
        await expect(page.locator(`#${id}`)).toBeVisible();
      }
      expect(errors).toEqual([]);
    });

    test("axe: no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(`/${locale}`);
      expect(await axeViolations(page)).toEqual([]);
    });
  });
}

test("no past cohort dates are shown", async ({ page }) => {
  await page.goto("/en");
  const today = new Date().toISOString().slice(0, 10);
  const dates = await page.locator("time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
  expect(dates.length).toBeGreaterThan(0);
  for (const d of dates) expect(d > today, `${d} is not in the future`).toBe(true);
});
