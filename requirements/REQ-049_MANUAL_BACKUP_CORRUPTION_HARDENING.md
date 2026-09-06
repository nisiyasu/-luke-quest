# REQ-049 — Manual Backup Corruption Hardening

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / LOAD / LEGACY / CORRUPTION SAFETY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

Fresh audit after REQ-044 legacy-state hardening found that `addons/manual-save-slots.js` accepts any truthy JSON value from localStorage as a loadable backup.

Current behavior:
- `slotData()` returns parsed JSON without validating object shape;
- title/menu presentation treats any truthy primitive/array as an existing slot;
- `lqManualLoad()` applies `Object.assign({}, DEFAULT, data)` and then reads `data.flags`, allowing malformed legacy/corrupt JSON shapes to become a misleading load attempt;
- malformed map falls back to town, but the slot itself is not classified invalid and there is no user-visible safe rejection path.

This is a concrete save-boundary consistency risk and follows directly from the legacy/manual-backup cases uncovered by REQ-044/046.

## REQUIRED HARDENING

1. Preserve two manual backup slots and continuous autosave behavior.
2. Validate parsed slot payloads before presenting them as loadable.
3. A valid slot payload must be a plain non-array object representing game state.
4. Invalid/malformed/corrupt payloads must never be merged into canonical runtime state.
5. Title/menu UI must identify an invalid slot instead of presenting a normal LOAD action.
6. Provide a safe user-visible recovery path: invalid slot may be deleted/overwritten, but not loaded.
7. Valid legacy object payloads remain loadable and continue to receive canonical/default migration plus existing map fallback.
8. Do not redesign canonical autosave, DEFAULT, or unrelated save systems.
9. Keep movement stop, encounter grace, save(), render(), and post-load SYSTEM dialogue behavior for valid loads.

## ACCEPTANCE

- invalid JSON -> invalid/empty-safe, no runtime mutation;
- primitive JSON -> INVALID, load rejected;
- array JSON -> INVALID, load rejected;
- plain object legacy payload -> accepted;
- invalid slot is visibly distinguishable and cannot execute load;
- delete/overwrite path remains available;
- valid load preserves existing canonical migration/fallback behavior;
- JavaScript syntax and assembled browser/Pages regressions remain green.

## DO NOT REPEAT

- do not treat JSON parse success as equivalent to valid game-state shape;
- do not merge malformed slot payloads into `s`;
- do not delete corrupt user data automatically without an explicit user action;
- do not claim physical iPhone PASS from automation.
