# REQ-121 — Cloudbreak → Wind Stair Transition Deadlock Fix

STATUS: READY
PRIORITY: P0
TYPE: SEVERE_GAMEPLAY_BUG / STORY_PROGRESSION_BLOCKER / OWNER_IPHONE_REPRODUCED
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. OWNER OBSERVED BUG

Owner reproduced a hard progression stop on iPhone at `cloudbreakSaddle`.

Visible state:

- objective: `雲上の鞍部：北側へ続く石段跡を確認する`
- interactable: `次の高所へ続く石段跡`
- dialogue opens correctly
- after closing the dialogue and acting again, the player does not advance to the next playable map

Owner confirmed this is a bug, not a request for walkthrough guidance.

## 1. FRESH ROOT CAUSE EVIDENCE

Fresh current implementation shows:

- `addons/zzz-cloudbreak-saddle.js` handles `lqCloudbreakBoundary` as an ordinary local dialogue interaction.
- the published successor map `windStairRidge` exists in `addons/zzz-wind-stair-ridge.js`.
- that successor file is intentionally data-only after REQ-113 authority hardening.
- the former Cloudbreak-boundary → Wind Stair transition authority is therefore no longer present in the active runtime path.

Result: the player can inspect the north boundary but cannot enter the already-published successor map.

## 2. REQUIRED FIX

Restore one canonical, non-duplicated transition from:

`cloudbreakSaddle`
→ existing `lqCloudbreakBoundary`
→ `windStairRidge`

Requirements:

1. The normal Action/tap interaction at the north stone-step boundary must enter `windStairRidge` instead of endlessly reopening the same clue dialogue.
2. Transition must occur exactly once per valid interaction.
3. Use a safe, walkable Wind Stair entry spawn based on fresh map reality.
4. Existing south-return behavior must remain safe.
5. Do not create another north pursuit map.
6. Do not change Story Canon or invent Chapter 2.
7. Do not introduce a second competing global Action/checkGate/pointer authority if the existing Cloudbreak wrapper can safely own the transition.
8. Preserve REQ-021 Tap Anywhere Action, REQ-022 iPhone fullscreen world and REQ-001 Dynamic Touch Controller.
9. Preserve save compatibility and current story flags.
10. Do not claim iPhone physical verification until Owner confirms the public build.

## 3. REGRESSION / ACCEPTANCE

Minimum automated acceptance:

- `cloudbreakSaddle` map exists.
- `windStairRidge` map exists.
- north boundary kind `lqCloudbreakBoundary` resolves to the successor transition.
- one valid canonical Action reaches `windStairRidge`.
- no same-dialogue deadlock remains.
- entry spawn is in bounds and walkable.
- south return remains functional.
- no new required story flag.
- no new generic north continuation is added.
- relevant assembled browser regression PASS.
- 390x844 touch/fullscreen regression PASS.
- Pages workflow/deployment SUCCESS before promotion to VERIFY.

## 4. PRIORITY / SELECTION

This is the Owner's newest direct request and an active hard progression blocker.

It must be treated as the highest-priority READY work ahead of presentation polish, Opening polish, and other non-blocking READY work.

WIP remains 1. If a genuinely active IN_PROGRESS requirement exists at fresh boot, apply WORK_MANAGER recovery rules, then move to this P0 immediately when safe.

## 5. COMPLETION BOUNDARY

Implementation may move to VERIFY only after the public build contains the fix and automated progression/regression gates pass.

`IOS_PHYSICAL_VERIFICATION: PENDING` until Owner retries the published build and confirms the stone-step transition works.

EOF
