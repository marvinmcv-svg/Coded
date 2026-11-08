import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import data from "./posts.json";

/**
 * Migrated codingeducation.us blog (scripts/build-blog.py). English only (Q29): each post's canonical is /en/blog/<slug>;
 * /es/blog/<slug> shows the same article in Spanish chrome with lang="en". Held posts (🔴 claims, Q34) 301 to the index.
 * Server-only: bodies are read and rendered at build time, so no markdown code ships to the browser.
 */
export type Post = (typeof data.posts)[number];

export const posts: Post[] = data.posts;
export const heldPosts: string[] = data.held;

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postHtml(slug: string): string {
  const md = fs.readFileSync(path.join(process.cwd(), "content", "blog", `${slug}.md`), "utf8");
  return marked.parse(md, { async: false });
}
