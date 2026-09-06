# REQ-076 — Optional Boss Autosave Pulse Coverage

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / SAVE-FEEDBACK / OPTIONAL-BOSS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit after REQ-073..075 found that `forestMiniBossDefeated` is durable optional progress and is represented in journal/records, but `addons/autosave-pulse.js` did not include it in optional progress coverage.

Canonical save ownership remains `index.html save()`. This requirement changes only the existing presentation-only autosave feedback signature so the player receives the same save-feedback cue for this durable optional-boss completion as for other major optional completions.

## 1. REQUIRED BEHAVIOR

- `forestMiniBossDefeated` participates in the autosave progress signature.
- A false→true transition is detectable by the existing autosave pulse mechanism.
- Existing elder charm, forest bounty and herb sample optional progress coverage remains intact.
- Existing treasure/hidden/cache dynamic coverage remains intact.
- No second save path is added and no progress is mutated. This is feedback coverage only.
- `forestMiniBossWarned` is intentionally excluded from the durable-completion pulse signature.

## 2. ACCEPTANCE

Automated acceptance proves:
1. `forestMiniBossDefeated` is present exactly once in dynamic progress flags;
2. toggling only that flag changes `progressSignature()`;
3. toggling only `forestMiniBossWarned` does not change the signature;
4. original optional completion flags remain present;
5. no state mutation;
6. assembled browser regression PASS;
7. 390x844 touch/fullscreen visual-liveness PASS;
8. Pages deployment SUCCESS.

## 3. IMPLEMENTATION / VERIFICATION EVIDENCE

- `addons/autosave-pulse.js` adds `forestMiniBossDefeated` to `OPTIONAL_PROGRESS_FLAGS`; the existing `Set`-based dynamic flag projection keeps it unique alongside treasure/hidden/cache dynamic flags.
- No canonical save call was added. Existing `index.html save()` ownership remains unchanged.
- During implementation self-audit detected an accidental unrelated CSS drift in the autosave pulse presentation. It was repaired immediately before acceptance, restoring the original pulse animation and green dot while retaining only the intended optional-boss coverage change.
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-autosave-optional-boss-smoke.js` participates in assembled `?lqSmoke=1` and verifies unique coverage, signature change on defeat, no signature change on warning-only discovery, preservation of existing optional completion flags, and no input-state mutation.
- Checkpoints:
  - `970c632af0139ec80f91eb03952fa3a590ff4cdf` — register REQ-076.
  - `6dcdeec801ba6043f7720f66f267fa6b7c89ecf0` — add optional boss completion coverage.
  - `0bd7100ae779a702e722967d34c81a5beb513ad4` — self-repair unrelated autosave pulse presentation drift.
  - `d0e94371bf00cc15b8777a74cbf526e5be6ece1d` — assembled-browser acceptance gate.
- GitHub Pages workflow run `34019432206`: SUCCESS. Sequential/add-on syntax, static regression, add-on contract, assembled browser smoke, 390x844 floating-touch/fullscreen visual-liveness, upload and Pages deployment all succeeded.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device PASS is claimed.

## 4. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if safe useful work remains.
