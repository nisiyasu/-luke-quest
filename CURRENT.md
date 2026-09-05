# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 21:00 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `360f573ccb414f1e18df5334b7d30edb94ca6cab` (fresh implementation checkpoint with successful full Pages workflow; this CURRENT autosave follows it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / rollback-safe `index.html` core + sequential `ux-v08.js` through `ux-v139.js` + dynamically injected collision-safe `addons/*.js`. Workflow run `33964756013` for implementation HEAD `360f573ccb414f1e18df5334b7d30edb94ca6cab` passed sequential syntax checks, all add-on syntax checks, static regression, add-on contracts, PWA/raster checks, assembled-browser title smoke, world/movement/NPC smoke, six interior/optional-area transitions, battle action, save persistence, artifact upload and GitHub Pages deployment.

## MANDATORY_BOOT_FILES

Read fresh before mutation:
1. `AUTONOMOUS_DEV_DIRECTIVE.md` FULL TEXT
2. `CURRENT.md`
3. repository metadata / actual default branch / fresh HEAD
4. `index.html`
5. `.github/workflows/pages.yml`
6. all sequential `ux-v*.js` through the fresh latest version in numeric order
7. all `addons/*.js`
8. `tools/lq-static-regression.mjs`
9. `tools/lq-addon-contract.mjs`
10. `manifest.webmanifest`
11. `sw.js`
12. `assets/app-icon.svg`
13. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
14. `assets/characters/luke/dialogue-neutral.webp.b64`
15. `assets/portraits/` state
16. recent commits / Actions / Pages state

`index.html` remains the rollback-safe v0.7 core. Pages injects sequential `ux-v*.js` in numeric `sort -V` order and then all `addons/*.js`. Never infer the newest patch from stale conversation context. Fresh HEAD is implementation truth.

## HEAD_FIRST_RECOVERY_STATUS

- Boot detected CURRENT was materially behind fresh repository reality.
- CURRENT implementation SHA `6ce77d274e8db9b770bb660f419dd95363db7b57` was 48 commits behind fresh HEAD `3de03a7c636789f3807ca44f706ebc4d2d0a6668` at reconstruction time.
- The gap was inspected before mutation and included new secondary interiors, visual layers, runtime smoke work and other collision-safe add-ons.
- Development continued on unique add-on files to avoid overwriting the sequential `ux-vNN.js` lane.
- A newly expanded browser smoke test initially exposed a real training-yard entrance interaction failure. The failure was not ignored: the run log was inspected, entrance matching was hardened from first-NPC matching to exact kind-aware coordinate matching, and the subsequent full workflow passed.

## WHAT_CHANGED_THIS_SESSION

### WALKABLE WORLD / EXPLORATION

1. `addons/field-wayfarer-shrine.js`
   - Added a new physical roadside shrine on the Royal Capital approach.
   - Added walkable `MAPS.wayfarerShrine` interior with stone floor/wall language, stained-glass-like window, central rug and four inspectable props.
   - Added explicit field -> shrine -> field transitions.
   - Added Luke-character dialogue without revealing protected story canon.

2. `addons/wayfarer-shrine-blessing.js`
   - The shrine water basin now grants one persistent 35%-max-HP restorative blessing.
   - Uses save-state flag `wayfarerShrineBlessingUsed` and does not repeat indefinitely.

3. `addons/forest-hidden-clearing.js`
   - Added optional walkable `MAPS.forestClearing` before the locked northern story frontier.
   - Includes an entrance through a visible break in the trees, a sunbeam, butterflies and inspectable environmental details.
   - Does not cross or weaken the current north main-story gate.

4. `addons/forest-clearing-herb-harvest.js`
   - Added one persistent harvestable herb patch in the clearing.
   - Grants one `薬草` and saves `forestClearingHerbHarvested`.

5. `addons/town-training-yard.js`
   - Added walkable `MAPS.trainingYard` inside Royal Capital.
   - Includes training dummy, shield stake, footwork marks, training board, instructor and capital banners.
   - Added town -> training yard -> town transitions.
   - Entrance detection was hardened after CI found a false entry during assembled-runtime testing.

6. `addons/training-master-lessons.js`
   - Training instructor ベルド now gives state-aware lessons based on low HP, potion count, wins, level and technique availability.
   - Advice teaches actual existing systems rather than adding a detached tutorial card.

### OPTIONAL CONTENT / WORLD REACTIVITY

7. `addons/forest-clearing-herb-quest.js`
   - Added a spoiler-safe side quest tied to the existing `神殿の見習い`.
   - The request points the player toward the new sunny forest clearing.
   - Harvest completion can be reported for an 18G reward.
   - Quest progress is persistent.

8. `addons/optional-objective-chip.js`
   - Extended the existing SIDE objective HUD to track the new forest-herb sample quest.
   - Existing elder-charm and forest-bounty priorities remain intact.

9. `addons/town-rumor-board.js`
   - Added a physical Royal Capital public notice board.
   - Public notices react only to story state already known to the player, such as forest danger and later northern-route public warnings.
   - Protected family/history canon remains hidden.

### MAP VISUAL DENSITY / PS1-EARLY 2D DIRECTION

10. `addons/town-street-furniture.js`
    - Added six street lamps, four flower planters, two benches and four Aldia civic banners to Royal Capital.
    - Presentation-only placement does not alter collision.

11. `addons/field-roadside-details.js`
    - Added roadside fences, milestones, wildflower patches and road-edge stones to Royal Capital outskirts.

12. `addons/forest-ground-details.js`
    - Added layered fallen logs, mushroom clusters, stones and leaf piles to forest / deep forest presentation.

13. `addons/north-route-props.js`
    - Added route stakes, supply crates, dark military banners, rope barriers and cold lanterns to mist / observation / evacuation zones.
    - These remain spoiler-safe physical atmosphere rather than hidden-canon exposition.

### BATTLE PRESENTATION / COMMAND FEEDBACK

14. `addons/battle-foreground-depth.js`
    - Added regional foreground silhouettes for field, forest, mist, military and cliff battle scenes.
    - Adds depth between background and enemy stage without changing battle calculations.

15. `addons/battle-guard-impact.js`
    - Guard now produces a visible shield stance pulse.
    - Presentation-only and reduced-motion aware.

16. `addons/battle-herb-effect.js`
    - Successful battle herb use now produces a restorative leaf/+ effect.
    - Only fires when potion count actually decreases.

17. `addons/battle-escape-feedback.js`
    - Escape success and failure now receive visually distinct retreat feedback.
    - Does not modify the existing escape probability.

### RUNTIME / CI HARDENING

18. `addons/runtime-smoke-hook.js`
    - Browser smoke now exercises the new roadside shrine, forest clearing and training yard in addition to inn guest room, shop stock room and temple record room.
    - New smoke markers explicitly record entry, exit and map existence for all three new optional areas.

19. `.github/workflows/pages.yml`
    - Browser smoke now asserts all six optional/interior transition pairs.
    - World virtual-time budget increased to accommodate the expanded assembled-runtime test.
    - Failure diagnostics include the new transition data attributes.

20. CI caught a training-yard entry failure in workflow run `33964697044` rather than allowing it to deploy.
    - The failing marker was `data-training-entered="false"` while all earlier transitions, battle and save smoke were true.
    - `addons/town-training-yard.js` was hardened so entrance detection checks for the exact gate kind at the facing coordinate instead of relying on whichever NPC happened to be returned first.
    - Workflow run `33964756013` then passed browser smoke, upload and Pages deployment.

## FILES_CHANGED

New or materially updated in this continuation:
- `addons/field-wayfarer-shrine.js`
- `addons/wayfarer-shrine-blessing.js`
- `addons/forest-hidden-clearing.js`
- `addons/forest-clearing-herb-harvest.js`
- `addons/forest-clearing-herb-quest.js`
- `addons/town-training-yard.js`
- `addons/training-master-lessons.js`
- `addons/town-street-furniture.js`
- `addons/field-roadside-details.js`
- `addons/forest-ground-details.js`
- `addons/town-rumor-board.js`
- `addons/north-route-props.js`
- `addons/battle-foreground-depth.js`
- `addons/battle-guard-impact.js`
- `addons/battle-herb-effect.js`
- `addons/battle-escape-feedback.js`
- `addons/optional-objective-chip.js`
- `addons/runtime-smoke-hook.js`
- `.github/workflows/pages.yml`
- `CURRENT.md`

Existing sequential chain through `ux-v139.js` remains intact.

## NEW_ASSETS

- No new formal raster character image was fabricated or falsely promoted to final quality.
- Existing Owner-approved Luke full-body WebP remains authoritative and unchanged.
- This continuation adds original CSS-drawn environmental, building, prop and battle-effect presentation only.
- No copied game art, external copyrighted character art, copied map, music or sound asset was introduced.

## TESTS_AND_VERIFICATION

- Fresh repository metadata confirmed actual default branch `main`.
- HEAD-first recovery and stale-CURRENT comparison performed before mutation.
- All new JavaScript files follow isolated IIFE + strict-mode add-on contract.
- Full workflow for implementation checkpoint `360f573ccb414f1e18df5334b7d30edb94ca6cab`: run `33964756013`, SUCCESS.
- Sequential patch validation: PASS through v139.
- Collision-safe add-on `node --check`: PASS.
- Static regression guard: PASS.
- Add-on contract guard: PASS.
- Manifest/PWA validation: PASS.
- Base64 raster transport probe: PASS.
- Approved Luke WebP payload validation: PASS.
- Headless Chrome title runtime smoke: PASS.
- Headless Chrome world movement: PASS.
- Facing-NPC cue and interaction: PASS.
- Inn guest-room transition: PASS.
- Shop stock-room transition: PASS.
- Temple record-room transition: PASS.
- Roadside shrine transition: PASS.
- Forest clearing transition: PASS.
- Training-yard transition: PASS after fix.
- Battle attack runtime smoke: PASS.
- Save persistence smoke: PASS.
- GitHub Pages artifact upload/deploy: PASS.
- Real-device iPhone visual/touch verification: NOT CLAIMED; remains external Owner-device confirmation.

## KNOWN_ISSUES

- Luke field representation still uses interim original CSS directional silhouettes rather than formal approved/generated 4-direction × multi-frame sprite artwork.
- Leon, Glenn, Eleanor and Elisia still lack formal integrated major-character art.
- Many environmental improvements are CSS-authored original visuals. They materially increase scene density but are not a substitute for eventual coherent authored raster/tile-art packs where those improve quality and iPhone performance.
- Several legacy/base data structures still originate in the v0.7 core and are extended by a long patch/add-on chain. Continue strengthening regression coverage before risky architecture changes.
- `CURRENT.md` can lag during rapid autonomous checkpoints; always trust fresh HEAD and reconstruct diffs before repeating work.

## BLOCKERS

- No blocker for continued world, battle, UI, optional-content, regression or PS1-early visual-density work.
- Formal Luke directional sprite sheet requires an approved/generated asset matching the Owner-approved blue-hair / blue-cloak / silver-armor canon; do not fabricate a mismatched character and call it complete.
- Leon / Glenn / Eleanor / Elisia formal visual integration requires suitable original/approved image generation and transport.
- Real iPhone confirmation requires Owner-device testing; browser/CI results must not be mislabeled as real-device PASS.

## NEXT_ACTION

Continue from fresh HEAD, not from this text if repository reality has advanced.

Highest-value autonomous lane:
1. Re-fetch HEAD and Actions first.
2. If another implementation commit is ahead of this CURRENT, reconstruct it before mutation.
3. Continue player-visible PS1-early density and gameplay depth in collision-safe add-ons without crossing the locked north story frontier.
4. Prefer one of: another genuinely walkable/interactive Royal Capital or early-route space, deeper training-yard gameplay, richer non-placeholder battle command feedback, environmental interaction that produces persistent state, or stronger assembled-browser regression coverage for newly added systems.
5. If formal character-art generation/transport becomes safely available, formal Luke 4-direction field sprite remains the highest visual-canon target; otherwise continue productive non-blocked work.

## NEXT_ACTION_COMPLETION_CONDITION

A candidate checkpoint is complete only when:
- player-visible or materially safety-improving behavior exists in actual repository code,
- syntax/contracts/regression remain valid,
- assembled-browser runtime testing covers risky interaction when practical,
- latest relevant Pages workflow succeeds,
- no protected story canon is exposed early,
- CURRENT is periodically re-synced but CURRENT update itself is never treated as a reason to stop development.

## DO_NOT_REPEAT

- Do not treat CURRENT as implementation truth when fresh HEAD differs.
- Do not overwrite or duplicate sequential `ux-vNN.js` work without fresh-reading the complete chain.
- Do not manually hard-code Pages injection when dynamic discovery already exists.
- Do not call interim CSS Luke field art a formal sprite sheet.
- Do not call face-only/fallback SVG major-character art final.
- Do not claim image integration from generation alone; it must be public-game integrated.
- Do not reduce Luke victory-line variety below the existing combined pool.
- Do not reintroduce button-local-only movement release handling; central movement-stop safety is required.
- Do not use a single blocker to stop unrelated productive work.
- Do not expose Glenn's family relation to Luke, Elisia's full history, Eleanor's crime or Demon-King succession secrets before intended story reveal.
- Do not cross the current locked northern main-story frontier without explicit story authority.

## IMPORTANT_DESIGN_DECISIONS

- PS1-early target means layered 2D scene composition, readable landmarks, physical interiors/side spaces, directional character logic, richer battle staging and strong UI feedback, not imitation of any existing game's protected art.
- Player guidance should increasingly come from physical world structure, landmark placement, public signage and NPC cues instead of only explanatory text.
- Optional spaces should reward curiosity with stateful interactions, items, side quests or useful information rather than exist only as decorative screens.
- Battle commands should communicate clearly through visual/audio response without changing mechanics merely for spectacle.
- Runtime browser smoke is now a promotion gate for new walkable transitions; a detected failure must be fixed before considering a checkpoint deploy-safe.
- Unique `addons/*.js` remain the preferred collision-safe continuation lane while sequential ux work may be concurrent.

## STORY_CANON_ADDED_OR_CHANGED

- No protected story canon changed.
- New content is spoiler-safe local worldbuilding only: travelers use a roadside shrine; Royal Capital has a training yard and public notice board; a temple novice is interested in a forest herb sample.
- These additions do not alter Luke/Leon/Glenn/Eleanor/Elisia/Demon-King established canon.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Existing map-title cards, objective HUD, contextual A prompts, physical building signage, minimap, signpost and route landmarks remain active.
- New roadside shrine creates a recognizable early-field landmark and recovery destination.
- New training yard gives a physical place for learning battle fundamentals from an adaptive instructor.
- New SIDE objective tracking points players toward the forest clearing herb request after accepting it.
- Story-reactive town notice board gives public-state context without hidden-canon spoilers.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved Luke full-body art remains integrated across supported large-presentation surfaces.
- Dialogue framing and history systems remain active.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.
- Eleanor formal art: NOT YET INTEGRATED.
- Elisia formal art: NOT YET INTEGRATED.

## BATTLE_VISUAL_PROGRESS

- Existing regional enemy vector designs, scenery, particles, enemy motion, HP display, command hierarchy, damage feedback, encounter title, low-HP vignette, victory overlay and formal Luke battle reuse remain active.
- New regional foreground silhouettes deepen scene composition.
- Guard has a visible shield stance cue.
- Herb use has a dedicated restorative visual response.
- Escape success/failure has distinct feedback.
- No battle probability/damage formula was changed by those presentation add-ons.

## MAP_READABILITY_IMPROVEMENTS

- Royal Capital scene density now includes street lamps, planters, benches, civic banners, market/fountain visuals, readable building signs, a public notice board and a walkable training yard.
- Royal Capital approach now includes roadside fences, milestones, flower clusters, stones and a physical walkable shrine.
- Forest/deep forest now include more layered ground props; forest also has a visible optional clearing branch.
- Mist/observation/evacuation zones now have route-specific physical props such as stakes, rope barriers, military crates/banners and cold lanterns.
- New areas preserve collision logic by using presentation-only DOM props or explicit map NPC/transition contracts.

## CHARACTER_CANON_STATUS

- Luke formal large-image canon: blue hair / blue clothing and cloak / silver armor / gold accents. Owner-approved full-body WebP remains authoritative.
- Luke field direction logic: 4/4 directions LIVE from `s.dir`.
- Luke field visual: interim CSS directional silhouettes and step cadence; NOT formal generated/approved sprite artwork.
- Leon formal art: pending.
- Glenn formal art: pending.
- Eleanor formal art: pending.
- Elisia formal art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body image: INTEGRATED.
- Luke fallback SVG: fallback only, not final quality.
- Leon: NOT YET INTEGRATED.
- Glenn: NOT YET INTEGRATED.
- Eleanor: NOT YET INTEGRATED.
- Elisia: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction behavior: UP / DOWN / LEFT / RIGHT LIVE.
- Interim CSS direction visuals + simple step cadence: LIVE.
- Formal 4-direction × 2-3 frame Luke field sprite sheet: NOT YET INTEGRATED.
- Leon / Glenn formal directional field sprites: NOT YET IMPLEMENTED.

## POST_BATTLE_LINE_VARIETY_STATUS

- Base Luke victory lines: 60.
- Situational add-on lines: +30.
- Combined available pool: 90 when add-on is loaded.
- Recent exact-repeat avoidance remains active.
- Do not collapse back to repetitive single-line victory text.

## CHECKPOINT_HISTORY

Selected foundation already present before this continuation:
- v0.16 inn interior
- v0.17 shop interior
- v0.18-v0.20 town/field/forest density
- v0.21 battle depth
- v0.22 original chest
- v0.23 temple interior
- v0.24 interaction guidance
- v0.25-v0.27 early regional enemy vectors
- v0.28 title/prologue
- v0.29 transitions
- v0.30 PWA/iPhone shell
- v0.31 equipment/DEF
- v0.32 adventure menu
- v0.33-v0.36 later regional enemies
- v0.37 inn overnight
- v0.38 field herb
- v0.39 demon-route identity
- v0.40 equipment switching
- v0.42-v0.50 evidence/terrain/field-sprite interim pass, treasures, journal, battle commands, selling, victory result
- v0.51-v0.103 broad world/UI/battle/save/optional-content expansion
- v0.104-v0.139 sequential continuation reconstructed fresh at boot
- secondary inn guest room / shop stock room / temple record room and multiple collision-safe visual/gameplay add-ons were already present in fresh HEAD before this continuation

Continuation checkpoints after fresh recovery:
- `45536233917d47e747c5960c6a305f889be16783` walkable roadside shrine
- `4ea1d5b20f16c2d2ac580de26d9d04da1c1c1e6e` shrine blessing
- `19f3a3028bbd9d65771b2276c1c624b4b729c162` forest clearing
- `9fac93e1589a4d5f0afbeb40ca7a44d2f80a2f16` clearing herb harvest
- `7dc5c791ece677fccf4501b84d1178ae84a6f611` training yard initial implementation
- `552d4eb59fe0242cb1af09fedfe5e1494ba6dfaf` Royal Capital street furniture
- `ed4fc7780715e4bfd201be6c3cbe84315d8a23c5` field roadside detail
- `46fd280a416ffead89f2c0707c7e61e868601128` forest ground detail
- `e86b82ffa25d8327743709fcf9bfff8688662dfc` story-reactive notice board
- `ca4a3a26a124d59e8fbfcf1b979842c50fafc1ba` northern route props
- `2a07fb013b18a3a9aa4a3f2c388e2675a4bd1cca` herb sample side quest
- `62dc07fb5092e34d617cbde64281919838d8d7a6` optional HUD quest tracking
- `a591bf4cdcae61ec2fcdd473e912986feaf0ee70` regional battle foreground depth
- `93fd792d4590fde92711fc3fcb43763384e5da83` adaptive training lessons
- `202661c246a020d140901f419eb62aa6db1a9507` expanded runtime smoke hook
- `be3bca266c0547094db2be5da5ffa9884edbb4da` workflow assertions for new transitions
- `dc54f50fc741dca82b33270f002c6c0f117f1448` guard feedback
- `9894ade2ba66cd37897340c0d2c9e5cbb6490e31` herb battle effect
- `fbaed283e231c256191c623e3ff511a0fbfd122a` escape feedback
- failed smoke checkpoint exposed training entry issue; no deploy accepted
- `360f573ccb414f1e18df5334b7d30edb94ca6cab` hardened training-yard entrance; workflow `33964756013` SUCCESS and deployed
