# REQ-050 — Manual Backup Dangerous-Key Sanitization

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / LOAD / STATE-INTEGRITY / LEGACY HARDENING
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

REQ-049 now rejects malformed JSON shapes, primitives and arrays. Fresh continuation audit found a remaining object-shape boundary: a parsed plain object may still contain dangerous object keys such as `__proto__`, `constructor`, or `prototype`.

The canonical manual-load path used `Object.assign({}, DEFAULT, data)` and an equivalent merge for `flags`. A legacy/corrupt payload with dangerous keys must not be allowed to influence the prototype/constructor surface of the newly reconstructed state object.

## REQUIRED HARDENING

1. Preserve all REQ-049 malformed-shape rejection behavior.
2. Before merging a valid slot payload, construct a sanitized own-property copy.
3. Drop `__proto__`, `constructor`, and `prototype` at top-level manual state and nested `flags` merge boundaries.
4. Preserve ordinary legacy state fields and canonical DEFAULT migration.
5. Do not mutate the parsed source payload while sanitizing it.
6. Do not redesign autosave/manual slot UX.
7. Expose a pure sanitization contract for fail-closed browser acceptance.
8. Pages/browser/touch/world regressions must remain green.

## ACCEPTANCE

- ordinary own keys survive sanitization;
- dangerous keys are absent from sanitized result;
- source object is not mutated;
- null/array/primitive input yields a safe empty object;
- valid manual load still uses canonical DEFAULT + sanitized legacy data;
- flags merge uses the same dangerous-key exclusion;
- REQ-049 classifier/rejection contract stays green.

## DO NOT REPEAT

- do not treat shape validation alone as sufficient merge safety;
- do not merge dangerous prototype/constructor keys into canonical runtime state;
- do not claim physical iPhone PASS from automation.
