# REQ-114 — STORY CANON WIRING AFTER CHAPTER 2 DESIGN

- ID: `REQ-114`
- TITLE: `Story Canon Wiring After Chapter 2 Design`
- PRIORITY: `P1`
- STATUS: `BLOCKED`
- CREATED_AT: `2026-09-07 JST`
- BLOCKER: `STORY_CANON.md` Chapter 1 remains partially confirmed and Chapter 2 is NOT_DESIGNED.

## 1. OWNER-APPROVED SEQUENCING

The current `STORY_CANON.md` is the authority for this task's timing.

Required sequence:

1. Owner completes Chapter 1 story decisions.
2. Owner designs Chapter 2 through its start, purpose, major turns, climax and ending state.
3. Story Canon is updated to reflect those approved Story Beats.
4. Only then wire `AUTONOMOUS_DEV_DIRECTIVE.md` to load and obey `STORY_CANON.md` on every autonomous boot.

Do **not** execute step 4 early.

## 2. PURPOSE AFTER UNBLOCK

Once Chapters 1 and 2 are sufficiently approved, update autonomous governance so that:

- every boot fresh-loads `STORY_CANON.md`;
- main-story requirements are generated from the next approved CONFIRMED Story Beat;
- `PENDING` and `NOT_DESIGNED` content is never autonomously canonized;
- repeated route/map extension is not used as a substitute for consuming approved Story Beats;
- protected reveal rules remain intact;
- when no approved next main-story beat exists, autonomous development selects safe non-main-story work, bugs, UX, systems, polish or already-approved side content instead of inventing plot.

## 3. CURRENT CANON SAFETY

Until unblocked:

- no further generic Leon-pursuit north-map extension;
- do not decide whether Eleanor or Leon's sister stops the Chapter 1 clash;
- do not create/name/age/characterize Leon's sister as canon;
- do not invent Chapter 2 main plot;
- do not alter `AUTONOMOUS_DEV_DIRECTIVE.md` merely because this requirement exists.

## 4. UNBLOCK CONDITION

Owner-approved `STORY_CANON.md` must show:

- Chapter 1 stopping role and return-to-kingdom ending sufficiently confirmed;
- Chapter 2 no longer `NOT_DESIGNED`;
- enough Chapter 2 Story Beats to prevent local autonomous plot invention.

## 5. COMPLETION CONDITIONS AFTER UNBLOCK

- fresh-read `AUTONOMOUS_DEV_DIRECTIVE.md` and `STORY_CANON.md` before editing;
- add Story Canon to mandatory boot sources;
- define authority rules for CONFIRMED / PENDING / NOT_DESIGNED;
- define next-approved-Story-Beat generation rule;
- explicitly prohibit plotless pursuit/map extension;
- preserve existing protected-reveal rules;
- fresh-fetch the updated directive and Story Canon to verify;
- synchronize queue/current safely without destructive replacement of truncated queue history.

EOF
