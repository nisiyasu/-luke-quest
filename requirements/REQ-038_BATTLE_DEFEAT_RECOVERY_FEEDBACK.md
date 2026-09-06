# REQ-038 — Battle Defeat Recovery Feedback

STATUS: IN_PROGRESS
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

The player-visible gap is transition clarity: defeat currently jumps directly from the battle frame to the town world/dialogue with no dedicated defeat cue. That can feel like an abrupt screen jump, especially on mobile.

## REQUIRED IMPLEMENTATION

Add a presentation-only defeat transition that preserves canonical recovery exactly.

Required behavior:

1. Detect the existing canonical battle defeat transition without replacing its state logic.
2. After the canonical recovery has completed, show a short fixed viewport defeat/recovery cue.
3. Make clear that Luke was defeated and returned to the town/inn rather than silently teleporting.
4. Overlay must be `pointer-events:none` so it cannot trap touch input.
5. Overlay must automatically clean itself up and must not stack across repeated events.
6. Respect `prefers-reduced-motion`.
7. Do not change HP restoration, map, coordinates, encounter grace, gold, EXP, story flags, equipment, items, poison rules, save format or battle balance.
8. Do not introduce a separate Game Over screen or new irreversible penalty.

## INTEGRATION SAFETY

- canonical `enemyTurn()` remains authority for defeat/recovery state
- wrapper must preserve arguments and return value
- later add-on wrappers must remain composable
- REQ-001 / REQ-021 touch input must not be intercepted
- REQ-022 / REQ-034 fullscreen world visibility must remain intact
- no permanent opaque layer may remain after cleanup

## AUTOMATED ACCEPTANCE

Provide a smoke-capable status surface that can verify without mutating canonical production state:

- feature loaded
- presentation-only flag
- pointer-safe overlay
- fixed viewport overlay
- single-layer/non-stacking behavior
- reduced-motion declaration
- cleanup fail-safe
- canonical recovery contract documented in status metadata

Dedicated browser smoke should run only under the existing `lqTouchSmoke` query flag and fail closed if the presentation contract breaks.

## COMPLETION CONDITION

Automated implementation completion requires:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated defeat-feedback browser acceptance PASS
- existing 390x844 floating-touch/world visual-liveness checks PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner experiences the defeat cue on iPhone.

## DO NOT REPEAT

- do not replace the existing defeat recovery mechanics
- do not add a second recovery state machine
- do not add new gold/EXP/item penalties
- do not create an input-blocking fullscreen layer
- do not mark iPhone physical feel PASS from headless CI