# REQ-034 — iPhone public build world/map black screen

STATUS: READY
PRIORITY: P0
OWNER_AUTHORITY: LATEST_DIRECT_OWNER_DEFECT_REPORT
TYPE: BLOCKING_PUBLIC_VISUAL_RUNTIME_DEFECT
IOS_PHYSICAL_VERIFICATION: FAILED_BY_OWNER_REPORT

## Owner report

The public GitHub Pages build on iPhone is visually broken.

Observed on the Owner's physical iPhone:
- the screen/world area is black/dark
- A / MENU / D-pad style controls are visible
- the actual world/map/player presentation is not visible
- prior cache-bust work did not resolve the visible defect

Owner instruction: 「画面が暗い。直して」

This is the newest direct Owner request and is P0. It preempts lower-priority content expansion, including REQ-033, under WORK_MANAGER.md Owner-preemption rules.

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

## Minimum automated acceptance

The runtime/CI acceptance must fail if any of the following occur in an iPhone-sized viewport:
- uncaught page/runtime error relevant to game boot/render
- `#app` or active game shell has zero usable size
- world screen lacks a rendered `.world` and player with non-zero geometry
- player/world is transformed entirely outside the usable viewport when it should be visible
- an opaque fullscreen layer hides the world unintentionally
- the rendered frame is effectively all-black except controls/overlays

Where technically feasible, use screenshot/pixel/luminance or equivalent visual-liveness verification in addition to structural assertions.

## Completion conditions

Automated implementation completion requires all of:
- root cause identified and recorded
- repair committed on canonical branch
- relevant runtime/browser regression PASS
- latest Pages deployment PASS
- public build contains the repair
- no regression to REQ-021 tap Action, REQ-022 fullscreen world UI, or REQ-001 dynamic touch controller

Physical completion remains:
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner confirms the world/map is actually visible and playable on iPhone.

## Preemption / concurrency note

Do not overwrite concurrent work blindly. Fresh-fetch before writes and use normal GitHub SHA conflict protection. Safely checkpoint/suspend REQ-033 if still IN_PROGRESS, then activate this requirement as the newest Owner P0.