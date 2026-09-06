# REQ-044 — Battle-Only Poison Save Sanitization

STATUS: VERIFY
PRIORITY: P1
TYPE: BUGFIX / SAVE / STATUS-AILMENT / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## ORIGINAL BUG

REQ-043 repaired the normal defeat path so battle-only poison clears when battle transitions to world. A later save-boundary audit found old/corrupt/legacy manual state could preserve positive poison outside battle. The first REQ-044 repair sanitized positive non-battle poison at canonical save/render/init boundaries.

Initial evidence:

- requirement registration: `ec273d09daa73eb08f117c4818c92b06553fd364`
- first canonical repair: `7f57c59db35c87bb45171c800f12e6065477cc5d`
- first acceptance: `951621caa59ddf5cb50e55a755f68289bbe72fa5`
- first Pages run `34010063196`: SUCCESS

## SELF-AUDIT REOPEN — LEGACY STATUS OBJECT CAN BE ABSENT

Fresh post-REQ-048 audit compared current poison handling with canonical `DEFAULT` and `addons/manual-save-slots.js`.

Canonical `DEFAULT` does not define `status`. The poison add-on originally created `s.status` only when its script first loaded, but a legacy manual backup created before the poison system can later replace the whole state with `s=Object.assign({}, DEFAULT, data)` and contain no `status` property at all.

The first REQ-044 repair safely inspected stale poison with optional chaining, but did not recreate a missing status object after that later whole-state replacement. A subsequent poison-enemy turn could therefore reach direct `s.status.poison` access with `s.status===undefined`.

VERIFY was reopened rather than treating the earlier green run as proof of a migration case it did not cover.

## FINAL HARDENING

`addons/battle-poison-status.js` now uses one normalization path before poison-sensitive persistence/render/combat access:

- `normalizedPoisonValue(status, screen)` is a pure helper;
- missing, non-object, array or malformed legacy status normalizes poison to `0`;
- valid poison values normalize to a non-negative integer;
- non-battle state always normalizes poison to `0`;
- battle state preserves legitimate normalized poison turns;
- `normalizePoisonState()` recreates `s.status={}` when the current whole-state object lacks a valid status object;
- existing unrelated fields on a valid status object are preserved;
- normalization runs at add-on initialization, canonical save wrapper, render wrapper, battle rendering and before/after poison enemy-turn logic;
- herb/victory/escape/smoke/defeat cleanup and poison balance remain unchanged;
- manual-save code and canonical DEFAULT were not redesigned.

Hardening commits:

- reopen requirement: `5312f82c30668e88137bdc7e1fc67cf373099c72`
- implementation: `ba21bebf0909a65c63710da00f7d6a10077ad358`
- extended acceptance: `fecb2aa458c055ca11a8771d9168d5a951f62f55`

## DEDICATED ACCEPTANCE

`addons/zzzzzzzzzzzzzzzzzzzzzzzz-poison-save-sanitization-smoke.js` now additionally fails closed unless:

- migration declares status-object recreation and malformed-value normalization;
- missing status is safe in both world and battle normalization;
- malformed/non-object legacy values normalize safely;
- numeric-string battle poison is integer-normalized and preserved;
- non-battle poison clears to zero;
- earlier defeat/non-battle-save/non-battle-load cleanup and battle preservation contracts remain present.

## FINAL VERIFICATION EVIDENCE

Pages workflow run `34010883521`: SUCCESS.

PASS coverage includes sequential JavaScript validation, collision-safe add-on validation, static regression guard, add-on contract guard, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, upload and Pages deployment.

## COMPLETION CONDITION

Automated implementation completion is satisfied for both:

- positive non-battle poison sanitization; and
- missing/malformed legacy status-shape migration.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not redesign manual save slots;
- do not create a second poison implementation;
- do not clear legitimate poison during battle;
- do not treat optional chaining as equivalent to recreating missing legacy state shape;
- do not treat the first REQ-044 green run as proof of later-discovered migration cases;
- do not mark physical PASS from headless automation.