# REQ-039 — Level-Up Feedback

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / BATTLE / PROGRESSION / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh inventory of the current default-branch implementation found that canonical level progression already exists inside `win()` in `index.html`:

- gained EXP is added to `s.xp`
- when `s.xp >= s.nx`, EXP is reduced by the threshold
- `s.lv` increments
- next EXP threshold increases
- max HP increases by 9 and current HP is restored to max
- ATK increases by 3

Fresh code search and filename/tree inventory found no dedicated level-up presentation module or explicit LEVEL UP feedback surface.

Therefore the progression mechanic itself must not be duplicated or changed. The player-visible gap is that a level increase is currently folded into the normal victory transition without a clear reward moment or before/after stat feedback.

## REQUIRED IMPLEMENTATION

Add a presentation-only level-up cue that observes the existing canonical `win()` result.

Required behavior:

1. Preserve the existing final `win()` as the sole owner of EXP/level/stat mutation.
2. Capture pre-win level/max HP/ATK and invoke the canonical `win()` unchanged.
3. If level increased, show a short non-interactive overlay after canonical rendering.
4. Clearly show the new level and the stat improvements that actually occurred.
5. Do not invent or award any extra EXP, HP, ATK, MP, gold, item, skill, equipment or story progression.
6. Overlay must be `pointer-events:none` and automatically clean up.
7. Repeated preview/presentation must replace the previous layer rather than stack.
8. Respect `prefers-reduced-motion`.
9. Do not interfere with victory dialogue, battle feedback, map rendering, Tap Anywhere, Dynamic Touch Controller or fullscreen world presentation.

## CANONICAL MUTATION CONTRACT

The presentation layer must treat these as read-only evidence after `win()`:

- `lv`
- `mh`
- `atk`

If future canonical code changes the exact level-up gains, display the actual before/after delta rather than hard-coding reward amounts into game state.

## AUTOMATED ACCEPTANCE

Expose a smoke-capable status surface that can verify without mutating production progression:

- feature loaded
- presentation-only ownership
- canonical progression owner identified as `index.html win()`
- pointer-safe fixed overlay
- one-layer/non-stacking behavior
- actual-delta rendering contract
- reduced-motion support
- cleanup fail-safe

A dedicated `lqTouchSmoke` probe should fail closed on contract failure.

## COMPLETION CONDITION

Automated completion requires:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated level-up feedback acceptance PASS
- 390x844 floating-touch/world visual-liveness regression PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees/feels the level-up cue on iPhone.

## DO NOT REPEAT

- do not add a second EXP/level system
- do not mutate progression from the presentation add-on
- do not hard-code a fake reward that can diverge from canonical `win()`
- do not create an input-blocking overlay
- do not mark iPhone physical feel PASS from headless CI