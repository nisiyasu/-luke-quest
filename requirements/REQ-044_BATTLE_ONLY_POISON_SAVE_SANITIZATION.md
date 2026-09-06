# REQ-044 — Battle-Only Poison Save Sanitization

STATUS: VERIFY
PRIORITY: P1
TYPE: BUGFIX / SAVE / STATUS-AILMENT / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH INTEGRATED AUDIT

REQ-043 repaired the normal defeat path so battle-only poison is cleared when battle transitions to world. Fresh inspection of the save surfaces found a second, independent persistence boundary that could preserve stale poison outside battle.

`addons/manual-save-slots.js`:

- snapshots the entire state object `s`;
- forces the snapshot to `screen='world'`;
- restores a slot with `s=Object.assign({}, DEFAULT, data)`;
- immediately calls canonical `save()` before rendering.

Before this repair, `addons/battle-poison-status.js` normalized `s.status.poison` to a non-negative integer at add-on startup, but did not reject a positive poison value when restored state was already outside battle.

Therefore an old/corrupt/legacy manual backup, or stale state created before REQ-043, could restore `status.poison > 0` into world state and re-save it even though poison is explicitly battle-only.

This was a consistency/migration bug. It did not require a new status system or changes to poison balance.

## IMPLEMENTED REPAIR

`addons/battle-poison-status.js` now adds a single canonical battle-only sanitization boundary:

- `shouldSanitizePoison(screen)` returns true for non-battle state and false for battle state;
- `sanitizeBattleOnlyPoison()` clears only a positive stale poison value outside battle;
- initialization sanitizes a loaded non-battle state before its first add-on save;
- canonical `save()` is wrapped while preserving arguments/return behavior, so any non-battle persistence boundary is sanitized before storage;
- `render()` also applies the same idempotent sanitization before presentation, preventing stale world poison UI if state changes through a restore path;
- legitimate in-battle poison remains untouched;
- REQ-043 defeat cleanup, victory/run/smoke/herb cleanup and poison balance remain unchanged;
- status contract exposes `cleanup.nonBattleSave`, `cleanup.nonBattleLoad` and pure `shouldSanitizePoison` for read-only verification.

Because `manual-save-slots.js` restores state and then calls canonical `save()`, its legacy/stale poison state is corrected by the poison system itself without redesigning manual slots.

## DEDICATED ACCEPTANCE

Added:

`addons/zzzzzzzzzzzzzzzzzzzzzzzz-poison-save-sanitization-smoke.js`

Under `lqTouchSmoke` it fails closed unless:

- poison status contract exists;
- poison remains battle-only;
- REQ-043 defeat cleanup remains declared;
- non-battle save/load cleanup remain declared;
- world/title require sanitization;
- battle state is preserved.

## VERIFICATION EVIDENCE

- requirement registration: `ec273d09daa73eb08f117c4818c92b06553fd364`
- canonical repair: `7f57c59db35c87bb45171c800f12e6065477cc5d`
- dedicated acceptance: `951621caa59ddf5cb50e55a755f68289bbe72fa5`
- Pages workflow run: `34010063196` / SUCCESS
- PASS steps include:
  - sequential JavaScript patch validation
  - collision-safe add-on validation
  - static regression guard
  - add-on contract guard
  - assembled browser smoke
  - 390x844 floating-touch + iPhone world visual-liveness smoke
  - Pages upload/deploy

## COMPLETION CONDITION

Automated implementation completion is satisfied:

- requirement committed;
- minimal canonical poison repair committed;
- dedicated acceptance committed;
- JavaScript/static/add-on checks PASS;
- assembled browser smoke PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING`; do not call physical iPhone PASS from CI.

## DO NOT REPEAT

- do not redesign manual save slots;
- do not create a second poison implementation;
- do not clear poison during legitimate battle state;
- do not use REQ-043 normal defeat cleanup alone as proof that stale save migration is safe;
- do not mark physical PASS from headless automation.