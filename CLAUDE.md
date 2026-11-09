# CLAUDE.md — Coded 2.0 (codingeducation.us / codededucation.com rebuild)

## Status
P0 approved 2026-11-07. P1 (foundation) shipped to `main`. P2 (home) premium pass merged. P3 (programs): program pages, departures
calendar, /championship. Phase **P4 (audience/trust)** built: /schools and /stories (new), and world-citizens, safety, about,
faq, method rebuilt on `PageHero`. Gated until answered: STEAM Lab 360 (Q16), founders (Q19), school names/results (Q20),
supervision wording (Q11), vision text, UN partnership (Q14). **P5 (funnels)** built: every "Book a call" → `/consultation`
(5-field qualifier → prefilled HubSpot booking; HubSpot Forms API when `HUBSPOT_PORTAL_ID`/`HUBSPOT_FORM_ID` are set, Q24),
UTM capture, phone sticky pill, consent-gated GA4 (`NEXT_PUBLIC_GA_ID`, Q26). Waiting: Enroll/app domain (Q0), WhatsApp (Q23).
**P6 (migration)** built: 24 blog posts at `/en/blog/<slug>` (`python3 -I scripts/build-blog.py` regenerates content/blog from
the crawl; 3 held + 3 redactions, Q34), legacy post/archive/category/author URLs 301, zero-broken-links e2e.
**P7 (launch readiness)** built: localized 404 + error boundary, security headers/CSP (`security-headers.ts` — add an origin
there for any new embed), per-page OG cards, device-matrix e2e (320/768/1024, no overflow). Launch = `LAUNCH.md` runbook;
blocked on Q0 domain + DNS (Q30).
**Cody** (AI receptionist, `components/cody` + `app/api/cody`): answers only from `content/messages` + `content/programs.ts`
(`lib/cody/knowledge.ts`); Claude when `ANTHROPIC_API_KEY` is set, published-FAQ matching otherwise (Q35). Panel lazy-loads on first
intent. Design review + roadmap: `DESIGN_REVIEW.md`.
Read first: `PLAN.md`, `AUDIT.md`, `CONTENT_FACTS.md`, `OPEN_QUESTIONS.md`, `LAUNCH.md`.

## Stack (planned — see PLAN.md §7 for pinned versions)
Next.js App Router · TypeScript strict · Tailwind 4 · shadcn/ui (restyled to tokens) · Supabase + Drizzle ·
next-intl (`/es` default, `/en`) · GSAP + ScrollTrigger + SplitText via `@gsap/react` · Lenis · three + R3F + drei ·
detect-gpu · Playwright · Vercel.

## Folder conventions
```
app/[locale]/(marketing)/…   pages          app/[locale]/admin/…   editor UI
components/{ui,motion,three,sections,program,seo}
lib/{db,i18n,seo,media}      content/messages/{es,en}.json
scripts/                     ingest + migration scripts
tests/{e2e,visual}           Playwright
assets/manifest.json         media index (raw files in assets/raw/, gitignored)
```

## Content-accuracy rule (non-negotiable)
- Every factual claim (number, date, price, partner, accreditation, teacher, review) must exist in `CONTENT_FACTS.md`
  with status ✅ or 🟡. 🔴 items never render. Unknown → add to `OPEN_QUESTIONS.md`, don't guess.
- No invented testimonials, stats, partners or imagery. No stock or AI-generated photos where Coded media exists.
- Minors: render media only where `media.consent = true`; never put names next to faces without consent.
- Third-party marks (NASA, Disney, Universal, Marvel, Stanford, Toyota, teamLab, Premier League, EA): text only, no logos.
- Every user-facing string lives in `content/messages/{es,en}.json`. Spanish must read native LATAM, not translated.

## Motion rules
- Animate only `transform`, `opacity`, `clip-path` (+ filters on small elements). Never layout properties.
- Every ScrollTrigger is created inside `useLazyGSAP` (`components/motion/useLazyGSAP.ts`: GSAP via dynamic import +
  `gsap.context` auto-revert on unmount/route change). Never import `components/motion/gsap` statically — it costs ~48 KB gz
  of a ~186 KB baseline against the 200 KB initial-JS budget.
  Call `ScrollTrigger.refresh()` after `document.fonts.ready` and hero image decode.
- Lenis synced to GSAP: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
- `useMotionTier()` → `static | lite | full`. `prefers-reduced-motion: reduce` ⇒ static: no Lenis, no scrub, no 3D,
  fades only, art-directed posters. Mobile/low-end ⇒ lite: fewer particles, no postprocessing, half-frame sequences, no cursor.
- ONE persistent `<Canvas>` with drei `<View>`; 3D lazy via `next/dynamic` + IntersectionObserver; never blocks LCP.
  `frameloop="demand"`, paused off-screen / tab hidden. Hero LCP element is a real `<img>`.
- One ease set (`expo.out`, `power3.inOut`, `coded` cubic-bezier) and token durations. GSAP is the only animation lib.
- Exception: the above-the-fold hero intro is CSS keyframes (`.intro-*` in globals.css) so it runs on first paint without JS.
  On phones the hero h1 is the LCP element: render it as ONE plain text block (no word spans) below `md`.
  Inner pages use `components/sections/PageHero` (photo shows from `md` up only, so phones keep the h1 as LCP; `calm` for safety).
- Motion kit (components/motion): SplitWords+TextReveal (headings), ClipReveal (media), Marquee (pausable, WCAG 2.2.2),
  Magnetic, Cursor, VideoLoop (in-view only), HorizontalPin (full tier), SlideRows, Wordmark, LazyImg (IO-deferred images).
- Media: `python3 -I scripts/build-media.py` rebuilds public/media from assets/raw (site crawl + @coded.education IG).
- Animated text stays real DOM text (SplitText, `aria-label` on parent). Every 3D/scroll story has a DOM equivalent.
- Trust/safety sections are deliberately calm: fades only.

## Quality gates
Mobile Lighthouse perf ≥ 85 (home) / ≥ 90 (inner), a11y ≥ 95, LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
Initial JS ≤ 200 KB gz/route; hero video ≤ 2.5 MB; LCP image ≤ 180 KB. axe clean. No console errors.
Content check fails the build if a cohort with `start_date <= today` is open or an i18n key is missing in ES/EN.

## Commands
```bash
pnpm dev                      # http://localhost:3000 → /es
pnpm build                    # runs content:check first
pnpm typecheck && pnpm lint
pnpm test:e2e                 # needs a prior build; sandbox: PW_CHROMIUM_PATH=/opt/pw-browsers/chromium
pnpm lhci                     # needs a prior build; sandbox: CHROME_PATH=/opt/pw-browsers/chromium
pnpm content:check            # i18n ES/EN parity; + past-open cohorts when DATABASE_URL is set
pnpm db:generate | db:migrate | db:seed   # Drizzle; DATABASE_URL=postgres://…
```

Audit / ingestion (re-runnable):
```bash
npx -y firecrawl-cli@latest scrape "<url>" -o .firecrawl/pages/<slug>.md   # keyless tier is rate-limited; retry with sleep
python3 -I scripts/build-manifest.py .firecrawl/media_index.json assets/raw/site assets/manifest.json
```

## Git
One concern per PR (Karpathy §3). Branch per phase. Never commit `.firecrawl/`, `assets/raw/` or `.env*`.

---
# Karpathy guidelines (from forrestchang/andrej-karpathy-skills)

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
