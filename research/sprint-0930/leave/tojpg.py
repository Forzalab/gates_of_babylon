# Shrink a shot folder: PNG -> JPEG q85 (log.json names follow), and drop the rooftop warm-up beats before the leave pick
# (rooftop 0-10 are not part of this audit; rooftop 11 = the leave pick stays). Usage: python3 tojpg.py <dir> [<dir> ...]
import json, os, re, sys
from PIL import Image

for d in sys.argv[1:]:
    keep = lambda n: not re.match(r'^\d+-rooftop-(?:[0-9]|10)(?:-|\.)', n)
    for n in sorted(os.listdir(d)):
        if not n.endswith('.png'):
            continue
        p = os.path.join(d, n)
        if keep(n):
            Image.open(p).convert('RGB').save(p[:-4] + '.jpg', quality=85, optimize=True)
        os.remove(p)
    lp = os.path.join(d, 'log.json')
    if os.path.exists(lp):
        j = json.load(open(lp))
        j['log'] = [dict(l, nm=l['nm'][:-4] + '.jpg') for l in j['log'] if keep(l['nm'])]
        json.dump(j, open(lp, 'w'), indent=1, ensure_ascii=False)
