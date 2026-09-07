# REQ-130 — Chapter 1 Adventure Record Completion

- ID: `REQ-130`
- TITLE: `Chapter 1 Adventure Record Completion`
- PRIORITY: `P1`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / COMPLETION_RECORD / STORY_STATE_PROJECTION`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_AUTHORITY: `REQ-128 + STORY_CANON.md`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## PURPOSE

REQ-128 establishes `flags.chapter1Complete` as the canonical end-of-Chapter-1 state. The former ADVENTURE RECORD showed battle, monster, area, treasure, optional and level statistics but did not record Chapter 1 completion.

This requirement adds a read-only Chapter 1 completion projection without inventing any Chapter 2 story.

## REQUIREMENTS

1. Reuse canonical `flags.chapter1Complete`; do not add a second completion flag.
2. ADVENTURE RECORD visibly distinguishes `CHAPTER 1 COMPLETE` from an unfinished Chapter 1.
3. The projection is read-only and does not mutate progression, save, battle, input, or story.
4. Do not invent Chapter 2 title, destination, mission, character state, or plot.
5. Preserve existing battle/monster/area/treasure/optional/level record cells.
6. Preserve existing responsive iPhone layout.
7. Existing saves with `chapter1Complete=true` show completion immediately.

## ACCEPTANCE

- Pure/read-only helper returns `COMPLETE` only when `flags.chapter1Complete===true`. PASS.
- Missing/false flag returns `IN PROGRESS`. PASS.
- Existing record counters remain present and unchanged. PASS.
- JavaScript syntax passes. PASS.
- Implementation commit: `ffa72c14f95ac988affbd206f4945da8a4bd232d`.
- Dedicated regression workflow run `34091720377` SUCCESS.
- Cache-busted public Pages recovery run `34091818716` SUCCESS on descendant HEAD `b31d1e1a1604657393a14fcdcb19766cb075df33`, including clean-world pixel verification and deployment.
- IOS_PHYSICAL_VERIFICATION remains PENDING.

EOF
