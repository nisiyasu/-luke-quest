# REQ-105 — 北尾根・実プレイ継続区間

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD audit of `addons/north-cliff-road.js` confirmed:

- `northCliffRoad` north boundary transitions into `windcutPass`.
- `windcutPass` south boundary returns to `northCliffRoad`.
- before this requirement, `windcutPass` north boundary `(10,1)` was only an interactable dialogue object.
- its dialogue explicitly said the footprints continued beyond the ridge, but no transition or walkable continuation existed.

Therefore the prior public route created a player-visible hard endpoint immediately after telling the player that the pursuit continued north.

REQ-105 closes that playable progression gap without advancing protected story canon.

## 2. PURPOSE

Create one additional safe, walkable north-ridge approach area beyond `windcutPass` so the player can actually continue following the visible trail.

Do not advance protected story canon, reveal a new character secret, create a required story flag, or invent a mandatory boss/story event.

The new area is an exploration/approach continuation only.

## 3. MAP / ROUTE REQUIREMENTS

Canonical map id:

`northRidgeApproach`

Player-visible map name:

`北尾根・岩棚道`

Implemented route behavior:

- canonical `windcutPass` north boundary `(10,1)` enters `northRidgeApproach`.
- entry spawn `(10,18)` is safe, walkable and faces north.
- south return gate returns safely to `windcutPass` `(10,2)`.
- the new area contains four canonical route-readability interactables:
  - new footprints near the entry
  - a damaged boundary stake
  - a north-facing ridge observation point
  - a north-end continuation landmark
- north-end interaction indicates that pursuit continues without revealing protected future story.
- no required new story flag.
- generic save persistence accepts `map === 'northRidgeApproach'` without schema change.

## 4. PLAYER GUIDANCE

The area is designed to be understandable without a walkthrough.

On entry:

- compact objective directs the player to the first visible trail clue.
- a presentation-only marker highlights only the current relevant landmark.
- after the first clue is examined through canonical `action()`, objective changes toward the north route landmark.
- markers use `pointer-events:none` and do not compete with REQ-021 tap Action or REQ-001 Dynamic Touch.
- leaving the map removes area-specific guidance.
- guidance phase remains runtime-only and does not alter save semantics.

## 5. ENCOUNTER / GAMEPLAY INTEGRATION

- `northRidgeApproach` participates in the existing canonical random encounter loop.
- existing `EVAC_ENEMIES` is reused.
- entry/return encounter grace is applied consistently with adjacent north-route maps.
- battle logic is not duplicated.
- damage, rewards, item balance, story flags and protected canon are unchanged.

## 6. CROSS-SYSTEM INTEGRATION — SHIPPED IN THIS REQUIREMENT

`northRidgeApproach` is covered by:

1. dedicated original-vector regional battle background
2. existing area-title subtitle authority
3. existing world ambient registry (`fog`)
4. existing cloud-shadow outdoor classification (`mist`)
5. existing terrain footstep presentation (`mist`)
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer (`cliff` + `wind` glints)

These integrations are presentation/readability only and preserve pointer safety, save schema and protected canon.

## 7. INPUT / IPHONE SAFETY

No new independent world pointer/touch handler was introduced.

Preserved:

- REQ-021 short tap -> canonical Action once
- drag -> Movement and no Action on release
- REQ-001 pointerId/dead-zone/central `stopMoving()` lifecycle
- pointercancel / blur / visibility / dialogue / battle / map-transition cleanup
- REQ-022 viewport-primary fullscreen world layout
- MENU/button/input/link exclusions

New presentation overlays use `pointer-events:none` where they overlay the world.

## 8. FAIL-CLOSED VERIFICATION

Dedicated late-loading file:

`addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req105-north-ridge-acceptance-smoke.js`

The acceptance layer verifies:

- map existence/name/dimensions/row widths
- all four required interactable kinds and critical coordinates
- Windcut north boundary transition
- safe entry spawn and immediate walking
- canonical action for footprints, stake, view and north boundary
- safe south return to Windcut
- canonical encounter integration with exact `EVAC_ENEMIES`
- no required story flag / protected canon / save-schema mutation
- area-title coverage
- ambient coverage/classification
- cloud coverage/classification
- footstep coverage/classification
- Adventure Journal objective coverage
- landmark-light coverage and pointer safety
- dedicated North Ridge battle-background coverage and pointer safety
- local ridge mist/wind presentation presence
- temporary smoke runtime/localStorage state restoration

For fail-closed public gating, the dedicated REQ-105 smoke runs inside the existing assembled North Cliff encounter browser-gate query and emits the already-fatal `lqNorthCliffEncounterSmokeFailure` marker if any REQ-105 assertion fails. This preserves the existing REQ-082 gate while making a broken REQ-105 build block Pages upload/deployment.

## 9. PUBLIC COMPLETION GATE

PASS on GitHub Pages workflow run `34042539057`, HEAD containing commit `c8a7411d462b2995823e2fc828c9d291b80228ff`.

Verified in that assembled Pages pipeline:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-105 acceptance PASS through the fail-closed public browser gate
- assembled browser smoke PASS
- 390x844 floating touch/fullscreen regression PASS
- existing North Cliff / Windcut route regressions PASS
- upload-pages-artifact PASS
- GitHub Pages deployment PASS
- deployed build inclusion gate PASS

IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms on an actual iPhone.

## 10. PROTECTED BOUNDARIES

Unchanged:

- existing `withdrawProofSeen` authority
- existing first-chapter protected story facts
- Leon/Glenn hidden motives or future reveal
- canonical existing dialogue meaning
- existing reward/balance tables
- save schema beyond accepting the new map id through existing generic state persistence
- existing P0 input/fullscreen authority

## 11. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
PAGES_RUN_ID: 34042539057
IMPLEMENTATION_HEAD: c8a7411d462b2995823e2fc828c9d291b80228ff
IOS_PHYSICAL_VERIFICATION: PENDING

## 12. CHECKPOINTS

- `b0ef010f17bb0a2abdbaf0d5ca6b03b7d74d6a74` — base North Ridge playable continuation
- `06d30746...` — map row-width repair
- `a6ff4543245f923760d9df449084e63102a74461` — area title integration
- `d6c99cfc8215b3c08fed04b903050bf08b0c9a63` — world ambient integration
- `1f7dfeed69620bc5911419fbbc59cfee61250cc3` — cloud-shadow integration
- `8687a772c1858e2bc839a252a4d663d8615c93c9` — terrain footstep integration
- `764b8e35706d5dc6e807ecd34814add225a3f7b7` — Adventure Journal objective integration
- `6e992d20d74bf88aaca39a573da07fabe2d13e57` — landmark-lighting integration
- `08a88ad07cc372481422027331beb298316b67ce` — historical REQ-081/093 smoke repaired for valid forward continuation
- `f1251dd8d0d953eb80072b77bd1060805ec77a60` — dedicated North Ridge battle background
- `c8a7411d462b2995823e2fc828c9d291b80228ff` — late fail-closed REQ-105 acceptance smoke

## 13. NO-STOP

REQ-105 implementation, commit, Pages success, queue sync or CURRENT autosave is not an autonomous execution stop condition.