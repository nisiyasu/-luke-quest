# REQ-040 — EXP Progress Visibility

STATUS: IN_PROGRESS
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

However, the canonical status HUD only displays:

- LV
- HP
- G
- 薬草

and the basic adventure memo does not expose current EXP / next-level progress either.

Therefore the player can receive EXP and level up, but cannot normally see how close the next level is. This is a player-visible progression clarity gap, not a missing progression mechanic.

## REQUIRED IMPLEMENTATION

Add compact, read-only EXP progress to the existing player-facing status presentation without changing canonical progression.

Required behavior:

1. Preserve `s.xp`, `s.nx`, `win()` and all progression mutations unchanged.
2. Display current EXP and threshold in a compact form such as `EXP 7/20`.
3. Provide a proportional visual meter when there is enough room, while keeping the iPhone world viewport dominant.
4. Do not create a new dedicated vertical panel below the world.
5. Do not enlarge the fullscreen status overlay enough to materially cover gameplay.
6. Clamp display math safely when legacy/malformed saves have missing or invalid threshold values.
7. Presentation must update through the existing render lifecycle.
8. Do not intercept pointer/tap/drag input.
9. Do not alter save format or write new progression state merely for presentation.

## IPHONE / FULLSCREEN SAFETY

REQ-022 and REQ-034 remain controlling UX constraints:

- world/map remains the visual priority
- EXP presentation must fit inside/alongside the compact status overlay
- no opaque fullscreen plane
- no new bottom control strip
- safe with 390x844 viewport

## AUTOMATED ACCEPTANCE

Expose a status surface or DOM contract allowing smoke verification of:

- presentation-only behavior
- canonical source fields are `s.xp` / `s.nx`
- compact text includes current/threshold EXP
- meter percentage derives from clamped `xp/nx`
- no pointer interception
- no new fixed/fullscreen opaque layer
- malformed threshold fallback is safe

Dedicated smoke must run under the existing `lqTouchSmoke` assembled-page path and fail closed if the contract breaks.

## COMPLETION CONDITION

Automated completion requires:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated EXP progress acceptance PASS
- 390x844 floating-touch/world visual-liveness regression PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the compact EXP display on iPhone.

## DO NOT REPEAT

- do not add a second EXP system
- do not mutate `xp`/`nx` from the presentation layer
- do not add a large vertical status panel
- do not regress fullscreen world visibility
- do not mark iPhone physical readability PASS from headless CI