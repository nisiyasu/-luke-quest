# REQ-131 — Chapter 1 Complete NPC Dialogue Closure

- ID: `REQ-131`
- TITLE: `Chapter 1 Complete NPC Dialogue Closure`
- PRIORITY: `P1`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / STORY CONSISTENCY / NPC DIALOGUE`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## PURPOSE

Fresh post-Chapter-1 surface audit proved that `addons/npc-dialogue-progression.js` has only six pursuit-era stages. Its terminal stage is selected by `evacEntered || withdrawProofSeen` and still tells the player to go north even after canonical `flags.chapter1Complete === true` returns Luke, Leon, Leon's sister and Eleanor to the kingdom.

This creates a player-visible contradiction after REQ-128/129/130 completion and must be closed without inventing Chapter 2.

## REQUIRED BEHAVIOR

- `chapter1Complete` must outrank stale pursuit flags in NPC dialogue projection.
- Aldia/field NPCs covered by the existing progression authority must stop telling Luke to pursue Leon or continue north after Chapter 1 completion.
- Replacement dialogue may acknowledge the safe return / need to rest / what was witnessed, but must not invent Chapter 2, reveal protected secrets, name Leon's sister, or add future objectives.
- Reuse the existing projection-only NPC dialogue authority. Do not mutate story progression, collision, NPC position, save data, input, or battle state.
- Preserve all pre-completion dialogue stages unchanged.

## ACCEPTANCE

- `progressionStage()` returns a distinct terminal Chapter-1-complete stage when `flags.chapter1Complete === true`, even if old pursuit flags remain true.
- All four existing reactive NPCs have a terminal line that contains no active north/pursuit instruction.
- Existing stages 0-5 remain behaviorally unchanged.
- Runtime status exposes `chapter1Complete` as canonical input and the increased state count.
- Public Pages includes the change and browser regression remains healthy.
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner physical confirmation.

## DO NOT

- Do not invent Chapter 2.
- Do not reveal Eleanor's hidden past or Glenn/Luke family truths.
- Do not name or age Leon's sister.
- Do not clear historical flags merely to hide the stale dialogue.

EOF
