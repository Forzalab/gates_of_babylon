// H6/H7 fix shots: frozen build + vite preview, clock 12:20, 1920x1080, ?scene=&beat=&run=&seed=1.
// node research/sprint-1001/fix-h6/shoot.mjs <outDir> [scene:beat[:run] ...]   (PORT env, default 4173)
// Logs per shot: Nanda box (stage px), dialogue box top, and the gap (box top - nanda top) so a face cut shows as a number.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [OUT, ...LIST] = process.argv.slice(2);
const PORT = process.env.PORT || 4173;
const PLAY = 'story,meta,mech,lockgame,obbp,sequences,variant-v2,r3-station,r3-rain,scene-a,interiors,curry,shop,town,love,ux-six,r5,r6,gacha';
const ITEMS = LIST.length ? LIST : ['v2-train:8', 'v2-train:7', 'v2-shop:10', 'v2-shop:11', 'v2-home:1', 'station-talk:1:2', 'station-talk:3:2', 'station-talk:1:3', 'station-talk:3:3', 'v2-curry:13', 'leave-yeah:4', 'v3-train:3:1:variant-v3'];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const rows = [];
for (const it of ITEMS) {
  const [scene, beat, run = '1', pack] = it.split(':');
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-10-01T12:20:00') });
  const q = `scene=${scene}&beat=${beat}&run=${run}&seed=1${pack ? `&pack=${PLAY},${pack}` : ''}`;
  await page.goto(`http://localhost:${PORT}/date-beta.html?${q}`, { waitUntil: 'load' });
  await page.clock.runFor(4000);
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const st = document.querySelector('.stage'); if (!st) return { err: document.body.innerText.slice(0, 120) }; const k = st.getBoundingClientRect().height / 1080, t0 = st.getBoundingClientRect().top;
    const y = (el) => (el ? Math.round((el.getBoundingClientRect().top - t0) / k) : null);
    const n = document.querySelector('.db-nanda'), box = document.querySelector('.db-say');
    return { beat: document.documentElement.dataset.beat, nandaTop: y(n), nandaCls: n?.getAttribute('class') ?? null, boxTop: y(box), line: box?.querySelector('.line')?.innerText?.slice(0, 60) ?? '' };
  });
  const nm = `${it.replace(/:/g, '-')}.png`;
  await page.screenshot({ path: `${OUT}/${nm}` });
  rows.push({ it, nm, ...m });
  console.log(it, JSON.stringify(m));
  await ctx.close();
}
fs.writeFileSync(`${OUT}/log.json`, JSON.stringify(rows, null, 1));
await browser.close();
