import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w, h] of [[1440, 810], [1024, 768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await p.goto(`${process.argv[2]}/date.html?v=g3`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const o = await p.evaluate(() => {
    const r = (q) => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
    return { w1: r('.mg .w1'), modal: r('.mg'), neon: r('.mg .neon'), sticky: r('.sticky'), tick: r('.tick'), wide: r('.btn.wide'), narrow: r('.btn.narrow'), plain: r('.mg .plain'), h1: r('#gh'), foot: r('.foot'), hdr: r('.bar'), sw: document.documentElement.scrollWidth };
  });
  const H = h; console.log(w, JSON.stringify(o), 'span', ((o.modal[3] - o.neon[1]) / H).toFixed(3), 'mw', ((o.modal[2] - o.modal[0]) / w).toFixed(3), 'h1font', await p.evaluate(() => getComputedStyle(document.querySelector('#gh')).fontSize));
  await p.close();
}
await b.close();
