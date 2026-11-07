/**
 * Seeds only facts marked ✅/🟡 in CONTENT_FACTS.md. 🔴 values are left NULL (UI falls back):
 *  - Orlando & AI League days (9 vs 10, 12 vs 14), English level (B1/B2), Orlando July cohort date (Jul 8 vs 9)
 *  - All prices (Q2 unconfirmed) → price_from / price NULL ⇒ "Request pricing"
 *  - Teachers (consent), policies (C10 conflict), reviews (P4) are not seeded.
 * Idempotent: wipes and re-inserts seeded tables.  Usage: DATABASE_URL=… pnpm db:seed
 */
import { createDb } from "../lib/db/client";
import { programs } from "../content/programs";
import { cohorts, extensions, programs as programsTable, stats } from "../lib/db/schema";

const PROGRAMS = programs.map((p, i) => ({
  slug: p.slug, name: p.name, sort: i + 1, status: p.status,
  tagline_es: p.tagline.es, tagline_en: p.tagline.en,
  location_es: p.location.es, location_en: p.location.en, days: p.days,
  age_min: p.ages[0], age_max: p.ages[1],
}));

const COHORTS: Record<string, string[]> = Object.fromEntries(programs.map((p) => [p.slug, p.cohorts]));

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
