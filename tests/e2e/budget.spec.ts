import { gzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";

// CLAUDE.md quality gate: initial JS ≤ 200 KB gzipped per route.
// "Initial" = every script the server HTML references (script src + modulepreload). Code loaded later via
// dynamic import (e.g. the motion stack after idle) is excluded by design.
const BUDGET = 200 * 1024;
const ROUTES = ["/es", "/en", "/es/programs", "/es/programs/orlando-steam-league", "/es/styleguide", "/en/styleguide"];

test.describe.configure({ mode: "parallel" });

for (const route of ROUTES) {
  test(`initial JS ≤ 200 KB gz: ${route}`, async ({ request }, info) => {
    test.skip(info.project.name !== "desktop", "same HTML on every device");
    const html = await (await request.get(route)).text();
    const srcs = new Set(
      [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]!),
    );
    let total = 0;
    for (const src of srcs) total += gzipSync(await (await request.get(src)).body()).length;
    console.log(`${route}: ${(total / 1024).toFixed(1)} KB gz across ${srcs.size} scripts`);
    expect(total).toBeLessThanOrEqual(BUDGET);
  });
}
