# REQ-050 — Manual Backup Dangerous-Key Sanitization

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / LOAD / STATE-INTEGRITY / LEGACY HARDENING
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

REQ-049 rejects malformed JSON shapes, primitives and arrays. Fresh continuation audit found a remaining object-shape boundary: a parsed plain object could still contain dangerous object keys such as `__proto__`, `constructor`, or `prototype`.

The manual-load path used `Object.assign({}, DEFAULT, data)` and an equivalent merge for `flags`. A legacy/corrupt payload with dangerous keys must not be allowed to influence the prototype/constructor surface of the reconstructed state object.

## IMPLEMENTED HARDENING

`addons/manual-save-slots.js` now:

1. preserves all REQ-049 malformed-shape rejection behavior;
2. defines `DANGEROUS_KEYS` for `__proto__`, `constructor`, and `prototype`;
3. uses `sanitizeStateObject()` to construct a fresh own-property copy before merge;
4. drops those dangerous keys at both top-level manual state and nested `flags` boundaries;
5. preserves ordinary legacy own fields and canonical DEFAULT migration;
6. leaves the parsed source object unchanged;
7. returns a safe empty object for null/array/primitive sanitizer input;
8. keeps valid manual-load movement stop, encounter grace, save/render and SYSTEM dialogue behavior;
9. leaves autosave/manual-slot UX unchanged;
10. exposes the pure sanitizer through `LQ_MANUAL_SAVE_STATUS` for fail-closed acceptance.

Implementation checkpoints:
- requirement registration: `a35b1ba17d223424b5923e486e7e501cb07c466e`
- implementation: `0f068443e1d3f14fc47512dd07a33a55adcc8c86`
- dedicated acceptance: `cee28638b10c0df83657dfb364bea044249e3128`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- REQ-049 shape-validation/rejection contract remains active;
- sanitizer contract exists;
- ordinary state keys survive;
- `__proto__`, `constructor`, and `prototype` own keys are absent from sanitized output;
- source object remains unchanged;
- null/array/primitive inputs normalize to an empty safe object;
- nested flags remain available for the same sanitized merge path.

GitHub Pages workflow run `34011382155`: SUCCESS.

PASS coverage includes:
- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- PWA / raster transport / approved Luke asset validation;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

Automated implementation completion is satisfied. Physical/subjective iPhone verification remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not treat shape validation alone as sufficient merge safety;
- do not merge dangerous prototype/constructor keys into canonical runtime state;
- do not weaken REQ-049 malformed-slot rejection while hardening valid-object merges;
- do not claim physical iPhone PASS from automation.
