"""Build assets/manifest.json from the scraped media index + downloaded files.
Usage: python3 -I scripts/build-manifest.py .firecrawl/media_index.json assets/raw/site assets/manifest.json
"""
import json, os, re, subprocess, sys
from PIL import Image

index_path, raw_dir, out_path = sys.argv[1:4]
index = json.load(open(index_path))

def local_name(url):
    return re.sub(r'https://(codingeducation\.us|codededucation\.com)/wp-content/uploads/', '', url).replace('/', '_')

def flags(name, w, h, size):
    f = []
    if re.search(r'captura|screenshot|screen-shot|pantalla', name, re.I): f.append('screenshot')
    if re.search(r'untitled|layer-\d+|^\d{4}_\d{2}_(img|dsc|whatsapp)', name, re.I): f.append('meaningless-filename')
    if w and max(w, h) < 1200 and not name.endswith('.svg'): f.append('low-res')
    if name.lower().endswith('.png') and size > 500_000: f.append('heavy-png')
    if re.search(r'logo|favicon|icon', name, re.I): f.append('brand-or-logo')
    return f

items = []
for url, pages in sorted(index.items()):
    name = local_name(url)
    path = os.path.join(raw_dir, name)
    item = {'source_url': url, 'site': 'codingeducation.us' if 'codingeducation' in url else 'codededucation.com',
            'pages': pages, 'file': name, 'downloaded': os.path.exists(path)}
    w = h = dur = None
    if item['downloaded']:
        size = os.path.getsize(path); item['bytes'] = size
        if re.search(r'\.(mp4|webm|mov)$', name, re.I):
            item['kind'] = 'video'
            p = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                'stream=width,height:format=duration', '-of', 'json', path], capture_output=True, text=True)
            j = json.loads(p.stdout or '{}')
            s = (j.get('streams') or [{}])[0]; w, h = s.get('width'), s.get('height')
            dur = float(j.get('format', {}).get('duration', 0) or 0)
            item['duration_s'] = round(dur, 1)
        elif name.lower().endswith('.svg'):
            item['kind'] = 'svg'
        else:
            item['kind'] = 'image'
            try:
                with Image.open(path) as im: w, h = im.size
            except Exception: item['kind'] = 'unreadable'
        item.update(width=w, height=h, flags=flags(name, w, h, size))
    item.update(alt_guess=None, subject_tags=[], consent_confirmed=False)  # filled in by human/visual review
    items.append(item)

json.dump({'generated_from': index_path, 'count': len(items), 'items': items}, open(out_path, 'w'), indent=1, ensure_ascii=False)
ok = [i for i in items if i['downloaded']]
print(f"{len(items)} indexed, {len(ok)} downloaded, {len(items)-len(ok)} missing (404)")
from collections import Counter
print(Counter(f for i in ok for f in i.get('flags', [])))
print(Counter(i['kind'] for i in ok))
