# REQ-070 — Manual Backup Destructive Action Guard

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / MANUAL-BACKUP / DATA-LOSS-PREVENTION / PLAYER-UX
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FOLLOW_THROUGH_FROM_SAVE_PORTABILITY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Fresh audit of `addons/manual-save-slots.js` found two remaining one-tap destructive paths: saving into an already-populated manual slot immediately overwrites it, and `×` immediately deletes it. These local backups are part of the player's recovery chain and must not be casually destroyed while cross-browser transfer/data-safety work is being hardened.

## 1. REQUIRED BEHAVIOR

- Saving into an EMPTY slot remains one-tap.
- Saving into a VALID or INVALID/non-empty slot requires an explicit second deliberate confirmation before overwrite.
- Deleting any non-empty slot requires an explicit second deliberate confirmation.
- First destructive tap must preserve raw localStorage bytes exactly.
- Confirmation is scoped to one slot + one action (`overwrite` or `delete`), expires automatically, and another destructive action replaces/disarms the previous arm.
- Successful second tap delegates to the existing canonical `lqManualSave()` / `lqManualDelete()` implementations rather than duplicating storage logic.
- LOAD behavior is unchanged.
- Invalid backup slots remain non-loadable but can still be deliberately overwritten or deleted after confirmation.

## 2. PLAYER FEEDBACK

- Armed overwrite/delete must be obvious in the slot UI, not hidden state.
- The relevant button changes to a confirmation label for the short confirmation window.
- Provide a compact warning/status message in the same MANUAL BACKUP section.

## 3. SAFETY

- No first-tap localStorage mutation.
- Do not modify autosave or other manual slot.
- Do not alter REQ-049/050/051 validation/sanitization contracts.
- Do not create a third save schema.

## 4. TEST REQUIREMENTS

Automated acceptance must prove:
1. empty-slot SAVE remains one-tap;
2. occupied-slot first SAVE preserves exact raw bytes;
3. second armed SAVE delegates to canonical save and replaces the slot;
4. first DELETE preserves exact raw bytes;
5. second armed DELETE delegates to canonical delete;
6. action/slot switch disarms or replaces prior confirmation safely;
7. invalid slot cannot LOAD but can be deliberately overwrite/delete confirmed;
8. assembled browser smoke PASS;
9. 390x844 touch/fullscreen regression PASS;
10. Pages deploy SUCCESS.

## 5. NO-STOP

Completion is a checkpoint, not a stop condition. Run GATE C and continue if safe useful work remains.

## 6. IMPLEMENTATION / VERIFICATION EVIDENCE

- Added `addons/zz-manual-backup-destructive-guard.js` as a confirmation-only wrapper over existing canonical `lqManualSave()` / `lqManualDelete()` authorities.
- EMPTY slot SAVE remains one-tap.
- Occupied or invalid/non-empty slot SAVE first tap preserves exact raw bytes and arms `overwrite`; second deliberate tap within 10 seconds delegates to canonical SAVE.
- Non-empty DELETE first tap preserves exact raw bytes and arms `delete`; second deliberate tap delegates to canonical DELETE.
- Confirmation is scoped to action + slot; selecting another slot/action replaces the previous arm without mutating either backup.
- UI changes the armed action label and renders a compact warning in the corresponding manual slot.
- Added dedicated runtime acceptance `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-manual-backup-destructive-guard-smoke.js` proving empty-slot one-tap behavior, byte-preserving first overwrite/delete taps, canonical second taps, and safe action/slot arm replacement.
- Checkpoints:
  - `574c695161ece6615df54c755eff70bdd5fcfa91` — requirement registration.
  - `124c25471888157ac4422340b219b99e7d327886` — implementation.
  - `4b9ad196b0e517677f152bb526cb278e5ae531d5` — dedicated acceptance.
- Pages workflow run `34018181780`: SUCCESS. Sequential patch validation, collision-safe add-ons, static/add-on contracts, autosave guard, raster/Luke asset gates, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, upload and Pages deploy all passed.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
