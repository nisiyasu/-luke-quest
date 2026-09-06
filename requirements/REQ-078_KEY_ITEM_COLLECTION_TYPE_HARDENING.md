# REQ-078 — Key Item Collection Type Hardening

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / RECOVERY / KEY-ITEM / DATA-SAFETY / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_DATA_SAFETY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh cross-path save audit found a concrete restore-time type-safety gap around the optional-boss key-item collection.

`addons/optional-forest-boss.js` legitimately treats `s.keyItems` as an array and on victory appends `森王の角` using `.push()`. However the existing restore hardening validates root shape, dangerous keys and canonical numeric fields but does not normalize the later-added `keyItems` collection because it is not part of the base `DEFAULT` schema.

A syntactically valid save/backup such as `{"keyItems":"corrupt"}` or `{"keyItems":{}}` can therefore survive restore as a truthy non-array value and later make key-item reward code unsafe.

Affected restore boundaries audited:
- canonical autosave pre-bootstrap (`prelude/autosave-bootstrap-guard.js`)
- cross-browser SAVE CODE import (`addons/save-transfer.js`)
- manual backup load (`addons/manual-save-slots.js`)

## 1. REQUIRED BEHAVIOR

- Valid `keyItems` arrays survive restore.
- Only string entries are retained; duplicates are de-duplicated while preserving first-seen order.
- Missing `keyItems` remains compatible with legacy saves.
- Present malformed/non-array `keyItems` must never reach runtime as a truthy non-array collection.
- SAVE CODE import normalizes malformed `keyItems` safely.
- Manual backup load normalizes malformed `keyItems` safely.
- Canonical autosave bootstrap sanitizes a present malformed collection before base runtime restore; it must not introduce a pre-addon crash.
- Dangerous-key and numeric hardening from REQ-049/050/051/063 remains intact.
- Do not invent a second key-item schema or fabricate rewards.
- No change to Forest Lord reward semantics or story.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. valid `['森王の角','王城の通行証']` survives in order;
2. duplicate strings de-duplicate safely;
3. mixed non-string entries are removed;
4. string/object/number `keyItems` become a safe empty array at restore boundaries;
5. missing keyItems remains legacy-compatible;
6. canonical autosave prelude executes before base runtime and sanitizes malformed present keyItems;
7. SAVE CODE import produces safe array state;
8. manual backup load produces safe array state;
9. existing dangerous-key/numeric/save-transfer/manual-backup regressions remain PASS;
10. assembled browser smoke PASS;
11. 390x844 touch/fullscreen visual-liveness PASS;
12. Pages deploy SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if safe useful work remains.
