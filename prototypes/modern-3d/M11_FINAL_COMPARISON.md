# M11 Final Comparison — Technical Candidate

DOCUMENT_ID: LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2
STAGE: M11
STATUS: TECHNICAL_CANDIDATE / OWNER_EXPERIENCE_PENDING / IOS_PHYSICAL_PENDING

## Authority

- `assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png` is the minimum floor, not the finish line.
- `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png` is the primary final visual authority.
- `CURRENT_BAD.png` is historical/before evidence only.
- This document does **not** claim `FINAL_EQUIVALENT_OR_BETTER` or Owner subjective approval.

## Evidence used

- M10 packaged/runtime verification: Actions run `34666950635`.
- M10 verified artifact promotion: Actions run `34667769148`, result commit `a81c22ff123539b3d0da89c023bdba2d18bae411`.
- M10 CI-proxy performance record: `prototypes/modern-3d/M10_MEASUREMENT.md`.
- M11 target-gap repair implementation: `8259b62b284adfa820eb7b35430a9d54da44af25`.
- M11 post-repair multi-position / multi-viewport UI and scene evidence: Actions run `34668105787` = SUCCESS at implementation-equivalent head `32a1abdc8099f4b321d63ae1024d7e4b4f858ac1`.
- M11 fresh M08 motion regression is required after its stale source assertion repair; do not close M11 unless the fresh rerun passes.

## Functional / visual / performance separation

### Functional

The existing player movement, grounding, collision, camera follow, release handling and HUD behavior remain the functional authority. M11 did not intentionally redesign those systems. Fresh M08 regression evidence must pass before M11 close.

### Visual quality

The post-repair scene was compared against both reference levels. The first material repair deliberately addressed the largest visible differences rather than performing tiny local polish:

1. **Water** — moved the river toward brighter cyan/turquoise, stronger reflection/sparkle/caustic response, stronger shoreline foam and additional rocks.
2. **Vegetation and atmosphere** — lifted conifer foliage and bark values, warmed/brightened sky fill and sun, and reduced the overly dark forest read.
3. **Bridge material** — moved timber away from red/orange toward warm weathered honey/tan/brown.

These changes materially reduce the gap while preserving the already-verified M03–M10 layout, traversal, character and UI authorities.

## Axis assessment

Labels follow the M01 comparison contract.

| Axis | M11 technical assessment | Evidence / remaining gap |
|---|---|---|
| Composition | TOWARD_FINAL | Player, bridge/path, river, forest enclosure and route hierarchy remain clear in portrait and landscape evidence. |
| Terrain | TOWARD_FINAL | Layered banks, cliffs and route elevation are present; final target retains richer authored micro-detail. |
| Vegetation | TOWARD_FINAL | Multi-mass conifers, understory, flowers and overlap are present; target still has denser premium foliage detail. |
| Bridge | TOWARD_FINAL | Deck/support structure and material read are established; repair moved timber closer to target honey/brown palette. |
| Water | TOWARD_FINAL | Continuous river, shoreline response, motion/light behavior and brighter turquoise read are present; target retains richer granular white-current detail. |
| Player | TOWARD_FINAL | Blue-haired protagonist remains readable, grounded and animated; no proxy/capsule final claim. |
| Light & color | TOWARD_FINAL | Warm sun / cool water separation and readable shadows remain; repair reduced the earlier dark/flat read. |
| Overall density | TOWARD_FINAL | Foreground/midground/background props and natural clusters are established; target remains materially denser at micro-detail level. |
| UI | TOWARD_FINAL | Compact safe-area HUD remains readable and non-dominant in multi-viewport evidence; Owner premium-finish judgment remains pending. |

No axis is intentionally accepted merely because it reached the minimum floor. No `FINAL_EQUIVALENT_OR_BETTER` claim is made without Owner acceptance or stronger evidence.

## Performance

M10 measured HIGH and PRACTICAL presets separately in browser/CI proxy conditions. Practical reduces effective DPR and shadow-map size while HIGH preserves the higher visual preset. This is proxy evidence only and cannot be relabeled as physical-iPhone performance.

`IOS_PHYSICAL_VERIFICATION: PENDING`

## Current Top 3 gaps after repair

1. Target water contains more granular white-current / rapid detail than the current procedural river.
2. Target vegetation and ground treatment still carry more hand-authored micro-detail and silhouette richness.
3. Target overall premium material/UI finish remains stronger; subjective final-quality acceptance belongs to Owner authority.

## M11 technical close rule

M11 may close as a **technical candidate** when all of the following hold:

- no major axis is `BELOW_MINIMUM`;
- the material Top-3 gap repair above is implemented and runtime evidence is fresh;
- fresh movement/input/camera regression passes after the M08 test-contract repair;
- M09 multi-position/multi-viewport evidence remains green;
- M10 HIGH/PRACTICAL proxy-performance evidence remains separated from physical-device evidence;
- Owner experience and physical iPhone states remain explicitly `PENDING` rather than being inferred.

M11 closure does not authorize Gold replacement, main merge, or a claim that the final visual target has been fully reached.

ROLLBACK_POINT: `a81c22ff123539b3d0da89c023bdba2d18bae411`
OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
