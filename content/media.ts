/**
 * Coded media that may render. Basis: Marvin confirmed 2026-11-07 that photos/videos on Coded's websites and social
 * media are cleared for use (OPEN_QUESTIONS Q1). Only Coded's own photos — no logos, press, stock or AI images.
 * No names beside faces. Files in public/media/ are webp derivatives of `source` (assets/raw/site, gitignored).
 * Alt text lives in content/messages/{es,en}.json under `media.<key>`.
 */
export type MediaKey = "hero" | "orlando-steam-league" | "europe-steam-league" | "steam-league-ai" | "tokyo-steam-championship";

type Media = { source: string; base: string; widths: number[]; ratio: [number, number] };

export const media: Record<MediaKey, Media> = {
  hero: { source: "2025_11_imagen-4-scaled-1.jpg", base: "hero-students", widths: [800, 1200], ratio: [4, 3] },
  "orlando-steam-league": { source: "2026_04_codeduni.jpg", base: "orlando-steam-league", widths: [640, 960], ratio: [960, 580] },
  "europe-steam-league": { source: "2026_04_sle-scaled-e1784558625724.jpg", base: "europe-steam-league", widths: [640, 960], ratio: [960, 510] },
  "steam-league-ai": { source: "2026_04_sl.jpg", base: "steam-league-ai", widths: [640, 960], ratio: [960, 553] },
  "tokyo-steam-championship": { source: "2026_07_coded-2-ago-073.jpg", base: "tokyo-steam-championship", widths: [640, 960], ratio: [960, 641] },
};

export function srcSet(key: MediaKey) {
  const m = media[key];
  return {
    src: `/media/${m.base}-${m.widths.at(-1)}.webp`,
    srcSet: m.widths.map((w) => `/media/${m.base}-${w}.webp ${w}w`).join(", "),
    width: m.ratio[0],
    height: m.ratio[1],
  };
}
