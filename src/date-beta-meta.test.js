import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, beatView, beatAt } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { fill, clock, daypart, runBucket, setCrowd, setSceneTime, storyOffset, storyTime, storyStamp } from './date-beta/meta.js';

const json = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)));
const base = json('./date-beta/scenes.json');
const meta = json('./date-beta/packs/meta.json');
const crowd = json('./date-beta/packs/crowd.json');

test('meta pack loads on top of scenes.json with tokens allowed', () => {
  const s = loadScenes(applyPacks(base, [{ name: 'meta', ...meta }]));
  assert.ok(s.find((x) => x.id === 'meta-loop'));
});

test('story clock: real time only 12:00-14:00, else canonical', () => {
  const at = (h, m) => new Date(2026, 9, 1, h, m);
  assert.equal(storyOffset(at(11, 59)), 0);
  assert.equal(storyOffset(at(12, 0)), 0);
  assert.equal(storyOffset(at(13, 37)), 97);
  assert.equal(storyOffset(at(14, 0)), 0);
  assert.deepEqual(storyTime(12, 0, at(13, 37)), [13, 37]);
  assert.deepEqual(storyTime(3, 0, at(12, 20)), [3, 20]);
  assert.deepEqual(storyTime(7, 0, at(11, 59)), [7, 0]);
  assert.deepEqual(storyTime(12, 0, at(14, 0)), [12, 0]);
  assert.equal(storyStamp('12:00 NOON', at(13, 37)), '1:37 PM');
  assert.equal(storyStamp('12:00 NOON', at(12, 0)), '12:00 NOON');
  assert.equal(storyStamp('2:45 PM', at(12, 30)), '3:15 PM');
  assert.equal(storyStamp('7:30 PM', at(13, 0)), '8:30 PM');
  assert.equal(storyStamp('11:50 AM', at(12, 15)), '12:05 PM');
  assert.equal(storyStamp('7:00 PM', at(15, 0)), '7:00 PM');
  assert.equal(storyStamp('later', at(13, 0)), 'later');
});

test('clock, daypart, run bucket', () => {
  assert.equal(clock(new Date(2026, 8, 30, 14, 41)), '2:41 PM');
  assert.equal(clock(new Date(2026, 8, 30, 0, 5)), '12:05 AM');
  assert.equal(daypart(new Date(2026, 8, 30, 9)), 'morning');
  assert.equal(daypart(new Date(2026, 8, 30, 14)), 'afternoon');
  assert.equal(daypart(new Date(2026, 8, 30, 19)), 'evening');
  assert.equal(daypart(new Date(2026, 8, 30, 23)), 'night');
  assert.deepEqual([1, 2, 3, 9].map(runBucket), ['1', '2', '3', '3']);
});

test('fill replaces every token, leaves other text', () => {
  setCrowd(crowd);
  const now = new Date(2026, 8, 30, 14, 41);
  assert.equal(fill('{CLOTHES} {CROWD.4} {RUN} {TIME} {DAYPART} {OR}', { now, n: 3 }),
    `${crowd.CLOTHES} ${crowd.CROWD[3]} 3 2:41 PM afternoon {OR}`);
});

test('{TIME} = the last stamp shown (a night scene never says the real noon); {NOW} = always the real clock (H5)', () => {
  const now = new Date(2026, 9, 1, 12, 20);
  setSceneTime('7:21 PM');
  assert.equal(fill("…Goodnight? It's only {TIME}.", { now }), "…Goodnight? It's only 7:21 PM.");
  assert.equal(fill("Even the time. It's {NOW}.", { now }), "Even the time. It's 12:20 PM.");
  setSceneTime(null);
  assert.equal(fill('{TIME}', { now }), '12:20 PM', 'no stamp yet / live stamp = the real clock');
});

test('loop lines differ per run bucket', () => {
  const s = loadScenes(applyPacks(base, [{ name: 'meta', ...meta }]));
  const i = s.findIndex((x) => x.id === 'meta-loop');
  const texts = ['1', '2', '3'].map((run) => beatView(beatAt(s, { s: i, b: 0 }), { run }).text);
  assert.equal(new Set(texts).size, 3);
});

test('stampAt: the stamp in force walks back this scene, then the route (?scene= jumps and loops too)', async () => {
  const { stampAt } = await import('./date-beta/meta.js');
  const st = (time) => ({ props: { shot: 'stamp', place: 'X', time } });
  const scenes = [{ id: 'a', beats: [st('12:00 NOON'), {}] }, { id: 'b', beats: [{}, st('7:00 PM'), {}] }, { id: 'c', beats: [{}] }];
  assert.equal(stampAt(scenes, { s: 2, b: 0, path: ['a', 'b', 'c'] }).time, '7:00 PM');
  assert.equal(stampAt(scenes, { s: 1, b: 0, path: ['a', 'b'] }).time, '12:00 NOON', 'b\'s own stamp is later than b:0');
  assert.equal(stampAt(scenes, { s: 0, b: 1, path: ['a'] }).time, '12:00 NOON', 'a new run starts clean');
  assert.equal(stampAt(scenes, { s: 2, b: 0, path: ['c'] }).time, '7:00 PM', 'no stamp on the route: nearest earlier stamp in file order');
  assert.equal(stampAt([{ id: 'z', beats: [{}] }], { s: 0, b: 0, path: ['z'] }), null);
  const named = [{ id: 'a', beats: [{ props: { shot: 'stamp', place: 'STATION', time: '4:30 PM' } }] }, { id: 'h', beats: [st('7:05 PM')] }, { id: 'old', short: 'STATION', beats: [{}] }];
  assert.equal(stampAt(named, { s: 2, b: 0, path: ['old'] }).time, '4:30 PM', 'chapter = stamp place wins over file order');
});
