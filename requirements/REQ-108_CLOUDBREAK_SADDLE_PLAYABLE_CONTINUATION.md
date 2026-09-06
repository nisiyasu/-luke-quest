# REQ-108 — 北尾根・雲上の鞍部 実プレイ継続

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD `4dad48ba478f8f2a1ff17f57bc099148e3afffd7` confirms `skylineTraverse` / 「北尾根・雲裂きの稜線」 is public and playable, but its north-end canonical landmark `(10,1)` is again a dialogue-only endpoint. The player is explicitly told the trail bends higher, yet cannot continue walking.

## 2. PURPOSE

Add one more canon-safe first-chapter pursuit interval beyond `skylineTraverse` without revealing protected story truth or inventing mandatory story state.

Canonical map id: `cloudbreakSaddle`

Player-visible name: `北尾根・雲上の鞍部`

The area should feel like a brief wind-sheltered saddle between exposed ridges, giving the pursuit route a distinct rhythm rather than a copy-paste straight climb.

## 3. PROTECTED CANON / BALANCE

Do NOT:

- reveal hidden Leon / Glenn intent
- reveal Eleanor / Elysia protected truth
- add a mandatory boss
- add a required new story flag
- change `withdrawProofSeen` authority
- change rewards, enemy stats, damage, drop rates or encounter rate
- change existing map collision or prior route gates
- change save schema

## 4. ROUTE REQUIREMENTS

- Existing `skylineTraverse` north boundary `(10,1)` canonical Action enters `cloudbreakSaddle`.
- Safe entry spawn, north-facing, immediately walkable.
- Safe south return to `skylineTraverse`.
- At least four canonical interactables:
  1. near-entry fresh scuff / footprint clue
  2. wind-sheltered stone hollow / safety landmark
  3. distant north observation point
  4. north-end continuation landmark
- No new required story flag.
- Generic persistence must round-trip `map === 'cloudbreakSaddle'`.

## 5. GUIDANCE

- Entry objective directs player to the nearby fresh clue.
- Canonical Action on that clue switches runtime-only guidance to the north continuation.
- Relevant target receives a restrained pointer-safe marker.
- Leaving the area clears local guidance presentation.
- No tutorial modal or giant blocking arrow.

## 6. GAMEPLAY

- Reuse canonical random encounter authority.
- Reuse exact `EVAC_ENEMIES`.
- Give entry/return encounter grace consistent with adjacent northern route maps.
- Do not clone battle logic.

## 7. CROSS-SYSTEM INTEGRATION

Before VERIFY integrate `cloudbreakSaddle` into:

1. regional battle background
2. area-title subtitle
3. world ambient registry
4. cloud/outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

Preserve existing map coverage and unknown-map fallbacks.

## 8. INPUT / IPHONE SAFETY

Protect REQ-021 / REQ-022 / REQ-001 and visibility hardening:

- no new world pointer authority
- short dead-zone tap -> canonical Action exactly once
- drag -> movement, release no Action
- pointerId/dead-zone/direction-change/central stopMoving remain authoritative
- pointercancel/blur/visibilitychange/dialogue/battle/map-transition/rerender safety remains
- MENU/button/link/input exclusions remain
- world-primary 100dvh/safe-area fullscreen layout remains
- all new presentation layers pointer-safe

## 9. FORWARD COMPATIBILITY

REQ-107 acceptance must remain valid when the historical Skyline north-boundary dialogue becomes a legitimate transition to `cloudbreakSaddle`. It must continue proving that the canonical north interaction fired while allowing the new transition.

## 10. FAIL-CLOSED ACCEPTANCE

Late assembled-browser acceptance must verify at minimum:

- map shape/name/dimensions
- four required interactables and coordinates
- Skyline -> Cloudbreak transition
- safe entry/immediate walking
- canonical interactions
- guidance clue -> north phase
- safe return
- exact EVAC_ENEMIES reuse
- no new required story flag
- protected canon/save schema unchanged
- battle/title/ambient/cloud/footstep/journal/landmark integration
- unknown fallbacks
- pointer-safe presentation
- P0 input/fullscreen status
- save round-trip
- test teardown restores state/localStorage

Broken REQ-108 must emit the existing fatal North-route browser failure marker before Pages upload/deploy.

## 11. PUBLIC COMPLETION GATE

Before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-108 acceptance PASS
- assembled browser PASS
- 390x844 touch/fullscreen PASS
- visibilitychange regression PASS
- existing North-route regressions PASS
- Pages workflow SUCCESS on complete implementation HEAD
- public build inclusion PASS

## 12. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 13. NO-STOP

REQ registration, implementation, commit, Pages success, CURRENT update or any single checkpoint is not an autonomous stop condition.
