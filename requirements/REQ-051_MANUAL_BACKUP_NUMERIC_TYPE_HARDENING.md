# REQ-051 — Manual Backup Numeric Type Hardening

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / LOAD / STATE-INTEGRITY / LEGACY HARDENING
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

REQ-049 and REQ-050 now reject malformed payload shapes and dangerous merge keys. Fresh continuation audit found a remaining valid-object boundary: JSON objects may still carry non-numeric values for fields whose canonical `DEFAULT` type is numeric (for example HP, level, gold, coordinates, battle counters, and later add-on numeric resources).

Those values can survive an otherwise valid manual backup merge and then reach arithmetic/UI/gameplay code that assumes finite numbers.

## REQUIRED HARDENING

1. Preserve REQ-049 malformed-shape rejection and REQ-050 dangerous-key sanitization.
2. Build the manual-load state from a sanitized copy, then normalize fields dynamically against the current runtime `DEFAULT` object.
3. For every key whose current canonical DEFAULT value is a finite number:
   - preserve a finite numeric loaded value;
   - replace a present non-number/non-finite value with the canonical DEFAULT value.
4. Do not hard-code only the original v0.7 fields; later add-ons that extend DEFAULT with numeric resources must be covered automatically.
5. Do not mutate the parsed source payload.
6. Do not change booleans, strings, arrays, objects, flags, or unknown extension fields solely because of this numeric contract.
7. Expose a pure normalization contract for fail-closed browser acceptance.
8. Preserve valid manual-load behavior and Pages/browser/touch/world regressions.

## ACCEPTANCE

- finite canonical numeric values survive unchanged;
- numeric strings do not enter canonical numeric fields as strings;
- null/object/array values in canonical numeric fields fall back to current DEFAULT;
- unknown extension keys remain preserved by this numeric stage;
- current runtime DEFAULT numeric extensions are discovered dynamically;
- source payload remains unchanged;
- REQ-049 and REQ-050 contracts remain green.

## DO NOT REPEAT

- do not assume JSON object shape means field types are valid;
- do not hard-code an obsolete fixed list when DEFAULT is the runtime schema source for numeric fields;
- do not over-normalize unknown extension fields;
- do not claim physical iPhone PASS from automation.
