# DUNGEON G0 COMPOSITION LOCK

Parent: #53
Current child: #82
Component ID: `DUNGEON-G0-COMPOSITION-A`
Target authority: `prototype/modern-3d:references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png`
Implementation branch: `environment/dungeon`

## Fixed Reference Anchor Lock v1

This document freezes the identity of the G0 composition target before implementation. It does not claim visual acceptance.

### Stable composition anchors

The following semantic anchors are fixed for #82 and must not be silently substituted on later runs:

- `PLAYER-A` — player screen position and scale
- `MAIN-PATH-A` — principal stone traversal route
- `BRIDGE-A` — primary bridge position/direction
- `ELEVATION-A` — main stepped/layered elevation change
- `WATER-GAP-A` — primary water gap/channel separating route masses
- `UPPER-DOOR-A` — upper doorway / destination focus
- `SIDE-PLATFORM-A` — principal side platform mass
- `WATERFALL-A` — principal visible waterfall placement

### Target ROI state

Exact normalized ROI `(x%, y%, w%, h%)` for each anchor is intentionally **not fabricated** in this checkpoint. It must be measured from the Owner target raster itself before geometry is claimed to match. Until measured, each anchor ROI remains `MEASUREMENT_PENDING`.

### Hard anchors / depth layers

- Near layer: `PLAYER-A`, near portion of `MAIN-PATH-A`
- Mid layer: `BRIDGE-A`, `WATER-GAP-A`, `SIDE-PLATFORM-A`
- Far/upper layer: `ELEVATION-A`, `UPPER-DOOR-A`, `WATERFALL-A`

### Gate rule

#82 cannot PASS until the target raster is visually measured, the exact normalized ROI values are recorded for the anchors above, fresh exact-HEAD runtime evidence is captured, and major route geometry/silhouettes align at approximately 95% composition fidelity. Materials, moss, lighting, and decoration cannot compensate for G0 mismatch.
