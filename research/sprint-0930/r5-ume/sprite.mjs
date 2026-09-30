// sprite.mjs: Nanda sprite sheet (the r5 pin-arm poses) at full size + at thumbnail size (the knife check).
// node research/sprint-0930/r5-ume/sprite.mjs <out.png>
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { nandaSVG } from '../../../src/date-beta/art/nanda.js';
const { chromium } = pkg;
const out = process.argv[2];
const POSES = [
  ['rest', {}],
  ['rest OR', { stage: 3 }],
  ['reach (park)', { face: 'nervous', arms: [{ to: [150, 150], c1: [150, 60], c2: [160, 120], w: [3, 16], r: 22, fingers: [] }] }],
  ['tug', { face: 'anya-smile', arms: [{ to: [178, 98], fingers: [-20, 20, 60] }] }],
  ['bag', { face: 'ticked-off', arms: [{ to: [138, 86], hold: 'bag', fingers: [-110, -70] }], tilt: -7 }],
  ['can', { face: 'anya-smile', arms: [{ to: [150, 62], hold: 'can', fingers: [160, 200] }] }],
  ['count 3', { face: 'happy', arms: [{ to: [150, 34], fingers: [-120, -90, -60] }] }],
  ['book+list', { face: 'big-eyes-peek', arms: [{ to: [146, 78], hold: 'book', fingers: [180, 220] }, { from: 'L1', to: [-24, 70], hold: 'list', fingers: [0, -40] }] }],
  ['kneel', { face: 'content', pose: 'kneel', arms: [{ to: [150, 120], hold: 'slipper', fingers: [-100, -60] }, { from: 'L2', to: [-20, 124], hold: 'slipper', fingers: [-120, -80] }] }],
  ['sleepy', { face: 'dazed-sleepy' }],
  ['shy-away', { face: 'shy-away' }], ['wow', { face: 'wow' }], ['look-up', { face: 'look-up' }], ['tired-soft', { face: 'tired-soft' }], ['face 3', { face: '3' }],
];
const cell = (svg, w, h) => `<svg viewBox="-160 -330 420 345" width="${w}" height="${h}" style="background:#9bb3c9">${svg}</svg>`;
const html = `<html><body style="margin:0;background:#fff;font:14px sans-serif">
<div style="display:flex;flex-wrap:wrap;gap:6px;width:1900px">${POSES.map(([n, o]) => `<div>${cell(nandaSVG({ talk: false, ...o }), 370, 304)}<br>${n}</div>`).join('')}</div>
<div style="display:flex;gap:8px;margin-top:8px">${POSES.map(([, o]) => cell(nandaSVG({ talk: false, ...o }), 64, 69)).join('')}</div></body></html>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1900, height: 900 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
