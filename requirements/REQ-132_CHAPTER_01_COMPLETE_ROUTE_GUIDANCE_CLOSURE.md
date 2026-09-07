# REQ-132 — Chapter 1 Complete Route Guidance Closure

PRIORITY: P1
STATUS: VERIFY
OWNER_SOURCE: Autonomous fresh-code audit under continuous development directive.

## Problem
After `flags.chapter1Complete === true`, REQ-129 closes the canonical MAIN OBJECTIVE and REQ-131 closes reactive NPC dialogue, but separate north-pursuit presentation modules can still tell the player to continue north.

Fresh evidence:
- `addons/north-route-compass.js` still emits route-specific `FORWARD` copy such as `北側の痕跡を追う` / `北へ続く尾根道を探す`, and its `evacRoute` branch bypasses canonical MAIN OBJECTIVE entirely.
- `addons/zzzzzz-north-cliff-local-guidance.js` always decorates `northCliffRoad` with pursuit objective text and a north-bound marker when the map is active.
- `addons/zzzzzzzz-windcut-pass-local-guidance.js` always decorates `windcutPass` with pursuit objective text and a north-bound marker when the map is active.

This creates player-visible stale pursuit guidance after Chapter 1 has already ended.

## Requirements
1. `chapter1Complete` is terminal authority for these route-guidance projections.
2. After Chapter 1 completion, NORTH ROUTE COMPASS must not render on any covered pursuit-route map.
3. After Chapter 1 completion, northCliffRoad local pursuit objective/marker must not render.
4. After Chapter 1 completion, windcutPass local pursuit objective/marker must not render.
5. Any already-rendered stale compass, fallback guidance, objective decoration, or pursuit marker must be cleaned up on render/sync after completion.
6. Pre-completion behavior must remain unchanged.
7. Do not mutate save/story/collision/encounter/input authority.
8. Do not invent Chapter 2 destination, quest, dialogue, or objective.
9. Existing REQ-021 / REQ-022 / REQ-001 input/fullscreen behavior remains protected.
10. IOS_PHYSICAL_VERIFICATION remains PENDING until Owner device evidence exists.

## Acceptance
- Deterministic machine check proves Chapter 1 complete suppression for compass, northCliff guidance, and windcut guidance.
- Equivalent pre-completion cases still produce their existing guidance.
- Pages workflow succeeds and includes the modified modules.
- WORK_QUEUE.md / CURRENT.md are synchronized after machine/public completion.

## Verification checkpoint — 2026-09-07
- Final regression checkpoint: `e4c7585fae8036678d8673973614dda2ae135533`.
- northCliff and windcut smoke coverage proves terminal suppression plus pre-completion restoration.
- Standard Pages run `34100979461`: SUCCESS.
- Render Liveness run `34100979510`: SUCCESS.
- REQ-121 progression regression run `34100979538`: SUCCESS.
- REQ-128 Chapter 1 climax regression run `34100979558`: SUCCESS.
- Cache-busted public recovery/deploy run `34101080278`: SUCCESS.
- IOS_PHYSICAL_VERIFICATION: PENDING.
