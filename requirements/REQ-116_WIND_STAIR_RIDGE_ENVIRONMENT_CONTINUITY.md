# REQ-116 — WIND STAIR RIDGE ENVIRONMENT CONTINUITY

- ID: `REQ-116`
- TITLE: `Wind Stair Ridge Environment Continuity`
- PRIORITY: `P2`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / PRESENTATION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## 1. FRESH PROBLEM EVIDENCE

The already-published `windStairRidge` map is present at HEAD, but fresh cross-system audit found it missing from four established environmental presentation systems used by the adjacent high-altitude north route:

1. `addons/world-ambient-layer.js` — no regional ambient type, so the layer is removed on this map.
2. `addons/world-cloud-shadows.js` — absent from OUTDOOR and mist classification, so broad cloud shadows do not render.
3. `addons/footstep-particles.js` — absent from OUTDOOR and terrain classification, so movement has no terrain-aware step particles.
4. `addons/world-landmark-lighting.js` — no map lighting spec despite the map containing an old wind pillar, high exposed path and north boundary comparable to adjacent ridge maps.

This produces a player-visible presentation drop when moving from `cloudbreakSaddle` into the existing `windStairRidge`.

## 2. STORY-CANON BOUNDARY

This requirement MUST NOT:

- create another north map;
- create/alter Leon clues, dialogue, story flags or Story Beats;
- decide the Chapter 1 stopping role;
- create/name/age/characterize Leon's sister;
- invent Chapter 2;
- add north-transition authority;
- change battle/encounter authority;
- wire `STORY_CANON.md` into `AUTONOMOUS_DEV_DIRECTIVE.md` early.

Only environmental presentation integration for the already-published map is authorized.

## 3. IMPLEMENTATION TARGET

Integrate `windStairRidge` into the established high-altitude environment systems with the same spoiler-safe visual vocabulary as adjacent maps:

- regional ambience: fog;
- cloud shadows: outdoor + mist class;
- footsteps: mist terrain effect;
- landmark lighting: a small set of cliff/wind glints aligned to existing map landmarks, without changing collision or interactable coordinates.

Do not add music-specific work unless fresh evidence shows incorrect theme selection. Current music system intentionally treats non-safe maps as generic `wild`, so no change is required there.

## 4. P0 SAFETY

MUST NOT alter:

- REQ-021 Tap Anywhere Action authority;
- REQ-022 iPhone fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership / movement stop;
- save schema;
- collision;
- map coordinates;
- canonical Action;
- battle / encounter authority.

## 5. ACCEPTANCE

In assembled runtime:

- `LQ_WORLD_AMBIENT_STATUS.hasMap('windStairRidge') === true` and type is `fog`.
- `LQ_WORLD_CLOUD_STATUS.hasMap('windStairRidge') === true` and class is `mist`.
- `LQ_FOOTSTEP_PARTICLE_STATUS.hasMap('windStairRidge') === true` and kind is `mist`.
- `LQ_WORLD_LANDMARK_LIGHT_STATUS.hasMap('windStairRidge') === true` with at least two presentation-only glints using only existing map coordinates/landmarks.
- no story/save/input/battle authority change.
- JavaScript validation PASS.
- static / contract / assembled-browser / touch-fullscreen / north-route / encounter regressions PASS.
- Pages deployment SUCCESS before moving to VERIFY.
- IOS_PHYSICAL_VERIFICATION remains PENDING until Owner checks a real iPhone.

EOF
