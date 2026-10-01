#!/bin/bash
# Alt QA one-shot (Tony: "prep ur env so u just go"). Usage: bash research/sprint-1001/alt-qa/run.sh
# 1) moves the code worktree to the newest origin/${QA_BRANCH:-main}, rebuilds, serves a frozen preview on :5270
# 2) shoots run 1 (blind) + run 2 (chips): routes A, B (katsu ending), leave (game-over endings), escape (win/timeout)
#    in parallel per run, clock 12:20, 1920x1080, seed 1, a fresh browser context per route
# 3) builds 4x3 contact sheets per route, prints INDEX, kills the preview by PID.
set -u
ROOT=/home/user/gates_of_babylon
CODE=$ROOT/.claude/worktrees/qa-code
KIT=$(cd "$(dirname "$0")" && pwd)
ROUTES=${ROUTES:-"A B leave escape"}
cd "$ROOT" || exit 1
# fresh container fallback: recreate the code worktree
[ -d "$CODE" ] || git worktree add -q --detach "$CODE" origin/${QA_BRANCH:-main}
git -C "$CODE" fetch -q origin ${QA_BRANCH:-main} && git -C "$CODE" checkout -q --detach origin/${QA_BRANCH:-main} || exit 1
echo "${QA_BRANCH:-main} = $(git -C "$CODE" log -1 --format='%h %ci %s')"
cd "$CODE" && { [ -d node_modules ] || npm ci --no-audit --no-fund >/dev/null 2>&1; } && npx vite build >/tmp/qa-build.log 2>&1 || { echo BUILD FAILED; tail -20 /tmp/qa-build.log; exit 1; }
npx vite preview --port 5270 --strictPort >/tmp/qa-preview.log 2>&1 &
PREV=$!; sleep 4
cd "$KIT"
for RUN in 1 2; do
  PIDS=""
  for R in $ROUTES; do QA_RUN=$RUN timeout 900 node shoot.mjs "$R" 5270 >"out-r$RUN-$R.txt" 2>&1 & PIDS="$PIDS $!"; done
  for p in $PIDS; do wait $p; done
  for R in $ROUTES; do mkdir -p "out/r$RUN-$R"; mv "out-r$RUN-$R.txt" "out/r$RUN-$R/console.txt" 2>/dev/null; node sheets.mjs "r$RUN-$R" >/dev/null 2>&1; done
done
# kill the preview (vite child included) by PID only
for p in $(ps -eo pid,args | awk '/[v]ite preview --port 5270/{print $1}') $PREV; do kill $p 2>/dev/null; done
echo "== INDEX"; for d in out/r*-*; do n=$(ls $d/png 2>/dev/null | wc -l); s=$(ls $d/sheet-*.png 2>/dev/null | wc -l); e=$(node -e "try{const j=require('./$d/log.json');console.log(j.errs.length)}catch{console.log('nolog')}"); echo "$d shots=$n sheets=$s pageerrors=$e"; done
