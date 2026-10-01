# C2 flow test (blind choices C1), branch flow-c2-r2 @ b2ef695, clock 12:20, 1920x1080, seed 1, ?still
Driver: flow.mjs (node flow.mjs <rooftop3|train|timer|shop> <run>); raw output <case>-run<N>.json. Click map = fresh context per click; love/pop compared across runs.

| case | run | result | what | shot |
|---|---|---|---|---|
| rooftop:3 (handout) | 1 | FAIL | 3 choices, chips hidden OK, mouse click = routed OK (tama +3, ume +1, neither -3, same as run 2). But order is NOT shuffled on screen (Handout ignores `order`; bento layout) while keys 1/2 ARE shuffled (order=[1,0,2]): key 1 labelled "1: Take the tamagoyaki" routes to umeboshi, key 2 to tamagoyaki. Timer beat, default = umeboshi tagged. Dialog box covers bottom of the bento (art), not the choices. | research/sprint-1001/blind/rooftop3-run1.png |
| rooftop:3 (handout) | 2 | PASS | 3 choices, authored order, chips shown (+3/+1/-3), click and keys 1-3 route to the labelled choice, default tagged umeboshi. Box covers bottom of bento only. | research/sprint-1001/blind/rooftop3-run2.png |
