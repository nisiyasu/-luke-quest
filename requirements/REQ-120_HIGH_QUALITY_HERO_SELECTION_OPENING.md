# REQ-120 — HIGH-QUALITY HERO SELECTION OPENING

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / STORY / OPENING / TUTORIAL / PRESENTATION
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`
SOURCE_REQUIREMENT: `requirements/REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING.md`
STORY_AUTHORITY: `STORY_CANON.md / OPENING CONFIRMED`
ID_RECOVERY: `REQ-118 collided with the already-implemented Wind Stair cross-system guard. This file is the unique active successor for the Owner-approved Opening.`
IOS_PHYSICAL_VERIFICATION: PENDING
OWNER_VISUAL_PACING_APPROVAL: PENDING

## MANDATORY SOURCE LOAD

Before any future re-audit or modification, fresh-read `requirements/REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING.md` in full and apply every story beat, safety boundary, save/new-game rule, mobile rule, checkpoint, automated verification item, completion condition, and DO-NOT rule there as the detailed specification for REQ-120.

Where that source says the Opening may use visual-richness systems from `REQ-117`, interpret that dependency as the recovered active visual-richness requirement `REQ-119`.

## IMPLEMENTED OPENING CHECKPOINTS

A. Cold Open / Aldia Morning — implemented in `addons/opening-prologue-ab.js`.
B. Luke Introduction / Playable Aldia Walk — implemented in `addons/opening-prologue-ab.js`.
C. School Training Flashback / Battle Tutorial — implemented in `addons/opening-prologue-c-mock-battle.js` with deterministic Luke victory and no main HP/EXP/G/wins mutation.
D. Leon Private Anxiety Scene — implemented in `addons/opening-prologue-de-anxiety-ceremony.js` with repeated high achievement, second-place/runner-up evidence and `もし、光らなかったら？` pressure beat.
E. Hero Selection Ceremony — implemented in the same D+E add-on with Leon called/absent, crowd reaction, Eleanor recovery and Luke called.
F. Abnormal Crystal Reaction — implemented in `addons/opening-prologue-fg-crystal-climax.js` with pause -> white -> blue -> gold surge and a brief unexplained dark pulse; reduced-motion safe.
G. Luke Selected / Tone Release — implemented in F+G with `……え、僕ですか？`, Eleanor public congratulations and private `……なぜ？` beat.
H. Leon Missing / First Mission / Chapter 1 handoff — implemented in `addons/opening-prologue-h-chapter-handoff.js` with escape report, monster-forest direction, first mission, natural Luke comedy, Chapter I title and canonical world handoff.

## END-TO-END HARDENING

`addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-opening-e2e-smoke.js` runs a late full Opening path under the assembled `?lqSmoke` browser gate and verifies:

- fresh NEW GAME enters the new Opening;
- A+B playable Aldia morning;
- C tutorial battle returns cleanly;
- tutorial battle does not mutate starting progression;
- D+E reaches the hero-selection ceremony correctly;
- F+G intercepts the old temporary crystal bridge;
- H intercepts the old temporary mission bridge;
- Opening completion state is persisted;
- Chapter 1 handoff is valid;
- save round-trip contains Opening completion;
- a progressed world save is not rewound into Opening;
- REQ-021 Tap Anywhere, REQ-022 fullscreen world and REQ-001 dynamic touch authorities remain active.

## PUBLIC GATES

- A+B commit `b0b29318f6c1e3cbc1fe2ceb01c7475cdc3b7872` — Pages run `34051932998` SUCCESS.
- C commit `0b34262428232ca9db8c6763840dedef4c5dad3e` — Pages run `34052032535` SUCCESS.
- D+E commit `cbd3ee509305de4382289d9c960ca5d0a39042f6` — Pages run `34052118016` SUCCESS.
- F+G commit `9d97c32b7c9a2394450c58e1f2cecea3fd6e1d2a` — Pages run `34052230026` SUCCESS.
- H commit `f65701e93ccb76a17ea2d648e94225f1d8b590d7` — Pages run `34052323231` SUCCESS.
- Full Opening E2E commit `c30bf062a91f8f9032902761a448ead529b00057` — Pages run `34052384410` SUCCESS, including sequential JS checks, collision-safe add-on validation, static/add-on contract guards, autosave bootstrap, assembled browser (where the Opening E2E runs), 390x844 touch/fullscreen, REQ-081/082 regressions, upload and Pages deployment.

## VERIFY BOUNDARY

Implementation/public automation gates are complete enough for VERIFY.

Do not claim physical iPhone visual/pacing approval yet. `IOS_PHYSICAL_VERIFICATION` and subjective Opening pacing/visual approval remain PENDING until Owner checks the actual device/public build.

Do not invent Chapter 2 or reveal protected truths in any follow-up polish.

EOF
