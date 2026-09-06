# REQ-076 — Optional Boss Autosave Pulse Coverage

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / SAVE-FEEDBACK / OPTIONAL-BOSS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit after REQ-073..075 found that `forestMiniBossDefeated` is durable optional progress and is now represented in journal/records, but `addons/autosave-pulse.js` does not include it in optional progress coverage.

Canonical save ownership remains `index.html save()`. This requirement changes only the existing presentation-only autosave feedback signature so the player receives the same save-feedback cue for this durable optional-boss completion as for other major optional completions.

## 1. REQUIRED BEHAVIOR

- `forestMiniBossDefeated` participates in the autosave progress signature.
- A false→true transition is detectable by the existing autosave pulse mechanism.
- Existing elder charm, forest bounty and herb sample optional progress coverage remains intact.
- Existing treasure/hidden/cache dynamic coverage remains intact.
- Do not call a second save path or mutate progress. This is feedback coverage only.
- Do not pulse merely for `forestMiniBossWarned`; discovery is not the durable completion boundary targeted here.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. `forestMiniBossDefeated` is present exactly once in dynamic progress flags;
2. toggling only that flag changes `progressSignature()`;
3. toggling only `forestMiniBossWarned` does not change the signature;
4. original optional completion flags remain present;
5. no state mutation;
6. assembled browser regression PASS;
7. 390x844 touch/fullscreen visual-liveness PASS;
8. Pages deployment SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if safe useful work remains.
