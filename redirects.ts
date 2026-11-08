/**
 * Legacy URLs from codingeducation.us and codededucation.com (AUDIT crawl, PLAN §9) → new routes.
 * Path-based, so they work on whichever domain is chosen (Q0). 301 as planned; ES is the default locale.
 * Not yet mapped (target page doesn't exist): blog posts/archives (P6 migration), legal pages, /login (needs
 * APP_URL, Q0), /steam-lab-360 (Q16), /f, /steam-school.
 */
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
];
