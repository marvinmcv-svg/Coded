import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDb(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false }); // Supabase pooler (transaction mode) needs prepare: false
  return { db: drizzle(client, { schema, casing: "snake_case" }), client };
}
