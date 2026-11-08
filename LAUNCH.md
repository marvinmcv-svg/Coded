# LAUNCH — runbook (P7)

The site is built so launch day only needs a domain, environment variables and DNS. Nothing in the code changes.

## Still blocking launch
| # | Item | Owner | Effect if unanswered |
|---|---|---|---|
| Q0 | Canonical domain (`codingeducation.us` or `codededucation.com`), and which one 301s into it | Marvin + team | Can't launch |
| Q30 | Vercel team/project; who controls DNS for both domains | Marvin | Can't launch |
| Q24 | HubSpot portal + form ID | Marvin | /consultation still books calls; leads aren't also posted to a HubSpot form |
| Q26 | GA4 measurement ID | Marvin | No analytics and no consent banner |
| — | Legal pages (privacy, cookies, terms) — on hold, needs Q12 entity name + counsel text | Marvin | Old `/cookies-policies/` etc. have no target yet (see `redirects.ts` header) |
| Q0 | App domain for Enroll / Login (`/login` redirect needs it) | Marvin | No Enroll button; every CTA goes to /consultation |

## Environment variables (Vercel → Project → Settings → Environment Variables, Production)
| Name | Value | Notes |
|---|---|---|
| `SITE_URL` | `https://<canonical domain>` | Canonicals, hreflang, sitemap, OG URLs. No trailing slash. |
| `SITE_INDEXING` | `on` | **Production only.** Unset ⇒ every page is `noindex` and robots.txt disallows all (previews stay unindexed). |
| `NEXT_PUBLIC_GA_ID` | `G-…` | Optional (Q26). Shows the consent banner; GA4 loads only after "Accept". Needs a rebuild. |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | from HubSpot | Optional (Q24). Form fields: `firstname`, `lastname`, `email`, `country`, `message`. |
| `DATABASE_URL` | Supabase Postgres | Only for `content:check` past-cohort check and `db:*` scripts; pages don't read it. |

## Launch steps
1. **Pre-flight on the production build** (Vercel preview of `main`): CI green (typecheck, lint, content check, build, Playwright incl. `launch.spec.ts` device matrix, Lighthouse CI).
2. **Domains** (Vercel → Project → Domains): add the canonical apex + `www`; set one as primary, the other redirects to it. Add the
   *other* site's apex + `www` and set them to **redirect (301) to the canonical domain, keeping the path** — the path-based
   legacy redirects in `redirects.ts` then map every old URL (programs, blog posts, archives) in one more hop.
3. **DNS** at the registrar: the records Vercel shows for each domain (normally apex `A 76.76.21.21`, `www CNAME cname.vercel-dns.com`).
   Lower the TTL to 300 s a day before; keep the old hosting running until the new records have propagated.
4. **Env vars** above → **Redeploy** (env changes need a new build).
5. **Smoke test on the live domain** (5 min):
   - `curl -sI https://<domain>/` → 307 to `/es`; `/es` → 200 with `content-security-policy` and `strict-transport-security` headers.
   - `https://<domain>/robots.txt` allows crawling and lists the sitemap; page source has no `noindex` (except 404 pages).
   - Three old URLs from each old domain (e.g. `/program/orlando-steam-league-2027/`, a blog post, `/contact-us/`) → 301 → 200.
   - Submit `/consultation` once with a test lead; check it reaches HubSpot (if Q24 set) and the booking iframe loads.
   - Share a program URL in WhatsApp/Slack: its own photo card appears.
6. **Search engines**: Google Search Console + Bing Webmaster — verify the canonical domain, submit `/sitemap.xml`. If the canonical
   domain differs from the old main domain, use Search Console's *Change of address* from the old property.
7. **After 48 h**: Search Console coverage (no 5xx, no unexpected 404s), Vercel runtime errors, real-user Web Vitals.

## Rollback
Point DNS back to the old host (TTL was lowered in step 3). Nothing in the old sites was changed.

## What P7 added (domain-independent readiness)
- Branded, localized 404 (`app/[locale]/(marketing)/not-found.tsx` + catch-all) and an error boundary with retry; unknown locales
  (e.g. `/favicon.ico`) are a plain 404, never a 500.
- Security headers on every response (`security-headers.ts`): CSP limited to the site's real third parties (GA4, HubSpot
  meetings iframe), HSTS (no `includeSubDomains` until Q0 settles subdomains), nosniff, frame-ancestors, Referrer- and Permissions-Policy.
  **Adding an embed (e.g. WhatsApp widget, Q23) means adding its origin to the CSP.**
- Per-page Open Graph cards (`public/media/og-*.jpg`, built by `scripts/build-media.py`, mapped in `lib/seo/meta.ts`).
- Device matrix in `tests/e2e/launch.spec.ts`: every route at 320 / 768 / 1024 px — no horizontal overflow, no console errors
  (which also catches CSP violations). Fixed the overflows it found on home, programs, about and safety.
