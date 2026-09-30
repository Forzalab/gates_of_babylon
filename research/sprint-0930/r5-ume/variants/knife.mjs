// knife-fix sketch: the current side-pony vs 2 redesigns, full + thumbnail. node knife.mjs -> knife.html
import fs from 'node:fs';
import { nandaSVG } from '../../../../src/date-beta/art/nanda.js';
const base = nandaSVG({ emote: 'smile', talk: false });
const PONY = /<path d="M106 63C114[^"]*"[^>]*\/><path d="M112 70C120[^"]*"[^>]*\/>/;
if (!PONY.test(base)) throw new Error('pony path not found');
const hair = '#eceef9', hair2 = '#aeb3d3', rim = '#d1177f';
// A: a fuller, rounded tuft (3 locks, blunt soft ends, strand lines) + a pink scrunchie at the root
const A = `<path d="M107 62C124 64 138 80 135 98C134 108 126 112 121 108C120 112 114 116 109 112C104 114 98 110 99 103C98 90 102 74 107 62Z" fill="${hair}" stroke="${rim}" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M112 70C119 82 122 94 120 106M108 74C109 86 108 98 106 108M117 68C126 78 130 88 129 100" fill="none" stroke="${hair2}" stroke-width="1.4" stroke-linecap="round"/>
<g transform="translate(111 64) rotate(-20)"><ellipse rx="10" ry="6" fill="#ff5fa2" stroke="${rim}" stroke-width="2"/><path d="M-8 -2Q-5 3 -2 -2Q1 3 4 -2Q7 3 9 -1" fill="none" stroke="#c23a7a" stroke-width="1.3"/></g>`;
// B: no pony at all; a short ribbon bow at the NOT position (two loops + two short tails, all pink)
const B = `<g transform="translate(116 70)"><path d="M0 0C-4 -14 -20 -14 -18 -2C-17 6 -6 6 0 0ZM0 0C4 -14 20 -14 18 -2C17 6 6 6 0 0Z" fill="#ff5fa2" stroke="${rim}" stroke-width="2" stroke-linejoin="round"/><path d="M0 0L-7 16L-2 14L1 18ZM0 0L7 15L3 14Z" fill="#e0448a" stroke="${rim}" stroke-width="1.6" stroke-linejoin="round"/><circle r="3.6" fill="#ff5fa2" stroke="${rim}" stroke-width="1.6"/></g>`;
const V = [['current (the knife)', base], ['A: tuft + scrunchie', base.replace(PONY, A)], ['B: ribbon bow, no pony', base.replace(PONY, B)]];
const cell = (t, svg, s) => `<div class="c"><svg viewBox="-260 -300 520 360" width="${520 * s}" height="${360 * s}">${svg}</svg><p>${t}${s < 1 ? ' (thumb)' : ''}</p></div>`;
fs.writeFileSync(new URL('./knife.html', import.meta.url), `<!doctype html><meta charset="utf-8"><style>body{margin:0;width:1920px;height:1080px;background:#6d8fa8;font:22px sans-serif;color:#fff}.r{display:flex;justify-content:space-around;align-items:end;padding:20px}.c{text-align:center}p{margin:4px}</style>
<div class="r">${V.map(([t, s]) => cell(t, s, 1.15)).join('')}</div><div class="r">${V.map(([t, s]) => cell(t, s, 0.22)).join('')}</div>`);
