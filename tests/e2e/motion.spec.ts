import { expect, test, type Page } from "@playwright/test";
import es from "../../content/messages/es.json";

// Tokyo cohort start (content/programs.ts) — midnight Tokyo time, as in Countdown.tsx.
const TOKYO = Date.parse("2027-08-02T00:00:00+09:00");
const countdown = (page: Page) => page.locator("#championship ul[aria-hidden] > li");
const forceFull = (page: Page) =>
  page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });

test.describe("full tier (desktop)", () => {
  test.skip(({ isMobile }) => isMobile, "full tier is desktop-only");

  test("hero scrubs on scroll; method line draws; countdown ticks", async ({ page }) => {
    await forceFull(page);
    await page.goto("/es");
    await page.waitForLoadState("networkidle");
    const copy = page.locator("[data-hero-copy]");
    await page.mouse.wheel(0, 500);
    await expect.poll(() => copy.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");

    await page.locator("#method").scrollIntoViewIfNeeded();
    await expect(page.locator("#method .origin-left")).toHaveCount(1);

    await page.locator("#championship").scrollIntoViewIfNeeded();
    await expect(countdown(page)).toHaveCount(4);
    const seconds = countdown(page).last().locator("span").first();
    const before = await seconds.textContent();
    await expect.poll(() => seconds.textContent(), { timeout: 3000 }).not.toBe(before);
  });
});

test.describe("globe (full tier, desktop)", () => {
  test.skip(({ isMobile }) => isMobile, "full tier is desktop-only");

  test("loads one shared canvas near the route and follows the active stop", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await forceFull(page);
    await page.goto("/es");
    await expect(page.locator("canvas")).toHaveCount(0); // never before the section is near
    const route = page.locator("[data-active-stop]");
    await route.scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.locator('[data-stop="3"]').evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(route).toHaveAttribute("data-active-stop", "3");
    // navigating away and back keeps a single canvas (persistent root)
    await page.getByRole("link", { name: "Tokyo STEAM Championship" }).first().click();
    await page.goBack();
    await page.locator("[data-active-stop]").scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
});

test.describe("static tier (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("no scrub, no line, countdown shows days only", async ({ page }) => {
    await forceFull(page);
    await page.goto("/es");
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    expect(await page.locator("[data-hero-copy]").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(page.locator("#method .origin-left")).toHaveCount(0);
    await page.locator("[data-active-stop]").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-stop]")).toHaveCount(4);
    await expect(page.locator("canvas")).toHaveCount(0);

    await expect(countdown(page)).toHaveCount(1);
    const days = Math.floor((TOKYO - Date.now()) / 864e5);
    await expect(page.locator("#championship .sr-only")).toHaveText(es.home.championship.countdown.sr.replace("{days}", String(days)));
  });
});
