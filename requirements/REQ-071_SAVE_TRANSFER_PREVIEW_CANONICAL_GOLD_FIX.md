# REQ-071 — Save Transfer Preview Canonical Gold Fix

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / TRANSFER / CONSISTENCY-BUG / TEST-QUALITY
OWNER_REQUEST: SELF_AUDIT_REPAIR
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT

Fresh canonical base audit found that LUKE QUEST uses `gold` as the player currency field (`DEFAULT.gold`, status UI `s.gold`, enemy rewards, shops and manual backups). REQ-068 import preview instead rendered `next.g`, and its dedicated smoke also injected/asserted `s.g`. Therefore implementation and test could agree with each other while disagreeing with canonical runtime state, producing a false-green preview that can show `0G` for real saves.

## 1. REQUIRED REPAIR

- Import preview must use canonical `gold` first.
- Legacy/noncanonical `g` may be accepted only as a compatibility fallback if `gold` is genuinely absent/non-finite; it must not override valid canonical `gold`.
- Dedicated acceptance must construct/assert a real canonical `gold` save, not create a fake `g` property.
- Add an adversarial case where both `gold` and `g` exist with different values and prove canonical `gold` wins.
- No mutation to transfer schema, autosave, economy or import behavior.

## 2. COMPLETION

Targeted acceptance + assembled browser regression + 390x844 touch/world regression + Pages SUCCESS. Then mark VERIFY and continue.
