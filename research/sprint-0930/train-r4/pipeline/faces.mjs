// train-r4 faces: render every beat face (the 4 kept + the 6 traced) next to the ref 13 cell it was traced from.
// usage: node research/sprint-0930/train-r4/pipeline/faces.mjs  -> shots/faces-sheet.png
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { readFileSync } from 'node:fs';
import { nandaSVG } from '../../../../src/date-beta/art/nanda.js';

const out = 'research/sprint-0930/train-r4/shots/faces-sheet.png';
const ref = `data:image/jpeg;base64,${readFileSync('research/sprint-0930/train-r4/refs/13.jpg').toString('base64')}`;
// ref 13 cells: col, row on the 4x4 sheet (505x607)
const CELLS = { nervous: [2, 0], 'ticked-off': [2, 1], 'very-angry': [3, 1], happy: [1, 2], 'dazed-sleepy': [2, 2], 'smug-gloating': [1, 3], content: [0, 2] };
const FACES = ['heart-laugh', 'nervous', 'anya-smile', 'ticked-off', 'very-angry', 'content', 'happy', 'dazed-sleepy', 'smug-gloating'];
const cell = (f) => {
  const c = CELLS[f];
  const r = c ? `<div class="ref" style="background-image:url(${ref});background-position:-${c[0] * 126}px -${c[1] * 148}px"></div>` : '<div class="ref none">(kept face)</div>';
  return `<figure>${r}<svg viewBox="-140 -350 330 250"><g>${nandaSVG({ face: f, talk: false })}</g></svg><figcaption>${f}</figcaption></figure>`;
};
const html = `<html><body style="margin:0;background:#fff4f9;font:600 18px sans-serif"><div style="display:grid;grid-template-columns:repeat(3,620px);gap:10px;padding:10px">
${FACES.map(cell).join('')}</div><style>figure{margin:0;display:flex;align-items:center;gap:8px;background:#fff;border:2px solid #e8b}
.ref{width:126px;height:148px;background-size:505px 607px;flex:none}.none{display:flex;align-items:center;color:#999;font-size:13px}
svg{width:460px;height:354px}figcaption{position:absolute}</style></body></html>`;
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1900, height: 1130 } });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log(out);
