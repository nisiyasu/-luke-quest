# LUKE QUEST Modern 3D Prototype — M00

STATUS: DONE
STAGE: M00
PROTOTYPE_BRANCH: `prototype/modern-3d`
SOURCE_GOLD_SHA: `6b080a30d353ec348ac656a98741edf514e574b3`
SOURCE_MAIN_SHA: `30a92165dfd2d44183d3687ad1a8e14f1e2b6529`
M00_VERIFIED_SHA: `75fc8916352ed59e0b125dff3d5abdc4de4cf114`
M00_ACTIONS_RUN: `34594703224` = SUCCESS
STARTED_AT: `2026-09-11`

## Isolation contract

This directory is an isolated technology/art prototype. It must not replace the current LUKE QUEST runtime, save keys, input authority, story state, or production Pages build while M00–M12 are under evaluation.

Implementation work happens on `prototype/modern-3d`, created directly from the fresh Gold SHA above. Gold/main are comparison/reference branches, not write targets for this prototype.

## Canonical visual authority

Inherited from the source Gold snapshot and verified accessible on the isolated branch:

- `../../assets/reference/owner_2026-09-11_ps1_visual_target/CURRENT_BAD.png` — historical/before only
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png` — minimum acceptable quality floor
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png` — primary final target
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/README.md` — interpretation contract

Reaching the minimum-quality image is not final completion.

## M00 runtime/capability audit

| Capability | Status | Evidence / rule |
|---|---|---|
| GitHub file creation/update | VERIFIED | isolated branch and committed prototype files |
| Three.js implementation | VERIFIED | `index.html` pins Three.js 0.186.0; CI loaded revision 186 |
| 3D asset production | ALTERNATIVE_AVAILABLE | procedural Three.js geometry/materials rendered successfully; authored/model assets remain later-stage work |
| Browser/WebGL execution | VERIFIED | Actions run `34594703224`; browser module + WebGL gate SUCCESS |
| Screenshot capture | VERIFIED | real 390x844 non-black WebGL artifact captured and visually inspected |
| Video artifact toolchain | VERIFIED | Chrome frame capture + ffmpeg/ffprobe MP4 artifact succeeded in run `34594703224` |
| True motion-delta recording | NOT_YET_VERIFIED | the M00 frame sequence encoded successfully but deterministic headless snapshots were identical; before any stage requiring motion proof, capture a demonstrably changing sequence rather than pretending this is already solved |
| iPhone physical verification | PENDING | automation does not claim physical iPhone PASS |

## Verified M00 frame

The real 390x844 CI frame shows:
- WebGL2 ready
- lit 3D grass plane
- 3D river plane
- dimensional plank bridge and posts
- conifer geometry
- a simple blue-haired player proxy
- cast/received shadows

This is **capability evidence only**, not an art-quality pass and not evidence that the minimum/final visual references have been reached.

## Three.js pin

Prototype bootstrap pins `three@0.186.0`. This was selected as the npm `latest` release observed on 2026-09-11, then fixed to an explicit version so future runs do not silently change renderer behavior.

## M00 close-gate result

1. isolated branch exists and Gold/main were not overwritten — PASS
2. canonical reference images accessible — PASS
3. Three.js actually loads in browser — PASS
4. WebGL renderer creates real frame — PASS
5. real portrait screenshot captured, non-black, visually inspected — PASS
6. reproducible implementation/screenshot tooling committed — PASS
7. unavailable/unproven capability recorded honestly — PASS

M00 is DONE. M01 may begin. Issue registration or file existence alone was not used as completion evidence.
