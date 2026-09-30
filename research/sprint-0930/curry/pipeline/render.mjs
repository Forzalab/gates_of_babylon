// Rasterise hand SVGs at 1920x1080. usage: node render.mjs in.svg out.png [in2.svg out2.png ...]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { readFileSync } from 'node:fs';
const a = process.argv.slice(2);
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (let i = 0; i < a.length; i += 2) {
  await p.setContent(`<style>body>svg{width:1920px;height:1080px;display:block}</style><body style="margin:0">${readFileSync(a[i], 'utf8')}</body>`);
  await p.screenshot({ path: a[i + 1] });
}
await b.close();
