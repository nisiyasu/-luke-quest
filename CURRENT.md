# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 21:22 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `3397feae49b57ad6624c61adb689f781095fc802` (implementation checkpoint; this CURRENT autosave follows it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE. Rollback-safe core + sequential ux patches through v139 + collision-safe addons. Latest implementation adds the Owner-requested floating touch movement controller and explicit formal-Luke dialogue-art guard. Pages workflow for latest implementation is queued/running at autosave time; do not call it deploy-safe until fresh Actions confirms SUCCESS.

## MANDATORY_BOOT_FILES
1. `AUTONOMOUS_DEV_DIRECTIVE.md` FULL TEXT
2. `CURRENT.md`
3. repository metadata / actual default branch / fresh HEAD
4. `index.html`
5. `.github/workflows/pages.yml`
6. all sequential `ux-v*.js` through fresh latest version in numeric order
7. all `addons/*.js`
8. `tools/lq-static-regression.mjs`
9. `tools/lq-addon-contract.mjs`
10. `manifest.webmanifest`
11. `sw.js`
12. `assets/app-icon.svg`
13. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
14. `assets/characters/luke/dialogue-neutral.webp.b64`
15. `assets/portraits/` state
16. recent commits / Actions / Pages state

Fresh HEAD is implementation truth. CURRENT is autosave and may lag after autonomous checkpoints. Never repeat work from CURRENT without HEAD/diff reconstruction.

## WHAT_CHANGED_RECENTLY
- Preserved all previously validated world, optional-area, battle-feedback, map-density and runtime-smoke work through implementation checkpoint `f473022846885a74edff7bfa780b8165d491bc7f`.
- `addons/floating-touch-controller.js`: Owner-requested iPhone movement UX added. On world screen, touching a non-interactive point inside the game viewport summons a translucent four-arrow controller centered near the touch. Sliding from the touch origin into up/down/left/right begins continuous movement; holding continues movement; changing slide direction changes movement; returning toward center stops; pointerup/pointercancel/blur/visibility hidden stop movement. Mouse is excluded. Existing physical D-pad remains available as fallback.
- `addons/luke-formal-dialogue-guard.js`: when the active dialogue speaker is Luke, the dialogue portrait explicitly prefers the already Owner-approved repository WebP hydrated by `ux-v12.js`. It never promotes the fallback SVG. The dialogue box is marked when formal Luke raster art is applied.
- Existing approved Luke asset remains `assets/characters/luke/dialogue-neutral.webp.b64`; no new fake or alternate Luke was created.

## FILES_CHANGED
- `addons/floating-touch-controller.js`
- `addons/luke-formal-dialogue-guard.js`
- `CURRENT.md`

## NEW_ASSETS
- No new image asset created this checkpoint.
- Existing Owner-approved Luke full-body WebP remains authoritative and is now explicitly guarded for Luke dialogue display.

## TESTS_AND_VERIFICATION
- Fresh repository metadata: PASS; actual default branch `main`.
- HEAD/CURRENT reconstruction: PASS; prior CURRENT implementation SHA was one commit behind fresh HEAD only because of CURRENT autosave.
- New files fresh re-fetched from GitHub after commit: PASS for floating touch controller.
- Existing approved Luke WebP transport contract inspected: PASS.
- Existing `ux-v09.js` dialogue portrait layer and `ux-v12.js` formal raster hydration inspected before mutation.
- Existing Pages workflow validates every `addons/*.js` with `node --check` and runs full assembled-browser regression before deploy.
- Latest workflow status at autosave: queued/running, not yet claimed SUCCESS.
- Real-device iPhone touch feel: NOT CLAIMED; requires Owner device.

## KNOWN_ISSUES
- Floating controller needs real iPhone feel-testing for dead-zone size, controller radius and whether the original fixed D-pad should later be hidden by default on coarse-pointer devices.
- Luke field representation is still interim CSS directional art rather than formal approved/generated 4-direction × multi-frame sprite artwork.
- Leon, Glenn, Eleanor and Elisia still lack formal integrated major-character artwork.
- Rapid autonomous commits can make CURRENT stale; always reconstruct from fresh HEAD.

## BLOCKERS
- No blocker for continued code/UI/world/battle development.
- Formal Luke directional sprite integration still requires suitable original/approved four-direction art.
- Real iPhone confirmation requires Owner-device testing.

## NEXT_ACTION
1. Fresh-check latest Actions/Pages result for `3397feae49b57ad6624c61adb689f781095fc802`; fix immediately if regression appears.
2. Treat Owner's two newest requests as top UX/visual priorities: formal generated Luke image whenever Luke speaks, and floating anywhere slide-and-hold movement controller. Do not regress either.
3. Add automated contract/smoke assertions for floating controller presence/safety and formal Luke dialogue marker where practical.
4. After those are deploy-safe, continue highest-value PS1-early player-visible work from DIRECTIVE without treating this list as a session boundary.

## NEXT_ACTION_COMPLETION_CONDITION
- Latest relevant Pages workflow succeeds before deploy-safe claim.
- Floating controller loads without JS/runtime regression and retains centralized release safety.
- Luke dialogue uses the approved formal WebP, not fallback SVG, when formal asset hydration succeeds.
- Safe checkpoint committed and fresh re-fetched.

## DO_NOT_REPEAT
- Do not replace Owner-approved Luke dialogue art with a newly invented different-looking Luke.
- Do not call fallback SVG formal.
- Do not remove centralized pointerup/pointercancel/blur/visibility movement-stop safety.
- Do not make mouse clicks summon the floating controller.
- Do not let world touch movement activate over buttons/dialogue/interactive controls.
- Do not trust stale CURRENT over fresh HEAD.
- Do not expose protected story canon early.

## IMPORTANT_DESIGN_DECISIONS
- Owner-requested floating controller is an additive iPhone control mode: touch game viewport -> translucent four-arrow pad appears at contact -> slide to direction -> hold to continue. Existing D-pad remains fallback until real-device tuning proves the new controller can replace it safely.
- Luke speaking surfaces must prefer the already approved generated/full-body raster asset. The repository's base64 WebP transport remains the formal path.
- PS1-early target continues to mean layered readable 2D presentation, not copied existing-game art.

## STORY_CANON_ADDED_OR_CHANGED
- None.

## PLAYER_GUIDANCE_IMPROVEMENTS
- Floating touch controller reduces thumb travel by allowing movement input directly where the player touches inside the game viewport.
- Active arrow visually brightens so the chosen direction is immediately readable.

## DIALOGUE_VISUAL_PROGRESS
- Luke formal full-body generated/approved WebP: INTEGRATED and now explicitly enforced for Luke world-dialogue portrait surfaces after hydration.
- Luke fallback SVG: fallback only, never formal.
- Leon / Glenn / Eleanor / Elisia formal art: pending.

## BATTLE_VISUAL_PROGRESS
- Existing validated regional battle presentation remains unchanged by this checkpoint.

## MAP_READABILITY_IMPROVEMENTS
- Existing validated route landmarks and environmental density remain unchanged by this checkpoint.

## CHARACTER_CANON_STATUS
- Luke formal large-image canon: blue hair / blue clothing and cloak / silver armor / gold accents. Owner-approved WebP authoritative.
- Luke field direction behavior: UP / DOWN / LEFT / RIGHT LIVE.
- Luke field formal sprite art: NOT YET INTEGRATED.

## PORTRAIT_INTEGRATION_STATUS
- Luke formal full-body: INTEGRATED; dialogue guard added.
- Leon: NOT YET INTEGRATED.
- Glenn: NOT YET INTEGRATED.
- Eleanor: NOT YET INTEGRATED.
- Elisia: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS
- Luke direction logic: 4/4 LIVE.
- Interim direction visuals + step cadence: LIVE.
- Formal Luke 4-direction × 2-3 frame sprite sheet: NOT YET INTEGRATED.

## POST_BATTLE_LINE_VARIETY_STATUS
- Base generic Luke victory lines: 60.
- Situational add-on lines: +30.
- Combined available pool: 90.
- Recent exact-repeat avoidance remains active.

## CHECKPOINT_HISTORY
- `f473022846885a74edff7bfa780b8165d491bc7f` last fully validated/deployed implementation before this run.
- `d2015e5bda1f080ea70d07add6020d4b671cebc2` prior CURRENT autosave.
- `8fdcfe384abaec2daf72b5db873a291b2576ecbd` floating anywhere touch movement controller.
- `3397feae49b57ad6624c61adb689f781095fc802` formal Luke dialogue-art guard.

CURRENT is an autosave, not a stop condition. Continue from fresh HEAD.