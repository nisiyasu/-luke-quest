# M04-P02 Return Triage — 2026-09-16

Program: `LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2`
Packet: `M04-P02` / Issue #34
Returned from: `M06-P01` / Issue #37
Evidence HEAD inspected: `ad8c0e82d496f22c4a1328b8651ff66ef50ebb7f`
Current implementation branch observed: `prototype/modern-3d` at `b59fe95c54b5a346eb0a50c5b95db5b4213992c9`

## Causal classification

The latest M06-P01 adversarial evidence did **not** identify a terrain continuity seam, hole, floating bank, or exposed world-bottom defect. It identified the remaining target-gap as intrinsic rock/ground visual quality: rock forms read too smooth/rounded and weakly integrated with the ground/shore compared with the target family.

This matches M04-P02's explicit FAIL ROUTING for primitive-looking rocks / weak rock-ground contact, so the router was corrected from M06-P01 to M04-P02.

## Acceptance impact

M04-P02 must not be advanced on the historical PASS alone. A fresh implementation/evidence cycle must demonstrate:

- at least 3 distinct rock silhouettes;
- visible faceting / non-spherical contour language;
- grounded contact with no obvious hovering;
- integration with shore/terrain massing rather than isolated pebble-like placement;
- HQ and practical tiers both render acceptably;
- direct comparison against `TARGET_PS1_FINAL` and `MINIMUM_QUALITY_LINE`;
- no regression to traversal/collision/readability.

## Guard

Do not route back to M06-P01 unless a fresh M04-P02 artifact shows an actual terrain continuity defect. Do not advance to M04-P03 until fresh exact-HEAD visual evidence satisfies the packet acceptance checklist.
