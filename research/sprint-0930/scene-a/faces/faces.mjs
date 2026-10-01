// Scene A faces: render Nanda's head crops (old faces + the 5 new ones) to PNG for FACES.md and the side-by-sides.
// node research/sprint-0930/scene-a/faces/faces.mjs  (Playwright chromium; no dev server needed)
import { writeFileSync, mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { nandaSVG, SCENE_FACES } from '../../../../src/date-beta/art/nanda.js';

const OUT = new URL('./', import.meta.url).pathname;
mkdirSync(`${OUT}png`, { recursive: true });
const OLD = [['stage-1 (heart)', { emote: 'heart' }], ['hearts', { emote: 'hearts' }], ['sweat', { emote: 'sweat' }], ['pout', { emote: 'pout' }]];
const NEW = SCENE_FACES.map((f) => [f, { face: f }]);
const head = (o) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 -290 300 265" width="520" height="460">${nandaSVG({ ...o, talk: false })}</svg>`;
const { chromium } = pkg;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 520, height: 460 } });
for (const [name, o] of [...OLD, ...NEW]) {
  await page.setContent(`<html><body style="margin:0;background:#fff">${head(o)}</body></html>`);
  await page.screenshot({ path: `${OUT}png/${name.replace(/[^\w-]+/g, '_')}.png` });
}
await browser.close();
console.log('ok', [...OLD, ...NEW].map((x) => x[0]).join(', '));
