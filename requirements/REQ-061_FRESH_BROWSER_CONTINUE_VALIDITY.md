# REQ-061 — Fresh-Browser Continue Validity

STATUS: VERIFY
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

Implemented migration-safe predicate over stored state. A stored save is resumable when it parses as a plain object and uses a known resumable runtime screen (`intro`, `world`, `battle`). The untouched bootstrap `screen:'title'` state is not resumable.

## 3. IMPLEMENTATION

### `addons/title-continue-validity.js`

- keeps canonical `save()` unchanged;
- parses the stored autosave fail-closed;
- distinguishes resumable screens from bootstrap title state;
- removes only the false `つづきから` affordance when the stored payload is non-resumable;
- does not delete stored data merely to hide the button;
- wraps the already-composed title/render path late enough to preserve REQ-060 SAVE TRANSFER title UI.

### `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-title-continue-validity-smoke.js`

Runtime acceptance covers:
- truly fresh bootstrap through `render()`;
- untouched DEFAULT/title payload;
- intro save;
- world save;
- representative legacy progressed world save;
- malformed JSON;
- array payload;
- primitive payload;
- REQ-060 export/import then Continue availability;
- fresh-title SAVE TRANSFER import visibility;
- existing manual-backup contract preservation.

## 4. CHECKPOINTS

- requirement registration: `76af2a95ba46c4329b811fb48fcb2eb12cd7c04b`
- implementation: `76fe6757ba1fdd65a02804e959dcc1c609b6c77f`
- fail-closed acceptance: `ced6bc6ac3645fad6e91c1409f9a6f8e9d04e223`

## 5. VERIFICATION

GitHub Pages workflow run `34015384336`: SUCCESS.

Observed successful stages:
- sequential JavaScript validation: PASS;
- collision-safe add-on validation: PASS;
- static regression guard: PASS;
- add-on contract guard: PASS;
- PWA/raster/Luke asset validation: PASS;
- assembled browser smoke including REQ-061 fail-closed runtime acceptance: PASS;
- 390x844 floating-touch + iPhone world visual-liveness regression: PASS;
- Pages upload: PASS;
- Pages deploy: PASS.

The published assembled build therefore suppresses false Continue on bootstrap title while retaining Continue for legitimate intro/world/imported saves.

Physical iPhone observation remains `IOS_PHYSICAL_VERIFICATION=PENDING` and is not claimed from automation.

## 6. ACCEPTANCE

1. no storage before first render → bootstrap storage may be created but Continue absent — PASS
2. untouched DEFAULT/title stored snapshot → Continue absent — PASS
3. valid intro save → Continue present — PASS
4. valid world save → Continue present — PASS
5. representative progressed legacy world save → Continue present — PASS
6. malformed JSON/primitive/array → Continue absent in the title validity path without runtime failure — PASS
7. REQ-060 imported save → Continue present — PASS
8. SAVE TRANSFER import remains visible on fresh title — PASS
9. existing manual-backup contract remains intact — PASS
10. assembled browser smoke — PASS
11. 390x844 touch/fullscreen regression — PASS
12. Pages deploy — PASS (`34015384336`)

## 7. NO-STOP

REQ-061 automated completion is a checkpoint, not a stop condition. Fresh-fetch HEAD, synchronize queue/CURRENT as needed, run GATE C, and continue another safe useful requirement when available.
