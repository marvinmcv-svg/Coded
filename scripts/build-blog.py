"""
Migrate the codingeducation.us blog (PLAN §11 P6) from the crawl into content/blog/.

    python3 -I scripts/build-blog.py

Input:  .firecrawl/post-sitemap.xml + .firecrawl/pages/<slug>.md (gitignored crawl, CLAUDE.md → Audit / ingestion).
Output: content/blog/<slug>.md (body, verbatim minus crawl chrome) + content/blog/posts.json (metadata, newest first).

Posts are English only (OPEN_QUESTIONS Q29). Content-accuracy rule (CLAUDE.md): posts whose Coded-specific claims are
🔴 are HELD (not migrated; their old URLs 301 to the blog index), and single 🔴 phrases are REDACTED below — every
hold/redaction is listed in OPEN_QUESTIONS Q34 for Marvin.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CRAWL = ROOT / ".firecrawl"
OUT = ROOT / "content" / "blog"

HELD = {
    "reimagining-the-classroom": "13-day 2023 program, Florida Film Academy (partner name 🔴 Q18), 'Disney Codeillusion' (mark 🔴 Q21)",
    "the-magic-of-coded-what-makes-our-programs-so-special": "Vancouver program (🔴 Q16), 'over 10 countries', '9-day' (🔴 Q7), school named in a photo credit (Q20)",
    "time-to-play-videogames-in-education": "'Coded's Esports Academy' — program not in CONTENT_FACTS",
}

# (slug, exact text, replacement) — each must match exactly once.
REDACT = [
    ("what-is-steam-education", "offers a **9-day STEAM experience in Orlando**", "offers a **STEAM experience in Orlando**"),  # 9 vs 10 days 🔴 Q7
    ("behind-the-scenes-how-coded-transforms-an-orlando-experience-into-an-unforgettable-memory",
     "brought together 21 schools from Latin America", "brought together schools from Latin America"),  # count not in CONTENT_FACTS
    ("the-magic-of-power-skills", "Our **coding approach** through the wonderful CodeIllusion program, allows",
     "Our **coding approach** allows"),  # third-party program/partner not in CONTENT_FACTS
]

MONTHS = {m: i for i, m in enumerate(["January", "February", "March", "April", "May", "June", "July", "August",
                                       "September", "October", "November", "December"], 1)}
PROGRAMS = ["orlando-steam-league", "europe-steam-league", "steam-league-ai", "tokyo-steam-championship"]


def new_path(old: str, posts: set[str]) -> str:
    """Old codingeducation.us path → new English route (posts are EN). Unknown paths fail the build."""
    p = old.strip("/")
    if p in posts:
        return f"/en/blog/{p}"
    if p in HELD or p == "blog" or p.startswith(("category/", "author/")) or re.match(r"^\d{4}(/|$)", p):
        return "/en/blog"
    fixed = {"": "/en", "world-citizen": "/en/world-citizens", "about-us": "/en/about", "contact-us": "/en/contact",
             "contact": "/en/contact", "consultation": "/en/consultation", "about-our-programs": "/en/programs", "program": "/en/programs"}
    if p in fixed:
        return fixed[p]
    m = re.match(r"^(?:program/)?(orlando-steam-league|europe-steam-league|steam-league-ai|tokyo-steam-championship|steam-league-orlando|steam-league-europe)", p)
    if m:
        slug = {"steam-league-orlando": "orlando-steam-league", "steam-league-europe": "europe-steam-league"}.get(m.group(1), m.group(1))
        assert slug in PROGRAMS
        return f"/en/programs/{slug}"
    raise SystemExit(f"no mapping for internal link /{p}")


def plain(md: str) -> str:
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", md)
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    return re.sub(r"\s+", " ", re.sub(r"[*_`#>]", "", t)).strip()


def main() -> None:
    urls = re.findall(r"<loc>https://codingeducation\.us/([^<]*?)/?</loc>", (CRAWL / "post-sitemap.xml").read_text())
    slugs = [u for u in urls if u != "blog"]
    posts = {s for s in slugs if s not in HELD}
    OUT.mkdir(parents=True, exist_ok=True)
    meta = []

    for slug in sorted(posts):
        lines = (CRAWL / "pages" / f"{slug}.md").read_text().splitlines()
        i = 0
        categories: list[str] = []
        while not lines[i].startswith("# "):  # category bullets before the title
            categories += re.findall(r"\[([^\]]+)\]\(https://codingeducation\.us/category/", lines[i])
            i += 1
        title = lines[i][2:].strip()
        body, date = [], None
        for line in lines[i + 1:]:
            m = re.match(r"^- \[([A-Z][a-z]+) (\d{1,2}), (\d{4})\]\(https://codingeducation\.us/\d{4}/", line)
            if m:  # archive date link: everything after it is byline + site chrome
                date = f"{m.group(3)}-{MONTHS[m.group(1)]:02d}-{int(m.group(2)):02d}"
                break
            body.append(line)
        assert date, f"{slug}: no date"
        text = "\n".join(body).strip() + "\n"
        text = re.sub(r"(?m)^\*\*([A-Z])\*\* ([a-z])", r"\1\2", text)  # WordPress drop cap ("**A** s we") → "As we"
        text = re.sub(r"(?m)^# ", "## ", text)  # the page has one h1 (the title)

        for s, old, new in REDACT:
            if s == slug:  # the crawl keeps WordPress's non-breaking spaces, so match any whitespace
                pat = re.compile(r"\s+".join(map(re.escape, old.split())))
                text, n = pat.subn(new, text)
                assert n == 1, f"{slug}: redaction not found exactly once: {old}"

        text = re.sub(r"\]\(https?://(?:www\.)?codingeducation\.us(/[^)\s]*)?\)", lambda m: f"]({new_path(m.group(1) or '/', posts)})", text)
        assert "wp-content" not in text and "codingeducation.us" not in text, f"{slug}: leftover site URL/media"

        (OUT / f"{slug}.md").write_text(text)
        first = next(p for p in text.split("\n\n") if plain(p) and not p.lstrip().startswith(("#", "-", "|")))
        desc = plain(first)
        meta.append({"slug": slug, "title": title, "date": date, "categories": [c for c in categories if c != "Uncategorized"],
                     "description": desc if len(desc) <= 180 else desc[:177].rsplit(" ", 1)[0] + "…",
                     "source": f"https://codingeducation.us/{slug}/"})

    meta.sort(key=lambda p: p["date"], reverse=True)
    (OUT / "posts.json").write_text(json.dumps({"held": sorted(HELD), "posts": meta}, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(meta)} posts migrated, {len(HELD)} held, {len(REDACT)} redactions")


if __name__ == "__main__":
    main()
