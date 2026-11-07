import { defineRouting } from "next-intl/routing";

// PT is reserved (PLAN §0.3) but not shipped: add "pt" here + content/messages/pt.json when approved (Q28).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  localeDetection: false, // "/" always lands on /es (PLAN §0.3); no Accept-Language guessing
});

export type Locale = (typeof routing.locales)[number];
