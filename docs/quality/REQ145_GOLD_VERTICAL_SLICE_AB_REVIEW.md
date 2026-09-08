# REQ-145 Gold Vertical Slice A/B Review

BASELINE: `main@0366d47550a4fc035736e754d492b11bfbef2825`
CANDIDATE: `experiment/gold-vertical-slice@39c6f3b374e1c673b3b7ec1b9d7e892492a970ff`
VIEWPORT: `390x844`
STATUS: `CANDIDATE_LEADS / PROMOTION_NOT_FINAL`

## Method

The branch workflow assembles current main and challenger separately, drives deterministic town/dialogue/battle states, captures both at the same viewport, runs blank-frame rejection, and separately gates P0 touch/fullscreen runtime safety.

Scoring is 0-5. Safety axes may not regress. Visual scoring is a critic decision from the paired captures, not inferred from CI success.

## Scorecard

| Axis | Main | Candidate | Decision |
|---|---:|---:|---|
| FIRST_10_SECONDS | 3.5 | 3.8 | candidate slight win |
| WORLD_VISUAL_COHERENCE | 4.0 | 4.0 | tie; main terrain preserved |
| CHARACTER_READABILITY | 4.0 | 4.0 | tie |
| UI_HIERARCHY | 3.2 | 4.1 | candidate win |
| MOVEMENT_GAME_FEEL | 4.0 | 4.0 | safety-preserved tie |
| INTERACTION_FEEDBACK | 3.4 | 4.0 | candidate win |
| BATTLE_FEEDBACK | 4.0 | 4.1 | slight candidate lead only |
| OBJECTIVE_CLARITY | 3.7 | 4.2 | candidate win |
| DRAMATIC_IMPACT | 3.8 | 4.1 | dialogue-focus win |
| MOBILE_PERFORMANCE | 4.0 | 4.0 | no regression evidenced |
| INPUT_SAFETY | 5.0 | 5.0 | P0 gate preserved |
| SAVE/PROGRESSION_SAFETY | 5.0 | 5.0 | authority unchanged |

## Material wins accepted

1. Dialogue-open state suppresses competing HUD/objective chrome without hiding world context, so conversation reads as the active layer.
2. Speaker identity is clearer through the compact gold-accent name treatment while canonical dialogue text is untouched.
3. World objective presentation is compacted from a full-width diagnostic-like ribbon to a content-width authored pill, returning visible space to the world.
4. Canonical Action receives a single presentation pulse after action execution without adding pointer handlers or replacing `action()`.

## Rejected experiments

- Generic terrain gradients were rejected because they flattened richer existing Aldia texture.
- Hiding HUD resource cells was rejected because it damaged the established EXP/MP layout.
- Battle experiments that visually obscured/removes the enemy silhouette were rejected before checkpoint.

## Remaining gap before non-draft promotion

- Battle improvement is not yet large enough to claim a strong win.
- Owner physical/subjective iPhone review remains pending.
- Candidate should receive at least one more runtime/visual iteration before merge recommendation.

## Promotion shape

Keep the challenger changes isolated as a late presentation addon plus reproducible A/B tooling. Do not fork story, touch, save, battle reward, collision, or progression authorities. Promotion should therefore be reviewable as a presentation layer with its dedicated workflow and evidence artifacts.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
