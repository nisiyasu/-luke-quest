# REQ-108 — 北尾根・雲上の鞍部 実プレイ継続

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD `4dad48ba478f8f2a1ff17f57bc099148e3afffd7` confirmed `skylineTraverse` / 「北尾根・雲裂きの稜線」 was public and playable, but its north-end canonical landmark `(10,1)` was a dialogue-only endpoint. The player was explicitly told the trail bends higher, yet could not continue walking.

## 2. PURPOSE

Add one more canon-safe first-chapter pursuit interval beyond `skylineTraverse` without revealing protected story truth or inventing mandatory story state.

Canonical map id: `cloudbreakSaddle`

Player-visible name: `北尾根・雲上の鞍部`

The area is a brief wind-sheltered saddle between exposed ridges, giving the pursuit route a distinct rhythm rather than a copy-paste straight climb.

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
- Four canonical interactables:
  1. near-entry fresh scuff / footprint clue
  2. wind-sheltered stone hollow / safety landmark
  3. distant north observation point
  4. north-end continuation landmark
- No new required story flag.
- Generic persistence round-trips `map === 'cloudbreakSaddle'`.

## 5. GUIDANCE

- Entry objective directs player to the nearby fresh clue.
- Canonical Action on that clue switches runtime-only guidance to the north continuation.
- Relevant target receives a restrained pointer-safe marker.
- Leaving the area clears local guidance presentation.
- No tutorial modal or giant blocking arrow.

## 6. GAMEPLAY

- Reuses canonical random encounter authority.
- Reuses exact `EVAC_ENEMIES`.
- Entry/return encounter grace is consistent with adjacent northern route maps.
- Battle logic is not cloned.

## 7. CROSS-SYSTEM INTEGRATION

`cloudbreakSaddle` is integrated into:

1. regional battle background
2. area-title subtitle
3. world ambient registry
4. cloud/outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

Existing map coverage and unknown-map fallbacks are preserved.

## 8. INPUT / IPHONE SAFETY

REQ-021 / REQ-022 / REQ-001 and visibility hardening remain protected:

- no new world pointer authority
- short dead-zone tap -> canonical Action exactly once
- drag -> movement, release no Action
- pointerId/dead-zone/direction-change/central stopMoving remain authoritative
- pointercancel/blur/visibilitychange/dialogue/battle/map-transition/rerender safety remains
- MENU/button/link/input exclusions remain
- world-primary 100dvh/safe-area fullscreen layout remains
- all new presentation layers pointer-safe

## 9. FORWARD COMPATIBILITY

REQ-107 acceptance was updated so the historical Skyline north-boundary canonical interaction is still proven while the valid `cloudbreakSaddle` transition is allowed. No old interaction, return, encounter, save or cross-system assertion was removed.

## 10. FAIL-CLOSED ACCEPTANCE

Late assembled-browser acceptance verifies:

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

Broken REQ-108 emits the existing fatal North-route browser failure marker before Pages upload/deploy.

## 11. IMPLEMENTATION / VERIFICATION

- `addons/zzz-cloudbreak-saddle.js` implements `cloudbreakSaddle` / 「北尾根・雲上の鞍部」 as a 22x20 walkable map beyond Skyline Traverse.
- Entry spawn `(10,18)` is immediately walkable and the south gate returns safely to Skyline `(10,2)`.
- Canonical interactables: `lqCloudbreakScuff`, `lqCloudbreakHollow`, `lqCloudbreakView`, `lqCloudbreakBoundary`.
- Runtime-only local guidance changes from the fresh scuff clue to the north stone-step continuation.
- `EVAC_ENEMIES` and canonical encounter authority are reused.
- Area title, fog ambient, mist cloud classification, mist footsteps, location-aware Adventure Journal objective, three landmark glints, and original-vector battle background are integrated.
- REQ-107 north-boundary acceptance was forward-compatible hardened at checkpoint `df23f3e47008da626b25a5228b1ec348cbb47e90`.
- Complete implementation + fail-closed acceptance HEAD: `3428c4aa83c0d7afc322f08269ef520bc49f5f91`.
- GitHub Pages workflow run `34046230845`: SUCCESS. JavaScript/static/add-on contract, assembled browser, 390x844 touch/fullscreen, existing North-route regressions, REQ-107 compatibility, REQ-108 acceptance, upload and Pages deploy all passed.
- Owner iPhone physical verification remains PENDING.

## 12. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
IOS_PHYSICAL_VERIFICATION: PENDING

## 13. NO-STOP

REQ registration, implementation, commit, Pages success, CURRENT update or any single checkpoint is not an autonomous stop condition.
