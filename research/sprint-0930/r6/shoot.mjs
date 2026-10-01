import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const MODE = process.argv[2]; // ume | leave-a | leave-b
const OUT = new URL('./after/', import.meta.url).pathname; // R5: the re-shoot, next to the before set in ../paths
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '', ch: qa('.db-choice').map((c) => ({ text: c.querySelector('.line')?.innerText ?? c.innerText, chip: c.querySelector('.db-chip')?.textContent ?? '', cls: c.querySelector('.db-chip')?.className ?? '' })), card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null, game: !!q('.lg-root'), pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null };
};
await page.goto('http://localhost:5232/date-beta.html?seed=1&fx=full&bento=umeboshi', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.beat || document.querySelector('.hud-card'), null, { timeout: 15000 });
let n = 1; const log = [];
const shot = async (s, tag, taken) => {
  const nm = `${String(n++).padStart(3, '0')}-${(s.beat || 'x').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  const text = (s.end ? 'END: ' + s.end : s.card ? 'CARD: ' + s.card : (s.who ? s.who + ': ' : '') + s.line).replace(/\s+/g, ' ').slice(0, 60);
  log.push({ nm, scene: (s.beat || '').split(':')[0], beat: (s.beat || '').split(':')[1] ?? '', tag, text, choices: s.ch.map((c) => c.chip + c.text), taken: taken || '', pop: s.pop });
};
const want = (b, ch) => {
  const f = (re) => ch.findIndex((c) => re.test(c.text));
  let i = -1;
  if (MODE === 'ume') i = f(/umeboshi/i);
  else { i = f(/tamagoyaki/i); if (i < 0) i = f(/Leave before/i); }
  if (i < 0 && MODE !== 'ume') i = f(/Say goodnight/i);
  if (i < 0 && MODE === 'leave-b') i = f(/yeah ig/i);
  if (i < 0 && MODE === 'leave-a') i = f(/FUCK YOU/i);
  return i;
};
let jumped = false; let prev = '', still = Date.now();
while (n < 400 && Date.now() - still < 60000) {
  let s = await page.evaluate(LOOK);
  const key = [s.beat, s.line, s.ch.length, s.card, s.end, s.pop].join('|');
  if (key !== prev) {
    await page.waitForTimeout(900); s = await page.evaluate(LOOK); prev = key; still = Date.now();
    await shot(s, s.end ? 'end' : s.card ? 'card' : s.ch.length ? 'choice' : s.pop ? 'react' : '', '');
    if (s.end) { await page.waitForTimeout(2500); await page.screenshot({ path: OUT + `${String(n++).padStart(3, '0')}-END-settled.png` }); break; }
  }
  if (MODE !== 'ume' && !jumped && /^v2-park:0/.test(s.beat || '')) { jumped = true; await page.goto('http://localhost:5232/date-beta.html?seed=1&fx=full&scene=door&beat=0', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500); prev = ''; continue; }
  if (s.game) { await page.waitForTimeout(1000); continue; }
  if (s.card) { await page.waitForTimeout(800); await page.locator('.hud-card .hud-next').click().catch(() => {}); await page.waitForTimeout(400); continue; }
  if (s.ch.length) {
    let idx = want(s.beat, s.ch);
    if (idx < 0) { const sc = s.ch.map((c, i) => [i, /down/.test(c.cls) ? -1 : +(c.chip.match(/\d+/) || [0])[0]]).sort((a, b) => b[1] - a[1]); idx = sc[0][0]; }
    log[log.length - 1].taken = s.ch[idx].chip + s.ch[idx].text;
    await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(700);
    const r = await page.evaluate(LOOK);
    if (!r.ch.length || r.line !== s.line) { await shot({ ...r, beat: s.beat }, 'react', ''); prev = [r.beat, r.line, r.ch.length, r.card, r.end, r.pop].join('|'); }
    await page.waitForTimeout(400); continue;
  }
  const nb = page.locator('.hud-next').first();
  if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
  await page.waitForTimeout(250);
}
fs.writeFileSync(OUT + 'log.json', JSON.stringify(log, null, 1));
console.log(MODE, log.length, 'shots', n - 1, log.at(-1)?.text);
await browser.close();
