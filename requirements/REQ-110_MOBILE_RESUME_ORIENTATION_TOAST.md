# REQ-110 — Mobile Resume Orientation Toast

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: MOBILE UX / ORIENTATION / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. PROBLEM

iPhone play is frequently interrupted by app switching, browser chrome, notifications, or temporarily backgrounding the page. When the player returns to a long first-chapter pursuit route, they should not need to reconstruct their location and immediate objective from memory.

## 2. PURPOSE

When an already-running world session becomes visible again after being backgrounded, show a compact transient orientation toast containing:

- CURRENT AREA
- NOW / immediate spoiler-safe objective

The toast is a reminder only. It must not become a new quest/state system.

## 3. PRESENTATION

- world overlay only
- compact top/upper-middle presentation that avoids permanent viewport consumption
- automatically disappears after a short interval
- pointer-events none
- must not cover or disable MENU / Action / Dynamic Touch Controller
- no world-bottom fixed panel
- no permanent HUD row
- respect safe-area layout
- reduced-motion safe

## 4. STATE / CANON

- derive area from canonical `MAPS[s.map].name`
- reuse Adventure Journal spoiler-safe main objective authority when available
- no new required story flag
- no save schema change
- no map/gate/collision/battle/reward mutation
- no future-location spoiler

## 5. INPUT SAFETY

REQ-021 / REQ-022 / REQ-001 remain protected:

- no pointerdown/move/up/cancel authority
- no Action call
- no movement call
- no `stopMoving()` replacement
- existing hidden-state `visibilitychange` stop remains untouched
- toast is pointer-events none

## 6. BEHAVIOR

- record when the document becomes hidden
- on a later transition back to visible, if the game is currently `screen==='world'`, show the orientation toast
- do not show on title, battle, shop, inventory, or other non-world screens
- repeated resume replaces the previous toast rather than stacking duplicates
- map changes before a later resume must use fresh current area/objective

## 7. ACCEPTANCE

Fail-closed runtime acceptance must verify:

- canonical current area is used
- Adventure Journal main objective is reused
- unrelated/non-world screen produces no toast
- world resume helper produces exactly one toast
- CURRENT AREA and NOW semantics exist
- toast and all descendants are pointer-safe
- duplicate invocation does not stack
- cleanup removes toast
- save/story/gate authority is not mutated
- P0 input/fullscreen status remains present

Broken REQ-110 must emit a dedicated failure marker and fail assembled browser smoke before Pages upload.

## 8. PUBLIC GATE

Before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- assembled browser PASS including REQ-110 self-acceptance
- 390x844 Touch/Fullscreen PASS
- north-route regressions PASS
- Pages workflow SUCCESS on complete implementation HEAD

## 9. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 10. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
