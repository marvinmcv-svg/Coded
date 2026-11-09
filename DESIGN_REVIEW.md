# Design review: Coded 2.0 (2026-11-08)

Reviewed on the running site: desktop 1440×900 and iPhone 13, ES and EN, all home sections plus inner pages.
Goal from Marvin: make it read as **futuristic, glossy, ed-tech STEAM**, with premium motion, and add **Cody**, an AI receptionist.

## What's already strong (keep)
- **Engineering foundation.** Initial JS is held under 200 KB, the hero intro paints with no JS, there are three motion tiers
  (full/lite/static), axe is clean and e2e tests cover 320/768/1024. Most "premium" sites fail these; this one passes.
- **Real media, honest copy.** Coded's own photos and reels, no stock, and every claim traced to `CONTENT_FACTS.md`. Parents
  trust that, and it's hard to fake.
- **Typography.** Unbounded display plus Inter Tight plus JetBrains Mono already sounds like tech. The mono eyebrows
  (`S T E A M · The borderless STEAM school`) are the most "ed-tech" detail on the site and should be used more.
- **Narrative spine.** "From your school to the world" → programs → method → "From your classroom to Tokyo" is clear and
  sells the League → Championship path well.

## What holds it back
| # | Finding | Impact | Status |
|---|---|---|---|
| 1 | At 1440×900 the hero h1 (up to 100 px) pushed the subline and **both CTAs below the fold**. | Conversion | ✅ fixed: max size 88 px; CTAs now visible |
| 2 | It reads as a **premium travel editorial** (dark, violet glow, big photos), not yet as **ed-tech**. It lacks the visual vocabulary of "future": grids, HUD/instrument framing, glass, light, data. | Brand | 🟡 started: hero grid floor, HUD frame on the reel, glass header |
| 3 | No way to **ask a quick question** without booking a call; FAQ answers are buried on /faq. | Conversion | ✅ Cody |
| 4 | **Route section:** before the 3D globe loads (and always in lite/static tiers) the left column is a flat, dim purple ball beside a long scroll of cards, which leaves a lot of dead space. | Polish | Proposal A |
| 5 | **Every section has the same ink and violet background**, so they blur together on scroll. Nothing signals "you are now in Science / Tech / Arts". | Rhythm | Proposal B |
| 6 | **Teachers:** 11 equal greyscale tiles, and one (Dr Claire Keene) is an initials placeholder that looks unfinished. No interaction. | Polish | Proposal C (+ photo needed) |
| 7 | **Method cards:** four static cards with outline numerals. Step 04 "Coding" is the most on-brand moment and has no code in it. | Brand | Proposal D |
| 8 | **Mobile header (ES):** "Agenda una llamada" wraps to two lines inside the pill at 390 px. | Polish | Proposal E |
| 9 | **No proof-in-numbers band** (schools, countries, satisfaction). | Trust | Blocked on facts: Q6 |

## Shipped in this pass
1. **Cody, the AI receptionist** (bottom-right orb, every page, ES/EN).
   - A glossy brand-gradient orb with blinking eyes and an orbiting light ring. The panel is glass and opens with a clip-path
     reveal; messages rise in, with typing dots and a scan line. All CSS transform/opacity/clip-path, and static under
     reduced motion.
   - **Grounded:** it answers *only* from the site's own copy (`content/messages`) and program facts (`content/programs.ts`),
     so it cannot say anything the site doesn't. It never gives prices (Q2), and anything unknown goes to a call, email or phone.
   - **Works today without a key:** it matches the published FAQ (accent-insensitive, ES/EN). Add `ANTHROPIC_API_KEY` and the
     same widget streams Claude answers (Opus 5.5, low effort, prompt-cached, server-side refusal fallback). If the API fails,
     it falls back to the FAQ answer.
   - Adds only a few KB to first load (the JS budget test still passes); the panel downloads on first hover, focus or tap. The key stays server-side, there's a
     per-IP rate limit, axe is clean, Escape closes it and focus returns to the orb.
2. **Hero:** CTAs above the fold, a perspective **grid floor that streams toward the viewer**, a **HUD frame** (corner
   brackets plus a slow scan line) over the reel, and a glassier header (more blur and saturation).

## Roadmap: premium motion, within the motion rules
Ranked by impact per effort. Each one has a DOM equivalent and a static tier.

- **A. Globe route with arcs.** Light arcs LATAM → Orlando → London → Tokyo drawn as the cards scroll, plus city pins with mono
  labels and an atmosphere rim glow. Lite/static: an SVG dot-matrix map with the same arcs. This fixes the dead column.
- **B. STEAM chapters.** Each section takes the accent of its letter (Science teal, Tech blue, Engineering orange, Arts pink,
  Maths violet): a 1 px top rule that draws in, a tinted glow and a tinted eyebrow. That gives the scroll a sense of "levels".
- **C. Teachers: spotlight cards.** A cursor-follow glow border (CSS variables, full tier). The photo goes from greyscale to
  colour on hover/focus, and the role slides up. Needs a real photo of Dr Claire Keene.
- **D. "Coding" card that codes.** Step 04 types a short real snippet (e.g. a Python loop the Orlando chatbot workshop would
  use) in mono, with a blinking caret. It runs only in view; static tier shows the finished snippet.
- **E. Decode effect on mono eyebrows.** Characters scramble through glyphs and resolve as each section enters (≈0.6 s, real
  text in `aria-label`). It's cheap and reads instantly as "tech".
- **F. Page transitions.** The CSS View Transitions API: the program card image morphs into the program-page hero. It feels
  like an app, and needs no library.
- **G. Mission timeline scrub** (PLAN §5 #3). This is the biggest "wow", but it's blocked on original footage (Q1).
- **H. Cody v2.** Page-aware greetings (on /programs/orlando-steam-league: "Questions about Orlando?"), a gentle nudge after
  ~25 s on program pages, and chat transcripts sent to HubSpot for the sales team (needs a privacy-policy line: Q35).

## How to verify
`pnpm build && PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm test:e2e --trace off`: 264 tests pass, including
`tests/e2e/cody.spec.ts` (opens, answers from the FAQ, axe clean, Escape closes, API validation), the JS budget and the
no-overflow device matrix.
