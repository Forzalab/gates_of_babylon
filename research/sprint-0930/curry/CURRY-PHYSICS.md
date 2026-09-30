# CURRY physics self-critique (r2, after batch 1)

This critique uses the standard in SHOP-PHYSICS-CRITIQUE.md, applied to the curry scene. It checks eight things:
- one 3:00 PM light
- one vanishing point per drawing
- Nanda anchored to a floor or seat, with a shadow
- hands with 5 fingers, attached to an arm
- props touching surfaces
- no art text above y≈140
- the same dish sprite in every shot
- the dialogue box never clipping the focus of a shot

I viewed all 34 beat shots in `shots/` (butter 14, katsu 2 + 12, alone 2 + 4) at 1920x1080. Coordinates are frame px.

Format: severity | shot | problem | fix / status

## HIGH (all fixed in batch 2)
- HIGH | butter-02 (curry-butter-door) | Our NAND HOUSE plate sat at y0-74, fully under the HUD ribbon. So the door had no readable shop name, and the old photo lettering showed through on the sign band. | **FIXED:** the plate now lies on the slanted sign band at y≈180-290, rotated -13° to match the band's slope (one VP with the awning). It also covers the old lettering.
- HIGH | katsu-02 / alone-02 (curry-katsu-door) | The "OR OR カレー" lettering started at y84, so its top was in the HUD band. | **FIXED:** the lettering baseline moved to y292 (cap top ≈ y190). The red plate still covers the old name.
- HIGH | alone-03 (v2-curry-alone 1) | The `close` hate frame drew her full body: her legs and feet hung in mid-air over the counter photo, with no floor and no shadow. | **FIXED:** the beat now uses the `medium` frame with `face: hate`. She is cut at the box like every other two-shot, so no legs float.
- HIGH (r1 → r2) | butter-09/10, katsu feed/bite | In r1 the "Feed me" and "eyes" beats used sprite frames that the box cut through at the mouth. So the feeding and the curry at her mouth could not be seen. | **FIXED in batch 1:** full-frame hand-drawn extreme close-ups. Her mouth, your fingers, the food, and the sauce smear all sit above y≈740.
- HIGH (r1 → r2) | exit beats | The napkin was only told in words over the street picture. | **FIXED in batch 1:** a napkin shot on both paths, and a folded-napkin shot on the not-hungry path.

## MED
- MED | 00/01 curry-choice, the exits (curry-street, alt's art) | Nanda stands in the street with no shadow on the pavement. Her lower half is hidden by the box, so nothing looks wrong, but nothing anchors her either. | Open. curry-street is alt's r3 art, not ours to touch. For curry-choice, a pavement shadow would sit under the box. Leave as is.
- MED | butter-02/03, katsu-02/03 (photo traces) | The vtraced photo shots keep their photo lighting, which is flat daylight with no clear source. They do not show the window-left key that all hand shots use. | Open. A full redraw of 4 photo backgrounds is out of scope for r2. The shared `afternoon` wash keeps their colour temperature matched.
- MED | butter-06 (naan-lift) | Her hand covers most of the ragged torn edge of the naan tip, so the "tear" reads mostly from the piece in her fingers. | Open. Next time: shift the crop 120 px left.
- MED | butter-10 / katsu bite | The upper-lip line is drawn across the far end of the food. At full size it reads as the lips closing on the food, but at thumbnail size it reads as a line across the food. | Open. Draw the lip line only past the food edges.
- MED | butter-11 (lassi) | The LASSI menu card was cut by the box. | **FIXED:** the card moved up 200 px, to y420-570.
- MED | butter-02 | Some faint photo lettering shows left of the new plate (x≈1000-1080, y≈180). | Open (it is behind a blur-like wash).

## LOW
- LOW | katsu-08 (katsu-close) | The roux drip under the dipped piece is hidden by her fingers. | Leave: the roux coat on the piece still reads.
- LOW | katsu-05 (katsu-dish) | The fanned cutlet is long and thin next to the ref (images(183) is fatter). | Leave.
- LOW | feed POV shots | The box covers your cuff and wrist. The fingers and the food stay visible. | Leave (that is the intended framing).
- LOW | thali / counter plate | The two-shot copies of the dish are 0.26-0.34x scale, so their details go to mush. It is still the same sprite. | Leave.

## Checklist (after batch 2)
- **One light:** every hand-drawn shot has the window at the upper left, highlights on the top-left, and cast shadows down-right (+26, +34). ✔
- **One VP:** the cloth weave, counter planks, and floor lines each radiate from one VP per drawing, and every close-up is a crop of its hero. ✔
- **Nanda anchored:** in the two-shots she sits on a booth seat (butter) or a red stool (katsu), and her cast shadow falls to her right. Her full-body frame on the alone path is gone. ✔ (the street: MED above)
- **5-finger hands:** every hand is attached to a wrist, a cuff, and a sleeve off the frame edge. ✔
- **Props touch surfaces:** glasses have contact and cast shadows. Food is held between fingers or lies on the plate. The spoon edge touches the cutlet. The napkin wraps your fingers. ✔
- **No art text above y≈140:** the door plates are fixed. The katsu counter menu text is at y≥205. The hand art has no text. ✔
- **Same dish sprite across shots:** `thali_group()` and `katsu_plate()` are reused by crop in every shot. The naan piece and the katsu piece are one function each. ✔
