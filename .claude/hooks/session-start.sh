#!/bin/bash
# GoB SessionStart hook (Claude Code on the web only). Synchronous.
# 1) npm dependencies so `npm test` / `npm run build` work.
# 2) Brain context (time, directives, NOW, board, dream health) when the brain clone exists
#    and the environment did not already register the brain hook (no double output).
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
IN="$(cat 2>/dev/null || true)"
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
timeout 600 npm install --no-audit --no-fund >/dev/null 2>&1 && echo "(npm install ok)" || echo "(npm install failed or timed out — run it manually)"
# Brain: clone it if missing (setup time may have lacked the token/network), unless the env bootstrap hook handles it
if ! grep -qsE "brain-bootstrap|brain/scripts/session-start.sh" "$HOME/.claude/settings.json"; then
  if [ ! -d /home/claude/brain/.git ] && [ -n "${BRAIN_TOKEN:-}" ]; then
    mkdir -p /home/claude
    timeout 120 git clone -q "https://oauth2:${BRAIN_TOKEN}@gitlab.com/Forzalab-bravo/brain.git" /home/claude/brain 2>&1 | sed 's/glpat-[^@ ]*/***/g' | tail -2
  fi
fi
B=/home/claude/brain/scripts/session-start.sh
if [ -f "$B" ] && ! grep -qsE "brain-bootstrap|brain/scripts/session-start.sh" "$HOME/.claude/settings.json"; then
  printf '%s' "$IN" | bash "$B" || true
fi
exit 0
