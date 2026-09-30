// SHOP rebuild (research/sprint-0930/shop/SHOTLIST.md): the shop pack gives every v2-shop line its own traced shot in
// the chain order, puts the HER LIST game right after the cart POV, and the game rules (shopgame.js) score + key right.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { ART_NAMES } from './date-beta-art-names.js';
import { ROUNDS, SECS, HOLD, bucket, keySlot, pickItem, timeOut, fresh, moodOf } from './date-beta/game/shopgame.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const MAIN = src('./date-beta/main.jsx');
const PLAY = JSON.parse(MAIN.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];
const INTERIORS = ['cellar', 'park', 'apartment-trace', 'sitting-room', 'bedroom', 'genkan-in', 'genkan-v2'];
const data = applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
const CHAIN = ['shop-vending', 'shop-doors', 'shop-list', 'shop-cart', 'shop-game', 'shop-basket-cups', 'shop-snacks', 'shop-checkout',
  'shop-register', 'shop-basket-handle', 'shop-self-checkout', 'shop-self-close', 'shop-way-out'];

test('shop pack: in PLAY before love; v2-shop = the chain, one bg per line, no camera shot left', () => {
  assert.ok(PLAY.indexOf('shop') >= 0 && PLAY.indexOf('shop') < PLAY.indexOf('love'));
  const shop = data.scenes.find((s) => s.id === 'v2-shop');
  assert.deepEqual(shop.beats.map((b) => b.bg), CHAIN);
  for (const b of shop.beats) assert.equal(b.props?.shot, undefined);
  assert.match(shop.beats[0].text, /^SHOP STREET · 2:00 PM\./, 'the place/time stamp opens the scene');
  assert.ok(loadScenes(data, { manifest: read('./date-beta/assets.json'), art: [...ART_NAMES, ...ROMANCE, ...INTERIORS, 'lock-game'] }));
  for (const id of CHAIN) assert.ok(ART_NAMES.includes(id), id);
});

test('shop pack: the game beat = 3 scored buckets, groceries route only, bento varies the eggs line', () => {
  const shop = data.scenes.find((s) => s.id === 'v2-shop');
  const g = shop.beats[4];
  assert.deepEqual(g.choices.map((c) => c.love), [-2, 2, 3]);
  assert.equal(g.props.cut.frame, 'off', 'the game draws its own Nanda');
  assert.equal(g.vary.bento.tamagoyaki.props.eggs, 'rolls');
  // only the groceries errand goes to v2-shop
  const into = data.scenes.flatMap((s) => s.beats.flatMap((b) => (b.choices ?? []).flatMap((c) => [c.go].flat())))
    .filter((go) => go && (go === 'v2-shop' || go.to === 'v2-shop'));
  assert.ok(into.length >= 1);
  for (const go of into) assert.deepEqual(go.if, { errand: 'groceries' });
  assert.match(src('./date-beta/game/index.js'), /'shop-game': ShopGame/);
});

test('HER LIST rules: 3 aisles (produce, eggs, the three-cups trap), one right item each, <= 45 s', () => {
  assert.deepEqual(ROUNDS.map((r) => r.id), ['produce', 'eggs', 'cups']);
  for (const r of ROUNDS) {
    assert.equal(r.items.filter((i) => i.ok).length, 1, r.id);
    assert.ok(r.items.length >= 3 && r.items.length <= 4, r.id);
  }
  assert.ok(ROUNDS[2].items.find((i) => i.id === 'pair').aside.includes('third'));
  assert.ok(ROUNDS.length * SECS * 1000 <= 45_000);
  for (const v of Object.values(HOLD)) assert.ok(v >= 334);
  for (const r of ROUNDS) for (const id of [r.bg, r.close]) assert.match(src('./date-beta/art/shop/index.js'), new RegExp(`'${id}'`));
});

test('HER LIST scoring: right moves on, wrong escalates pout -> OCPD -> BPD, timeout counts as wrong', () => {
  const right = (s) => pickItem(s, ROUNDS[s.r].items.findIndex((i) => i.ok));
  const wrong = (s) => pickItem(s, ROUNDS[s.r].items.findIndex((i) => !i.ok));
  let s = right(right(right(fresh())));
  assert.equal(s.done, true); assert.equal(bucket(s.wrongs), 2);
  s = right(right(right(wrong(fresh()))));
  assert.equal(s.wrongs, 1); assert.equal(bucket(s.wrongs), 1);
  s = wrong(wrong(wrong(fresh())));
  assert.equal(s.r, 0, 'a wrong pick stays in the aisle');
  assert.deepEqual([1, 2, 3, 7].map((w) => moodOf(w).face), ['pout', 'vein', 'split', 'split']);
  assert.equal(moodOf(2).bg, 'shop-tea-tins', 'OCPD cuts to the straightened shelf');
  assert.ok(moodOf(3).sweet, 'the BPD split snaps back sweet');
  assert.equal(bucket(s.wrongs), 0);
  const t = timeOut(fresh());
  assert.deepEqual([t.r, t.wrongs, t.last.timeout], [1, 1, true]);
  assert.equal(pickItem({ ...fresh(), r: 0 }, 9).last, null, 'no item in that slot');
});

test('HER LIST keys: 1-4 map to the shelf slots, others ignored; the game captures digits before main.jsx', () => {
  assert.deepEqual(['1', '2', '3', '4'].map((k) => keySlot(k, 4)), [0, 1, 2, 3]);
  assert.equal(keySlot('4', 3), null);
  assert.equal(keySlot('a', 4), null);
  assert.equal(keySlot(' ', 4), null);
  const jsx = src('./date-beta/game/ShopGame.jsx');
  assert.match(jsx, /addEventListener\('keydown', onKey, true\)/);
  assert.match(jsx, /stopImmediatePropagation/);
  assert.match(jsx, /She is waiting/);
  assert.doesNotMatch(src('./date-beta/game/shopgame.css'), /transition\s*:|@keyframes|animation\s*:/, 'stepped frames only');
  assert.ok(existsSync(new URL('./date-beta/game/shopgame.css', import.meta.url)));
});

test('shop fix: hide-Nanda (cut.frame off) and a line emote stay on their own beat; the register line pouts', async () => {
  const { carried } = await import('./date-beta/engine.js');
  assert.deepEqual(carried({ emote: 'pout', cut: { frame: 'off', face: 'x' }, secs: 12 }), { cut: { face: 'x' }, secs: 12 });
  const shop = data.scenes.find((s) => s.id === 'v2-shop');
  assert.equal(shop.beats.find((b) => b.bg === 'shop-register').props.emote, 'pout');
  assert.match(MAIN, /beat\.props\?\.emote/, 'the player reads the emote field');
});
