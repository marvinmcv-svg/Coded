import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

const pages = [
  ["about", "about"],
  ["safety", "safety"],
  ["world-citizens", "worldCitizens"],
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
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(m.pages[key].title);
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
