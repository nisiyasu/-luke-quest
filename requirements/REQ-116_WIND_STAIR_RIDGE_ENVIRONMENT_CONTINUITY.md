# REQ-116 — WIND STAIR RIDGE ENVIRONMENT CONTINUITY

- ID: `REQ-116`
- TITLE: `Wind Stair Ridge Environment Continuity`
- PRIORITY: `P2`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- COMPLETED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / PRESENTATION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## 1. FRESH PROBLEM EVIDENCE

The already-published `windStairRidge` map was present at HEAD, but fresh cross-system audit found it missing from four established environmental presentation systems used by the adjacent high-altitude north route:

1. `addons/world-ambient-layer.js` — no regional ambient type, so the layer was removed on this map.
2. `addons/world-cloud-shadows.js` — absent from OUTDOOR and mist classification, so broad cloud shadows did not render.
3. `addons/footstep-particles.js` — absent from OUTDOOR and terrain classification, so movement had no terrain-aware step particles.
4. `addons/world-landmark-lighting.js` — no map lighting spec despite the map containing an old wind pillar, exposed high route and north boundary comparable to adjacent ridge maps.

This produced a player-visible presentation drop when moving from `cloudbreakSaddle` into the existing `windStairRidge`.

## 2. STORY-CANON BOUNDARY

This requirement did NOT:

- create another north map;
- create/alter Leon clues, dialogue, story flags or Story Beats;
- decide the Chapter 1 stopping role;
- create/name/age/characterize Leon's sister;
- invent Chapter 2;
- add north-transition authority;
- change battle/encounter authority;
- wire `STORY_CANON.md` into `AUTONOMOUS_DEV_DIRECTIVE.md` early.

Only environmental presentation integration for the already-published map was changed.

## 3. IMPLEMENTATION

Integrated `windStairRidge` into the established high-altitude environment systems:

- `addons/world-ambient-layer.js`: `fog` regional ambience.
- `addons/world-cloud-shadows.js`: outdoor membership + `mist` cloud class.
- `addons/footstep-particles.js`: outdoor membership + `mist` terrain step effect.
- `addons/world-landmark-lighting.js`: three presentation-only glints aligned to already-existing landmark coordinates: `(11,16)` cliff, `(6,12)` wind, `(10,1)` wind.

Runtime audit fields expose `windStairRidgeIntegrated:true` in the touched presentation systems.

Implementation checkpoint sequence:

- ambient: `45a2662c58b02763282ef3533ac7dc12887c6d56`
- cloud shadows: `2f9315dcafa529b33c05d1732e18431bf8ab02de`
- footsteps: `6b062a52e0b27e2c91d4ef3c3803128f1632e022`
- complete implementation HEAD: `ca6f7e89e0412a91a501a48dcaf7a82803ff2c1c`

Music was fresh-audited but intentionally left unchanged: the existing music system classifies all non-safe world maps as the generic `wild` exploration theme, so `windStairRidge` already receives the correct existing behavior.

## 4. P0 SAFETY

No changes were made to:

- REQ-021 Tap Anywhere Action authority;
- REQ-022 iPhone fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership / movement stop;
- save schema;
- collision;
- map coordinates;
- canonical Action;
- battle / encounter authority.

## 5. VERIFICATION

Pages run `34050434067` for complete implementation HEAD `ca6f7e89e0412a91a501a48dcaf7a82803ff2c1c` completed `SUCCESS`.

The run passed:

- sequential JavaScript validation v08-v80;
- sequential JavaScript validation v81-v120;
- sequential JavaScript validation v121-plus;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- REQ-063 autosave bootstrap validation;
- PWA validation;
- base64 raster transport probe;
- approved Luke dialogue asset validation;
- bootstrap/presentation injection;
- assembled browser smoke;
- floating touch + iPhone world visual-liveness smoke;
- REQ-081 north-route smoke;
- REQ-082 encounter smoke;
- site upload;
- GitHub Pages deployment.

Acceptance:

- ambient hasMap + fog: PASS.
- cloud hasMap + mist: PASS.
- footstep hasMap + mist: PASS.
- landmark lighting hasMap + 3 glints: PASS.
- no story/save/input/battle authority change: PASS.
- automated browser/regression/public deployment: PASS.
- IOS_PHYSICAL_VERIFICATION: `PENDING` until Owner checks an actual iPhone.

## 6. FINAL STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
STATUS: `VERIFY`
IOS_PHYSICAL_VERIFICATION: `PENDING`

EOF
