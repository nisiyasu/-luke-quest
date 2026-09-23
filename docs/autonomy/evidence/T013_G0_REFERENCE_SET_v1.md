# T013 G0 Reference Set v1

STATUS: FIXED
TASK_ID: T013
FEATURE_REF: spec/target-image-to-threejs-20260921
REFERENCE_SET_VERSION: v1
FIXED_AT_UTC: 2026-09-23T04:25:30Z
IMPLEMENTATION_BASE_HEAD: 21e8130cf19abef563165ec7c61bbdc13f554e48

## Primary Owner Target
- role: PRIMARY_FINAL_TARGET
- path: assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png
- blob_sha: b7281e6580689a7a22cfa3b67d500950e4af7285
- target_source_commit_sha: 90635ceff9d35d69f80da350df1e6ea0610657dd
- meaning: Owner-approved final visual destination. Do not downgrade to mood-board status.

## Supporting References
### Minimum quality floor
- role: MINIMUM_QUALITY_FLOOR
- path: assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png
- blob_sha: c9b3dc73be27c4a69ad9d7ec1b1d421c9de9d9a5
- meaning: minimum acceptable continuation line, not final completion.

### Regression / starting-point reference
- role: REGRESSION_STARTING_POINT_ONLY
- path: assets/reference/owner_2026-09-11_ps1_visual_target/CURRENT_BAD.png
- blob_sha: a60b9d460b2fa31fcf6250c653cbefcc743ea812
- meaning: old low-quality starting point; never desired visual direction.

## Mandatory comparison ladder
CURRENT_BAD.png -> candidate build -> MINIMUM_QUALITY_LINE.png -> TARGET_PS1_FINAL.png

## Identity rule
T013 Reference Set v1 is fixed by exact repository paths and blob identities above. The primary target identity for visual-rebuild remains target_source_commit_sha=90635ceff9d35d69f80da350df1e6ea0610657dd and target_blob_sha=b7281e6580689a7a22cfa3b67d500950e4af7285. Any later replacement requires an explicit version change and must not silently drift this v1 record.

## Fresh evidence used
- Issue #127 body: T013 execution contract.
- tasks.md on spec/target-image-to-threejs-20260921: T013 = create G0 Reference Set v1.
- assets/reference/owner_2026-09-11_ps1_visual_target directory on exact implementation base HEAD.
- assets/reference/owner_2026-09-11_ps1_visual_target/README.md role definitions.
- visual-rebuild Gateway target identity on main.

RESULT: PASS
