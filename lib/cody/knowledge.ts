import en from "@/content/messages/en.json";
import es from "@/content/messages/es.json";
import { pastEditions, programs, upcomingCohorts } from "@/content/programs";
import { EMAIL, PHONE } from "@/lib/links";

/**
 * Cody's knowledge = the copy the site already publishes (content/messages, which only holds ✅/🟡 facts per
 * CONTENT_FACTS.md) + the structured program facts in content/programs.ts. Nothing else, so Cody can't say more than
 * the site does. Re-generated per request from the bundled JSON: editing the messages updates Cody too.
 */
export type Locale = "es" | "en";
const messages = { en, es } as const;
// Namespaces with facts a visitor might ask about. meta/styleguide/media/errors are UI plumbing, not answers.
const NAMESPACES = ["home", "programs", "pages"] as const;

function flatten(node: unknown, path: string, out: string[]) {
  if (typeof node === "string") {
    out.push(`${path}: ${node}`);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => flatten(v, `${path}[${i}]`, out));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) flatten(v, path ? `${path}.${k}` : k, out);
  }
}

export type Faq = { q: string; a: string };

export function faqs(locale: Locale): Faq[] {
  return messages[locale].pages.faq.items as Faq[];
}

export function programFacts(now?: string): string {
  return programs
    .map((p) => {
      const dates = upcomingCohorts(p, now);
      const past = pastEditions(p, now);
      return [
        `- ${p.name} (page /<locale>/programs/${p.slug})`,
        `  ages ${p.ages[0]}–${p.ages[1]}`,
        p.days ? `  ${p.days} days` : "  duration: ask the team",
        `  upcoming start dates: ${dates.length ? dates.join(", ") : "none published, ask the team"}`,
        past.length ? `  past editions (already completed, not bookable): ${past.join(", ")}` : "",
        p.extensions.length ? `  optional extensions: ${p.extensions.map((e) => e.key).join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
}

const cache = new Map<Locale, string>();

/** Site copy as `key.path: text` lines. Stable per locale (no dates), so it can sit in the cached prompt prefix. */
export function siteCopy(locale: Locale): string {
  let text = cache.get(locale);
  if (!text) {
    const lines: string[] = [];
    for (const ns of NAMESPACES) flatten(messages[locale][ns], ns, lines);
    text = lines.join("\n");
    cache.set(locale, text);
  }
  return text;
}

export const contact = { email: EMAIL, phone: PHONE };
