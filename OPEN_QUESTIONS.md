# OPEN_QUESTIONS — for Marvin

Ordered by how much each one blocks. **P0 = blocks plan approval**, P1 = blocks the phase noted, P2 = before launch.

## Decisions — Marvin, 2026-11-07
- **Q0 domain:** keep the current setup for now; Marvin is confirming with the team. Site stays domain-agnostic (`SITE_URL`). *Still open.*
- **Q1 media consent:** ✅ photos and videos on Coded's websites and social media are cleared for use. Rule stays: no names beside faces;
  only Coded's own media (no logos, press, stock, AI images). Originals/high-res footage still wanted for video/scrub sections.
- **Q2 prices:** ✅ no prices on the site. Price block reads "Ask us about pricing" / "Consúltanos el precio".
- **Q31 palette:** ✅ use the current brand colours (from the live sites' CSS): violet `#7600e7`, lavender `#c5bbfd`, magenta `#ce36df`,
  blue `#3a9fd6`. Later, separate proposal: a black / grey / red direction (not started).
- **Q18 teachers:** ✅ show the teachers with names and photos. Delivery-partner names (Blueshift, Florida Film & STEM Academy) still unconfirmed → not shown.
- **Media:** ✅ Instagram @coded.education reels/photos may be used (same consent as the sites). Pulled via Firecrawl (influencers-club posts provider) into assets/raw/instagram.
- **Q7 durations/dates:** ✅ (2026-11-09) Orlando = 9 days, STEAM League AI = 12 days, Orlando July cohort = **Jul 9 2027**.
- **Q5 English level:** ✅ (2026-11-11) B1 for every program.
- **On hold:** WhatsApp (Q23), domain (Q0), legal pages (later). Prototype focus = UX/UI and motion.
- **Recommendations:** Marvin approved the remaining proposals (assumed: Supabase `/admin` for Q4, Next 16 for Q3, as already built).

## P0 — decide before P1 starts
0. **Two sites.** `codededucation.com` (newer: per-program pages, prices, teachers, FAQ) and `codingeducation.us` both live and self-canonical. Which domain is the rebuild's canonical? Does the other 301 into it? Which app domain: `app.codingeducation.us` or `app.codededucation.com`? *(The brief assumes .us; .com looks like where the team is heading.)*
1. **Original media.** Best site video is 720p and 308/404 images are < 1200 px. Cinematic hero/scrub sequences need originals: Drive/Dropbox of raw photos + footage (preferred) or the Instagram "Download your information" export. Which media has documented consent (minors)? Is the T&C media-release clause the consent basis?
2. **Prices.** .com already shows Orlando $4,590, Europe $6,490, AI $6,490 + extension prices. Confirm these are current and that "from $X" can be shown on the new site. Tokyo price?
3. **Next.js version.** Brief locks Next 15 (latest 15.5.29); current stable is **16.4.5**. Recommendation: Next 16 (React 19.3, stable Turbopack). OK, or keep 15?
4. **CMS / editors.** Who edits cohorts & content after launch? (Supabase `/admin` vs Sanity — see PLAN §6.)

## P1 — facts (block P2/P3 copy)
5. ~~English level per program: B1 or B2?~~ ✅ answered 2026-11-11 (B1, all programs).
6. School count: +200, +210 or +250? Countries list behind "+20". Source for "+55 % girls" and "+95 % satisfaction".
7. ~~Orlando: 9 or 10 days? AI League: 12 or 14 days? Orlando July cohort: Jul 8 or Jul 9 2027?~~ ✅ answered 2026-11-09 (see Decisions).
8. Orlando hotels per cohort (Stella Nova / Terra Luna / Cabana Bay)?
9. Tokyo workshop venue: Japanese school, United Nations University, or both? Tokyo price/duration (11 days?). Past Tokyo winners/projects we can show?
10. Cancellation policy: the program-page table and the FAQ disagree (120+ vs 60+ days, Semi-Flex vs Flex). Which is legally current?
11. **Supervision wording.** T&Cs say Coded "does not assume primary custodial supervision" (school leader responsible) while marketing says "Guardian is responsible at all times". What is the accurate, lawyer-approved statement for (a) school groups and (b) World Citizens?
12. Legal entity name: "Coding Education Experiences LLC" or "CODED EDUCATION EXPERIENCES LLC"?
13. Accreditation: STEM.org certificate IDs / verification URLs for "STEM Educational Program" and "Best in STEM".
14. United Nations: is there a written partnership (UNU Tokyo? UN SDG programme)? Without it we say "aligned with the UN SDGs" only.
15. Superlatives "only STEAM-certified programs in LATAM" / "first brand…" — keep (with basis) or drop?
16. Are STEAM Project Orlando, STEAM Quest Vancouver (EA campus), the Premier League program, and **STEAM Lab 360** (teacher certification) live, upcoming, or dropped? Should STEAM Lab 360 be a section of /schools?
17. Guardian "Monitoring" responsibility text and the "Our Vision" text (both empty today).

## P1 — people, partners, brand
18. Teachers: the 11 named on .com — current, consented, photos OK? May we name delivery partners **Blueshift Education** and **Florida Film & STEM Academy**?
19. Founders/team for /about (names, roles, photos).
20. Partner school logos with permission (search shows Colegio Granadino, Interamerican School, Academia Merici). Can we cite Colegio Granadino's 3rd place and the Mexican press feature (link?)?
21. Venue logos: assume **none** authorised (text-only mentions of NASA, Disney, Universal, etc.). Confirm. "Performing Arts Workshop by Disney" — is that an official Disney program name we may use?
22. Brand rule: "Coded" wordmark + "Coding Education" legal/domain — or "CODED" all-caps?
32. **Teachers per program.** Program pages don't list teachers yet: the .com bios only place Rayan Took and Carolina Capelo Garcia (London & Tokyo). Who teaches on each program?
33. **Media for Europe, AI and Tokyo.** Instagram's recent feed is mostly Orlando. Reels/photos from the UK and Tokyo editions (or the IG export, Q1) would give those pages a "last edition" diary like Orlando's.
31. **Brand palette & logo files.** No colour spec exists; `/styleguide` uses a provisional palette. The live favicon is violet — is there a brand guide (hex values, logo SVG, wordmark rules)? *(blocks P2 visual design)*

## P1 — integrations (block P5)
23. WhatsApp number (is +1 954 868 2367 WhatsApp-enabled, or a LATAM number?).
24. HubSpot: portal ID, which form + pipeline, the meetings link per audience (genesis25 only?). *Built (P5):* set `HUBSPOT_PORTAL_ID` +
    `HUBSPOT_FORM_ID` and /consultation also posts each lead to that form. The form needs fields `firstname`, `lastname`, `email`,
    `country`, `message` (audience/program go in `message` until custom properties exist; UTMs come from the landing URL as pageUri).
25. Reviews: Trustindex account access or Google Place ID for the Places API?
26. Analytics: existing GA4 / Meta Pixel IDs? Keep the Facebook domain-verification tag `px2ciu7qho5obgj4pnnn0fzgizmw03`.
    *Built (P5):* set `NEXT_PUBLIC_GA_ID` and a consent banner appears; GA4 loads only after "Accept". Unset ⇒ no banner, no analytics.
27. Store (`store.codingeducation.us`) and Sojourn Travel link — keep both in footer?

## P1 — Cody (AI receptionist)
35. **Cody API key + model.** Set `ANTHROPIC_API_KEY` (and optionally `CODY_MODEL`) in Vercel. Default model is Claude Opus 5.5 at low
    effort; a cheaper model (e.g. `claude-haiku-5-5`) is a one-variable change if cost matters more than answer quality — your call.
    Cody only repeats what the site publishes, so every 🔴 item stays unanswered (it hands over to the team). Should chats be logged
    (HubSpot, Supabase) for the sales team? Not built: needs a privacy-policy line first.

## P1 — media still held (audit 2026-11-11)
36. The live sites carry ~180 more images the rebuild does **not** use: Universal hotel rooms/pools (Q8: which hotel per cohort?),
    venue/landmark marketing shots (Tokyo Tower, teamLab, Lion King, Arsenal…), stock/AI illustrations, food photos, avatar badges,
    and 17 portraits from /steam-lab-360 (Q16). Photos showing third-party signage up close (NASA globe, Arsenal, Toyota, Epic
    Universe arch) are also held under the no-logos rule. Say if any of these should render. The 11 YouTube videos on the old sites
    need the original files or a YouTube embed (CSP change) — which do you prefer?

## P2
34. **Blog posts held or edited in migration (P6).** 24 of 27 posts are live at /en/blog/<slug>. Held (old URL → blog index) because
    they state 🔴 Coded facts: *Reimagining the Classroom* (13-day program, Florida Film Academy, "Disney Codeillusion"),
    *The Magic of Coded* (Vancouver program, "over 10 countries", "9-day", a school named in a photo credit), *Time to Play*
    ("Coded's Esports Academy"). One phrase redacted in each of: *What Is STEAM Education* ("9-day" → removed),
    *Behind the Scenes* ("21 schools" → "schools"), *The Magic of Power Skills* (CodeIllusion mention). Confirm, fix or drop.
28. Portuguese at launch?
29. Blog: migrate all 28 posts on both locales (EN only today) — translate to ES or ES-only for new posts?
30. Staging host: Vercel team/project name; who owns DNS?
