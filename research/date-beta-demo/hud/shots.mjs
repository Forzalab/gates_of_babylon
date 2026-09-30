// HUD build shots (live engine, not mockups): goal card, bar mid-game, +3 / -2 reactions, NEXT, win / almost / low
// endings, a reduced-motion frame, the focus effect at scare 0 and 2. 1920x1080. Also checks the HUD parts never overlap
// the chrome chips, the dialogue chip, the choice pills or each other, and measures frame time with / without blur.
// usage: npx vite --port 5733 --strictPort &   node research/date-beta-demo/hud/shots.mjs [base] [only]
// Writes full-colour PNGs; run shrink.py after to commit 256-colour copies.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:5733';
const ONLY = process.argv[3];
const browser = await pkg.chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const errors = [];
const overlap = (a, b) => a && b && a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1;

// name -> { q: query, rm, click: [selector | text], wait }
const SHOTS = {
  'goal-card': { q: 'scene=rooftop', wait: 2600 },
  'bar-midgame': { q: 'scene=cup&beat=2&love=11', wait: 1400 },
  'react-plus3': { q: 'scene=rooftop&beat=1', pick: 'Take the tamagoyaki', wait: 1600 },
  'react-minus2': { q: 'scene=cup&beat=3&love=11', pick: 'Stand up', wait: 1600 },
  'next-button': { q: 'scene=door&beat=2&love=9', wait: 1400 },
  'win-splash': { q: 'scene=steeped&beat=4&love=16', wait: 2600 },
  'almost-ending': { q: 'scene=escape-timeout&beat=7&love=12', wait: 2600 },
  'low-ending': { q: 'scene=leave-fu&beat=4&love=2', wait: 2600 },
  'rm-react-minus2': { q: 'scene=cup&beat=3&love=11', pick: 'Stand up', rm: true, wait: 900 },
  'focus-scare0': { q: 'scene=rooftop&beat=2&love=3', wait: 1400 },
  'focus-scare2': { q: 'scene=steeped&beat=1&love=16', wait: 1400 },
  'onboarding-first': { q: '', wait: 2600 },
  'onboarding-later': { q: '', click: true, pick: 'Take the tamagoyaki', wait: 1600 },
};

async function open(q, rm) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${q}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${q}: ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?${q}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

const report = [];
for (const [name, s] of Object.entries(SHOTS)) {
  if (ONLY && name !== ONLY) continue;
  const page = await open(s.q, s.rm);
  if (s.click) { await page.waitForTimeout(1400); await page.mouse.click(960, 380); }
  if (s.pick) {
    await page.waitForTimeout(700);
    await page.locator('.db-choice', { hasText: s.pick }).first().click();
  }
  await page.waitForTimeout(s.wait);
  const r = await page.evaluate(() => {
    const box = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const all = (sel) => [...document.querySelectorAll(sel)].map(box);
    return { hud: all('.hud-a, .lv-pop .lv-delta, .lv-tell, .db-hint'), chips: all('.chrome a, .chrome button'), say: all('.db-say, .db-say .who'),
      choices: all('.db-choice'), cards: all('.hud-card, .hud-end'), beat: document.documentElement.dataset.beat,
      next: !!document.querySelector('.db-next'), focus: document.querySelector('.scene')?.dataset.focus ?? '-' };
  });
  const bad = [];
  r.hud.forEach((h, i) => {
    for (const [k, list] of [['chip', r.chips], ['dialogue', r.say], ['choice', r.choices], ['card', r.cards]]) list.forEach((c) => overlap(h, c) && bad.push(`hud#${i} x ${k}`));
  });
  await page.screenshot({ path: path.join(DIR, `${name}.png`) });
  const line = `${name}: beat ${r.beat}, focus ${r.focus}, next ${r.next}${bad.length ? `, OVERLAP ${bad.join(' ')}` : ', clear'}`;
  console.log(line);
  report.push(line);
  if (bad.length) errors.push(line);
  await page.close();
}

// Frame time: rAF deltas over 3 s on the busiest art (rooftop live clock, platform rain) with the focus on, blur vs ?noblur.
if (!ONLY || ONLY === 'frames') {
  for (const q of ['scene=rooftop&beat=2', 'scene=platform&beat=0']) {
    for (const extra of ['', '&noblur']) {
      const page = await open(q + extra, false);
      await page.waitForTimeout(1500);
      const ms = await page.evaluate(() => new Promise((res) => {
        const t = []; let last = performance.now();
        const f = (now) => { t.push(now - last); last = now; if (t.length < 180) requestAnimationFrame(f); else res(t.slice(5)); };
        requestAnimationFrame(f);
      }));
      ms.sort((a, b) => a - b);
      const avg = ms.reduce((a, b) => a + b, 0) / ms.length, p95 = ms[Math.floor(ms.length * 0.95)];
      const line = `frames ${q}${extra || ' (blur)'}: avg ${avg.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms`;
      console.log(line);
      report.push(line);
      await page.close();
    }
  }
}
await browser.close();
if (!ONLY) fs.writeFileSync(path.join(DIR, 'REPORT.txt'), `${report.join('\n')}\n`);
if (errors.length) { console.error(`ERRORS:\n${errors.join('\n')}`); process.exitCode = 1; }
