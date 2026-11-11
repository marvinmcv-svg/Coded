import { expect, test } from "@playwright/test";
import { videos } from "../../content/videos";
import en from "../../content/messages/en.json";

const YT = /youtube|ytimg|googlevideo/;

test("program videos make no YouTube request until play; play loads the youtube-nocookie player", async ({ page }) => {
  const ytRequests: string[] = [];
  page.on("request", (r) => YT.test(r.url()) && ytRequests.push(r.url()));
  await page.route("https://www.youtube-nocookie.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<!doctype html><title>stub</title>" }));
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/en/programs/orlando-steam-league");
  const play = page.getByRole("button", { name: `${en.videos.play}: ${en.videos.items["orlando-2026"]}` });
  await play.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(ytRequests).toEqual([]);

  await play.click();
  const frame = page.locator(`iframe[title="${en.videos.items["orlando-2026"]}"]`);
  await expect(frame).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${videos["orlando-2026"].id}?autoplay=1&rel=0&playsinline=1`);
  await expect.poll(() => ytRequests.some((u) => u.startsWith("https://www.youtube-nocookie.com/embed/"))).toBe(true);
  expect(errors).toEqual([]);
});

test("/stories lists every Coded video", async ({ page }) => {
  await page.goto("/en/stories");
  for (const k of Object.keys(videos) as (keyof typeof en.videos.items)[]) {
    await expect(page.getByRole("button", { name: `${en.videos.play}: ${en.videos.items[k]}`, exact: true })).toBeAttached();
  }
});
