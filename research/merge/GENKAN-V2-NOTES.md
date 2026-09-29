# Genkan v2: scene 10 `genkan-in` redraw

File: `src/date-beta/art/GenkanArrival.jsx`, camera CSS in `src/date-beta/art/alt.css`.
Shots (1920x1080): `research/date-beta-demo/scene-10-genkan-v2-{wide,insert-slippers,insert-shrine,rm-insert}.png`,
made by `research/date-beta-demo/shots-genkan-v2.mjs`.

## What changed

- **Composition** comes from Tony's refs (42 main, 41/40 for materials and the hallway). We stand in her doorway looking in:
  dark slate tataki at the bottom, a raised wood step (agari-kamachi) with a lit lip board, a landing, then a hallway
  that goes dark toward an unlit shoji. The shoe cabinet runs along the right wall, with a key tray, one vase and one
  red bud (continuity with BG-D3) on top, and a hanging scroll above. The left wall has the umbrella stand with her
  wet clear umbrella from the stairs scene, empty coat pegs and a light switch.
- **Perspective is exact.** Every point goes through one projection `P(x, y, z)` (metres) with a level camera and a
  shifted horizon (VP at 960,400), so the step edge, the planks, the cabinet, the skirting and the hall all converge
  on the VP. Frontal things (the shrine face, the vase, the umbrella stand) are drawn in centimetres and scaled by
  `S(z) = F / depth`.
- **Light.** It is night and the only light is the paper pendant above the tataki. The lamp has a halo, there is a
  warm pool on the floor, and a radial dim overlay centred on the lamp darkens the corners. The hall has its own deep
  overlay, so it fades to near-black. The lip board catches the light and the riser sits in its own shadow. There are
  no invented reflections: in this layout the lamp's mirror image would fall on the tataki below the frame, so the
  floor shows none.
- **Contact.** Each shoe, slipper and the shrine has a soft contact shadow (its footprint, blurred, pushed away from
  the lamp). The shoes are 3D footprints with height (a hull of sole plus top, then the collar opening), so they sit
  on the slate.
- **Her shoes:** 4 pairs (pumps, red flats, white sneakers, navy loafers) at a 0.33 m pitch. Heels are 3 cm off the
  riser, toes exactly on the masking-tape line, and each toe has a pencil tick. The ruler lies on the step edge just
  behind them.
- **PROP layer:** the men's slippers (#4a5f86 body, #33466a toe cover, #22304a outline) sit on the step with toes to
  the door. Next to them, past the cabinet end, is a small floor shrine (hokora) with a gable roof, a shimenawa rope
  and shide papers. Its window holds the placeholder NAND (pink inputs, #F0243F output).
- **Insert:** `.genkan.cam { transform-origin: 1202px 731px }`, `.insert { scale(3.6) }`. This frames the slippers and
  the shrine above the dialogue box (y < 875). The dark hall stays in the top-left corner of the insert. RM is still
  a hard cut through `.rm`.
- The interface is unchanged: default export, `{ props: { insert }, rm }`, BG `g.gk-bg`, PROP `g.gk-prop`. One extra
  top-level `rect.gk-dim` (the light falloff) sits above both layers.

## Constants (exported from the file, reuse them rather than copying numbers)

```js
VP  = { x: 960, y: 400 }            // stage px
F   = 760                           // px per metre at 1 m depth
CAM = { x: 0, y: 1.3, z: -0.5 }     // eye, 0.5 m outside the door plane
ROOM = {
  W: 1.45, STEP_Z: 2.0, STEP_H: 0.18, LIP: 0.035, CEIL: 2.4,
  WALL_Z: 3.9, HALL_W: 0.8, HALL_H: 2.1, HALL_END: 8.5,
  CAB: { x0: 1.05, z0: 0.3, z1: 2.0, h: 0.9 },   // right wall (+x)
  LAMP: { x: 0, y: 1.9, z: 1.6, r: 0.2 },
  TAPE_Z: 1.72,
  DOOR: { x0: -0.45, x1: 0.45, h: 2.0 },          // in the z = 0 plane
  SLIPPERS: { x: [0.3, 0.46], z: 2.2 },
}
PAL: plaster #bea37e / dim #6a5a45, ceiling #c2aa86 -> #5e4f3e, wood #c38f58 -> #7c5836 (grain #9c7146),
     lip #7a5230 + edge #e8bb7e, slate #45474c (joints #2b2c30), cabinet #a77d4d / top #cf9f66, trim #4a3322,
     shoji #3b3c44 + lattice #17141a, dark #07060a, lamp #fff4d8 -> #f0c47e, glow #ffd79a,
     her #f0243f, pink #ff5fa2, slippers #4a5f86 / #33466a / #22304a
```

Axes: x points right as you enter, y up, z into the house. z = 0 is the front-door plane, the tataki runs z 0..2, the
landing z 2..3.9, and the hall z 3.9..8.5.

## Reverse shot for main's BG-D3 (`Genkan.jsx`, the locked room)

Use the same room with the camera turned round: stand in the hall and look back out at the chained door. That is the
ref 41 composition.

```js
const CAM_R = { x: 0, y: 1.3, z: 6.8 };                 // in the hall, looking toward -z
const PR = (x, y, z) => { const d = CAM_R.z - z;         // depth grows toward the door
  return [VP.x - F * (x - CAM_R.x) / d, VP.y - F * (y - CAM_R.y) / d]; };   // note the minus on x: the view is mirrored
```

- **Mirroring:** the cabinet (world +x) is on the **left** of the reverse frame. Main's current BG-D3 puts it on the
  right, so flip that layout to match. The umbrella stand and coat pegs end up on the right.
- **Framing:** the hall opening (x ±0.8, header 2.1 at z 3.9) frames the view, like the door frame in ref 41. Past it
  are the landing, the step edge at z 2.0 (lip toward the door, riser facing away from the camera, so from this side
  you see only the lip board and the drop), the slate tataki, and the door filling DOOR x ±0.45, height 2.0 at z 0.
  Chain and locks go on the door.
- **The row:** main's men's shoes go on the tataki with heels to the riser, where her shoes stand in this scene. Or,
  as BG-D3 has it now, put them on the step. Either way, the "empty spot, swept clean" should be `ROOM.SLIPPERS`
  (x 0.3/0.46, z 2.2), where these slippers were.
- **Light:** use the same pendant at `LAMP`. From the hall it hangs between the camera and the door, so the door is
  front-lit and the hall around the camera goes dark. Reuse `PAL` unchanged.
- Keep F = 760 and a VP near 960,400 so the two shots cut together at the same lens.

## Weak spots / follow-ups

- In the wide shot the slippers are small (~30 px each): it is an honest 2.7 m view, and the insert carries them.
  They read as slippers mainly from the throat arch. A lighter insole would help if they need more contrast.
- **Slipper direction:** Japanese custom sets a guest's slippers with toes pointing **into** the house. The spec asks
  for toes to the door, and the code keeps that. Flipping them is a one-line change in `Slipper` (mirror the
  footprint's t).
- The left wall is a large plain plane on purpose (the house is too tidy). If it feels empty on the projector, a
  mirror on the left wall at z 2.4..3.2 is the obvious addition.
- In the insert, the tops of her white sneakers show at the bottom-left, under the box. That is acceptable, since
  they are hers.
