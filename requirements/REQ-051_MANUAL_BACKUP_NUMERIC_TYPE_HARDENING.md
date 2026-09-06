# REQ-051 — Manual Backup Numeric Type Hardening

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / LOAD / STATE-INTEGRITY / LEGACY HARDENING
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH DEFECT INVENTORY

REQ-049 and REQ-050 reject malformed payload shapes and dangerous merge keys. Fresh continuation audit found a remaining valid-object boundary: JSON objects could still carry non-numeric values for fields whose canonical `DEFAULT` type is numeric, then reach arithmetic/UI/gameplay code that assumes finite numbers.

## IMPLEMENTED HARDENING

`addons/manual-save-slots.js` now:

1. preserves REQ-049 shape rejection and REQ-050 dangerous-key sanitization;
2. exposes `normalizeNumericStateFields(value, defaults)`;
3. starts from a sanitized own-property copy;
4. discovers canonical numeric fields dynamically from the current runtime `DEFAULT` object instead of a fixed original-field list;
5. preserves a loaded value only when it is a finite JavaScript number for a canonical numeric field;
6. replaces a present string/null/object/array/non-finite value for such a field with that field's current DEFAULT value;
7. leaves absent DEFAULT numeric keys absent from the loaded overlay so normal `Object.assign({}, DEFAULT, data)` supplies canonical defaults;
8. leaves unknown extension keys untouched by the numeric stage;
9. does not mutate the parsed source payload;
10. uses the normalized state overlay in the valid manual-load merge while retaining sanitized flags and existing map fallback/UX behavior.

The manual-slot summary also avoids displaying corrupt non-number `lv` / `gold` values as if they were valid player state.

Implementation checkpoints:
- requirement registration: `57bb2708e488ec6f7be535982db94a889b86200c`
- implementation: `3161047e8f9eee967893dc2b0dc53249a4bd717f`
- dedicated acceptance: `50a269157b3153e24376c138732f181865fd1fa0`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- REQ-049 rejection and REQ-050 dangerous-key contracts remain active;
- finite canonical numeric values survive unchanged;
- numeric strings fall back to canonical numeric DEFAULT rather than remaining strings;
- null/object values in canonical numeric fields fall back safely;
- synthetic later numeric schema keys are discovered dynamically;
- unknown extension keys remain preserved;
- absent numeric defaults are not redundantly injected into the overlay;
- source payload remains unchanged.

GitHub Pages workflow run `34011542116`: SUCCESS.

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

- do not assume JSON object shape means field types are valid;
- do not hard-code an obsolete fixed numeric-field list when DEFAULT is the runtime schema source;
- do not coerce numeric strings into canonical numbers silently; invalid canonical numeric types fall back to the canonical DEFAULT;
- do not over-normalize unknown extension fields;
- do not claim physical iPhone PASS from automation.
