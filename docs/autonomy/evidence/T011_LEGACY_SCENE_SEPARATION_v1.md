# T011 Legacy Scene Separation Evidence v1

TASK: T011
ISSUE: #124
IMPLEMENTATION_BRANCH: experiment/target-image-threejs-v1
VERIFIED_HEAD: 5471d7900e1fd560588a9796fa506c4b3debb290
NEW_IMPLEMENTATION_ROOT: prototypes/target-image-threejs/

## Durable boundary

The #101 rebuild now has a dedicated clean-room implementation root:
- prototypes/target-image-threejs/README.md
- prototypes/target-image-threejs/index.html
- prototypes/target-image-threejs/bootstrap.js

The new entrypoint imports only ./bootstrap.js. It does not import the legacy repository-root scene, old field implementation, or Aldia visual patch add-ons.

## Fresh verification

Exact-head code scan over index.html and bootstrap.js:
- whole-word MAPS dependency: NONE
- addons/ dependency: NONE
- aldia-* dependency: NONE
- prototype/modern-3d or prototypes/modern-3d dependency: NONE
- fixed 48px legacy tile dependency: NONE

bootstrap.js syntax check with node --check: PASS.
New entrypoint module link to ./bootstrap.js: PASS.

## Upstream evidence used

T008 ReuseInventory identified legacy scene-specific layout, offsets, MAPS/tile presentation and Aldia visual patches as non-reuse candidates.
T009 audit found movement/collision/traversal still coupled to legacy MAPS and scene state.
T010 audit found runtime diagnostics still coupled to legacy s/MAPS/shell/player state.
Therefore those legacy implementations are not imported into the new root.

## Old field safety

prototype/modern-3d Fresh remote HEAD after T011 implementation:
01b1ff506f10d3d32cfe0823a5ab1293376e9f50

The old field line was not modified by T011.

## Verdict

PASS.
Old scene layout/offset/visual patches remain available in legacy history/paths for rollback/reference, but are separated from the #101 active implementation dependency graph.
G0 may now build reference/baseline infrastructure inside prototypes/target-image-threejs/ without extending the old visual scene.