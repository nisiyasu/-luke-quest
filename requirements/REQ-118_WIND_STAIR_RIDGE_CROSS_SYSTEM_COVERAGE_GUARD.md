# REQ-118 — WIND STAIR RIDGE CROSS-SYSTEM COVERAGE GUARD

- ID: `REQ-118`
- TITLE: `Wind Stair Ridge Cross-System Coverage Guard`
- PRIORITY: `P2`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- COMPLETED_AT: `2026-09-07 JST`
- TYPE: `QUALITY / REGRESSION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- IMPLEMENTATION_COMMIT: `e9831d84f2b63c45aa213915b0ef45c05544c002`
- PAGES_RUN: `34050938898 / SUCCESS`
- IOS_PHYSICAL_VERIFICATION: `NOT_REQUIRED_FOR_GATE`

## 1. FRESH PROBLEM EVIDENCE

Fresh repository audit found established late-loading fail-closed cross-system smoke guards for earlier northern-route maps, including `northCliffRoad` and `windcutPass`.

`windStairRidge` is published and integrated by REQ-115 / REQ-116 into area-title, ambient, cloud-shadow, footstep and landmark-lighting presentation systems. This requirement added the equivalent cross-system regression guard.

## 2. ID RECOVERY

This work was first registered as `REQ-117_WIND_STAIR_RIDGE_CROSS_SYSTEM_COVERAGE_GUARD.md`. A concurrent session independently registered another REQ-117. The original REQ-117 guard file is therefore historical/SUPERSEDED and this guard continued as REQ-118.

A later Owner Opening request also initially received REQ-118. That Owner request is recovered as unique successor `REQ-120_HIGH_QUALITY_HERO_SELECTION_OPENING.md`; this historical implemented guard retains REQ-118.

## 3. STORY-CANON BOUNDARY

This requirement is CI/regression-only and does not create/extend story routes, Story Beats, dialogue, clues, story flags, Chapter 2, encounter authority, input, save, collision or map coordinates.

## 4. IMPLEMENTATION

Late-loading smoke add-on:
`addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-wind-stair-cross-system-smoke.js`

It runs only under `?lqSmoke` and fails closed if:

- canonical `MAPS.windStairRidge` disappears;
- area-title coverage or dedicated subtitle regresses;
- ambient `fog` coverage regresses;
- cloud-shadow `mist` coverage regresses;
- footstep `mist` coverage regresses;
- landmark-lighting coverage/density regresses;
- predecessor `cloudbreakSaddle` presentation continuity regresses.

It explicitly declares `gameplayMutation:false` and does not require battle/encounter coverage for `windStairRidge`.

## 5. ACCEPTANCE RESULT

- guard implementation present at `e9831d84f2b63c45aa213915b0ef45c05544c002`;
- Pages workflow run `34050938898` completed `SUCCESS`;
- assembled/public gate therefore satisfied before VERIFY;
- no physical-device claim is required for this CI-only guard.

EOF
