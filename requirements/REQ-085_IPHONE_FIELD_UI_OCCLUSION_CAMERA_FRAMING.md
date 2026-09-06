# REQ-085 — iPhone Field UI Occlusion / Camera Framing Fix

STATUS: VERIFY
PRIORITY: P0
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
MODE: PLAYER_VISIBLE_UX_FIX / IPHONE / FIELD_CAMERA / TOUCH
IMPLEMENTATION_COMPLETE: YES
IOS_PHYSICAL_VERIFICATION: PENDING
IOS_PHYSICAL_CAMERA_FRAMING_VERIFICATION: PENDING
IOS_PHYSICAL_CONTROLLER_OPACITY_VERIFICATION: PENDING

## 0. OWNER OBSERVED DEFECT

Owner physical iPhone screenshot and direct report establish the current public-field defects:

1. Top HUD / menu / floating UI overlap each other and become visually congested.
2. Field HUD overlays the playable world such that the player can move underneath the upper UI and become hidden.
3. Dynamic Touch Controller is too opaque and visually dominates the field.
4. The field camera is too zoomed-in. Too little surrounding terrain is visible, making orientation, route reading and nearby-object awareness difficult.

This is the newest direct Owner request and was treated as the highest executable P0 work.

## 1. TOP UI OVERLAP FIX

Repair the iPhone portrait top-region composition so that status HUD, MUSIC control and other top floating UI do not overlap or visually crush one another.

Requirements:

- account for iOS safe-area-inset-top
- account for Safari dynamic viewport/chrome
- keep the world as the primary full-screen surface
- do NOT restore the old vertical stacked control-panel layout
- do NOT reserve a large permanent non-world band merely to make room for HUD
- compact/reflow/reposition floating UI as needed
- preserve readability of LV / HP / G / item / EXP / MP and other canonical status information
- MENU, objective/location and dialogue overlays must remain coherent

IMPLEMENTED:

- status overlay is compacted into the safe top-left region
- MUSIC remains in a dedicated compact top-right slot
- HUD/objective rows are moved below the status row
- fullscreen 100dvh world remains the primary surface
- no old vertical control panel was restored

Primary checkpoints reused from the concurrent partial REQ-091 implementation:

- `46e6fc97ec93209db0e2efcc7850910fbecf1f6d`
- `20c9016d8495c1c3eb7279d5a16606bd3ccb09ab`

## 2. PLAYER MUST NOT DISAPPEAR UNDER HUD

Fullscreen world does not mean the camera may place the player behind opaque or high-attention HUD.

Repair camera framing / safe visible region so that, during ordinary field traversal:

- moving toward the top of the map does not hide the player under status/menu UI
- the player retains useful surrounding world context
- important nearby interactables are not unnecessarily obscured by fixed overlays
- map-edge behavior remains valid
- collision, interactions and map transitions remain canonical

Prefer a unified camera-safe-zone or equivalent geometry-aware solution rather than ad-hoc per-screen offsets.

Do not fake this by shrinking the world into a fixed panel.

IMPLEMENTED:

- camera recenter uses a minimum visible player Y allowance near the top HUD
- small and tall maps preserve edge clamping while respecting the HUD-safe presentation area
- canonical map coordinates/collision/story/save data remain unchanged

Primary checkpoint:

- `4a611a10352bc5d2a2f8138db0daf33929042cab`

## 3. DYNAMIC TOUCH CONTROLLER OPACITY

The Dynamic Touch Controller must be visibly more transparent than the prior public build.

Requirements:

- substantially reduce idle/default opacity
- field tiles and nearby objects must remain clearly visible beneath/around it
- active direction remains readable while the finger is moving
- controller may become slightly more visible while actively engaged and fade further when idle if useful
- preserve dead zone, pointerId ownership, direction switching, continuous movement and stopMoving() behavior
- preserve pointercancel / blur / visibilitychange / dialogue / battle / map-transition stop behavior
- preserve REQ-021 tap-vs-drag semantics
- do not reintroduce fixed D-pad layout dominance

IMPLEMENTED:

- floating controller visual opacity was reduced while keeping the active direction clearly differentiated
- fallback D-pad is also low-opacity at rest and only becomes more visible when actively pressed
- input authority and stopMoving() safety were not replaced or duplicated

Primary checkpoints:

- `995523d2036365035f5b16e33d6c8f54e9be2c59`
- `00497655b9fb4484189dd466604006b0a0bfc0dd`

## 4. CAMERA / WORLD VIEW — SLIGHT ZOOM OUT

The prior iPhone field presentation was too close-up. Increase the visible world area moderately.

Owner intent:

- show more surrounding terrain than the prior public build
- make roads, exits, buildings, terrain structure and destinations easier to understand spatially
- make movement direction easier to infer
- improve the sense of where the player is in the field
- prioritize navigational readability over making the player sprite unnecessarily large

Constraints:

- do not zoom out so far that the player becomes difficult to identify
- do not make UI text or interaction targets unreadably small
- do not implement a naive CSS scale that breaks pointer/touch coordinates
- camera transform, world transform, tile geometry, interactions and hitboxes must remain aligned
- collision coordinates must remain correct
- canonical action() targeting must remain correct
- Dynamic Touch movement direction must remain correct
- map transition coordinates must remain correct
- black-screen/world-plane regression must not return

IMPLEMENTED:

- iPhone portrait camera scale is `0.88`, a modest one-step zoom-out
- world logical dimensions and canonical game coordinates remain unchanged
- camera calculations use the scaled visual map/player dimensions so clamp and HUD-safe positioning remain coherent
- world transform origin is fixed at top-left for deterministic alignment
- portrait-only behavior leaves wider/desktop layouts at scale 1
- runtime smoke records camera scale and requires the logical visible viewport to expand by at least 8%

Zoom-out checkpoint:

- `3143239f670866d3e08d3a534486ab1108d519dd`

## 5. INTEGRATION CONSTRAINTS

This fix preserves and regresses against:

- REQ-021 Tap Anywhere Action
- REQ-022 iPhone Fullscreen World UI
- REQ-001 Dynamic Touch Controller
- REQ-034 black-world-screen repair
- dialogue overlays
- objective/location overlays
- MENU and A floating controls
- battle/shop/inventory exclusions
- existing save compatibility

No second independent touch authority was created. Tap/drag distinction remains single-source.

## 6. REQUIRED AUTOMATED ACCEPTANCE

390x844 iPhone portrait-equivalent acceptance is integrated in the Pages workflow.

PASS evidence:

- top overlay compaction / safe-area layout included
- player north-edge visibility protection included
- Dynamic Touch lower-opacity presentation included
- camera zoom-out scale is checked by the fullscreen runtime smoke
- logical visible viewport expansion is checked by the fullscreen runtime smoke
- tap anywhere / drag / pointerup / pointercancel / blur / dialogue / battle / map-transition touch regression remains in the existing integrated smoke
- transparent controls plane and world/player/tile visual-liveness remain fail-closed checks
- JavaScript/add-on/static/browser regressions passed
- Pages build/upload/deploy passed

Pages evidence:

- pre-zoom integrated HUD/controller/player-safety build: run `34031126525` SUCCESS on `4a611a10352bc5d2a2f8138db0daf33929042cab`
- complete REQ-085 including portrait zoom-out: run `34031527694` SUCCESS on `3143239f670866d3e08d3a534486ab1108d519dd`

PUBLIC_BUILD_INCLUSION: PASS
AUTOMATED_390x844_VERIFICATION: PASS

## 7. PHYSICAL VERIFICATION BOUNDARY

Automated/browser/Pages success is not Owner physical approval.

Until the Owner checks the published iPhone build:

IOS_PHYSICAL_VERIFICATION = PENDING
IOS_PHYSICAL_CAMERA_FRAMING_VERIFICATION = PENDING
IOS_PHYSICAL_CONTROLLER_OPACITY_VERIFICATION = PENDING

## 8. DUPLICATE REQUIREMENT RECOVERY

A concurrent autonomous run created `REQ-091_IPHONE_FIELD_UI_OCCLUSION_FIX.md` for the first three defects while REQ-085 was being registered. REQ-091 did not contain the later Owner-requested zoom-out and is therefore superseded by this complete requirement.

Its valid implementation commits were preserved and reused; no code was repeated merely to satisfy metadata.

## 9. COMPLETION / NO-STOP

REQ-085 implementation and public automated acceptance are complete enough for VERIFY.

Creating this requirement, committing it, Pages SUCCESS, or moving it to VERIFY is not an execution stop condition. Owner physical/subjective verification remains pending while autonomous development continues under the queue/continue gate.
