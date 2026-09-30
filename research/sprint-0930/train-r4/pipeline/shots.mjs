// train-r4 shots: v2-train beats 0-8 (= table rows 1-9) on BOTH bento paths in the real player
// (date-beta.html?scene=v2-train&beat=N&bento=…&still, 1920x1080), plus the two-step frames of beat 3 (ticked-off, then puff).
// Dumps per shot: the DOM line, the face on her sprite, the dialogue + Nanda boxes -> shots/shots.json (checks.py reads it).
// usage: node research/sprint-0930/train-r4/pipeline/shots.mjs http://localhost:5199 research/sprint-0930/train-r4/shots
import { mkdirSync, writeFileSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5199', out = 'research/sprint-0930/train-r4/shots'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && !/404/.test(m.text()) && errs.push(m.text()));
const info = {};
let cur = p;
const grab = async (name) => {
  await cur.screenshot({ path: `${out}/${name}.png` });
  info[name] = await cur.evaluate(() => {
    const r = (el) => { if (!el) return null; const q = el.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); };
    const line = document.querySelector('.db-say .line');
    return { beat: document.documentElement.dataset.beat, bg: document.querySelector('.scene .art')?.className, face: document.querySelector('.db-nanda')?.dataset.face ?? null,
      text: [...document.querySelectorAll('.db-say .line')].filter((e) => getComputedStyle(e).visibility !== 'hidden').map((e) => e.innerText).join(' / '),
      hidden: [...document.querySelectorAll('.db-say .db-later')].map((e) => e.innerText).join(' '),
      spans: [...document.querySelectorAll('.db-say .db-span')].map((e) => [e.className, e.innerText]),
      covered: (() => { const el = document.querySelector('.db-say'); const out = [];
        const st = document.createElement('style'); st.textContent = '.db-say, .db-say * { pointer-events: auto !important; }'; document.head.append(st);
        for (const ln of document.querySelectorAll('.db-say .line')) { const q = ln.getBoundingClientRect(); if (getComputedStyle(ln).visibility === 'hidden') continue;
          for (let i = 1; i <= 7; i++) { const x = q.left + (q.width * i) / 8, y = q.top + q.height / 2; const t = document.elementFromPoint(x, y); if (t && !el.contains(t)) out.push([Math.round(x), Math.round(y), t.className?.baseVal ?? t.className]); } }
        st.remove(); return out; })(),
      say: r(document.querySelector('.db-say')), line: r(line), nanda: r(document.querySelector('.db-nanda')), sleepy: r(document.querySelector('.r4-sleeper')) };
  });
  console.log(name, JSON.stringify(info[name]));
};
for (const bento of ['umeboshi', 'tamagoyaki']) {
  for (let n = 0; n <= 8; n++) {
    const tag = `${bento === 'umeboshi' ? 'ume' : 'tama'}-beat${n + 1}`;
    if (n === 3) { // two-step beat: a fresh page on Playwright's fake clock, so the step-1 frame is caught before the swap
      const q = await b.newPage({ viewport: { width: 1920, height: 1080 } });
      cur = q;
      await q.clock.install({ time: new Date('2026-09-30T16:30:00') });
      await q.clock.pauseAt(new Date('2026-09-30T16:30:01'));
      await q.goto(`${base}/date-beta.html?scene=v2-train&beat=${n}&bento=${bento}&still&seed=7`, { waitUntil: 'networkidle' });
      await q.clock.runFor(200);
      await grab(`${tag}a-step1`);
      await q.clock.runFor(1500);
      await q.waitForTimeout(200);
      await grab(`${tag}b-step2`);
      await q.close();
      cur = p;
    } else {
      await p.goto(`${base}/date-beta.html?scene=v2-train&beat=${n}&bento=${bento}&still&seed=7`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1400);
      await grab(tag);
    }
  }
}
writeFileSync(`${out}/shots.json`, JSON.stringify(info, null, 1));
if (errs.length) { console.log('ERRORS', errs); process.exitCode = 1; }
await b.close();
