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

## Iteration 2 — objective hierarchy refinement

### Critic finding

- Full-width objective ribbon still reads closer to a diagnostic status strip than authored game direction.
- Hiding HUD resource cells was tested and rejected because it distorted the existing EXP/MP layout and made the candidate worse.
- Terrain repainting remains rejected; current main's layered town texture stays authoritative.

### Candidate repair

- Keep the existing HUD structure and all underlying progression information unchanged.
- Convert only the world objective presentation to a compact content-width pill with gold accent, ellipsis safety, and the same canonical text.
- Keep dialogue focus treatment from Iteration 1.
- No input, save, story, battle, collision, or progression authority is added or changed.

### Evidence

- JS syntax PASS locally.
- Candidate assembler and deterministic town/dialogue/battle harness PASS locally.
- Existing 390x844 A/B captures show the compact objective occupies materially less world area while preserving instruction visibility.
- Full branch workflow remains the promotion gate after checkpoint push.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING

## Iteration 3 — battle focal hierarchy

### Critic finding

- Prior candidate battle CSS mostly targeted legacy selectors, so the screenshot stayed too close to main despite the intended treatment.
- Earlier experimental variants that hid the enemy silhouette were correctly rejected.

### Candidate repair

- Target the actual assembled battle classes: `enemySpriteStage`, `lqOriginalEnemySvg`, `enemyPlate`, `enemyNameV10`, `enemyBarV10`, `battleLogV10`, and `commandBtn`.
- Increase enemy focal size modestly, strengthen the stage halo and enemy plate connection, and keep the large iPhone-safe command targets intact.
- Preserve canonical enemy art, HP values, battle command handlers, rewards, progression, and battle state authority.
- Avoid compositor-heavy fullscreen filters; the stage uses simple gradients and bounded drop-shadow on the existing enemy SVG.

### A/B result

- 390x844 candidate capture now gives the enemy materially stronger presence and connects the enemy art to the HP/name plate more coherently.
- Main remains fully readable; candidate wins focal hierarchy without hiding command information or changing mechanics.
- JS syntax and deterministic capture harness PASS locally before checkpoint.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING

## Iteration 4 — field traversal evidence coverage

### Coverage gap found

- The deterministic A/B harness covered town, dialogue, and battle but skipped the field traversal portion of the declared Gold Slice.
- That left objective hierarchy and world composition outside Aldia under-tested.

### Repair

- Add a deterministic `field` capture at 390x844 with canonical world state and no story mutation.
- Extend the challenger workflow capture loop, non-black rejection, and uploaded evidence artifact to include candidate/baseline field frames.
- Keep the exact-main assembly separate from candidate assembly.

### Local critic

- Candidate field frame preserves the existing terrain/depth work and keeps the objective pill compact over the world.
- Player, route, water, and destination hierarchy remain readable; no new gameplay/navigation authority is introduced.
- Python compile, assembler, capture harness, and diff checks PASS locally before checkpoint.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
