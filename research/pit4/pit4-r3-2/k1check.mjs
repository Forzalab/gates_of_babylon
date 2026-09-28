// K1 check: the player ticks, the boom file loads, and the pull card replaces the player by 10 s (reduced motion on).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: 'reduce' });
const got = [];
p.on('response', (r) => { if (r.url().includes('sfx/')) got.push(r.url().split('/').pop() + ' ' + r.status()); });
await p.goto(`${process.argv[2]}/date.html?v=h2&next=1`);
await p.waitForSelector('.dj-player'); await p.mouse.click(300, 700); // unlock audio (a real gesture on empty canvas)
await p.keyboard.press('Shift');
await p.waitForTimeout(500);
console.log('resources:', await p.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => n.includes('sfx'))));
await p.waitForTimeout(2200);
const t1 = await p.textContent('.dj-time');
await p.waitForTimeout(8500);
console.log('timer at ~2s:', t1, '| player gone:', !(await p.$('.dj-player')), '| pull card:', !!(await p.$('.dj-card')), '| boom http:', got);
await b.close();
