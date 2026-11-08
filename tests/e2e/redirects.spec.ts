import { expect, test } from "@playwright/test";
import { legacyRedirects } from "../../redirects";

// Concrete legacy URLs seen in the audit crawl (trailing slashes as WordPress served them).
const samples: [string, string][] = [
  ...legacyRedirects.filter(([s]) => !s.includes(":")).map(([s, d]) => [`${s}/`, d] as [string, string]),
  ["/program/orlando-steam-league-october-2027/", "/es/programs/orlando-steam-league"],
  ["/program/europe-steam-league-easter-2026/", "/es/programs/europe-steam-league"],
  ["/program/steam-league-ai-summer-2026/", "/es/programs/steam-league-ai"],
  ["/2023/09/25/", "/en/blog"],
  ["/category/steam/steam-education/", "/en/blog"],
  ["/author/coded/", "/en/blog"],
];

test.skip(({ isMobile }) => isMobile, "server behaviour, device-independent");

for (const [from, to] of samples) {
  test(`${from} → 301 → ${to} (200)`, async ({ request }) => {
    let url = from;
    const hops: number[] = [];
    for (let i = 0; i < 4; i++) {
      const res = await request.get(url, { maxRedirects: 0 });
      if (res.status() < 300 || res.status() >= 400) {
        expect(res.status()).toBe(200);
        break;
      }
      hops.push(res.status());
      url = new URL(res.headers()["location"]!, "http://x").pathname;
    }
    expect(url).toBe(to);
    expect(hops).toContain(301);
  });
}
