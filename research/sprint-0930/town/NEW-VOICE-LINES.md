# town new voice lines (v2-town, recording kit)

New lines from the TOWN walk to curry lunch (`NOTES.md`, pack `src/date-beta/packs/town.json`). None of them have takes yet: the ElevenLabs key has to be rotated first (Tony). The player stays silent on a missing take, so nothing breaks until they are recorded. The format follows `research/sprint-0930/voice/APPENDIX-TAKES.md`, and numbering continues from 247 (`research/sprint-0930/train-r4/NEW-VOICE-LINES.md`). The folder is a new one, `37-v2-town` (after `36-bible-unwired`).

Settings: voice **Irohauta** (the same Nanda voice), Eleven v3, Stability 0.35-0.45, Similarity 75%, Style 30-40%. Paste the code block as-is.

**Lookup.** `voice.js` matches a take by scene id + the **whole shown line** (tags and punctuation stripped).
- #248-251 are NANDA lines. The v3 tags are the only extra words, so the stripped text is the shown line, word for word.
- To make a take play once recorded: put the mp3 at the target path, then add one entry per take to `research/sprint-0930/voice/audio-manifest.json` (`file` = the path below) and the slim `src/date-beta/voice/manifest.json` (`file` without `public/`), `scene: "v2-town"`, `text` = the code block. The voice tests check both lists match and every file exists, so add the entries in the same commit as the mp3s, not before.
- Not appended to `appendix-manifest.json`: that file is the frozen appendix (n 72-237), and train-r4 (#238-247) did not extend it either.

## v2-town

### 248 | v2-town | 1 the street (NANDA)
- File: `public/date-beta/voice/37-v2-town/248_1.mp3`
- Lookup key: `We are going out for curry. Just you and me.`
```
[happy][bubbly] We are going out for curry. [softly] Just you and me.
```

### 249 | v2-town | 2 the crossing (NANDA)
- File: `public/date-beta/voice/37-v2-town/249_2.mp3`
- Lookup key: `So many people. I will hold your arm. Tight.`
```
[looks around] So many people. [sweet] I will hold your arm. [whispers, possessive] Tight.
```

### 250 | v2-town | 3 the billboard (NANDA)
- File: `public/date-beta/voice/37-v2-town/250_3.mp3`
- Lookup key: `Wow! A giant oshi board. Oshi means "my favorite."`
```
[amazed] Wow! A giant oshi board. [explaining, cute] Oshi means "my favorite."
```

### 251 | v2-town | 4 the billboard, then you (NANDA)
- File: `public/date-beta/voice/37-v2-town/251_4.mp3`
- Lookup key: `But not one of them is as cute as me. Right?`
```
[smug][giggles] But not one of them is as cute as me. [sweet, a little too sweet] Right?
```

### 252 | v2-town | narration only (no take needed)
- 0 `AKIBA · 2:45 PM. Big signs. Big screens. She holds your hand.`

Reserved in case a narrator voice is added later: `252_0.mp3`.
