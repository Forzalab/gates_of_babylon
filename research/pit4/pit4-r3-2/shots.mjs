// h2 shots: reduced motion FIRST, then motion. Gate + &next=1 (player at 3.5 s) + &next=1&novid (pull card) at 1440/1024.
// Also measures WARNING size, modal+sign span, h-scroll, page errors.  usage: node shots.mjs http://localhost:PORT
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const boxes = {};
import fs from 'node:fs';
for (const rm of ['reduce', 'no-preference']) for (const [w, h] of [[1440, 810], [1024, 768]])
  for (const [n, qs] of [['gate', ''], ['next', '&next=1'], ['next-pull', '&next=1&novid'], ['gate-clean', '&clean=1']]) {
    if (n === 'gate-clean' && rm !== 'reduce') continue;
    const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: rm });
    p.on('pageerror', (e) => errors.push(`${n} ${w}: ${e.message}`));
    p.on('console', (m) => m.type() === 'error' && errors.push(`${n} ${w} console: ${m.text()}`));
    p.on('response', (r) => r.status() >= 400 && errors.push(`${n} ${w} ${r.status()} ${r.url()}`));
    await p.goto(`${process.argv[2]}/date.html?v=h2${qs}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(3500);
    const f = `h2-${n}-${w}${rm === 'reduce' ? '-still' : ''}.png`;
    await p.screenshot({ path: path.join(OUT, f) });
    const m = await p.evaluate(() => {
      const r = (s) => document.querySelector(s)?.getBoundingClientRect();
      const warn = r('.warn'), neon = r('.neon'), modal = r('.modal');
      const fs = document.querySelector('.warn') && parseFloat(getComputedStyle(document.querySelector('.warn')).fontSize);
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, fs, span: modal && neon ? +((modal.bottom - neon.top) / innerHeight).toFixed(3) : null,
        gap: warn && neon ? Math.round(warn.top - neon.bottom) : null, warnW: warn && Math.round(warn.width), copyW: r('.copy') && Math.round(r('.copy').width) };
    });
    console.log(f, JSON.stringify(m));
    if (n === 'gate' && rm === 'reduce') boxes[f] = await p.evaluate(() => Object.fromEntries(['warn', 'neon', 'modal'].map((k) => {
      const r = document.querySelector('.' + k).getBoundingClientRect(); return [k, [r.left, r.top, r.right, r.bottom]]; })));
    await p.close();
  }
await b.close();
fs.writeFileSync(path.join(OUT, '..', 'boxes.json'), JSON.stringify(boxes, null, 1));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : '0 page errors');
