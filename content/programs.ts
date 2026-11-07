/**
 * Single source for program facts until the Supabase CMS is live. Used by the site AND scripts/seed.ts.
 * Only ✅/🟡 facts from CONTENT_FACTS.md. 🔴 values are null and never render:
 *  - Orlando & AI days (9/10, 12/14), English level, prices (Q2), Orlando July 2027 date (Jul 8 vs 9).
 */
export type Program = {
  slug: string;
  name: string;
  status: "live" | "upcoming";
  accent: "steam-s" | "steam-t" | "steam-e" | "steam-a" | "steam-m";
  tagline: { es: string; en: string };
  location: { es: string; en: string };
  days: number | null;
  ages: [number, number];
  cohorts: string[]; // ISO start dates
};

export const programs: Program[] = [
  {
    slug: "orlando-steam-league", name: "Orlando STEAM League", status: "live", accent: "steam-e",
    tagline: { es: "¡Crea tu propia colonia espacial!", en: "Create your own space colony!" },
    location: { es: "Orlando, Florida", en: "Orlando, Florida" },
    days: null, ages: [11, 17], cohorts: ["2027-01-22", "2027-10-30"],
  },
  {
    slug: "europe-steam-league", name: "Europe STEAM League", status: "live", accent: "steam-t",
    tagline: { es: "Portafolio digital de carreras STEAM", en: "STEAM Digital Career Portfolio" },
    location: { es: "Londres, Reino Unido", en: "London, United Kingdom" },
    days: 12, ages: [11, 17], cohorts: ["2027-03-30"],
  },
  {
    slug: "steam-league-ai", name: "STEAM League AI", status: "live", accent: "steam-m",
    tagline: { es: "Estudio de innovación en IA", en: "AI Innovation Studio" },
    location: { es: "Bradfield College, Reino Unido", en: "Bradfield College, United Kingdom" },
    days: null, ages: [11, 17], cohorts: ["2027-07-09"],
  },
  {
    slug: "tokyo-steam-championship", name: "Tokyo STEAM Championship", status: "upcoming", accent: "steam-a",
    tagline: { es: "Soluciones para ciudades y comunidades mejores", en: "Building Solutions for Better Cities and Communities" },
    location: { es: "Tokio, Japón", en: "Tokyo, Japan" },
    days: 11, ages: [11, 17], cohorts: ["2027-08-02"],
  },
];

/** Next cohort strictly after today — past cohorts never show (AUDIT C1). */
export function nextCohort(p: Program, today = new Date().toISOString().slice(0, 10)): string | null {
  return p.cohorts.filter((d) => d > today).sort()[0] ?? null;
}
