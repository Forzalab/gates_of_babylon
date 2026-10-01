# Recording kit: the 19 reachable Nanda lines with no take (Oct 1)

Source: `GAPS.md` section C (`node scripts/voice-gaps.mjs`). Same voice + settings as `research/sprint-0930/voice/APPENDIX-TAKES.md`
(Nanda, Eleven v3, Stability 0.35-0.45, Similarity 75%, Style 30-40%). Paste the code block as-is. Save as the file named.
After recording: add each to `research/sprint-0930/voice/appendix-manifest.json` ({ n, scene, beat, file, text }), then
`node scripts/voice-gaps.mjs --wire`, `FFMPEG=/usr/bin/ffmpeg python3 scripts/narration/qa.py --fix`, re-time, `npm test`.

Priority = how often a demo run hits it: leave + v2-town first (main routes), then reacts.

| n | scene | beat | file (public/date-beta/voice/...) | paste |
|---|---|---|---|---|
| 404 | leave | 3 R+ | 30-leave/404_3-r.mp3 | `[breathless][happy] Yeah? Say it again. [whispers] I'm keeping it.` |
| 405 | leave | 3 R− | 30-leave/405_3-r.mp3 | `[flatly] Leave, then. [quiet] I'll be here. [sweet] I'm always here.` |
| 406 | v2-town | 1 | 37-v2-town/406_1.mp3 | `[bubbly] We are going out for curry. [smiling] Just you and me.` |
| 407 | v2-town | 2 | 37-v2-town/407_2.mp3 | `[nervous][giggles] So many people. I will hold your arm. [possessive] Tight.` |
| 408 | v2-town | 3 | 37-v2-town/408_3.mp3 | `[excited] Wow! A giant oshi board. [teaching, cute] Oshi means "my favorite."` |
| 409 | v2-town | 4 | 37-v2-town/409_4.mp3 | `[pouty] But not one of them is as cute as me. [sweet] Right?` |
| 410 | v2-curry-katsu | 7 | 05-v2-curry/410_7.mp3 | `[sweet][demanding] Feed me. With your hand. [flat] Not the spoon. [whispers] Your hand.` |
| 411 | v2-shop | 4 R− | 03-v2-shop/411_4-r.mp3 | `[sing-song] You forgot my list. [flatly] Next time I write it on your hand.` |
| 412 | v2-shop | 4 R= | 03-v2-shop/412_4-r.mp3 | `[smiling] Almost perfect. [warm] I still keep you.` |
| 413 | v2-shop | 4 R+ | 03-v2-shop/413_4-r.mp3 | `[proud][happy] Every item, first try. [sweet] You know me.` |
| 414 | v2-home | 4 R | 09-v2-home/414_4-r.mp3 | `[flatly] …Goodnight? [slow] It's only 7:10.` |
| 415 | unknown | 1 R+ | 38-unknown/415_1-r.mp3 | `[from far, curious] Did something creak down there?` |
| 416 | unknown | 1 R= | 38-unknown/416_1-r.mp3 | `[warm] So gentle. [whispers] You were always gentle with my things.` |
| 417 | unknown | 4 R+ | 38-unknown/417_4-r.mp3 | `[amused] Heavy feet. [whispers] I can hear every step.` |
| 418 | unknown | 4 R= | 38-unknown/418_4-r.mp3 | `[sweet] Quiet as a mouse. [flatly] Still heard you.` |
| 419 | escape | 0 R+ | 39-escape/419_0-r.mp3 | `[sharp][quiet] Don't touch the labels.` |
| 420 | escape | 0 R= | 39-escape/420_0-r.mp3 | `[proud] Pretty, right? [sweet] I dust them every day.` |
| 421 | escape | 5 R+ | 39-escape/421_5-r.mp3 | `[flatly] You're looking too long.` |
| 422 | escape | 5 R= | 39-escape/422_5-r.mp3 | `[sweet] Only looking. [whispers] I trust you.` |

The beat labels (R+, R=, R−) follow the manifest convention. Check each against the pick's love sign in the pack before saving.
