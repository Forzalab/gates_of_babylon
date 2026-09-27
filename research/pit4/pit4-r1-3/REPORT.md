# pit4/r1-3: f3, the Dejting gate as a visual novel
URLs: `date.html?v=f3` (gate), `&next=1` (continue), `&still` / reduced motion (landed still), `&clean=1` (no surprise).

## Fusion (from the rubric's "good of each")
- Base = x3's M3 layout: the portrait card, wide ENTER ANYWAY over narrow NO THANKS, yellow only on 18+, the close ✕, the gate mascot, "…AND A FEW BITS NAUGHTY ♡".
- From y3: the surprise lives INSIDE the modal. From M2: the neon plate straddles the modal top. NO THANKS and ✕ lead to Logic.
- Dropped: the terminal, SO box, and chat panel; the flat tiles; the swash.

## ONE surprise: the DDLC turn, through the office-hours queue (school S3 galge/VN, lens M9)
- AND-chan (AND `Shape` + a face) speaks the legal line in an ADV textbox with a nameplate. Her card has a Tokimeki heart meter, and the buttons are the choice menu.
- At 1.2 s the line retypes: "You're #47 in the office-hours queue, senpai. I'll wait. *I'll ALWAYS wait.* ♡" (the last clause glitches in page blue/pink). The meter becomes a QUEUE #47 ticket, the wink becomes a stare, and NO THANKS tears. Typing is done by ~2.4 s.
- Why M9, not M5: every student knows the office-hours queue. PC LOAD LETTER is an *Office Space* reference.
- C5: page tokens only, Wenrexa chrome, Bangers + Roboto Condensed (≥16 px at 1024), docked to the modal's inner edges, L/R luminance within 5.4%, 0 blocks outside the modal.

## Continue (`&next=1`): the REAL editor in Date tokens
- `App.jsx` gets optional `{start, startView, onWire}` props; Logic uses the defaults.
- Skin: navy ink, pink logic 1, neon "Dejting" on a grid plate in row 01 with j/g hanging past the rule, MATCH MAKER lockup, Raggningstabell, a heart disk → `/`, and a BACK TO THE GATE pill.
- It starts one wire short: AND-chan, then XOR-kun, then the lamp. Wiring gate→gate pops IT'S A MATCH: a Wenrexa card with both real Shapes and the real compat % from `sim.evaluate`.
- The row-03 VN textbox reacts to what you wire. The Logic tour is muted for this mount only (keys restored).

## Sound (Kenney CC0, public/sfx 116 KB, src/date/sfx.js)
tick (typewriter), select (hover), confirmation (ENTER), back (leave), spaceTrash1 (creep), jingles_SAX04 (match, +8% pitch per combo), switch (unmute). WebAudio unlocks on the first gesture. Round Wenrexa mute in the bar and the editor, stored in localStorage. Logic stays silent. The emotes and UI PNGs were not native, so unused.

## Pillow (1440×810, t=3.5 s; measure.py, compare.py, shots/sbs-*.png)
| row | target | f3 | in |
|---|---|---|---|
| top bar | #001b62 ±15 | #001b62 | yes |
| grid bg | #003ec5 ±15 | #003ec5 | yes |
| headline | #f01a88 ±20 | #f11889 | yes |
| WARNING cap/H | .11–.13 | .120 (1024: .090) | yes |
| header/H | .085–.10 | .096 (1024: .089) | yes |
| modal x | .52–.58 W centred | .228–.772 | yes |
| modal y incl. sign | .55–.70 H | .172–.857 (.685) | yes |
| tiles | 4×3 .225W×.24H, gap .015W, ≥.90H | .226W×.245H, .015W, .912 | yes |
| L/R lum | ≤12% | 5.4% | yes |
| errors / h-scroll | 0 / none | 0 / none | yes |

## Remaining deltas
- At 1024×768 the modal is width-bound: height .49H, WARNING .09H.
- The portrait is a gate, not character art, so it doesn't fill the card the way the mockup's girl does.
- Bangers WARNING is wider than the mockup's face.
- The Yellowtail neon has no swash. Its g descender comes ~6 px from WARNING.
- No sparkle glyphs around the modal.

## Bug found in pit3
x-tiles were flat: `hsl(calc(330 + var(--h)*1deg))` mixes a number and an angle, so the whole background was dropped. f3 uses deg units.

## Verification
- `npm test`: 131 pass.
- build ok.
- e2e: all passed.
- shots.mjs: 0 errors, and the match fires from a real drag at 1440 and 1024.
