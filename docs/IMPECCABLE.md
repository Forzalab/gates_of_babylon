# Impeccable: design lint for Logic mode + Date mode

Impeccable (npm `impeccable`, v4.1.0) scans CSS/JSX and live pages for UI anti-patterns: low contrast, cramped padding, bounce easing, "AI-look" tells.

## Install
Nothing to install. `npx` fetches it:
```
npx impeccable --version
```
Optional: `npx impeccable install` adds its design skills to the project for Claude.

## Use
**1. Static scan (code):**
```
npx impeccable detect src/
```
**2. Live scan (rendered page, needs the dev server):**
```
npx vite --port 3000 --strictPort &
npx impeccable detect --viewport 1920x1080 http://localhost:3000/
npx impeccable detect --viewport 1920x1080 http://localhost:3000/date-beta.html
npx impeccable detect --viewport 1920x1080 "http://localhost:3000/date-beta.html?scene=door"
npx impeccable detect --viewport 1920x1080 http://localhost:3000/date-aleph.html
```
- Use `--viewport 1920x1080`: the demo is a full-screen projector.
- `--json` for machine output. `--no-advisory` hides advisory notes. Exit code 2 = findings exist.

**Claude Code cloud container only:** the pre-installed Chromium runs as root, so wrap it:
```
printf '#!/bin/sh\nexec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"\n' > /tmp/chrome-ns.sh
chmod +x /tmp/chrome-ns.sh
IMPECCABLE_BROWSER=/tmp/chrome-ns.sh npx impeccable detect http://localhost:3000/
```
On your own PC with Chrome installed, you don't need this.

## How to read the results
- **Fix:** contrast, padding, text overlap on anything the player reads.
- **Judge, don't auto-fix:** "AI-look" rules (overused font, glow, neon purple, stripes). Some of our look is on purpose: the aleph warning page is a parody, and date-beta's glossy pink is the brand.
- Silence a rule on purpose with an inline `impeccable-disable` comment, and say why.

## Pages to check before the demo
| Page | URL |
|---|---|
| Logic mode | `/` |
| Date-beta title | `/date-beta.html` |
| Date-beta choice scene | `/date-beta.html?scene=door` |
| Date aleph | `/date-aleph.html` |
