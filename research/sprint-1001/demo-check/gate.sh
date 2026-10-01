#!/usr/bin/env bash
# 09:21 demo gate (DEMO-PLAN-0921). Takes ~12 min (> the 10 min tool cap), so run it detached and poll SUMMARY.txt:
#   nohup bash research/sprint-1001/demo-check/gate.sh > /dev/null 2>&1 &   then   cat research/sprint-1001/demo-check/out/SUMMARY.txt
# Dry run 06:46-06:55 PT on a686d1f: 440/440, 0 silent, build ok, float 0, rooftop3 keys ok ok ok, route A 99 frames -> YOU WIN 100%, errors [].
# fetch ccr + demo-1001 -> compare -> npm test, voice-gaps, build -> preview :5218 -> float audit, rooftop:3 keys (run 1),
# H6 jump shots, route A to its ending -> SUMMARY.txt. Kills its own preview by PID. Read-only on ccr (no pushes).
set -u
cd "$(git rev-parse --show-toplevel)"
D=research/sprint-1001/demo-check; OUT=$D/out; rm -rf "$OUT"; mkdir -p "$OUT"
S="$OUT/SUMMARY.txt"; say() { echo "$*" | tee -a "$S"; }
say "== gate $(TZ=America/Los_Angeles date '+%F %H:%M PT')"
timeout 90 git fetch -q origin ccr-8b4548b6-08uz6t demo-1001 || say "WARN fetch failed"
C=$(git rev-parse --short origin/ccr-8b4548b6-08uz6t); P=$(git rev-parse --short origin/demo-1001); H=$(git rev-parse --short HEAD)
say "ccr=$C demo-1001=$P head=$H"; [ "$C" = "$P" ] || say "!! ccr moved past demo-1001: diff it: git log --oneline $P..$C"
git merge-base --is-ancestor origin/ccr-8b4548b6-08uz6t HEAD || say "!! HEAD lacks ccr: git merge origin/ccr-8b4548b6-08uz6t first"
[ -d node_modules ] || npm ci --silent
say "test: $(npm test 2>&1 | grep -E '^# (pass|fail)' | tr '\n' ' ')"
say "voice: $(node scripts/voice-gaps.mjs 2>&1 | tail -1)"
npx vite build > "$OUT/build.log" 2>&1 && say "build: ok" || say "!! build FAILED (see $OUT/build.log)"
npx vite preview --port 5218 --strictPort > "$OUT/preview.log" 2>&1 & PV=$!; sleep 4
say "float: $(timeout 900 node research/sprint-0930/float-audit/audit.mjs 2>&1 | tail -1)"; git checkout -q research/sprint-0930/float-audit/result.json 2>/dev/null
cp $D/flow.mjs "$OUT/flow.mjs"; (cd "$OUT" && timeout 200 node flow.mjs rooftop3 1 5218 > rooftop3-run1.json 2>&1)
say "rooftop3 run1 keys: $(node -e "const r=require('./$OUT/rooftop3-run1.json');console.log(Object.values(r.keys).map(k=>k.labelOfKey.includes(k.routedTo)?'ok':'BAD '+k.labelOfKey+'->'+k.routedTo).join(' '))" 2>&1)"
PORT=5218 timeout 300 node research/sprint-1001/fix-h6/shoot.mjs "$OUT/h6" v2-train:8 v2-home:1 v2-town:3 v2-curry:13 cup:4 > "$OUT/h6.log" 2>&1 && say "h6 shots: $OUT/h6" || say "!! h6 shots failed"
timeout 600 node $D/route.mjs A 5218 "$OUT" > "$OUT/routeA.log" 2>&1
say "route A: $(tail -1 "$OUT/routeA.log") | last: $(tail -2 "$OUT/routeA.log" | head -1 | cut -c1-160)"
kill $PV 2>/dev/null
say "== done. eyeball: $OUT/h6/*.png, $OUT/A/png (last frames)"
