# REQ-129 — Chapter 1 Complete Objective Closure

- ID: `REQ-129`
- TITLE: `Chapter 1 Complete Objective / Journal Closure`
- PRIORITY: `P1`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / JOURNAL / STORY_STATE / REGRESSION_FIX`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_AUTHORITY: `REQ-128 + STORY_CANON.md`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## PURPOSE

After REQ-128 completes Chapter 1 and returns the party to Aldia, stale Chapter 1 pursuit flags must not keep telling the player to chase Leon north.

Fresh audit found `addons/adventure-journal.js` did not check `flags.chapter1Complete` before older `withdrawProofSeen` / route flags, so a completed Chapter 1 could project a ghost objective.

## REQUIREMENTS

1. `flags.chapter1Complete` is the highest-priority Chapter 1 main-objective terminal state.
2. When true, the Adventure Journal MAIN OBJECTIVE clearly states that Chapter 1 is complete and that continuation is pending/preparing.
3. Do not invent Chapter 2 destination, mission, villain action, party state, or story beat.
4. Preserve all pre-completion route-specific objectives unchanged.
5. Preserve side quests and discovered clues.
6. Preserve REQ-021 / REQ-022 / REQ-001 input/fullscreen behavior.
7. Existing saves with `chapter1Complete=true` project the terminal objective immediately without migration mutation.

## ACCEPTANCE

- `mainGoal({flags:{chapter1Complete:true,...old pursuit flags}})` returns the Chapter 1-complete neutral terminal objective. PASS.
- Old pursuit flags cannot override completion. PASS.
- A pre-completion `withdrawProofSeen` state still returns the existing pursuit objective. PASS.
- No Chapter 2 content is invented. PASS.
- JavaScript syntax passes. PASS.
- Dedicated workflow run `34091231900` SUCCESS.
- Public cache-busted Pages recovery run `34091374201` SUCCESS on descendant HEAD `07f0ad7a890c009f4fd94e90b2cf350acbc87bad`.
- IOS_PHYSICAL_VERIFICATION remains PENDING.

## CHECKPOINTS

- Implementation: `1688fb29...` added `chapter1Complete` terminal precedence to `addons/adventure-journal.js`.
- Acceptance workflow wiring and queue/CURRENT recovery followed on descendant commits.

EOF
