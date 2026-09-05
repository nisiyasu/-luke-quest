# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 19:56 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `6ce77d274e8db9b770bb660f419dd95363db7b57` (fresh implementation HEAD observed immediately before this CURRENT autosave; this CURRENT commit follows it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / sequential chain reaches at least `ux-v139.js` plus collision-safe `addons/*.js`; workflow run `33961924428` for implementation HEAD `6ce77d274e8db9b770bb660f419dd95363db7b57` completed SUCCESS including static/add-on checks, assembled-browser smoke, upload and Pages deploy

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

`index.html` remains the rollback-safe v0.7 core. GitHub Pages dynamically discovers and injects `ux-v*.js` in numeric `sort -V` order, then injects `addons/*.js`. Do not manually assume the latest ux version. Fresh HEAD moved from stale CURRENT v0.118 reality through concurrent v0.119-v0.139 work before this run added independent add-on checkpoints.

## WHAT_CHANGED_RECENTLY

### HEAD-FIRST RECOVERY / CONTINUOUS DEVELOPMENT

1. The run booted from fresh repository reality and detected that CURRENT was behind fresh HEAD. It treated GitHub HEAD as implementation truth, reconstructed the gap, and resumed from actual repository state rather than repeating stale work.
2. At boot, fresh `main` HEAD was `c78f1aa6e0a4b9f92225e56cb91de92db804abcc`, 46 commits ahead of the implementation SHA recorded in CURRENT. The gap included sequential v0.119-v0.139 work, more gameplay add-ons, save-slot work, optional forest boss work, poison/status work, CI/browser smoke changes and CURRENT changes.
3. The safe `addons/*.js` lane remained the mutation path for this run, avoiding collisions with the sequential `ux-vNN.js` lane.

### CURRENT RUN 3 PLAYER-VISIBLE CHECKPOINTS

4. `addons/area-title-card.js`: added cinematic map-entry title cards using the actual map name plus a short regional subtitle. The overlay is non-interactive, map-aware and `prefers-reduced-motion` aware.
5. `addons/world-ambient-layer.js`: added lightweight regional ambience without touching collision or movement. 王都/街道 use soft motes, forest uses drifting leaves, mist/cliff routes use fog bands, and the observation area uses restrained embers. Particle counts are intentionally small for iPhone safety and reduced-motion disables animation.
6. `addons/battle-intro-card.js`: added a short ENCOUNTER title card showing the current enemy name at battle entry. It changes presentation only and does not touch rewards, damage, AI or encounter mechanics.
7. `addons/campfire-rest.js`: turned the existing warm forest campfire clue into a real optional gameplay interaction. Before it has been used, inspecting the campfire performs one persistent full-HP recovery and gives a Luke-character line; future interactions fall back to the existing clue dialogue. The recovery flag is saved.
8. `addons/low-hp-battle-vignette.js`: added a restrained danger vignette when Luke reaches 28% HP or below in battle. It is presentation-only, does not change damage, and respects reduced-motion.
9. Workflow run `33961924428` for the latest implementation checkpoint completed SUCCESS after all new add-ons were included, so syntax, add-on contract, static regression, browser title smoke, upload and Pages deployment all passed for that checkpoint.

### EARLIER v0.42-v0.50 VISUAL / WORLD / BATTLE FOUNDATION

10. v0.42 replaced eight story-clue emoji with original CSS-drawn evidence props.
11. v0.43 added original evacuation-route evidence props and a distinct demon-army lookout silhouette.
12. v0.44 materially reduced repeated terrain emoji and added an original CSS terrain language for grass, forest, deep forest, trees, roofs, boulders, animated water, masonry, floors, gates and military/evacuation ground.
13. v0.45 improved the interim Luke field sprite with grounded shadow and a two-step movement cadence. This is still interim CSS and is NOT formal directional character art.
14. v0.46 added two persistent optional treasure caches in forest/deep forest.
15. v0.47 added a spoiler-safe INVESTIGATION clue journal using only already-discovered flags.
16. v0.48 replaced emoji battle-command labels with original console-style ATTACK / GUARD / ITEM / ESCAPE glyphs.
17. v0.49 added equipment sell-back while protecting equipped/starter gear.
18. v0.50 added a dedicated victory-result overlay with enemy, EXP, GOLD and level-up feedback.

### v0.51-v0.103 PLAYER-VISIBLE EXPANSION

19. Added projected shop stat comparisons, formal Luke reuse in adventure menu/title/victory/battle/prologue, illustrated regional battle scenery, contextual A interaction prompts, enemy entrance/idle motion, title save preview, live objective compass, first battle technique `集中斬り`, opened-chest persistence, regional world atmosphere, iPhone control-deck polish, original synthesized Web Audio SFX, HP HUD, treasure pickup feedback and save-schema migration.
20. Added dialogue presentation polish, technique documentation in the adventure menu, physical/examinable Royal Capital fountain and market stalls, story-reactive ordinary NPC dialogue, lightweight enemy attack personalities plus visible enemy trait tags, clue-discovery toasts, EXP progress bars and level-up stat breakdown.
21. Added hidden sparkle finds, contextual interaction labels, first optional side quest `旅人の銀留め具`, sidequest state markers, door/chest/clue synth SFX, sidequest completion banner, a physical field signpost, herb drop-table seed, discovered-enemy bestiary with defeat counts, and a second consumable `煙玉` with guaranteed battle escape.
22. Added a live pause-menu minimap derived from current tile data, first ordinary Royal Capital residence interior with furniture and door audio, defeat/recovery presentation, three more town NPCs, original interior prop art, original building-door art, dynamic public build label, discovered-area record, active playtime record, Royal Capital forest-monster bounty, bounty state markers, and multiple save-schema hardening passes.

### v0.104-v0.139 / CONCURRENT CONTINUATION RECONSTRUCTED AT BOOT

23. Fresh HEAD reconstruction confirmed the sequential chain had advanced through `ux-v139.js` before this run's independent changes. Examples seen in the reconstructed range include cinematic dialogue framing, field HP condition HUD, battle command console feedback, interior lighting/prop passes, encounter danger indication, additional presentation work and synthesized map-transition audio.
24. The same fresh gap also added/updated collision-safe systems including manual save slots, optional forest mini-boss content, forest boss patterns, battle poison, bestiary details, key-item presentation, bakery food, audio deduplication and related regression guards. Do not repeat or overwrite those systems without fresh-reading them first.

### COLLISION-SAFE ADD-ONS PRESENT BEFORE THIS RUN

25. `addons/situational-victory.js`: preserves the original 60 victory lines and adds 30 context-specific Luke lines for close wins, herb-use wins and quick wins, maintaining recent-repeat avoidance. Available pool is now 90 when this add-on is loaded.
26. `addons/physical-landmark-prompts.js`: direct A prompts for the physical fountain and market stalls.
27. `addons/completion-record.js`: completed optional-content record in the adventure menu.
28. `addons/battle-turn-counter.js`: visible battle turn counter.
29. `addons/optional-objective-chip.js`: compact current optional-objective HUD.
30. `addons/autosave-pulse.js`: unobtrusive AUTOSAVE feedback on meaningful map/flag transitions.
31. `addons/shop-item-cards.js`: richer item categories, descriptions, owned/equipped clarity.
32. `addons/stackable-shop-quantity.js`: ×1 / ×3 purchase controls for stackable herb/smoke consumables.
33. `addons/critical-hit.js`: conservative normal-attack critical-hit chance with visual feedback.
34. `addons/menu-section-nav.js`: sticky iPhone adventure-menu header, quick close and horizontal section-jump navigation for the now content-rich menu.
35. `addons/dialogue-log.js`: saves up to 30 recent dialogue records and exposes the latest 8 in the adventure menu.
36. `addons/adventure-records.js`: compact battle/defeat/area/treasure/optional-content statistics.
37. `addons/advanced-equipment.js`: second equipment tier (`鉄の剣`, `補強革鎧`) with buy/equip/sell support and projected stat growth.
38. `addons/building-signage.js`: readable INN / SHOP / TEMPLE / HOME sign plaques for Royal Capital buildings.

### CI / SAFETY HARDENING

39. `.github/workflows/pages.yml` discovers `ux-v*.js` dynamically in numeric version order instead of manually editing the list every checkpoint.
40. `tools/lq-static-regression.mjs` guards contiguous ux versions plus critical movement/save/battle/major-feature contracts.
41. `tools/lq-addon-contract.mjs` validates isolated strict-mode add-ons and host contracts.
42. Workflow syntax-checks every sequential patch, every add-on, service worker, manifest/PWA files and formal Luke raster payload before deploy.
43. Workflow assembles the full build and now runs a deterministic headless Chrome title smoke before upload/deploy.
44. `concurrency.cancel-in-progress: true` means intermediate workflow runs can be cancelled during rapid commits. Only the freshest completed run for the implementation checkpoint should be treated as deployment truth.

## FILES_CHANGED

Current run additions:
- `addons/area-title-card.js`
- `addons/world-ambient-layer.js`
- `addons/battle-intro-card.js`
- `addons/campfire-rest.js`
- `addons/low-hp-battle-vignette.js`
- `CURRENT.md`

Major existing files remain:
- sequential `ux-v*.js` chain through at least `ux-v139.js`
- all existing `addons/*.js`
- `tools/lq-static-regression.mjs`
- `tools/lq-addon-contract.mjs`
- `.github/workflows/pages.yml`

## NEW_ASSETS

- No new formal major-character raster art was fabricated in this run.
- Existing Owner-approved Luke full-body WebP remains the authoritative formal Luke asset and was not replaced.
- This run adds original CSS presentation layers only: area-title framing, regional ambient particles/fog/embers, battle encounter framing and low-HP vignette.
- No copied/external art, music or audio was introduced.

## TESTS_AND_VERIFICATION

- Fresh repository metadata/default branch confirmed `main`.
- HEAD-first recovery was exercised because CURRENT lagged 46 commits behind fresh HEAD at boot.
- Fresh diff reconstruction confirmed v0.119-v0.139 plus additional add-ons before mutation.
- All current-run code was added in unique `addons/*.js` files; no sequential ux file was overwritten.
- Workflow dynamically validates every `addons/*.js` with `node --check`.
- Static regression guard and add-on contract guard remain active.
- Assembled-game headless Chrome title smoke remains active in Pages CI.
- Latest completed implementation workflow: `33961924428`, HEAD `6ce77d274e8db9b770bb660f419dd95363db7b57`, conclusion SUCCESS.
- That successful run includes current-run area title cards, ambient world layer, battle intro card, one-time forest campfire recovery and low-HP battle vignette.
- Real-device iPhone visual/touch confirmation remains Owner-device testing and is NOT claimed as passed.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Initial exit guidance, route landmarks, objective HUD, context prompts, building hints, physical signpost and minimap remain active.
- New map-entry title cards immediately tell the player which named location they entered and provide a short regional orientation subtitle.
- Existing building sign plaques continue to make INN / SHOP / TEMPLE / HOME readable at a glance.
- Adventure-menu navigation, investigation records and dialogue history continue reducing memory/scroll burden.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved formal Luke full-body art remains integrated and reused across dialogue, adventure menu, title screen, victory results, battle UI and supported Luke-spoken prologue beats.
- Dialogue framing remains cinematic and formal-art containment is unchanged by this run.
- Recent dialogue history remains available.
- Leon and Glenn formal full-body art: NOT YET INTEGRATED.
- Eleanor and Elisia formal art: NOT YET INTEGRATED.

## BATTLE_VISUAL_PROGRESS

- 21+ original regional enemy vector designs, regional scenery, particles, enemy stage motion, HP display, command hierarchy, damage feedback and low-HP states remain active.
- New ENCOUNTER title card now gives battle entry a dedicated short cinematic beat using the actual enemy name.
- New 28%-HP danger vignette adds readable urgency without changing damage or battle rules.
- Command UI, victory result, formal Luke battle reuse, `集中斬り`, enemy personalities, critical hits, turn counter, poison/status system, optional forest boss, defeat presentation and original runtime SFX remain intact.
- The current run did not alter battle mechanics except adding the independent one-time campfire recovery outside battle.

## MAP_READABILITY_IMPROVEMENTS

- 王都 / 王都近郊 / 魔物の森 / 深部 / 霧 / 監視区域 / 退避路 / 崖道 retain dedicated terrain/route identity.
- New regional ambience layers visually separate calm town/field, leafy forest, mist routes and hostile observation areas without touching collision.
- New area title cards reinforce location identity at map entry.
- 王都 service interiors, ordinary residence, market, fountain, signage, NPC population, forest treasure, hidden finds, signpost and minimap remain active.

## CHARACTER_CANON_STATUS

- Luke formal dialogue/large presentation image: Owner-approved blue hair / blue cloak / silver armor / gold-accent full-body design remains authoritative and live.
- Luke field direction logic: 4/4 directions LIVE (`up`, `down`, `left`, `right`).
- Luke field presentation: interim CSS with four directional silhouettes and step cadence. NOT formal directional artwork.
- Do not promote current field CSS to formal completion.
- Leon formal art: pending.
- Glenn formal art: pending.
- Eleanor formal art: pending.
- Elisia formal art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body art: INTEGRATED and reused across multiple presentation surfaces.
- Luke fallback interim SVG remains only as fallback path.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.
- Eleanor formal art: NOT YET INTEGRATED.
- Elisia formal art: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction behavior: 4/4 LIVE from authoritative `s.dir`.
- Interim CSS direction silhouettes + simple two-step cadence: LIVE.
- Formal generated/approved four-direction Luke field sprite sheet: NOT YET INTEGRATED.
- Leon / Glenn formal four-direction field sprites: NOT YET IMPLEMENTED.
- Ordinary NPC CSS silhouettes are an interim/original presentation improvement, not a substitute for eventual high-fidelity main-character sprite sheets.

## POST_BATTLE_LINE_VARIETY_STATUS

- Original generic Luke victory lines: 60.
- Collision-safe situational add-on: +30 context-specific lines.
- Available combined pool when add-on is loaded: 90.
- Original random selection remains active.
- Recent repeat protection remains; situational add-on also avoids recent exact repeats.
- Do not reduce below approximately 50 or collapse back to one repeated line.

## CHECKPOINT_HISTORY

Foundation:
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
- v0.41 ordinary NPC silhouettes

Extended run highlights:
- v0.42-v0.44 evidence/route/terrain de-emoji and art passes
- v0.45 movement cadence
- v0.46 treasure caches
- v0.47 investigation journal
- v0.48 battle command art
- v0.49 sell-back
- v0.50 victory results
- v0.51 shop comparison
- v0.52 formal Luke menu art
- v0.53 battle scenery
- v0.54 interaction bubble
- v0.55 enemy motion
- v0.56 save preview
- v0.57 formal Luke title art
- v0.58 objective compass
- v0.59 first technique
- v0.60 formal Luke victory art
- v0.61 persistent open chests
- v0.62 world atmosphere
- v0.63 iPhone control deck
- v0.64 synth SFX
- v0.65 HP HUD
- v0.66 treasure pickup presentation
- v0.67 formal Luke battle art
- v0.68 save schema hardening
- v0.69 dialogue polish
- v0.70 technique menu
- v0.71-v0.72 physical fountain/market
- v0.73 reactive NPC dialogue
- v0.74-v0.75 enemy behavior + trait UI
- v0.76 clue toast
- v0.77-v0.78 EXP/level-up feedback
- v0.79 hidden finds
- v0.80 contextual interaction label
- v0.81-v0.84 first sidequest + markers + SFX + completion
- v0.85 field signpost
- v0.86 drops
- v0.87-v0.88 bestiary + kill counts
- v0.89 smoke bomb
- v0.90 minimap
- v0.91-v0.92 residence interior + density
- v0.93 defeat presentation
- v0.94 town population
- v0.95-v0.96 original interior props/doors
- v0.97 formal Luke prologue art
- v0.98 save schema v4
- v0.99 dynamic build label
- v0.100 area record
- v0.101 playtime
- v0.102-v0.103 bounty + presentation
- concurrent sequential chain later advanced through v0.139 before this run

Collision-safe add-on checkpoints before this run include situational victory lines, physical landmark prompts, completion record, battle turn counter, optional objective chip, autosave pulse, richer shop cards, stack purchase controls, critical hits, menu section navigation, recent dialogue log, adventure statistics, Tier-II equipment, building signage, manual backup slots, poison/status, bakery food, optional forest boss and related progression systems.

Current run collision-safe checkpoints:
- cinematic area title cards
- regional ambient layer
- cinematic battle ENCOUNTER card
- persistent one-time forest campfire rest
- low-HP battle danger vignette

## KNOWN_ISSUES

- Luke field character is still interim CSS rather than formal approved four-direction sprite art.
- Leon/Glenn dialogue images remain interim; Eleanor/Elisia formal portraits remain unavailable.
- CSS/vector world art is substantially improved but still below the eventual high-fidelity sprite/tile/raster target in many places.
- Some map/NPC/environment markers may still use placeholder presentation and need continued replacement.
- Adventure menu is feature-rich and therefore long; sticky section navigation was added, but real iPhone usability still needs Owner-device confirmation.
- Manual backup slots now supplement autosave, but real-device persistence/reload behavior still needs Owner-device testing.
- `wins` remains a legacy global progression count even though bestiary/bounty now maintain more specific records.
- Some balance values (Tier-II gear, criticals, drops, bounty, smoke bombs, optional boss, campfire recovery) need real playtesting rather than static confidence.
- Current audio is original synthesized Web Audio SFX; there is still no full original BGM layer.
- PWA/service worker is implemented but not real-device verified on Owner iPhone.
- Browser-executed CI currently verifies assembled title/runtime loading but does not yet simulate the full touch/movement/combat path.
- Sequential patch chain is large. Dynamic discovery and regression guards reduce maintenance risk, but future consolidation must be an explicitly tested migration, never casual refactoring.
- Concurrent writers may advance HEAD between reads/writes. Always fresh-fetch target SHA immediately before stateful updates and prefer unique `addons/*.js` for independent work when sequential filenames are racing.

## BLOCKERS

- No blocker for continued code/world/UI/content development.
- Formal four-direction Luke field art remains blocked on approved directional source art. Do not fabricate completion by mirroring/guessing the formal design.
- Formal Leon/Glenn/Eleanor/Elisia art requires generation/approval/integration work. Do not substitute low-quality placeholders and call them final.
- Real-device iPhone verification is external to this runtime.

## NEXT_ACTION

Continue from fresh HEAD and keep using the collision-safe add-on lane for independent work unless the sequential lane is clearly free. Highest-value safe priorities now are: extend assembled-browser regression beyond title loading if a robust no-dependency path is available; deepen walkable world/building interactions; continue replacing remaining prototype/emoji presentation; expand equipment/item/battle depth with readable balance; add further PS1-early scene framing and environmental detail; do not cross the locked north main-story frontier or expose hidden canon.

## NEXT_ACTION_COMPLETION_CONDITION

1. Fresh HEAD and any commits after this autosave are reconstructed before mutation.
2. At least one additional player-visible or regression-safety improvement is safely checkpointed without overwriting concurrent work.
3. Central movement-stop safety, collision, save/manual backup, physical interiors, shop/equipment/sell, menu/minimap/journals, treasure persistence, battle rewards/technique/AI/status/optional-boss, 90-line combined victory variety and current story flags remain intact.
4. New files pass syntax/static/add-on contract validation.
5. The freshest final Pages workflow completes SUCCESS before any user-facing deploy PASS claim.
6. CURRENT remains an autosave checkpoint, not a stop trigger; development may continue after this sync while execution capacity remains.

## SESSION_WORK_ITEMS_COMPLETED

Earlier extended work remains preserved, including fresh HEAD recovery, terrain/evidence/interior/NPC/door de-placeholder passes, four Royal Capital building interiors, expanded battle systems, shop/equipment progression, exploration rewards, sidequest/bounty loops, bestiary, records, formal Luke reuse, iPhone shell/menu work and CI hardening.

Current run completed:
- Reconstructed 46-commit gap from stale CURRENT to fresh HEAD.
- Confirmed latest sequential chain through v0.139 before mutation.
- Added cinematic area title cards.
- Added lightweight map-specific ambient particles/fog/embers.
- Added cinematic battle ENCOUNTER card.
- Added one-time persistent forest campfire recovery interaction.
- Added low-HP battle danger vignette.
- Verified latest implementation checkpoint through Pages workflow SUCCESS.

## SESSION_NEXT_AVAILABLE_WORK

- Extend browser smoke toward deterministic start/movement/action if it can be done without fragile external dependencies.
- Continue replacing remaining emoji/prototype world presentation.
- Expand ordinary building interiors and town interactions.
- Add more original items/equipment while tuning economy through real play data.
- Continue battle depth without prematurely creating the Glenn/main boss.
- Add original BGM only if a safe original-audio generation/integration route is available.
- Formal Luke four-direction sprite when approved source art exists.
- Formal Leon/Glenn/Eleanor/Elisia portrait integration when appropriate source art is available.

## DO_NOT_REPEAT

- Do not make the initial route/exit ambiguous again.
- Do not return Luke to permanently front-facing movement.
- Do not call interim CSS/SVG major-character art formal final art.
- Do not use face-only major-character art as the final presentation.
- Do not claim formal image integration unless the public game actually references the approved asset.
- Do not generate/substitute an unapproved Luke design while formal canon exists.
- Do not reduce victory-line variety below approximately 50 or remove recent-repeat protection without Owner approval.
- Do not regress central movement-stop safety, global pointer release/cancel handling, visibility safety, keyboard/touch movement, collision, battle rewards, level-up, herbs, guard/escape, world return, objectives or save behavior.
- Do not overwrite a sequential ux file that appeared concurrently; fresh-check and move independent work to a unique add-on path instead.
- Do not infer latest ux version from memory; fresh HEAD is authority.
- Do not reveal Glenn's family relation to Luke, Elisia's full history, Eleanor's crime, or Demon-King succession secrets yet.
- Do not start the Glenn boss fight or casually open the locked north story continuation.
- Do not copy existing-game characters, maps, dialogue, UI art, music, images or protected assets.
- Do not treat CURRENT update, commit, successful deploy, one completed feature or a satisfying checkpoint as a reason to stop development.

## IMPORTANT_DESIGN_DECISIONS

- `AUTONOMOUS_DEV_DIRECTIVE.md` is the detailed quality/operation authority.
- Fresh GitHub HEAD is implementation reality. CURRENT is operational autosave/handoff.
- CURRENT is not shutdown work.
- Sequential `ux-vNN.js` remains the ordered main patch lane. Unique `addons/*.js` is the safe collision-avoidance lane for independent improvements and is loaded after sequential patches.
- Pages workflow must dynamically validate/inject the current ux chain and all add-ons. Do not return to a hand-maintained patch list.
- `tools/lq-static-regression.mjs`, `tools/lq-addon-contract.mjs` and assembled-browser smoke are part of deployment safety.
- Frequent safe commits are preferred so sudden execution stop loses minimal work.
- PS1-early quality means concrete density, readable world geometry, physical interiors, original props/enemies, character presence, battle feedback, transitions, scene-entry framing, environment motion, menu records and touch usability. It is not permission to call flat CSS placeholders “finished”.
- Formal major-character presentation remains full-body/body-dominant. Field sprites are a separate four-direction layer.
- Approved Luke art may be reused across dialogue/title/menu/battle/victory/prologue. Do not generate a different Luke simply to fill a slot.
- Original CSS/vector art is acceptable as integrated environment/enemy/interim ordinary-NPC presentation, but not as falsely completed formal major-character art.
- Player guidance, exploration reward, readable evidence, optional-content tracking and iPhone interaction are first-class quality requirements.
- Functional/player-visible improvements outrank cosmetic refactoring for its own sake.
- Story secrets must continue to be revealed through evidence/ambiguity, not exposition dumps.

## STORY_CANON_ADDED_OR_CHANGED

- No core hidden story canon was changed in this run.
- The campfire recovery reuses the already-existing warm campfire clue and adds only local gameplay/flavor; it does not alter the main canonical mystery.
- Investigation/dialogue records continue exposing only information the player has encountered.
- Glenn-family relation, Elisia full history, Eleanor's crime and Demon-King succession remain unrevealed.
- The existing north main-story frontier remains intentionally unresolved.
