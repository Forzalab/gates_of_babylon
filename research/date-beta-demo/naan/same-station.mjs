// same-station.mjs: Tony's ruling "two platforms = the same station, dusk -> night" as one picture.
// Left: the naan scene (NaanPlatform v3, dusk, MC's NAND line, on the ad's NAND frame). Right: alt's platform scene
// after the blackout (the same v3 station at night + the NEXT board and her silhouette, beat 0, train still in).
// usage: npm run build && npx vite preview --port 5481 --strictPort &   node research/date-beta-demo/naan/same-station.mjs http://localhost:5481
//   -> research/date-beta-demo/naan/same-station.png (2 x 1280x720, 16 px gap, like V3-dusk-vs-night.png)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5481';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const errors = [];
const shoot = async (query, file, ready) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => errors.push(`${query}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${query}: console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?${query}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.db-say');
  await page.waitForTimeout(1200);
  if (ready) await page.waitForSelector(ready, { timeout: 6000 }).catch(() => console.log(`  ${query}: ${ready} not seen`));
  await page.screenshot({ path: file });
  await page.close();
};
const tmp = (n) => path.join(OUT, `.same-station-${n}.png`);
await shoot('scene=naan&beat=1', tmp('dusk'), '.naan-platform .hl[data-glitch="NAND"]');
await shoot('scene=platform&beat=0', tmp('night'));
await browser.close();
execFileSync('python3', ['-c', `
from PIL import Image
import os, sys
a, b, out = sys.argv[1:4]
W, H, G = 1280, 720, 16
sheet = Image.new('RGB', (W * 2 + G, H), (20, 18, 30))
for i, f in enumerate((a, b)):
    sheet.paste(Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS), (i * (W + G), 0))
    os.remove(f)
sheet.save(out, optimize=True)
`, tmp('dusk'), tmp('night'), path.join(OUT, 'same-station.png')]);
console.log('same-station.png');
if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
