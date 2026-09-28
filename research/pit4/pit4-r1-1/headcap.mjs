// prints the WARNING word's DOM box so measure2.py can read its ink inside that box
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const out = {};
for (const [w, h] of [[1440, 810], [1024, 768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await p.goto(`${process.argv[2]}/date.html?v=f1`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  out[w] = await p.evaluate(() => {
    const r = (q) => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
    return { w1: r('.mf .w1'), modal: r('.mf'), neon: r('.mf .neon'), plate: r('.mf .plate'), pen: r('.pen'), tick: r('.tick'), wide: r('.btn.wide'), narrow: r('.btn.narrow'), plain: r('.mf .plain'), h1: r('#fh'), hdr: r('.bar') };
  });
}
console.log(JSON.stringify(out));
await b.close();
