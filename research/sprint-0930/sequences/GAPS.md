# Play-path audit vs the scene checklist (RESEARCH.md §5)

Checklist: E establishing · M medium/talk · I insert · R reaction · X exit · B bed · S spot SFX · Q ma · V voice · F fold.
"Before" = sprint/obbp play path (story, meta, mech, lockgame, obbp). "Fix" = what `packs/sequences.json` adds.
SFX IDs: existing = in assets.json; **new** = to hunt (ASSET-HUNT-SPEC style; SX-47+ are new numbers).

| decision | before: has | before: missing | fix in sequences.json | still missing (SFX / voice / art) |
|---|---|---|---|---|
| bento (rooftop 1) | E (rooftop), M, R lines (vary) | I (the lid), Q, S | rooftop +2: lid insert (vary bento), "She watches you chew" ma | S: SX-17 chopsticks, SX-47 **bento lid pop**; art `bento-lid`, `nanda-watch` |
| park activity (hand) | M, pick | E (park opens on a pick), I, R, B | park +1 establishing (petals), +2 hands insert + "Like a lock. Click." | B: SX-16 birdsong, SX-15 wind; art `park-wide`, `hands-lock` (park itself has no art, falls back to rooftop) |
| errand: shop | E, M, 2 picks | I, X, B, S | +1 three-cups insert, +2 exit (door jingle) + "Heavy means you can't run" | B: SX-48 **shop street murmur**; S: SX-49 **shop door bell**; art `three-cups-basket`, `shop-exit` |
| errand: library | E (crossing), M | the library is never shown; I, R, X | +3 library establishing, book-slot insert, "good hostage" reaction; +1 exit (crossing bell) | S: SX-50 **crossing bell kan-kan**, SX-51 **book drop thunk**; B: library room tone (SX-34 variant); art `library-int`, `book-slot`, `crossing-bell` |
| food: butter chicken vs katsu | M, pick, feed pick | E, I, R, X (the restaurant never exists; food = one line) | new `seq-butter` / `seq-katsu` (7 beats each): house → dish insert → feed → feed pick → face → exit → town | B: SX-52 **restaurant ambience**; S: SX-40 sizzle, SX-53 **plate set down**, SX-54 **katsu crunch**; art `curry-house-int`, `curry-house-ext`, `dish-butter`, `dish-katsu`, `nanda-eat-butter`, `nanda-eat-katsu` (fallback `cafe`) |
| town → station | crowd lines, MOVE | E (station), I, S; jump cut crossing → train | new `seq-station` (4 beats): station wide, IC-card insert, "I loaded your card", door chime → train | S: SX-55 **IC card beep**, SX-23 chime, SX-24 door hiss; art `station-gate`, `ic-card-tap`, `train-door` (fallback `naan`) |
| train / platform | E, B (train-hum), inserts (zoom) | R after the NAND gag | none (already the best-shot scene) | SX-22 rail clack bed |
| rain crossing (umbrella) | E, M, 2 picks | I, R | +2 umbrella insert + "Dry people don't leave." | S: SX-56 **rain on umbrella**; art `umbrella-shoulder` |
| walk home | E, dusk change, 2 picks | I, R before the door | +2 key-in-hand insert + "I held it all day" | B: SX-35 cicadas / SX-31 footsteps; art `key-in-hand` |
| door / tea | E (stairs), insert kettle | kitchen E, pour insert, R | genkan-talk +3: kitchen wide, pour insert, "my breath in it" | S: SX-38 pour, SX-38b cup down, SX-37b switch; art `kitchen-wide`, `tea-pour` (fallback BG-D2) |
| basement moves | E, inserts (shelves), ma (blackouts), S | her presence above (J-cut) | unknown +1 "kettle clicks off" J-cut; escape +1 footsteps above before the lock game | S: SX-37b click, SX-31 footsteps (floor above); art `hatch-dark` |
| ending: STEEPED | R, ma | last object insert | +1 "Your cup empty, hers full" | art `cups-end` |
| ending: ESCAPE | X, flat voice | final wide | escape-win +1 street-night wide | art `street-night-window` |
| ending: LEAVE | chant, freeze | final wide | leave-yeah +1 café cups wide | art `cafe-cups`; leave-fu untouched |

## Top 5 gaps (before this pack)
1. Food pick had no place: no restaurant, no dish, no face eating it (Tony's example). Now 2 full sequences.
2. Library errand never showed the library. Now establishing + book-slot insert + reaction.
3. Crossing → train was a jump cut: no station, no gate. Now `seq-station`.
4. No ambience beds on the new daytime places (park, shops, curry house, station): all need new SFX (SX-48, 52, 16).
5. Inserts are text-only until art lands: every `props.shot` below falls back to the scene's bg.

## Art to build (new art ids; the pack sets them as `props.shot`, bg stays the fallback)
| id | shot (1 line) | ref search (Google) |
|---|---|---|
| bento-lid | top-down close-up, lid lifting off a bento (tamagoyaki / umeboshi variants) | "anime bento box close up top down", "anime tamagoyaki bento" |
| nanda-watch | close-up of Nanda, chin on hands, not eating, smiling | "anime girl chin on hands staring close up" |
| park-wide | wide sakura park, blue sky, falling petals | "anime sakura park background wide", "shinkai cherry blossom sky" |
| hands-lock | insert of two hands, fingers interlocked, her grip tight | "anime holding hands close up interlocked fingers" |
| three-cups-basket | insert: shopping basket with three teacups | "anime shopping basket close up", "japanese teacups store" |
| shop-exit | medium: shop door closing, bags in hand, petals | "anime shop street exit background" |
| library-int | wide quiet library, cool light, shelves | "anime library interior background" |
| book-slot | insert: book sliding into a return slot | "library book return slot close up" |
| crossing-bell | insert: rail crossing lights + bell, gate down | "anime railroad crossing close up bell" |
| curry-house-int | tiny curry house counter, warm light, two seats side by side | "anime curry restaurant interior background", "japanese curry shop counter" |
| curry-house-ext | exterior with noren curtain + bell, street behind | "anime restaurant exterior noren" |
| dish-butter | insert: butter chicken + torn naan, steam | "anime butter chicken naan food art" |
| dish-katsu | insert: katsu curry, knife cutting cutlet | "anime katsu curry close up", "japanese katsu curry plate" |
| nanda-eat-butter | reaction: Nanda eating, blissful, eyes on you | "anime girl eating happy close up" |
| nanda-eat-katsu | reaction: Nanda chewing slowly, eyes on you, not the plate | "anime yandere girl eating staring" |
| station-gate | wide: station concourse with ticket gates, noon light | "anime train station ticket gate background" |
| ic-card-tap | insert: IC card tapping a gate reader | "suica card tap gate close up" |
| train-door | medium: train doors open, her hand on your sleeve | "anime train door open platform" |
| umbrella-shoulder | insert: one small umbrella, her shoulder wet in rain | "anime sharing umbrella rain shoulder" |
| key-in-hand | insert: her hand gripping a house key at dusk | "anime hand holding key close up" |
| kitchen-wide | wide: spotless small kitchen, three chairs, kettle | "anime apartment kitchen background night" |
| tea-pour | insert: tea pouring, steam curling | "anime tea pouring close up steam" |
| hatch-dark | insert: dark hatch, ceiling light from above | "anime basement hatch dark" |
| cups-end | insert: one empty cup, one full cup | "two teacups table close up dark" |
| street-night-window | wide: her street at night, one lit window | "anime street night lit window background" |
| cafe-cups | wide: café, every table with two cups | "anime cafe interior morning empty" |

## SFX to hunt (new ones in bold)
SX-16 birdsong, SX-15 wind, SX-17 chopsticks, SX-22 rail clack, SX-23 door chime, SX-24 door hiss, SX-31 footsteps,
SX-35 cicadas, SX-37b kettle click, SX-38 pour, SX-38b cup down, SX-40 sizzle, **SX-47 bento lid pop**,
**SX-48 shop street murmur**, **SX-49 shop door bell**, **SX-50 crossing bell kan-kan**, **SX-51 book drop thunk**,
**SX-52 restaurant ambience**, **SX-53 plate set down**, **SX-54 katsu crunch**, **SX-55 IC card beep**, **SX-56 rain on umbrella**.
Until they land the pack uses existing cues (tick, thump, bell, wind, kettle, rain, breath, silence, train-hum).
