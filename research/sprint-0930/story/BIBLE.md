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
