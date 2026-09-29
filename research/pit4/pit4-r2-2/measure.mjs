// node measure.mjs URL : sign top / modal bottom / WARNING font, as ratios of H (Bangers cap ~ .84 em)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w, h] of [[1440, 810], [1024, 768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await p.goto(`${process.argv[2]}/date-aleph.html?v=g2`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const q = (s) => document.querySelector(s).getBoundingClientRect();
    const n = q('.mf .neon'), m = q('.mf');
    const fs = parseFloat(getComputedStyle(document.querySelector('.warn.cut')).fontSize);
    const pen = parseFloat(getComputedStyle(document.querySelector('.pen-note')).fontSize);
    return { signTop: Math.round(n.top), signBot: Math.round(n.bottom), modalBot: Math.round(m.bottom), fs, pen, w1top: Math.round(q('.warn .w1').top) };
  });
  console.log(w, JSON.stringify(r), 'span/H', ((r.modalBot - r.signTop) / h).toFixed(3), 'capH~', (r.fs * 0.84 / h).toFixed(3));
  await p.close();
}
await b.close();
