# REQ-118 — WIND STAIR RIDGE CROSS-SYSTEM COVERAGE GUARD

- ID: `REQ-118`
- TITLE: `Wind Stair Ridge Cross-System Coverage Guard`
- PRIORITY: `P2`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `QUALITY / REGRESSION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`

## 1. FRESH PROBLEM EVIDENCE

Fresh repository audit found established late-loading fail-closed cross-system smoke guards for earlier northern-route maps, including `northCliffRoad` and `windcutPass`.

`windStairRidge` is now published and has been integrated by REQ-115 / REQ-116 into area-title, ambient, cloud-shadow, footstep and landmark-lighting presentation systems, but there was no equivalent cross-system regression guard for this map.

Without a guard, a later edit can silently drop one of these integrations while generic browser smoke remains green.

## 2. ID RECOVERY

This work was first registered as `REQ-117_WIND_STAIR_RIDGE_CROSS_SYSTEM_COVERAGE_GUARD.md`. A concurrent autonomous session independently registered another REQ-117 for a visual-richness upgrade.

To restore unique active IDs without deleting either history, the guard's original REQ-117 file is SUPERSEDED and this work continues as REQ-118.

## 3. STORY-CANON BOUNDARY

This requirement is CI/regression-only and MUST NOT:

- create or extend any story route;
- create or modify Story Beats, dialogue, clues or story flags;
- decide the Chapter 1 stopping role;
- create/name/age/characterize Leon's sister;
- invent Chapter 2;
- add encounter/battle authority to `windStairRidge`;
- change input, save, collision or map coordinates.

## 4. IMPLEMENTATION TARGET

Add a late-loading smoke add-on which executes only under `?lqSmoke` and fails closed if the already-approved `windStairRidge` presentation coverage regresses.

Required checks:

- canonical `MAPS.windStairRidge` exists;
- area title knows the map and does not return generic `LUKE QUEST` fallback;
- ambient type is `fog`;
- cloud-shadow class is `mist`;
- footstep kind is `mist`;
- landmark-lighting map coverage exists and has at least two presentation-only glints;
- predecessor `cloudbreakSaddle` still exists and retains title / fog / mist cloud / mist footstep / landmark coverage;
- guard declares `gameplayMutation:false`.

Do NOT require battle-backdrop or encounter coverage for `windStairRidge`; REQ-113 intentionally stabilized the map as combat-free to protect the REQ-082 encounter authority chain.

## 5. ACCEPTANCE

- smoke guard is injected late enough to read all required runtime status objects;
- `?lqSmoke` assembled browser run passes with current implementation;
- removing any covered integration would fail closed;
- normal gameplay path performs no mutation from the guard;
- JavaScript/add-on/static/contract/browser/touch-fullscreen/north-route/encounter regressions PASS;
- Pages deployment SUCCESS before VERIFY.

EOF
