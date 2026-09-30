#!/bin/sh
# Impeccable live scan (1920x1080) of every v2-town beat: per beat, art findings (text in our svg) vs chrome.
# usage: IMPECCABLE_BROWSER=<no-sandbox chrome wrapper> sh impeccable.sh <base url> <out dir>
BASE=$1; OUT=$2; mkdir -p "$OUT"
for u in $(seq 0 4 | sed "s/^/v2-town:/"); do
  sc=${u%%:*}; b=${u##*:}
  timeout 200 npx impeccable detect --viewport 1920x1080 --json "$BASE/date-beta.html?scene=$sc&beat=$b&still&seed=1" > "$OUT/$sc-$b.json" 2>/dev/null
  python3 - "$OUT/$sc-$b.json" "$sc[$b]" <<'PY'
import json, sys
try: d = json.load(open(sys.argv[1]))
except Exception: print(f"| {sys.argv[2]} | scan failed |"); sys.exit()
real = [x for x in d if not x.get('advisory')]
art = [x for x in real if 'svg' in x.get('snippet', '')]
chrome = [x for x in real if x not in art]
print(f"| {sys.argv[2]} | {len(art)} | {len(chrome)}: {', '.join(sorted(set(x['antipattern'] for x in chrome)))} |", *[' ART: ' + x['snippet'][:90] for x in art])
PY
done
