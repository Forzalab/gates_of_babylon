// Float audit: walks every beat of both routes (?scene=&beat=), and wherever Nanda's medium sprite shows her feet (not
// cropped by the dialogue box / choice panel / frame), measures her lowest painted pixel (sprite diff, filters off) vs the
// bg floor line (src/date-beta/art/floors.js, stage px at her column) and checks her contact shadow (.db-plant).
// Flags: gap > 12 px (feet above the floor; also > 12 px sunk below it), or no contact shadow. Shots of flags -> shots/.
// Run: npx vite build && npx vite preview --port 5218 (kill by PID), then node research/sprint-0930/float-audit/audit.mjs [--all]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { applyPacks } from '../../../src/date-beta/packs/index.js';
import { FLOORS, floorOf } from '../../../src/date-beta/art/floors.js';

const { chromium } = pkg;
const ROOT = new URL('../../../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, ROOT), 'utf8'));
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(readFileSync(new URL('src/date-beta/main.jsx', ROOT), 'utf8'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const data = applyPacks(read('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`src/date-beta/packs/${n}.json`) })));
export const ROUTE = /^(v2-.*|rooftop|cup|steeped|escape.*|.*town.*|.*shop.*|.*curry.*)$/;
const scenes = data.scenes.filter((s) => ROUTE.test(s.id));
const ALL = process.argv.includes('--all');
const OUT = new URL('research/sprint-0930/float-audit/', ROOT);
const SHOTS = new URL('shots/', OUT);
rmSync(SHOTS, { recursive: true, force: true }); mkdirSync(SHOTS, { recursive: true });
const TOL = 12;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const rows = [];
for (const sc of scenes) {
  const seen = new Set();
  for (let n = 0; n < sc.beats.length; n++) {
    await page.goto(`http://localhost:5218/date-beta.html?scene=${sc.id}&beat=${n}&still&seed=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const info = await page.evaluate(() => {
      const st = document.querySelector('.stage');
      const nd = document.querySelector('.db-nanda.frame-medium');
      if (!st || st.dataset.scene == null) return null;
      const say = document.querySelector('.db-say')?.textContent?.slice(0, 60) ?? '';
      return { scene: st.dataset.scene, bg: st.dataset.bg, shot: st.dataset.shot ?? null, say, nanda: !!nd && getComputedStyle(nd).display !== 'none',
        plant: !!document.querySelector('.db-plant'), raised: !!nd?.classList.contains('raised') };
    });
    if (!info || info.scene !== sc.id || !info.nanda) continue;
    const seenKey = `${info.bg}|${info.say}`; if (seen.has(seenKey)) continue; seen.add(seenKey);
    // her lowest painted row: screenshot with and without the sprite (filters + shadow off), diff in page.
    const clip = { x: 0, y: 0, width: 1920, height: 1080 };
    await page.addStyleTag({ content: '.db-nanda{filter:none!important;animation:none!important}.db-plant{visibility:hidden!important}*{transition:none!important}' });
    const a = (await page.screenshot({ clip })).toString('base64');
    await page.addStyleTag({ content: '.db-nanda{visibility:hidden!important}' });
    const b = (await page.screenshot({ clip })).toString('base64');
    const m = await page.evaluate(async ([a, b]) => {
      const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      const px = (im) => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, 1920, 1080).data; };
      const A = px(ia), B = px(ib);
      let low = -1, xs = [];
      for (let y = 1079; y >= 0 && low < 0; y--) for (let x = 0; x < 1920; x++) { const i = (y * 1920 + x) * 4;
        if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 60) { low = y; xs.push(x); } }
      const nd = document.querySelector('.db-nanda'); const r = nd.getBoundingClientRect();
      const cx = xs.length ? xs[Math.floor(xs.length / 2)] : r.left + r.width / 2;
      // UI directly under her lowest row = her feet are cropped by the box / panel
      const ui = [...document.querySelectorAll('.db-say, .db-choices, .db-ask, .db-handout, .hud-scrim, .db-bookline')].map((e) => e.getBoundingClientRect())
        .filter((q) => q.width && q.left < r.right && q.right > r.left);
      const boxTop = Math.min(1080, ...ui.map((q) => q.top));
      return { low, cx, boxTop, sprBottom: r.bottom };
    }, [a, b]);
    const cropped = m.low < 0 || m.low >= m.boxTop - 10 || m.low >= 1076;
    const key = floorOf(info.bg, info.shot).key;
    const floor = FLOORS[key];
    const floorY = floor?.crop ? null : floor?.y ?? null;
    const gap = floorY == null ? null : floorY - m.low;
    let flag = null;
    if (!cropped) {
      if (floor?.crop) flag = 'crop bg but her feet show';
      else if (floorY == null) flag = `no floor entry (${key})`;
      else if (Math.abs(gap) > TOL) flag = gap > 0 ? `floating ${gap}px` : `sunk ${-gap}px`;
      else if (!info.plant) flag = 'no contact shadow';
    }
    const row = { scene: sc.id, n, ...info, key, feet: m.low, boxTop: Math.round(m.boxTop), cropped, floorY, gap, flag };
    rows.push(row);
    if (flag || (ALL && !cropped)) { await page.goto(page.url(), { waitUntil: 'networkidle' }); await page.waitForTimeout(250);
      await page.screenshot({ path: new URL(`${sc.id}-b${n}.png`, SHOTS).pathname }); }
    console.log(`${sc.id} b${n} ${key} feet=${m.low} box=${Math.round(m.boxTop)} ${cropped ? 'cropped' : 'VISIBLE'} floor=${floorY} ${flag ?? ''}`);
  }
}
await browser.close();
const flags = rows.filter((r) => r.flag);
writeFileSync(new URL('result.json', OUT), JSON.stringify({ flags: flags.length, rows }, null, 1));
console.log(`\n${rows.length} Nanda beats, ${rows.filter((r) => !r.cropped).length} feet visible, ${flags.length} flags`);
for (const f of flags) console.log(`FLAG ${f.scene} b${f.n} ${f.bg}: ${f.flag}`);
process.exitCode = flags.length ? 1 : 0;
