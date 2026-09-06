# REQ-070 — Manual Backup Destructive Action Guard

STATUS: IN_PROGRESS
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
