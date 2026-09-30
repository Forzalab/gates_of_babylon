// sfx-wire browser QA: drives date-beta.html in headless Chromium with the real WebAudio graph and logs every sound that
// starts (file name, loop, start / stop time). Checks: beds loop and never double, a scene change stops the bed within
// 300 ms, mute zeroes the bus, and each wired event / beat sound actually plays.
// Run: node research/sprint-0930/sfx-wire/qa-browser.mjs   (starts its own vite dev server; needs Playwright + Chromium)
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const MAN = JSON.parse(readFileSync(path.join(ROOT, 'src/date-beta/assets.json'), 'utf8'));
const NFILES = Object.values(MAN.assets).filter((a) => a.kind === 'sfx' && a.path).length;
const port = await new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const vite = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), '--port', String(port), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
const BASE = `http://localhost:${port}/date-beta.html`;
for (let i = 0; i < 100; i++) { try { if ((await fetch(BASE)).ok) break; } catch { /* not up yet */ } await new Promise((r) => setTimeout(r, 200)); }

const results = [];
const check = (label, ok, detail = '') => { results.push({ label, ok: !!ok, detail }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` :: ${detail}` : ''}`); };

// every started source, named by the file its buffer was decoded from ('?' = a synth.js stand-in voice); every value the
// buses are driven to (setTargetAtTime); the count of decoded sfx files
const HOOK = () => {
  const abUrl = new WeakMap(), bufName = new WeakMap();
  const ra = Response.prototype.arrayBuffer;
  Response.prototype.arrayBuffer = function () { const u = this.url; return ra.call(this).then((ab) => { abUrl.set(ab, u); return ab; }); };
  const P = BaseAudioContext.prototype;
  const dec = P.decodeAudioData;
  window.__dec = 0;
  P.decodeAudioData = function (ab, ...r) {
    const u = abUrl.get(ab); window.__ctx = this;
    return dec.call(this, ab, ...r).then((b) => { bufName.set(b, (u || '?').split('/').pop()); window.__dec++; return b; });
  };
  window.__snd = [];
  window.__gain = [];
  const cbs = P.createBufferSource;
  P.createBufferSource = function () {
    const s = cbs.call(this), ctx = this, st = s.start, sp = s.stop;
    s.start = function (...a) { const rec = { name: bufName.get(s.buffer) || '?', loop: s.loop, t0: ctx.currentTime, stopAt: null, beat: null }; queueMicrotask(() => { rec.beat = document.documentElement.dataset.beat; }); s.__rec = rec; window.__snd.push(rec); window.__ctx = ctx; return st.apply(s, a); };
    s.stop = function (t) { if (s.__rec) { s.__rec.stopAt = t ?? ctx.currentTime; s.__rec.fade = s.__rec.stopAt - ctx.currentTime; } return sp.call(s, t); };
    return s;
  };
  const stt = AudioParam.prototype.setTargetAtTime;
  AudioParam.prototype.setTargetAtTime = function (v, ...r) { window.__gain.push(v); return stt.call(this, v, ...r); };
};

const browser = await pkg.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.addInitScript(HOOK);
const wait = (ms) => page.waitForTimeout(ms);
const snd = () => page.evaluate(() => window.__snd.map((r) => ({ ...r })));
const beatId = () => page.evaluate(() => document.documentElement.dataset.beat);
const sceneId = async () => (await beatId()).split(':')[0];
const live = (list) => list.filter((r) => r.loop && r.stopAt == null && r.name !== '?');
const played = (list, name, from = 0) => list.slice(from).filter((r) => r.name === `${name}.wav`);
// no gesture needed: --autoplay-policy lets main.jsx earlyAudio() unlock the loader once the first file is in. Wait until
// every sfx file is decoded, so a cue never falls back to its stand-in because the dev server was still sending it.
async function load(q = '') {
  await page.goto(q ? `${BASE}?${q}` : BASE);
  await page.waitForFunction((n) => window.__dec >= n, NFILES, { timeout: 30000 });
  await wait(700);
}
async function step(key = 'ArrowRight') { // press until the beat moves (holds / takes), max ~8 s
  const b0 = await beatId();
  for (let i = 0; i < 16; i++) { await page.keyboard.press(key); await wait(500); if ((await beatId()) !== b0) return true; }
  return false;
}
async function pick(key) { // a pick: the reaction frame keeps the beat id, so wait for a new sound or a new beat
  const n = (await snd()).length, b0 = await beatId();
  for (let i = 0; i < 16; i++) { await page.keyboard.press(key); await wait(500); if ((await snd()).length > n || (await beatId()) !== b0) break; }
  await wait(400);
}
async function nextScene() { // S skips to the scene's branch beat; take choice 1 there, then clear its reaction frame
  const s0 = await sceneId();
  for (let i = 0; i < 12 && (await sceneId()) === s0; i++) {
    await page.keyboard.press('s'); await wait(400);
    if ((await sceneId()) !== s0) break;
    await page.keyboard.press('1'); await wait(500);
    await page.keyboard.press('ArrowRight'); await wait(500);
  }
  return (await sceneId()) !== s0;
}

try {
  // 1. rooftop: the wind bed starts once, keeps looping over beats 0, 1 and 7 that each ask for it, stops on the scene change
  await load();
  for (let i = 0; i < 8 && (await beatId()) !== 'rooftop:8'; i++) await step();
  let L = await snd();
  const wind = played(L, 'wind');
  check('rooftop: the wind bed is a loop, started once across beats 0, 1 and 7', wind.length === 1 && wind[0].loop, `${wind.length} start(s), now at ${await beatId()}`);
  check('rooftop: one live bed', live(L).length === 1, live(L).map((r) => r.name).join(','));
  await nextScene();
  L = await snd();
  const w = L.find((r) => r.name === 'wind.wav');
  // v2-park opens on wind too: the bed runs on across the cut (no stop, no second copy); stops are checked in the walk
  check(`scene change rooftop -> ${await sceneId()} (both on wind): the bed runs on, no second copy`, w.stopAt == null && played(L, 'wind').length === 1, w.stopAt != null ? `stopped (fade ${w.fade.toFixed(3)} s)` : 'still the first wind');

  // 2. walk 25 scene changes: never two live beds, no bed restarted while it was already running
  let worst = 0, changes = 1;
  const trail = [await sceneId()];
  for (let i = 0; i < 25; i++) {
    if (!(await nextScene())) break;
    changes++; trail.push(await sceneId());
    worst = Math.max(worst, live(await snd()).length);
  }
  const all = await snd();
  const beds = all.filter((r) => r.loop && r.name !== '?');
  const doubled = beds.filter((r, i) => beds.some((q, j) => j < i && q.name === r.name && (q.stopAt == null || q.stopAt > r.t0)));
  const fades = beds.filter((r) => r.stopAt != null).map((r) => r.fade);
  check('scene walk: never more than one live bed', worst <= 1, `max live ${worst}; ${changes} scenes: ${trail.join(' > ')}`);
  check('scene walk: no bed started while the same bed was still running', doubled.length === 0, `beds started: ${beds.map((r) => `${r.name.replace('.wav', '')}@${r.beat}`).join(' ')}`);
  check('scene walk: every bed change fades the old bed out in <= 300 ms', fades.length === beds.length - live(all).length && fades.every((f) => f <= 0.3), `${fades.length} stops, longest fade ${Math.max(0, ...fades).toFixed(3)} s`);

  // 3. mute (M) drives the sfx bus to 0 and back
  await page.evaluate(() => { window.__gain.length = 0; });
  await page.keyboard.press('m'); await wait(300);
  const g1 = await page.evaluate(() => [...window.__gain]);
  await page.keyboard.press('m'); await wait(300);
  const g2 = await page.evaluate(() => [...window.__gain]);
  check('mute: the bus goes to 0, unmute brings it back', g1.includes(0) && g2.slice(g1.length).some((v) => v > 0), `muted ${JSON.stringify(g1)} -> unmuted ${JSON.stringify(g2.slice(g1.length))}`);

  // 4. v2-rain: a forced crit pick, then under the umbrella the canopy bed replaces the rain bed, then wind as it stops
  await load('scene=v2-rain&beat=1&gacha=crit5');
  let n0 = (await snd()).length;
  await pick('1');
  L = await snd();
  check('gacha crit pick: gacha-crit, no plain chime, no heart pop', played(L, 'gacha-crit', n0).length === 1 && !played(L, 'heart-pop', n0).length && !played(L, 'love-up', n0).length, L.slice(n0).map((r) => r.name).join(','));
  await step();
  L = await snd();
  const umb = played(L, 'umbrella-rain');
  check(`${await beatId()} (under the umbrella, medium rain): umbrella-rain loops, rain has stopped`, umb.length === 1 && umb[0].loop && live(L).length === 1 && live(L)[0].name === 'umbrella-rain.wav', `live: ${live(L).map((r) => r.name)}`);
  await step();
  L = await snd();
  check(`${await beatId()} (silence cue, still under it): the canopy runs on, not restarted`, played(L, 'umbrella-rain').length === 1 && live(L)[0]?.name === 'umbrella-rain.wav', `live: ${live(L).map((r) => r.name)}`);
  await step();
  L = await snd();
  check(`${await beatId()} (rain stopping, wind cue): wind replaces the canopy`, live(L).length === 1 && live(L)[0].name === 'wind.wav', `live: ${live(L).map((r) => r.name)}`);

  // 5. picks on the rooftop bento beat (1 = tamagoyaki +3 love-burst, 2 = umeboshi +1, 3 = neither -3 hate-quake)
  for (const [q, key, want, label] of [
    ['gacha=rage', '3', ['rage-thunder'], 'rage tier: rage-thunder'],
    ['gacha=anger', '3', ['anger-pop'], 'anger tier: anger-pop'],
    ['gacha=pity', '1', ['love-bomb'], 'pity tier: love-bomb'],
    ['seed=3', '2', ['love-up', 'gacha-crit', 'love-bomb'], 'plain ♥ pick: the love chime (or the tier that rolled)'],
    ['seed=3', '3', ['love-down', 'anger-pop', 'rage-thunder'], 'plain 💔 pick: love-down (or the tier that rolled)'],
    ['seed=3', '1', ['heart-pop', 'gacha-crit', 'love-bomb'], 'love-burst pick: heart-pop (unless a tier rolled)'],
    ['seed=3', '3', ['hate-quake', 'anger-pop', 'rage-thunder'], 'hate-quake pick: hate-quake (unless a tier rolled)'],
  ]) {
    await load(`scene=rooftop&beat=3&${q}`);
    n0 = (await snd()).length;
    await pick(key);
    L = (await snd()).slice(n0).map((r) => r.name.replace('.wav', ''));
    check(label, want.some((x) => L.includes(x)), L.join(','));
  }

  // 6. scene beats: vending clunk, two IC beeps, the katsu crunch (open on the beat before, step onto it)
  for (const [scene, b, name, count] of [['v2-train', 1, 'vending-clunk', 1], ['v2-train', 4, 'ic-beep', 2], ['v2-curry-katsu', 3, 'crunch', 1], ['v2-curry-katsu', 7, 'crunch', 1]]) {
    await load(`scene=${scene}&beat=${b}`);
    n0 = (await snd()).length;
    const moved = await step(); await wait(1200);
    L = await snd();
    check(`${await beatId()}: ${name} x${count}`, moved && played(L, name, n0).length === count, `heard ${L.slice(n0).map((r) => r.name).join(',')}`);
  }

  // 7. the lock game: every matched pair clicks, the last one plays the win; a timeout plays the fail
  await load('scene=escape&beat=14');
  await step(); await wait(500);
  n0 = (await snd()).length;
  const tiles = await page.$$eval('.lg-tile', (els) => els.map((e) => e.dataset.kind));
  const by = {};
  tiles.forEach((k, i) => (by[k] ??= []).push(i));
  for (const idx of Object.values(by)) for (let j = 0; j < idx.length; j += 2) {
    await page.click(`.lg-tile[data-i="${idx[j]}"]`); await wait(80);
    await page.click(`.lg-tile[data-i="${idx[j + 1]}"]`); await wait(150);
  }
  await wait(600);
  L = await snd();
  check('lock game: 7 tumbler clicks + 1 win', played(L, 'lock-click', n0).length === 7 && played(L, 'lock-win', n0).length === 1, `${tiles.length} tiles, clicks ${played(L, 'lock-click', n0).length}, win ${played(L, 'lock-win', n0).length}`);
  check('lock game: the rain bed runs on under it', live(L).some((r) => r.name === 'rain.wav'), `live: ${live(L).map((r) => r.name)}`);
  await load('scene=escape&beat=14');
  await step();
  n0 = (await snd()).length;
  await wait(42000); // the lock timer (40 s) runs out
  L = await snd();
  check('lock game: the timeout plays lock-fail', played(L, 'lock-fail', n0).length === 1, L.slice(n0).map((r) => r.name).join(','));
} finally {
  await browser.close();
  vite.kill();
}
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} checks ok`);
process.exit(fails.length ? 1 : 0);
