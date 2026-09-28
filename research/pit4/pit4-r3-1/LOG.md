# pit4/r3-1 (h1) log
Base origin/pit4/r2-2 (g2, 73). h1 = g2 code paths + `.v-h1` overrides (src/date/h1.css); g2 and f1 render unchanged.
- step 1 (gate): fix 1 WARNING 14.9vh -> cap .128 H @1440, .124 H @1024 (pink rows); modal widened to .575 W so it fits.
  fix 2 modal+sign .689 H @1440. fix 7 compat pill label 13 px floor. K7 on NO THANKS: 3 flees (x in % of its own width,
  stays in the copy column), 4th approach = gives up, parks right, lies down (tilt+squash), label "fine." in the pen's
  Yellowtail. Reduced motion: instant teleport to the far right + "fine." (no transition). Same box height = no reflow.
  Keyboard focus never flees.
- step 2 (next): fixes 3-6 (docked match window, pink agree rows, credits line, HIGH SCORES), TT fits at 16:9. Tests/build/e2e pass; REPORT.
