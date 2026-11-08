import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

const c = es.pages.consultation;

// The booking step embeds HubSpot; stub it so tests never depend on the network.
test.beforeEach(async ({ page }) => {
  await page.route("https://meetings.hubspot.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<!doctype html><title>stub</title>" }));
});

for (const [locale, m] of Object.entries({ es, en })) {
  test(`/${locale}/consultation: renders, axe clean, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    await page.goto(`/${locale}/consultation`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(m.pages.consultation.heroTitle);
    expect(await axeViolations(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("query string preselects audience and program", async ({ page }) => {
  await page.goto("/es/consultation?audience=school&program=tokyo-steam-championship");
  await expect(page.getByRole("radio", { name: c.audience.school })).toBeChecked();
  await expect(page.getByLabel(c.program)).toHaveValue("tokyo-steam-championship");
});

test("empty submit shows an error summary and marks each field invalid (axe clean)", async ({ page }) => {
  await page.goto("/es/consultation");
  await page.getByRole("button", { name: c.submit }).click();
  const alert = page.locator("form").getByRole("alert");
  await expect(alert).toBeFocused();
  for (const f of ["audience", "name", "email", "country"] as const) await expect(alert).toContainText(c.errors[f]);
  await expect(page.getByLabel(c.email)).toHaveAttribute("aria-invalid", "true");
  expect(await axeViolations(page)).toEqual([]);
});

test("valid submit opens the booking calendar prefilled, carrying the landing URL", async ({ page }) => {
  await page.goto("/es?utm_source=newsletter&utm_campaign=p5");
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("coded_landing"))).toContain("utm_source=newsletter");
  await page.goto("/es/consultation?audience=parent");
  await expect(page.locator('input[name="landing"]')).toHaveValue(/utm_source=newsletter/);

  await page.getByLabel(c.name).fill("Ana María López");
  await page.getByLabel(c.email).fill("ana@example.com");
  await page.getByLabel(c.country).fill("Colombia");
  await page.getByRole("button", { name: c.submit }).click();

  await expect(page.getByRole("heading", { name: c.bookTitle })).toBeFocused();
  const src = await page.getByTitle(c.bookFrame).getAttribute("src");
  const url = new URL(src!);
  expect(url.origin + url.pathname).toBe("https://meetings.hubspot.com/genesis25");
  expect(Object.fromEntries(url.searchParams)).toEqual({ embed: "true", firstName: "Ana", lastName: "María López", email: "ana@example.com" });
});

test("Book a call buttons route through the qualifier with audience/program", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("main").getByRole("link", { name: es.home.hero.ctaPrimary }).first()).toHaveAttribute("href", "/es/consultation");
  await page.goto("/es/schools");
  await expect(page.locator("main").getByRole("link", { name: es.pages.schools.cta }).first()).toHaveAttribute("href", "/es/consultation?audience=school");
  await page.goto("/es/programs/europe-steam-league");
  await expect(page.locator("main").getByRole("link", { name: es.programs.detail.cta }).first()).toHaveAttribute("href", "/es/consultation?program=europe-steam-league");
  // nothing should still open the raw HubSpot link in a new tab
  await expect(page.locator('a[href^="https://meetings.hubspot.com"]')).toHaveCount(0);
});

test("no analytics and no consent banner while no analytics ID is configured", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", (r) => /googletagmanager|google-analytics|facebook/.test(r.url()) && thirdParty.push(r.url()));
  await page.goto("/es");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: es.common.consent.accept })).toHaveCount(0);
  expect(thirdParty).toEqual([]);
});

test("phones: the Book a call pill appears after the hero, not on /consultation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone-only control");
  await page.goto("/es/schools");
  const pill = page.locator("div.fixed").getByRole("link", { name: es.common.bookCall });
  // Present but faded out and inert until the hero is scrolled past.
  await expect(pill.locator("..")).toHaveAttribute("inert", "");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await expect(pill.locator("..")).not.toHaveAttribute("inert", "");
  await expect(pill.locator("..")).toHaveCSS("opacity", "1");
  await expect(pill).toHaveAttribute("href", "/es/consultation");
  await page.goto("/es/consultation");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await expect(page.locator("div.fixed").getByRole("link", { name: es.common.bookCall })).toHaveCount(0);
});
