# REQ-038 — Battle Defeat Recovery Feedback

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / BATTLE / RECOVERY / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh final-game inventory found that canonical defeat recovery already exists in `index.html`:

- enemy damage can reduce Luke to 0 HP
- defeat immediately restores HP to max
- screen returns to world
- map returns to town
- spawn returns to `(9,12)`
- encounter grace is restored
- the innkeeper dialogue explains that Luke was carried back

Therefore defeat recovery mechanics are **not missing** and must not be duplicated or redesigned.

The player-visible gap was transition clarity: defeat jumped directly from the battle frame to the town world/dialogue with no dedicated defeat cue.

## IMPLEMENTATION

`addons/battle-defeat-recovery-feedback.js` adds a presentation-only defeat/recovery transition while preserving canonical recovery exactly.

Behavior:

1. wraps the current final `enemyTurn()` only to observe before/after state;
2. canonical `enemyTurn()` remains sole owner of defeat/recovery state;
3. after the canonical battle→town recovery is observed, a short fixed viewport cue shows `戦闘不能` and explains the return to town;
4. overlay is `pointer-events:none`;
5. repeated presentation removes/replaces the prior layer rather than stacking;
6. animation-end cleanup plus timed fallback cleanup are both present;
7. `prefers-reduced-motion` shortens the presentation;
8. HP restoration, map, coordinates, encounter grace, gold, EXP, story flags, equipment, items, poison rules, save format and battle balance are unchanged.

Status surface:

`window.LQ_DEFEAT_RECOVERY_FEEDBACK_STATUS`

records presentation-only ownership, canonical recovery metadata, pointer safety, reduced-motion support, cleanup fallback, active-layer count and smoke preview/cleanup hooks.

Dedicated acceptance:

`addons/zzzzzzzzzzzzzzzzzz-defeat-recovery-feedback-smoke.js`

runs only under `?lqTouchSmoke=1`, drives two preview presentations, verifies one-layer behavior, fixed viewport, pointer safety, reduced motion, cleanup fallback and canonical recovery metadata, then fails closed through an uncaught runtime failure marker if any contract check fails.

## INTEGRATION SAFETY

- canonical `enemyTurn()` remains authority for defeat/recovery state
- wrapper preserves arguments and return value
- later add-on wrappers remain composable
- REQ-001 / REQ-021 touch input is not intercepted
- REQ-022 / REQ-034 fullscreen world visibility remains intact
- no permanent opaque layer remains after cleanup

## VERIFICATION EVIDENCE

Checkpoints:

- requirement registration: `1793e4000939ae764c3de248cf5b33ba2423a8ab`
- implementation: `ec3d505fe8e631e5d72989943d63188de12e24b1`
- dedicated browser acceptance: `246728d9adc1315590a836c2df2b50c426f801a4`
- queue activation checkpoint: `49606d38328c5582564c65c56035af10b65b7dab`

Pages workflow run `34008956384`: SUCCESS.

Verified in that run:

- sequential JavaScript syntax: SUCCESS
- collision-safe add-ons syntax: SUCCESS
- static regression guard: SUCCESS
- add-on contract guard: SUCCESS
- PWA/assets validation: SUCCESS
- assembled browser world/movement/interaction/battle/save smoke: SUCCESS
- 390x844 floating-touch + fullscreen visible-world regression: SUCCESS
- defeat-feedback smoke executed under the same `lqTouchSmoke` assembled page and did not trip its fail-closed runtime guard
- Pages upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated implementation completion is satisfied:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated defeat-feedback browser acceptance PASS
- existing 390x844 floating-touch/world visual-liveness checks PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner experiences the defeat cue on iPhone.

Therefore REQ-038 is `VERIFY`, not DONE.

## DO NOT REPEAT

- do not replace the existing defeat recovery mechanics
- do not add a second recovery state machine
- do not add new gold/EXP/item penalties
- do not create an input-blocking fullscreen layer
- do not mark iPhone physical feel PASS from headless CI