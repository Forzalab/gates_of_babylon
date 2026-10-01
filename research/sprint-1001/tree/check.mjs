// Branch-map overlap check. node research/sprint-1001/tree/check.mjs <label> [--jump]
// Needs a dev server on :5460. Counts pairwise overlaps among scene nodes + pills, at Fit and at 100% (when the
// zoom buttons exist), saves <label>-*.jpg next to this file, and (--jump) clicks one pill and checks the game jumps.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const label = process.argv[2] ?? 'run';
const dir = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.setDefaultTimeout(15000);
await page.goto('http://localhost:5460/date-beta.html?debug');
await page.waitForSelector('.db-tree .db-tree-node');
await page.waitForTimeout(500);

const measure = () => page.evaluate(() => {
  const els = [...document.querySelectorAll('.db-tree-node, .db-tree-edge')];
  const r = els.map((el) => ({ el, b: el.getBoundingClientRect(), name: `${el.className.split(' ')[0].replace('db-tree-', '')}:${el.dataset.edge ?? el.textContent}` }));
  const hits = [];
  for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
    const a = r[i].b, b = r[j].b;
    if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) hits.push(`${r[i].name} x ${r[j].name}`);
  }
  // clipped = text wider/taller than its box, or a box cut by the viewport edge of the scroll area is NOT counted (pan)
  // clipped = the label's own text is wider than the box's inner width, or wraps/overflows vertically
  const clipped = r.filter(({ el, b }) => {
    const range = document.createRange(); range.selectNodeContents(el);
    const t = range.getBoundingClientRect(), cs = getComputedStyle(el), k = b.width / el.offsetWidth || 1;
    return t.width > b.width - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)) * k + 1 || t.height > b.height + 1;
  }).map((x) => x.name);
  return { nodes: document.querySelectorAll('.db-tree-node').length, pills: document.querySelectorAll('.db-tree-edge').length,
    overlaps: hits.length, sample: hits.slice(0, 5), clipped: clipped.length, clippedSample: clipped.slice(0, 5),
    bg: getComputedStyle(document.querySelector('.db-tree')).backgroundColor };
});
const out = {};
// as opened (the fix opens at 100%, scrolled to the current scene)
out.open = await measure();
out.open.hereVisible = await page.evaluate(() => {
  const h = document.querySelector('.db-tree-node.here')?.getBoundingClientRect();
  return !!h && h.top >= 0 && h.bottom <= innerHeight && h.left >= 0 && h.right <= innerWidth && document.elementFromPoint(h.x + h.width / 2, h.y + h.height / 2)?.closest('.db-tree-node.here') != null;
});
await page.screenshot({ path: `${dir}${label}-open.jpg`, type: 'jpeg', quality: 70 });
const fit = await page.$('[data-zoom="fit"]');
if (fit) {
  await fit.click(); await page.waitForTimeout(300);
  out.fit = await measure();
  await page.screenshot({ path: `${dir}${label}-fit.jpg`, type: 'jpeg', quality: 70 });
  await page.click('[data-zoom="1"]'); await page.waitForTimeout(300);
  out.full = await measure();
}
if (process.argv.includes('--jump')) {
  // a main-lane pill into another scene (title "from → to"), so the landing scene proves the jump
  const id = process.argv.find((a) => a.startsWith("--edge="))?.slice(7) ?? await page.evaluate(() => [...document.querySelectorAll('.db-tree-edge:not(.legacy)')]
    .find((b) => { const [f, t] = b.title.split(' → '); return t !== f && t !== 'rooftop'; })?.dataset.edge);
  const pill = page.locator(`.db-tree-edge[data-edge="${id}"]`);
  const to = (await pill.getAttribute('title')).split(' → ')[1];
  await pill.scrollIntoViewIfNeeded();
  await pill.click();
  await page.waitForTimeout(400);
  let asked = 0;
  while (asked < 5 && await page.$('.db-ask')) { asked++; await page.click('.db-ask .db-choice'); await page.waitForTimeout(400); }
  await page.waitForTimeout(400);
  out.jump = { edge: id, to, asked, treeOpen: !!(await page.$('.db-tree')), scene: await page.getAttribute('.stage', 'data-scene') };
  // a liked/disliked pick first shows its reaction frame in the pick's scene; one click moves on
  if (out.jump.scene !== to) {
    await page.mouse.click(960, 300); await page.waitForTimeout(800);
    out.jump.afterOneClick = await page.getAttribute('.stage', 'data-scene');
  }
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
