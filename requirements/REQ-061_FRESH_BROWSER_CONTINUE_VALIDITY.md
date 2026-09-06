# REQ-061 — Fresh-Browser Continue Validity

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / TITLE / INTEGRITY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FROM_RECENT_SAVE_TRANSFER_AUDIT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT

Fresh audit after REQ-060 confirmed a real base-runtime defect:

- `render()` calls canonical `save()` before rendering the title.
- On a completely fresh browser, the default state is `screen:'title'`.
- The first `render()` therefore creates `localStorage['lukeQuestV2']` even though no adventure has started.
- `title()` currently decides whether to show `つづきから` only by testing whether that storage key exists.

Result: a fresh browser can show a false Continue option backed only by the untouched default/title snapshot.

This is especially confusing now that REQ-060 explicitly supports transferring real progress between browsers.

## 1. REQUIRED BEHAVIOR

Title Continue must mean "there is a playable/resumable save", not merely "the autosave key exists".

Required:

- Completely fresh browser / untouched DEFAULT title state: NO Continue.
- New Game after intro/world progress has been saved: Continue available after reload.
- Existing legitimate world saves: Continue remains available.
- Existing legitimate intro saves: Continue remains available.
- REQ-060 valid imported save: Continue remains available after import/reload.
- Invalid/corrupt/primitive/array autosave must not create a false Continue affordance.
- Do not delete a legitimate existing save merely to hide a button.
- Do not break current autosave, manual backup, save-transfer, touch/fullscreen or Pages behavior.

## 2. COMPATIBILITY

Do not require a new marker as the sole authority if doing so would hide existing users' legitimate pre-marker saves.

Prefer a migration-safe predicate over stored state. A stored save may be considered resumable when it is a valid plain object and represents a legitimate playable/intro state or otherwise clearly differs from untouched default-title bootstrap state.

The exact predicate must fail closed for malformed state while preserving known legitimate legacy saves.

## 3. IMPLEMENTATION CONSTRAINTS

- Preserve canonical `save()` unless changing it is demonstrably necessary.
- Keep this fix isolated in an add-on if possible.
- It is acceptable for the base bootstrap to continue writing the harmless default-title snapshot; the player-visible Continue decision must not treat that bootstrap snapshot as progress.
- REQ-060 title SAVE TRANSFER import UI must remain visible even when Continue is hidden.

## 4. ACCEPTANCE

Automated acceptance must prove at least:

1. no storage before first render → first title render may create bootstrap storage but Continue is absent;
2. untouched DEFAULT/title stored snapshot → Continue absent;
3. valid intro save → Continue present;
4. valid world save → Continue present;
5. representative progressed legacy world save → Continue present;
6. malformed JSON/primitive/array → Continue absent and no runtime crash;
7. REQ-060 imported save → Continue present;
8. SAVE TRANSFER import remains visible on fresh title;
9. existing manual-backup contract remains intact;
10. assembled browser smoke PASS;
11. 390x844 touch/fullscreen regression PASS;
12. Pages deploy SUCCESS.

Physical iPhone observation remains PENDING unless actually observed.

## 5. NO-STOP

Completing REQ-061 is a checkpoint, not a stop condition. Fresh-fetch HEAD, synchronize queue/CURRENT as needed, run GATE C, and continue another safe useful requirement when available.
