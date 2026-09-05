# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 21:40 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `3397feae49b57ad6624c61adb689f781095fc802` (implementation checkpoint; queue-management/documentation checkpoints may be ahead of this SHA)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE. Rollback-safe core + sequential ux patches through v139 + collision-safe addons. Latest implementation adds the Owner-requested floating touch movement controller and explicit formal-Luke dialogue-art guard. Never infer current deploy safety from this autosave alone; fresh Actions/Pages state is required.
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED`
- WORK_MANAGER: `WORK_MANAGER.md`
- WORK_QUEUE: `WORK_QUEUE.md`
- ACTIVE_REQUIREMENT_ID: `REQ-002`
- ACTIVE_REQUIREMENT_PATH: `requirements/REQ-002_LUKE_DIALOGUE_ART.md`
- VERIFY_REQUIREMENTS: `REQ-001`
- NEXT_QUEUED_REQUIREMENT_ID: `REQ-003`

## MANDATORY_BOOT_FILES
1. repository metadata / actual default branch / fresh HEAD
2. `AUTONOMOUS_DEV_DIRECTIVE.md` FULL TEXT
3. `WORK_MANAGER.md` FULL TEXT
4. `WORK_QUEUE.md` FULL TEXT
5. `CURRENT.md` FULL TEXT
6. active requirement file from WORK_QUEUE/CURRENT (`requirements/REQ-xxx_*.md`)
7. `index.html`
8. `.github/workflows/pages.yml`
9. all sequential `ux-v*.js` through fresh latest version in numeric order
10. all `addons/*.js`
11. `tools/lq-static-regression.mjs`
12. `tools/lq-addon-contract.mjs`
13. `manifest.webmanifest`
14. `sw.js`
15. `assets/app-icon.svg`
16. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
17. `assets/characters/luke/dialogue-neutral.webp.b64`
18. `assets/portraits/` state
19. recent commits / Actions / Pages state

Fresh HEAD is implementation truth. CURRENT is autosave and may lag after autonomous checkpoints. Never repeat work from CURRENT without HEAD/diff reconstruction.

## WORK_MANAGEMENT_REALITY
- Queue-controlled work management is now active.
- `WORK_MANAGER.md` defines recovery, WIP=1, priority selection, blocker handling, VERIFY handling, checkpoint behavior, and how new Owner requests become individual requirement files rather than additions to one giant prompt.
- `WORK_QUEUE.md` is the authoritative full inventory of Owner-requested work and its ORDER / PRIORITY / STATUS.
- `REQ-002` is the single `IN_PROGRESS` item: make Luke's speaking graphic use the Owner-approved/generated formal artwork in the real published dialogue path, with no fake completion from a guard/source path alone.
- `REQ-001` is `VERIFY`: the anywhere-touch floating controller is already implemented/published at implementation level, but dedicated pointer-drag regression and Owner physical iPhone feel verification remain relevant.
- `REQ-003` is the next `READY` P0 item: formal Luke four-direction × multi-frame field sprite.
- `VERIFY` does not consume the WIP slot and does not stop independent development.
- CURRENT updates, WORK_QUEUE updates, commits, Pages success and requirement completion are autosave/checkpoints, not execution-stop conditions.

## WHAT_CHANGED_RECENTLY
- Preserved all previously validated world, optional-area, battle-feedback, map-density and runtime-smoke work through implementation checkpoint `f473022846885a74edff7bfa780b8165d491bc7f`.
- `addons/floating-touch-controller.js`: Owner-requested iPhone movement UX added. On world screen, touching a non-interactive point inside the game viewport summons a translucent four-arrow controller centered near the touch. Sliding from the touch origin into up/down/left/right begins continuous movement; holding continues movement; changing slide direction changes movement; returning toward center stops; pointerup/pointercancel/blur/visibility hidden stop movement. Mouse is excluded. Existing physical D-pad remains available as fallback.
- `addons/luke-formal-dialogue-guard.js`: when the active dialogue speaker is Luke, the dialogue portrait explicitly prefers the already Owner-approved repository WebP hydrated by `ux-v12.js`. It never promotes the fallback SVG. The dialogue box is marked when formal Luke raster art is applied.
- Existing approved Luke asset remains `assets/characters/luke/dialogue-neutral.webp.b64`; no new fake or alternate Luke was created.
- Management migration added `WORK_MANAGER.md`, `WORK_QUEUE.md`, `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md`, `requirements/REQ-002_LUKE_DIALOGUE_ART.md`, and `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md`.

## FILES_CHANGED
Recent implementation:
- `addons/floating-touch-controller.js`
- `addons/luke-formal-dialogue-guard.js`

Management migration:
- `WORK_MANAGER.md`
- `WORK_QUEUE.md`
- `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md`
- `requirements/REQ-002_LUKE_DIALOGUE_ART.md`
- `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md`
- `CURRENT.md`

## NEW_ASSETS
- No new image asset created by the management migration.
- Existing Owner-approved Luke full-body WebP transport remains authoritative; REQ-002 requires verifying/reconciling the actual published speaking graphic rather than trusting metadata alone.

## TESTS_AND_VERIFICATION
- Fresh repository metadata/default branch reconstruction previously confirmed `main`; every future run must repeat this fresh check.
- Fresh HEAD after management-file creation was documentation checkpoint `8d6c397844ef6fbdc6421de9783bc0442334e6ac`; it is ahead of the implementation SHA because queue/requirement files were added.
- Existing floating touch controller implementation and Luke dialogue guard remain implementation reality from the prior checkpoint.
- Management files were created as independent GitHub checkpoints and must be fresh-fetched after this CURRENT update.
- Existing Pages workflow validates JavaScript/addons and assembled browser regressions; deploy status must always be checked fresh before claiming current production success.
- Real-device iPhone touch feel: NOT CLAIMED; requires Owner device.
- Owner visual confirmation that the published Luke speaking graphic is the intended formal image remains part of REQ-002 verification.

## KNOWN_ISSUES
- Floating controller needs real iPhone feel-testing for dead-zone size, controller radius and whether the original fixed D-pad should later be hidden by default on coarse-pointer devices.
- Dedicated automated pointer-drag regression for REQ-001 is still desirable even though the implementation exists.
- Luke field representation is still interim CSS directional art rather than formal approved/generated 4-direction × multi-frame sprite artwork.
- Leon, Glenn, Eleanor and Elisia still lack formal integrated major-character artwork.
- Rapid autonomous commits can make CURRENT stale; always reconstruct from fresh HEAD.

## BLOCKERS
- No blocker for continued code/UI/world/battle development.
- Formal Luke directional sprite integration still requires suitable original/approved four-direction art.
- Real iPhone confirmation requires Owner-device testing.
- Owner physical/subjective checks never block independent READY work; use VERIFY status.

## NEXT_ACTION
1. Recover `REQ-002` from fresh HEAD and inspect the actual Luke speaking-image route, current hydrated WebP, dialogue routing, source guard, workflow publication path and published behavior. Do not assume CURRENT's earlier `INTEGRATED` wording proves the visible graphic is the intended one.
2. Satisfy `requirements/REQ-002_LUKE_DIALOGUE_ART.md` as far as can be verified autonomously; checkpoint safe changes, update queue to VERIFY when implementation conditions are met, and continue.
3. Then take highest-priority READY item under `WORK_MANAGER.md`; currently `REQ-003` unless Owner reorders the queue.
4. Independently keep `REQ-001` in VERIFY until remaining automated pointer-flow coverage and/or Owner iPhone feel verification justify DONE.

## NEXT_ACTION_COMPLETION_CONDITION
- `REQ-002` implementation conditions are judged against its detailed requirement file, not against old prose in CURRENT.
- Actual published Luke dialogue route uses the intended formal generated/approved artwork and does not silently fall back to wrong/simple art.
- Safe checkpoint committed and fresh re-fetched.
- Queue/CURRENT synchronized to repository reality.
- Completion of REQ-002 does not stop execution; continue with next READY requirement while environment allows.

## DO_NOT_REPEAT
- Do not replace Owner-approved Luke dialogue art with a newly invented different-looking Luke.
- Do not call fallback SVG formal.
- Do not remove centralized pointerup/pointercancel/blur/visibility movement-stop safety.
- Do not make mouse clicks summon the floating controller.
- Do not let world touch movement activate over buttons/dialogue/interactive controls.
- Do not trust stale CURRENT over fresh HEAD.
- Do not expose protected story canon early.
- Do not append every new Owner request to the giant global directive; create/register a requirement file under queue control.
- Do not run multiple IN_PROGRESS requirements without an explicit WIP-policy change.
- Do not let VERIFY items block safe independent work.

## IMPORTANT_DESIGN_DECISIONS
- LUKE QUEST now uses queue-controlled requirement management. Global permanent rules remain in `AUTONOMOUS_DEV_DIRECTIVE.md`; request-specific implementation detail belongs in `requirements/`; priority and execution state belong in `WORK_QUEUE.md`; recovery/selection rules belong in `WORK_MANAGER.md`; CURRENT remains autosave/handoff.
- Owner-requested floating controller is an additive iPhone control mode: touch game viewport -> translucent four-arrow pad appears at contact -> slide to direction -> hold to continue. Existing D-pad remains fallback until real-device tuning proves the new controller can replace it safely.
- Luke speaking surfaces must prefer the already approved generated/full-body raster asset. The repository's base64 WebP transport remains the formal path unless fresh reality proves a safer verified path is needed.
- PS1-early target continues to mean layered readable 2D presentation, not copied existing-game art.

## STORY_CANON_ADDED_OR_CHANGED
- None.

## PLAYER_GUIDANCE_IMPROVEMENTS
- Floating touch controller reduces thumb travel by allowing movement input directly where the player touches inside the game viewport.
- Active arrow visually brightens so the chosen direction is immediately readable.

## DIALOGUE_VISUAL_PROGRESS
- Luke formal generated/approved artwork infrastructure exists, but `REQ-002` is deliberately IN_PROGRESS until fresh implementation/published-output verification proves the actual speaking graphic is the intended one.
- Luke fallback SVG: fallback only, never formal.
- Leon / Glenn / Eleanor / Elisia formal art: pending.

## BATTLE_VISUAL_PROGRESS
- Existing validated regional battle presentation remains unchanged by the management migration.

## MAP_READABILITY_IMPROVEMENTS
- Existing validated route landmarks and environmental density remain unchanged by the management migration.

## CHARACTER_CANON_STATUS
- Luke formal large-image canon: blue hair / blue clothing and cloak / silver armor / gold accents. Owner-approved generated artwork is authoritative.
- Luke field direction behavior: UP / DOWN / LEFT / RIGHT LIVE.
- Luke field formal sprite art: NOT YET INTEGRATED.

## PORTRAIT_INTEGRATION_STATUS
- Luke: implementation path exists; REQ-002 IN_PROGRESS until actual intended published speaking graphic is freshly verified/reconciled.
- Leon: NOT YET INTEGRATED.
- Glenn: NOT YET INTEGRATED.
- Eleanor: NOT YET INTEGRATED.
- Elisia: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS
- Luke direction logic: 4/4 LIVE.
- Interim direction visuals + step cadence: LIVE.
- Formal Luke 4-direction × 2-3 frame sprite sheet: NOT YET INTEGRATED; REQ-003 READY.

## TOUCH_CONTROLLER_STATUS
- REQ-001: VERIFY.
- Anywhere-touch translucent four-arrow controller implementation: LIVE at implementation level.
- Four-direction slide/hold movement: implemented.
- Centralized release/cancel/blur/visibility cleanup: implemented.
- Fixed D-pad/keyboard fallback: preserved.
- Dedicated pointer-drag automated regression: remaining verification/improvement item.
- Owner physical iPhone feel verification: PENDING.

## POST_BATTLE_LINE_VARIETY_STATUS
- Base generic Luke victory lines: 60.
- Situational add-on lines: +30.
- Combined available pool: 90.
- Recent exact-repeat avoidance remains active.

## CHECKPOINT_HISTORY
- `f473022846885a74edff7bfa780b8165d491bc7f` last fully validated/deployed implementation before floating-controller/Luke-guard work.
- `8fdcfe384abaec2daf72b5db873a291b2576ecbd` floating anywhere touch movement controller.
- `3397feae49b57ad6624c61adb689f781095fc802` formal Luke dialogue-art guard implementation checkpoint.
- queue-management documentation commits after implementation checkpoint create `WORK_MANAGER.md`, `WORK_QUEUE.md`, REQ-001, REQ-002 and REQ-003; documentation HEAD may therefore be ahead of `LATEST_COMMIT_SHA` without implying unrecorded game-code changes.

CURRENT is an autosave, not a stop condition. Continue from fresh HEAD under WORK_MANAGER and WORK_QUEUE control.