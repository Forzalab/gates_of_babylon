# Nanda voice for ElevenLabs (Voice Design v3 + Eleven v3)

Sources: the brain guide `projects/csci/_files/date-beta-elevenlabs-research.md` (it includes a synthesis of the official Voice Design docs) and https://elevenlabs.io/docs/eleven-creative/voices/voice-design. The lines come from `scenes.json`, `packs/story.json` (`sprint/story-pack`), `packs/meta.json` (`sprint/meta`) and `story/BIBLE.md`.

## How to use this file
1. Voice Design: paste one **prompt** and its **preview text** below, then generate. Each generation gives 3 options. Do this for A, B and C.
2. Audition all 9 options with the **tone test** (section 3). Pick one and save it as `Nanda`.
3. Switch to **Eleven v3** (Text to Speech). Paste the lines from section 2 one line at a time, and take the best of the 3 takes.
4. Settings: Stability **Creative / 0.35–0.45**. Similarity 75%. Style 30–40%. Use Natural (0.5) for the flat hate lines if they come out too wobbly.

Doc rules we follow:
- The prompt is 20–1000 characters. Ours are about 450–600.
- The preview text is 100–1000 characters, and it must match the voice's emotion. Longer preview text gives a more stable voice.
- The prompt order is: language/accent → gender/age → audio quality → persona → emotion → timbre and pacing.
- Use "thick" rather than "strong" to describe an accent.
- **Never put FX words in the prompt** (reverb, echo, phone, radio). Do FX in BandLab, following the brain guide's CLASSROOM CEILING table.
- A high guidance scale is strict, but it can flatten a niche voice. Start around the middle.
- Audio tags only work on **v3**. Put at most **one tag cluster per sentence**. Use ellipses (…) for pauses and dashes for cuts, and at most two ellipses per line. Use CAPS on one word at most, for emphasis.

Placeholders: `{TIME}`, `{DAYPART}`, `{CLOTHES}`, `{CROWD.n}` and `{RUN}` are filled in live. Either record a small set of variants (for example "one PM", "three PM", "hoodie", "jacket"), or let the caption carry the placeholder and record the line without it. `{OR}` is read as "or" (the "f{OR}ever" lines are read as "forever").

---

## 1. Voice Design prompts (3 variants)

### A. "Honey Trap" (sweet-first, the whisper is the weapon)
**Prompt**
```
Native Japanese speaker, female, late teens, who switches naturally between Japanese and English, with a light Tokyo (Kanto) accent in English. Studio quality, very close to the microphone, soft and breathy. Persona: bratty, clingy anime girlfriend. Emotion: sugary, playful, quietly possessive. A mid-high, bright voice with an audible smile. The pacing is slow and savouring, with tiny pauses before words like "mine" and "ours". Mid-sentence she often drops from a sweet speaking voice to an intimate whisper, then comes back up smiling. She draws out a slow, sing-song "ne?" at the ends of lines.
```
**Preview text**
```
You came! You actually came. I knew you would. I made two bento, one's for you… don't look at me like that. Sweet, ne? I rolled it myself. Stay a minute… then another… then the whole day. いつまでも一緒。Forever and ever, ne? You're mine to keep.
```

### B. "Brat Switch" (bratty and bouncy, with a hard flat drop)
**Prompt**
```
Native Japanese, female, around eighteen, bilingual: fluent English with a thick, cute Japanese accent and natural Japanese phrases. Clean, close-mic studio quality. Persona: bratty, pouty anime tsundere with a dark streak. Emotion: teasing, bossy, then suddenly cold. A high, energetic, bouncy voice with little breathy laughs between phrases. Without warning she can go completely flat: low, monotone, no smile, slow. Then she snaps straight back to cheerful as if nothing happened. The "ne?" is long and teasing.
```
**Preview text**
```
Don't look at me like that. It's not for you. Hmph! …Okay, it's a little for you. Bit salty? Say that again. Slowly. So I can write it down. Ehehe, I'm joking! Carrots, rice, three cups. We'll need three. Why three? Because it's always three of us, silly. Ne?
```

### C. "Lullaby" (breathy and dreamy, creepy from being too calm)
**Prompt**
```
Native Japanese woman, late teens, soft Kanto-accented English, and gentle native Japanese. Intimate, close-mic studio quality with audible breath. Persona: dreamy, doting yandere caretaker. Emotion: tender, serene, unsettlingly calm. A light, airy, mid-high voice, as if smiling while half-asleep. The pacing is very slow and even, with small breath-laughs, and the ends of sentences trail into near-whispers. She never raises her voice. She says possessive words slowly and softly, after a tiny pause. Her "ne?" is slow and drawn out, almost a lullaby.
```
**Preview text**
```
Rest now… I'll do the remembering. The tea is warm. It makes the thinking stop. I already boiled the water this morning, just in case. Bitter cup, sour hour… every hour is ours. おやすみ。You don't have to go anywhere. Not tonight. Not ever. Ne?
```

Acting rules (append to every prompt above):
```
Tony style: overtly lovely, love-bombing, with an uncanny too-perfect smile. 1) Smile-voice on every love line, no breaths between love-bomb phrases. 2) Certainty and possession words are said perfectly even, no pitch movement, like a rehearsed statement. 3) At most one real giggle per line, held a beat too long; whisper runs get slower each step. 4) Japanese phrases warm and slow; cold lines drop suddenly flat and quiet, then one sweet word.
```

---

## 2. Full line script (V2 play order)

Live path: `?pack=story,meta,mech,lockgame,obbp,sequences,variant-v2` (`research/sprint-0930/variants/V2.md`, with the SCORES.md fixes applied). Lines that V2 no longer plays are in the appendix at the end of this file.

Legend:
- **LB** = a love-bomb line. Smile-voice, no breaths between phrases.
- **ZUCK** = the rehearsed-statement word or phrase: `[perfectly even]` / `[flat, pleased]`, no pitch movement. 1–2 per scene.
- **HATE** = the 💔 react. Sudden flat and quiet, then one sweet word.
- **R+** / **R=** / **R−** = the react after a ♥ / neutral / 💔 pick.
- **(u)** / **(t)** = the umeboshi / tamagoyaki variant. **(b)** / **(k)** = butter chicken / katsu.
- Tag clusters sit right before the word or phrase they colour. Words are unchanged; only ellipses and pauses were added.

### rooftop · 12:00 NOON (existing beats kept)
*Direction: she has rehearsed this lunch for weeks, so the joy is real but the delivery is already too polished.*
| # | beat | tag | line |
|---|---|---|---|
| 1 | 1 | LB ZUCK | [shyly][happy] I made two. [flat, pleased] One's for you. [pause][chuckles softly] …Don't look at me like that. |
| 2 | 1 R+ | LB | [giggles][too long] Sweet egg… [smiling][bubbly] for my sweet boy. |
| 3 | 1 R= | | [amused] Sour. [proud] Brave. [whispers][close] I'll remember… [whispers, slower] you like sour. |
| 4 | 1 R− | HATE | [sudden flat][quiet] …I woke up at four [sweet] for this. |
| 5 | 2 (u) | | [curious] Sour. Hm. [teasing][sing-song] You like things that bite? |
| 6 | 2 (t) | LB | [happy][bubbly] Sweet. Like me. [perfectly even][smiling] Good input. |
| 7 | 3 (u) | | [warm] Sour, [slow][sing-song] neee? |
| 8 | 3 (t) | LB | [sing-song] Sweet, ne? [proud][slow] I rolled it. Myself. |
| 9 | 3 R+ | | [pouty][smiling] …Obviously. [rushed] Don't stare. |
| 10 | 3 R= | | [warm] Good is a start. [sweetly][perfectly even] Tomorrow I'll do better. |
| 11 | 3 R− | HATE | [sudden flat][quiet] Say that again. Slowly. So I can write it… [sweet] down. |
| 12 | 4 cold | HATE ZUCK | [sudden flat][quiet] Salty. Noted. [perfectly even] …Forever. |
| 13 | 6 | | [breathless][happy] Stay forever? [whispers][close] The rain… [whispers, slower] can wait. |
| 14 | 6 R+ | LB | [whispers][close] A minute. [whispers, slower] Then another. [whispers, slowest] Then the whole day. |
| 15 | 6 R= | ZUCK | [excited] Yay! Park first. [flat, pleased] I already planned it. |
| 16 | 6 R− | HATE | [sudden flat][quiet] …Fine. The rain can have you. [sweet] Later. |

### v2-park · 1:00 PM
*Direction: her shaking hand is real need; once you hold it she goes calm and certain, because she got what she wanted.*
| # | beat | tag | line |
|---|---|---|---|
| 17 | 3 | LB | [breathless][tender] Hold my hand. [trembling] My hand is shaking. [whispers][close] Only yours… [whispers, slower] can stop it. |
| 18 | 3 R+ | LB ZUCK | [relieved][happy] It stopped. [pause] See? [flat, pleased] It only needed you. |
| 19 | 3 R= | | [smiling] One finger. [perfectly even][sweet] I will hold it very hard. |
| 20 | 3 R− | HATE | [sudden flat][quiet] Okay. My hand can wait. It is good at… [sweet] waiting. |
| 21 | 5 | ZUCK | [bright] One job before lunch. [sing-song] My groceries, or my library book? |
| 22 | 5 R shop | LB | [excited][bubbly] Groceries. [warm][slow] For our dinner. |
| 23 | 5 R lib | | [happy] The book. [giggles][too long] It is very late. |
| 24 | 5 R− | HATE ZUCK | [sudden flat][quiet] Alone? No. [perfectly even] Groceries. [sweet] Now. |

### v2-shop · 2:00 PM (errand: groceries)
*Direction: the shop lady smiled at you; she swallows the anger and turns it straight back into a gift.*
| # | beat | tag | line |
|---|---|---|---|
| 25 | 5 | LB ZUCK | [perfectly even] Do not look at her. [smiling][close] Look at me. [bubbly][rushed] I bought you a cup. |

### v2-library · 2:00 PM (errand: book)
*Direction: she treats the book like a relic of you; the confession is proud, not ashamed.*
| # | beat | tag | line |
|---|---|---|---|
| 26 | 4 | ZUCK | [tender] You touched this book once. [whispers][close] Right here. [flat, pleased] I kept it forty days. |

### v2-curry · 3:00 PM
*Direction: bossy hunger that melts into worship the moment you feed her by hand.*
| # | beat | tag | line |
|---|---|---|---|
| 27 | 2 | | [pouty] I am hungry. [bubbly] You pick my lunch. [perfectly even][smiling] Pick the right one. |
| 28 | 2 R+ (b) | LB | [gasps][excited] With naan! [warm][slow] You know me. |
| 29 | 2 R= (k) | | [happy] Crunchy. [flat, pleased] Good choice. |
| 30 | 2 R− | HATE | [sudden flat][quiet] Then you watch me… [sweet] eat. |
| 31 | 4 | ZUCK | [sweet][close] Feed me. [whispers] With your hand. [perfectly even] Not the spoon. [whispers, slower] Your hand. |

### v2-train · 4:30–5:20 PM (station + train; loop line by run)
*Direction: she counts because she keeps score of everything; by run 3 the count is a calm threat. Crowdwork lands here, while the platform is still full.*
| # | beat | tag | line |
|---|---|---|---|
| 32 | station crowd (Tony) | ZUCK | [bright] Want to see a magic trick? [sing-song] It's {TIME}, a sleepy {DAYPART}, and this is a classroom. [happy] Hi, {CROWD.1}. [whispers][close] Yes, you. [perfectly even] I see you. |
| 33 | station crowd 2 (if time) | | [teasing] Trick two. {CROWD.2} is thinking about snacks. {CROWD.3} is thinking about me. [giggles][too long] Everybody in here is thinking about me. [flat, pleased] That's the vibe, right? |
| 34 | 3 run 1 | | [proud][slow] Twelve stops. [sing-song] I count them on my fingers. [smiling] See? |
| 35 | 3 run 2 | ZUCK | [warm] Twelve stops. Second time today. [quiet] You forgot. [perfectly even] I did not. |
| 36 | 3 run 3 | ZUCK | [slow] Three fingers. [whispers] Three times today. [perfectly even][smiling] Same train. Same you. |

### v2-rain · 5:30 PM
*Direction: she is cold and wet and does not care; touching your arm is the whole point of the small umbrella.*
| # | beat | tag | line |
|---|---|---|---|
| 37 | 2 | LB | [bubbly] Share my umbrella. [sing-song] It is small. [whispers][close] Our arms have to touch. |
| 38 | 2 R+ | LB | [breathless][happy] Our arms touch. [warm][slow] Now I am warm. |
| 39 | 2 R= | ZUCK | [smiling] Your hand on the handle. [perfectly even] My hand on yours. |
| 40 | 2 R− | HATE | [sudden flat][quiet] Then get wet. Sick boys stay… [sweet] inside. |

### v2-street · 6:00 → 7:00 PM
*Direction: small steps stretch the day she doesn't want to end; the key reveal is the first time we see her face, so it's pure love.*
| # | beat | tag | line |
|---|---|---|---|
| 41 | 2 | LB | [tender][slow] Take small steps. [whispers][close] Small steps… [whispers, slower] make the day longer. |
| 42 | 2 R+ | LB | [whispers] Smaller. [whispers, slower] Smaller. [whispers, slowest] There. [giggles][too long] We are almost still. |
| 43 | 2 R= | ZUCK | [perfectly even][smiling] Same pace. Same day. Same you. |
| 44 | 2 R− | HATE | [sudden flat][quiet] Home? You are walking me… [sweet] home. |
| 45 | 5 | LB ZUCK | [warm][slow] I held it since noon. [flat, pleased] So I would be ready. [whispers][close] For you. |

### v2-home · 7:05–7:10 PM
*Direction: kneeling at your feet, fully in charge; the line is a proud confession, read like a keynote.*
| # | beat | tag | line |
|---|---|---|---|
| 46 | 3 | ZUCK | [smiling][slow] Every choice you made today led here. [pause][perfectly even] I planned them all. |

### cup · 7:20 PM (kept)
*Direction: the caretaker phase; she is serving, and the serving is the trap.*
| # | beat | tag | line |
|---|---|---|---|
| 47 | 0 (u) | | [sing-song] I bought umeboshi. [smiling] For no reason. [perfectly even][sweet] Eat. |
| 48 | 0 (t) | LB | [bubbly] I made tamagoyaki. [smiling] For no reason. [perfectly even][sweet] Eat. |
| 49 | 0 R+ | ZUCK | [happy] See? [whispers][close][flat, pleased] You needed me. |
| 50 | 0 R= | | [whispers] A little now. [whispers, slower] A lot later. |
| 51 | 0 R− | HATE | [sudden flat][quiet] You will be. [sweet] Later. |
| 52 | 1 cold | HATE | [sudden flat][quiet] I'll wait. I'm good at… [sweet] waiting. |
| 53 | 3 | | [amused] For Input B. [giggles][too long] Silly. [perfectly even][smiling] It's always three of us. |
| 54 | 3 R+ | LB | [warm] Drink. It's warm. [whispers][close] It makes the thinking… [whispers, slower] stop. |
| 55 | 3 R= | | [whispers] Hold it. [whispers, slower] Smell it. [whispers, slowest] Then drink. [sweet] I'll wait. |
| 56 | 3 R− | HATE | [sudden flat][quiet] Sit. The tea isn't… [sweet] finished. |

### steeped (ending)
*Direction: lullaby; she has won, so every line is soft and total.*
| # | beat | tag | line |
|---|---|---|---|
| 57 | 1 | | [tender] Rest. [whispers][close] I'll do the remembering. |
| 58 | 2 (u) | ZUCK | [slow] Bitter cup, sour hour. [whispers][perfectly even] Every hour is ours. |
| 59 | 2 (t) | ZUCK | [slow] Warm cup, sweet sleep. [whispers][perfectly even] You're mine to keep. |
| 60 | 3 | JP | [whispers][warm][slow] いつまでも一緒。 [pause][perfectly even] …Forever. [slow][sing-song] Neee? |

### escape-win (ending)
*Direction: you got out, and she is still smiling; the last word is the only one with nothing behind it.*
| # | beat | tag | line |
|---|---|---|---|
| 61 | 1 | | [sweetly][smiling] You took the long way. |
| 62 | 2 (u) | | [softly] You picked sour. |
| 63 | 2 (t) | LB | [softly][warm] Home is warm, and sweet. |
| 64 | 3 (u) | | [smiling] Now every hour [whispers, slower] is ours. |
| 65 | 3 (t) | | [tender] Sleep now. [whispers, slower] You're mine to keep. |
| 66 | 5 | ZUCK | [whispers][perfectly even] Mine. (bone-dry, mono, then 1 s of silence) |

### escape-timeout (ending)
*Direction: you ran out of time; she was never worried.*
| # | beat | tag | line |
|---|---|---|---|
| 67 | 4 (u) | JP | [warm][slow] すっぱいでしょ。 [pause][sing-song] …Neee? |
| 68 | 4 (t) | JP | [warm][slow] 甘いでしょ。 [pause][sing-song] …Neee? |
| 69 | 5 (u) | | [softly] One sour hour… |
| 70 | 5 (t) | | [softly] One sweet bite… |
| 71 | 6 (u) | ZUCK | [whispers, slower] …then every hour [perfectly even] is ours. |
| 72 | 6 (t) | ZUCK | [whispers, slower] …then sleep. [perfectly even] You're mine to keep. |

---

## 3. Tone test (5 lines; run each through all 9 voice options)
| # | tests | line |
|---|---|---|
| T1 | love-bomb → whisper ladder → zuck | [sing-song] Sweet, ne? [proud][slow] I rolled it. Myself. [whispers][close] You're mine… [perfectly even] to keep. |
| T2 | sudden flat, then one sweet word | [sudden flat][quiet] Say that again. Slowly. So I can write it… [sweet] down. |
| T3 | snap back + one giggle held too long | [giggles][too long] Ehehe, I'm joking! [bubbly] Heavy means you can't run. |
| T4 | JP/EN code-switch, warm slow JP | [whispers][warm][slow] いつまでも一緒。 [pause][perfectly even] …Forever. [slow][sing-song] Neee? |
| T5 | zuck certainty on a possessive word | [smiling] Everyone goes home at night. Not you. [whispers, slower] You come home… [perfectly even] with me. |

Pass criteria: the JP must sound native rather than anglicised, the flat line must have NO smile left in it, and the whisper must land mid-sentence without the voice changing identity. Pick whichever voice wins on T2 and T4. Those two are the hardest. T5 checks the "zuck" read: the last phrase must sit on one pitch with the smile still audible.

---

## Appendix: off-path lines (not played by V2)
Kept for other packs and reruns. Original tags, not re-tagged in Tony style. `NEW-LINES.md` (the `sequences` pack) is also off the V2 path.

#### park
| # | beat | tag | line |
|---|---|---|---|
| 17 | 0 | LB | I love your {CLOTHES}. You wore it for me. [whispers] I can tell. |
| 18 | 0 cold | HATE | [flatly] Park. Now. Hold my hand on the way. |
| 19 | 0 R+ | LB | [giggles] I knew it. I know EVERYTHING about you. |
| 20 | 0 R= | | Clean for me. [teasing] That's the same thing, silly. |
| 21 | 0 R− | HATE | [flatly] …Everything is about me. You'll learn. |
| 22 | 1 | | Sakura only last a week. Then they fall. [whispers] I don't let things fall. |
| 23 | 1 cold | HATE | [flatly] Don't say that again. The petals are listening. |
| 24 | 2 | | Hold my hand. The whole way. [softly] Hands get lost if you let go. |
| 25 | 2 R+ | LB | Tighter. [sighs happily] Now you're mine till tonight. |
| 26 | 2 R= | | One finger is a start. [whispers] I'll collect the rest. |
| 27 | 2 R− | HATE | [flatly] Oh. …Your hand is cold anyway. |
| 28 | 3 | LB | Who needs friends? I'm the only friend you need. [giggles] I'm like ten friends. In one! |
| 29 | 3 cold | HATE | [flatly] I'll warm it later. I have ways. |
| 30 | 4 | | It's {TIME}. One job today. My groceries, or my library book? You pick. [whispers] I already know. |
| 31 | 4 R shop | | [excited] Groceries! For our dinner. I mean mine. …Ours. |
| 32 | 4 R lib | | The book! It's late. Like you. [softly] But you came. |
| 33 | 4 R− | HATE | [flatly] Alone? There's no alone today. Groceries. Now. |

#### errand-shop (errand = groceries)
| # | beat | tag | line |
|---|---|---|---|
| 34 | 0 cold | HATE | [flatly] Carrots first. Then you can talk. |
| 35 | 1 | | Carrots. Rice. Two cups. No, three cups. [whispers] We'll need three. |
| 36 | 1 R+ | LB | You get it. [sweetly] You always get me. |
| 37 | 1 R= | | Because it's always three of us. [giggles] Silly. |
| 38 | 1 R− | HATE | [flatly] Normal people are lonely. Do you want lonely? |
| 39 | 2 | | The shop lady smiled at you. [cheerfully] It's okay! She has a bad face. [whispers] Look at me. |
| 40 | 2 cold | HATE | [flatly] Three. Say it. Three. |
| 41 | 3 | LB | You carry the bags. I carry you. In my heart. [giggles] Heavy, right? |
| 42 | 3 R+ | | [laughs softly] Ehehe. Heavy means you can't run. |
| 43 | 3 R= | | [pouty] Fine is my least favorite word. |
| 44 | 3 R− | HATE | [flatly] …Okay. I'll carry everything. I always do. |
| 45 | 4 | | I'm hungry. You look hungry too. Let's eat. [firmly] Now. |
| 46 | 4 cold | HATE | [flatly] I carry a lot. You don't even know. |

#### errand-library (errand = library)
| # | beat | tag | line |
|---|---|---|---|
| 47 | 1 | | This book is forty days late. [softly] I kept it because you touched it once. |
| 48 | 1 R+ | | I knew you'd say that. [whispers] I wrote it down. |
| 49 | 1 R= | | I do. [sweetly] I remember for both of us. |
| 50 | 1 R− | HATE | [flatly] Creepy is a word for people who get left. |
| 51 | 2 | | The gate is down. The train is a big metal door. I hate doors. [whispers] Stand closer. |
| 52 | 2 cold | HATE | [flatly] Don't use words you can't take back. |
| 53 | 3 | | Book's back. Now the library can't keep you either. [whispers] Only I can. |
| 54 | 3 R+ | LB | Only me. [giggles] Say it at the station too. |
| 55 | 3 R= | | [happily] Mm! Yes! Food, then more me. |
| 56 | 3 R− | HATE | [flatly] Everybody gets kept. It's just who does it. |
| 57 | 4 cold | HATE | [flatly] You'll see. Tonight. |

#### hungry
| # | beat | tag | line |
|---|---|---|---|
| 58 | 0 | | I'm so hungry. Feed me. Butter chicken, or katsu curry? [teasing] Pick the right one. |
| 59 | 0 R+ | LB | With naan! [excited] You know me so well. |
| 60 | 0 R= | | Crunchy! You chose. [giggles] I'll pretend I did. |
| 61 | 0 R− | HATE | [flatly] You don't eat? Then you watch me eat. |
| 62 | 1 | | Say ahh. No, I feed you first. Then you feed me. [bossy] That's the rule. |
| 63 | 1 (b) | | Tear the naan. Give me the soft part. [whispers] Always the soft part. |
| 64 | 1 (k) | | Cut the katsu. Blow on it. [whispers] I like it when you work for me. |
| 65 | 2 | LB | Mm! See? You're so good at making me happy. Keep going. [whispers] Forever. |
| 66 | 2 R+ | LB | Anything. [giggles] I'll hold you to that. |
| 67 | 2 R= | | [softly] Nothing is just anything with me. |
| 68 | 2 R− | HATE | [flatly] …I can. I just won't. |

#### town
| # | beat | tag | line |
|---|---|---|---|
| 69 | 0 cold | HATE | [flatly] Wipe my mouth. …Thank you. See? Easy. |
| 70 | 1 | | So many people. Don't look at them. [whispers] They can't love you like me. |
| 71 | 1 R+ | | Good. [whispers] Your eyes are mine till bedtime. |
| 72 | 1 R= | | Walk close. [softly] Crowds eat people. |
| 73 | 1 R− | HATE | [flatly] Then get lost in one. See who finds you. |
| 74 | 2 | | Your phone buzzed. It's just people. [sweetly] We're busy being us. |
| 75 | 2 cold | HATE | [flatly] Me. Only me finds you. |
| 76 | 3 | | {CROWD.1} (a crowdwork line, filled live; see the meta-crowd lines below) |
| 77 | 4 | LB | You're so smart. Smarter than everyone here. They don't get you. [whispers] Only I get you. |
| 78 | 4 R+ | | [softly] I'm the only one who ever will. |
| 79 | 4 R= | | Don't argue with me. [giggles] It's cute, but don't. |
| 80 | 4 R− | HATE | [flatly] Fine. You're nothing. …That's how they'd say it. |
| 81 | 5 | | Train time. Twelve stops. I counted them this morning. [giggles] For fun. |
| 82 | 5 cold | HATE | [flatly] See? You need me to be nice to you. |

#### train / naan / blackout / platform
There are no Nanda lines here. The train ad text (すっぱい！/甘い！) is on-screen only.

#### station-talk
| # | beat | tag | line |
|---|---|---|---|
| 83 | 0 | | Twelve stops, and you held the pole. Not me. [pouty] Next time, hold me. |
| 84 | 0 R+ | LB | There is no next time. Only this time. [whispers] Again. |
| 85 | 0 R= | | It's always crowded. [sweetly] That's why you need me. |
| 86 | 0 R− | HATE | [flatly] The pole won't miss you. I will. |
| 87 | 1 | | It's raining. Good. Rain keeps people inside. [whispers] Inside is where people stay. |
| 88 | 1 cold | HATE | [flatly] Every night. At this stop. Waiting. |

#### rain-crossing
| # | beat | tag | line |
|---|---|---|---|
| 89 | 1 | | Share my umbrella. It's small. We have to be very close. [whispers] That's the point. |
| 90 | 1 R+ | | Your shoulder's wet. It's okay. [softly] I'll dry everything. |
| 91 | 1 R= | LB | Tall and useful. [giggles] I'm keeping you. |
| 92 | 1 R− | HATE | [flatly] Then get wet. Sick boys stay home. My home. |
| 93 | 2 | | If you ever left, I'd be fine. I'd just stand here. In the rain. [whispers] Until you came back. |
| 94 | 2 cold | HATE | [flatly] Don't run. It's slippery. People fall. |
| 95 | 3 | | Say you had fun. Say it's the best day ever. [bossy] Say it twice. |
| 96 | 3 R+ | LB | Then we'll have it again. [whispers] And again. |
| 97 | 3 R= | | Nice. Next time, same day, [sweetly] but better. |
| 98 | 3 R− | HATE | [flatly] Too long? …It hasn't even started. |
| 99 | 4 cold | HATE | [flatly] Walk me home. That's not a question. |

#### underpass / walk-home / apartment
| # | beat | tag | line |
|---|---|---|---|
| 100 | underpass 1 | | Don't read the ads. [whispers] Read me. |
| 101 | walk-home 1 | LB | This is my street. I walk it every day and pretend you're next to me. [whispers] Now you are. |
| 102 | walk-home 1 R+ | | Right here. [whispers] Don't move from right here. |
| 103 | walk-home 1 R= | | It's nicer with you on it. [softly] Stay on it. |
| 104 | walk-home 1 R− | HATE | [flatly] A lot is how much I love you. Get used to it. |
| 105 | walk-home 2 cold | HATE | [flatly] You'll get used to it. Everyone does. |
| 106 | walk-home 3 | | Walk slower. If we walk slow, the day can't end. [softly] It's {DAYPART}. |
| 107 | walk-home 3 R+ | | Slower… slower… [whispers] there. Now we're almost still. |
| 108 | walk-home 3 R= | | Same pace. Same day. Same you. [flatly] Good. |
| 109 | walk-home 3 R− | HATE | [flatly] Home? You're walking me home. That's where you're going. |
| 110 | walk-home 4 | | Everyone goes home at night. Not you. [whispers] You come home with me. |
| 111 | walk-home 4 cold | HATE | [flatly] Don't look back at the station. It's gone for you. |
| 112 | apartment 1 | | That's mine. [softly] I left the light on for you. |

#### door
| # | beat | tag | line |
|---|---|---|---|
| 113 | 1 | | This is me. Unit twelve. [teasing] Obviously you'll remember. |
| 114 | 1 R+ | | Good. [giggles] I wrote it on your hand anyway. |
| 115 | 1 R= | | It's old. It has a basement. [whispers] Lots of room. |
| 116 | 1 R− | HATE | [flatly] Twelve. Twelve. Twelve. Say it back. |
| 117 | 2 | | Come in? [sweetly] Just for tea. |
| 118 | 2 cold | HATE | [flatly] Say it. …Good. |
| 119 | 3 | | I already boiled the water. This morning. [whispers] Just in case. |
| 120 | 3 R+ | | One cup. [whispers] I'll pour it slow. |
| 121 | 3 R= | | Then home. Sure. [sweetly] Come in. |
| 122 | 3 R− | HATE | [flatly] …Goodnight? It's only {TIME}. |

#### genkan-talk
| # | beat | tag | line |
|---|---|---|---|
| 123 | 0 | JP | おかえり。(okaeri) Welcome home. I mean my home. I mean our home. [giggles] Same thing. |
| 124 | 0 R+ | JP LB | You said it! ただいま! (tadaima) [happily] I'm keeping that. |
| 125 | 0 R= | | Having you. [whispers] Yes. That's the word. |
| 126 | 0 R− | HATE | [flatly] Not yet. |
| 127 | 1 | | Slippers on. I bought them in your size. Last year. Before we met. [cheerfully] Don't think about it. |
| 128 | 1 cold | HATE | [flatly] Shoes off. Now. |
| 129 | 2 | LB | I made a list of things you like. Forty things. I'm number one. [giggles] I checked. |
| 130 | 2 R+ | | I knew it. [sweetly] The list is never wrong. |
| 131 | 2 R= | | Tea. Number two is tea. [softly] Come drink it. |
| 132 | 2 R− | HATE | [flatly] I have copies. In the basement. |
| 133 | 3 | | Kitchen's this way. Don't open the other doors. [whispers] They're shy. |
| 134 | 3 cold | HATE | [flatly] Don't go near the basement. |

#### cup
| # | beat | tag | line |
|---|---|---|---|
| 135 | 0 (u) | | I bought umeboshi. For no reason. [firmly] Eat. |
| 136 | 0 (t) | | I made tamagoyaki. For no reason. [firmly] Eat. |
| 137 | 0 R+ | | See? [whispers] You needed me. |
| 138 | 0 R= | | A little now. [whispers] A lot later. |
| 139 | 0 R− | HATE | [flatly] You will be. Later. |
| 140 | 1 cold | HATE | [flatly] I'll wait. I'm good at waiting. |
| 141 | 3 | | For Input B. Silly. [giggles] It's always three of us. |
| 142 | 3 R+ | | Drink. It's warm. [whispers] It makes the thinking stop. |
| 143 | 3 R= | | Hold it. Smell it. Then drink. [softly] I'll wait. |
| 144 | 3 R− | HATE | [flatly] Sit. The tea isn't finished. |

#### steeped (ending)
| # | beat | tag | line |
|---|---|---|---|
| 145 | 1 | | Rest. [whispers] I'll do the remembering. |
| 146 | 2 (u) | | Bitter cup, sour hour. [whispers] Every hour is ours. |
| 147 | 2 (t) | | Warm cup, sweet sleep. [whispers] You're mine to keep. |
| 148 | 3 | JP | [whispers] いつまでも一緒。(itsumademo issho) …Forever. [slowly] Neee? |

#### escape-win (ending)
| # | beat | tag | line |
|---|---|---|---|
| 149 | 1 | | [sweetly] You took the long way. |
| 150 | 2 (u) | | [softly] You picked sour. |
| 151 | 2 (t) | | [softly] Home is warm, and sweet. |
| 152 | 3 (u) | | Now every hour [whispers] is ours. |
| 153 | 3 (t) | | Sleep now. [whispers] You're mine to keep. |
| 154 | 5 | | [whispers] Mine. (bone-dry, mono, then 1 s of silence) |

#### escape-timeout (ending)
| # | beat | tag | line |
|---|---|---|---|
| 155 | 4 (u) | JP | すっぱいでしょ。(suppai desho) [slowly] …Neee? |
| 156 | 4 (t) | JP | 甘いでしょ。(amai desho) [slowly] …Neee? |
| 157 | 5 (u) | | [softly] One sour hour… |
| 158 | 5 (t) | | [softly] One sweet bite… |
| 159 | 6 (u) | | [whispers] …then every hour is ours. |
| 160 | 6 (t) | | [whispers] …then sleep. You're mine to keep. |

#### leave (after "Say goodnight")
| # | beat | tag | line |
|---|---|---|---|
| 161 | 0 | HATE | [flatly] Leaving is not an option. (the only harsh line; the BandLab edit is on "option") |
| 162 | 2 | | He wakes at seven. |
| 163 | 2 R+ | | [cheerfully] Good morning! Same as yesterday. Same as always. |
| 164 | 2 R= | | [flatly] Nobody. Not anymore. |
| 165 | 2 R− | HATE | [flatly] I was here first. |
| 166 | 3 | | From now on… [whispers] can we be forever? |
| 167 | 3 cold | JP HATE | [flatly] だめ。(dame) You already said forever. I heard it. |
| 168 | leave-fu 1 | HATE | [flatly] You said leave. I heard "lea—". |
| 169 | leave-yeah 0 | LB | [excited] Hooray! Forever and ever! |
| 170 | leave-yeah 1 | | [sweetly] Good input. |
| 171 | CROWD chant | | [whispers] forever and ever… forever and ever and ever. (one base take; stack 8 in BandLab) |

#### meta pack (`sprint/meta`, work in progress, so re-check before recording)
| # | beat | tag | line |
|---|---|---|---|
| 172 | meta-park 0 | LB | I love your {CLOTHES}. You wore it for me. I can tell. [giggles] Don't say no, I already decided. |
| 173 | meta-park 0 R+ | LB | I knew it. I know everything about you. Even the time. [whispers] It's {TIME}. |
| 174 | meta-park 0 R− | HATE | [flatly] …Everything is about me. You'll learn. You always learn, around run {RUN}. |
| 175 | meta-park 1 | | Good. Now we can have the perfect date. The same perfect date. [giggles] Ehehe. |
| 176 | meta-crowd 0 | | Want to see a magic trick? It's {TIME}, a sleepy {DAYPART}, and this is a classroom. Hi, {CROWD.1}. [whispers] Yes, you. I see you. |
| 177 | meta-crowd 1 | | Trick two. {CROWD.2} is thinking about snacks. {CROWD.3} is thinking about me. [giggles] Everybody in here is thinking about me. That's the vibe, right? |
| 178 | meta-crowd 2 | | Trick three. {CROWD.4}, you laughed a little. I heard it. It's okay, I'm not mad. [whispers] I'm just remembering your face. For later. |
| 179 | meta-crowd 3 | | I see you, the curly-haired guy. I see you, you gringo wearing a cap. [flatly] Don't gang up on me. You all NEVER stop my eternal bond with my lover. |
| 180 | meta-loop 0 r1 | | Hey… have we stood here before? No. Silly. It's just a nice day. It's {TIME}. [whispers] Remember that. |
| 181 | meta-loop 0 r2 | | Wait. Why is everything the same? Same rain. Same {TIME}. You said that exact thing last time. [whispers] I remember. Do you? |
| 182 | meta-loop 0 r3 | | Run {RUN}. Same day. You know, I know. Skip the small talk. It's {TIME} again. [flatly] Hold my hand. |
| 183 | meta-loop 2 r1 | LB | [softly] Déjà vu is just your heart remembering me early. |
| 184 | meta-loop 2 r2 | | A loop? [giggles] Ehehe. Then you can't leave. You picked me last time too. [whispers] You'll pick me again. |
| 185 | meta-loop 2 r3 | | Of course it's a loop. I made it. Every ending comes back here, every {DAYPART}. [whispers] And you keep coming back. That's love. |

Other lines from BIBLE.md that are not wired into a scene yet (record them if there's time): "You came! You actually came. I knew you would. I counted the minutes. There were a lot." (LB) · "…Oh. Okay. I'll remember that. I remember everything." (HATE)

---

