import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { programs } from "../../content/programs";
import es from "../../content/messages/es.json";

test("index lists all programs and links to each", async ({ page }) => {
  await page.goto("/es/programs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(es.programs.index.title);
  for (const p of programs) {
    await expect(page.getByRole("link", { name: p.name })).toHaveAttribute("href", `/es/programs/${p.slug}`);
  }
});

for (const p of programs) {
  for (const locale of ["es", "en"]) {
    test(`/${locale}/programs/${p.slug}: renders, axe clean, valid JSON-LD, no past dates`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

      await page.goto(`/${locale}/programs/${p.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.name);

      const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(ld["@type"]).toBe("Course");

      const today = new Date().toISOString().slice(0, 10);
      const dates = await page.locator("time[datetime]").evaluateAll((els) => els.map((e) => e.getAttribute("datetime")!));
      for (const d of dates) expect(d > today, `${d} is in the past`).toBe(true);

      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => v.id)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("unknown program slug is a 404", async ({ request }) => {
  expect((await request.get("/es/programs/not-a-program")).status()).toBe(404);
});
