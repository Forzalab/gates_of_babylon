// R5 (Tony 09-30, "a DIFFERENT readable emote every beat"; the audit found the same wink on ~20 beats): every beat she is
// on screen gets a face. A beat with its own props.cut.face keeps it. A beat without one gets a face picked from its
// line's mood (keywords below), else from her stage's calm pool, and never the same face as the beat before it.
// Stage 4 (the reveal) keeps its own face. Pure: (scene beats, stage per beat) -> a face id (or null) per beat.
const MOOD = [
  [/shak|scared|afraid|nervous|so many people|tight\b/i, ['nervous', 'sweat']],
  [/sleep|drift|tired|\brest\b/i, ['dazed-sleepy', 'content']],
  [/don'?t (look|stare)|do not look|look at me|only (me|yours)|not one of them|mine\b/i, ['smug-gloating', 'ticked-off', 3]],
  [/!|wow|giant|yumm|delicious/i, ['heart-laugh', 'anya-smile']],
  [/\?/, ['big-eyes-peek', 'anya-smile']],
  [/♡|love|cute|together|forever|for you|\bour\b|remember/i, ['blush-embarrassed', 'heart-laugh', 2]],
];
const CALM = { 1: ['content', 'anya-smile', 'big-eyes-peek', 'blush-embarrassed', 1], 2: [2, 'blush-embarrassed', 'big-eyes-peek', 'anya-smile'], 3: [3, 'smug-gloating', 'ticked-off', 'big-eyes-peek'] };

export function autoFaces(beats, stageOf) {
  let prev = null;
  return beats.map((b, i) => {
    const own = b.props?.cut?.face ?? null;
    const stage = stageOf(b, i);
    if (own != null || stage >= 4) { prev = own; return null; }
    const mood = MOOD.find(([re]) => re.test(b.text ?? ''));
    const pool = [...(mood ? mood[1] : []), ...(CALM[stage] ?? CALM[1])];
    const face = pool.find((f) => f !== prev) ?? pool[0];
    prev = face;
    return face;
  });
}
