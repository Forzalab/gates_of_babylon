# The Perfect Date (That Never Ends): story bible (T2a)

This file holds plans and copy only. T2b turns section 3 into `src/date-beta/packs/story.json`.
Shared names are used by name only:
- tokens `{RUN} {TIME} {DAYPART} {CLOTHES} {CROWD.n}` (T3)
- choice fields `love emote fx fake` (T5)
- art ids `street-day street-dusk shop-street rail-crossing crossing-day crossing-night park` (T1a)

---

## 1. Nanda voice bible

### Who she is, in one breath
Nanda is sunshine with the doors locked. She is TOO friendly: every sentence is a hug that doesn't let go.
- She love-bombs: praise, gifts, "you're perfect".
- She is sycophantic: "you're so smart, you're the only one".
- She quietly cuts the world away: "you don't need them, you have me".

On the date she is **peaceful but psychotic**: a calm voice saying the wrong things. At home she is **batshit obsessed**: the voice stays calm and the content breaks.

### Voice rules (for T2b, T3, VA)
1. **Talk straight to the player.** Second person, present tense, like a voice agent. Say "you", never "he".
2. **Grade-2 words.** Keep it short, one idea per sentence. Lines are ≤30 words, most under 15.
3. **Sweet first, knife second.** The cute part leads and the scary part is a tag at the end ("…right?", "…obviously.", "…ね？").
4. **She never asks a real question.** Each of her questions has only one allowed answer.
5. **She counts things:** minutes, steps, cups, days, replays. She remembers everything: {TIME}, {RUN}, your picks.
6. **Kawaii markers, used lightly:** ♡, "ehehe", "mm!", "silly", "dummy". At most one per line.
7. **JP only where it's natural and short**, the way a bilingual girl slips: ね, ずっと, 一緒, いただきます, おかえり, だめ, 好き. When the meaning matters, the EN comes right before or after.
8. **Hate branch voice:** the smile turns off. No ♡ and no "ehehe"; flat, short and low. On the next beat she snaps back to sweet as if nothing happened. The snap-back is the horror.

### Her head (inner thought process, for writers + VA + animator; the player never sees it)
Write her motive as three loops that feed each other:
- **Lust, hunger for the one in front of her.** "He is here. He is real. Look at his hands. Look at his {CLOTHES}. Mine to look at."
- **Fear of loss.** "Every step away is a step toward leaving. Every other girl is a door. Every train is a door. Close the doors."
- **Possession.** "If I hold him still, he can't go. Jars keep things. Tea keeps things. Days keep things if you stop them."

She believes she is the kind one, saving you from a world that would take you. She does not think she is scary.
Every line she says is a small test: *does he still pick me?* A 💔 pick fails the test, and for one beat she stops pretending.
Across replays she knows. To her the loop is not a bug but a promise kept: "the same day, forever, and you keep coming back."

MC (from SCRIPT-v5, Jungian): his ♥ picks are the Persona (the fawn mask), his 💔 picks are the Shadow leaking, and the neutral picks are him stalling. The horror is that the mask wins.

### ~20 sample lines (EN, JP where natural)
| # | line | mode |
|---|---|---|
| 1 | You came! You actually came. I knew you would. I counted the minutes. There were a lot. ♡ | love-bomb |
| 2 | I love your {CLOTHES}. Did you wear it for me? You did. Don't say no. | love-bomb (T3 owns the final wording) |
| 3 | You're so smart. Smarter than everyone. They don't get you. Only I get you. | sycophant |
| 4 | Who needs friends? I'm the only friend you need. I'm like… ten friends. In one! | isolate |
| 5 | Hold my hand. No, the whole way. Hands get lost if you let go. | possess |
| 6 | Ehehe. You looked at that girl. It's okay! She has a bad face. Look at me instead. | jealous |
| 7 | I made a list of things you like. It has forty things. I'm number one. I checked. | obsess |
| 8 | You don't have to answer your phone. It's just people. We're busy being us. | isolate |
| 9 | 一緒にいよう、ずっと。…Let's stay together. Always. That's not a question, silly. | casual yandere |
| 10 | I'm hungry. Feed me. …Mm! See? You're so good at making me happy. Keep going. | please-me |
| 11 | If you ever left, I'd be fine. I'd just stand here. Until you came back. Forever. | fear of loss |
| 12 | The train is a big metal door. I hate doors. Stand closer. Closer. There. | fear of loss |
| 13 | Your heart is so loud. I can hear it. It's saying my name. | lust |
| 14 | It's {TIME}. We've been together for hours. I want hours and hours and hours. | counting |
| 15 | You picked that last time too. Ehehe. You're so easy to love. | replay-aware ({RUN} > 1) |
| 16 | おかえり。Welcome home. I mean my home. I mean our home. Same thing. | home |
| 17 | Shoes off. Slippers on. I bought them in your size. Last year. | home, batshit |
| 18 | Drink. It's warm. It makes the thinking stop. You think too much. | home, batshit |
| 19 | The basement is just storage. Storage is for things you keep. | basement |
| 20 | だめ。No. You don't get to go. You already said forever. I heard it. | hate / ending |
| 21 | (flat) …Oh. Okay. I'll remember that. I remember everything. | hate branch |
| 22 | (flat) Say it again. Slower. So I can write it down. | hate branch |

---

## 2. Story roadmap (one day, noon to night)

The whole date happens on **one day**. Time moves forward on every scene, and {TIME} is the player's real clock, not the story's clock (T3 plays with the gap: "it says 2:41 PM, but for us it's always today").

| # | scene id | art / bg | story time | what happens | her mode |
|---|---|---|---|---|---|
| 1 | `rooftop` (existing) | rooftop | noon | Goal card, then the bento picks. "Stay forever? The rain can wait." Both picks now roll on into the park. | sweet, testing |
| 2 | `park` (new) | `park` | 1 PM | Sakura park date. {CLOTHES} compliment (T3), hand-holding, "I'm the only friend you need". **Errand pick** → 3a or 3b. | peaceful, love-bomb |
| 3a | `errand-shop` (new) | `shop-street` | 2 PM | Buy groceries on the sakura shop street. Three cups, the jealous shop-lady line, carrying the bags. | possessive, domestic |
| 3b | `errand-library` (new) | `rail-crossing` | 2 PM | Return her library book via the rail crossing. The book is 40 days late because "you touched it once". The train is a door. | obsessive, clingy |
| 4 | `hungry` (new) | `crossing-day` | 3 PM | She's hungry: **butter chicken vs katsu curry**. It changes only her lines (flag `food`) and the later naan joke. You must feed her. | please-me |
| 5 | `town` (new) | `crossing-day` | 3:30 PM | Scramble crossing. "Don't look at them." Your phone buzzes and she handles it. `{CROWD.1}` crowdwork slot (T3). | isolate |
| 6 | `train` + `naan` + `blackout` (existing) | existing | 4:30 PM | AND Line, twelve stops, the naan/NAND joke. | (existing) |
| 7 | `platform` (existing) → `station-talk` (new) | `platform` art | 5 PM | Her stop, rain. "Next time, hold me." "There is no next time. Only this time, again." (loop hint) | fear of loss |
| 8 | `rain-crossing` (new) | `crossing-night` | 5:30 PM, storm dark | Summer storm: signs glow and the crossing is empty. Umbrella for two. "Say it's the best day ever. Twice." | peaceful-psychotic peak |
| 9 | `underpass` (existing) | existing | 5:45 PM | "Don't read the ads. Read me." | |
| 10 | `walk-home` (new) | `street-day` → `street-dusk` | 6 → 7 PM | The storm passes. Her street in late sun, then dusk: **the same street, day → dusk**, because she walks slower and slower so the day can't end. | clingy → cracking |
| 11 | `apartment`, `door` (existing) | existing | 7 PM | "I left the light on for you." Unit 12. Water boiled this morning. | cracking |
| 12 | `genkan-in` (existing) + `genkan-talk` (new) | `genkan-in` | 7:10 PM | Slippers in your size, the shrine. おかえり. From here on she is **batshit obsessed**. | obsessed |
| 13 | `cup` → `steeped` or `unknown` (existing) | BG-D2 | 7:20 PM | Tea, the third cup, "Input B". Drink → STEEPED. Stand up → hatch. | obsessed |
| 14 | `unknown` → `escape` (basement, existing) | basement | lost minutes | Hatch, ladder, jars, bento, the lock (T6 `lock-game`). Her voice comes from above. | possession |
| 15 | endings: `escape-win`, `escape-timeout`, `leave`, `leave-fu`, `leave-yeah`, `steeped` | existing | 7 AM next day / never | "Back to start" goes to `rooftop`, i.e. the SAME DAY again. | she remembers |

### Flags (new, declare in `flags`)
- `errand`: `["groceries","library"]`, set by the park pick. It is read later only by `vary` (her lines), never by `go`, except at the park fork itself.
- `food`: `["butter","katsu"]`, set in `hungry`. It is read by `vary` in `hungry` beat 1 and in `naan`.
- `cold`: `["no","yes"]`. Every 3-way pick sets it: ♥ and neutral set `"no"`, 💔 sets `"yes"`. The beat right after a pick reads it through `vary` to play hate line 2 (see section 3 format).

### Memory hooks for T3 (tokens only; T3 writes the meta lines)
Hooks are marked `[T3]` in the table. The plan:
- `park` beat 0 is the {CLOTHES} line.
- `town` beat 3 is the {CROWD.1} slot.
- `station-talk` beat 0 is the loop hint.
- `rain-crossing` beat 0 shows {TIME}.
- `walk-home` beat 3 uses {DAYPART}.
- On {RUN} ≥ 2, T3 may overlay any `[T3]` beat with the "you picked that last time too" and "am I in a loop?" lines.

The replay counter is the reason the endings go "Back to start" → `rooftop`. She remembers; the day doesn't.

### Tone curve
- The date (park → rain-crossing) is **peaceful but psychotic**: pastel light and sparkles, with calm, wrong lines. Hate branches are short cold snaps that she instantly smooths over.
- Her home onward is **batshit obsessed**: the same sweet voice, but the content is jars, slippers in your size, and "I heard forever".

---

## 3. Beat table

### How to paste (T2b, mechanical)
- **One row = one beat**, in order. `#` is the beat index inside the scene.
- **`NEW` scenes** go in `scenes[]`, and each block names its `insert` spot. **`PATCH`** cells on existing scenes become `patch:[{scene,beat,set:{...}}]`. **`keep`** = don't touch.
- **spk:** `N` → `"speaker":"NANDA"`, `MC` → `"speaker":"MC"`, `–` → `"speaker":false` (narration). Write `text` with no `NAME:` prefix.
- **Pick cells** read `label ~ love ~ emote ~ fx ~ react [+set{..}] [+go:id] [+fake]`.
  - ♥ cell: `side:"pink"`, `set.cold:"no"`
  - = (neutral) cell: `side:"pink"`, `set.cold:"no"`, `default:true`
  - 💔 cell: `side:"purple"`, `set.cold:"yes"`
  - Merge any `+set{}` into that `set`.
- **Hate line 2 (H2):** put it on the NEXT beat as `vary:{cold:{yes:{text:"<H2>"}}}`. That beat's own text is her sweet snap-back. When the next beat opens a new scene, put the vary on that scene's beat 0.
- **Every 3-way pick beat** gets `timer: 12`.
- **MOVE** = a movement beat: `speaker:false`, and the text is the action in caps. T5 writes both options (stage 1/2, `fake`); T2b only copies the `go` from the notes onto both.
- **`[T3]`** = T3 may override the text from `packs/meta.json`. Paste my placeholder anyway.

### Contract gaps (T5 lifts these, or T2b trims)
- SCENES.md caps beat `text` and choice `react` at "max 12 words", but the sprint allows ≤30. About 40% of the lines below run 13–22 words.
- Choices are capped at "1–2", and 3 are needed.
- `emote:"hate"` and `fx` are new fields.
- New flags: `errand`, `food`, `cold` (see section 2). No beat varies on two flags at once.

### rooftop (existing) · keep beats 0, 2, 4, 5
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| rooftop | 0 | – | (goal card) | | | | | keep, `card:"goal"` |
| rooftop | 1 | N | PATCH text: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ~ +3 ~ hearts ~ love-burst ~ Sweet egg for my sweet boy. ♡ +set{bento:"tamagoyaki"} | Take the umeboshi ~ +1 ~ sweat ~ none ~ Sour. Brave. I'll remember you like sour. +set{bento:"umeboshi"} | Take neither ~ -3 ~ hate ~ hate-quake ~ …I woke up at four for this. +set{bento:"umeboshi"} | | keep flag `bento` (steeped/escape read it) |
| rooftop | 3 | – | keep | Best I've ever had ~ +2 ~ heart ~ love-burst ~ …Obviously. Don't stare. | It's good ~ +1 ~ sweat ~ none ~ Good is a start. Tomorrow I'll do better. | Bit salty, honestly ~ -3 ~ hate ~ hate-quake ~ Say that again. Slowly. So I can write it down. | Salty. Noted. Forever. | patch choices; H2 on #4 |
| rooftop | 6 | N | keep: Stay f{OR}ever? The rain can wait. | Stay a minute ~ +3 ~ hearts ~ love-burst ~ A minute. Then another. Then the whole day. | Walk with her ~ +1 ~ sweat ~ none ~ Yay! Park first. I already planned it. | {OR} Leave before the rain ~ -3 ~ hate ~ hate-quake ~ …Fine. The rain can have you. Later. | Park. Now. Hold my hand on the way. | no `go`: everything falls through to `park` |

### park (NEW) · bg `park` · insert after `rooftop`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| park | 0 | N | [T3] I love your {CLOTHES}. You wore it for me. I can tell. | I wore it for you ~ +3 ~ hearts ~ love-burst ~ I knew it. I know everything about you. ♡ | It was clean ~ +1 ~ sweat ~ none ~ Clean for me. That's the same thing, silly. | Not everything is about you ~ -4 ~ hate ~ hate-quake ~ …Everything is about me. You'll learn. | Don't say that again. The petals are listening. | sakura fall, lens flare, Nanda centred; receives rooftop #6 H2 |
| park | 1 | N | Sakura only last a week. Then they fall. I don't let things fall. | | | | | petals stop mid-air for one frame on "fall" (RM: static) |
| park | 2 | N | Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ~ +3 ~ hearts ~ love-burst ~ Tighter. Mm. Now you're mine till tonight. ♡ | Hold one finger ~ +1 ~ sweat ~ none ~ One finger is a start. I'll collect the rest. | Pull your hand back ~ -4 ~ hate ~ hate-quake ~ Oh. …Your hand is cold anyway. | I'll warm it later. I have ways. | |
| park | 3 | N | Who needs friends? I'm the only friend you need. I'm like ten friends. In one! | | | | | sparkle burst on "In one!" |
| park | 4 | N | [T3] It's {TIME}. One job today. My groceries, or my library book? You pick. I already know. | Carry her groceries ~ +2 ~ heart ~ love-burst ~ Groceries! For our dinner. I mean mine. Ours. +set{errand:"groceries"} +go:errand-shop | Return her book ~ +2 ~ heart ~ none ~ The book! It's late. Like you. But you came. +set{errand:"library"} +go:errand-library | Do it alone, later ~ -4 ~ hate ~ hate-quake ~ Alone? There's no alone today. Groceries. Now. +set{errand:"groceries"} +go:errand-shop | Carrots first. Then you can talk. | the errand fork; H2 goes on errand-shop #0 |

### errand-shop (NEW) · bg `shop-street` · insert after `park`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| errand-shop | 0 | – | A street of little shops. Pink petals on every roof. | | | | | magic-hour gradient |
| errand-shop | 1 | N | Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ~ +3 ~ hearts ~ love-burst ~ You get it. You always get me. | Why three? ~ +1 ~ sweat ~ none ~ Because it's always three of us. Silly. | Two is normal ~ -3 ~ hate ~ hate-quake ~ Normal people are lonely. Do you want lonely? | Three. Say it. Three. | plants the third cup (`cup` #3) |
| errand-shop | 2 | N | The shop lady smiled at you. It's okay! She has a bad face. Look at me. | | | | | shop lady = silhouette, never a face |
| errand-shop | 3 | N | You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ~ +3 ~ hearts ~ love-burst ~ Ehehe. Heavy means you can't run. | The bags are fine ~ +1 ~ sweat ~ none ~ Fine is my least favorite word. | Carry your own bags ~ -4 ~ hate ~ hate-quake ~ …Okay. I'll carry everything. I always do. | I carry a lot. You don't even know. | |
| errand-shop | 4 | N | I'm hungry. You look hungry too. Let's eat. Now. | | | | | |
| errand-shop | 5 | – | MOVE: WALK TO THE FOOD STALLS | | | | | go:hungry |

### errand-library (NEW) · bg `rail-crossing` · insert after `errand-shop`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| errand-library | 0 | – | A rail crossing. Bells ring. Sakura on the tracks. | | | | | sfx: crossing bell |
| errand-library | 1 | N | This book is forty days late. I kept it because you touched it once. | That's so sweet ~ +3 ~ hearts ~ love-burst ~ I knew you'd say that. I wrote it down. | I don't remember that ~ +1 ~ sweat ~ none ~ I do. I remember for both of us. | That's creepy ~ -4 ~ hate ~ hate-quake ~ Creepy is a word for people who get left. | Don't use words you can't take back. | |
| errand-library | 2 | N | The gate is down. The train is a big metal door. I hate doors. Stand closer. | | | | | a train blur passes behind her; she doesn't blink |
| errand-library | 3 | N | Book's back. Now the library can't keep you either. Only I can. | Only you ~ +4 ~ hearts ~ love-burst ~ Only me. Say it at the station too. | Let's go eat ~ +1 ~ sweat ~ none ~ Mm! Yes! Food, then more me. | Nobody keeps me ~ -5 ~ hate ~ hate-quake ~ Everybody gets kept. It's just who does it. | You'll see. Tonight. | |
| errand-library | 4 | – | MOVE: WALK TO THE FOOD STALLS | | | | | go:hungry |

### hungry (NEW) · bg `crossing-day` · insert after `errand-library`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| hungry | 0 | N | I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right one. | Butter chicken, for her ~ +3 ~ hearts ~ love-burst ~ With naan! You know me so well. ♡ +set{food:"butter"} | Katsu curry ~ +2 ~ heart ~ none ~ Crunchy! You chose. I'll pretend I did. +set{food:"katsu"} | I'm not hungry ~ -4 ~ hate ~ hate-quake ~ You don't eat? Then you watch me eat. +set{food:"katsu"} | (none) | inconsequential; #1 varies on `food` |
| hungry | 1 | N | Say ahh. No, I feed you first. Then you feed me. That's the rule. | | | | | `vary.food.butter.text`: "Tear the naan. Give me the soft part. Always the soft part." · `vary.food.katsu.text`: "Cut the katsu. Blow on it. I like it when you work for me." |
| hungry | 2 | N | Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ~ +3 ~ hearts ~ love-burst ~ Anything. I'll hold you to that. ♡ | It's just lunch ~ +1 ~ sweat ~ none ~ Nothing is just anything with me. | Feed yourself ~ -4 ~ hate ~ hate-quake ~ …I can. I just won't. | Wipe my mouth. …Thank you. See? Easy. | H2 goes on town #0 |

### town (NEW) · bg `crossing-day` · insert after `hungry`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| town | 0 | – | The big crossing. A thousand people. She only looks at you. | | | | | crowd blurred, she is sharp |
| town | 1 | N | So many people. Don't look at them. They can't love you like me. | Only looking at you ~ +3 ~ hearts ~ love-burst ~ Good. Your eyes are mine till bedtime. | Keep walking ~ +1 ~ sweat ~ none ~ Walk close. Crowds eat people. | I like crowds ~ -4 ~ hate ~ hate-quake ~ Then get lost in one. See who finds you. | Me. Only me finds you. | |
| town | 2 | N | Your phone buzzed. It's just people. We're busy being us. | | | | | a phone icon pops in, then pops out |
| town | 3 | N | [T3] {CROWD.1} | | | | | crowdwork slot (e.g. the curly-hair / cap line); T3 writes it |
| town | 4 | N | You're so smart. Smarter than everyone here. They don't get you. Only I get you. | You get me ~ +3 ~ hearts ~ love-burst ~ I'm the only one who ever will. | I'm not that smart ~ +1 ~ sweat ~ none ~ Don't argue with me. It's cute, but don't. | Stop flattering me ~ -4 ~ hate ~ hate-quake ~ Fine. You're nothing. …That's how they'd say it. | See? You need me to be nice to you. | |
| town | 5 | N | Train time. Twelve stops. I counted them this morning. For fun. | | | | | |
| town | 6 | – | MOVE: WALK TO THE STATION | | | | | go:train |

### train, naan, blackout, platform (existing) · keep all, plus one patch
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 | notes |
|---|---|---|---|---|---|---|---|---|
| naan | 1 | MC | keep: Technically, that's a NAND gate. Not bread. | | | | | PATCH `vary.food.butter.text`: "Technically, that's a NAND gate. Not our lunch." |

### station-talk (NEW) · bg `platform` (existing art) · insert after `platform`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| station-talk | 0 | N | [T3] Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ~ +3 ~ hearts ~ love-burst ~ There is no next time. Only this time. Again. ♡ | It was crowded ~ +1 ~ sweat ~ none ~ It's always crowded. That's why you need me. | I needed the pole ~ -4 ~ hate ~ hate-quake ~ The pole won't miss you. I will. | Every night. At this stop. Waiting. | loop hint; T3 thickens it on {RUN} |
| station-talk | 1 | N | It's raining. Good. Rain keeps people inside. Inside is where people stay. | | | | | rain gets heavier |

### rain-crossing (NEW) · bg `crossing-night` · insert after `station-talk`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| rain-crossing | 0 | – | [T3] Rain. The signs glow. The crossing is empty now. It's {TIME}. | | | | | storm dark, billboards, wet reflections |
| rain-crossing | 1 | N | Share my umbrella. It's small. We have to be very close. That's the point. | Step under, close ~ +4 ~ hearts ~ love-burst ~ Your shoulder's wet. It's okay. I'll dry everything. | Hold it for her ~ +1 ~ sweat ~ none ~ Tall and useful. I'm keeping you. | I'll just get wet ~ -4 ~ hate ~ hate-quake ~ Then get wet. Sick boys stay home. My home. | Don't run. It's slippery. People fall. | the pink umbrella is the only warm colour |
| rain-crossing | 2 | N | If you ever left, I'd be fine. I'd just stand here. In the rain. Until you came back. | | | | | billboards flick to her face for one frame (RM: skip) |
| rain-crossing | 3 | N | Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ~ +4 ~ hearts ~ love-burst ~ Then we'll have it again. And again. ♡ | It was a nice day ~ +1 ~ sweat ~ none ~ Nice. Next time, same day, but better. | It's been too long ~ -5 ~ hate ~ hate-quake ~ Too long? …It hasn't even started. | Walk me home. That's not a question. | |
| rain-crossing | 4 | – | MOVE: WALK HER HOME | | | | | go:underpass |

### underpass (existing) · keep beats 0–1

### walk-home (NEW) · bg `street-day` then `street-dusk` · insert after `underpass`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| walk-home | 0 | – | The rain stops. Sun on her street. She walks slower. | | | | | bg street-day, the wet road shines |
| walk-home | 1 | N | This is my street. I walk it every day and pretend you're next to me. Now you are. | I'm right here ~ +3 ~ hearts ~ love-burst ~ Right here. Don't move from right here. | It's a nice street ~ +1 ~ sweat ~ none ~ It's nicer with you on it. Stay on it. | That's a lot ~ -4 ~ hate ~ hate-quake ~ A lot is how much I love you. Get used to it. | You'll get used to it. Everyone does. | |
| walk-home | 2 | – | The sky goes orange. She stopped walking a while ago. | | | | | bg street-dusk: same framing, day → dusk cross-fade (RM: hard-cut) |
| walk-home | 3 | N | [T3] Walk slower. If we walk slow, the day can't end. It's {DAYPART}. | Walk slower with her ~ +3 ~ hearts ~ love-burst ~ Slower… slower… there. Now we're almost still. | Keep the same pace ~ +1 ~ sweat ~ none ~ Same pace. Same day. Same you. Good. | I need to go home ~ -5 ~ hate ~ hate-quake ~ Home? You're walking me home. That's where you're going. | Don't look back at the station. It's gone for you. | |
| walk-home | 4 | N | Everyone goes home at night. Not you. You come home with me. | | | | | streetlights click on one by one |
| walk-home | 5 | – | MOVE: FOLLOW HER INSIDE | | | | | go:apartment |

### apartment, door (existing)
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| door | 1 | N | keep: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ~ +2 ~ heart ~ love-burst ~ Good. I wrote it on your hand anyway. | Nice building ~ +1 ~ sweat ~ none ~ It's old. It has a basement. Lots of room. | Which unit again? ~ -3 ~ hate ~ hate-quake ~ Twelve. Twelve. Twelve. Say it back. | Say it. …Good. | patch choices |
| door | 3 | N | keep: I already boiled the water. This morning. Just in case. | Just one cup ~ +3 ~ hearts ~ love-burst ~ One cup. I'll pour it slow. +go:genkan-in | One cup, then home ~ +1 ~ sweat ~ none ~ Then home. Sure. Come in. +go:genkan-in | Say goodnight ~ -3 ~ hate ~ hate-quake ~ …Goodnight? It's only {TIME}. +go:leave | | patch choices; she ignores "then home" |

### genkan-in (existing, keep) + genkan-talk (NEW) · bg `genkan-in` · insert genkan-talk after `genkan-in`
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| genkan-talk | 0 | N | おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ~ +4 ~ hearts ~ love-burst ~ You said it! ただいま! I'm keeping that. | Thanks for having me ~ +1 ~ sweat ~ none ~ Having you. Yes. That's the word. | This isn't my home ~ -5 ~ hate ~ hate-quake ~ Not yet. | Shoes off. Now. | batshit starts; the light is a little too warm |
| genkan-talk | 1 | N | Slippers on. I bought them in your size. Last year. Before we met. Don't think about it. | | | | | the 4th shoe slot is empty |
| genkan-talk | 2 | N | I made a list of things you like. Forty things. I'm number one. I checked. | You're number one ~ +3 ~ hearts ~ love-burst ~ I knew it. The list is never wrong. | What's number two? ~ +1 ~ sweat ~ none ~ Tea. Number two is tea. Come drink it. | Burn the list ~ -5 ~ hate ~ hate-quake ~ I have copies. In the basement. | Don't go near the basement. | first basement mention |
| genkan-talk | 3 | N | Kitchen's this way. Don't open the other doors. They're shy. | | | | | |

### cup (existing) · patch picks
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| cup | 0 | – | keep | Eat it all ~ +2 ~ heart ~ love-burst ~ See? You needed me. | Eat a little ~ +1 ~ sweat ~ none ~ A little now. A lot later. | I'm not hungry ~ -3 ~ hate ~ hate-quake ~ You will be. Later. | I'll wait. I'm good at waiting. | patch choices; H2 on #1 |
| cup | 3 | N | keep: For Input B. Silly. It's always three of us. | Drink ~ +3 ~ hearts ~ love-burst ~ Drink. It's warm. It makes the thinking stop. +go:steeped | Hold the cup ~ +1 ~ sweat ~ none ~ Hold it. Smell it. Then drink. I'll wait. +go:steeped | Stand up ~ -3 ~ hate ~ hate-quake ~ Sit. The tea isn't finished. +go:unknown | | patch choices |

### steeped (existing ending) · keep all

### unknown, escape = basement (existing)
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 | notes |
|---|---|---|---|---|---|---|---|---|
| unknown | 1 | – | MOVE: OPEN THE HATCH | | | | | existing choice → T5 stage 1 |
| unknown | 2 | – | MOVE: CLIMB DOWN | | | | | T5 stage 1 ("Tippy-toe down ♡") |
| escape | 0 | – | MOVE: LOOK AT THE SHELVES | | | | | T5 stage 2 |
| escape | 5 | – | MOVE: KEEP LOOKING | | | | | T5 stage 2 |
| escape | 6–11 | | keep | | | | | lock-game (T6). If a voice-from-above slot is free: "Are you okay down there? I can't hear you. …I can hear you." / "Storage is for things you keep." / "The jars aren't scary. They're just memories. Of boys." |
| escape | 13 | – | keep: A heavy door. Behind it, stairs to the street. | | | | | MOVE: LEAVE HER HOUSE (T5 stage 2, `fake` opposite); keep the existing gos |

### endings (existing) · patch picks
| scene | # | spk | line | ♥ pick | = pick | 💔 pick | H2 → next beat | notes |
|---|---|---|---|---|---|---|---|---|
| leave | 2 | N | keep: He wakes at 7:00. | Good morning, Nanda ~ +2 ~ heart ~ love-burst ~ Good morning! Same as yesterday. Same as always. | Who's 'he'? ~ +1 ~ sweat ~ none ~ Nobody. Not anymore. | Stop following me ~ -3 ~ hate ~ hate-quake ~ I was here first. | だめ。You already said forever. I heard it. | patch choices |
| leave | 3 | N | keep: From now on… can we be f{OR}ever? | uhmmm yeah ig ~ +1 ~ sweat ~ love-burst ~ (keep none) +go:leave-yeah | Forever sounds long ~ 0 ~ – ~ chosen-flash ~ (none) +go:leave-yeah +fake | FUCK YOU. I'm leaving ~ -5 ~ hate ~ hate-quake ~ (none) +go:leave-fu | | the neutral is `fake`: it flashes "YOU CHOSE TO SAY YES." |
| (every end card) | last | – | keep: Back to start → `rooftop` | | | | | [T3] {RUN}++ here; she remembers, the day doesn't |

### Counts
- **Scenes:** 9 new, 18 existing (27 total).
  - New: `park`, `errand-shop`, `errand-library`, `hungry`, `town`, `station-talk`, `rain-crossing`, `walk-home`, `genkan-talk`.
  - Existing with patches: `rooftop`, `naan`, `door`, `cup`, `leave`, plus the MOVE marks in `unknown`/`escape`.
- **Lines:** 43 new beats (38 lines + 5 MOVE), plus 1 patched text and 2 vary lines.
- **Picks:** 27 three-way picks (18 new + 9 patched). Of the new speech lines, 18 of 32 are picks (56%).
- **Hate branches:** 26 cold reacts and 20 H2 second lines.
- **MOVE beats:** 10 (5 new + 5 existing).
