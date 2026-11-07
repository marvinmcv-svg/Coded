import { sql } from "drizzle-orm";
import {
  boolean, check, date, integer, jsonb, numeric, pgEnum, pgTable, pgView, primaryKey, smallint, text, timestamp, uuid,
} from "drizzle-orm/pg-core";

// PLAN §6. Bilingual copy lives in *_es / *_en columns. Nullable fact columns stay NULL until the
// fact is ✅/🟡 in CONTENT_FACTS.md — the UI renders a fallback, never a guess.

export const programStatus = pgEnum("program_status", ["live", "upcoming", "archived"]);
export const cohortStatus = pgEnum("cohort_status", ["open", "few", "closed"]);
export const extensionTiming = pgEnum("extension_timing", ["pre", "during", "post"]);
export const mediaKind = pgEnum("media_kind", ["image", "video"]);

export const media = pgTable("media", {
  id: uuid().primaryKey().defaultRandom(),
  src: text().notNull(),
  kind: mediaKind().notNull(),
  width: integer(),
  height: integer(),
  alt_es: text(),
  alt_en: text(),
  // Minors: rows render only where consent = true (enforced in queries, lib/db/queries.ts).
  consent: boolean().notNull().default(false),
  source_note: text(),
});

export const programs = pgTable("programs", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  tagline_es: text(),
  tagline_en: text(),
  location_es: text(),
  location_en: text(),
  days: smallint(),
  duration_label_es: text(),
  duration_label_en: text(),
  age_min: smallint(),
  age_max: smallint(),
  english_level: text(),
  accommodation_note_es: text(),
  accommodation_note_en: text(),
  pathway: jsonb(), // { S|T|E|A|M: { workshop_es, workshop_en } }
  hero_media_id: uuid().references(() => media.id),
  status: programStatus().notNull().default("upcoming"),
  sort: smallint().notNull().default(0),
});

export const cohorts = pgTable(
  "cohorts",
  {
    id: uuid().primaryKey().defaultRandom(),
    program_id: uuid().notNull().references(() => programs.id, { onDelete: "cascade" }),
    start_date: date().notNull(),
    end_date: date(),
    registration_deadline: date(),
    price_from: numeric({ precision: 10, scale: 2 }),
    currency: text().notNull().default("USD"),
    hotel: text(),
    status: cohortStatus().notNull().default("open"),
  },
  (t) => [check("cohort_dates", sql`${t.end_date} is null or ${t.end_date} >= ${t.start_date}`)],
);

// Status is derived: a cohort that has started is closed whatever the stored value (fixes AUDIT C1).
export const cohortsPublic = pgView("cohorts_public").as((qb) =>
  qb
    .select({
      id: cohorts.id,
      program_id: cohorts.program_id,
      start_date: cohorts.start_date,
      end_date: cohorts.end_date,
      registration_deadline: cohorts.registration_deadline,
      price_from: cohorts.price_from,
      currency: cohorts.currency,
      hotel: cohorts.hotel,
      status: sql<"open" | "few" | "closed">`case when ${cohorts.start_date} <= current_date then 'closed'::cohort_status else ${cohorts.status} end`.as("status"),
    })
    .from(cohorts),
);

export const extensions = pgTable("extensions", {
  id: uuid().primaryKey().defaultRandom(),
  program_id: uuid().notNull().references(() => programs.id, { onDelete: "cascade" }),
  name_es: text().notNull(),
  name_en: text().notNull(),
  days: smallint(),
  timing: extensionTiming().notNull(),
  price: numeric({ precision: 10, scale: 2 }),
  currency: text().notNull().default("USD"),
});

export const teachers = pgTable("teachers", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  role_es: text(),
  role_en: text(),
  bio_es: text(),
  bio_en: text(),
  photo_media_id: uuid().references(() => media.id),
  consent: boolean().notNull().default(false),
  programs: text().array().notNull().default(sql`'{}'::text[]`),
});

export const policies = pgTable("policies", {
  key: text().notNull(),
  version: integer().notNull(),
  effective_date: date().notNull(),
  body_es: text().notNull(),
  body_en: text().notNull(),
}, (t) => [primaryKey({ columns: [t.key, t.version] })]);

export const stats = pgTable("stats", {
  key: text().primaryKey(),
  value: text().notNull(),
  label_es: text().notNull(),
  label_en: text().notNull(),
  source_note: text().notNull(), // no number without provenance
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
