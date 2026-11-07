CREATE TYPE "public"."cohort_status" AS ENUM('open', 'few', 'closed');--> statement-breakpoint
CREATE TYPE "public"."extension_timing" AS ENUM('pre', 'during', 'post');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."program_status" AS ENUM('live', 'upcoming', 'archived');--> statement-breakpoint
CREATE TABLE "cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"registration_deadline" date,
	"price_from" numeric(10, 2),
	"currency" text DEFAULT 'USD' NOT NULL,
	"hotel" text,
	"status" "cohort_status" DEFAULT 'open' NOT NULL,
	CONSTRAINT "cohort_dates" CHECK ("cohorts"."end_date" is null or "cohorts"."end_date" >= "cohorts"."start_date")
);
--> statement-breakpoint
CREATE TABLE "extensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"days" smallint,
	"timing" "extension_timing" NOT NULL,
	"price" numeric(10, 2),
	"currency" text DEFAULT 'USD' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"src" text NOT NULL,
	"kind" "media_kind" NOT NULL,
	"width" integer,
	"height" integer,
	"alt_es" text,
	"alt_en" text,
	"consent" boolean DEFAULT false NOT NULL,
	"source_note" text
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"key" text NOT NULL,
	"version" integer NOT NULL,
	"effective_date" date NOT NULL,
	"body_es" text NOT NULL,
	"body_en" text NOT NULL,
	CONSTRAINT "policies_key_version_pk" PRIMARY KEY("key","version")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline_es" text,
	"tagline_en" text,
	"location_es" text,
	"location_en" text,
	"days" smallint,
	"duration_label_es" text,
	"duration_label_en" text,
	"age_min" smallint,
	"age_max" smallint,
	"english_level" text,
	"accommodation_note_es" text,
	"accommodation_note_en" text,
	"pathway" jsonb,
	"hero_media_id" uuid,
	"status" "program_status" DEFAULT 'upcoming' NOT NULL,
	"sort" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label_es" text NOT NULL,
	"label_en" text NOT NULL,
	"source_note" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role_es" text,
	"role_en" text,
	"bio_es" text,
	"bio_en" text,
	"photo_media_id" uuid,
	"consent" boolean DEFAULT false NOT NULL,
	"programs" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extensions" ADD CONSTRAINT "extensions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_photo_media_id_media_id_fk" FOREIGN KEY ("photo_media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."cohorts_public" AS (select "id", "program_id", "start_date", "end_date", "registration_deadline", "price_from", "currency", "hotel", case when "start_date" <= current_date then 'closed'::cohort_status else "status" end as "status" from "cohorts");