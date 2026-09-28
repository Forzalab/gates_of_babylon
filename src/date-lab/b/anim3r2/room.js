// anim-3-r2 "the room looks away" (pure; node --test drives it).
// A projector audience has no cursor, so the gaze rule needs a crowd version:
//   HAND mode (someone is moving the mouse): round-1 rule, the pointer is your eyes; off the anchor for 2.5 s = one creep.
//   ROOM mode (no pointer movement for 6 s, or never): the ROOM is the eye. Its attention drains in 4 held poses
//   (open -> heavy -> half -> shut, 1500 ms each); at 6 s the room has looked away: the screen blinks and the scene
//   takes one step behind the blink. A click / Space (the presenter: "look!") = a blink too (one step, meter reset).
//   Once a scene is fully crept (MAX), the room holds it 6 s and the tour moves on to the next scene by itself.
export const ROOM = Object.freeze({ idleToRoom: 6000, lookAway: 6000, poses: 4, handAway: 2500, holdAtMax: 6000 });
export const POSE_MS = ROOM.lookAway / ROOM.poses; // 1500 >= 500 (drawn poses hold >= 500 ms)

export const initRoom = () => ({ mode: 'room', sinceMove: Infinity, sinceStep: 0, offAnchor: 0 });

// dt ms; ev = { moved?: bool, onAnchor?: bool, atMax?: bool }. Returns [state, action] with action null | 'step' | 'next'.
export function roomTick(s, dt, ev = {}) {
  let { mode, sinceMove, sinceStep, offAnchor } = s;
  sinceMove = ev.moved ? 0 : sinceMove + dt;
  sinceStep += dt;
  if (ev.moved) mode = 'hand';
  else if (sinceMove >= ROOM.idleToRoom && mode !== 'room') { mode = 'room'; sinceStep = 0; }
  offAnchor = mode === 'hand' && !ev.onAnchor ? offAnchor + dt : 0;
  let action = null;
  if (mode === 'room') {
    if (ev.atMax ? sinceStep >= ROOM.holdAtMax : sinceStep >= ROOM.lookAway) { action = ev.atMax ? 'next' : 'step'; sinceStep = 0; }
  } else if (!ev.atMax && offAnchor >= ROOM.handAway && sinceStep >= ROOM.handAway) { action = 'step'; sinceStep = 0; offAnchor = 0; }
  return [{ mode, sinceMove, sinceStep, offAnchor }, action];
}
// a blink (click / Space) resets the room's attention
export const roomBlink = (s) => ({ ...s, sinceStep: 0, offAnchor: 0 });

// the room's eye: 0 open .. 3 nearly shut (stepped, held POSE_MS each)
export const eyePose = (s) => (s.mode === 'room' ? Math.min(ROOM.poses - 1, Math.floor(s.sinceStep / POSE_MS)) : 0);
export const EYE_TEXT = ['THE ROOM IS WATCHING', 'the room is getting tired', 'the room glances away', 'the room is not looking'];
