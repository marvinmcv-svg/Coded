"""
Builds the web media in public/media/ from the raw, consented Coded originals (assets/raw/, gitignored).
Re-run: python3 -I scripts/build-media.py   (needs ImageMagick `convert` + `ffmpeg`; existing outputs are reused,
delete a file to rebuild it)
Sources: assets/raw/site (codingeducation.us / codededucation.com crawl) and assets/raw/instagram (@coded.education).
Consent basis: Marvin, 2026-11-07 — Coded's website and social media are cleared for use (OPEN_QUESTIONS Q1).
"""
import json, subprocess, pathlib

RAW = pathlib.Path("assets/raw")
OUT = pathlib.Path("public/media")
OUT.mkdir(parents=True, exist_ok=True)

# key: (source, crop "WxH+X+Y" or None, aspect "w:h" for center crop or None, widths)
IMAGES = {
    # gallery / sections (Coded's own photos)
    "class-laptops":   ("site/2026_04_steam_0000_IMG_0950.jpg", None, "4:5", [480, 900]),
    "activity":        ("site/2026_04_steam_0001_IMG_2035.jpg", None, "4:5", [480, 900]),
    "student-laptop":  ("site/2026_04_steam_0002_Layer-3.jpg", None, "4:5", [480, 900]),
    "vr":              ("site/2026_04_steam_0003_Layer-2.jpg", None, "4:5", [480, 900]),
    "boys-laptop":     ("site/2026_04_steam_0004_IMG_9912.jpg", None, "4:5", [480, 900]),
    "tokyo-build":     ("site/2026_07_tokyo_0000_IMG_0843.jpg", None, "4:5", [480, 900]),
    "tokyo-cap":       ("site/2026_07_tokyo_0001_coded-2-ago-097.jpg", None, "4:5", [480, 900]),
    "tokyo-group":     ("site/2026_07_tokyo_0002_coded-2-ago-095.jpg", None, "16:9", [960, 1600]),
    "tokyo-temple":    ("site/2026_07_coded-2-ago-119.jpg", None, "4:5", [480, 900]),
    "purple-laptop":   ("site/2025_11_C48.jpg", None, "4:5", [480, 900]),
    "classroom":       ("site/2025_11_C49.jpg", None, "4:5", [480, 900]),
    "tablets":         ("site/2025_11_DSC00335-1.jpg", None, "4:5", [480, 900]),
    "laptops-room":    ("site/2025_11_DSC00611-scaled-2.jpg", None, "4:5", [480, 900]),
    "lab":             ("site/2025_11_RI-Workshops17.webp", None, "4:5", [480, 900]),
    "london-steps":    ("site/2025_11_SLE-3.jpg", None, "16:9", [960, 1600]),
    "lab-coat":        ("site/2025_11_SLE-8.jpg", None, "4:5", [480, 900]),
    "worksheet":       ("site/2025_11_slo2.jpg", None, "4:5", [480, 900]),
    "presenting":      ("site/2025_11_profesionals-3.jpg", None, "4:5", [480, 900]),
    "hero-portrait":   ("site/2025_11_imagen-4-scaled-1.jpg", None, "3:4", [600, 900]),
    # program-page galleries (photos published on that program's page on codededucation.com / codingeducation.us)
    "orl-tablet":      ("site/2025_11_DSC00587-scaled-2.jpg", None, "4:5", [480, 900]),
    "orl-sketch":      ("site/2025_11_coded3-1.png", None, "4:5", [480, 900]),
    "orl-colony":      ("site/2025_11_coded6-1.png", None, "4:5", [480, 900]),
    "uk-talk":         ("site/2025_11_profesionals.jpg", None, "4:5", [480, 900]),
    "uk-lecture":      ("site/2025_11_profesionals-2.jpg", None, "4:5", [480, 900]),
    "tokyo-portrait":  ("site/2026_07_tokyo-gallery_0000_coded-2-ago-123.jpg", None, "4:5", [480, 900]),
    "tokyo-friends":   ("site/2026_07_tokyo-gallery_0004_coded-2-ago-108.jpg", None, "4:5", [480, 900]),
    "tokyo-team":      ("site/2026_07_tokyo-gallery_0002_coded-2-ago-092.jpg", None, "4:5", [480, 900]),
    "tokyo-museum":    ("site/2026_07_tokyo_0003_coded-2-ago-087.jpg", None, "4:5", [480, 900]),
    "tokyo-metro":     ("site/2026_03_TOKYO2.png", None, "4:5", [480, 900]),
    "tokyo-gate":      ("site/2026_07_IMG_0832.jpg", None, "4:5", [480, 900]),
    # more program-page photos (codededucation.com program pages), added 2026-11-11
    "orl-park-guide": ("site/2026_04_Disney-Hollywood-Studios.jpg", None, "4:5", [480, 750]),
    "orl-campus": ("site/2026_04_UCF.jpg", None, "4:5", [480, 750]),
    "orl-team-notes": ("site/2026_04_e.jpg", None, "4:5", [480]),
    "orl-classroom": ("site/2026_04_m.jpg", None, "4:5", [480]),
    "orl-coding": ("site/2026_04_s.jpg", None, "4:5", [480]),
    "eu-mentor": ("site/2026_04_sle_0003_IMG_2297.jpg", None, "4:5", [480, 900]),
    "eu-oxford-walk": ("site/2026_04_oxford_0005_IMG_4160.jpg", None, "4:5", [480, 675]),
    "eu-oxford-college": ("site/2026_04_oxford_0006_IMG_4063.jpg", None, "4:5", [480, 675]),
    "eu-oxford-gate": ("site/2026_04_oxford_0013_IMG_4159.jpg", None, "4:5", [480, 675]),
    "eu-st-pauls": ("site/2026_04_tours-sle_0005_IMG_2950.jpg", None, "4:5", [480, 675]),
    "eu-thames": ("site/2026_04_tours-sle_0008_IMG_3062.jpg", None, "4:5", [480, 675]),
    "eu-river-portrait": ("site/2026_04_tours-sle_0009_IMG_3068.jpg", None, "4:5", [480, 675]),
    "ai-workshop-pair": ("site/2026_04_steam-workshops_0000_IMG_0642.jpg", None, "4:5", [480, 675]),
    "ai-workshop-focus": ("site/2026_04_steam-workshops_0001_IMG_0613.jpg", None, "4:5", [480, 675]),
    "ai-workshop-code": ("site/2026_04_steam-workshops_0002_IMG_0651.jpg", None, "4:5", [480, 675]),
    "ai-workshop-team": ("site/2026_04_steam-workshops_0003_IMG_0661.jpg", None, "4:5", [480, 675]),
    "ai-workshop-build": ("site/2026_04_steam-workshops_0004_Background.jpg", None, "4:5", [480, 675]),
    "ai-oxford-talk": ("site/2026_04_oxford_0012_IMG_4147.jpg", None, "4:5", [480, 675]),
    "ai-tube": ("site/2026_04_tours-sle_0003_IMG_2875.jpg", None, "4:5", [480, 675]),
    "tokyo-crew": ("site/2026_07_IMG_0758.jpg", None, "4:5", [480, 675]),
    "tokyo-forest": ("site/2026_07_IMG_0814.jpg", None, "4:5", [480, 675]),
    "tokyo-path": ("site/2026_07_IMG_0819.jpg", None, "4:5", [480, 675]),
    "tokyo-shrine": ("site/2026_07_IMG_0974.jpg", None, "4:5", [480, 900]),
    "tokyo-lantern": ("site/2026_07_IMG_0983.jpg", None, "4:5", [480, 675]),
    "tokyo-project": ("site/2026_07_IMG_1277-2.jpg", None, "4:5", [480, 675]),
    "tokyo-night": ("site/2026_07_IMG_1336-2.jpg", None, "4:5", [480, 675]),
    # YouTube covers (Coded's channel thumbnails, maxresdefault) for content/videos.ts; tokyo/tours/schools use Coded photos
    "yt-orlando-2026": ("youtube/bh0uaHpQn9A.jpg", None, "16:9", [640, 960]),
    "yt-europe": ("youtube/Lru9srM6MYQ.jpg", None, "16:9", [640, 960]),
    "yt-europe-highlights": ("youtube/ZKMYAFb2aYg.jpg", None, "16:9", [640, 960]),
    "yt-ai": ("youtube/jzq198Yj3hg.jpg", None, "16:9", [640, 960]),
    "yt-recap": ("youtube/JR7sYGq8s-8.jpg", None, "16:9", [640, 960]),
    "yt-about": ("youtube/Mqxn9qDaKoA.jpg", None, "16:9", [640, 960]),
    "yt-world-citizen": ("youtube/FHyQJwQLNlM.jpg", None, "16:9", [640, 960]),
    # teachers (codededucation.com) — square portraits, cropped to the teacher
    "t-kay-hill":      ("site/2026_08_images-1.jpeg", None, "1:1", [400]),
    "t-tom-caruth":    ("site/2026_06_team6.png", None, "1:1", [400]),
    "t-peter-smith":   ("site/2026_08_peter.jpg", "560x560+220+0", None, [400]),
    "t-isobel-haynes": ("site/2026_08_isobel.jpg", None, None, [400]),
    "t-ryen-detoro":   ("site/2026_08_r.jpg", None, None, [400]),
    "t-carolina-capelo-garcia": ("site/2026_06_team1.png", None, "1:1", [400]),
    "t-calum-bell":    ("site/2026_06_team-member5.png", None, "1:1", [400]),
    "t-richard-emmerton": ("site/2026_06_team-member4.png", None, "1:1", [400]),
    "t-scott-lu":      ("site/2026_06_team-member3.png", None, "1:1", [400]),
    "t-rayan-took":    ("site/2026_06_team-member2.png", None, "1:1", [400]),
    # 2026-11-14 expansion (events / projects / gallery pages): more of Coded's own trip photos from the program pages
    # of codededucation.com / codingeducation.us. Left out on purpose: stock and venue photos, close-ups of third-party
    # signage (NASA globe, Arsenal, Red Bull, Toyota, Gundam, teamLab), STEAM Lab 360 portraits (Q16), avatar badges.
    "orl-workbook": ("site/2026_04_Epic-Universe.jpg", None, "4:5", [480, 900]),
    "orl-main-street": ("site/2026_04_IMG_7170.jpg", None, "4:5", [480, 900]),
    "orl-dream-shirt": ("site/2026_04_IMG_7175.jpg", None, "4:5", [480, 900]),
    "orl-caps": ("site/2026_04_IMG_7146.jpg", None, "4:5", [480, 750]),
    "orl-pitch-stage": ("site/2026_04_slo-3.jpg", None, "4:5", [480, 750]),
    "orl-sketching": ("site/2026_04_a.jpg", None, "4:5", [480]),
    "orl-laptop": ("site/2026_04_t.jpg", None, "4:5", [480]),
    "orl-tablet-pair": ("site/2026_07_8.jpg", None, "4:5", [480, 750]),
    "orl-park-team": ("site/2026_07_c2.jpg", None, "4:5", [480, 750]),
    "orl-crowd-shirt": ("site/2025_11_Coded-Octubre_-71.jpg", None, "4:5", [480, 700]),
    "guardian-briefing": ("site/elementor_thumbs_DSC00284-1-1-reumb3panojqbky59xcck9j91twcj9y6ub3vrhg4e8.jpg", None, "4:5", [480, 640]),
    "eu-campus": ("site/2026_04_campus.jpg", None, "4:5", [480, 750]),
    "eu-vr": ("site/2026_04_europe_0000_IMG_2429.jpg", None, "4:5", [480, 750]),
    "eu-thames-backpack": ("site/2026_04_europe_0001_IMG_3060.jpg", None, "4:5", [480, 750]),
    "eu-oxford-backpacks": ("site/2026_04_europe_0002_IMG_4160.jpg", None, "4:5", [480, 750]),
    "eu-laptop-focus": ("site/2026_04_europe_0004_IMG_0714.jpg", None, "4:5", [480, 750]),
    "eu-oxford-spires": ("site/2026_04_oxford_0000_IMG_4055.jpg", None, "4:5", [480, 750]),
    "eu-oxford-guide": ("site/2026_04_oxford_0001_IMG_4049.jpg", None, "4:5", [480, 750]),
    "eu-oxford-theatre": ("site/2026_04_oxford_0003_IMG_4087.jpg", None, "4:5", [480, 750]),
    "eu-oxford-listen": ("site/2026_04_oxford_0004_IMG_4140.jpg", None, "4:5", [480, 750]),
    "eu-oxford-street": ("site/2026_04_oxford_0007_IMG_4075.jpg", None, "4:5", [480, 750]),
    "eu-oxford-square": ("site/2026_04_oxford_0008_IMG_4086.jpg", None, "4:5", [480, 750]),
    "eu-oxford-walk-2": ("site/2026_04_oxford_0009_IMG_4116.jpg", None, "4:5", [480, 750]),
    "eu-radcliffe": ("site/2026_04_oxford_0010_IMG_4128.jpg", None, "4:5", [480, 750]),
    "eu-oxford-chapel": ("site/2026_04_oxford_0011_IMG_4134.jpg", None, "4:5", [480, 750]),
    "eu-oxford-carving": ("site/2026_04_oxford_0014_IMG_4167.jpg", None, "4:5", [480, 750]),
    "eu-station": ("site/2026_04_tours-sle_0000_IMG_2690.jpg", None, "4:5", [480, 750]),
    "eu-museum-watches": ("site/2026_04_tours-sle_0001_IMG_2751.jpg", None, "4:5", [480, 750]),
    "eu-red-brick": ("site/2026_04_tours-sle_0002_IMG_2866.jpg", None, "4:5", [480, 750]),
    "eu-st-pauls-bus": ("site/2026_04_tours-sle_0004_IMG_2886.jpg", None, "4:5", [480, 750]),
    "eu-walk-river": ("site/2026_04_tours-sle_0006_IMG_2975.jpg", None, "4:5", [480, 750]),
    "eu-thames-portrait": ("site/2026_04_tours-sle_0007_IMG_3051.jpg", None, "4:5", [480, 750]),
    "eu-london-eye": ("site/2026_04_tours-sle_0010_IMG_3082.jpg", None, "4:5", [480, 750]),
    "eu-tower-bridge": ("site/2026_04_tours-sle_0011_IMG_3098.jpg", None, "4:5", [480, 750]),
    "eu-tower-bridge-close": ("site/2026_04_tours-sle_0012_Background.jpg", None, "4:5", [480, 750]),
    "eu-street-group": ("site/2025_11_SLE-1.jpg", None, "16:9", [960, 1600]),
    "ai-bench-laptop": ("site/2026_04_slai_0000_IMG_0560.jpg", None, "4:5", [480, 750]),
    "ai-campus-walk": ("site/2026_04_slai_0001_IMG_0559.jpg", None, "4:5", [480, 750]),
    "ai-friends": ("site/2026_04_slai_0002_IMG_0566.jpg", None, "4:5", [480, 750]),
    "ai-selfie": ("site/2026_04_slai_0003_IMG_0572.jpg", None, "4:5", [480, 750]),
    "ai-backpack": ("site/2026_04_slai_0004_IMG_0587.jpg", None, "4:5", [480, 750]),
    "ai-hall": ("site/2026_04_slai_0005_IMG_0601.jpg", None, "4:5", [480, 750]),
    "tokyo-sake": ("site/2026_07_IMG_0821.jpg", None, "4:5", [480, 750]),
    "tokyo-sensoji": ("site/2026_07_IMG_0979.jpg", None, "4:5", [480, 750]),
    "tokyo-street-phone": ("site/2026_07_tokyo-gallery_0003_cierra-los-labos.jpg", None, "4:5", [480, 750]),
    "tokyo-akihabara": ("site/2026_08_tokyo-labs_0000_Layer-5.jpg", None, "4:5", [480, 750]),
    "tokyo-gates": ("site/2026_03_TOKYO3.png", None, "4:5", [480, 750]),
}

# key: [(source, start, duration), ...] concatenated; 3:4 crop from the 720x1280 reels, no audio
VIDEOS = {
    "hero-reel": [("instagram/DfKkDx9Rb2L.mp4", 10.4, 2.4), ("instagram/DfQLA45RBdz.mp4", 7.6, 2.4), ("instagram/Dfa_esyR0wN.mp4", 31.0, 3.0)],
    "workshop-make": [("instagram/DfKkDx9Rb2L.mp4", 12.5, 4.0)],
    "workshop-class": [("instagram/DfQLA45RBdz.mp4", 5.0, 4.0)],
    "coding-tablet": [("instagram/DfXsAfuM4Fy.mp4", 16.2, 1.9)],
    "pitch-stage": [("instagram/Dfa_esyR0wN.mp4", 30.8, 2.6)],
}

def run(cmd):
    subprocess.run(cmd, check=True)

def ratio_crop(src, aspect):
    w, h = map(int, subprocess.check_output(["identify", "-format", "%w %h", f"{src}[0]"]).split())
    aw, ah = map(int, aspect.split(":"))
    if w / h > aw / ah:
        cw, ch = round(h * aw / ah), h
    else:
        cw, ch = w, round(w * ah / aw)
    return f"{cw}x{ch}+{(w - cw) // 2}+{(h - ch) // 2}"

prev = json.loads(pathlib.Path("content/media-built.json").read_text())
manifest = {"images": {}, "videos": {}}
# A raw source that is not on this machine (e.g. assets/raw/instagram) keeps its already-built files and manifest entry.
for key, (src, crop, aspect, widths) in IMAGES.items():
    path = RAW / src
    if not path.exists() and key in prev["images"]:
        manifest["images"][key] = prev["images"][key]
        continue
    if all((OUT / f"{key}-{wd}.webp").exists() for wd in widths) and prev["images"].get(key, {}).get("widths") == widths:
        manifest["images"][key] = prev["images"][key]
        continue
    if crop is None and aspect:
        crop = ratio_crop(path, aspect)
    if crop is None:  # face-focused square for group shots: right-of-centre square
        w, h = map(int, subprocess.check_output(["identify", "-format", "%w %h", f"{path}[0]"]).split())
        s = min(w, h); crop = f"{s}x{s}+{w - s}+0"
    cw, ch = map(int, crop.split("+")[0].split("x"))
    for wd in widths:
        run(["convert", f"{path}[0]", "-auto-orient", "-crop", crop, "+repage", "-strip", "-resize", f"{wd}x",
             "-quality", "72", "-define", "webp:method=6", str(OUT / f"{key}-{wd}.webp")])
    manifest["images"][key] = {"source": src, "widths": widths, "ratio": [cw, ch]}

for key, parts in VIDEOS.items():
    if key in prev["videos"] and (OUT / f"{key}.mp4").exists():
        manifest["videos"][key] = prev["videos"][key]
        continue
    inputs, filters = [], []
    for i, (src, start, dur) in enumerate(parts):
        inputs += ["-ss", str(start), "-t", str(dur), "-i", str(RAW / src)]
        filters.append(f"[{i}:v]crop=720:960:0:160,scale=540:720,setsar=1,fps=30[v{i}]")
    concat = "".join(f"[v{i}]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=1:a=0[out]"
    out = OUT / f"{key}.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filters + [concat]), "-map", "[out]",
         "-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", str(out)])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-frames:v", "1", "-c:v", "libwebp", "-quality", "70",
         str(OUT / f"{key}-poster.webp")])
    manifest["videos"][key] = {"sources": [p[0] for p in parts], "ratio": [3, 4]}

# Phone backdrop for /championship: ~1 KB pre-blurred still (low-entropy, so Chrome skips it as LCP and the h1 stays the LCP).
if not (OUT / "tokyo-group-blur.webp").exists(): run(["convert", str(RAW / IMAGES["tokyo-group"][0]), "-auto-orient", "-resize", "96x", "-blur", "0x2", "-strip", "-quality", "50",
     str(OUT / "tokyo-group-blur.webp")])

# Open Graph cards: 1200x630 JPG (what every link preview accepts), centre crop of a landscape original >= 1200 px wide.
# Pages map to these in lib/seo/meta.ts (OG_IMAGES); pages without one use og-home.jpg.
OG = {
    "orlando-steam-league": "site/2026_04_codeduni.jpg",
    "europe-steam-league": "site/2026_04_sle-scaled-e1784558625724.jpg",
    "steam-league-ai": "site/2026_04_sl.jpg",
    "championship": "site/2026_07_coded-2-ago-073.jpg",
    "schools": IMAGES["classroom"][0],
    "world-citizens": IMAGES["tokyo-temple"][0],
    "stories": IMAGES["presenting"][0],
    "method": IMAGES["lab"][0],
    "about": IMAGES["uk-lecture"][0],
    "events": IMAGES["eu-street-group"][0],
}
for key, src in OG.items():
    if (OUT / f"og-{key}.jpg").exists():
        continue
    run(["convert", f"{RAW / src}[0]", "-auto-orient", "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630",
         "-strip", "-interlace", "Plane", "-quality", "78", str(OUT / f"og-{key}.jpg")])

pathlib.Path("content/media-built.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(len(manifest["images"]), "images,", len(manifest["videos"]), "videos")
