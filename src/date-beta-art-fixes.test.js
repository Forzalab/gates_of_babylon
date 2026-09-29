// Art fixes, rendered: the train ad follows the bento pick (tamagoyaki = the sweet ad, matching train:1's line), and the
// rooftop's Figur Weather sign clears the dialogue box when it lifts on choice beats.
// The .jsx art is compiled with the JSX transform vite already ships (rolldown) and rendered with react-dom/server.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'rolldown/experimental';
import { loadScenes, start, next, choose, beatView, beatAt } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';

// Compile a .jsx file to a data: module. Relative .jsx imports compile the same way, other relative imports become
// absolute file URLs, bare ones resolve from here, CSS imports are dropped.
function jsxUrl(url) {
  const { code, errors } = transformSync(fileURLToPath(url), readFileSync(url, 'utf8'), { jsx: { runtime: 'automatic' } });
  assert.equal(errors.length, 0, `${url}: ${errors.map((e) => e.message).join('; ')}`);
  const out = code
    .replace(/^import\s+['"][^'"]+\.css['"];?$/gm, '')
    .replace(/(from\s+|import\s*\(\s*)(['"])([^'"]+)\2/g, (m, pre, q, spec) => {
      if (!spec.startsWith('.')) return `${pre}${q}${import.meta.resolve(spec)}${q}`;
      const abs = new URL(spec, url);
      return `${pre}${q}${spec.endsWith('.jsx') ? jsxUrl(abs) : abs.href}${q}`;
    });
  return `data:text/javascript;base64,${Buffer.from(out).toString('base64')}`;
}
const load = (f) => import(jsxUrl(new URL(`./date-beta/art/${f}`, import.meta.url)));
const { default: Train, adFor, AD_LABEL } = await load('Train.jsx');
const { default: Rooftop, SIGN } = await load('Rooftop.jsx');
const draw = (C, props) => renderToStaticMarkup(createElement(C, { props, rm: true }));
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');

const scenes = loadScenes(data, { manifest, art: ART_NAMES });
// the beat the player sees, with its vary overlay, walking from the rooftop with this bento pick
function trainBeats(bento) {
  let p = start(scenes, { at: 'rooftop' });
  p = next(scenes, p);
  const i = scenes[p.s].beats[p.b].choices.findIndex((c) => c.set?.bento === bento);
  p = choose(scenes, p, i);
  const out = [];
  while (!p.done && out.length < 2) {
    if (p.react) { p = next(scenes, p); continue; } // a scored pick's reaction frame: still the picking beat on screen
    const b = beatView(beatAt(scenes, p), p.flags);
    if (b.scene === 'train') out.push(b);
    const c = scenes[p.s].beats[p.b].choices;
    p = c ? choose(scenes, p, 0) : next(scenes, p);
  }
  return out;
}

test('train ad: adFor reads props.ad, else the adCopy, else the umeboshi default', () => {
  assert.equal(adFor({}), 'umeboshi');
  assert.equal(adFor({ ad: 'tamagoyaki' }), 'tamagoyaki');
  assert.equal(adFor({ ad: 'umeboshi', adCopy: '甘い！ SWEET!' }), 'umeboshi', 'props.ad wins');
  assert.equal(adFor({ adCopy: '甘い！ SWEET!' }), 'tamagoyaki');
  assert.equal(adFor({ adCopy: 'すっぱい！ SOUR!' }), 'umeboshi');
});

test('train ad: both train beats show the ad the line names, on both bento paths', () => {
  const want = { umeboshi: ['NOT', 'すっぱい', 'SOUR!'], tamagoyaki: ['YES', '甘い！', 'SWEET!'] };
  const not = { umeboshi: ['SWEET!', '甘い'], tamagoyaki: ['すっぱい', 'SOUR!', '梅干し'] };
  for (const bento of ['umeboshi', 'tamagoyaki']) {
    const beats = trainBeats(bento);
    assert.equal(beats.length, 2, `${bento}: two train beats`);
    assert.match(beats[1].text, bento === 'tamagoyaki' ? /SWEET/ : /SOUR/, 'the zoom line names this ad');
    for (const b of beats) {
      assert.equal(adFor(b.props), bento, `${bento} ${b.scene}:${b.index} props ${JSON.stringify(b.props)}`);
      const html = draw(Train, b.props), t = text(html);
      assert.match(html, new RegExp(`data-ad="${bento}"`));
      assert.ok(html.includes(AD_LABEL[bento]), 'aria-label names the ad');
      for (const w of want[bento]) assert.ok(t.includes(w), `${bento}: ad shows ${w}`);
      for (const w of not[bento]) assert.ok(!t.includes(w), `${bento}: ad must not show ${w}`);
    }
  }
});

test('train ad: the tamagoyaki ad is hand-built SVG in the umeboshi frame (no raster)', () => {
  const ume = draw(Train, { ad: 'umeboshi' }), tama = draw(Train, { ad: 'tamagoyaki' });
  const frame = /<g transform="translate\(720 118\)"><rect width="660" height="310"/;
  assert.match(ume, frame);
  assert.match(tama, frame);
  assert.ok(!/<image|<img|url\(data:|\.png|\.jpe?g|\.webp/.test(tama), 'no raster in the ad');
  const spirals = [...tama.matchAll(/<path d="([^"]+)"/g)].filter(([, d]) => (d.match(/Q/g) || []).length >= 8);
  assert.equal(spirals.length, 2, 'two cut slices, each with its rolled spiral');
});

test('rooftop sign: the whole board sits above the lifted choice box, and inside the stage', () => {
  // beta.css lifts .db-say to bottom: 318px on choice beats; its box is ~190 tall + pins/NANDA pill ~24 above it
  const css = readFileSync(new URL('./date-beta/beta.css', import.meta.url), 'utf8');
  const lift = Number(/\.stage:has\(\.db-choices\) \.db-say \{ bottom: (\d+)px/.exec(css)?.[1]);
  assert.ok(lift >= 300, 'found the lifted box offset');
  const liftedTop = 1080 - lift - 190 - 24; // ~548: the NANDA pill's top on choice beats
  const bottom = SIGN.y + SIGN.h + 2.5; // + half the 5px stroke
  assert.ok(bottom <= liftedTop - 12, `sign bottom ${bottom} vs lifted box top ${liftedTop}`);
  assert.ok(SIGN.x >= 0 && SIGN.y >= 0 && SIGN.x + SIGN.w <= 1920);
  for (const clock of ['live', 'noon']) {
    const html = draw(Rooftop, { clock });
    assert.match(html, new RegExp(`<g class="sign" transform="translate\\(${SIGN.x} ${SIGN.y}\\)">`));
    const t = text(html);
    assert.ok(t.includes('Figur Weather'));
    assert.match(t.replace(/\s+/g, ''), /Today'sf-OR-ecast:rain/);
  }
});
