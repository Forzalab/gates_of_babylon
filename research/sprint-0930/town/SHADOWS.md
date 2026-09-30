# TOWN shadows: the errors and the fixes (v2-town, shots 00-04)

## The light in each ref (what the shadows must follow)

| Shot | Ref | Light | Where the contact shadow goes |
|---|---|---|---|
| town-street | 04 | Clear sky. The sun is behind the camera and to the left, so the upper facades on both sides are lit. The whole street floor is in the buildings' open shade: cool blue paving, and the bollards cast no shadows. | Straight under the feet. Soft, cool, no offset. |
| town-crossing | 05 | Overcast, with a white-grey sky. The crowd has only soft dark pools under their shoes. | Straight under the feet. Soft, no offset. |
| town-board | 07 | Overcast, with a white sky. | Straight under the feet. Soft, no offset. |

None of the three refs has a hard, directional cast shadow at street level.

## Errors found and fixes

1. **Nanda's contact shadow pointed the wrong way (all 3 shots).**
   - Error: the global `.db-plant` is offset down-left and rotated -3°. It was written for the train platform, where the light is upper right. No town ref has that light.
   - Fix: `.stage[data-bg^="town-"] .db-plant` in `src/date-beta/beta.css` has no offset and no rotation. It is centred on her column (x 820 + 280/2 = 960). The stage now carries `data-bg`, set in `main.jsx`.
2. **Nanda's contact shadow was painted over her and over the dialogue box.**
   - Error: `.db-plant` has `z-index: 1`, while the sprite and the box have none. The ellipse therefore drew on top of the box, about 150 px below her visible body, and it read as floating (old shot 02).
   - Fix: in town it is `z-index: auto`, so it paints in DOM order: behind the sprite and behind the box. When her shoes are visible (beat 4, raised), it sits under the shoes. When the box hides her feet, the box hides it too.
3. **The softness did not match.**
   - Error: the contact shadow was a hard-edged flat ellipse at 42% opacity, and her body shadow was a hard `drop-shadow(0 12px 0)` offset straight down. That is two hard shadows under soft light.
   - Fix: in town, the contact shadow is a radial gradient in cool open-shade ink, `rgba(34,38,62)`, fading from .42 to 0. The body shadow is `drop-shadow(0 4px 6px)` in the same ink at .22. The cels use the same kind of shadow (`Cels` in `Town.jsx`: `feDropShadow` dx 0, dy 3, blur 3, same ink). One softness everywhere.
4. **The crowd had no contact shadows (hybrid crossing + board).**
   - Error: the hand-drawn silhouettes in `hand.py` `person()` had no ground shadow at all. They floated on the paving (see the HAND-HYBRID panels in `pure-compare/`).
   - Fix: the live shots are now pure vtrace, so the crowd in town-crossing is the real crowd from ref 05, traced (heads blurred before the trace). Their shadows are the ref's own soft overcast pools, under their shoes and in the ref's light by construction. The hybrid is kept only for comparison and is not changed.
5. **The cel signs had no shadow.**
   - Error: the crisp pun-sign overlays had no shadow and no tint, so they looked pasted on.
   - Fix: each scene's cels get one filter, a tint plus the soft down shadow from fix 3. The tint is a touch cool on the street (open shade) and greyer in the crossing and board shots (overcast). The street's BOOK cel (a lamp pole in front of Nanda) gets the same soft, non-directional shadow.

## Checked in the re-shot frames

- `shots/04-beat4.png` (raised): the shadow sits under both shoes, centred, with soft edges and no offset.
- `shots/01-03` (her feet behind the box): no shadow shows over the box.
- The crowd in `02` stands on its own traced shadows.
