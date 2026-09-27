// Hover one Date tile (unblur preview) and screenshot it. node scripts/date-hover.mjs out.png [v] [index]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 810 } });
await p.goto(`${process.env.DATE_URL || 'http://localhost:5472'}/date.html?v=${process.argv[3] || 'y3'}&clean=1`);
await p.waitForTimeout(800);
const t = p.locator('.tile').nth(+(process.argv[4] || 4));
await t.hover(); await p.waitForTimeout(500);
await t.screenshot({ path: process.argv[2] });
await b.close();
