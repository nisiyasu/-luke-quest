# LUKE QUEST Modern 3D Prototype — M00

STATUS: IN_PROGRESS
STAGE: M00
PROTOTYPE_BRANCH: `prototype/modern-3d`
SOURCE_GOLD_SHA: `6b080a30d353ec348ac656a98741edf514e574b3`
SOURCE_MAIN_SHA: `30a92165dfd2d44183d3687ad1a8e14f1e2b6529`
STARTED_AT: `2026-09-11`

## Isolation contract

This directory is an isolated technology/art prototype. It must not replace the current LUKE QUEST runtime, save keys, input authority, story state, or production Pages build while M00–M12 are under evaluation.

Implementation work happens on `prototype/modern-3d`, created directly from the fresh Gold SHA above. Gold/main are comparison/reference branches, not write targets for this prototype.

## Canonical visual authority

Inherited from the source Gold snapshot:

- `../../assets/reference/owner_2026-09-11_ps1_visual_target/CURRENT_BAD.png` — historical/before only
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png` — minimum acceptable quality floor
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png` — primary final target
- `../../assets/reference/owner_2026-09-11_ps1_visual_target/README.md` — interpretation contract

Reaching the minimum-quality image is not final completion.

## M00 runtime/capability audit

| Capability | Status | Evidence / rule |
|---|---|---|
| GitHub file creation/update | VERIFIED | this isolated branch and files |
| Three.js implementation | IN_PROGRESS | `index.html` pins Three.js 0.186.0; runtime gate must prove load |
| 3D asset production | ALTERNATIVE_AVAILABLE | procedural Three.js geometry/materials are allowed for early gates; authored/model assets remain later-stage work |
| Browser/WebGL execution | PENDING | must be proven by CI browser gate, not assumed |
| Screenshot capture | PENDING | CI must upload a real 390x844 screenshot artifact |
| Video/dynamic evidence | NOT_YET_VERIFIED | not required to close the first browser bootstrap; must be verified before a stage that requires video evidence |
| iPhone physical verification | PENDING | automation does not claim physical iPhone PASS |

## Three.js pin

Prototype bootstrap pins `three@0.186.0`. This was selected as the npm `latest` release observed on 2026-09-11, then fixed to an explicit version so future runs do not silently change renderer behavior.

## M00 close gate

M00 may move to DONE only after all of the following are evidence-backed:

1. isolated branch exists and Gold/main were not overwritten;
2. canonical reference images are accessible;
3. Three.js actually loads in a browser;
4. WebGL renderer creates a real frame;
5. a real screenshot is captured and is non-black;
6. implementation/screenshot tooling is reproducible from repository instructions;
7. unavailable capabilities are recorded honestly.

Issue registration or file existence alone is not M00 completion.
