export default async function (page, OUT, tag, w) {
  const log = (...a) => console.log(w, ...a);
  const act = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.className || document.activeElement?.tagName);
  const btn = page.getByRole('button', { name: 'Open full truth table' });
  const bb = await btn.boundingBox(); log('open button', JSON.stringify(bb));
  await page.screenshot({ path: `${OUT}${tag}-${w}-button.png`, clip: await page.locator('.truth').boundingBox() });
  await btn.hover(); await page.screenshot({ path: `${OUT}${tag}-${w}-button-hover.png`, clip: await page.locator('.truth').boundingBox() });
  await btn.click(); await page.waitForTimeout(500);
  log('focus on open:', await page.evaluate(() => document.activeElement?.closest('tr')?.className + '|' + document.activeElement?.tagName));
  const d = await page.evaluate(() => { const t = document.querySelector('.tpanel .tt'); const p = document.querySelector('.tpanel').getBoundingClientRect(); return { cols: document.querySelectorAll('.tpanel th').length, w: t.clientWidth, sw: t.scrollWidth, rows: document.querySelectorAll('.tpanel tbody tr:not(.pad)').length, sb: t.style.getPropertyValue('--sb'), panel: [p.x, p.y, p.width, p.height].map(Math.round), inert: [...document.querySelector('.app').children].filter((c) => c.inert).length }; });
  log('popup', JSON.stringify(d));
  await page.screenshot({ path: `${OUT}${tag}-${w}-popup.png` });
  await page.locator('.tpanel .tt').evaluate((e) => { e.scrollTop = 20 * 44; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}${tag}-${w}-popup-scrolled.png` });
  // row click sets switches
  await page.locator('.tpanel tbody tr:not(.pad)').nth(3).click(); await page.waitForTimeout(200);
  log('live after click:', await page.evaluate(() => [...document.querySelectorAll('.tpanel tr.live td')].map((t) => t.textContent.trim()).join('')), 'inline:', await page.evaluate(() => [...document.querySelectorAll('.truth:not(.tpanel) tr.live td')].map((t) => t.textContent.trim()).join('')));
  const closeVia = async (name, fn) => { await fn(); await page.waitForTimeout(300); log(name, 'open?', await page.locator('.tpop').count(), 'focus:', await act(), 'inert left:', await page.evaluate(() => [...document.querySelector('.app').children].filter((c) => c.inert).length)); };
  await closeVia('Escape', () => page.keyboard.press('Escape'));
  await btn.click(); await page.waitForTimeout(300);
  await closeVia('X', () => page.getByRole('button', { name: 'Close' }).click());
  await btn.click(); await page.waitForTimeout(300);
  await closeVia('backdrop', () => page.mouse.click(8, w === 1920 ? 540 : 400));
}
