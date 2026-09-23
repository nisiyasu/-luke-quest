# T014 G0 Canonical State v1

STATUS: FIXED
TASK_ID: T014
FEATURE_REF: spec/target-image-to-threejs-20260921
CANONICAL_STATE_VERSION: v1
IMPLEMENTATION_BASE_HEAD: 07320aa450e9f6011e2b09e19eb2058abad34689

## Purpose
Freeze the reproducible game/runtime conditions used for Target-vs-Actual comparison. This record implements the baseline-state requirement in spec FR-006 without importing legacy scene layout or offsets.

## Fixed comparison state
- scene: #101 royal-capital-outskirts vertical slice only; no other scene may be substituted for evidence.
- target identity: TARGET_PS1_FINAL.png, blob b7281e6580689a7a22cfa3b67d500950e4af7285, source commit 90635ceff9d35d69f80da350df1e6ea0610657dd.
- viewport: 941x1672 CSS pixels.
- DPR: 1.
- crop: none.
- padding: none.
- fullPage: false.
- orientation: portrait.
- character state: one canonical player proxy/character only; transform must be the target-derived canonical transform, not a legacy-scene spawn/offset. Until that transform is durably defined by the G0 target-analysis work, evidence capture is INVALID rather than silently falling back to an arbitrary position.
- character animation: deterministic idle/reference pose; animation time frozen at reference frame for comparison capture.
- camera state: canonical verification camera only. Numeric camera parameters are owned by the dedicated G0 canonical-camera task; until those parameters are durably fixed, comparison capture is INVALID rather than using a legacy camera correction.
- time: frozen for comparison capture; no wall-clock-driven scene changes.
- weather: deterministic static reference weather; no random/weather-cycle mutation during comparison capture.
- UI: comparison UI state is deterministic and fixed; non-reference debug/diagnostic overlays are hidden from visual evidence. Required game UI, if later declared part of the Target authority, must be explicitly versioned rather than toggled ad hoc.
- random state: deterministic seed/reset required before capture; no unseeded randomness may affect evidence.
- simulation: settle deterministically, then freeze comparison-sensitive motion before capture.
- quality state: must be recorded with evidence and must not alter camera/object/game-state identity.

## Reproduction contract
1. Load only the #101 reconstruction scene on experiment/target-image-threejs-v1.
2. Reset runtime state to this Canonical State version.
3. Apply the canonical player transform and canonical verification camera only after their G0 records exist.
4. Reset deterministic random/time/weather/animation/UI state.
5. Use 941x1672, DPR=1, no crop/padding, fullPage=false, portrait.
6. Capture only after deterministic settle/freeze.
7. Record exact implementation HEAD with every evidence set.

## Invalid comparison conditions
Evidence is INVALID if any of the following occurs: legacy prototype/modern-3d scene offsets or camera corrections are imported; player/camera transform is guessed; viewport/DPR differs; random/time/weather/animation state is uncontrolled; debug overlays contaminate the frame; exact implementation HEAD is missing.

## Authority and separation
- T013 Reference Set v1 fixes target identity.
- T014 fixes the comparison-state contract.
- Later G0 tasks may fill target-derived numeric landmark/camera values, but may not silently change this state contract; a semantic change requires a new Canonical State version.
- This record does not modify prototype/modern-3d and does not reuse old visual-scene layout/offset patches.

## Fresh evidence used
- Issue #128 execution contract.
- tasks.md: T014 = Canonical Stateを固定する.
- spec.md FR-006 and canonical comparison viewport requirements.
- OWNER_REQUIREMENTS_v1.0.md section 10 baseline-state fields.
- T013_G0_REFERENCE_SET_v1.md target identity.
- implementation HEAD 07320aa450e9f6011e2b09e19eb2058abad34689.

RESULT: PASS
