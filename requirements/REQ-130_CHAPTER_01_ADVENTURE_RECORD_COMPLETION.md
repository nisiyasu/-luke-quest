# REQ-130 — Chapter 1 Adventure Record Completion

- ID: `REQ-130`
- TITLE: `Chapter 1 Adventure Record Completion`
- PRIORITY: `P1`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / COMPLETION_RECORD / STORY_STATE_PROJECTION`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_AUTHORITY: `REQ-128 + STORY_CANON.md`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## PURPOSE

REQ-128 establishes `flags.chapter1Complete` as the canonical end-of-Chapter-1 state. The current ADVENTURE RECORD shows battle, monster, area, treasure, optional and level statistics but does not record Chapter 1 completion.

Add a read-only Chapter 1 completion projection without inventing any Chapter 2 story.

## REQUIREMENTS

1. Reuse canonical `flags.chapter1Complete`; do not add a second completion flag.
2. ADVENTURE RECORD must visibly distinguish `CHAPTER 1 COMPLETE` from an unfinished Chapter 1.
3. The projection is read-only and must not mutate progression, save, battle, input, or story.
4. Do not invent Chapter 2 title, destination, mission, character state, or plot.
5. Preserve existing battle/monster/area/treasure/optional/level record cells.
6. Preserve existing responsive iPhone layout.
7. Existing saves with `chapter1Complete=true` must show completion immediately.

## ACCEPTANCE

- A pure/read-only helper returns `COMPLETE` only when `flags.chapter1Complete===true`.
- Missing/false flag returns `IN PROGRESS`.
- Existing record counters remain unchanged.
- JavaScript syntax passes.
- Dedicated regression gate passes.
- Pages/public inclusion succeeds.
- IOS_PHYSICAL_VERIFICATION remains PENDING.

EOF
