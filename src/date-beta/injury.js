// Nanda's injury, continuous: black eye from v2-train beat 5 (1-based, index 4) (the station bump) through v2-rain and v2-street;
// at v2-home (her place, 7:05 PM) only a small plaster stays. Merged into whatever face layers the beat has.
export function injuryLayer(scene, beat) {
  if (scene === 'v2-train') return beat >= 4 ? 'black-eye' : null;
  if (scene === 'v2-rain' || scene === 'v2-street') return 'black-eye';
  if (scene === 'v2-home') return 'plaster';
  return null;
}
export function withInjury(layers, scene, beat) {
  const inj = injuryLayer(scene, beat);
  if (!inj) return layers ?? null;
  const l = (layers ?? []).filter((x) => x !== 'black-eye' && x !== 'plaster');
  return [...l, inj];
}
