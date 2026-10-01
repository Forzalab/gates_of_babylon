# Suno BGM prompts (date-beta, 2026-10-01)

No music on ccr yet (sfx + ambient beds only; `assets.js` plays one bed at a time, no music channel).

## Research takeaways (Suno v5/v5.5)
- Two fields. **Style** (≤1000 chars; earlier tags weigh more: mood/genre first, then instruments, then BPM) and **Lyrics** (`[Instrumental]` only).
- No vocals needs all three: "instrumental, no vocals" in Style + `[Instrumental]` in Lyrics + Exclude styles: vocals, singing, humming, choir.
- For a bed: "background music, subtle, unobtrusive, supporting role", "loop-friendly, seamless ending, no fade in or out", simple motif, sparse arrangement (ducks well under voice), 65–90 BPM.
- Exclude: loud drums, four-on-the-floor, risers/whooshes, distorted guitar, crowd noise.

## Song 1: "Love Bomb" (sweet)
Style:
```
sweet, adoring, gentle kawaii city-pop lounge instrumental, background music, subtle, unobtrusive, supporting role, soft Rhodes electric piano chords, music box melody, light pizzicato strings, glockenspiel sparkles, warm round bass, brushed soft drums, 84 BPM, major key, simple 4-bar motif that repeats, sparse arrangement, warm lo-fi mix, loop-friendly, seamless ending, no fade in or out, instrumental, no vocals
```
Lyrics: `[Instrumental]`
Exclude styles: `vocals, singing, humming, choir, loud drums, four-on-the-floor, risers, whooshes, distorted guitar, crowd noise`

## Song 2: "Love Bomb, Extra Sugar" (more sugary, sweetness tipping into uncanny)
Style:
```
saccharine, overly sweet, sugar-rush kawaii instrumental, background music, subtle, unobtrusive, supporting role, toy piano and music box lead, celesta, glockenspiel, soft synth pads, bubbly plucks, slightly detuned tape warble, gentle sidechain pulse, 92 BPM, major key with a sweet chromatic turn, simple repeating 4-bar motif, sparse, candy-pastel lo-fi mix, a little too perfect, loop-friendly, seamless ending, no fade in or out, instrumental, no vocals
```
Lyrics: `[Instrumental]`
Exclude styles: same as song 1.

## Use notes (for whoever wires it in)
- Generate 2–4 takes each; pick the one with the least melody movement (it ducks better under voice).
- Export, trim to the loop point, then mp3 at -24 to -28 LUFS. That keeps it under voice takes (about -26 LUFS) once the existing duck (-14 dB) applies.
- Wiring needs a music channel separate from the beds. assets.js is one-bed-only today, so this is post-demo or the integrator's call. Suno licence: commercial use needs a paid plan.

Sources: roo.beehiiv.com/p/suno-ai-prompt-guide-2026-copy-paste-templates-the-formula-that-actually-works · sunoai.uk/en/guides/suno-instrumental-prompts · suno.bi/en/blog/instrumental-music-from-text-prompts-7-tips-sunomv-2026 · hookgenius.app/learn/suno-instrumental-prompts
