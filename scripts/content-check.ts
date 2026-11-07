/**
 * Build gate (CLAUDE.md → Quality gates):
 *  1. Every i18n key exists in both ES and EN, with a non-empty string.
 *  2. If DATABASE_URL is set: no cohort with start_date <= today is stored as open/few.
 */
import es from "../content/messages/es.json";
import en from "../content/messages/en.json";

type Tree = { [k: string]: string | Tree };

function leaves(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(key, v);
    else for (const [kk, vv] of leaves(v, key)) out.set(kk, vv);
  }
  return out;
}

function i18nErrors(a: Tree, b: Tree): string[] {
  const [la, lb] = [leaves(a), leaves(b)];
  const errors: string[] = [];
  for (const [mine, theirs, name, other] of [[la, lb, "es", "en"], [lb, la, "en", "es"]] as const) {
    for (const [key, v] of mine) {
      if (!theirs.has(key)) errors.push(`missing in ${other}: ${key}`);
      if (!v.trim()) errors.push(`empty in ${name}: ${key}`);
    }
  }
  return errors;
}

async function cohortErrors(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    console.log("content:check — DATABASE_URL not set, skipping cohort check");
    return [];
  }
  const { createDb } = await import("../lib/db/client");
  const { client } = createDb();
  try {
    const rows = await client<{ slug: string; start_date: string; status: string }[]>`
      select p.slug, c.start_date::text, c.status::text
      from cohorts c join programs p on p.id = c.program_id
      where c.start_date <= current_date and c.status <> 'closed'`;
    return rows.map((r) => `past cohort still ${r.status}: ${r.slug} ${r.start_date}`);
  } finally {
    await client.end();
  }
}

async function main() {
  const errors = [...i18nErrors(es, en), ...(await cohortErrors())];
  if (errors.length) {
    console.error(`content:check failed (${errors.length}):\n  ${errors.join("\n  ")}`);
    process.exit(1);
  }
  console.log("content:check passed");
}

main();
