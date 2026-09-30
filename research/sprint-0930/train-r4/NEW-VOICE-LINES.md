# train-r4 new voice lines (v2-train, recording kit)

New lines from the train-r4 script (PLAN.md §1, approved by Tony). None of them have takes yet. The player stays silent on a missing take, so nothing breaks until they are recorded. The format follows `research/sprint-0930/voice/APPENDIX-TAKES.md`, and numbering continues from 237 there. The folder is the existing `06-v2-train`.

Settings: the same Nanda voice, Eleven v3, Stability 0.35-0.45, Similarity 75%, Style 30-40%. Paste the code block as-is.

**Lookup.** `voice.js` matches a take by the **whole shown line** (tags and punctuation stripped).
- #238 is a NANDA line, so its take resolves as soon as the mp3 is at the target path and in `audio-manifest.json`.
- #239-247 are narration with her words in quotes. We only record her quote.
  - For these takes to play, the manifest `text` has to be the whole shown line (given as *Lookup key* below), or `voice.js` needs a per-beat key.
  - Neither of those is built yet.
- Kept, not re-recorded:
  - #33 (run 1) is replaced by #243.
  - #34 (run 2) and #35 (run 3) still resolve. The run-2 line keeps "Twelve stops" in words so its take still matches.
  - #32 (the old crowd line) is superseded by #238, and its take is now unreachable.

## v2-train

### 238 | v2-train | 5 crowd (NANDA, styled spans)
- File: `public/date-beta/voice/06-v2-train/238_5-crowd.mp3`
- Lookup key: `Hey, you. Wavy hair. And you. Hat boy, the gringo. Stop pushing. He is MINE.`
```
[annoyed] Hey, you. [pointed] Wavy hair. [sharp] And you. [mocking] Hat boy, the gringo. [firm] Stop pushing. [low, possessive] He is MINE.
```

### 239 | v2-train | 1 match cut (quote)
- File: `public/date-beta/voice/06-v2-train/239_1-quote.mp3`
- Lookup key: `4:30 PM. Lunch is done. She takes your hand. 'Now we go to MY home. On MY train.'`
```
[giggles][bubbly] Now we go to MY home. [proud] On MY train.
```

### 240 | v2-train | 3 vending, umeboshi path (quote)
- File: `public/date-beta/voice/06-v2-train/240_3-ume-quote.mp3`
- Lookup key: `She buys a plum drink. Sour. 'Like the one you picked. I remember.'`
```
[smiling] Like the one you picked. [whispers] I remember.
```

### 241 | v2-train | 3 vending, tamagoyaki path (quote)
- File: `public/date-beta/voice/06-v2-train/241_3-tama-quote.mp3`
- Lookup key: `Egg pudding drink. Sweet. 'Like the one you picked. I remember.'`
- The words are the same as #240. It is recorded twice because the lookup key differs by path. One take copied to both paths also works.
```
[sweetly] Like the one you picked. [whispers] I remember.
```

### 242 | v2-train | 6 card tap (quote)
- File: `public/date-beta/voice/06-v2-train/242_6-quote.mp3`
- Lookup key: `She taps her card. Beep. Then she taps it again. For you. 'I pay. You are my guest.'`
```
[proud] I pay. [warm][sing-song] You are my guest.
```

### 243 | v2-train | 7 fingers, run 1 (quote)
- File: `public/date-beta/voice/06-v2-train/243_7-run-1-quote.mp3`
- Lookup key: `12 stops to her home. She counts them on her fingers. 'Every day I count alone. Today I count with you.'`
```
[quiet] Every day I count alone. [smiling][softly] Today I count with you.
```

### 244 | v2-train | 9 her stop (quote)
- File: `public/date-beta/voice/06-v2-train/244_9-quote.mp3`
- Lookup key: `Stop 12. Her stop. She wakes up fast. She pulls your sleeve. 'Home. Come.'`
```
[perfectly even][pleased] Home. [whispers] Come.
```

### 245-247 | v2-train | narration only (no take needed)
- 2 `STATION · 4:30 PM. The station is full. Everyone is going home.`
- 4 `Two men bump her bag. They laugh.`
- 8 `5:20 PM. It's raining. She lays her head on yours. She drifts away.`

These numbers are reserved in case a narrator voice is added later. The files would be `245_2.mp3`, `246_4.mp3` and `247_8.mp3`.
