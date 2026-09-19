# DUNGEON G0 COMPOSITION LOCK

Parent: #53
Current child: #82
Component ID: `DUNGEON-G0-COMPOSITION-A`
Target authority: `prototype/modern-3d:references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png`
Implementation branch: `environment/dungeon`

## Fixed Reference Anchor Lock v1

This document freezes the identity and measured screen-space regions of the G0 composition target before geometry implementation. It does not claim visual acceptance.

Target raster measured in the 2026-09-20 run: 896 × 1664 px. ROI values below are normalized from the target image top-left and intentionally describe the same persistent visible instances on every later run.

## Stable composition anchors and frozen target ROIs

- `PLAYER-A` — ROI `(48.2%, 55.8%, 7.3%, 7.4%)`; the blue-haired player standing on the near central path. Hard anchors: near-right brazier, near-left brazier, path sidewalls. Depth: near.
- `MAIN-PATH-A` — ROI `(37.9%, 52.3%, 25.7%, 45.9%)`; the principal near-to-mid stone traversal spine running from the bottom edge toward the center. Hard anchors: PLAYER-A, both near braziers, central water gaps. Depth: near-to-mid.
- `BRIDGE-A` — ROI `(24.9%, 36.2%, 23.4%, 7.1%)`; the rope bridge crossing from the left mid platform toward the central route. Hard anchors: left torch platform, central path edge, water channel below. Depth: mid.
- `ELEVATION-A` — ROI `(70.9%, 19.4%, 13.8%, 12.0%)`; the principal upper stone stair flight descending from the destination platform. Hard anchors: UPPER-DOOR-A above, WATERFALL-A to the right, central landing below. Depth: far/upper.
- `WATER-GAP-A` — ROI `(31.5%, 42.0%, 28.5%, 17.5%)`; the primary deep blue water/chasm separation between the left bridge/platform mass and central route. Hard anchors: BRIDGE-A above-left, central path on right, lower arch/water channel below. Depth: mid/deep.
- `UPPER-DOOR-A` — ROI `(70.5%, 5.2%, 17.0%, 13.3%)`; the tall pointed destination doorway at the upper-right/far platform. Hard anchors: twin upper braziers, ELEVATION-A below, top-right route label overlay. Depth: far/upper.
- `SIDE-PLATFORM-A` — ROI `(78.4%, 38.0%, 21.6%, 23.0%)`; the large right-side mechanism platform and ruin mass. Hard anchors: lever/mechanism on top, WATERFALL-A above/right, lower-right waterfall below. Depth: mid.
- `WATERFALL-A` — ROI `(87.0%, 25.5%, 13.0%, 14.5%)`; the principal upper-right waterfall dropping beside the upper stair/platform mass. Hard anchors: ELEVATION-A left, UPPER-DOOR-A upper-left, SIDE-PLATFORM-A below. Depth: far-to-mid.

## Anchor revision rule

These identities and ROIs are now frozen. A later run must not silently substitute another bridge, waterfall, water gap, platform, doorway, or player instance. If an ROI proves genuinely ambiguous or unusable, record an explicit anchor revision in #82 and this document before changing it.

## Gate rule

#82 cannot PASS until fresh exact-HEAD runtime evidence is captured and the implemented camera/player/route/elevation/bridge/water geometry aligns with these same frozen target ROIs at approximately 95% composition fidelity. Materials, moss, lighting, and decoration cannot compensate for G0 mismatch.

Evidence trigger: measured G0 visual verification requested after `dungeon-g0.html` implementation.
