# REQ-040 — EXP Progress Visibility

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / PROGRESSION / HUD / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh inventory of the current default-branch game confirms that canonical EXP progression already exists:

- `s.xp` stores current progress toward the next level
- `s.nx` stores the current threshold
- `win()` adds enemy EXP and handles level-up
- REQ-039 now gives a clear cue when level-up actually happens

However, the canonical status HUD only displayed LV / HP / G / 薬草 and the basic adventure memo did not expose current EXP / next-level progress either.

Therefore the player could receive EXP and level up, but could not normally see how close the next level was. This was a player-visible progression clarity gap, not a missing progression mechanic.

## IMPLEMENTATION

`addons/exp-progress-visibility.js` adds compact, read-only EXP progress to the existing status presentation.

Behavior:

1. preserves canonical `s.xp`, `s.nx`, `win()` and all progression mutation unchanged;
2. wraps the existing `status()` HTML generator rather than creating a second HUD/state system;
3. displays `EXP current/threshold` plus a 4px proportional meter;
4. keeps the component compact, with narrower mobile sizing at <=430px;
5. uses `pointer-events:none` and does not create a fixed/fullscreen layer;
6. safely normalizes malformed values: invalid EXP -> 0, invalid/nonpositive threshold -> 1, visible percent clamped to 0..100;
7. updates naturally through the existing render/status lifecycle;
8. writes no save/progression state.

Status surface:

`window.LQ_EXP_PROGRESS_STATUS`

records presentation-only ownership, canonical sources `s.xp` / `s.nx`, no-save-mutation, pointer safety, no-fullscreen-layer, normalization and sample/read helpers.

Dedicated acceptance:

`addons/zzzzzzzzzzzzzzzzzzzz-exp-progress-visibility-smoke.js`

runs only under `?lqTouchSmoke=1` and verifies:

- status surface exists
- presentation-only contract
- canonical source fields
- no save mutation
- live DOM is pointer-safe and not fixed/fullscreen
- `7/20 -> 35%` math
- malformed threshold fallback `0/1 -> 0%`
- rendered text/meter contract
- compact live component height

Any failed condition triggers an uncaught fail-closed runtime marker consumed by the existing browser workflow error detector.

## IPHONE / FULLSCREEN SAFETY

REQ-022 and REQ-034 remain controlling UX constraints:

- world/map remains the visual priority
- EXP presentation fits inside the compact status overlay
- no opaque fullscreen plane
- no new bottom control strip
- the existing 390x844 floating-touch/world visual-liveness regression remains green

## VERIFICATION EVIDENCE

Implementation checkpoints include:

- EXP visibility implementation: current `addons/exp-progress-visibility.js`
- dedicated browser acceptance checkpoint: `091e4176732cc62a13c9d17e994c607a634cd7e5`

Pages workflow run `34009253993`: SUCCESS.

Verified in that run:

- sequential JavaScript syntax: SUCCESS
- collision-safe add-ons syntax: SUCCESS
- static regression guard: SUCCESS
- add-on contract guard: SUCCESS
- PWA/assets validation: SUCCESS
- assembled browser world/movement/interaction/battle/save smoke: SUCCESS
- dedicated EXP progress smoke ran under `lqTouchSmoke` without tripping its fail-closed runtime marker
- 390x844 floating-touch + fullscreen visible-world regression: SUCCESS
- Pages upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated completion is satisfied:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated EXP progress acceptance PASS
- 390x844 floating-touch/world visual-liveness regression PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the compact EXP display on iPhone.

Therefore REQ-040 is `VERIFY`, not DONE.

## DO NOT REPEAT

- do not add a second EXP system
- do not mutate `xp`/`nx` from the presentation layer
- do not add a large vertical status panel
- do not regress fullscreen world visibility
- do not mark iPhone physical readability PASS from headless CI