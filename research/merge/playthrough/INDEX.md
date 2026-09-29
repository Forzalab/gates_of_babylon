# date-beta playthrough (main vs merge preview)

- main = origin/claude/leftover-tonight-tasks-5wm6yl @ 7f544ec
- merge preview = same + research/merge/alt-scenes.json as scenes.json + alt art (Platform, Underpass, ApartmentExt, Stairs, Rain, alt.css, Genkan as GenkanArrival) registered in art/index.js (uncommitted, built in a throwaway checkout)
- npm test in merge preview: 191 tests, 183 pass, 8 fail (expected: main tests unaware of new scenes)
- preview shims: none (Say.jsx exports OrSpans; util.js exports rng/useStep)
- Entry: index.html?demo -> click wordmark -> date-beta; 1920x1080

## Thread main

| run | beats | console/net errors | grey boxes | hung? |
|---|---|---|---|---|
| steeped__tamagoyaki | 34 | 0 | 0 | no |
| escape-win__tamagoyaki | 51 | 0 | 0 | no |
| escape-timeout__tamagoyaki | 52 | 0 | 0 | no |
| leave-fu__tamagoyaki | 34 | 0 | 0 | no |
| leave-yeah__tamagoyaki | 34 | 0 | 0 | no |
| leave-fu__umeboshi__rm | 31 | 0 | 0 | no |

## Thread merge

| run | beats | console/net errors | grey boxes | hung? |
|---|---|---|---|---|
| steeped__tamagoyaki | 45 | 0 | 0 | no |
| escape-win__tamagoyaki | 62 | 0 | 0 | no |
| escape-timeout__tamagoyaki | 63 | 0 | 0 | no |
| leave-fu__tamagoyaki | 42 | 0 | 0 | no |
| leave-yeah__tamagoyaki | 42 | 0 | 0 | no |
| leave-fu__umeboshi__rm | 39 | 0 | 0 | no |

### main / steeped__tamagoyaki

00 rooftop-0 — "" — main/steeped__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/steeped__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — main/steeped__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — main/steeped__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — main/steeped__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/steeped__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/steeped__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/steeped__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — main/steeped__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/steeped__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/steeped__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/steeped__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/steeped__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/steeped__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — main/steeped__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — main/steeped__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — main/steeped__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — main/steeped__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — main/steeped__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — main/steeped__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — main/steeped__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/steeped__tamagoyaki/21-door-0.png — errors 0 — greybox false — sfx rain
22 door-1 — "Come in? Just for tea." — main/steeped__tamagoyaki/22-door-1.png — errors 0 — greybox false — sfx tick
23 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/steeped__tamagoyaki/23-door-2.png — errors 0 — greybox false — sfx kettle
24 cup-0 — "I made tamagoyaki. For no reason. Eat." — main/steeped__tamagoyaki/24-cup-0.png — errors 0 — greybox false — sfx kettle
25 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — main/steeped__tamagoyaki/25-cup-1.png — errors 0 — greybox false — sfx thump
26 cup-2 — "Who's the third cup for?" — main/steeped__tamagoyaki/26-cup-2.png — errors 0 — greybox false — sfx tick
27 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — main/steeped__tamagoyaki/27-cup-3.png — errors 0 — greybox false — sfx breath
28 steeped-0 — "OR" — main/steeped__tamagoyaki/28-steeped-0.png — errors 0 — greybox false — sfx breath
29 steeped-1 — "Rest. I'll do the remembering." — main/steeped__tamagoyaki/29-steeped-1.png — errors 0 — greybox false — sfx silence
30 steeped-2 — "Warm cup, sweet sleep. You're mine to keep." — main/steeped__tamagoyaki/30-steeped-2.png — errors 0 — greybox false — sfx breath
31 steeped-3 — "ずっと。…FORever. Ne?" — main/steeped__tamagoyaki/31-steeped-3.png — errors 0 — greybox false — sfx breath
32 steeped-4 — "STEEPED. [Back to start]" — main/steeped__tamagoyaki/32-steeped-4.png — errors 0 — greybox false — sfx static
33 back-to-rooftop:0 — "" — main/steeped__tamagoyaki/33-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### main / escape-win__tamagoyaki

00 rooftop-0 — "" — main/escape-win__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/escape-win__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — main/escape-win__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — main/escape-win__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — main/escape-win__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/escape-win__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/escape-win__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/escape-win__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — main/escape-win__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/escape-win__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/escape-win__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/escape-win__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/escape-win__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/escape-win__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — main/escape-win__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — main/escape-win__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — main/escape-win__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — main/escape-win__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — main/escape-win__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — main/escape-win__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx static
20 blackout-9 — "" — main/escape-win__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/escape-win__tamagoyaki/21-door-0.png — errors 0 — greybox false — sfx rain
22 door-1 — "Come in? Just for tea." — main/escape-win__tamagoyaki/22-door-1.png — errors 0 — greybox false — sfx tick
23 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/escape-win__tamagoyaki/23-door-2.png — errors 0 — greybox false — sfx kettle
24 cup-0 — "I made tamagoyaki. For no reason. Eat." — main/escape-win__tamagoyaki/24-cup-0.png — errors 0 — greybox false — sfx kettle
25 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — main/escape-win__tamagoyaki/25-cup-1.png — errors 0 — greybox false — sfx thump
26 cup-2 — "Who's the third cup for?" — main/escape-win__tamagoyaki/26-cup-2.png — errors 0 — greybox false — sfx tick
27 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — main/escape-win__tamagoyaki/27-cup-3.png — errors 0 — greybox false — sfx breath
28 unknown-0 — "You stand. The floor tilts a little." — main/escape-win__tamagoyaki/28-unknown-0.png — errors 0 — greybox false — sfx thump
29 unknown-1 — "Under the table: a floor hatch. Too big for storage. [Open the hatch]" — main/escape-win__tamagoyaki/29-unknown-1.png — errors 0 — greybox false — sfx tick
30 unknown-2 — "A steep wooden ladder. Down into the dark. [Climb down]" — main/escape-win__tamagoyaki/30-unknown-2.png — errors 0 — greybox false — sfx drone
31 escape-0 — "Concrete. One bulb. Rain at a high window. [Look at the shelves]" — main/escape-win__tamagoyaki/31-escape-0.png — errors 0 — greybox false — sfx drone
32 escape-1 — "Jars on the shelves. Each one: a date, a name." — main/escape-win__tamagoyaki/32-escape-1.png — errors 0 — greybox false — sfx thump
33 escape-2 — "The dates go back years. The names are all different." — main/escape-win__tamagoyaki/33-escape-2.png — errors 0 — greybox false — sfx thump
34 escape-3 — "Bento boxes, one per day. Your name on each. Untouched." — main/escape-win__tamagoyaki/34-escape-3.png — errors 0 — greybox false — sfx tick
35 escape-4 — "The oldest is dated before you met." — main/escape-win__tamagoyaki/35-escape-4.png — errors 0 — greybox false — sfx tick
36 escape-5 — "A mortar and a mallet. One fresh mochi. Hers only. [Keep looking]" — main/escape-win__tamagoyaki/36-escape-5.png — errors 0 — greybox false — sfx tick
37 escape-6 — "Newest jar: today, your name, tamagoyaki. Lid off. Empty." — main/escape-win__tamagoyaki/37-escape-6.png — errors 0 — greybox false — sfx thump
38 escape-7 — "" — main/escape-win__tamagoyaki/38-escape-7.png — errors 0 — greybox false — sfx silence
39 escape-9 — "" — main/escape-win__tamagoyaki/39-escape-9.png — errors 0 — greybox false — sfx silence
40 escape-11 — "" — main/escape-win__tamagoyaki/40-escape-11.png — errors 0 — greybox false — sfx silence
41 escape-12 — "Minutes gone. A clock upstairs chimed. You lost count." — main/escape-win__tamagoyaki/41-escape-12.png — errors 0 — greybox false — sfx bell
42 escape-13 — "A heavy door. Behind it, stairs to the street. [Wait for her | Leave her house]" — main/escape-win__tamagoyaki/42-escape-13.png — errors 0 — greybox false — sfx rain
43 escape-win-0 — "She's waiting at the outside door." — main/escape-win__tamagoyaki/43-escape-win-0.png — errors 0 — greybox false — sfx rain
44 escape-win-1 — "You took the long way." — main/escape-win__tamagoyaki/44-escape-win-1.png — errors 0 — greybox false — sfx thump
45 escape-win-2 — "Home is warm, and sweet." — main/escape-win__tamagoyaki/45-escape-win-2.png — errors 0 — greybox false — sfx thump
46 escape-win-3 — "Sleep now. You're mine to keep." — main/escape-win__tamagoyaki/46-escape-win-3.png — errors 0 — greybox false — sfx breath
47 escape-win-4 — "" — main/escape-win__tamagoyaki/47-escape-win-4.png — errors 0 — greybox false — sfx drone
48 escape-win-5 — "Mine." — main/escape-win__tamagoyaki/48-escape-win-5.png — errors 0 — greybox false — sfx silence
49 escape-win-6 — "ESCAPE. [Back to start]" — main/escape-win__tamagoyaki/49-escape-win-6.png — errors 0 — greybox false — sfx static
50 back-to-rooftop:0 — "" — main/escape-win__tamagoyaki/50-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### main / escape-timeout__tamagoyaki

00 rooftop-0 — "" — main/escape-timeout__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/escape-timeout__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — main/escape-timeout__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — main/escape-timeout__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — main/escape-timeout__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/escape-timeout__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/escape-timeout__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/escape-timeout__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — main/escape-timeout__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/escape-timeout__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/escape-timeout__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/escape-timeout__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/escape-timeout__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/escape-timeout__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — main/escape-timeout__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — main/escape-timeout__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — main/escape-timeout__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — main/escape-timeout__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — main/escape-timeout__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — main/escape-timeout__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx static
20 blackout-9 — "" — main/escape-timeout__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/escape-timeout__tamagoyaki/21-door-0.png — errors 0 — greybox false — sfx rain
22 door-1 — "Come in? Just for tea." — main/escape-timeout__tamagoyaki/22-door-1.png — errors 0 — greybox false — sfx tick
23 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/escape-timeout__tamagoyaki/23-door-2.png — errors 0 — greybox false — sfx kettle
24 cup-0 — "I made tamagoyaki. For no reason. Eat." — main/escape-timeout__tamagoyaki/24-cup-0.png — errors 0 — greybox false — sfx kettle
25 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — main/escape-timeout__tamagoyaki/25-cup-1.png — errors 0 — greybox false — sfx thump
26 cup-2 — "Who's the third cup for?" — main/escape-timeout__tamagoyaki/26-cup-2.png — errors 0 — greybox false — sfx tick
27 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — main/escape-timeout__tamagoyaki/27-cup-3.png — errors 0 — greybox false — sfx breath
28 unknown-0 — "You stand. The floor tilts a little." — main/escape-timeout__tamagoyaki/28-unknown-0.png — errors 0 — greybox false — sfx thump
29 unknown-1 — "Under the table: a floor hatch. Too big for storage. [Open the hatch]" — main/escape-timeout__tamagoyaki/29-unknown-1.png — errors 0 — greybox false — sfx tick
30 unknown-2 — "A steep wooden ladder. Down into the dark. [Climb down]" — main/escape-timeout__tamagoyaki/30-unknown-2.png — errors 0 — greybox false — sfx drone
31 escape-0 — "Concrete. One bulb. Rain at a high window. [Look at the shelves]" — main/escape-timeout__tamagoyaki/31-escape-0.png — errors 0 — greybox false — sfx drone
32 escape-1 — "Jars on the shelves. Each one: a date, a name." — main/escape-timeout__tamagoyaki/32-escape-1.png — errors 0 — greybox false — sfx thump
33 escape-2 — "The dates go back years. The names are all different." — main/escape-timeout__tamagoyaki/33-escape-2.png — errors 0 — greybox false — sfx thump
34 escape-3 — "Bento boxes, one per day. Your name on each. Untouched." — main/escape-timeout__tamagoyaki/34-escape-3.png — errors 0 — greybox false — sfx tick
35 escape-4 — "The oldest is dated before you met." — main/escape-timeout__tamagoyaki/35-escape-4.png — errors 0 — greybox false — sfx tick
36 escape-5 — "A mortar and a mallet. One fresh mochi. Hers only. [Keep looking]" — main/escape-timeout__tamagoyaki/36-escape-5.png — errors 0 — greybox false — sfx tick
37 escape-6 — "Newest jar: today, your name, tamagoyaki. Lid off. Empty." — main/escape-timeout__tamagoyaki/37-escape-6.png — errors 0 — greybox false — sfx thump
38 escape-7 — "" — main/escape-timeout__tamagoyaki/38-escape-7.png — errors 0 — greybox false — sfx silence
39 escape-9 — "" — main/escape-timeout__tamagoyaki/39-escape-9.png — errors 0 — greybox false — sfx silence
40 escape-11 — "" — main/escape-timeout__tamagoyaki/40-escape-11.png — errors 0 — greybox false — sfx silence
41 escape-12 — "Minutes gone. A clock upstairs chimed. You lost count." — main/escape-timeout__tamagoyaki/41-escape-12.png — errors 0 — greybox false — sfx bell
42 escape-13 — "A heavy door. Behind it, stairs to the street. [Wait for her | Leave her house]" — main/escape-timeout__tamagoyaki/42-escape-13.png — errors 0 — greybox false — sfx rain
43 escape-timeout-0 — "The ladder creaks. She's coming down." — main/escape-timeout__tamagoyaki/43-escape-timeout-0.png — errors 0 — greybox false — sfx thump
44 escape-timeout-1 — "You wake at the tea table. Four cups now." — main/escape-timeout__tamagoyaki/44-escape-timeout-1.png — errors 0 — greybox false — sfx kettle
45 escape-timeout-2 — "You wake at the tea table. Four cups now." — main/escape-timeout__tamagoyaki/45-escape-timeout-2.png — errors 0 — greybox false — sfx kettle
46 escape-timeout-3 — "She holds out the tamagoyaki. You eat." — main/escape-timeout__tamagoyaki/46-escape-timeout-3.png — errors 0 — greybox false — sfx thump
47 escape-timeout-4 — "甘い？…ね。" — main/escape-timeout__tamagoyaki/47-escape-timeout-4.png — errors 0 — greybox false — sfx thump
48 escape-timeout-5 — "One sweet bite…" — main/escape-timeout__tamagoyaki/48-escape-timeout-5.png — errors 0 — greybox false — sfx thump
49 escape-timeout-6 — "…then sleep. You're mine to keep." — main/escape-timeout__tamagoyaki/49-escape-timeout-6.png — errors 0 — greybox false — sfx breath
50 escape-timeout-7 — "ESCAPE? [Back to start]" — main/escape-timeout__tamagoyaki/50-escape-timeout-7.png — errors 0 — greybox false — sfx static
51 back-to-rooftop:0 — "" — main/escape-timeout__tamagoyaki/51-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### main / leave-fu__tamagoyaki

00 rooftop-0 — "" — main/leave-fu__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/leave-fu__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — main/leave-fu__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — main/leave-fu__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — main/leave-fu__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/leave-fu__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/leave-fu__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/leave-fu__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — main/leave-fu__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/leave-fu__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/leave-fu__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/leave-fu__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/leave-fu__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/leave-fu__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — main/leave-fu__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — main/leave-fu__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — main/leave-fu__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — main/leave-fu__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — main/leave-fu__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — main/leave-fu__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx static
20 blackout-9 — "" — main/leave-fu__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/leave-fu__tamagoyaki/21-door-0.png — errors 0 — greybox false — sfx rain
22 door-1 — "Come in? Just for tea." — main/leave-fu__tamagoyaki/22-door-1.png — errors 0 — greybox false — sfx tick
23 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/leave-fu__tamagoyaki/23-door-2.png — errors 0 — greybox false — sfx kettle
24 leave-0 — "Leaving is not an option." — main/leave-fu__tamagoyaki/24-leave-0.png — errors 0 — greybox false — sfx thump
25 leave-1 — "XOR Coffee. 7:00 AM." — main/leave-fu__tamagoyaki/25-leave-1.png — errors 0 — greybox false — sfx static
26 leave-2 — "He wakes at 7:00." — main/leave-fu__tamagoyaki/26-leave-2.png — errors 0 — greybox false — sfx tick
27 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — main/leave-fu__tamagoyaki/27-leave-3.png — errors 0 — greybox false — sfx breath
28 leave-fu-0 — "Her hand rises. Time freezes. The café turns." — main/leave-fu__tamagoyaki/28-leave-fu-0.png — errors 0 — greybox false — sfx silence
29 leave-fu-1 — "You said leave. I heard 'lea—'." — main/leave-fu__tamagoyaki/29-leave-fu-1.png — errors 0 — greybox false — sfx breath
30 leave-fu-2 — "fORever and ever" — main/leave-fu__tamagoyaki/30-leave-fu-2.png — errors 0 — greybox false — sfx drone
31 leave-fu-3 — "fORever and ever and ever" — main/leave-fu__tamagoyaki/31-leave-fu-3.png — errors 0 — greybox false — sfx drone
32 leave-fu-4 — "LEAVE. [Back to start]" — main/leave-fu__tamagoyaki/32-leave-fu-4.png — errors 0 — greybox false — sfx static
33 back-to-rooftop:0 — "" — main/leave-fu__tamagoyaki/33-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### main / leave-yeah__tamagoyaki

00 rooftop-0 — "" — main/leave-yeah__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/leave-yeah__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — main/leave-yeah__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — main/leave-yeah__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — main/leave-yeah__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/leave-yeah__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/leave-yeah__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/leave-yeah__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — main/leave-yeah__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/leave-yeah__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/leave-yeah__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/leave-yeah__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/leave-yeah__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/leave-yeah__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — main/leave-yeah__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — main/leave-yeah__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — main/leave-yeah__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — main/leave-yeah__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — main/leave-yeah__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — main/leave-yeah__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — main/leave-yeah__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/leave-yeah__tamagoyaki/21-door-0.png — errors 0 — greybox false — sfx rain
22 door-1 — "Come in? Just for tea." — main/leave-yeah__tamagoyaki/22-door-1.png — errors 0 — greybox false — sfx tick
23 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/leave-yeah__tamagoyaki/23-door-2.png — errors 0 — greybox false — sfx kettle
24 leave-0 — "Leaving is not an option." — main/leave-yeah__tamagoyaki/24-leave-0.png — errors 0 — greybox false — sfx thump
25 leave-1 — "XOR Coffee. 7:00 AM." — main/leave-yeah__tamagoyaki/25-leave-1.png — errors 0 — greybox false — sfx static
26 leave-2 — "He wakes at 7:00." — main/leave-yeah__tamagoyaki/26-leave-2.png — errors 0 — greybox false — sfx tick
27 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — main/leave-yeah__tamagoyaki/27-leave-3.png — errors 0 — greybox false — sfx breath
28 leave-yeah-0 — "Hooray! FORever and ever!" — main/leave-yeah__tamagoyaki/28-leave-yeah-0.png — errors 0 — greybox false — sfx bell
29 leave-yeah-1 — "Good input." — main/leave-yeah__tamagoyaki/29-leave-yeah-1.png — errors 0 — greybox false — sfx breath
30 leave-yeah-2 — "fORever and ever" — main/leave-yeah__tamagoyaki/30-leave-yeah-2.png — errors 0 — greybox false — sfx drone
31 leave-yeah-3 — "fORever and ever and ever" — main/leave-yeah__tamagoyaki/31-leave-yeah-3.png — errors 0 — greybox false — sfx drone
32 leave-yeah-4 — "LEAVE. [Back to start]" — main/leave-yeah__tamagoyaki/32-leave-yeah-4.png — errors 0 — greybox false — sfx static
33 back-to-rooftop:0 — "" — main/leave-yeah__tamagoyaki/33-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### main / leave-fu__umeboshi__rm

00 rooftop-0 — "" — main/leave-fu__umeboshi__rm/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — main/leave-fu__umeboshi__rm/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sour. Hm. You like things that bite?" — main/leave-fu__umeboshi__rm/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sour, ne?" — main/leave-fu__umeboshi__rm/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her anyway." — main/leave-fu__umeboshi__rm/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — main/leave-fu__umeboshi__rm/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — main/leave-fu__umeboshi__rm/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — main/leave-fu__umeboshi__rm/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says すっぱい! SOUR!" — main/leave-fu__umeboshi__rm/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — main/leave-fu__umeboshi__rm/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — main/leave-fu__umeboshi__rm/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — main/leave-fu__umeboshi__rm/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — main/leave-fu__umeboshi__rm/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — main/leave-fu__umeboshi__rm/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-4 — "" — main/leave-fu__umeboshi__rm/14-blackout-4.png — errors 0 — greybox false — sfx breath
15 blackout-6 — "" — main/leave-fu__umeboshi__rm/15-blackout-6.png — errors 0 — greybox false — sfx breath
16 blackout-8 — "" — main/leave-fu__umeboshi__rm/16-blackout-8.png — errors 0 — greybox false — sfx silence
17 blackout-9 — "" — main/leave-fu__umeboshi__rm/17-blackout-9.png — errors 0 — greybox false — sfx static
18 door-0 — "This is me. Unit 12. Obviously you'll remember." — main/leave-fu__umeboshi__rm/18-door-0.png — errors 0 — greybox false — sfx rain
19 door-1 — "Come in? Just for tea." — main/leave-fu__umeboshi__rm/19-door-1.png — errors 0 — greybox false — sfx tick
20 door-2 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — main/leave-fu__umeboshi__rm/20-door-2.png — errors 0 — greybox false — sfx kettle
21 leave-0 — "Leaving is not an option." — main/leave-fu__umeboshi__rm/21-leave-0.png — errors 0 — greybox false — sfx thump
22 leave-1 — "XOR Coffee. 7:00 AM." — main/leave-fu__umeboshi__rm/22-leave-1.png — errors 0 — greybox false — sfx static
23 leave-2 — "He wakes at 7:00." — main/leave-fu__umeboshi__rm/23-leave-2.png — errors 0 — greybox false — sfx tick
24 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — main/leave-fu__umeboshi__rm/24-leave-3.png — errors 0 — greybox false — sfx breath
25 leave-fu-0 — "Her hand rises. Time freezes. The café turns." — main/leave-fu__umeboshi__rm/25-leave-fu-0.png — errors 0 — greybox false — sfx silence
26 leave-fu-1 — "You said leave. I heard 'lea—'." — main/leave-fu__umeboshi__rm/26-leave-fu-1.png — errors 0 — greybox false — sfx breath
27 leave-fu-2 — "fORever and ever" — main/leave-fu__umeboshi__rm/27-leave-fu-2.png — errors 0 — greybox false — sfx drone
28 leave-fu-3 — "fORever and ever and ever" — main/leave-fu__umeboshi__rm/28-leave-fu-3.png — errors 0 — greybox false — sfx drone
29 leave-fu-4 — "LEAVE. [Back to start]" — main/leave-fu__umeboshi__rm/29-leave-fu-4.png — errors 0 — greybox false — sfx static
30 back-to-rooftop:0 — "" — main/leave-fu__umeboshi__rm/30-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / steeped__tamagoyaki

00 rooftop-0 — "" — merge/steeped__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/steeped__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — merge/steeped__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — merge/steeped__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — merge/steeped__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/steeped__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/steeped__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/steeped__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — merge/steeped__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/steeped__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/steeped__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/steeped__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/steeped__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/steeped__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — merge/steeped__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — merge/steeped__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — merge/steeped__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — merge/steeped__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — merge/steeped__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — merge/steeped__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — merge/steeped__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 platform-0 — "Her stop. The rain followed us off the train." — merge/steeped__tamagoyaki/21-platform-0.png — errors 0 — greybox false — sfx rain
22 platform-1 — "The AND Line leaves. Just two of us now." — merge/steeped__tamagoyaki/22-platform-1.png — errors 0 — greybox false — sfx train-hum
23 platform-2 — "this OR that. The sign never picks." — merge/steeped__tamagoyaki/23-platform-2.png — errors 0 — greybox false — sfx breath
24 underpass-0 — "Your steps, her steps. Always an even count." — merge/steeped__tamagoyaki/24-underpass-0.png — errors 0 — greybox false — sfx tick
25 underpass-1 — "Don't read the ads. Read me." — merge/steeped__tamagoyaki/25-underpass-1.png — errors 0 — greybox false — sfx tick
26 apartment-0 — "Four floors. One window lit." — merge/steeped__tamagoyaki/26-apartment-0.png — errors 0 — greybox false — sfx rain
27 apartment-1 — "That's mine. I left the light on for you." — merge/steeped__tamagoyaki/27-apartment-1.png — errors 0 — greybox false — sfx rain
28 door-0 — "" — merge/steeped__tamagoyaki/28-door-0.png — errors 0 — greybox false — sfx tick
29 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/steeped__tamagoyaki/29-door-1.png — errors 0 — greybox false — sfx rain
30 door-2 — "Come in? Just for tea." — merge/steeped__tamagoyaki/30-door-2.png — errors 0 — greybox false — sfx tick
31 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/steeped__tamagoyaki/31-door-3.png — errors 0 — greybox false — sfx kettle
32 genkan-in-0 — "Her shoes. Lined up to the millimetre." — merge/steeped__tamagoyaki/32-genkan-in-0.png — errors 0 — greybox false — sfx thump
33 genkan-in-1 — "Men's slippers. Already set out." — merge/steeped__tamagoyaki/33-genkan-in-1.png — errors 0 — greybox false — sfx thump
34 genkan-in-2 — "A tiny shrine. Inside: a circuit you built." — merge/steeped__tamagoyaki/34-genkan-in-2.png — errors 0 — greybox false — sfx breath
35 cup-0 — "I made tamagoyaki. For no reason. Eat." — merge/steeped__tamagoyaki/35-cup-0.png — errors 0 — greybox false — sfx kettle
36 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — merge/steeped__tamagoyaki/36-cup-1.png — errors 0 — greybox false — sfx thump
37 cup-2 — "Who's the third cup for?" — merge/steeped__tamagoyaki/37-cup-2.png — errors 0 — greybox false — sfx tick
38 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — merge/steeped__tamagoyaki/38-cup-3.png — errors 0 — greybox false — sfx breath
39 steeped-0 — "OR" — merge/steeped__tamagoyaki/39-steeped-0.png — errors 0 — greybox false — sfx breath
40 steeped-1 — "Rest. I'll do the remembering." — merge/steeped__tamagoyaki/40-steeped-1.png — errors 0 — greybox false — sfx silence
41 steeped-2 — "Warm cup, sweet sleep. You're mine to keep." — merge/steeped__tamagoyaki/41-steeped-2.png — errors 0 — greybox false — sfx breath
42 steeped-3 — "ずっと。…FORever. Ne?" — merge/steeped__tamagoyaki/42-steeped-3.png — errors 0 — greybox false — sfx breath
43 steeped-4 — "STEEPED. [Back to start]" — merge/steeped__tamagoyaki/43-steeped-4.png — errors 0 — greybox false — sfx static
44 back-to-rooftop:0 — "" — merge/steeped__tamagoyaki/44-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / escape-win__tamagoyaki

00 rooftop-0 — "" — merge/escape-win__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/escape-win__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — merge/escape-win__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — merge/escape-win__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — merge/escape-win__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/escape-win__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/escape-win__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/escape-win__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — merge/escape-win__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/escape-win__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/escape-win__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/escape-win__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/escape-win__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/escape-win__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — merge/escape-win__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — merge/escape-win__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — merge/escape-win__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — merge/escape-win__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — merge/escape-win__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — merge/escape-win__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — merge/escape-win__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 platform-0 — "Her stop. The rain followed us off the train." — merge/escape-win__tamagoyaki/21-platform-0.png — errors 0 — greybox false — sfx rain
22 platform-1 — "The AND Line leaves. Just two of us now." — merge/escape-win__tamagoyaki/22-platform-1.png — errors 0 — greybox false — sfx train-hum
23 platform-2 — "this OR that. The sign never picks." — merge/escape-win__tamagoyaki/23-platform-2.png — errors 0 — greybox false — sfx breath
24 underpass-0 — "Your steps, her steps. Always an even count." — merge/escape-win__tamagoyaki/24-underpass-0.png — errors 0 — greybox false — sfx tick
25 underpass-1 — "Don't read the ads. Read me." — merge/escape-win__tamagoyaki/25-underpass-1.png — errors 0 — greybox false — sfx tick
26 apartment-0 — "Four floors. One window lit." — merge/escape-win__tamagoyaki/26-apartment-0.png — errors 0 — greybox false — sfx rain
27 apartment-1 — "That's mine. I left the light on for you." — merge/escape-win__tamagoyaki/27-apartment-1.png — errors 0 — greybox false — sfx rain
28 door-0 — "" — merge/escape-win__tamagoyaki/28-door-0.png — errors 0 — greybox false — sfx tick
29 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/escape-win__tamagoyaki/29-door-1.png — errors 0 — greybox false — sfx rain
30 door-2 — "Come in? Just for tea." — merge/escape-win__tamagoyaki/30-door-2.png — errors 0 — greybox false — sfx tick
31 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/escape-win__tamagoyaki/31-door-3.png — errors 0 — greybox false — sfx kettle
32 genkan-in-0 — "Her shoes. Lined up to the millimetre." — merge/escape-win__tamagoyaki/32-genkan-in-0.png — errors 0 — greybox false — sfx thump
33 genkan-in-1 — "Men's slippers. Already set out." — merge/escape-win__tamagoyaki/33-genkan-in-1.png — errors 0 — greybox false — sfx thump
34 genkan-in-2 — "A tiny shrine. Inside: a circuit you built." — merge/escape-win__tamagoyaki/34-genkan-in-2.png — errors 0 — greybox false — sfx breath
35 cup-0 — "I made tamagoyaki. For no reason. Eat." — merge/escape-win__tamagoyaki/35-cup-0.png — errors 0 — greybox false — sfx kettle
36 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — merge/escape-win__tamagoyaki/36-cup-1.png — errors 0 — greybox false — sfx thump
37 cup-2 — "Who's the third cup for?" — merge/escape-win__tamagoyaki/37-cup-2.png — errors 0 — greybox false — sfx tick
38 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — merge/escape-win__tamagoyaki/38-cup-3.png — errors 0 — greybox false — sfx breath
39 unknown-0 — "You stand. The floor tilts a little." — merge/escape-win__tamagoyaki/39-unknown-0.png — errors 0 — greybox false — sfx thump
40 unknown-1 — "Under the table: a floor hatch. Too big for storage. [Open the hatch]" — merge/escape-win__tamagoyaki/40-unknown-1.png — errors 0 — greybox false — sfx tick
41 unknown-2 — "A steep wooden ladder. Down into the dark. [Climb down]" — merge/escape-win__tamagoyaki/41-unknown-2.png — errors 0 — greybox false — sfx drone
42 escape-0 — "Concrete. One bulb. Rain at a high window. [Look at the shelves]" — merge/escape-win__tamagoyaki/42-escape-0.png — errors 0 — greybox false — sfx drone
43 escape-1 — "Jars on the shelves. Each one: a date, a name." — merge/escape-win__tamagoyaki/43-escape-1.png — errors 0 — greybox false — sfx thump
44 escape-2 — "The dates go back years. The names are all different." — merge/escape-win__tamagoyaki/44-escape-2.png — errors 0 — greybox false — sfx thump
45 escape-3 — "Bento boxes, one per day. Your name on each. Untouched." — merge/escape-win__tamagoyaki/45-escape-3.png — errors 0 — greybox false — sfx tick
46 escape-4 — "The oldest is dated before you met." — merge/escape-win__tamagoyaki/46-escape-4.png — errors 0 — greybox false — sfx tick
47 escape-5 — "A mortar and a mallet. One fresh mochi. Hers only. [Keep looking]" — merge/escape-win__tamagoyaki/47-escape-5.png — errors 0 — greybox false — sfx tick
48 escape-6 — "Newest jar: today, your name, tamagoyaki. Lid off. Empty." — merge/escape-win__tamagoyaki/48-escape-6.png — errors 0 — greybox false — sfx thump
49 escape-7 — "" — merge/escape-win__tamagoyaki/49-escape-7.png — errors 0 — greybox false — sfx silence
50 escape-9 — "" — merge/escape-win__tamagoyaki/50-escape-9.png — errors 0 — greybox false — sfx silence
51 escape-11 — "" — merge/escape-win__tamagoyaki/51-escape-11.png — errors 0 — greybox false — sfx silence
52 escape-12 — "Minutes gone. A clock upstairs chimed. You lost count." — merge/escape-win__tamagoyaki/52-escape-12.png — errors 0 — greybox false — sfx bell
53 escape-13 — "A heavy door. Behind it, stairs to the street. [Wait for her | Leave her house]" — merge/escape-win__tamagoyaki/53-escape-13.png — errors 0 — greybox false — sfx rain
54 escape-win-0 — "She's waiting at the outside door." — merge/escape-win__tamagoyaki/54-escape-win-0.png — errors 0 — greybox false — sfx rain
55 escape-win-1 — "You took the long way." — merge/escape-win__tamagoyaki/55-escape-win-1.png — errors 0 — greybox false — sfx thump
56 escape-win-2 — "Home is warm, and sweet." — merge/escape-win__tamagoyaki/56-escape-win-2.png — errors 0 — greybox false — sfx thump
57 escape-win-3 — "Sleep now. You're mine to keep." — merge/escape-win__tamagoyaki/57-escape-win-3.png — errors 0 — greybox false — sfx breath
58 escape-win-4 — "" — merge/escape-win__tamagoyaki/58-escape-win-4.png — errors 0 — greybox false — sfx drone
59 escape-win-5 — "Mine." — merge/escape-win__tamagoyaki/59-escape-win-5.png — errors 0 — greybox false — sfx silence
60 escape-win-6 — "ESCAPE. [Back to start]" — merge/escape-win__tamagoyaki/60-escape-win-6.png — errors 0 — greybox false — sfx static
61 back-to-rooftop:0 — "" — merge/escape-win__tamagoyaki/61-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / escape-timeout__tamagoyaki

00 rooftop-0 — "" — merge/escape-timeout__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/escape-timeout__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — merge/escape-timeout__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — merge/escape-timeout__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — merge/escape-timeout__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/escape-timeout__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/escape-timeout__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/escape-timeout__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — merge/escape-timeout__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/escape-timeout__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/escape-timeout__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/escape-timeout__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/escape-timeout__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/escape-timeout__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — merge/escape-timeout__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — merge/escape-timeout__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — merge/escape-timeout__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — merge/escape-timeout__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — merge/escape-timeout__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — merge/escape-timeout__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — merge/escape-timeout__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 platform-0 — "Her stop. The rain followed us off the train." — merge/escape-timeout__tamagoyaki/21-platform-0.png — errors 0 — greybox false — sfx rain
22 platform-1 — "The AND Line leaves. Just two of us now." — merge/escape-timeout__tamagoyaki/22-platform-1.png — errors 0 — greybox false — sfx train-hum
23 platform-2 — "this OR that. The sign never picks." — merge/escape-timeout__tamagoyaki/23-platform-2.png — errors 0 — greybox false — sfx breath
24 underpass-0 — "Your steps, her steps. Always an even count." — merge/escape-timeout__tamagoyaki/24-underpass-0.png — errors 0 — greybox false — sfx tick
25 underpass-1 — "Don't read the ads. Read me." — merge/escape-timeout__tamagoyaki/25-underpass-1.png — errors 0 — greybox false — sfx tick
26 apartment-0 — "Four floors. One window lit." — merge/escape-timeout__tamagoyaki/26-apartment-0.png — errors 0 — greybox false — sfx rain
27 apartment-1 — "That's mine. I left the light on for you." — merge/escape-timeout__tamagoyaki/27-apartment-1.png — errors 0 — greybox false — sfx rain
28 door-0 — "" — merge/escape-timeout__tamagoyaki/28-door-0.png — errors 0 — greybox false — sfx tick
29 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/escape-timeout__tamagoyaki/29-door-1.png — errors 0 — greybox false — sfx rain
30 door-2 — "Come in? Just for tea." — merge/escape-timeout__tamagoyaki/30-door-2.png — errors 0 — greybox false — sfx tick
31 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/escape-timeout__tamagoyaki/31-door-3.png — errors 0 — greybox false — sfx kettle
32 genkan-in-0 — "Her shoes. Lined up to the millimetre." — merge/escape-timeout__tamagoyaki/32-genkan-in-0.png — errors 0 — greybox false — sfx thump
33 genkan-in-1 — "Men's slippers. Already set out." — merge/escape-timeout__tamagoyaki/33-genkan-in-1.png — errors 0 — greybox false — sfx thump
34 genkan-in-2 — "A tiny shrine. Inside: a circuit you built." — merge/escape-timeout__tamagoyaki/34-genkan-in-2.png — errors 0 — greybox false — sfx breath
35 cup-0 — "I made tamagoyaki. For no reason. Eat." — merge/escape-timeout__tamagoyaki/35-cup-0.png — errors 0 — greybox false — sfx kettle
36 cup-1 — "Third teacup. Nobody poured it. Tamagoyaki on its saucer." — merge/escape-timeout__tamagoyaki/36-cup-1.png — errors 0 — greybox false — sfx thump
37 cup-2 — "Who's the third cup for?" — merge/escape-timeout__tamagoyaki/37-cup-2.png — errors 0 — greybox false — sfx tick
38 cup-3 — "For Input B. Silly. It's always three of us. [Drink | Stand up]" — merge/escape-timeout__tamagoyaki/38-cup-3.png — errors 0 — greybox false — sfx breath
39 unknown-0 — "You stand. The floor tilts a little." — merge/escape-timeout__tamagoyaki/39-unknown-0.png — errors 0 — greybox false — sfx thump
40 unknown-1 — "Under the table: a floor hatch. Too big for storage. [Open the hatch]" — merge/escape-timeout__tamagoyaki/40-unknown-1.png — errors 0 — greybox false — sfx tick
41 unknown-2 — "A steep wooden ladder. Down into the dark. [Climb down]" — merge/escape-timeout__tamagoyaki/41-unknown-2.png — errors 0 — greybox false — sfx drone
42 escape-0 — "Concrete. One bulb. Rain at a high window. [Look at the shelves]" — merge/escape-timeout__tamagoyaki/42-escape-0.png — errors 0 — greybox false — sfx drone
43 escape-1 — "Jars on the shelves. Each one: a date, a name." — merge/escape-timeout__tamagoyaki/43-escape-1.png — errors 0 — greybox false — sfx thump
44 escape-2 — "The dates go back years. The names are all different." — merge/escape-timeout__tamagoyaki/44-escape-2.png — errors 0 — greybox false — sfx thump
45 escape-3 — "Bento boxes, one per day. Your name on each. Untouched." — merge/escape-timeout__tamagoyaki/45-escape-3.png — errors 0 — greybox false — sfx tick
46 escape-4 — "The oldest is dated before you met." — merge/escape-timeout__tamagoyaki/46-escape-4.png — errors 0 — greybox false — sfx tick
47 escape-5 — "A mortar and a mallet. One fresh mochi. Hers only. [Keep looking]" — merge/escape-timeout__tamagoyaki/47-escape-5.png — errors 0 — greybox false — sfx tick
48 escape-6 — "Newest jar: today, your name, tamagoyaki. Lid off. Empty." — merge/escape-timeout__tamagoyaki/48-escape-6.png — errors 0 — greybox false — sfx thump
49 escape-7 — "" — merge/escape-timeout__tamagoyaki/49-escape-7.png — errors 0 — greybox false — sfx silence
50 escape-9 — "" — merge/escape-timeout__tamagoyaki/50-escape-9.png — errors 0 — greybox false — sfx silence
51 escape-11 — "" — merge/escape-timeout__tamagoyaki/51-escape-11.png — errors 0 — greybox false — sfx silence
52 escape-12 — "Minutes gone. A clock upstairs chimed. You lost count." — merge/escape-timeout__tamagoyaki/52-escape-12.png — errors 0 — greybox false — sfx bell
53 escape-13 — "A heavy door. Behind it, stairs to the street. [Wait for her | Leave her house]" — merge/escape-timeout__tamagoyaki/53-escape-13.png — errors 0 — greybox false — sfx rain
54 escape-timeout-0 — "The ladder creaks. She's coming down." — merge/escape-timeout__tamagoyaki/54-escape-timeout-0.png — errors 0 — greybox false — sfx thump
55 escape-timeout-1 — "" — merge/escape-timeout__tamagoyaki/55-escape-timeout-1.png — errors 0 — greybox false — sfx drone
56 escape-timeout-2 — "You wake at the tea table. Four cups now." — merge/escape-timeout__tamagoyaki/56-escape-timeout-2.png — errors 0 — greybox false — sfx kettle
57 escape-timeout-3 — "She holds out the tamagoyaki. You eat." — merge/escape-timeout__tamagoyaki/57-escape-timeout-3.png — errors 0 — greybox false — sfx thump
58 escape-timeout-4 — "甘い？…ね。" — merge/escape-timeout__tamagoyaki/58-escape-timeout-4.png — errors 0 — greybox false — sfx thump
59 escape-timeout-5 — "One sweet bite…" — merge/escape-timeout__tamagoyaki/59-escape-timeout-5.png — errors 0 — greybox false — sfx thump
60 escape-timeout-6 — "…then sleep. You're mine to keep." — merge/escape-timeout__tamagoyaki/60-escape-timeout-6.png — errors 0 — greybox false — sfx breath
61 escape-timeout-7 — "ESCAPE? [Back to start]" — merge/escape-timeout__tamagoyaki/61-escape-timeout-7.png — errors 0 — greybox false — sfx static
62 back-to-rooftop:0 — "" — merge/escape-timeout__tamagoyaki/62-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / leave-fu__tamagoyaki

00 rooftop-0 — "" — merge/leave-fu__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/leave-fu__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — merge/leave-fu__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — merge/leave-fu__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — merge/leave-fu__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/leave-fu__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/leave-fu__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/leave-fu__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — merge/leave-fu__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/leave-fu__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/leave-fu__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/leave-fu__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/leave-fu__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/leave-fu__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — merge/leave-fu__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — merge/leave-fu__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — merge/leave-fu__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — merge/leave-fu__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — merge/leave-fu__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — merge/leave-fu__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx silence
20 blackout-9 — "" — merge/leave-fu__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 platform-0 — "Her stop. The rain followed us off the train." — merge/leave-fu__tamagoyaki/21-platform-0.png — errors 0 — greybox false — sfx rain
22 platform-1 — "The AND Line leaves. Just two of us now." — merge/leave-fu__tamagoyaki/22-platform-1.png — errors 0 — greybox false — sfx train-hum
23 platform-2 — "this OR that. The sign never picks." — merge/leave-fu__tamagoyaki/23-platform-2.png — errors 0 — greybox false — sfx breath
24 underpass-0 — "Your steps, her steps. Always an even count." — merge/leave-fu__tamagoyaki/24-underpass-0.png — errors 0 — greybox false — sfx tick
25 underpass-1 — "Don't read the ads. Read me." — merge/leave-fu__tamagoyaki/25-underpass-1.png — errors 0 — greybox false — sfx tick
26 apartment-0 — "Four floors. One window lit." — merge/leave-fu__tamagoyaki/26-apartment-0.png — errors 0 — greybox false — sfx rain
27 apartment-1 — "That's mine. I left the light on for you." — merge/leave-fu__tamagoyaki/27-apartment-1.png — errors 0 — greybox false — sfx rain
28 door-0 — "" — merge/leave-fu__tamagoyaki/28-door-0.png — errors 0 — greybox false — sfx tick
29 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/leave-fu__tamagoyaki/29-door-1.png — errors 0 — greybox false — sfx rain
30 door-2 — "Come in? Just for tea." — merge/leave-fu__tamagoyaki/30-door-2.png — errors 0 — greybox false — sfx tick
31 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/leave-fu__tamagoyaki/31-door-3.png — errors 0 — greybox false — sfx kettle
32 leave-0 — "Leaving is not an option." — merge/leave-fu__tamagoyaki/32-leave-0.png — errors 0 — greybox false — sfx thump
33 leave-1 — "XOR Coffee. 7:00 AM." — merge/leave-fu__tamagoyaki/33-leave-1.png — errors 0 — greybox false — sfx static
34 leave-2 — "He wakes at 7:00." — merge/leave-fu__tamagoyaki/34-leave-2.png — errors 0 — greybox false — sfx tick
35 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — merge/leave-fu__tamagoyaki/35-leave-3.png — errors 0 — greybox false — sfx breath
36 leave-fu-0 — "Her hand rises. Time freezes. The café turns." — merge/leave-fu__tamagoyaki/36-leave-fu-0.png — errors 0 — greybox false — sfx silence
37 leave-fu-1 — "You said leave. I heard 'lea—'." — merge/leave-fu__tamagoyaki/37-leave-fu-1.png — errors 0 — greybox false — sfx breath
38 leave-fu-2 — "fORever and ever" — merge/leave-fu__tamagoyaki/38-leave-fu-2.png — errors 0 — greybox false — sfx drone
39 leave-fu-3 — "fORever and ever and ever" — merge/leave-fu__tamagoyaki/39-leave-fu-3.png — errors 0 — greybox false — sfx drone
40 leave-fu-4 — "LEAVE. [Back to start]" — merge/leave-fu__tamagoyaki/40-leave-fu-4.png — errors 0 — greybox false — sfx static
41 back-to-rooftop:0 — "" — merge/leave-fu__tamagoyaki/41-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / leave-yeah__tamagoyaki

00 rooftop-0 — "" — merge/leave-yeah__tamagoyaki/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/leave-yeah__tamagoyaki/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sweet. Like me. Good input." — merge/leave-yeah__tamagoyaki/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sweet, ne? I rolled it myself." — merge/leave-yeah__tamagoyaki/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her. It's easy." — merge/leave-yeah__tamagoyaki/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/leave-yeah__tamagoyaki/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/leave-yeah__tamagoyaki/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/leave-yeah__tamagoyaki/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says 甘い! SWEET!" — merge/leave-yeah__tamagoyaki/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/leave-yeah__tamagoyaki/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/leave-yeah__tamagoyaki/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/leave-yeah__tamagoyaki/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/leave-yeah__tamagoyaki/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/leave-yeah__tamagoyaki/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-3 — "" — merge/leave-yeah__tamagoyaki/14-blackout-3.png — errors 0 — greybox false — sfx breath
15 blackout-4 — "" — merge/leave-yeah__tamagoyaki/15-blackout-4.png — errors 0 — greybox false — sfx breath
16 blackout-5 — "" — merge/leave-yeah__tamagoyaki/16-blackout-5.png — errors 0 — greybox false — sfx breath
17 blackout-6 — "" — merge/leave-yeah__tamagoyaki/17-blackout-6.png — errors 0 — greybox false — sfx breath
18 blackout-7 — "" — merge/leave-yeah__tamagoyaki/18-blackout-7.png — errors 0 — greybox false — sfx breath
19 blackout-8 — "" — merge/leave-yeah__tamagoyaki/19-blackout-8.png — errors 0 — greybox false — sfx static
20 blackout-9 — "" — merge/leave-yeah__tamagoyaki/20-blackout-9.png — errors 0 — greybox false — sfx static
21 platform-0 — "Her stop. The rain followed us off the train." — merge/leave-yeah__tamagoyaki/21-platform-0.png — errors 0 — greybox false — sfx rain
22 platform-1 — "The AND Line leaves. Just two of us now." — merge/leave-yeah__tamagoyaki/22-platform-1.png — errors 0 — greybox false — sfx train-hum
23 platform-2 — "this OR that. The sign never picks." — merge/leave-yeah__tamagoyaki/23-platform-2.png — errors 0 — greybox false — sfx breath
24 underpass-0 — "Your steps, her steps. Always an even count." — merge/leave-yeah__tamagoyaki/24-underpass-0.png — errors 0 — greybox false — sfx tick
25 underpass-1 — "Don't read the ads. Read me." — merge/leave-yeah__tamagoyaki/25-underpass-1.png — errors 0 — greybox false — sfx tick
26 apartment-0 — "Four floors. One window lit." — merge/leave-yeah__tamagoyaki/26-apartment-0.png — errors 0 — greybox false — sfx rain
27 apartment-1 — "That's mine. I left the light on for you." — merge/leave-yeah__tamagoyaki/27-apartment-1.png — errors 0 — greybox false — sfx rain
28 door-0 — "" — merge/leave-yeah__tamagoyaki/28-door-0.png — errors 0 — greybox false — sfx tick
29 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/leave-yeah__tamagoyaki/29-door-1.png — errors 0 — greybox false — sfx rain
30 door-2 — "Come in? Just for tea." — merge/leave-yeah__tamagoyaki/30-door-2.png — errors 0 — greybox false — sfx tick
31 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/leave-yeah__tamagoyaki/31-door-3.png — errors 0 — greybox false — sfx kettle
32 leave-0 — "Leaving is not an option." — merge/leave-yeah__tamagoyaki/32-leave-0.png — errors 0 — greybox false — sfx thump
33 leave-1 — "XOR Coffee. 7:00 AM." — merge/leave-yeah__tamagoyaki/33-leave-1.png — errors 0 — greybox false — sfx static
34 leave-2 — "He wakes at 7:00." — merge/leave-yeah__tamagoyaki/34-leave-2.png — errors 0 — greybox false — sfx tick
35 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — merge/leave-yeah__tamagoyaki/35-leave-3.png — errors 0 — greybox false — sfx breath
36 leave-yeah-0 — "Hooray! FORever and ever!" — merge/leave-yeah__tamagoyaki/36-leave-yeah-0.png — errors 0 — greybox false — sfx bell
37 leave-yeah-1 — "Good input." — merge/leave-yeah__tamagoyaki/37-leave-yeah-1.png — errors 0 — greybox false — sfx breath
38 leave-yeah-2 — "fORever and ever" — merge/leave-yeah__tamagoyaki/38-leave-yeah-2.png — errors 0 — greybox false — sfx drone
39 leave-yeah-3 — "fORever and ever and ever" — merge/leave-yeah__tamagoyaki/39-leave-yeah-3.png — errors 0 — greybox false — sfx drone
40 leave-yeah-4 — "LEAVE. [Back to start]" — merge/leave-yeah__tamagoyaki/40-leave-yeah-4.png — errors 0 — greybox false — sfx static
41 back-to-rooftop:0 — "" — merge/leave-yeah__tamagoyaki/41-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

### merge / leave-fu__umeboshi__rm

00 rooftop-0 — "" — merge/leave-fu__umeboshi__rm/00-rooftop-0.png — errors 0 — greybox false — sfx wind
01 rooftop-1 — "Don't look at me like that. It's not for you. [Take the tamagoyaki | Take the umeboshi]" — merge/leave-fu__umeboshi__rm/01-rooftop-1.png — errors 0 — greybox false — sfx tick
02 rooftop-2 — "Sour. Hm. You like things that bite?" — merge/leave-fu__umeboshi__rm/02-rooftop-2.png — errors 0 — greybox false — sfx tick
03 rooftop-3 — "Sour, ne?" — merge/leave-fu__umeboshi__rm/03-rooftop-3.png — errors 0 — greybox false — sfx tick
04 rooftop-4 — "You smile for her anyway." — merge/leave-fu__umeboshi__rm/04-rooftop-4.png — errors 0 — greybox false — sfx tick
05 rooftop-5 — "Technically, rain wasn't f-OR-ecast." — merge/leave-fu__umeboshi__rm/05-rooftop-5.png — errors 0 — greybox false — sfx bell
06 rooftop-6 — "Stay fORever? The rain can wait. [Stay a minute | OR Leave before the rain]" — merge/leave-fu__umeboshi__rm/06-rooftop-6.png — errors 0 — greybox false — sfx breath
07 train-0 — "AND Line, local service. Home in twelve stops." — merge/leave-fu__umeboshi__rm/07-train-0.png — errors 0 — greybox false — sfx train-hum
08 train-1 — "Nobody reads the ads. This one says すっぱい! SOUR!" — merge/leave-fu__umeboshi__rm/08-train-1.png — errors 0 — greybox false — sfx tick
09 naan-0 — "" — merge/leave-fu__umeboshi__rm/09-naan-0.png — errors 0 — greybox false — sfx tick
10 naan-1 — "Technically, that's a NAND gate. Not bread." — merge/leave-fu__umeboshi__rm/10-naan-1.png — errors 0 — greybox false — sfx tick
11 blackout-0 — "" — merge/leave-fu__umeboshi__rm/11-blackout-0.png — errors 0 — greybox false — sfx drone
12 blackout-1 — "" — merge/leave-fu__umeboshi__rm/12-blackout-1.png — errors 0 — greybox false — sfx drone
13 blackout-2 — "" — merge/leave-fu__umeboshi__rm/13-blackout-2.png — errors 0 — greybox false — sfx breath
14 blackout-4 — "" — merge/leave-fu__umeboshi__rm/14-blackout-4.png — errors 0 — greybox false — sfx breath
15 blackout-6 — "" — merge/leave-fu__umeboshi__rm/15-blackout-6.png — errors 0 — greybox false — sfx breath
16 blackout-8 — "" — merge/leave-fu__umeboshi__rm/16-blackout-8.png — errors 0 — greybox false — sfx silence
17 blackout-9 — "" — merge/leave-fu__umeboshi__rm/17-blackout-9.png — errors 0 — greybox false — sfx static
18 platform-0 — "Her stop. The rain followed us off the train." — merge/leave-fu__umeboshi__rm/18-platform-0.png — errors 0 — greybox false — sfx rain
19 platform-1 — "The AND Line leaves. Just two of us now." — merge/leave-fu__umeboshi__rm/19-platform-1.png — errors 0 — greybox false — sfx train-hum
20 platform-2 — "this OR that. The sign never picks." — merge/leave-fu__umeboshi__rm/20-platform-2.png — errors 0 — greybox false — sfx breath
21 underpass-0 — "Your steps, her steps. Always an even count." — merge/leave-fu__umeboshi__rm/21-underpass-0.png — errors 0 — greybox false — sfx tick
22 underpass-1 — "Don't read the ads. Read me." — merge/leave-fu__umeboshi__rm/22-underpass-1.png — errors 0 — greybox false — sfx tick
23 apartment-0 — "Four floors. One window lit." — merge/leave-fu__umeboshi__rm/23-apartment-0.png — errors 0 — greybox false — sfx rain
24 apartment-1 — "That's mine. I left the light on for you." — merge/leave-fu__umeboshi__rm/24-apartment-1.png — errors 0 — greybox false — sfx rain
25 door-0 — "" — merge/leave-fu__umeboshi__rm/25-door-0.png — errors 0 — greybox false — sfx tick
26 door-1 — "This is me. Unit 12. Obviously you'll remember." — merge/leave-fu__umeboshi__rm/26-door-1.png — errors 0 — greybox false — sfx rain
27 door-2 — "Come in? Just for tea." — merge/leave-fu__umeboshi__rm/27-door-2.png — errors 0 — greybox false — sfx tick
28 door-3 — "I already boiled the water. This morning. Just in case. [Just one cup | Say goodnight]" — merge/leave-fu__umeboshi__rm/28-door-3.png — errors 0 — greybox false — sfx kettle
29 leave-0 — "Leaving is not an option." — merge/leave-fu__umeboshi__rm/29-leave-0.png — errors 0 — greybox false — sfx thump
30 leave-1 — "XOR Coffee. 7:00 AM." — merge/leave-fu__umeboshi__rm/30-leave-1.png — errors 0 — greybox false — sfx static
31 leave-2 — "He wakes at 7:00." — merge/leave-fu__umeboshi__rm/31-leave-2.png — errors 0 — greybox false — sfx tick
32 leave-3 — "From now on… can we be fORever? [uhmmm yeah ig | FUCK YOU. I'm leaving]" — merge/leave-fu__umeboshi__rm/32-leave-3.png — errors 0 — greybox false — sfx breath
33 leave-fu-0 — "Her hand rises. Time freezes. The café turns." — merge/leave-fu__umeboshi__rm/33-leave-fu-0.png — errors 0 — greybox false — sfx silence
34 leave-fu-1 — "You said leave. I heard 'lea—'." — merge/leave-fu__umeboshi__rm/34-leave-fu-1.png — errors 0 — greybox false — sfx breath
35 leave-fu-2 — "fORever and ever" — merge/leave-fu__umeboshi__rm/35-leave-fu-2.png — errors 0 — greybox false — sfx drone
36 leave-fu-3 — "fORever and ever and ever" — merge/leave-fu__umeboshi__rm/36-leave-fu-3.png — errors 0 — greybox false — sfx drone
37 leave-fu-4 — "LEAVE. [Back to start]" — merge/leave-fu__umeboshi__rm/37-leave-fu-4.png — errors 0 — greybox false — sfx static
38 back-to-rooftop:0 — "" — merge/leave-fu__umeboshi__rm/38-back-to-rooftop-0.png — errors 0 — greybox false — sfx wind

## Scene order seen (steeped run)

- main: rooftop > train > naan > blackout > door > cup > steeped
- merge: rooftop > train > naan > blackout > platform > underpass > apartment > door > genkan-in > cup > steeped
