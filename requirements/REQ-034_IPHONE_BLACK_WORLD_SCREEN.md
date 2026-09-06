# REQ-034 — iPhone public build world/map black screen

STATUS: VERIFY
PRIORITY: P0
OWNER_AUTHORITY: LATEST_DIRECT_OWNER_DEFECT_REPORT
TYPE: BLOCKING_PUBLIC_VISUAL_RUNTIME_DEFECT
IOS_PHYSICAL_VERIFICATION: PENDING

## Owner report

The public GitHub Pages build on iPhone was visually broken.

Observed on the Owner's physical iPhone:
- the screen/world area was black/dark
- A / MENU / D-pad style controls were visible
- the actual world/map/player presentation was not visible
- prior cache-bust work did not resolve the visible defect

Owner instruction: 「画面が暗い。直して」

This was the newest direct Owner request and P0. It preempted lower-priority content expansion, including REQ-033, under WORK_MANAGER.md Owner-preemption rules.

## Required handling

1. Fresh-fetch default branch HEAD and current Pages/workflow state before changing implementation.
2. Treat the physical iPhone screenshot/report as authoritative evidence that prior structural/browser smoke tests were insufficient.
3. Do not assume Service Worker/cache is the root cause merely because cache recovery was attempted.
4. Diagnose the actual visual/runtime cause, including at minimum:
   - world/map/player DOM existence and non-zero geometry
   - camera transform / recenter logic
   - fullscreen iPhone CSS and stacking/overflow/visibility
   - black fullscreen backgrounds/overlays that can cover the world
   - runtime exceptions during/after render
   - script/add-on ordering and render wrappers
   - mobile viewport / 100dvh / visualViewport behavior
   - stale PWA/service-worker behavior only as one candidate, not the default conclusion
5. Repair the defect at the smallest safe root-cause layer.
6. Add a regression gate that can detect a visually dead/near-black world, not merely the existence of DOM markers.
7. Verify the public Pages deployment after repair.
8. Keep IOS_PHYSICAL_VERIFICATION=PENDING after automated repair until Owner confirms the world is visible on the physical iPhone.

## Root-cause class found

The fullscreen presentation layer had an under-constrained compositor contract on exactly the two planes implicated by the Owner screenshot:

- `.world` contains absolutely positioned map/player children but the fullscreen layer did not explicitly give the world plane map-sized width/height. That left a transformed parent whose own layout geometry could be zero/browser-dependent even while descendants existed.
- `.controls` was promoted to a viewport-sized, high-z-index overlay, but the fullscreen rule did not explicitly neutralize inherited/future background, border, shadow or background-image presentation on that plane. A controls plane that paints dark can cover both the map and the lower-z status overlay while leaving A/MENU/D-pad visible, matching the reported symptom class.
- the old smoke test only proved DOM/class/position existence. It did not prove world/player geometry, viewport intersection, transparent controls plane or visible map paint at an iPhone-sized viewport.

The repair therefore hardens the root presentation contract rather than treating cache as the cause.

## Repair implemented

`addons/zzzz-iphone-fullscreen-world-ui.js` v1.0.4 now:

- gives `.world` explicit map-sized width and height on every camera recenter
- keeps the world plane displayed/visible with a stable z-index and visible overflow
- centers maps smaller than the viewport and clamps larger maps around the player
- forces the full-screen controls plane itself transparent and removes inherited background-image/border/shadow presentation while preserving interactive child controls
- keeps existing status/HUD/dialogue/touch-controller stacking above the world
- adds iPhone visual-liveness runtime assertions for shell/world/player non-zero geometry, world/player viewport intersection, transparent controls plane, visible map tile geometry and actual tile/pseudo-element paint

`.github/workflows/pages.yml` now runs the floating-touch + world visual test at `390x844`, so REQ-021/REQ-001 input behavior and REQ-022/REQ-034 presentation are exercised together.

## Minimum automated acceptance

The runtime/CI acceptance fails if any of the following occur in an iPhone-sized viewport:
- uncaught page/runtime error relevant to game boot/render
- active game shell has zero/insufficient usable size
- world or player has zero/insufficient geometry
- player/world is transformed entirely outside the usable viewport
- the full-screen controls plane becomes opaque
- visible world tile geometry disappears
- no visible map paint is detected across tile / pseudo-element presentation
- integrated floating-touch regression fails

## Verification evidence

- world presentation repair checkpoint: `5d010f33f73427b61d8892de01b199a2feaef5ee`
- CI visual gate checkpoint: `e9cb5bd747370e4fe911afbc3cfb7e7de89b5611`
- first strengthened gate correctly failed on an over-narrow paint detector instead of false-passing, proving the new gate was fail-closed
- paint-aware gate repair checkpoint: `0d59369c20fd242e3fd0f48cd833386e8b18af55`
- Pages workflow run `34006670133`: SUCCESS
- assembled browser smoke: SUCCESS
- iPhone-sized floating touch + visible world geometry/paint smoke: SUCCESS
- Pages upload/deploy: SUCCESS

## Completion conditions

Automated implementation completion is satisfied:
- root-cause class identified and recorded
- repair committed on canonical branch
- relevant runtime/browser regression PASS
- latest Pages deployment PASS
- public build contains the repair
- REQ-021 tap Action / REQ-001 Dynamic Touch integrated smoke remains PASS

Physical completion remains:
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner confirms the world/map is actually visible and playable on iPhone.

## Preemption / concurrency note

REQ-033 was completed enough for automated VERIFY before preemption and was closed to VERIFY rather than left as active WIP. REQ-034 then became the sole IN_PROGRESS requirement under WIP=1.

## DO NOT REPEAT

- do not treat structural DOM existence as proof of visible world presentation
- do not default to Service Worker/cache as the root cause of a controls-visible/world-dark screenshot
- do not mark iPhone physical PASS from headless Chrome
- do not allow a future fullscreen controls container to paint an opaque viewport background
- do not remove explicit world-plane geometry without an equivalent tested compositor contract