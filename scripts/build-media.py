"""
Builds the web media in public/media/ from the raw, consented Coded originals (assets/raw/, gitignored).
Re-run: python3 -I scripts/build-media.py   (needs ImageMagick `convert` + `ffmpeg`)
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

manifest = {"images": {}, "videos": {}}
for key, (src, crop, aspect, widths) in IMAGES.items():
    path = RAW / src
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
run(["convert", str(RAW / IMAGES["tokyo-group"][0]), "-auto-orient", "-resize", "96x", "-blur", "0x2", "-strip", "-quality", "50",
     str(OUT / "tokyo-group-blur.webp")])

pathlib.Path("content/media-built.json").write_text(json.dumps(manifest, indent=1) + "\n")
print(len(manifest["images"]), "images,", len(manifest["videos"]), "videos")
