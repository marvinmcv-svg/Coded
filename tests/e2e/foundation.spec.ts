import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

const locales = { es, en } as const;

test("root redirects to the Spanish default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
});

for (const [locale, m] of Object.entries(locales)) {
  test.describe(`/${locale}/styleguide`, () => {
    test("renders localized, noindex, no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
      page.on("pageerror", (err) => errors.push(err.message));

      await page.goto(`/${locale}/styleguide`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(m.styleguide.title);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      expect(errors).toEqual([]);
    });

    test("axe: no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(`/${locale}/styleguide`);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  });
}

test("locale switch keeps the current page", async ({ page }) => {
  await page.goto("/es/styleguide");
  await page.getByRole("link", { name: es.common.otherLocaleName }).click();
  await expect(page).toHaveURL(/\/en\/styleguide$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.styleguide.title);
});

test("Reveal content is visible after scrolling into view", async ({ page }) => {
  await page.goto("/en/styleguide");
  const block = page.getByText(en.styleguide.motionReveal);
  await block.scrollIntoViewIfNeeded();
  await expect(block.locator("..")).toHaveCSS("opacity", "1", { timeout: 5000 });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("selects the static tier", async ({ page }) => {
    await page.goto("/en/styleguide");
    await expect(page.getByTestId("motion-tier")).toContainText("static");
  });
});
