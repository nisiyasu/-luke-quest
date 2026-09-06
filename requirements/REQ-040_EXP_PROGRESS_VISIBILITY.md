# REQ-040 — EXP Progress Visibility

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / PROGRESSION / HUD / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh inventory confirmed canonical EXP progression already exists through `s.xp`, `s.nx` and `win()`, but the normal HUD did not show current EXP / next-level progress. This was a presentation gap, not a missing progression system.

## IMPLEMENTATION

`addons/exp-progress-visibility.js` adds compact read-only EXP progress to the existing status presentation.

Behavior:

1. preserves canonical `s.xp`, `s.nx`, `win()` and all progression mutation unchanged;
2. wraps the existing `status()` HTML generator rather than creating a second HUD/state system;
3. displays `EXP current/threshold` plus a 4px proportional meter;
4. uses `pointer-events:none` and does not create a fixed/fullscreen layer;
5. safely normalizes malformed values: invalid EXP -> 0, invalid/nonpositive threshold -> 1, visible percent clamped to 0..100;
6. updates naturally through the existing render/status lifecycle;
7. writes no save/progression state.

## INTEGRATED SELF-AUDIT REPAIR

After the first successful deployment, a deeper assembled-order audit found a real mobile-layout risk:

- base HUD has 4 status cells;
- `mp-skill-system.js` adds MP and sets `.status` to 5 columns;
- REQ-040 adds EXP, making the assembled HUD 6 cells;
- because the MP stylesheet loads after the EXP stylesheet, a same-specificity 6-column rule would be overridden and the sixth cell could wrap to a second row, thickening the iPhone HUD and stealing world space.

This was repaired before treating the integration as stable:

- checkpoint `5b690dd1ed3f54b9831fba03d29f984e11971ebf` marks the status grid with `lqExpStatusGrid` and uses a higher-specificity 6-column contract;
- EXP min-width is removed inside the integrated grid so all six cells fit the available width;
- mobile spacing/font sizing is reduced without creating a second vertical panel;
- checkpoint `63c10ae91b2d65d00ecb11583b18e1fd26874c48` extends the smoke to require six computed columns, a single row, and continued presence of the MP value;
- Pages run `34009469016`: SUCCESS, including assembled browser smoke, 390x844 touch/world visual-liveness and deploy.

## STATUS / ACCEPTANCE SURFACE

`window.LQ_EXP_PROGRESS_STATUS` records:

- presentation-only ownership;
- canonical sources `s.xp` / `s.nx`;
- no-save-mutation;
- pointer safety;
- no-fullscreen-layer;
- integrated status column count = 6;
- MP-compatible single-row contract;
- normalization and sample/read helpers.

Dedicated `lqTouchSmoke` acceptance verifies:

- canonical source/no-mutation contract;
- `7/20 -> 35%` math;
- malformed threshold fallback `0/1 -> 0%`;
- live EXP DOM and meter;
- pointer safety/no fixed layer;
- six-column computed grid;
- all HUD children remain on one row;
- MP remains visible after EXP integration.

Failures trigger a fail-closed uncaught runtime marker consumed by the existing browser workflow detector.

## IPHONE / FULLSCREEN SAFETY

REQ-022 and REQ-034 remain controlling UX constraints:

- world/map remains the visual priority;
- EXP stays inside the compact status overlay;
- no opaque fullscreen plane;
- no new bottom control strip;
- the latest 390x844 floating-touch/world visual-liveness regression is green.

## VERIFICATION EVIDENCE

Initial dedicated acceptance checkpoint: `091e4176732cc62a13c9d17e994c607a634cd7e5`.
Initial Pages run `34009253993`: SUCCESS.

Integrated HUD repair checkpoints:

- `5b690dd1ed3f54b9831fba03d29f984e11971ebf`
- `63c10ae91b2d65d00ecb11583b18e1fd26874c48`
- Pages run `34009469016`: SUCCESS

Latest integrated verification passed JS/add-on/static checks, assembled gameplay smoke, dedicated EXP contract, 390x844 floating-touch/world visual-liveness, upload and Pages deploy.

## COMPLETION CONDITION

Automated completion is satisfied after the single-row integrated HUD repair.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the compact EXP display on iPhone.

Therefore REQ-040 remains `VERIFY`, not DONE.

## DO NOT REPEAT

- do not add a second EXP system
- do not mutate `xp`/`nx` from the presentation layer
- do not let EXP+MP turn the compact HUD into a second row
- do not add a large vertical status panel
- do not regress fullscreen world visibility
- do not mark iPhone physical readability PASS from headless CI