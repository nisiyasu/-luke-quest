# REQ-133 — Chapter 1 Complete Upper Pursuit Guidance Closure

PRIORITY: P1
STATUS: IN_PROGRESS
OWNER_SOURCE: Autonomous fresh-code audit under continuous development directive.

## Problem
After `flags.chapter1Complete === true`, REQ-132 closes the shared NORTH ROUTE COMPASS and lower-route guidance, but three upper pursuit maps still generate explicit player-facing pursuit instructions and pulsing objective markers:

- `windShelf`: `.lqWindShelfGuide` + `.lqWindShelfMarker`
- `skylineTraverse`: `.lqSkylineGuide` + `.lqSkylineMarker`
- `cloudbreakSaddle`: `.lqCloudbreakGuide` + `.lqCloudbreakMarker`

These are active progression commands, not passive environmental history. They can therefore tell a player who already completed Chapter 1 to continue chasing Leon north.

## Scope boundary
Preserve the maps, traversal, encounters, environmental landmarks, historical tracks, and free-exploration interactions. Do not erase scenery merely because it points north. Suppress only active pursuit-guidance projections after Chapter 1 completion.

`windStairRidge` currently exposes static interactable landmarks rather than a separate always-on guide/marker projection. It remains outside this requirement unless fresh evidence shows an active stale UI projection.

## Requirements
1. `flags.chapter1Complete === true` is terminal authority for the three upper-map active guidance projections.
2. On `windShelf`, no `.lqWindShelfGuide` or `.lqWindShelfMarker` may remain after completion.
3. On `skylineTraverse`, no `.lqSkylineGuide` or `.lqSkylineMarker` may remain after completion.
4. On `cloudbreakSaddle`, no `.lqCloudbreakGuide` or `.lqCloudbreakMarker` may remain after completion.
5. Already-rendered stale guide/marker DOM must be removed on render/sync after completion.
6. Before completion, existing clue-first -> north guidance behavior must remain unchanged.
7. If a deterministic test toggles completion true then false, pre-completion guidance must be able to render again; terminal suppression must not permanently damage the subsystem.
8. Do not mutate save/story/collision/encounter/map-transition/input authority.
9. Do not invent Chapter 2 destination, objective, dialogue, or story.
10. Preserve REQ-021 Tap Anywhere, REQ-022 iPhone Fullscreen, and REQ-001 Dynamic Touch Controller behavior.
11. IOS_PHYSICAL_VERIFICATION remains PENDING until Owner device evidence exists.

## Acceptance
- Deterministic browser regression proves each covered map renders guidance before completion.
- The same regression proves each covered map removes both guide and marker after `chapter1Complete=true`.
- Regression proves guidance can render again when testing an unfinished Chapter 1 state.
- Existing REQ-105/106/107/108/121 traversal and Chapter 1 climax regressions remain green.
- Standard Pages workflow succeeds and includes the modified modules.
- Render-liveness remains green.
- WORK_QUEUE.md and CURRENT.md reflect REQ-133 as the sole WIP until machine/public completion, then VERIFY.
- IOS_PHYSICAL_VERIFICATION=PENDING.
