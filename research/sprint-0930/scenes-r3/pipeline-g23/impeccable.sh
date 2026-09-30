#!/bin/sh
# Impeccable live scan (1920x1080) of every G2/G3 beat; prints per beat: art findings (text in our svg) vs chrome.
# usage: IMPECCABLE_BROWSER=<no-sandbox chrome wrapper> sh impeccable.sh <base url> <out dir>
BASE=$1; OUT=$2; mkdir -p "$OUT"
for u in v2-rain:1 v2-rain:2 v2-rain:3 v2-rain:4 v2-street:2 v2-street:5 v2-curry:5 escape-win:6; do
  sc=${u%%:*}; b=${u##*:}
  timeout 200 npx impeccable detect --viewport 1920x1080 --json "$BASE/date-beta.html?scene=$sc&beat=$b&still&seed=1" > "$OUT/$sc-$b.json" 2>/dev/null
  python3 - "$OUT/$sc-$b.json" "$sc[$b]" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
real = [x for x in d if not x.get('advisory')]
art = [x for x in real if 'svg underlay' in x['snippet']]
chrome = [x for x in real if x not in art]
adv = [x for x in d if x.get('advisory')]
print(f"| {sys.argv[2]} | {len(art)} | {len(chrome)}: {', '.join(sorted(set(x['antipattern'] for x in chrome)))} | {len(adv)} |", *[' ART: ' + x['snippet'][:90] for x in art])
PY
done
