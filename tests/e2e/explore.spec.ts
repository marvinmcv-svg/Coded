import { expect, test } from "@playwright/test";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";
import { allPhotos } from "../../content/gallery";
import { allEditions } from "../../content/programs";

test("/en/events lists every edition; past ones are marked completed, upcoming ones are in the future", async ({ page }) => {
  await page.goto("/en/events");
  const cards = page.locator("#calendar ol > li a");
  await expect(cards).toHaveCount(allEditions().length);
  const today = new Date().toISOString().slice(0, 10);
  for (const a of await cards.all()) {
    const date = (await a.locator("time").getAttribute("datetime"))!;
    const past = (await a.getAttribute("data-past")) !== null;
    expect(past, `${date}`).toBe(date <= today);
    await expect(a).toContainText(past ? en.home.events.completed : en.home.events.upcoming);
  }
});

test("/en/gallery filters by program and opens a keyboard-driven lightbox", async ({ page }) => {
  await page.goto("/en/gallery#europe-steam-league");
  const items = page.locator("main ul.columns-2 > li");
  await expect(items).toHaveCount(allPhotos().filter((p) => p.tag === "europe-steam-league").length);
  await page.getByRole("button", { name: new RegExp(`^${en.pages.gallery.all}`) }).click();
  await expect(items).toHaveCount(allPhotos().length);

  await items.nth(0).getByRole("button").click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("figcaption")).toContainText(`1 of ${allPhotos().length}`);
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("figcaption")).toContainText(`2 of ${allPhotos().length}`);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("phones get the header nav through the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");
  await page.locator("header summary", { hasText: es.home.nav.menu }).click();
  await page.locator('header details a[href="/es/projects"]').click();
  await expect(page).toHaveURL(/\/es\/projects$/);
  await expect(page.locator("header details[open]")).toHaveCount(0);
});
