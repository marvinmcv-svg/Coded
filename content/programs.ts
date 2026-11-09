/**
 * Non-text program facts (✅/🟡 in CONTENT_FACTS.md). All copy lives in content/messages/{es,en}.json under
 * `programs.<slug>`. 🔴 values are null and never render: Orlando & AI days (9/10, 12/14), English level,
 * prices (not shown: Marvin 2026-11-07 → "ask us about pricing"), Orlando July 2027 date (Jul 8 vs 9). Used by the site AND scripts/seed.ts.
 */
import type { BuiltImage, BuiltVideo } from "./media";

export type Extension = { key: "paris" | "edinburgh" | "londonExtra" | "osakaKyoto"; timing: "pre" | "post" | null; days: number | null };

export type Program = {
  slug: "orlando-steam-league" | "europe-steam-league" | "steam-league-ai" | "tokyo-steam-championship";
  name: string;
  status: "live" | "upcoming";
  accent: "steam-s" | "steam-t" | "steam-e" | "steam-a" | "steam-m";
  days: number | null;
  ages: [number, number];
  cohorts: string[]; // ISO start dates
  /** Editions already run, as published on codingeducation.us program pages (CONTENT_FACTS §3a). Passed cohorts join these automatically. */
  pastEditions: string[];
  extensions: Extension[];
  /** Coded photos published on this program's page (scripts/build-media.py). Alt text: messages `media.<key>`. */
  gallery: BuiltImage[];
  /** Reels from the last edition, in order; captions in messages `programs.<slug>.diary` (same length). */
  diary: BuiltVideo[];
};

const ukExtensions: Extension[] = [
  { key: "paris", timing: "pre", days: null },
  { key: "edinburgh", timing: "post", days: 3 },
  { key: "londonExtra", timing: null, days: null },
];

export const programs: Program[] = [
  { slug: "orlando-steam-league", name: "Orlando STEAM League", status: "live", accent: "steam-e", days: null, ages: [11, 17], cohorts: ["2027-01-22", "2027-10-30"], pastEditions: ["2026-07-26", "2026-10-30"], extensions: [], gallery: ["orl-tablet", "orl-sketch", "worksheet", "orl-colony", "tablets", "laptops-room"], diary: ["workshop-make", "workshop-class", "coding-tablet", "pitch-stage"] },
  { slug: "europe-steam-league", name: "Europe STEAM League", status: "live", accent: "steam-t", days: 12, ages: [11, 17], cohorts: ["2027-03-30"], pastEditions: ["2026-03-28"], extensions: ukExtensions, gallery: ["class-laptops", "vr", "lab", "activity", "lab-coat", "student-laptop", "boys-laptop", "london-steps"], diary: [] },
  { slug: "steam-league-ai", name: "STEAM League AI", status: "live", accent: "steam-m", days: null, ages: [11, 17], cohorts: ["2027-07-09"], pastEditions: ["2026-08-01"], extensions: ukExtensions, gallery: ["presenting", "uk-talk", "uk-lecture", "laptops-room"], diary: [] },
  { slug: "tokyo-steam-championship", name: "Tokyo STEAM Championship", status: "upcoming", accent: "steam-a", days: 11, ages: [11, 17], cohorts: ["2027-08-02"], pastEditions: [], extensions: [{ key: "osakaKyoto", timing: "post", days: 2 }], gallery: ["tokyo-portrait", "tokyo-build", "tokyo-museum", "tokyo-friends", "tokyo-metro", "tokyo-cap", "tokyo-gate", "tokyo-team", "tokyo-temple"], diary: [] },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}

const today = () => new Date().toISOString().slice(0, 10);

/** Cohorts strictly after today — past cohorts never show (AUDIT C1). */
export function upcomingCohorts(p: Program, now = today()): string[] {
  return p.cohorts.filter((d) => d > now).sort();
}

/** Editions already run, newest first: the published past editions plus any cohort whose start date has arrived. */
export function pastEditions(p: Program, now = today()): string[] {
  return [...new Set([...p.pastEditions, ...p.cohorts.filter((d) => d <= now)])].sort().reverse();
}

export function nextCohort(p: Program, now = today()): string | null {
  return upcomingCohorts(p, now)[0] ?? null;
}
