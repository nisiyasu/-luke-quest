# REQ-105 — 北尾根・実プレイ継続区間

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD audit of `addons/north-cliff-road.js` confirms:

- `northCliffRoad` north boundary transitions into `windcutPass`.
- `windcutPass` south boundary returns to `northCliffRoad`.
- `windcutPass` north boundary `(10,1)` is only an interactable dialogue object.
- its dialogue explicitly says the footprints continue beyond the ridge, but no transition or walkable continuation exists.

Therefore the current public route creates a player-visible hard endpoint immediately after telling the player that the pursuit continues north.

This is a higher-value playable progression gap than another isolated cosmetic patch.

## 2. PURPOSE

Create one additional safe, walkable north-ridge approach area beyond `windcutPass` so the player can actually continue following the visible trail.

Do not advance protected story canon, reveal a new character secret, create a required story flag, or invent a mandatory boss/story event.

The new area is an exploration/approach continuation only.

## 3. MAP / ROUTE REQUIREMENTS

Create canonical map id:

`northRidgeApproach`

Player-visible map name:

`北尾根・岩棚道`

Required route behavior:

- canonical `windcutPass` north boundary `(10,1)` enters `northRidgeApproach`.
- entry spawn is safe, walkable and faces north.
- a south return gate returns safely to `windcutPass`.
- the new area contains at least four canonical interactables tied to route readability, not random filler.
- include a visible first clue near the entry, one terrain/safety landmark, one distant route observation, and one north-end continuation landmark.
- north-end interaction may indicate that the pursuit continues further, but must not reveal protected future story.
- no required new story flag.
- save/load with `map === 'northRidgeApproach'` must remain valid.

## 4. PLAYER GUIDANCE

The area must be understandable without a walkthrough.

On entry:

- compact objective directs the player to the first visible trail clue.
- a presentation-only marker highlights only the current relevant landmark.
- after the first clue is examined through canonical `action()`, objective changes immediately toward the north route landmark.
- markers use `pointer-events:none` and must not compete with REQ-021 tap Action or REQ-001 Dynamic Touch.
- leaving the map removes area-specific guidance.
- guidance phase remains runtime-only and does not alter save semantics.

## 5. ENCOUNTER / GAMEPLAY INTEGRATION

- `northRidgeApproach` participates in the existing canonical random encounter loop.
- reuse existing `EVAC_ENEMIES`; do not invent a placeholder enemy identity.
- use entry/return encounter grace consistent with adjacent north-route maps.
- do not duplicate battle logic.
- do not change damage, rewards, item balance, story flags or protected canon.

## 6. CROSS-SYSTEM INTEGRATION — MUST SHIP IN THIS SAME REQUIREMENT

Do not publish the map and then create a chain of separate cleanup requirements for obvious regional coverage.

Before REQ-105 can move to VERIFY, `northRidgeApproach` must be included in the existing single-source systems for:

1. regional battle background
2. area-title subtitle
3. world ambient layer
4. cloud-shadow outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

All integrations are presentation/readability only unless explicitly stated otherwise above.

Existing maps and unknown-map fallbacks must remain intact.

## 7. INPUT / IPHONE SAFETY

No new independent world pointer/touch handler may be introduced.

Preserve:

- REQ-021 short tap -> canonical Action once
- drag -> Movement and no Action on release
- REQ-001 pointerId/dead-zone/central `stopMoving()` lifecycle
- pointercancel / blur / visibility / dialogue / battle / map-transition cleanup
- REQ-022 viewport-primary fullscreen world layout
- MENU/button/input/link exclusions

All new presentation overlays must be pointer-safe.

## 8. FAIL-CLOSED VERIFICATION

Add a dedicated late-loading REQ-105 smoke/acceptance layer that verifies at minimum:

- new map exists and dimensions/critical landmarks are present
- Windcut north boundary transitions to the new map
- safe entry spawn
- south return reaches Windcut safely
- canonical action can inspect the first clue and north-end landmark
- encounter map/pool integration uses existing EVAC_ENEMIES
- no required new story flag
- battle background coverage
- area title coverage
- ambient coverage
- cloud coverage/classification
- footstep coverage/classification
- journal objective coverage
- landmark-light coverage
- unknown-map fallbacks remain safe where relevant
- presentation overlays remain pointer-safe

Do not mutate persistent gameplay state merely to make the smoke pass; restore any temporary runtime state used by browser acceptance.

## 9. PUBLIC COMPLETION GATE

Do not claim implementation complete because files exist.

Required before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-105 acceptance PASS
- assembled browser smoke PASS
- 390x844 floating touch/fullscreen regression PASS
- existing North Cliff / Windcut route regressions PASS
- GitHub Pages workflow SUCCESS on a HEAD containing the complete REQ-105 implementation and guard
- deployed build inclusion PASS

IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms on an actual iPhone.

## 10. PROTECTED BOUNDARIES

Do not change:

- existing `withdrawProofSeen` authority
- existing first-chapter protected story facts
- Leon/Glenn hidden motives or future reveal
- canonical existing dialogue meaning
- existing reward/balance tables
- save schema beyond accepting the new map id through existing generic state persistence
- existing P0 input/fullscreen authority

## 11. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 12. NO-STOP

REQ-105 implementation, commit, Pages success, queue sync or CURRENT autosave is not an autonomous execution stop condition.