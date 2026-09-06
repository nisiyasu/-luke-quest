# REQ-044 — Battle-Only Poison Save Sanitization

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / SAVE / STATUS-AILMENT / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## ORIGINAL BUG

REQ-043 repaired the normal defeat path so battle-only poison clears when battle transitions to world. A later save-boundary audit found old/corrupt/legacy manual state could preserve positive poison outside battle. The first REQ-044 repair therefore sanitized positive non-battle poison at canonical save/render/init boundaries.

Initial evidence:

- requirement registration: `ec273d09daa73eb08f117c4818c92b06553fd364`
- first canonical repair: `7f57c59db35c87bb45171c800f12e6065477cc5d`
- first acceptance: `951621caa59ddf5cb50e55a755f68289bbe72fa5`
- first Pages run `34010063196`: SUCCESS

## SELF-AUDIT REOPEN — LEGACY STATUS OBJECT CAN BE ABSENT

Fresh post-REQ-048 audit compared the current poison add-on with canonical `DEFAULT` and `addons/manual-save-slots.js`.

Canonical `DEFAULT` does **not** define `status`.

The poison add-on creates `s.status` only once when the script first loads. But a legacy manual backup created before the poison system can later be loaded with:

- `s=Object.assign({}, DEFAULT, data)`
- no `status` property in `DEFAULT`
- no `status` property in old `data`
- then canonical `save()` and `render()`.

The first REQ-044 save sanitization used optional chaining to inspect stale poison but did not recreate a missing status object after this later whole-state replacement. On a subsequent poison-enemy turn, the infection branch directly evaluated `s.status.poison<=0`, which can throw when `s.status` is undefined.

Therefore the first green REQ-044 run proved positive-poison sanitization, but **did not prove legacy object-shape migration**. VERIFY is reopened rather than preserving a false completion boundary.

## REQUIRED HARDENING

1. Keep all existing poison balance and REQ-043/044 cleanup behavior unchanged.
2. Define one normalization path that guarantees `s.status` is an object whenever poison code/save/render uses it.
3. Normalize malformed/missing poison values to a non-negative integer.
4. Outside battle, normalize poison to zero.
5. During battle, preserve legitimate normalized poison turns.
6. Run the normalization before canonical non-battle save, render, and poison enemy-turn access so a legacy whole-state replacement cannot leave the add-on with an absent status object.
7. Preserve unrelated fields on an existing `s.status` object.
8. Do not redesign manual slots or add poison to canonical DEFAULT solely to patch this add-on.
9. Extend fail-closed acceptance with pure migration cases for missing status, malformed poison, battle preservation and non-battle clearing.

## COMPLETION CONDITION

Automated completion now requires both:

- non-battle positive poison sanitization; and
- missing/malformed legacy status-shape migration.

All JavaScript/static/add-on checks, assembled browser smoke, 390x844 touch/world visual-liveness and Pages deployment must pass again before returning to VERIFY.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not redesign manual save slots;
- do not create a second poison implementation;
- do not clear legitimate poison during battle;
- do not treat optional chaining as equivalent to recreating missing legacy state shape;
- do not treat the first REQ-044 green run as proof of this newly discovered migration case;
- do not mark physical PASS from headless automation.