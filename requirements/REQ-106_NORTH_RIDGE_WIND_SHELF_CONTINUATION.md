# REQ-106 — 北尾根・風蝕の岩棚 実プレイ継続

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD after REQ-105 confirmed:

- `northRidgeApproach` was a real walkable route beyond Windcut Pass.
- its north-end canonical landmark `(10,1)` communicated that the footprints and pursuit route continued farther north.
- interacting with that landmark ended in dialogue only; there was no next walkable transition.

REQ-106 removes that hard endpoint by adding another real exploration interval.

## 2. PURPOSE

Create one additional safe, walkable high-ridge area beyond `northRidgeApproach`.

Canonical map id:

`windShelf`

Player-visible name:

`北尾根・風蝕の岩棚`

This remains an approach/exploration continuation only.

Protected constraints remain intact:

- no Leon/Glenn hidden-motive reveal
- no protected story reveal
- no mandatory boss
- no required new story flag
- no `withdrawProofSeen` authority change
- no reward/balance-table change

## 3. ROUTE REQUIREMENTS

Implemented route behavior:

- canonical `northRidgeApproach` north boundary `(10,1)` enters `windShelf`.
- entry spawn is safe, walkable and faces north.
- a south return gate returns safely to `northRidgeApproach`.
- four canonical interactables improve route readability:
  1. near-entry one-person footprint clue
  2. wind-eroded terrain/safety landmark
  3. distant north-route observation without protected reveal
  4. north-end continuation landmark
- no required new story flag.
- existing generic persistence remains compatible with `map === 'windShelf'`.

## 4. GUIDANCE

Implemented without requiring a walkthrough:

- on entry, compact objective directs the player toward the first clue.
- pointer-safe presentation marker highlights the relevant landmark.
- after inspecting the first clue through canonical `action()`, objective updates toward the north continuation.
- guidance phase is runtime-only and does not change save semantics.
- leaving the area removes area-specific guidance.

## 5. GAMEPLAY / ENCOUNTER

- existing canonical random encounter loop reused.
- exact `EVAC_ENEMIES` pool reused.
- entry/return encounter grace applied.
- battle logic is not duplicated.
- damage, rewards, item balance and protected story state are unchanged.

## 6. CROSS-SYSTEM INTEGRATION

`windShelf` is integrated with:

1. regional battle background
2. area-title subtitle
3. world ambient layer
4. cloud/outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

Existing maps and unknown-map fallbacks remain protected by regression coverage.

## 7. INPUT / IPHONE SAFETY

No new independent world pointer/touch handler was introduced.

REQ-021 / REQ-022 / REQ-001 protections remain authoritative:

- short dead-zone tap -> canonical Action once
- drag -> Movement, no Action on release
- pointer ownership / dead zone / centralized stopMoving()
- pointercancel / blur / visibility / dialogue / battle / map-transition / rerender cleanup
- fullscreen viewport-primary world
- MENU/button/input/link exclusions

All REQ-106 presentation overlays are pointer-safe.

## 8. FORWARD-COMPATIBILITY

REQ-105 acceptance was forward-hardened so its historical north-boundary assertion remains meaningful while accepting the legitimate transition into `windShelf`.

All other REQ-105 assertions remain protected.

Checkpoint: `48ab6dc67602901d328976c0ff955a6a14061e18`.

## 9. FAIL-CLOSED ACCEPTANCE

Dedicated late-loading REQ-106 assembled acceptance covers:

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

Broken REQ-106 fails closed before Pages upload/deploy.

Acceptance checkpoint: `598a0c4b2bff5483eeb5483edf715299754c8e61`.

## 10. PUBLIC COMPLETION GATE

Fresh public gate on implementation descendant HEAD `48ab6dc67602901d328976c0ff955a6a14061e18`:

- JavaScript syntax: PASS
- static regression: PASS
- add-on contract: PASS
- dedicated REQ-106 acceptance: PASS
- assembled browser smoke: PASS
- 390x844 floating touch/fullscreen regression: PASS
- existing North Cliff / Windcut / North Ridge regressions: PASS
- GitHub Pages workflow run `34043316502`: SUCCESS
- deployed build inclusion: PASS via successful Pages workflow on complete descendant HEAD
- IOS_PHYSICAL_VERIFICATION: PENDING

## 11. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
IOS_PHYSICAL_VERIFICATION: PENDING

Implementation chain:

- `64bb6c8546737578d353b771e0ec8eea84d4f732` playable Wind Shelf route
- `16090fee6cd89dea3cb574510d1b26d3781c0e1f` area title
- `276e442ff4095834d2fe0e8ef20b2dff4745efca` ambient layer
- `e0875b833e890a086bc679d976586a5bd4de2dbd` cloud layer
- `69264798933783a7264b6a8e58e38a0c33b81b13` footsteps
- `0d262944394aa961c0207ee65fb6f3bc37ff27fc` journal objective
- `79e0c88a490e9b1b5a464f43ecc0d065d847c600` landmark lighting
- `c74b42c5373b48906448d97ce09f8e2538efcdef` battle background
- `598a0c4b2bff5483eeb5483edf715299754c8e61` fail-closed REQ-106 acceptance
- `48ab6dc67602901d328976c0ff955a6a14061e18` REQ-105 forward-compatibility hardening

## 12. NO-STOP

REQ-106 is now VERIFY because all automatable and public-build completion gates pass. Owner iPhone physical verification remains explicitly PENDING. This checkpoint is not an autonomous stop condition.