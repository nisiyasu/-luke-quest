# REQ-145 Gold Vertical Slice Worklog

## Iteration 0 — baseline recovery

BASELINE: `main@7ee5b18eddd5111265b25b106adee2fd3e64175d`
CANDIDATE_BRANCH: `experiment/gold-vertical-slice`
TARGET: Aldia departure loop, NPC interaction, field traversal, battle, reward, Leon pursuit handoff.

### Blind-critic findings

- Existing Aldia terrain is already materially richer than the base HTML; do not overwrite its layered texture with generic gradients.
- First candidate terrain override flattened the town and was rejected before checkpoint.
- Existing top HUD remains information-dense and visually competitive with the world.
- Existing objective ribbon is useful but still reads as a debug/status strip more than premium game direction.
- Existing battle stage is coherent, but enemy presence and action feedback can be made more immediate.
- Candidate battle treatment produced a clearer enemy silhouette in the 390x844 capture.
- World candidate is not yet sufficiently superior to main. More iteration is mandatory.

### Repair completed in this iteration

- Preserve existing terrain/depth authority instead of repainting canonical tiles.
- Add presentation-only canonical Action pulse after `action()` returns, with no pointer/input handler.
- Add candidate HUD/dialogue/battle visual language without save/story/battle authority changes.
- Add exact-main versus candidate A/B capture workflow with non-black checks and P0 touch smoke.
### Next work orders

1. Reduce world HUD competition without hiding critical HP/MP/progression information.
2. Make the objective/location hierarchy feel authored rather than diagnostic.
3. Exercise the Action pulse through tap-anywhere and keyboard/canonical Action paths.
4. Improve field-to-battle emotional continuity without adding a second battle authority.
5. Re-capture main/candidate after every material change and reject regressions immediately.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
