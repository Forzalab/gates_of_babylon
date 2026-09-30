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
