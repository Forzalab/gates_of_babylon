// The live town ART alone (bg trace + cels, no HUD / box / Nanda / focus blur), per shot, from the real player; with
// HYBRID=1 the bg image is swapped to the older *-hybrid trace and the pure cels are hidden (the hybrid's signs are baked in).
// usage: [HYBRID=1] node pure_art.mjs http://localhost:5212 <out dir>   -> <out dir>/{street,crossing,board}.png
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [k, beat] of [['street', 1], ['crossing', 2], ['board', 3]]) {
  await p.goto(`${base}/date-beta.html?seed=2&still&scene=v2-town&beat=${beat}`, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.chrome,.stage > :not(.scene){display:none!important} .stage .scene{filter:none!important}' });
  if (process.env.HYBRID) {
    await p.evaluate((k) => {
      const art = document.querySelector('.art.town');
      art.querySelector('image').setAttribute('href', art.querySelector('image').getAttribute('href').replace(`${k}.svg`, `${k}-hybrid.svg`));
      art.querySelectorAll('svg > g').forEach((g) => g.remove());
    }, k);
  }
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${k}.png` }); console.log(k);
}
await b.close();
