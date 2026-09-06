# REQ-044 — Battle-Only Poison Save Sanitization

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / SAVE / STATUS-AILMENT / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH INTEGRATED AUDIT

REQ-043 repaired the normal defeat path so battle-only poison is cleared when battle transitions to world. Fresh inspection of the save surfaces found a second, independent persistence boundary that can preserve stale poison outside battle.

`addons/manual-save-slots.js`:

- snapshots the entire state object `s`;
- forces the snapshot to `screen='world'`;
- restores a slot with `s=Object.assign({}, DEFAULT, data)`;
- immediately calls canonical `save()` before rendering.

`addons/battle-poison-status.js` currently normalizes `s.status.poison` to a non-negative integer at add-on startup, but does not reject a positive poison value when the restored state is already outside battle.

Therefore an old/corrupt/legacy manual backup, or any stale state created before REQ-043, can restore `status.poison > 0` into world state and re-save it even though poison is explicitly battle-only.

This is a consistency/migration bug. It does not require a new status system or changes to poison balance.

## REQUIRED REPAIR

1. Preserve poison mechanics, damage, duration, chance, herb cure and all REQ-043 battle-end cleanup.
2. Treat positive poison as invalid whenever canonical state is being persisted outside `screen==='battle'`.
3. Sanitize stale poison during add-on initialization when the loaded state is not battle.
4. Sanitize stale poison before canonical `save()` persists a non-battle state, including manual-slot restore before its immediate autosave.
5. Do not clear poison from a legitimate in-battle save/state.
6. Preserve `save()` arguments/return behavior and avoid a second save system.
7. Expose a pure/read-only predicate or status contract so automated acceptance can prove the boundary.
8. Do not mutate unrelated status, map, coordinates, HP, MP, inventory, equipment, flags, gold, EXP, manual slots or battle state.

## AUTOMATED ACCEPTANCE

The poison status contract must prove:

- poison is still battle-only;
- world/title/non-battle state requires poison sanitization;
- battle state does not require poison sanitization;
- defeat cleanup from REQ-043 remains declared;
- initialization/save normalization is present in the canonical poison add-on;
- existing assembled browser and 390x844 iPhone touch/world visual-liveness smoke remain PASS.

A dedicated fail-closed `lqTouchSmoke` acceptance should fail if this contract regresses.

## COMPLETION CONDITION

Automated completion requires:

- requirement committed;
- minimal canonical poison repair committed;
- dedicated acceptance committed;
- JavaScript/static/add-on checks PASS;
- assembled browser smoke PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS;
- queue/current synchronized to fresh reality.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING`; do not call physical iPhone PASS from CI.

## DO NOT REPEAT

- do not redesign manual save slots;
- do not create a second poison implementation;
- do not clear poison during legitimate battle state;
- do not use REQ-043 normal defeat cleanup as proof that stale save migration is safe;
- do not mark physical PASS from headless automation.