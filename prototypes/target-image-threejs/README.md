# LUKE QUEST #101 Target-Image Rebuild Implementation Root

STATUS: ACTIVE_IMPLEMENTATION_BOUNDARY
TASK: T011
ISSUE: #124
IMPLEMENTATION_ROOT: prototypes/target-image-threejs/

This directory is the clean-room implementation root for #101.
It is intentionally separated from the legacy field/runtime presentation.

## Forbidden dependencies for the new scene

The new implementation MUST NOT import or treat as composition authority:

- repository-root index.html legacy MAPS tile/layout data
- prototype/modern-3d or prototypes/modern-3d scene layout or offsets
- addons/aldia-* scene-specific placement, lighting, landmark, density or visual patches
- legacy fixed tile coordinates, old camera offsets, old NPC placement or old composition acceptance assumptions
- legacy emoji/tile visuals as production target visuals

## Reuse rule

Common game/runtime behavior may only be reused after explicit extraction from legacy presentation coupling.
T009 and T010 recorded that movement/traversal and runtime diagnostics are not yet scene-agnostic, so those legacy implementations are not imported here.

## Gate discipline

This root starts clean. G0 may add reference/baseline infrastructure.
G1 may add only whitebox composition until the G1 gate passes.
Production models, materials, lighting and decoration remain prohibited before their gates.

The old field line #12 / prototype/modern-3d remains a separate authority and is not modified by this boundary.