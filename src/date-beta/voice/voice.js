// voice.js: pure lookup from a beat to its recorded mp3 (no DOM, node --test drives it).
// The manifest (voice/manifest.json, slim copy of research/sprint-0930/voice/audio-manifest.json) keys a take by scene id +
// script beat ("1 R+", "2 (u)"). The script's beat numbers are not the engine's indexes, so the player asks by scene +
// the line it is showing: the manifest text with its v3 [tags] and pauses stripped is the same words as the beat's line.
// A miss is normal (unrecorded line, narration): callers stay silent.

// Same words, whatever the tags/punctuation: drop [tags], speaker prefix, {OR}/tokens' braces, lowercase letters+digits only.
export const norm = (text) => String(text ?? '')
  .replace(/\[[^\]]*\]/g, ' ')
  .replace(/^\s*[A-Z][A-Z ]{0,11}:\s*/, '')
  .replace(/\{OR\}/g, '')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, '');

// manifest = [{ scene, beat, file, text }]. Returns { byBeat, byText } Maps.
export function buildIndex(manifest) {
  const byBeat = new Map(), byText = new Map();
  for (const e of manifest ?? []) {
    if (!e?.scene || !e.file) continue;
    byBeat.set(`${e.scene}|${e.beat}`, e.file);
    const k = norm(e.text);
    if (k && !byText.has(`${e.scene}|${k}`)) byText.set(`${e.scene}|${k}`, e.file);
  }
  return { byBeat, byText };
}

// Scene id + the manifest's own beat label ("1 R+") -> file path (relative to the site base), or null.
export const fileForBeat = (index, scene, beat) => index.byBeat.get(`${scene}|${beat}`) ?? null;

// Scene id + the words the player shows (beat.line.plain / a react line) -> file path, or null.
export function fileForLine(index, scene, plain) {
  const k = norm(plain);
  return k ? index.byText.get(`${scene}|${k}`) ?? null : null;
}

// Timing (research/sprint-0930/narration/TIMING.md): a take holds its beat for its length + PAD.
export const PAD = 350;

// What show(scene, plain, then) will play, in time: timing = voice/timing.json ({ files: { file: { audioMs, marks } } }).
// playing = false (muted / not unlocked yet) -> all zero, so a silent run keeps the authored timing.
// ms = total spoken time (lead + queued line), stepMs = when the second line starts (a two-step beat),
// hold = ms + PAD (0 if nothing plays), mark(text) = ms into the take where `text` is said (null if unaligned).
export function planFor(index, timing, scene, plain, then = null, playing = true) {
  const a = fileForLine(index, scene, plain), b = then ? fileForLine(index, scene, then) : null;
  const first = a ?? b, second = a ? b : null;
  const t1 = playing && first ? timing?.files?.[first] : null, t2 = playing && second ? timing?.files?.[second] : null;
  const ms = (t1?.audioMs ?? 0) + (t2?.audioMs ?? 0);
  return {
    ms,
    stepMs: t1 && t2 ? t1.audioMs : null,
    hold: ms ? ms + PAD : 0,
    mark: (text) => (text && t1?.marks?.[text] != null ? t1.marks[text] : null),
  };
}

// One beat in time, given its plan (the player and the QA timeline both use this, so they cannot drift apart).
// beat = { hold, auto, props }; step = the authored two-step delay (cut.step) or null when the beat has no second line.
// -> readyAt (NEXT pill), autoAt (auto beats, else null), stepAt (second line reveal), sfxAt (sfx cue), voiceEnd.
export function beatTiming(beat, plan, { lead = false, splitAt = null, step = null } = {}) {
  const hold = beat.hold ?? 0;
  const stepAt = lead ? plan.stepMs ?? step : splitAt ? plan.mark(splitAt) ?? step : null;
  return {
    voiceEnd: plan.ms,
    readyAt: Math.max(hold, plan.hold),
    autoAt: beat.auto == null ? null : Math.max(beat.auto, plan.hold),
    stepAt,
    sfxAt: plan.mark(beat.props?.sfxAt) ?? 0,
  };
}
