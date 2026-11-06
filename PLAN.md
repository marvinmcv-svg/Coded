# PLAN — Coded 2.0 (Phase P0 deliverable — awaiting Marvin's approval)

Inputs: `AUDIT.md` (measured), `CONTENT_FACTS.md` (sourced claims), `OPEN_QUESTIONS.md` (blockers),
`assets/manifest.json` (415 media items). Karpathy rules in `CLAUDE.md` govern execution.

## 0. Assumptions (stated, not guessed — each reversible)
1. One canonical domain (TBD Q0); the other 301s into it. Plan is domain-agnostic: `SITE_URL` env.
2. Program pages are **per program, with cohorts as data** (matches .com structure and the brief).
3. ES default (`/es`), EN second; PT slot reserved in `i18n/config.ts` but not shipped.
4. Prices shown as "desde / from $X" if Q2 approved; otherwise the price block renders "Request pricing" from the same data.
5. Until originals arrive, design work uses manifest media flagged OK + art-directed gradients/3D — **no stock, no AI imagery**.

## 1. Positioning — 3 alternatives to the brief's line
| | ES | EN |
|---|---|---|
| A (brief) | El mundo es el aula. Tu proyecto, el futuro. | The world is the classroom. Your project is the future. |
| B | Aprende donde el futuro se construye. | Learn where the future is built. |
| C | De tu aula a Tokio. | From your classroom to Tokyo. *(the League → Championship spine)* |
| D | Viajan como estudiantes. Vuelven como creadores. | They leave as students. They return as creators. |
Recommendation: **A** as hero, **C** as the championship section line.

## 2. Sitemap (brief §6.2 + audit adjustments)
```
/[locale]                      Home
/[locale]/programs             Index + global cohort calendar (auto-hides past)
/[locale]/programs/[slug]      orlando-steam-league · europe-steam-league · steam-league-ai · tokyo-steam-championship
/[locale]/championship         Tokyo story
/[locale]/schools              B2B  (+ STEAM Lab 360 teacher certification section, if Q16 = live)
/[locale]/world-citizens       Families / individual students
/[locale]/safety               Guardian model, health, protocol (+ printable PDF via print stylesheet)
/[locale]/method · /about · /stories · /faq · /consultation · /contact
/[locale]/blog, /blog/[slug]   28 posts migrated, slugs kept
/[locale]/legal/{privacy,cookies,terms}
/styleguide                    tokens + components (noindex)
/admin                         editors (Supabase Auth)
```
Note: slug `steam-league-ai` (not `europe-steam-league-ai`) — matches the live .com URL and the program's own name; saves a redirect.

## 3. Funnel rules
- **Talk to us** → `/consultation?audience=school|parent|student&program=…` (HubSpot meetings embed + 5-field qualifier). Retires `/contact-us`, `/consultation`, raw HubSpot links.
- **Enroll** → `${APP_URL}/register?program=…&cohort=…` (APP_URL per Q0). **Payments** → `${APP_URL}/login` (fixes wp-login bug).
- Audience switch in hero (School / Parent / Student) → cookie `coded_audience`; reorders 3 home sections + swaps CTA copy. No login.
- Persistent pill (Book a call · Enroll) after hero; WhatsApp button (Q23).

## 4. Component inventory
```
components/ui/        Button, Link, Chip(status), Accordion, Tabs, Dialog, Sheet, Input, Select, Toast — shadcn, restyled
components/motion/    SmoothScroll(Lenis↔GSAP), Reveal, SplitHeading, Magnetic, PinSection, ScrubSequence, Counter, useMotionTier()
components/three/     CanvasRoot (single <Canvas>, drei <View>), Globe, ParticleLogo, SteamLetters, Constellation, scenes/
components/sections/  Hero, AudienceSwitch, ProofStrip, GlobePrograms, MissionTimeline, Pathway, Method, Skills,
                      Championship, Stories, TrustWall, Stats, CTASplit, Footer
components/program/   KeyFacts, CohortSelector, Classrooms, Teachers, MissionBrief, Itinerary, Inclusions, PriceBlock, ApplySteps, StickyApply
components/seo/       JsonLd (Organization, EducationalOrganization, Course+CourseInstance, Event, FAQPage, Review, BreadcrumbList)
```
**One motion system:** GSAP for scroll/timeline + UI micro-interactions (no framer-motion — one fewer library).
**One 3D strategy:** one persistent `<Canvas>` + drei `<View>` portals (no tunnel-rat needed; drei covers it).

`useMotionTier()` → `'static' | 'lite' | 'full'` from `prefers-reduced-motion`, viewport < 768, `hardwareConcurrency`/`deviceMemory`, `detect-gpu` tier. Every motion component reads it; **static is designed, not degraded** (art-directed posters).

## 5. Motion storyboard (home) — durations from tokens (`--dur-1: .24s … --dur-5: 1.2s`)
| # | Section | full tier | lite | static (reduced-motion) |
|---|---|---|---|---|
| 1 | **Launch hero** | 0–0.6 s: poster `<img>` (LCP) visible immediately. 0.6–2.2 s: R3F particle "coded" logo (8k pts) resolves → dissolves into orbiting globe. SplitHeading chars stagger 0.02 s, `expo.out`. Scroll 0–100 vh: masked hero video `clip-path: inset(18% 22% round 28px)` → `inset(0)` + scale 0.86→1 (scrub). | 2k pts, no bloom; video plays unmasked | poster + headline, no video autoplay |
| 2 | **World is the classroom** | Pinned 300 vh. Globe rotates; arcs LATAM→Orlando (0–33 %)→London (33–66 %)→Tokyo (66–100 %). At each stop a card slides in (program, photo, next cohort from DB). | same, 150 vh, 2D SVG map arcs | static list of 4 program cards (this list is also the SR/keyboard equivalent in all tiers) |
| 3 | **Mission timeline** | Canvas `ScrubSequence` 90 frames (arrival→workshop→build→present), captions at frames 0/25/50/75. **Blocked on footage (Q1).** | 45 frames | 4 still frames + captions |
| 4 | **STEAM Pathway** | 5 letters in 3D; entering each letter morphs scene (orbit/circuit/gears/brush/lattice) + reveals workshops & careers. | 2D SVG morphs | 5 cards, letter accent colours |
| 5 | **4-step method** | horizontal pin, 4 panels × 100 vw, each a ≤ 4 s muted loop | vertical stack, loops on view | stack, posters |
| 6 | **Skills → careers** | constellation (Canvas); select skill → career "stars" fly in | DOM chips with FLIP | DOM chips |
| 7 | **Championship teaser** | neon Tokyo palette, countdown to 2027-08-02, 20-slot bracket draws in, prize reveal | same minus bloom | static |
| 8 | **Stories** | vertical reels carousel (autoplay in view, muted, captions) | tap-to-play | posters |
| 9 | **Trust wall** | **calm:** fades only, light `paper` theme | same | same |
| 10 | **Numbers + map** | counters tick once on view; SVG country dots | same | final numbers |
| 11–12 | CTA split + footer | magnetic buttons; kinetic "CODED" wordmark + cursor trail (desktop only, toggle) | no trail | static |

Rules: only transform/opacity/clip-path; every trigger in `useGSAP` (auto-revert on unmount); `ScrollTrigger.refresh()` after `document.fonts.ready` + hero image decode; WebGL `frameloop="demand"` + paused when hidden/off-screen; 3D via `next/dynamic` + IntersectionObserver, never before LCP.

## 6. Data model (Drizzle → Supabase Postgres)
Brief §11 schema adopted, with these deltas from the audit:
- `programs`: + `duration_label_es/en` (handles "10 full days"), `english_level` per program, `accommodation_note_es/en`, `pathway jsonb` (S/T/E/A/M workshop + careers), `status [live|upcoming|archived]`.
- `cohorts`: + `price_from numeric null`, `currency`, `hotel`, `registration_deadline`; **status is derived** in a SQL view: `closed` if `start_date <= today` regardless of stored value → past cohorts can never show (fixes C1 structurally).
- `extensions(id, program_id, name_*, days, timing[pre|during|post], price, currency)` — new (Paris, Edinburgh, Osaka/Kyoto).
- `teachers(id, name, role_*, bio_*, photo_media_id, consent bool, programs[])` — new (11 named).
- `policies(key, version, effective_date, body_*)` — cancellation tiers as data so FAQ and table can't diverge (fixes C10).
- `media.consent` gates rendering at query level (`where consent = true`) — not a UI convention.
- `stats.source_note` required (NOT NULL) — no number without provenance.

**CMS choice (Q4):** Recommend **Supabase `/admin`** (locked stack, one DB, cohorts are relational/date-driven).
Sanity alternative: better rich-text/visual editing for marketing, but adds a second data store + sync for cohorts. Choose Sanity only if non-technical editors will own long-form pages.

## 7. Stack & pinned versions (npm, 2026-11-06)
next **16.4.5** *(or 15.5.29 if Q3 says keep 15)* · react 19.3.1 · tailwindcss 4.3.5 · gsap 3.15.1 (+ScrollTrigger, SplitText, Flip — all free incl. commercial since Webflow acquisition; re-confirm license page in P1) · @gsap/react 2.1.2 · lenis 1.3.27 · three 0.187.0 · @react-three/fiber 9.8.2 · @react-three/drei 10.7.9 · @react-three/postprocessing 3.2.2 · detect-gpu 5.0.70 · next-intl 4.14.9 · drizzle-orm 0.45.4 · @supabase/supabase-js 2.119.0 · @playwright/test 1.65.0.

**Typography (pick one; all OFL/free unless noted):**
1. *Unbounded* (display) + *Inter Tight* (body) + *JetBrains Mono* — free, wide geometric, strong at 14vw. **Recommended.**
2. *Clash Display* (Fontshare, free commercial) + *Geist* + *Geist Mono* — sharper, more "tech".
3. *PP Neue Machina* (licensed) + *Inter Tight* + *Geist Mono* — most distinctive; needs license budget.

## 8. Media matrix (current best candidates — to be replaced by originals)
| Section | Candidate now (from manifest) | Needed from Coded |
|---|---|---|
| Hero video | `2026_04_college.mp4` (720², 89 s) cut to 6 s | 1080p+ landscape + 9:16 vertical, 6–10 s, students building on location |
| Globe stops | Orlando: `2026_07_nasa-1.jpg` (1600²); UK/Tokyo: none ≥1600 | 3 hero stills per location |
| Mission timeline | none usable | one program day shot as continuous sequence (≥ 90 frames) |
| Method loops | `inclusion-1.mp4`, `video-ucf.mp4`, `w2-1.mp4` | 4 × 4 s loops (expert, workshop, build, code) |
| Tokyo | `united-nations-tokyo.mp4`, `incluye-tokyo.mp4` (720p) | night/neon Tokyo footage |
| Stories reels | 11 YouTube videos (lite-embed, click-to-load) | IG export reels |
| Teachers | `Foto-*.jp(e)g` portraits (1600×2000) — **verify these are teachers + consent** | — |
Replace list: all 24 screenshots, the AI-looking hero, the Epic Universe press image, the 3×-duplicated logo strip.

## 9. Redirects (`redirects.ts` + Playwright 301→200 test)
All 54 .us sitemap URLs + 13 .com URLs + the known bad links. Examples:
`/program/orlando-steam-league-{2026,2027,summer-2027,october-2026,october-2027}/` → `/es/programs/orlando-steam-league?cohort=YYYY-MM` ·
`/program/europe-steam-league-{easter-2026,2027,eastern-2026}/`, `/steam-league-europe-2026/` → `/es/programs/europe-steam-league` ·
`/program/steam-league-ai*` → `/es/programs/steam-league-ai` · `/world-citizen/` → `/es/world-citizens` · `/about-our-programs/` → `/es/programs` ·
`/contact-us/`, `/consultation/`, `/contact/` → `/es/consultation` · `/login/` → `${APP_URL}/login` · `/cookies-policies/` → `/es/legal/cookies` ·
blog posts `/{slug}/` → `/es/blog/{slug}` · 26 date archives + `/author/*` → `/es/blog`.

## 10. Risks
| Risk | Impact | Mitigation |
|---|---|---|
| No high-res / consented media | Cinematic concept falls flat | Q1 is P0; build sections with art-directed 3D/gradient states that look intentional without photos |
| Motion vs. mobile perf (LCP < 2.5 s on Moto G) | Fail quality gate | Poster-first LCP, 3D lazy after idle, JS budget 200 KB gz enforced in CI, `lite` tier |
| Two live domains during build | SEO split continues | Decide Q0 now; ship redirects day 1 of launch |
| Legal wording (supervision, cancellation, UN, superlatives) | Liability, trust | Content gate: 🔴 items cannot render; counsel review before P4 |
| Minors' images | Legal/ethical | `media.consent` enforced in query; no names beside faces |
| Third-party marks | Takedown risk | Text-only venue names; no logos (Q21) |
| WebGL context leaks across routes | Crashes on iOS | Single persistent Canvas; Playwright 20-navigation `renderer.info` test |
| Scope (12 sections × 3 tiers × 2 locales) | Timeline slip | Phase gates; each section ships static tier first, then lite, then full |

## 11. Timeline (calendar weeks after approval; assumes answers to P0 questions in week 1)
| Phase | Weeks | Done when (evidence) |
|---|---|---|
| P1 Foundation | 1–2 | `/styleguide` ES/EN; CI green (typecheck, lint, Playwright, Lighthouse CI, content-check); schema + seed from CONTENT_FACTS |
| P2 Home | 3–6 | 12 sections × 3 tiers; LH mobile ≥ 85 / a11y ≥ 95; storyboard screenshots; staging sign-off |
| P3 Programs | 7–9 | 4 program pages + index + championship; past cohorts hidden (test); JSON-LD validates |
| P4 Audience/trust | 10–11 | schools, world-citizens, safety, method, about, stories, faq; every claim ✅/🟡 in CONTENT_FACTS |
| P5 Funnels | 12 | test lead in HubSpot with audience/program/UTM; consent banner gates analytics |
| P6 Migration/launch | 13–14 | 28 posts migrated; all old URLs 301→200 (test); zero broken links; device matrix pass |

## 12. P0 checklist
- [x] AUDIT.md re-run with Lighthouse, axe, crawl, screenshots (both domains)
- [x] Karpathy guidelines installed in CLAUDE.md
- [x] Site media ingested → `assets/raw/site/` (gitignored) + `assets/manifest.json`
- [ ] Instagram media → **waiting on export / originals (Q1)**
- [x] CONTENT_FACTS.md, OPEN_QUESTIONS.md, media matrix
- [ ] **Marvin approval** ← stop here
