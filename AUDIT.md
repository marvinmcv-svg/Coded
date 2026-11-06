# AUDIT — Coded web presence (captured 2026-11-06)

Method: Firecrawl CLI scrape (markdown) of every sitemap URL on both domains, `curl` for raw HTML / status /
redirects / media, Lighthouse 12 (mobile + desktop, headless Chromium), axe-core 4 via Playwright
(WCAG 2.2 AA tags), full-page screenshots (1440 desktop + Pixel 7) of 12 templates.
Raw evidence lives in `.firecrawl/` (gitignored — contains third-party page copies). Re-run with the commands in
`CLAUDE.md → Audit commands`.

> **Headline finding not in the brief:** there are **two live Coded sites**.
> - `codingeducation.us` — the site the brief audits (WordPress 6.9 + Elementor, 54 sitemap URLs, one page *per cohort*).
> - `codededucation.com` — a **newer** WordPress site (uploads from 2026-04 → 2026-09, 13 URLs, one page *per program*,
>   shows **prices**, names **11 teachers**, has a real FAQ, cookie-consent banner, links Enroll to `app.codededucation.com`).
>
> Both declare themselves canonical, share the same homepage `<title>`, the same reviews and the same leaked email →
> they compete in Google as duplicate content. **Which domain is the future canonical is the #1 open question.**

---

## 1. Performance & quality scores (Lighthouse 12)

| Page | Device | Perf | A11y | Best-pr. | SEO | LCP | CLS | TBT | Weight |
|---|---|---|---|---|---|---|---|---|---|
| .us home | mobile | **50** | 86 | 79 | 100 | **4.5 s** | **0.163** | 680 ms | 813 KiB |
| .us home | desktop | 83 | 88 | 78 | 100 | 1.9 s | 0.018 | 0 ms | 1,084 KiB |
| .us Orlando 2027 | mobile | **44** | 87 | 79 | **77** | **5.8 s** | **0.163** | 600 ms | 2,311 KiB |
| .com home | mobile | **27** | 88 | 79 | 100 | **6.0 s** | **0.163** | 1,450 ms | 4,991 KiB |
| .com Orlando | mobile | **34** | 95 | 79 | 92 | **5.7 s** | **0.215** | 870 ms | **9,487 KiB** |

Targets (brief §1): mobile perf ≥ 85, LCP < 2.5 s, CLS < 0.1, a11y ≥ 95. **Every mobile page fails LCP and CLS.**
The newer .com site is ~2× slower than .us. The .us Orlando SEO score of 77 is caused by: no meta description,
non-descriptive link text, non-crawlable anchors.

## 2. Accessibility (axe, desktop)

| Template | H1 | `<img>` without alt | Violations (impact:nodes) | Duplicated headings |
|---|---|---|---|---|
| .us home | 1 | 14 / 51 | aria-required-children, link-name ×2, target-size ×7 | 4 method H3s ×2 |
| .us Tokyo | 1 | 13 / 50 | color-contrast, link-name ×2, target-size ×10 | — |
| .us World Citizens | 1 | **32 / 77** | aria-required-children, color-contrast, link-name, target-size ×7 | **6 skill H2s ×3** |
| .us About | 1 | 16 / 53 | aria-required-children, link-name, target-size ×7 | 4 method H3s ×2 |
| .us Blog | 1 | 15 / 32 | **link-name ×11**, target-size ×6 | — |
| .us post | 1 | 5 / 42 | link-in-text-block, link-name, target-size | — |
| .us Contact | 1 | 5 / 42 | link-name, target-size (+ reCAPTCHA console errors) | — |
| .com home | 1 | 16 / 55 | aria-required-children ×2, color-contrast ×3, link-name | Reviews H2 ×2, every teacher H3 ×2 |
| .com program | 1 | 19 / 72 | link-name ×7, role-img-alt ×4 | — |
| .com About | 1 | 14 / 43 | aria-required-children, link-name | every teacher H3 ×2 |
| .com FAQ | 1 | 5 / 42 | link-name ×3 | — |

(.us Orlando desktop timed out at `networkidle` after 60 s — itself a finding.)
Confirmed from brief: responsive-variant duplicate headings, carousel images rendered 3× in DOM (home logo strip:
17 images × 3 = 51 `<img>`).

## 3. Crawl: status codes, redirects, broken links (130 unique outbound/internal hrefs checked)

**Wrong or harmful redirects**
| URL (linked from) | Goes to | Problem |
|---|---|---|
| `/program/europe-steam-league-eastern-2026/` (main nav "EUROPE STEAM LEAGUE", 6×) | `/program/steam-league-ai-2027/` | Nav label says Europe League, lands on **AI League** |
| `/steam-league-europe-2026/` | `/program/steam-league-ai-2027/` | same |
| `/login/` (footer "Payments") | `/wp-login.php` | Parents sent to the **WordPress admin login** |
| `/cookies-policies/` (footer) | `/refund-conditions-policies/` | Cookie policy doesn't exist on .us |
| `/consultation/`, `/contact/` | `/contact-us/` | OK, but 3 CTA destinations for one intent (+ HubSpot `meetings.hubspot.com/genesis25`) |
| 26 date archives `/2023/04/25/` … `/author/georgia/` | `/` | soft-404s to home |

**404s:** `/pricacy-policies/Www.codingeducation.us` (typo link in policy text), `/refund-and-conditions-policies/`,
`/steam-league-ai-2026/`, og:image `/wp-content/uploads/2024/03/coded.png` (**every social share of the homepage has a broken image**).
**Two app domains:** .us → `app.codingeducation.us/register`; .com → `app.codededucation.com` (307).

## 4. SEO / meta

- Homepage `<title>` on **both** domains: "What Is a STEAM School? Complete Guide for Future Innovators" (blog-post title), `og:type` duplicated.
- `twitter:data1 = govea.e@coding-education.org` leaked on both homepages (confirmed).
- Duplicate `og:site_name` ("coded - Coding Education" + "Coding Education"), duplicate og:title/og:description.
- Brief said /about-us has both `index` and `noindex` — **not reproduced today**; only `index, follow`.
- JSON-LD: one generic Rank Math block on home/about; **none** on program pages. No Course/Event/FAQPage/Review.
- No `hreflang`, no Spanish version on either site.
- Policy pages reference generator templates (privacypolicies.com, termsfeed.com) — legal copy needs counsel review.

## 5. Content accuracy (fix list — every item verified in scraped text)

| # | Issue | Where |
|---|---|---|
| C1 | Past cohorts still listed as bookable: Easter 2026, Jul 26 2026, Aug 1 2026, Oct 30 2026 | .us home, nav, world-citizen |
| C2 | English level: cards "English (B1)", FAQ "ideally B2" | .us world-citizen, every program page |
| C3 | Schools: **+200** (.us home), **+210** (.us world-citizen), **+250** (.com landing) | — |
| C4 | Orlando duration: **9 days** (.us) vs **10 full days** (.com, .com FAQ) | — |
| C5 | AI League duration: **12 days** (.us) vs **14 days** (.com) | — |
| C6 | Orlando hotel: .us 2026 pages "Cabana Bay"; .us 2027 page "Universal Stella Nova"; .com "Stella Nova + Terra Luna Jan/Jul, Cabana Bay Oct" | — |
| C7 | AI League "+360" block describes the **space-colony** mission (Orlando copy) | .us `steam-league-ai-2027` |
| C8 | Bradfield vs Woldingham conflict — **only on `steam-league-ai-summer-2026`**. In 2027 AI=Bradfield, Europe=Woldingham (consistent) | .us |
| C9 | Tokyo venue: "authentic Japanese school" (.us) vs "Learning inside the United Nations University" (.com) | — |
| C10 | Cancellation: .com program table (120+ days / Semi-Flex vs Flex) ≠ .com FAQ (60+ days = 100% with Flex Pass) | .com |
| C11 | FAQ answers pasted under wrong questions ("Can I change my course option?" → forms answer; "Accessing funds" → gender-housing text) | .com FAQ |
| C12 | Teacher bios contaminated: Peter Smith's bio ends with Tom Caruth's text; Isobel Haynes's ends with Carolina's | .com home |
| C13 | Guardian "Monitoring" has a heading but **no body text** (brief said "duplicates Coordination" — it's empty) | .us world-citizen |
| C14 | "Our Vision" heading with no vision text | .us about |
| C15 | Orlando "Dates" widget labels Jul 8 as "Program End Date" and Oct 30 as "Registration Deadline" — they are cohort starts | .com Orlando |
| C16 | **Legal vs marketing conflict:** T&Cs: "CODED EDUCATION EXPERIENCES LLC does not assume primary custodial supervision… the school-appointed group leader remains the principal authority". Marketing: "Their Guardian is responsible for them at all times". World Citizens travel *without* a school group leader. | .us refund policy vs world-citizen |
| C17 | Legal entity written two ways: "Coding Education Experiences LLC" / "CODED EDUCATION EXPERIENCES LLC" | policies |
| C18 | "United Nations: Our Partner to implement the SDGs" — partnership claim needs written evidence before reuse | .com home/about |
| C19 | Typos: "Skills necesaries", "Responsabilities", "Toyota Automibile Museum", "ACADEMY OF TOMORROw", "Accomodation", "diferents", "skillsz", "Softwate", "Carrers", "Award-Einning", "educatio has been naccredited", "Team lab"/"Teamlabs" (brand is teamLab) | both |
| C20 | Hero image on .us looks AI-generated/stock (girl in VR goggles) — not Coded footage | .us home |

## 6. Media audit (see `assets/manifest.json`)

- 415 unique media URLs across both sites (WP size variants collapsed); 414 downloaded, 1 is 404 (the og:image).
- **308 / 404 images are < 1200 px on the long edge.** Only 3 images are ≥ 1920 px wide and those are a CSS3 logo and stock-like webp files.
- 24 raw screenshots (`Captura-de-pantalla-…`), 76 meaningless filenames (`Untitled-1_00xx_Layer-n`), 25 PNGs > 500 KB.
- 9 self-hosted MP4s, **max 720p**, 4.8–54 MB, durations 9–121 s (`college.mp4` 54 MB/89 s). None usable as-is for a ≤2.5 MB hero.
- 11 YouTube videos embedded (IDs in `.firecrawl/youtube_ids.json`), channel "CODED | Coding Education" (~211 subscribers).
- Third-party imagery present (e.g. Epic Universe "Celestial Park" press-style photo) — must be replaced with Coded's own photos (brief §14).
- **Conclusion:** the cinematic direction is blocked on original footage/photos from Coded (OPEN_QUESTIONS Q1).

## 7. Social media

Not scraped directly — Instagram and LinkedIn terms prohibit automated scraping, and brief §4.2 says not to.
Publicly indexed search snippets were collected instead (`CONTENT_FACTS.md §9`). They surface partner schools
(Colegio Granadino, Interamerican School, Academia Merici), a 3rd-place result, and a press mention — all **unverified**
until Marvin confirms. Full Instagram content requires the account's "Download your information" export.

## 8. Scorecard (re-measured)

| Dimension | Brief est. | Measured | Evidence |
|---|---|---|---|
| Mobile performance | ~5/10 | **3/10** | Perf 27–50, LCP 4.5–6.0 s, CLS 0.16–0.22 |
| Accessibility | 4/10 | 5/10 | Lighthouse 86–95; axe violations on every template; 30–40 % images lack alt |
| Content accuracy | 3/10 | **2/10** | 20 issues above, two contradicting sites |
| SEO / structured data | 4/10 | 3/10 | Duplicate domains, wrong title, no program JSON-LD, no hreflang |
| Conversion clarity | 4/10 | 3/10 | 3 contact destinations, 2 app domains, Payments → wp-login |
