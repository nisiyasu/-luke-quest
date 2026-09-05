# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 21:05 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `f473022846885a74edff7bfa780b8165d491bc7f` (fresh implementation checkpoint validated and deployed; this CURRENT autosave follows it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE. Rollback-safe `index.html` core + sequential `ux-v08.js` through `ux-v139.js` + dynamically injected collision-safe `addons/*.js`. Latest implementation workflow run `33964900162` for HEAD `f473022846885a74edff7bfa780b8165d491bc7f` completed SUCCESS through syntax, regression, add-on contract, PWA/raster validation, assembled headless-browser runtime smoke, artifact upload and GitHub Pages deploy.

## MANDATORY_BOOT_FILES

1. `AUTONOMOUS_DEV_DIRECTIVE.md` FULL TEXT
2. `CURRENT.md`
3. repository metadata / actual default branch / fresh HEAD
4. `index.html`
5. `.github/workflows/pages.yml`
6. all sequential `ux-v*.js` through fresh latest version in numeric order
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

Fresh HEAD is implementation truth. CURRENT is autosave and may lag after autonomous checkpoints. Never repeat work from CURRENT without HEAD/diff reconstruction.

## WHAT_CHANGED_THIS_SESSION

### HEAD-FIRST RECOVERY
- Boot detected the previous CURRENT implementation SHA `6ce77d274e8db9b770bb660f419dd95363db7b57` was 48 commits behind fresh HEAD `3de03a7c636789f3807ca44f706ebc4d2d0a6668`.
- The gap was inspected before mutation. Existing concurrent secondary interiors, visual layers and runtime-smoke work were preserved.
- New mutations stayed primarily in unique `addons/*.js` files to avoid collision with the sequential `ux-vNN.js` lane.

### WALKABLE WORLD / EXPLORATION
- `addons/field-wayfarer-shrine.js`: added a physical roadside shrine on Royal Capital approach and a walkable `MAPS.wayfarerShrine` interior with stone floor/walls, stained-window treatment, rug and inspectable shrine props; explicit field -> shrine -> field travel.
- `addons/wayfarer-shrine-blessing.js`: shrine water basin grants one persistent 35%-max-HP blessing via `wayfarerShrineBlessingUsed`.
- `addons/forest-hidden-clearing.js`: added optional walkable `MAPS.forestClearing` before the locked northern frontier, with visible tree-gap entrance, sunbeam, butterflies and environmental props.
- `addons/forest-clearing-herb-harvest.js`: one persistent clearing herb harvest grants +1 `薬草` and saves `forestClearingHerbHarvested`.
- `addons/town-training-yard.js`: added walkable `MAPS.trainingYard` in Royal Capital with dummy, shield stake, footwork marks, record board, instructor and banners; town -> yard -> town transition.
- `addons/training-master-lessons.js`: instructor ベルド now gives state-aware advice based on HP, potion count, wins, level and technique state.

### OPTIONAL CONTENT / WORLD REACTIVITY
- `addons/forest-clearing-herb-quest.js`: added spoiler-safe temple-novice side quest connected to the new forest clearing; completion reward 18G, persistent quest flags.
- `addons/optional-objective-chip.js`: existing SIDE objective HUD now tracks the forest-herb sample quest while retaining elder-charm and forest-bounty priority.
- `addons/town-rumor-board.js`: added physical Royal Capital public notice board whose postings react only to player-known/public story state.

### MAP VISUAL DENSITY
- `addons/town-street-furniture.js`: Royal Capital gained 6 street lamps, 4 planters, 2 benches and 4 Aldia civic banners.
- `addons/field-roadside-details.js`: field gained fence sections, milestones, wildflowers and road-edge stones.
- `addons/forest-ground-details.js`: forest/deep forest gained fallen logs, mushroom clusters, stones and leaf piles.
- `addons/north-route-props.js`: mist/observation/evac routes gained stakes, crates, military banners, rope barriers and cold lanterns.
- `addons/area-title-card.js`: new optional maps now have authored subtitles: roadside shrine, forest clearing and training yard no longer fall back to generic `LUKE QUEST` subtitle.

### BATTLE PRESENTATION
- `addons/battle-foreground-depth.js`: regional foreground silhouettes now layer field / forest / mist / military / cliff battle scenes.
- `addons/battle-guard-impact.js`: Guard produces a visible shield stance pulse.
- `addons/battle-herb-effect.js`: successful herb use produces a restorative leaf/+ burst.
- `addons/battle-escape-feedback.js`: escape success and failure receive distinct visual cues without changing escape probability.

### RUNTIME / CI HARDENING
- `addons/runtime-smoke-hook.js` was extended to cover roadside shrine, forest clearing and training yard entry/exit in addition to inn guest room, shop stock room and temple record room.
- `.github/workflows/pages.yml` asserts all six interior/optional-area transition pairs in assembled headless Chrome and increased runtime budget for the expanded smoke.
- Workflow run `33964697044` caught a real training-yard entrance failure (`data-training-entered="false"`) while the other transitions, battle and save checks were valid. The broken checkpoint was not deployed.
- `addons/town-training-yard.js` was hardened to use exact kind-aware facing-coordinate matching rather than whichever NPC was returned first.
- Workflow run `33964756013` then passed and deployed the fixed training-yard transition.
- `addons/runtime-smoke-hook.js` was subsequently strengthened again to exercise the new shrine blessing, forest herb harvest and training-master lesson interactions inside the new maps.
- Latest full workflow run `33964900162` for `f473022846885a74edff7bfa780b8165d491bc7f` completed SUCCESS and deployed.

## FILES_CHANGED

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
- `addons/area-title-card.js`
- `addons/runtime-smoke-hook.js`
- `.github/workflows/pages.yml`
- `CURRENT.md`

Sequential `ux-v08.js` through `ux-v139.js` remain intact.

## NEW_ASSETS

- No new formal raster character art was fabricated or falsely marked final.
- Existing Owner-approved Luke full-body WebP remains authoritative.
- New presentation is original CSS-drawn environment, prop and battle-effect work.
- No copied game art, copied map, protected character, music or external copyrighted asset was introduced.

## TESTS_AND_VERIFICATION

- Fresh actual default branch: `main`.
- HEAD-first recovery/diff reconstruction: performed.
- Sequential syntax validation through v139: PASS.
- All `addons/*.js` `node --check`: PASS.
- Static regression guard: PASS.
- Add-on contract guard: PASS.
- PWA/manifest/service-worker/raster checks: PASS.
- Approved Luke WebP transport validation: PASS.
- Headless Chrome title runtime: PASS.
- World rendering/player movement: PASS.
- Facing-NPC cue and NPC interaction: PASS.
- Inn guest-room transition: PASS.
- Shop stock-room transition: PASS.
- Temple record-room transition: PASS.
- Roadside shrine entry/exit: PASS.
- Forest clearing entry/exit: PASS.
- Training-yard entry/exit: PASS after detected failure was fixed.
- New shrine blessing / clearing harvest / trainer lesson smoke code executes inside the successful assembled-runtime run without runtime exception.
- Battle action smoke: PASS.
- Save-persistence smoke: PASS.
- Pages artifact upload and deploy: PASS.
- Latest implementation workflow: `33964900162`, SUCCESS, HEAD `f473022846885a74edff7bfa780b8165d491bc7f`.
- Real-device iPhone visual/touch verification: NOT CLAIMED; requires Owner device.

## KNOWN_ISSUES

- Luke field representation is still interim original CSS directional art rather than formal approved/generated 4-direction × multi-frame sprite artwork.
- Leon, Glenn, Eleanor and Elisia still lack formal integrated major-character artwork.
- CSS-authored scene density is materially improved but should eventually be supplemented/replaced where coherent authored tile/raster art would improve final commercial-game feel and performance.
- Core architecture still extends the v0.7 base through a long sequential/add-on chain; risky restructuring requires stronger regression coverage first.
- Rapid autonomous commits can make CURRENT stale; always reconstruct from fresh HEAD.

## BLOCKERS

- No blocker for continued world, battle, UI, optional-content, regression or visual-density development.
- Formal Luke directional sprite integration requires a suitable original/approved asset matching blue hair / blue cloak / silver armor canon.
- Leon / Glenn / Eleanor / Elisia formal art requires suitable original/approved image generation and repository transport.
- Real iPhone confirmation requires Owner-device testing.

## NEXT_ACTION

Start only after fresh HEAD/Actions reconstruction.

Highest-value non-blocked work:
1. Continue PS1-early 2D scene density and actual gameplay depth rather than pure refactoring.
2. Deepen new optional spaces with meaningful stateful interaction while preserving north-story lock.
3. Continue battle command feedback and enemy/scene presentation without weakening existing mechanics.
4. Expand assembled-browser smoke when new interactive systems create regression risk.
5. If formal character asset generation/transport becomes safely available, formal Luke four-direction field sprite remains the highest visual-canon target.

NEXT_ACTION is not a one-task session boundary. After any checkpoint, select the next safe priority and continue.

## NEXT_ACTION_COMPLETION_CONDITION

- Actual player-visible or materially safety-improving code exists.
- Safe checkpoint committed.
- Fresh re-fetch confirms saved content.
- Syntax/contracts/regression stay valid.
- Risky new interaction gets assembled-runtime coverage when practical.
- Latest relevant Pages workflow succeeds before treating a checkpoint as deploy-safe.
- Protected canon is not exposed early.
- CURRENT is periodically synchronized but never treated as a stop condition.

## DO_NOT_REPEAT

- Do not trust stale CURRENT over fresh HEAD.
- Do not duplicate/overwrite sequential `ux-vNN.js` work without fresh reading.
- Do not call interim CSS Luke a formal field sprite.
- Do not call fallback/face-only art final major-character integration.
- Do not claim generated imagery integrated until it is actually public-game referenced and displayed.
- Do not reduce the existing Luke post-battle line pool back to repetitive output.
- Do not reintroduce button-local-only movement release handling; centralized movement stop safety must remain.
- Do not stop unrelated work because one asset/tool lane is blocked.
- Do not expose Glenn-Luke family relation, Elisia full history, Eleanor's crime or Demon-King succession secrets before intended reveal.
- Do not cross the currently locked northern main-story frontier without explicit story authority.

## IMPORTANT_DESIGN_DECISIONS

- PS1-early target means layered 2D scene composition, environmental density, readable landmarks, physical interiors/side areas, directional character logic, rich battle staging and deliberate UI response, not copying any existing game's art.
- Optional spaces should contain gameplay, persistent state, rewards, information or characterful interaction, not only decoration.
- Guidance should increasingly be conveyed through world structure, signage, landmark placement and NPC behavior rather than wall-of-text instructions.
- Unique `addons/*.js` remain the preferred collision-safe mutation lane while sequential ux work may be concurrent.
- Browser smoke is a promotion gate for new walkable transitions. A discovered failure must be fixed before deploy-safe status.

## STORY_CANON_ADDED_OR_CHANGED

- No protected canon changed.
- Spoiler-safe local worldbuilding added only: roadside traveler shrine, Royal Capital training yard, public notice board, temple novice herb-sample request.
- Established Luke / Leon / Glenn / Eleanor / Elisia / Demon-King canon remains unchanged.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Existing objective HUD, area title cards, contextual A prompts, signage, minimap, field signpost and route landmarks remain active.
- Roadside shrine is a recognizable early-route landmark and one-time recovery point.
- Training yard provides a physical tutorial location with adaptive advice.
- SIDE HUD now points accepted herb-sample quest toward the forest clearing and return target.
- New authored area-title subtitles make the three new optional maps immediately identifiable.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved Luke full-body art remains integrated on supported large presentation surfaces.
- Dialogue framing/history remains active.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.
- Eleanor formal art: NOT YET INTEGRATED.
- Elisia formal art: NOT YET INTEGRATED.

## BATTLE_VISUAL_PROGRESS

- Existing original regional enemies, scenery, particles, enemy motion, HP display, command hierarchy, damage feedback, encounter title, low-HP vignette, victory presentation and formal Luke battle reuse remain active.
- Regional foreground silhouettes add scene depth.
- Guard, herb and escape now have distinct command feedback.
- Those new presentation add-ons do not alter damage, guard reduction, healing amount or escape chance.

## MAP_READABILITY_IMPROVEMENTS

- Royal Capital: lamps, planters, benches, civic banners, readable services, fountain/market identity, notice board and walkable training yard.
- Royal Capital approach: fences, milestones, flowers, road stones and walkable roadside shrine.
- Forest/deep forest: additional layered ground props and optional sunlit clearing branch.
- Mist/observation/evac: route-specific stakes, barriers, crates, banners and lanterns.
- New physical props are presentation-only where appropriate, so collision remains stable.

## CHARACTER_CANON_STATUS

- Luke formal large-image canon: blue hair / blue clothing and cloak / silver armor / gold accents. Owner-approved WebP remains authoritative.
- Luke field direction behavior: UP / DOWN / LEFT / RIGHT LIVE.
- Luke field image quality: interim CSS directional silhouettes + simple step cadence; NOT formal sprite art.
- Leon formal art: pending.
- Glenn formal art: pending.
- Eleanor formal art: pending.
- Elisia formal art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body: INTEGRATED.
- Luke fallback SVG: fallback only.
- Leon: NOT YET INTEGRATED.
- Glenn: NOT YET INTEGRATED.
- Eleanor: NOT YET INTEGRATED.
- Elisia: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction logic: 4/4 LIVE.
- Interim direction visuals + step cadence: LIVE.
- Formal Luke 4-direction × 2-3 frame sprite sheet: NOT YET INTEGRATED.
- Leon / Glenn formal directional sprites: NOT YET IMPLEMENTED.

## POST_BATTLE_LINE_VARIETY_STATUS

- Base generic Luke victory lines: 60.
- Situational add-on lines: +30.
- Combined available pool: 90.
- Recent exact-repeat avoidance remains active.
- Do not regress to repeated fixed victory text.

## CHECKPOINT_HISTORY

Important continuation commits after the fresh-recovery point:
- `45536233917d47e747c5960c6a305f889be16783` roadside shrine
- `4ea1d5b20f16c2d2ac580de26d9d04da1c1c1e6e` shrine blessing
- `19f3a3028bbd9d65771b2276c1c624b4b729c162` forest clearing
- `9fac93e1589a4d5f0afbeb40ca7a44d2f80a2f16` herb harvest
- `7dc5c791ece677fccf4501b84d1178ae84a6f611` training yard
- `552d4eb59fe0242cb1af09fedfe5e1494ba6dfaf` Royal Capital street furniture
- `ed4fc7780715e4bfd201be6c3cbe84315d8a23c5` field roadside details
- `46fd280a416ffead89f2c0707c7e61e868601128` forest ground details
- `e86b82ffa25d8327743709fcf9bfff8688662dfc` public rumor board
- `ca4a3a26a124d59e8fbfcf1b979842c50fafc1ba` northern route props
- `2a07fb013b18a3a9aa4a3f2c388e2675a4bd1cca` herb-sample side quest
- `62dc07fb5092e34d617cbde64281919838d8d7a6` SIDE HUD tracking
- `a591bf4cdcae61ec2fcdd473e912986feaf0ee70` battle foreground depth
- `93fd792d4590fde92711fc3fcb43763384e5da83` adaptive trainer lessons
- `202661c246a020d140901f419eb62aa6db1a9507` optional-area runtime smoke
- `be3bca266c0547094db2be5da5ffa9884edbb4da` workflow transition assertions
- `dc54f50fc741dca82b33270f002c6c0f117f1448` guard feedback
- `9894ade2ba66cd37897340c0d2c9e5cbb6490e31` herb effect
- `fbaed283e231c256191c623e3ff511a0fbfd122a` escape feedback
- workflow `33964697044` exposed training entry failure and blocked deploy
- `360f573ccb414f1e18df5334b7d30edb94ca6cab` hardened training entrance; workflow `33964756013` SUCCESS
- `b8d2336ab8081f2c970479aeeb17d05643403527` authored area subtitles for new maps
- `f473022846885a74edff7bfa780b8165d491bc7f` deeper runtime smoke for shrine blessing / herb harvest / trainer lesson; workflow `33964900162` SUCCESS and deployed
