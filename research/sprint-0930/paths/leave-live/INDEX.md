# Leave routes, live play (seed=1, 1920x1080)

Played from a fresh start with real clicks only (no `?scene` jump): `PORT=… node research/sprint-0930/paths/shoot.mjs leave-live/<route>` on a `vite preview` of the build.
The roof routes save every beat. The home routes play the whole day (the same beats as `paths/ume`; each one is in its `log.json` with an empty `nm`) and save PNGs from `v2-home` on.
The wiring: `src/date-beta/packs/leave-route.json`. The audit: `research/sprint-0930/leave/AUDIT.md`.

## LEAVE-ROOF-FU (rooftop "Leave before the rain" -> leave -> "FUCK YOU. I'm leaving" -> leave-fu)

| file | scene | beat | text | choice taken |
|---|---|---|---|---|
| roof-fu/001-rooftop-0-card.png | rooftop | 0 (card) | CARD: GOAL Make Nanda like you. Her LOVE score must reach 10 |  |
| roof-fu/002-rooftop-1.png | rooftop | 1 |  |  |
| roof-fu/003-rooftop-2.png | rooftop | 2 | Her shoes by the fence. Toes pointed at you. |  |
| roof-fu/004-rooftop-3.png | rooftop | 3 | NANDA: I made two. One's for you. Don't look at me like that |  |
| roof-fu/005-rooftop-3-react.png | rooftop | 3 (react) | NANDA: Sour. Brave. I'll remember you like sour. |  |
| roof-fu/006-rooftop-4.png | rooftop | 4 | Close-up. The lid lifts. One red umeboshi on white rice. |  |
| roof-fu/007-rooftop-5.png | rooftop | 5 |  |  |
| roof-fu/008-rooftop-6.png | rooftop | 6 | MC: Itadakimasu. |  |
| roof-fu/009-rooftop-7.png | rooftop | 7 | She doesn't eat hers. She watches you chew. |  |
| roof-fu/010-rooftop-8-choice.png | rooftop | 8 (choice) | NANDA: Sour. Hm. You like things that bite? | ♥ ?? |
| roof-fu/011-rooftop-8-react.png | rooftop | 8 (react) | NANDA: …Obviously. Don't stare. |  |
| roof-fu/012-rooftop-10-react.png | rooftop | 10 (react) | MC: Technically, rain wasn't  |  |
| roof-fu/013-rooftop-11-choice.png | rooftop | 11 (choice) | NANDA: Stay fORever? The rain can wait. | ♡ ??OR Leave before the rain |
| roof-fu/014-rooftop-11-react.png | rooftop | 11 (react) | NANDA: …Fine. The rain can have you. Later. |  |
| roof-fu/015-leave-0.png | leave | 0 | NANDA: Leaving is not an option. |  |
| roof-fu/016-leave-1.png | leave | 1 | XOR Coffee. 7:00 AM. |  |
| roof-fu/017-leave-2-choice.png | leave | 2 (choice) | NANDA: He wakes at 7:00. | ♥ +2Good morning, Nanda |
| roof-fu/018-leave-2-react.png | leave | 2 (react) | NANDA: Good morning! Same as yesterday. Same as always. |  |
| roof-fu/019-leave-3-choice.png | leave | 3 (choice) | NANDA: From now on… can we be fORever? | ♡ ??FUCK YOU. I'm leaving |
| roof-fu/020-leave-3-react.png | leave | 3 (react) | NANDA: Leave, then. I'll be here. I'm always here. |  |
| roof-fu/021-leave-fu-0.png | leave-fu | 0 | Her hand rises. Time freezes. The café turns. |  |
| roof-fu/022-leave-fu-1.png | leave-fu | 1 | NANDA: You said leave. I heard 'lea—'. |  |
| roof-fu/023-leave-fu-2.png | leave-fu | 2 | CROWD: fORever and ever |  |
| roof-fu/024-leave-fu-3.png | leave-fu | 3 | CROWD: fORever and ever and ever |  |
| roof-fu/025-leave-fu-4-end.png | leave-fu | 4 (end) | END: GAME OVER 0% You left a crumb. I noticed. Again? LOVE 0 |  |
| roof-fu/026-END-settled.png | end | (settled) |  |  |

## LEAVE-ROOF-YEAH (rooftop "Leave before the rain" -> leave -> "uhmmm yeah ig" -> leave-yeah)

| file | scene | beat | text | choice taken |
|---|---|---|---|---|
| roof-yeah/001-rooftop-0-card.png | rooftop | 0 (card) | CARD: GOAL Make Nanda like you. Her LOVE score must reach 10 |  |
| roof-yeah/002-rooftop-1.png | rooftop | 1 |  |  |
| roof-yeah/003-rooftop-2.png | rooftop | 2 | Her shoes by the fence. Toes pointed at you. |  |
| roof-yeah/004-rooftop-3.png | rooftop | 3 | NANDA: I made two. One's for you. Don't look at me like that |  |
| roof-yeah/005-rooftop-3-react.png | rooftop | 3 (react) | NANDA: Sour. Brave. I'll remember you like sour. |  |
| roof-yeah/006-rooftop-4.png | rooftop | 4 | Close-up. The lid lifts. One red umeboshi on white rice. |  |
| roof-yeah/007-rooftop-5.png | rooftop | 5 |  |  |
| roof-yeah/008-rooftop-6.png | rooftop | 6 | MC: Itadakimasu. |  |
| roof-yeah/009-rooftop-7.png | rooftop | 7 | She doesn't eat hers. She watches you chew. |  |
| roof-yeah/010-rooftop-8-choice.png | rooftop | 8 (choice) | NANDA: Sour. Hm. You like things that bite? | ♥ ?? |
| roof-yeah/011-rooftop-8-react.png | rooftop | 8 (react) | NANDA: …Obviously. Don't stare. |  |
| roof-yeah/012-rooftop-10-react.png | rooftop | 10 (react) | MC: Technically, rain wasn't  |  |
| roof-yeah/013-rooftop-11-choice.png | rooftop | 11 (choice) | NANDA: Stay fORever? The rain can wait. | ♡ ??OR Leave before the rain |
| roof-yeah/014-rooftop-11-react.png | rooftop | 11 (react) | NANDA: …Fine. The rain can have you. Later. |  |
| roof-yeah/015-leave-0.png | leave | 0 | NANDA: Leaving is not an option. |  |
| roof-yeah/016-leave-1.png | leave | 1 | XOR Coffee. 7:00 AM. |  |
| roof-yeah/017-leave-2-choice.png | leave | 2 (choice) | NANDA: He wakes at 7:00. | ♥ +2Good morning, Nanda |
| roof-yeah/018-leave-2-react.png | leave | 2 (react) | NANDA: Good morning! Same as yesterday. Same as always. |  |
| roof-yeah/019-leave-3-choice.png | leave | 3 (choice) | NANDA: From now on… can we be fORever? | ♥ ??uhmmm yeah ig |
| roof-yeah/020-leave-3-react.png | leave | 3 (react) | NANDA: Yeah? Say it again. I'm keeping it. |  |
| roof-yeah/021-leave-yeah-0.png | leave-yeah | 0 | NANDA: Hooray! FORever and ever! |  |
| roof-yeah/022-leave-yeah-1.png | leave-yeah | 1 | NANDA: Good input. |  |
| roof-yeah/023-leave-yeah-2.png | leave-yeah | 2 | CROWD: fORever and ever |  |
| roof-yeah/024-leave-yeah-3.png | leave-yeah | 3 | CROWD: fORever and ever and ever |  |
| roof-yeah/025-leave-yeah-4.png | leave-yeah | 4 | Wide. The café. Every table has two cups. Every cup has your |  |
| roof-yeah/026-leave-yeah-5-end.png | leave-yeah | 5 (end) | END: GAME OVER 12% You left a crumb. I noticed. Again? LOVE  |  |
| roof-yeah/027-END-settled.png | end | (settled) |  |  |

## LEAVE-HOME-FU (the full day, v2-home "Say goodnight" -> leave -> "FUCK YOU. I'm leaving" -> leave-fu)

(77 earlier beats played, not saved: rooftop → v2-park → v2-shop → v2-town → v2-curry → v2-train → v2-rain → v2-street.)

| file | scene | beat | text | choice taken |
|---|---|---|---|---|
| home-fu/001-v2-home-0.png | v2-home | 0 | Very clean. Her shoes in a perfect line. |  |
| home-fu/002-v2-home-1.png | v2-home | 1 | She kneels. She puts slippers on your feet. Your size. |  |
| home-fu/003-v2-home-2.png | v2-home | 2 | NANDA: Every choice you made today led here. I planned them  |  |
| home-fu/004-v2-home-3.png | v2-home | 3 | HER KITCHEN · 7:10 PM. Three chairs. Three cups. Steam. |  |
| home-fu/005-v2-home-4-choice.png | v2-home | 4 (choice) | Her hand on your back. She sits you in the middle chair. | ♡ ??Say goodnight |
| home-fu/006-v2-home-4-react.png | v2-home | 4 (react) | NANDA: …Goodnight? It is only 7:10. |  |
| home-fu/007-leave-0.png | leave | 0 | NANDA: Leaving is not an option. |  |
| home-fu/008-leave-1.png | leave | 1 | XOR Coffee. 7:00 AM. |  |
| home-fu/009-leave-2-choice.png | leave | 2 (choice) | NANDA: He wakes at 7:00. | ♥ +2Good morning, Nanda |
| home-fu/010-leave-2-react.png | leave | 2 (react) | NANDA: Good morning! Same as yesterday. Same as always. |  |
| home-fu/011-leave-3-choice.png | leave | 3 (choice) | NANDA: From now on… can we be fORever? | ♡ ??FUCK YOU. I'm leaving |
| home-fu/012-leave-3-react.png | leave | 3 (react) | NANDA: Leave, then. I'll be here. I'm always here. |  |
| home-fu/013-leave-fu-0.png | leave-fu | 0 | Her hand rises. Time freezes. The café turns. |  |
| home-fu/014-leave-fu-1.png | leave-fu | 1 | NANDA: You said leave. I heard 'lea—'. |  |
| home-fu/015-leave-fu-2.png | leave-fu | 2 | CROWD: fORever and ever |  |
| home-fu/016-leave-fu-3.png | leave-fu | 3 | CROWD: fORever and ever and ever |  |
| home-fu/017-leave-fu-4-end.png | leave-fu | 4 (end) | END: GAME OVER 64% You left a crumb. I noticed. Again? LOVE  |  |
| home-fu/018-END-settled.png | end | (settled) |  |  |

## LEAVE-HOME-YEAH (the full day, v2-home "Say goodnight" -> leave -> "uhmmm yeah ig" -> leave-yeah)

(77 earlier beats played, not saved: rooftop → v2-park → v2-shop → v2-town → v2-curry → v2-train → v2-rain → v2-street.)

| file | scene | beat | text | choice taken |
|---|---|---|---|---|
| home-yeah/001-v2-home-0.png | v2-home | 0 | Very clean. Her shoes in a perfect line. |  |
| home-yeah/002-v2-home-1.png | v2-home | 1 | She kneels. She puts slippers on your feet. Your size. |  |
| home-yeah/003-v2-home-2.png | v2-home | 2 | NANDA: Every choice you made today led here. I planned them  |  |
| home-yeah/004-v2-home-3.png | v2-home | 3 | HER KITCHEN · 7:10 PM. Three chairs. Three cups. Steam. |  |
| home-yeah/005-v2-home-4-choice.png | v2-home | 4 (choice) | Her hand on your back. She sits you in the middle chair. | ♡ ??Say goodnight |
| home-yeah/006-v2-home-4-react.png | v2-home | 4 (react) | NANDA: …Goodnight? It is only 7:10. |  |
| home-yeah/007-leave-0.png | leave | 0 | NANDA: Leaving is not an option. |  |
| home-yeah/008-leave-1.png | leave | 1 | XOR Coffee. 7:00 AM. |  |
| home-yeah/009-leave-2-choice.png | leave | 2 (choice) | NANDA: He wakes at 7:00. | ♥ +2Good morning, Nanda |
| home-yeah/010-leave-2-react.png | leave | 2 (react) | NANDA: Good morning! Same as yesterday. Same as always. |  |
| home-yeah/011-leave-3-choice.png | leave | 3 (choice) | NANDA: From now on… can we be fORever? | ♥ ??uhmmm yeah ig |
| home-yeah/012-leave-3-react.png | leave | 3 (react) | NANDA: Yeah? Say it again. I'm keeping it. |  |
| home-yeah/013-leave-yeah-0.png | leave-yeah | 0 | NANDA: Hooray! FORever and ever! |  |
| home-yeah/014-leave-yeah-1.png | leave-yeah | 1 | NANDA: Good input. |  |
| home-yeah/015-leave-yeah-2.png | leave-yeah | 2 | CROWD: fORever and ever |  |
| home-yeah/016-leave-yeah-3.png | leave-yeah | 3 | CROWD: fORever and ever and ever |  |
| home-yeah/017-leave-yeah-4.png | leave-yeah | 4 | Wide. The café. Every table has two cups. Every cup has your |  |
| home-yeah/018-leave-yeah-5-end.png | leave-yeah | 5 (end) | END: YOU WIN 100% She loves you. You said yes. She wrote it  |  |
| home-yeah/019-END-settled.png | end | (settled) |  |  |
