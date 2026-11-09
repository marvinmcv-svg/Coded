import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import { programs } from "../../content/programs";
import es from "../../content/messages/es.json";

test("index lists all programs and links to each", async ({ page }) => {
  await page.goto("/es/programs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(es.programs.index.title);
  for (const p of programs) {
    await expect(page.getByRole("link", { name: p.name, exact: true })).toHaveAttribute("href", `/es/programs/${p.slug}`);
  }
});

test("departures calendar lists every upcoming cohort, in date order", async ({ page }) => {
  await page.goto("/es/programs");
  const today = new Date().toISOString().slice(0, 10);
  const expected = programs.flatMap((p) => p.cohorts).filter((d) => d > today).sort();
  const dates = await page.locator("#departures time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
  expect(dates).toEqual(expected);
});

test("recent editions list every past edition, newest first, all in the past and marked completed", async ({ page }) => {
  await page.goto("/es/programs");
  const today = new Date().toISOString().slice(0, 10);
  const expected = [...new Set(programs.flatMap((p) => [...p.pastEditions, ...p.cohorts.filter((d) => d <= today)]))].sort().reverse();
  const dates = await page.locator("#editions time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
  expect(dates).toEqual(expected);
  await expect(page.locator("#editions li").first()).toContainText(es.programs.index.completed);
});

for (const p of programs) {
  for (const locale of ["es", "en"]) {
    test(`/${locale}/programs/${p.slug}: renders, axe clean, valid JSON-LD, no past dates`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

      await page.goto(`/${locale}/programs/${p.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(p.name);

      const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(ld["@type"]).toBe("Course");

      const today = new Date().toISOString().slice(0, 10);
      // Upcoming dates must be in the future; the "past editions" line is the one deliberate exception.
      const dates = await page.locator("time[datetime]:not([data-past])").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
      for (const d of dates) expect(d > today, `${d} is in the past`).toBe(true);
      const past = await page.locator("time[data-past]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
      for (const d of past) expect(d <= today, `${d} is listed as past but is upcoming`).toBe(true);

      expect(await axeViolations(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("unknown program slug is a 404", async ({ request }) => {
  expect((await request.get("/es/programs/not-a-program")).status()).toBe(404);
});
