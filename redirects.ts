/**
 * Legacy URLs from codingeducation.us and codededucation.com (AUDIT crawl, PLAN §9) → new routes.
 * Path-based, so they work on whichever domain is chosen (Q0). 301 as planned; ES is the default locale.
 * Blog (P6): migrated posts keep their slug under /en/blog (English only, Q29); held posts (Q34), the old index, date
 * archives, authors and categories go to the blog index.
 * Not yet mapped (target page doesn't exist): legal pages, /login (needs APP_URL, Q0), /steam-lab-360 (Q16), /f.
 */
import blog from "./content/blog/posts.json";

const P = "/es/programs";

export const legacyRedirects: [source: string, destination: string][] = [
  ["/world-citizen", "/es/world-citizens"],
  ["/about-us", "/es/about"],
  ["/about-our-programs", P],
  ["/program", P],
  ["/landing", "/es"],
  ["/contact-us", "/es/contact"],
  ["/contact", "/es/contact"],
  ["/consultation", "/es/consultation"],
  ["/program/steam-league-orlando", `${P}/orlando-steam-league`],
  ["/program/orlando-steam-league-:edition", `${P}/orlando-steam-league`],
  ["/program/steam-league-europe", `${P}/europe-steam-league`],
  ["/program/europe-steam-league-:edition", `${P}/europe-steam-league`],
  ["/steam-league-europe-2026", `${P}/europe-steam-league`],
  ["/program/steam-league-ai", `${P}/steam-league-ai`],
  ["/program/steam-league-ai-:edition", `${P}/steam-league-ai`],
  ["/steam-league-ai-2026", `${P}/steam-league-ai`],
  ["/program/tokyo-steam-championship", `${P}/tokyo-steam-championship`],
  ["/blog", "/en/blog"],
  ...blog.posts.map((p): [string, string] => [`/${p.slug}`, `/en/blog/${p.slug}`]),
  ...blog.held.map((slug): [string, string] => [`/${slug}`, "/en/blog"]),
  ["/category/:path*", "/en/blog"],
  ["/author/:path*", "/en/blog"],
  ["/:year(\\d{4})/:path*", "/en/blog"],
];
