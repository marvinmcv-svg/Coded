import type { BuiltImage } from "./media";

/**
 * Coded's own YouTube videos (channel "CODED | Coding Education"), as embedded on codingeducation.us / codededucation.com.
 * Cleared with the rest of Coded's site/social media (OPEN_QUESTIONS Q1); embedded via YouTube per Marvin 2026-11-11 (Q36).
 * Covers are self-hosted (scripts/build-media.py → public/media/yt-<key>-*.webp): nothing loads from YouTube until a visitor
 * presses play. `cover` swaps in a Coded photo where the YouTube thumbnail shows stock footage, a brand mark or a school name.
 * Titles: messages `videos.items.<key>`.
 */
export type Video = { key: string; id: string; cover?: BuiltImage };

export const videos = {
  "orlando-2026": { key: "orlando-2026", id: "bh0uaHpQn9A" },
  "orlando-league": { key: "orlando-league", id: "eLflF74pC6Q", cover: "orl-campus" }, // same YouTube thumbnail as orlando-2026
  europe: { key: "europe", id: "Lru9srM6MYQ" },
  "europe-highlights": { key: "europe-highlights", id: "ZKMYAFb2aYg" },
  ai: { key: "ai", id: "jzq198Yj3hg" },
  tokyo: { key: "tokyo", id: "xXVRsuYtzIY", cover: "tokyo-team" },
  recap: { key: "recap", id: "JR7sYGq8s-8" },
  tours: { key: "tours", id: "LEztBopFafg", cover: "eu-st-pauls" },
  about: { key: "about", id: "Mqxn9qDaKoA" },
  "world-citizen": { key: "world-citizen", id: "FHyQJwQLNlM" },
  schools: { key: "schools", id: "4wy-AzYt8kI", cover: "classroom" },
} satisfies Record<string, Video>;

export type VideoKey = keyof typeof videos;

/** Videos per program page. */
export const programVideos: Record<string, VideoKey[]> = {
  "orlando-steam-league": ["orlando-2026", "orlando-league"],
  "europe-steam-league": ["europe", "europe-highlights"],
  "steam-league-ai": ["ai"],
  "tokyo-steam-championship": ["tokyo"],
};
