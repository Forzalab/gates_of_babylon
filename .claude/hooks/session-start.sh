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
B=/home/claude/brain/scripts/session-start.sh
if [ -f "$B" ] && ! grep -qs "brain/scripts/session-start.sh" "$HOME/.claude/settings.json"; then
  printf '%s' "$IN" | bash "$B" || true
fi
exit 0
