import { expect, test } from "@playwright/test";
import { axeViolations } from "./helpers";
import es from "../../content/messages/es.json";
import en from "../../content/messages/en.json";

// Runs without ANTHROPIC_API_KEY, so Cody answers from the published FAQ (x-cody-mode: faq) — no network needed.
for (const [locale, m] of Object.entries({ es, en })) {
  test(`/${locale}: Cody opens, answers a suggested question from the FAQ, axe clean, Escape closes`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto(`/${locale}`);
    const launcher = page.getByRole("button", { name: m.cody.open });
    await launcher.click();
    const panel = page.getByRole("dialog", { name: m.cody.title });
    await expect(panel).toBeVisible();
    await expect(page.getByLabel(m.cody.placeholder)).toBeFocused();

    const faq = m.pages.faq.items[0]!;
    await panel.getByRole("button", { name: m.cody.suggestions[0]! }).click();
    await expect(panel).toContainText(faq.a);
    expect(await axeViolations(page)).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(launcher).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test("Cody hands over to the team when the FAQ has no answer, and rejects bad requests", async ({ request }) => {
  const res = await request.post("/api/cody", { data: { locale: "en", messages: [{ role: "user", content: "zzz qqq xyzzy" }] } });
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("info@coding-education.org");
  expect((await request.post("/api/cody", { data: { locale: "fr", messages: [] } })).status()).toBe(400);
  expect((await request.post("/api/cody", { data: { locale: "en", messages: [{ role: "assistant", content: "hi" }] } })).status()).toBe(400);
});
