/**
 * Seeds only facts marked ✅/🟡 in CONTENT_FACTS.md. 🔴 values are left NULL (UI falls back):
 *  - All prices (Q2 unconfirmed) → price_from / price NULL ⇒ "Request pricing"
 *  - Teachers (consent), policies (C10 conflict), reviews (P4) are not seeded.
 * Idempotent: wipes and re-inserts seeded tables.  Usage: DATABASE_URL=… pnpm db:seed
 */
import { createDb } from "../lib/db/client";
import { programs } from "../content/programs";
import es from "../content/messages/es.json";
import en from "../content/messages/en.json";
import { cohorts, extensions, programs as programsTable, stats } from "../lib/db/schema";

const PROGRAMS = programs.map((p, i) => ({
  slug: p.slug, name: p.name, sort: i + 1, status: p.status,
  tagline_es: es.programs[p.slug].tagline, tagline_en: en.programs[p.slug].tagline,
  location_es: es.programs[p.slug].location, location_en: en.programs[p.slug].location, days: p.days, english_level: p.englishLevel,
  age_min: p.ages[0], age_max: p.ages[1],
}));

const COHORTS: Record<string, string[]> = Object.fromEntries(programs.map((p) => [p.slug, p.cohorts]));

const EXT_NAMES = { es: es.programs.extensions, en: en.programs.extensions };
// London extra activities have no stated timing, so they are not seeded (timing is NOT NULL).
const EXTENSIONS = programs.flatMap((p) =>
  p.extensions
    .filter((e) => e.timing)
    .map((e) => ({ slug: p.slug, name_es: EXT_NAMES.es[e.key], name_en: EXT_NAMES.en[e.key], timing: e.timing!, days: e.days })),
);

async function main() {
  const { db, client } = createDb();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(stats);
      await tx.delete(programsTable); // cascades to cohorts + extensions

      const rows = await tx
        .insert(programsTable)
        .values(PROGRAMS)
        .returning({ id: programsTable.id, slug: programsTable.slug });
      const idBySlug = Object.fromEntries(rows.map((r) => [r.slug, r.id]));

      await tx.insert(cohorts).values(
        Object.entries(COHORTS).flatMap(([slug, dates]) =>
          dates.map((start_date) => ({ program_id: idBySlug[slug]!, start_date })),
        ),
      );
      await tx.insert(extensions).values(EXTENSIONS.map(({ slug, ...e }) => ({ ...e, program_id: idBySlug[slug]! })));
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
