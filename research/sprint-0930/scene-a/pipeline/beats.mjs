// Scene A beat shots: every rooftop beat at 1920x1080, both frames of each two-step beat, the tamagoyaki + umeboshi paths
// (+ the salty branch), played with real keys under a fake clock (so the step-1 frame is caught before the swap).
// Also dumps the DOM boxes CHECKS.md needs (text lines, her sprite, the camera layers, pills, HUD) to beats/boxes.json.
// node research/sprint-0930/scene-a/pipeline/beats.mjs http://localhost:5196 research/sprint-0930/scene-a/beats [--before]
import { mkdirSync, writeFileSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5196', out = 'research/sprint-0930/scene-a/beats'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const { chromium } = pkg;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const boxes = {};

// The dev server may full-reload (another edit lands) mid-run: a run that sees a second load or Vite's error overlay is
// thrown away and played again from the start.
async function run(name, steps, tries = 5) {
  for (let k = 1; ; k++) {
    try { return await run1(name, steps); } catch (e) { if (k >= tries) throw e; console.warn(`${name}: ${e.message}, retry ${k}`); }
  }
}
async function run1(name, steps) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  let loads = 0;
  page.on('load', () => { loads += 1; });
  await page.clock.install();
  await page.goto(`${base}/date-beta.html?scene=rooftop&still&seed=7`);
  await page.waitForTimeout(600);
  await page.clock.pauseAt(Date.now() + 2000); // time stands still from here; only runFor moves it
  for (const [kind, arg, shot] of steps) {
    if (kind === 'key') await page.keyboard.press(arg);
    if (kind === 'hover') await page.hover(arg);
    if (kind === 'wait') await page.clock.runFor(arg);
    await page.clock.runFor(kind === 'wait' ? 0 : 60);
    await page.waitForTimeout(250);
    if (shot) {
      if (loads > 1 || await page.$('vite-error-overlay')) { await page.close(); throw new Error('page reloaded'); }
      await page.screenshot({ path: `${out}/${shot}.png` });
      boxes[shot] = await page.evaluate(() => {
        const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
        const vis = (el) => el && getComputedStyle(el).visibility !== 'hidden';
        // each rendered line of visible dialogue text, as client rects (one per wrapped line)
        const lines = [...document.querySelectorAll('.db-say > .line')].flatMap((p) => {
          const out = [];
          const walk = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3 && c.textContent.trim()) { if (!vis(c.parentElement)) continue; const rg = document.createRange(); rg.selectNodeContents(c); for (const b of rg.getClientRects()) out.push([Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]); } else if (c.nodeType === 1) walk(c); } };
          walk(p); return out;
        });
        const say = document.querySelector('.db-say');
        // occlusion: sample 7 points along each text line; the topmost painted element there must belong to the box
        // (hit-testing ignores pointer-events: none, so everything is made hit-testable for the probe)
        const probe = document.createElement('style');
        probe.textContent = '* { pointer-events: auto !important; }';
        document.head.append(probe);
        const covered = [];
        for (const [l, t, rr, bb] of lines) for (let k = 0; k < 7; k++) {
          const x = l + ((rr - l) * (k + 0.5)) / 7, y = (t + bb) / 2, top = document.elementFromPoint(x, y);
          if (top?.closest('.fx-pinkflash, .fx-vignette')) continue; // the pick's FX wash: a translucent full-stage tint (Fx.jsx), not a cover
          if (!top?.closest('.db-say') || top.closest('.hud-next')) covered.push([Math.round(x), Math.round(y), top?.tagName + '.' + (top?.className?.baseVal ?? top?.className ?? '')]);
        }
        probe.remove();
        return {
          beat: document.documentElement.dataset.beat, step: say?.dataset.step ?? null,
          text: [...document.querySelectorAll('.db-say > .line')].filter(vis).map((p) => [...p.childNodes].filter((c) => c.nodeType !== 1 || vis(c)).map((c) => c.textContent).join('')).join(' / '),
          say: r(say), covered, stamp: r(document.querySelector('.shot-stamp')), stampText: document.querySelector('.shot-stamp')?.textContent ?? null, sayBg: say ? getComputedStyle(say).backgroundColor : null, sayInk: say ? getComputedStyle(say.querySelector('.line')).color : null, lines,
          nanda: r(document.querySelector('.db-nanda')), frame: document.querySelector('.db-nanda')?.getAttribute('class')?.match(/frame-(\w+)/)?.[1] ?? 'off',
          face: document.querySelector('.db-nanda')?.dataset.face ?? null,
          layers: [...document.querySelectorAll('.sa-layer, .sa-handout-box, .sa-food-tag, .sa-other, .db-choice, .hud-next, .sa-smile')].map((e) => [e.className.baseVal ?? e.className, r(e)]),
          hud: r(document.querySelector('.hud-a')), trail: r(document.querySelector('.lv-trail')),
          stageFocus: document.querySelector('.stage')?.classList.contains('focus'),
        };
      });
    }
  }
  await page.close();
}

const S = (shot) => ['wait', 0, shot];
const next = (shot, wait = 1300) => [['wait', wait], ['key', 'Space'], ...(shot ? [S(shot)] : [])];
const common = (p, pickKey, react) => [
  S(`01-goal-card`),
  ...next(`02-establishing-stamp`),
  ...next(`03-she-is-there`),
  ...next(`04-handout`),
  ...(p === 'tama' ? [['hover', '.sa-food-tama'], S('04b-handout-hover-tama')] : []),
  ['wait', 1300], ['key', pickKey], S(`05-${p}-react`),
  ...next(`06-${p}-insert`),
  ...next(`07-${p}-lift`, 1000),
  ...next(`08-${p}-pov`, 1000),
  ...next(`09-${p}-eyes-cutaway`),
  ...next(`10a-${p}-peek-step1`),
  ['wait', 1100], S(`10b-${p}-peek-step2`),
];
await run('tama', [
  ...common('tama', 'Digit1'),
  ['key', 'Digit1'], S('11-tama-dont-stare-best'),
  ['wait', 1300], ['key', 'Space'], S('12a-tama-forecast-step1'),
  ['wait', 600], S('12b-tama-forecast-step2'),
  ...next('13-tama-stay-close'),
]);
await run('ume', [
  ...common('ume', 'Digit2'),
  ['key', 'Digit2'], S('11-ume-dont-stare-good'),
  ['wait', 1300], ['key', 'Space'], S('12a-ume-forecast-step1'),
  ['wait', 600], S('12b-ume-forecast-step2'),
  ...next('13-ume-stay-close'),
]);
// the salty answer: its react frame (her line, the peek frame) then the "Don't stare" beat's salty line
await run('salty', [
  ...next(null), ...next(null), ...next(null), ['wait', 1300], ['key', 'Digit1'],
  ...next(null), ...next(null), ...next(null, 1000), ...next(null, 1000), ...next(null), ...next(null), ['wait', 1100],
  ['key', 'Digit3'], S('11s-salty-react'),
  ...next('11t-salty-dont-stare'),
]);
writeFileSync(`${out}/boxes.json`, JSON.stringify(boxes, null, 1));
await browser.close();
console.log(Object.keys(boxes).length, 'shots');
