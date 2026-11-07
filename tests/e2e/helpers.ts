import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Scroll the whole page so every Reveal fires, then wait until nothing is mid-fade. */
export async function settleReveals(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await expect
    .poll(() => page.evaluate(() => [...document.querySelectorAll("main *")].filter((el) => !el.closest("[aria-hidden]") && Number(getComputedStyle(el).opacity) < 1).length), { timeout: 5000 })
    .toBe(0);
}

export async function axeViolations(page: Page) {
  await settleReveals(page);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}
