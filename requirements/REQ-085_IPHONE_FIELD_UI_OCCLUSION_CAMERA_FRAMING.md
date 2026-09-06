# REQ-085 — iPhone Field UI Occlusion / Camera Framing Fix

STATUS: READY
PRIORITY: P0
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
MODE: PLAYER_VISIBLE_UX_FIX / IPHONE / FIELD_CAMERA / TOUCH

## 0. OWNER OBSERVED DEFECT

Owner physical iPhone screenshot and direct report establish the current public-field defects:

1. Top HUD / menu / floating UI overlap each other and become visually congested.
2. Field HUD overlays the playable world such that the player can move underneath the upper UI and become hidden.
3. Dynamic Touch Controller is too opaque and visually dominates the field.
4. The field camera is too zoomed-in. Too little surrounding terrain is visible, making orientation, route reading and nearby-object awareness difficult.

This is the newest direct Owner request and must be treated as the highest current executable P0 work.

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

## 3. DYNAMIC TOUCH CONTROLLER OPACITY

The Dynamic Touch Controller must be visibly more transparent than the current public build.

Requirements:

- substantially reduce idle/default opacity
- field tiles and nearby objects must remain clearly visible beneath/around it
- active direction remains readable while the finger is moving
- controller may become slightly more visible while actively engaged and fade further when idle if useful
- preserve dead zone, pointerId ownership, direction switching, continuous movement and stopMoving() behavior
- preserve pointercancel / blur / visibilitychange / dialogue / battle / map-transition stop behavior
- preserve REQ-021 tap-vs-drag semantics
- do not reintroduce fixed D-pad layout dominance

## 4. CAMERA / WORLD VIEW — SLIGHT ZOOM OUT

The current iPhone field presentation is too close-up. Increase the visible world area moderately.

Owner intent:

- show more surrounding terrain than the current public build
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

Target is a modest, approximately one-step wider JRPG field framing, not an extreme zoom-out.

## 5. INTEGRATION CONSTRAINTS

This fix must preserve and regress against:

- REQ-021 Tap Anywhere Action
- REQ-022 iPhone Fullscreen World UI
- REQ-001 Dynamic Touch Controller
- REQ-034 black-world-screen repair
- dialogue overlays
- objective/location overlays
- MENU and A floating controls
- battle/shop/inventory exclusions
- existing save compatibility

Do not create a second independent touch authority. Tap/drag distinction remains single-source.

## 6. REQUIRED AUTOMATED ACCEPTANCE

At minimum test at an iPhone portrait viewport equivalent to 390x844.

Acceptance must verify:

- top HUD/floating controls do not overlap each other
- safe-area top is respected
- player can travel toward the visual top region without becoming hidden behind HUD
- player remains identifiable after camera zoom-out
- more world area is visible than the prior framing
- interaction targets remain visually and logically aligned
- collision remains aligned
- tap anywhere still fires canonical Action exactly once for valid tap
- drag still enters movement mode without Action on release
- pointerup/pointercancel stops movement immediately
- MENU/button exclusion still prevents world Action misfire
- dialogue/battle/map-transition cleanup still stops movement
- Dynamic Touch Controller is materially more transparent than current public presentation while still readable in active use
- world visual-liveness test passes
- assembled browser regression passes
- relevant save/gameplay regressions pass
- Pages build/deploy succeeds
- public build includes the fix

## 7. PHYSICAL VERIFICATION BOUNDARY

Automated/browser/Pages success must NOT be reported as Owner physical approval.

Until the Owner checks the public iPhone build:

IOS_PHYSICAL_VERIFICATION = PENDING
IOS_PHYSICAL_CAMERA_FRAMING_VERIFICATION = PENDING
IOS_PHYSICAL_CONTROLLER_OPACITY_VERIFICATION = PENDING

## 8. COMPLETION / NO-STOP

Creating this requirement or adding it to WORK_QUEUE is not implementation completion.

After implementation, verification, checkpoint, Pages publication and state synchronization, run the repository continue gate. Completion of REQ-085 is not by itself a stop condition while safe useful work remains.
