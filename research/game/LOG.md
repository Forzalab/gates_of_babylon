# pit4/game build log: "UNEXPECTED GATE IN BAGGING AREA"

- 2026-09-27T10:05Z Branch pit4/game from origin/pit3/arbiter. Read JOINT.md (and the B review), both proposals, IMPL.md, and every ref image.
- Decision: arbiter has no Date canvas (date.html = the age gate + a stub). I build a small one at `date.html?canvas=1`
  with the real Shape, sim.evaluate and addGate/addWire reducers. Logic mode (index.html, App.jsx) is not touched,
  so JOINT step 6 (Logic persistence) is dropped, as B review #5 allows.
- Decision (my reading of B review #4): among the identities hit at least 2 times (or else at least once), the RAREST wins.
  Rarity order: clingy, child, notnot, xor, and, or, nand. This stops the impersonator flood.
- Decision: an overflow with at least 1 identity gives "IT'S A MATCH!!" under the header "PLEASE WAIT FOR ASSISTANCE". An overflow
  with 0 merges gives "IT'S NOT A MATCH". I added a FINISH & PAY button so a run can end on your terms (it's a self-checkout).
- Decision: the child identity = x ∨ (x ⊕ x) = x, so both parents appear in one proof circuit.
- 2026-09-27T10:20Z Step 1: src/date/game/rules.js + src/game-rules.test.js. 9 tests: the GLOW set, the traps, the merge table,
  7 proofs via evaluate, a cascade, HURT, priority, swipe/overflow, the ending tie-break, and the payload. Coordinator message: copied
  Kenney sfx (240 KB) and 6 emotes into public/, following assets/SOUND.md.
- 2026-09-27T10:55Z Steps 2-4: Bagging.jsx (grid, drag/drop with a ghost and ●●●○ neighbour strips, swipe, cascade replay with hit-stop),
  FX (floaters, bloom, COMBO slam, gacha identity card with the evaluated circuit and proof, HURT caption, UNEXPECTED ITEM bubble,
  APPROVAL NEEDED freeze, Kenney emotes), HUD (LCD lane, receipt, ENDINGS 7 cards, VN textbox after taxday-vn), match pop-up.
  DateCanvas.jsx (date.html?canvas=1): addGate/addWire reducers (canConnect-checked), sessionStorage gob.game.in / gob.game.out,
  imports the ending + the 2 best merges as bonded groups, or the last HURT pair in red. CircuitView.jsx draws every circuit with the real Shape.
- Coordinator sound rounds 1-3: sfx.js (WebAudio, unlock on first gesture, MUTE in the bar, remembered in localStorage).
  card-slide on pick-up, chip-lay on land, pluck pitched 1+0.08*combo (cap 1.6), chips under floaters, powerUp on combo tiers,
  phaserDown on HURT, sad trombone on the first HURT and on game over only, barcode beep per scored item, card-shuffle as the receipt prints,
  confirmation + SAX jingle on MATCH, NES jingle on NOT A MATCH, one female announcer (ready/go, level_up on a new ending, hurry_up
  near full, new_highscore on 7/7). No Tesco mp3. The Freesound files are credited CC BY-NC in public/sfx/CREDITS.md. The sfx folder is 328 KB
  (target < 300 KB; the trombone WAV is 48 KB even after trimming and 16 kHz mono).
- Playtest fixes: an invalid `background: #color gradient` shorthand (the well was pink-white); a height budget (the board ran under
  the textbox); the identity card covered the COMBO slam, so it now docks over the ENDINGS column; the title became a tab.
- 2026-09-27T11:05Z research/game/play.mjs: a scripted game with real mouse input (canvas -> 9 gates in -> hurt -> 3 hurts = approval ->
  XOR+XOR vanish, the NOT falls onto a NOT = combo x2 -> OR+XOR child -> AND+AND -> FINISH & PAY -> MATCH -> SAY HELLO -> 3 circuits on canvas).
  npm test 140/140, build ok, e2e 101 ok.
