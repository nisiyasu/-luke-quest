# REQ-049 — Manual Backup Corruption Hardening

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / LOAD / LEGACY / CORRUPTION SAFETY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

Fresh audit after REQ-044 legacy-state hardening found that `addons/manual-save-slots.js` accepted any truthy JSON value from localStorage as a loadable backup.

Prior behavior:
- parsed JSON was returned without validating object shape;
- title/menu presentation treated any truthy primitive/array as an existing slot;
- `lqManualLoad()` could attempt to merge malformed legacy/corrupt shapes into canonical runtime state;
- malformed map had a fallback, but the slot itself was not classified invalid and there was no visible safe rejection path.

This was a concrete save-boundary consistency risk following from the legacy/manual-backup cases uncovered by REQ-044/046.

## IMPLEMENTED HARDENING

`addons/manual-save-slots.js` now:

1. classifies slot payloads as `empty`, `valid`, or `invalid`;
2. accepts only non-null, non-array object payloads as loadable legacy/game state;
3. rejects malformed JSON, primitives, arrays and null before any runtime state merge;
4. keeps valid legacy objects loadable through canonical/default migration and existing bad-map fallback;
5. treats malformed `data.flags` conservatively instead of merging non-object shapes;
6. renders corrupt menu slots as `INVALID BACKUP` with LOAD disabled;
7. keeps explicit SAVE overwrite and DELETE recovery paths available in the in-game manual-backup panel;
8. exposes invalid title backups as visibly disabled instead of offering a normal load action;
9. preserves movement stop, encounter grace, `save()`, `render()` and post-load SYSTEM dialogue for valid loads;
10. leaves continuous autosave and unrelated save systems unchanged.

Implementation checkpoints:
- requirement registration: `a7c6c9a3789194d83a5776218afa1433d5b9fdaf`
- core hardening: `801eb65860df9fc85c01928cde8785b8a5172025`
- reusable validation contract: `452f2b336ebf29a010e7d0447d5766ccd14993cd`
- dedicated acceptance: `fadec91a8c735f0f0587d2a8fe0876997663a9e5`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- status/slot contract exists;
- two slots and autosave preservation remain declared;
- plain object payloads are accepted;
- null, string, number, boolean and array payloads are rejected;
- the pure object-shape helper agrees with the classifier.

GitHub Pages workflow run `34011257673`: SUCCESS.

PASS coverage includes:
- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- PWA and approved Luke asset validation;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

Automated implementation completion is satisfied. Physical/subjective iPhone verification remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not treat JSON parse success as equivalent to valid game-state shape;
- do not merge malformed slot payloads into `s`;
- do not delete corrupt user data automatically without an explicit user action;
- do not redesign canonical autosave merely to harden manual backups;
- do not claim physical iPhone PASS from automation.
