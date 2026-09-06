# REQ-121 — Cloudbreak → Wind Stair Transition Deadlock Fix

STATUS: VERIFY
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

Fresh current implementation showed:

- `addons/zzz-cloudbreak-saddle.js` handled `lqCloudbreakBoundary` as an ordinary local dialogue interaction.
- the published successor map `windStairRidge` exists in `addons/zzz-wind-stair-ridge.js`.
- that successor file is intentionally data-only after REQ-113 authority hardening.
- the Cloudbreak-boundary → Wind Stair transition authority therefore needed a narrow late-bound restoration.

## 2. IMPLEMENTED FIX

The single active transition authority is:

`addons/zzzz-req121-cloudbreak-wind-stair-transition.js`

It restores:

`cloudbreakSaddle`
→ existing `lqCloudbreakBoundary`
→ `windStairRidge`

with:

- canonical `action()` interception at the north boundary;
- one transition to `windStairRidge`;
- safe Wind Stair spawn `[11,18]`, facing north;
- encounter grace on entry;
- canonical south-return interception from `lqWindStairReturn`;
- safe Cloudbreak return spawn `[10,2]`;
- no new story flag;
- no save-schema change;
- no new north pursuit map.

The base `addons/zzz-cloudbreak-saddle.js` remains the Cloudbreak map/dialogue authority and does not duplicate the transition logic.

## 3. REGRESSION / ACCEPTANCE

Automated acceptance evidence on the published pipeline:

- collision-safe add-on syntax validation: PASS;
- static regression guard: PASS;
- add-on contract guard: PASS;
- assembled browser smoke: PASS;
- 390x844 floating-touch/fullscreen visual-liveness smoke: PASS;
- REQ-081 north-cliff road smoke: PASS;
- REQ-082 north-cliff encounter smoke: PASS after repairing its test-only post-assertion contamination;
- REQ-121 dedicated smoke is present at `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req121-cloudbreak-wind-stair-smoke.js` and runs late in the canonical `lqSmoke` assembled-browser regression, failing the runtime gate if the forward transition, safe spawn, no-new-flag condition, return transition, safe return spawn or transition status contract fails;
- Pages workflow run `34058848513`: SUCCESS;
- published commit containing the fix and passing pipeline: `f98a0847ffb1ed34edeafc6ae25045608f5a6186`.

## 4. PROTECTED CONDITIONS

Verified by implementation and regression boundaries:

1. No new generic north pursuit map was created.
2. Story Canon / Chapter 2 was not extended.
3. No second Cloudbreak transition authority remains in the base Cloudbreak file.
4. REQ-021 Tap Anywhere Action remains active through canonical `action()`.
5. REQ-022 iPhone fullscreen world regression passed.
6. REQ-001 Dynamic Touch Controller regression passed.
7. Save compatibility and story flags were not expanded by this fix.

## 5. COMPLETION BOUNDARY

Automated/public completion is satisfied and the requirement is now `VERIFY`.

`IOS_PHYSICAL_VERIFICATION: PENDING`

Owner must retry the published iPhone build at `次の高所へ続く石段跡` and confirm that the Action/tap now enters `北尾根・風鳴りの石段` before physical verification can be claimed.

## 6. EXECUTION CHECKPOINTS

- 2026-09-07 JST: selected under latest Owner P0 authority after fresh HEAD/QUEUE/CURRENT recovery.
- 2026-09-07 JST: restored the transition through the single late-bound authority and removed duplicate transition ownership from the base Cloudbreak add-on.
- 2026-09-07 JST: diagnosed a pre-existing REQ-082 CI false failure where all behavioral assertions were true but post-assertion probe contamination still triggered the old runtime gate; hardened the dedicated test-only probe without changing production gameplay.
- 2026-09-07 JST: workflow run `34058848513` completed SUCCESS and deployed Pages. Promoted to VERIFY with iPhone physical confirmation still pending.

EOF
