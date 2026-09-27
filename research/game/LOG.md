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
