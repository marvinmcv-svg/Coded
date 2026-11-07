/**
 * Non-text program facts (✅/🟡 in CONTENT_FACTS.md). All copy lives in content/messages/{es,en}.json under
 * `programs.<slug>`. 🔴 values are null and never render: Orlando & AI days (9/10, 12/14), English level,
 * prices (Q2), Orlando July 2027 date (Jul 8 vs 9). Used by the site AND scripts/seed.ts.
 */
export type Extension = { key: "paris" | "edinburgh" | "londonExtra" | "osakaKyoto"; timing: "pre" | "post" | null; days: number | null };

export type Program = {
  slug: "orlando-steam-league" | "europe-steam-league" | "steam-league-ai" | "tokyo-steam-championship";
  name: string;
  status: "live" | "upcoming";
  accent: "steam-s" | "steam-t" | "steam-e" | "steam-a" | "steam-m";
  days: number | null;
  ages: [number, number];
  cohorts: string[]; // ISO start dates
  extensions: Extension[];
};

const ukExtensions: Extension[] = [
  { key: "paris", timing: "pre", days: null },
  { key: "edinburgh", timing: "post", days: 3 },
  { key: "londonExtra", timing: null, days: null },
];

export const programs: Program[] = [
  { slug: "orlando-steam-league", name: "Orlando STEAM League", status: "live", accent: "steam-e", days: null, ages: [11, 17], cohorts: ["2027-01-22", "2027-10-30"], extensions: [] },
  { slug: "europe-steam-league", name: "Europe STEAM League", status: "live", accent: "steam-t", days: 12, ages: [11, 17], cohorts: ["2027-03-30"], extensions: ukExtensions },
  { slug: "steam-league-ai", name: "STEAM League AI", status: "live", accent: "steam-m", days: null, ages: [11, 17], cohorts: ["2027-07-09"], extensions: ukExtensions },
  { slug: "tokyo-steam-championship", name: "Tokyo STEAM Championship", status: "upcoming", accent: "steam-a", days: 11, ages: [11, 17], cohorts: ["2027-08-02"], extensions: [{ key: "osakaKyoto", timing: "post", days: 2 }] },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}

const today = () => new Date().toISOString().slice(0, 10);

/** Cohorts strictly after today — past cohorts never show (AUDIT C1). */
export function upcomingCohorts(p: Program, now = today()): string[] {
  return p.cohorts.filter((d) => d > now).sort();
}

export function nextCohort(p: Program, now = today()): string | null {
  return upcomingCohorts(p, now)[0] ?? null;
}
