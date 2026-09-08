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

## Iteration 1 — capture fidelity + dialogue focus

FRESH_BASELINE: `main@0366d47550a4fc035736e754d492b11bfbef2825`

### Self-audit defect found

- The original A/B capture HTML lived under `/.req145/`, so repository-relative script and asset URLs resolved under `/.req145/...` and did not load.
- Non-black screenshot checks still passed because the base HTML rendered, which made the A/B evidence look valid while silently excluding the assembled addon stack.
- Capture harness now injects `<base href="/">`; candidate and baseline screenshots execute their real assembled builds.
- Workflow adds dialogue as a third deterministic comparison scene and a runtime-fidelity gate that requires the candidate REQ-145 layer while rejecting it from exact-main baseline.

### Player-visible repair

- Dialogue-open state now deliberately reduces HUD/objective competition so conversation becomes the visual focus.
- Speaker name is presented as a compact gold-accent identity chip.
- Dialogue type size/line height were tightened so the same canonical text fits without the previous candidate clipping.
- Canonical dialogue text, action semantics, story flags and input authority are unchanged.

### A/B critic result

- Baseline dialogue keeps full-strength HUD/objective chrome competing with the conversation.
- Candidate dialogue produces a clearer conversation focus while retaining visible world context and readable text.
- Candidate dialogue treatment is a material win; terrain remains inherited from main rather than repainted.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
