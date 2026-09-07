# REQ-121 — Cloudbreak → Wind Stair Transition Deadlock Fix

STATUS: VERIFY
PRIORITY: P0
TYPE: SEVERE_GAMEPLAY_BUG / STORY_PROGRESSION_BLOCKER / OWNER_IPHONE_REPRODUCED
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. OWNER OBSERVED BUG

Owner reproduced a hard progression stop on iPhone at `cloudbreakSaddle`.

Visible state:

- objective: `雲上の鞍部：北側へ続く石段跡を確認する`
- interactable: `次の高所へ続く石段跡`
- dialogue opens correctly
- after closing the dialogue and acting again, the player does not advance to the next playable map

Owner confirmed this is a bug, not a request for walkthrough guidance.

## 1. FRESH ROOT CAUSE EVIDENCE

Fresh current implementation showed:

- `addons/zzz-cloudbreak-saddle.js` handled `lqCloudbreakBoundary` as an ordinary local dialogue interaction.
- the published successor map `windStairRidge` already existed in `addons/zzz-wind-stair-ridge.js`.
- that successor file was intentionally data-only after REQ-113 authority hardening.
- the former Cloudbreak-boundary → Wind Stair transition authority was therefore absent from the active runtime path.

Result: the player could inspect the north boundary but could not enter the already-published successor map.

## 2. IMPLEMENTED FIX

The existing Cloudbreak Action wrapper now owns one canonical transition from:

`cloudbreakSaddle`
→ existing `lqCloudbreakBoundary`
→ existing `windStairRidge`

Implementation:

1. One normal canonical `action()` at the north stone-step boundary enters `windStairRidge` instead of reopening the local clue forever.
2. No second global input authority was added.
3. `safeWindEntry()` selects an in-bounds, walkable existing Wind Stair spawn.
4. Transition calls centralized `stopMoving()` and preserves encounter grace safety.
5. Existing Wind Stair south-return interaction is routed safely back to `cloudbreakSaddle` at `[10,2]`, facing south.
6. No new pursuit map, Story Canon reveal, required story flag, save-schema change or duplicate battle/input loop was added.
7. REQ-021 / REQ-022 / REQ-001 authorities remain untouched.

Implementation checkpoint:

- `1eb137e99adc1b38f24e965bee479eed7c71ec71` — `REQ-121 restore Cloudbreak to Wind Stair transition`

## 3. REGRESSION / ACCEPTANCE EVIDENCE

Dedicated assembled-browser acceptance:

- `d87c231fd7f28b670f5140a7c034209fa8d79602` — adds deterministic REQ-121 transition smoke.
- `d456ac87445c302e25f3ee5d4fc94f497f5fc99f` — adds dedicated progression-blocker CI gate.
- Workflow run `34073496619`: SUCCESS.
- Verified by canonical Action:
  - `cloudbreakSaddle` exists.
  - `windStairRidge` exists.
  - `lqCloudbreakBoundary` is the source authority.
  - one Action enters `windStairRidge`.
  - destination spawn is in bounds and walkable.
  - south Action returns to Cloudbreak safe spawn.
  - existing flags are byte-equivalent before/after the test.
  - no new map is created.

Full Pages regression initially failed at the historical REQ-082 step. Evidence-first reproduction proved REQ-082 itself remained fully healthy: `encounterEnabled`, exact EVAC_ENEMIES pool reuse, entry/return grace, battle pool use and status contract were all TRUE. The actual failure marker was `REQ-108: acceptance false: boundary` because the old REQ-108 acceptance still expected the Cloudbreak north boundary to remain a flavor-only dialogue.

- Diagnostic run `34073413489` captured the exact false-failure reason.
- `e3a286520198cc40c9324579ce84aeba63840038` updates the REQ-108 acceptance to be forward-compatible: the same original boundary remains required, but when published `windStairRidge` exists the successful boundary Action is expected to transition there.
- Diagnostic rerun `34073496672`: SUCCESS with no failure marker; all REQ-082 fields TRUE.
- Standard Pages run `34073496787`: SUCCESS, including assembled game smoke, 390x844 floating-touch / iPhone world visual-liveness, REQ-081 north cliff road and REQ-082 north cliff encounter regressions, upload and public Pages deployment.

## 4. ACCEPTANCE STATUS

- [x] Cloudbreak map exists.
- [x] Wind Stair map exists.
- [x] north boundary kind `lqCloudbreakBoundary` resolves to the successor transition.
- [x] one valid canonical Action reaches `windStairRidge`.
- [x] no same-dialogue deadlock remains in the automated runtime path.
- [x] entry spawn is in bounds and walkable.
- [x] south return remains functional.
- [x] no new required story flag.
- [x] no new generic north continuation map.
- [x] relevant assembled browser regression PASS.
- [x] 390x844 touch/fullscreen regression PASS through standard Pages suite.
- [x] Pages workflow/deployment SUCCESS.
- [ ] Owner physical iPhone verification remains PENDING.

## 5. COMPLETION BOUNDARY

Machine-verifiable implementation is complete and the requirement is now `VERIFY`.

Do not claim physical iPhone PASS until Owner retries the published build and confirms the stone-step transition works.

EOF
