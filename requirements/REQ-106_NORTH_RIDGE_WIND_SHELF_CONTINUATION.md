# REQ-106 — 北尾根・風蝕の岩棚 実プレイ継続

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD after REQ-105 confirms:

- `northRidgeApproach` is now a real walkable route beyond Windcut Pass.
- its north-end canonical landmark `(10,1)` explicitly communicates that the footprints and pursuit route continue farther north.
- interacting with that landmark currently ends in dialogue only; there is no next walkable transition.

That means the exact player-visible hard endpoint REQ-105 removed from Windcut Pass now exists one map farther north.

The next high-value safe improvement is therefore another real exploration interval, not another isolated cosmetic micro-patch.

## 2. PURPOSE

Create one additional safe, walkable high-ridge area beyond `northRidgeApproach`.

Canonical map id:

`windShelf`

Player-visible name:

`北尾根・風蝕の岩棚`

This remains an approach/exploration continuation only.

Do NOT:

- reveal Leon/Glenn hidden motives
- introduce a protected story reveal
- create a mandatory boss
- create a required new story flag
- change `withdrawProofSeen` authority
- change existing reward/balance tables

## 3. ROUTE REQUIREMENTS

Required route behavior:

- canonical `northRidgeApproach` north boundary `(10,1)` enters `windShelf`.
- entry spawn is safe, walkable and faces north.
- a south return gate returns safely to `northRidgeApproach`.
- include at least four canonical interactables that improve route readability:
  1. a near-entry trail clue continuing the same one-person footprint logic
  2. a terrain/safety landmark showing stronger wind erosion
  3. a distant north-route observation without protected reveal
  4. a north-end continuation landmark
- no required new story flag.
- save/load with `map === 'windShelf'` must remain valid through existing generic persistence.

## 4. GUIDANCE

No walkthrough should be required.

- on entry, compact objective directs the player toward the first clue.
- a pointer-safe presentation marker highlights the currently relevant landmark.
- after inspecting the first clue through canonical `action()`, objective updates toward the north continuation.
- guidance phase is runtime-only and does not change save semantics.
- leaving the area removes its area-specific marker.

## 5. GAMEPLAY / ENCOUNTER

- use the existing canonical random encounter loop.
- reuse exact `EVAC_ENEMIES`.
- apply entry/return encounter grace consistent with adjacent north-route maps.
- do not duplicate battle logic.
- do not alter damage, rewards, item balance or protected story state.

## 6. CROSS-SYSTEM INTEGRATION — SAME REQUIREMENT

Before VERIFY, `windShelf` must be covered by the existing presentation/readability systems or equivalent compatible single-purpose authority:

1. regional battle background
2. area-title subtitle
3. world ambient layer
4. cloud/outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

Existing maps and unknown-map fallback behavior must remain intact.

## 7. INPUT / IPHONE SAFETY

No new independent world pointer/touch handler.

Preserve REQ-021 / REQ-022 / REQ-001 behavior:

- short dead-zone tap -> canonical Action once
- drag -> Movement, no Action on release
- pointer ownership / dead zone / centralized stopMoving()
- pointercancel / blur / visibility / dialogue / battle / map-transition / rerender cleanup
- fullscreen viewport-primary world
- MENU/button/input/link exclusions

All presentation overlays added by this requirement must remain pointer-safe.

## 8. FORWARD-COMPATIBILITY REQUIREMENT

REQ-105 acceptance currently verifies the existing north-end landmark interaction.

REQ-106 must not repeat the historical REQ-081 stale-smoke failure pattern.

Before or with the transition implementation:

- forward-harden REQ-105 acceptance so its historical north-boundary assertion remains meaningful while accepting a legitimate transition into `windShelf`.
- preserve all other REQ-105 assertions.
- do not weaken a regression merely to pass new code.

## 9. FAIL-CLOSED ACCEPTANCE

Add a dedicated late-loading REQ-106 assembled-browser acceptance that verifies at minimum:

- map name/dimensions/critical coordinates
- exact four required interactables
- Ridge north boundary -> Wind Shelf transition
- safe entry and immediate walking
- canonical Action interactions
- safe south return
- exact `EVAC_ENEMIES` reuse
- no required story flag / canon mutation / save-schema mutation
- guidance phase behavior
- battle/title/ambient/cloud/footstep/journal/landmark coverage
- relevant unknown-map fallbacks
- pointer-safe presentation overlays
- temporary runtime/localStorage restoration

Broken REQ-106 must fail closed before Pages upload/deploy.

## 10. PUBLIC COMPLETION GATE

Required before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-106 acceptance PASS
- assembled browser smoke PASS
- 390x844 floating touch/fullscreen regression PASS
- existing North Cliff / Windcut / North Ridge regressions PASS
- GitHub Pages workflow SUCCESS on a HEAD containing the complete implementation and guard
- deployed build inclusion PASS

IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms on an actual iPhone.

## 11. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 12. NO-STOP

REQ-106 implementation, commit, Pages success, queue synchronization or CURRENT autosave is not an autonomous stop condition.