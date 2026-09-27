# pit4/r1-1 (f1) log
- 2026-09-27 · read brief, plan, rubric, all refs (3 mockups, 2 XNXX, 2 Wenrexa, neon, pit3 sheet, taxday-vn). Branched pit4/r1-1 off origin/pit3/arbiter.
- · f1 built: x3 layout, Dejting neon plate (j/g hang past rule), Kerney red pen in the portrait column (B+ ring, note, tick in the gutter left of ENTER). Found + fixed: tile blob gradients were invalid CSS (`calc(330 + 1deg)`), so pit3 tiles rendered flat; now warm/noisy.
- · Persona-5 school (Tony): cut-out tilted WARNING with navy hard shadow, slam-in dialog, slash wipe on ENTER/BACK.
- · continue screen: MATCH FEED, 4x3 tube cards with live Pair + compat meter; M2 DMV lens: NOW SERVING / YOUR NUMBER ticket, "please take a number" on match.
- · fixed layout deltas: header max(5u, 8.8vh) (1024 was .066), modal span .716 incl. neon, WARNING cap .117 (de-rotated). &clean=1 keeps the pen's box hidden so nothing reflows (overlap diff 0.0%).
- · Kenney sound (SOUND.md): public/sfx (140 KB, 16 files), src/date/sfx.js, mute button in the site bar (localStorage). glitch on load, drop when the pen lands, confirm+chips on ENTER, error on NO THANKS/close, select pitched up per match on the feed. No emote PNGs: the portrait already has a heart bubble; a Kenney emote would read tacked on. UI pack has no speaker icon, so the mute glyph is inline SVG.
