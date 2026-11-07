/**
 * Seeds only facts marked ✅/🟡 in CONTENT_FACTS.md. 🔴 values are left NULL (UI falls back):
 *  - Orlando & AI League days (9 vs 10, 12 vs 14), English level (B1/B2), Orlando July cohort date (Jul 8 vs 9)
 *  - All prices (Q2 unconfirmed) → price_from / price NULL ⇒ "Request pricing"
 *  - Teachers (consent), policies (C10 conflict), reviews (P4) are not seeded.
 * Idempotent: wipes and re-inserts seeded tables.  Usage: DATABASE_URL=… pnpm db:seed
 */
import { createDb } from "../lib/db/client";
import { cohorts, extensions, programs, stats } from "../lib/db/schema";

const PROGRAMS = [
  {
    slug: "orlando-steam-league", name: "Orlando STEAM League", sort: 1, status: "live",
    tagline_es: "¡Crea tu propia colonia espacial!", tagline_en: "Create your own space colony!",
    location_es: "Orlando, Florida", location_en: "Orlando, Florida", days: null,
  },
  {
    slug: "europe-steam-league", name: "Europe STEAM League", sort: 2, status: "live",
    tagline_es: "Portafolio digital de carreras STEAM", tagline_en: "STEAM Digital Career Portfolio",
    location_es: "Londres, Reino Unido", location_en: "London, United Kingdom", days: 12,
  },
  {
    slug: "steam-league-ai", name: "STEAM League AI", sort: 3, status: "live",
    tagline_es: "Estudio de innovación en IA", tagline_en: "AI Innovation Studio",
    location_es: "Bradfield College, Reino Unido", location_en: "Bradfield College, United Kingdom", days: null,
  },
  {
    slug: "tokyo-steam-championship", name: "Tokyo STEAM Championship", sort: 4, status: "upcoming",
    tagline_es: "Soluciones para ciudades y comunidades mejores",
    tagline_en: "Building Solutions for Better Cities and Communities",
    location_es: "Tokio, Japón", location_en: "Tokyo, Japan", days: 11,
  },
] as const;

const COHORTS: Record<string, string[]> = {
  "orlando-steam-league": ["2027-01-22", "2027-10-30"], // Jul 2027 omitted until Q7 resolves Jul 8 vs 9
  "europe-steam-league": ["2027-03-30"],
  "steam-league-ai": ["2027-07-09"],
  "tokyo-steam-championship": ["2027-08-02"],
};

type Ext = Omit<typeof extensions.$inferInsert, "program_id">;
const paris: Ext = { name_es: "Extensión París", name_en: "Paris extension", timing: "pre", days: null };
const edinburgh: Ext = { name_es: "Edimburgo y Liverpool", name_en: "Edinburgh & Liverpool", timing: "post", days: 3 };
const EXTENSIONS: Record<string, Ext[]> = {
  "europe-steam-league": [paris, edinburgh],
  "steam-league-ai": [paris, edinburgh],
  "tokyo-steam-championship": [{ name_es: "Osaka y Kioto", name_en: "Osaka & Kyoto", timing: "post", days: 2 }],
};

async function main() {
  const { db, client } = createDb();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(stats);
      await tx.delete(programs); // cascades to cohorts + extensions

      const rows = await tx
        .insert(programs)
        .values(PROGRAMS.map((p) => ({ ...p, age_min: 11, age_max: 17 })))
        .returning({ id: programs.id, slug: programs.slug });
      const idBySlug = Object.fromEntries(rows.map((r) => [r.slug, r.id]));

      await tx.insert(cohorts).values(
        Object.entries(COHORTS).flatMap(([slug, dates]) =>
          dates.map((start_date) => ({ program_id: idBySlug[slug]!, start_date })),
        ),
      );
      await tx.insert(extensions).values(
        Object.entries(EXTENSIONS).flatMap(([slug, exts]) => exts.map((e) => ({ ...e, program_id: idBySlug[slug]! }))),
      );
      await tx.insert(stats).values({
        key: "countries", value: "+20", label_es: "países", label_en: "countries",
        source_note: "codingeducation.us + codededucation.com landing pages, 2026-11-06 (CONTENT_FACTS §1 🟡)",
      });
    });
    console.log("Seeded programs, cohorts, extensions, stats.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
