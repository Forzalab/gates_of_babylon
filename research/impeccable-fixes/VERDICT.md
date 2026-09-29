# Arbitrator verdict

## 1. VERDICT

**date-beta: A**
- Findings tie (13 -> 3 for both), so it comes down to genre fit. A's rimmed capsule pills for skip/fullscreen are the VN system-button convention (DDLC, otome). They stay legible over any BG, and the door shot confirms it.
- A reuses the R2b scrim token, so the chrome matches the dread box. B's black 4px-radius rectangles look like debug UI beside the glossy candy pills.
- A's "CHAPTER 1 . SIGNAL" pill and outlined subtitle give the hero a clear hierarchy. B's title card has a wide empty area at right. A's pills are only 16px versus B's 18px, but they carry more contrast and shape.

**logic mode: B**
- `contain: paint` is one declaration with no visual side effect. `clip-path: inset(0)` in A does the same crop but adds a clipping layer that could affect focus rings and tooltips at the frame edge.
- Both scans give 0 findings, so choose the simpler CSS. B's flat black/white, no-ornament approach also fits the Swiss/NYCTA line (Helvetica-style type, one signal colour, rules).
- Caveat from REPORT: pan/zoom at the frame edge is untested for both.

## 2. INFORMED SUGGESTIONS (not binding)
1. Put the NAND gate mark, in the outlined-sticker style, in the empty title-card disc. It reads as a brand seal and sets up the reveal.
2. Give the disc a heart-shaped or NAND-shaped cut-out, so it can later crack or bleed as the horror shifts (yandere tell).
3. Raise the A chrome pills from 16px to 18px, borrowing B's type token, for the back rows of a classroom.
4. Delete the `radial-gradient` at splash.css:15 to clear the last authored flag, so the title scan drops to 2.
5. Add a visible focus ring (2px pink or white offset) to the chrome pills for keyboard use during the presentation.
