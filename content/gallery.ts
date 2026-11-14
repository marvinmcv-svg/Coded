/**
 * Every Coded photo the site may show, grouped by the program page it was published on (codededucation.com /
 * codingeducation.us). Each program page shows its curated `gallery` (content/programs.ts); /gallery and /events show
 * the full set: that gallery plus `more` below. "life" = photos not tied to one program. Alt text: messages `media.<key>`.
 */
import type { BuiltImage } from "./media";
import { programs, type Program } from "./programs";

export type GalleryTag = Program["slug"] | "life";

const more: Record<Program["slug"], BuiltImage[]> = {
  "orlando-steam-league": ["orl-workbook", "orl-pitch-stage", "orl-main-street", "orl-dream-shirt", "orl-sketching", "orl-park-team", "orl-laptop", "orl-caps", "orl-tablet-pair", "orl-crowd-shirt"],
  "europe-steam-league": ["eu-street-group", "eu-campus", "eu-vr", "eu-oxford-guide", "eu-tower-bridge", "eu-thames-backpack", "eu-radcliffe", "eu-oxford-listen", "eu-laptop-focus", "eu-london-eye", "eu-st-pauls-bus", "eu-oxford-backpacks", "eu-museum-watches", "eu-oxford-walk-2", "eu-thames-portrait", "eu-oxford-spires", "eu-walk-river", "eu-oxford-theatre", "eu-station", "eu-oxford-street", "eu-tower-bridge-close", "eu-oxford-square", "eu-red-brick", "eu-oxford-chapel", "eu-oxford-carving"],
  "steam-league-ai": ["ai-bench-laptop", "ai-friends", "ai-hall", "ai-selfie", "ai-campus-walk", "ai-backpack"],
  "tokyo-steam-championship": ["tokyo-group", "tokyo-sensoji", "tokyo-akihabara", "tokyo-gates", "tokyo-street-phone", "tokyo-sake"],
};

const life: BuiltImage[] = ["classroom", "purple-laptop", "guardian-briefing", "hero-portrait"];

/** Full photo set for one program: its page gallery first, then the rest. */
export function programPhotos(slug: Program["slug"]): BuiltImage[] {
  const p = programs.find((x) => x.slug === slug)!;
  return [...new Set([...p.gallery, ...more[slug]])];
}

/** Every photo once (first program wins when a photo was published on two program pages). */
export function allPhotos(): { key: BuiltImage; tag: GalleryTag }[] {
  const seen = new Set<BuiltImage>();
  const out: { key: BuiltImage; tag: GalleryTag }[] = [];
  const add = (key: BuiltImage, tag: GalleryTag) => {
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ key, tag });
    }
  };
  for (const p of programs) for (const k of programPhotos(p.slug)) add(k, p.slug);
  for (const k of life) add(k, "life");
  return out;
}
