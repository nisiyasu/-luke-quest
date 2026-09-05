# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 19:27 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `b77345331d27e8dd6608a6219463d80674efbb88` (fresh implementation HEAD observed immediately before this CURRENT autosave; this CURRENT commit follows it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / extended build chain now reaches at least `ux-v118.js` plus collision-safe `addons/*.js`; latest full Pages validation was still in progress immediately before this CURRENT autosave and must be rechecked fresh after this commit

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

`index.html` remains the rollback-safe v0.7 core. GitHub Pages dynamically discovers and injects `ux-v*.js` in numeric `sort -V` order, then injects `addons/*.js`. Do not manually assume the latest ux version. Fresh HEAD advanced concurrently during this run from v0.41 through at least v0.118.

## WHAT_CHANGED_RECENTLY

### HEAD-FIRST RECOVERY / CONTINUOUS DEVELOPMENT

1. The run booted from fresh repository reality and detected that CURRENT was behind fresh HEAD. It correctly treated GitHub HEAD as implementation truth, reconstructed missing commits, and resumed from the latest real checkpoint rather than repeating stale work.
2. While the run was active, another writer also advanced the same repository through sequential `ux-vNN.js` checkpoints. Direct attempts to claim fast-moving `ux-v104.js` / `ux-v105.js` names collided with already-created files. No existing work was overwritten.
3. To keep development safe and continuous, a collision-safe extension lane was established: sequential core patches remain `ux-vNN.js`, while independent work can use uniquely named `addons/*.js` loaded after the sequential chain.
4. Pages workflow now validates both lanes, injects ux patches in version order, and injects add-ons after the ux chain. This is the preferred safe pattern while multiple writers can advance HEAD.

### v0.42-v0.50 VISUAL / WORLD / BATTLE FOUNDATION

5. v0.42 replaced eight story-clue emoji with original CSS-drawn evidence props.
6. v0.43 added original evacuation-route evidence props and a distinct demon-army lookout silhouette.
7. v0.44 materially reduced repeated terrain emoji and added an original CSS terrain language for grass, forest, deep forest, trees, roofs, boulders, animated water, masonry, floors, gates and military/evacuation ground.
8. v0.45 improved the interim Luke field sprite with grounded shadow and a two-step movement cadence. This is still interim CSS and is NOT formal directional character art.
9. v0.46 added two persistent optional treasure caches in forest/deep forest.
10. v0.47 added a spoiler-safe INVESTIGATION clue journal using only already-discovered flags.
11. v0.48 replaced emoji battle-command labels with original console-style ATTACK / GUARD / ITEM / ESCAPE glyphs.
12. v0.49 added equipment sell-back while protecting equipped/starter gear.
13. v0.50 added a dedicated victory-result overlay with enemy, EXP, GOLD and level-up feedback.

### v0.51-v0.103 PLAYER-VISIBLE EXPANSION

14. Added projected shop stat comparisons, formal Luke reuse in adventure menu/title/victory/battle/prologue, illustrated regional battle scenery, contextual A interaction prompts, enemy entrance/idle motion, title save preview, live objective compass, first battle technique `集中斬り`, opened-chest persistence, regional world atmosphere, iPhone control-deck polish, original synthesized Web Audio SFX, HP HUD, treasure pickup feedback and save-schema migration.
15. Added dialogue presentation polish, technique documentation in the adventure menu, physical/examinable Royal Capital fountain and market stalls, story-reactive ordinary NPC dialogue, lightweight enemy attack personalities plus visible enemy trait tags, clue-discovery toasts, EXP progress bars and level-up stat breakdown.
16. Added hidden sparkle finds, contextual interaction labels, first optional side quest `旅人の銀留め具`, sidequest state markers, door/chest/clue synth SFX, sidequest completion banner, a physical field signpost, herb drop-table seed, discovered-enemy bestiary with defeat counts, and a second consumable `煙玉` with guaranteed battle escape.
17. Added a live pause-menu minimap derived from current tile data, first ordinary Royal Capital residence interior with furniture and door audio, defeat/recovery presentation, three more town NPCs, original interior prop art, original building-door art, dynamic public build label, discovered-area record, active playtime record, Royal Capital forest-monster bounty, bounty state markers, and multiple save-schema hardening passes.

### CONCURRENT UX CHAIN OBSERVED AFTER v0.103

18. Fresh HEAD later advanced through at least v0.118 while this run continued. Confirmed examples include v0.109 cinematic dialogue framing, v0.110 field HP condition HUD, v0.111 battle command console feedback, v0.113 interior lighting atmosphere, v0.114 original interior-prop sprites, and v0.118 encounter danger indicator. Intervening versions must be read fresh at next boot instead of inferred from memory.

### COLLISION-SAFE ADD-ONS ADDED IN THIS RUN

19. `addons/situational-victory.js`: preserves the original 60 victory lines and adds 30 context-specific Luke lines for close wins, herb-use wins and quick wins, maintaining recent-repeat avoidance. Available pool is now 90 when this add-on is loaded.
20. `addons/physical-landmark-prompts.js`: direct A prompts for the physical fountain and market stalls.
21. `addons/completion-record.js`: completed optional-content record in the adventure menu.
22. `addons/battle-turn-counter.js`: visible battle turn counter.
23. `addons/optional-objective-chip.js`: compact current optional-objective HUD.
24. `addons/autosave-pulse.js`: unobtrusive AUTOSAVE feedback on meaningful map/flag transitions.
25. `addons/shop-item-cards.js`: richer item categories, descriptions, owned/equipped clarity.
26. `addons/stackable-shop-quantity.js`: ×1 / ×3 purchase controls for stackable herb/smoke consumables.
27. `addons/critical-hit.js`: conservative normal-attack critical-hit chance with visual feedback.
28. `addons/menu-section-nav.js`: sticky iPhone adventure-menu header, quick close and horizontal section-jump navigation for the now content-rich menu.
29. `addons/dialogue-log.js`: saves up to 30 recent dialogue records and exposes the latest 8 in the adventure menu.
30. `addons/adventure-records.js`: compact battle/defeat/area/treasure/optional-content statistics.
31. `addons/advanced-equipment.js`: second equipment tier (`鉄の剣`, `補強革鎧`) with buy/equip/sell support and projected stat growth.
32. `addons/building-signage.js`: readable INN / SHOP / TEMPLE / HOME sign plaques for Royal Capital buildings.

### CI / SAFETY HARDENING

33. `.github/workflows/pages.yml` now discovers `ux-v*.js` dynamically in numeric version order instead of manually editing the list every checkpoint.
34. `tools/lq-static-regression.mjs` asserts contiguous ux versions and guards critical movement/save/battle/major-feature contracts.
35. `tools/lq-addon-contract.mjs` validates that add-ons remain isolated strict-mode IIFEs and that required host contracts are present.
36. Workflow syntax-checks every sequential patch, every add-on, service worker, manifest, PWA files and formal Luke raster payload before deploy.
37. `concurrency.cancel-in-progress: true` means many intermediate workflow runs are expected to be cancelled during rapid development. Only the freshest final run should be treated as deployment truth.

## FILES_CHANGED

Major current-run files include:
- `ux-v42.js` through numerous sequential checkpoints now reaching at least `ux-v118.js` on fresh HEAD
- `addons/situational-victory.js`
- `addons/physical-landmark-prompts.js`
- `addons/completion-record.js`
- `addons/battle-turn-counter.js`
- `addons/optional-objective-chip.js`
- `addons/autosave-pulse.js`
- `addons/shop-item-cards.js`
- `addons/stackable-shop-quantity.js`
- `addons/critical-hit.js`
- `addons/menu-section-nav.js`
- `addons/dialogue-log.js`
- `addons/adventure-records.js`
- `addons/advanced-equipment.js`
- `addons/building-signage.js`
- `tools/lq-static-regression.mjs`
- `tools/lq-addon-contract.mjs`
- `.github/workflows/pages.yml`
- `CURRENT.md`

## NEW_ASSETS

- No new formal major-character raster art was fabricated in this run.
- Existing Owner-approved Luke full-body WebP remains the only formal main-character raster used by the new Luke presentation surfaces.
- Original CSS/vector art has been added for terrain, evidence props, ordinary NPCs, building doors, interior objects, enemy presentation and UI effects. These are integrated public-game assets/presentation, but they are NOT to be mislabeled as formal final major-character art.
- Synthesized SFX are generated at runtime with Web Audio; no copied/external audio file was introduced.

## TESTS_AND_VERIFICATION

- Fresh repository metadata/default branch repeatedly confirmed `main`.
- HEAD-first recovery was exercised in practice because CURRENT lagged behind HEAD.
- Sequential ux naming collision was detected safely; no overwrite occurred and the add-on lane was introduced instead.
- Workflow validates sequential ux patches with `node --check` in `sort -V` order.
- Workflow validates all `addons/*.js` with `node --check`.
- Static regression guard verifies contiguous ux patch chain plus central stopMoving, global pointer release/cancel, visibility safety, save, battle actions and major feature contracts.
- Add-on contract guard verifies host contracts and isolated add-on structure.
- Manifest JSON, service worker syntax, app icon, PNG transport probe and Owner-approved Luke WebP RIFF/WEBP signature remain validated in CI.
- Latest fresh implementation HEAD immediately before this CURRENT autosave: `b77345331d27e8dd6608a6219463d80674efbb88` (`Add v0.118 encounter danger indicator`).
- The workflow for that HEAD was `in_progress` immediately before this CURRENT autosave. Recheck the new freshest run after this CURRENT commit before reporting final deployment PASS.
- Real-device iPhone visual/touch confirmation remains Owner-device testing and is NOT claimed as passed.
- There is still no real automated browser/touch execution suite; current CI is strong static/syntax/asset contract validation, not a substitute for Safari runtime testing.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Initial exit guidance, route landmarks, objective HUD, context prompts and building hints remain active.
- Live objective compass now gives route direction while avoiding a false forest direction before the two-win unlock condition.
- Field signpost gives physical in-world direction to 王都 / 魔物の森.
- Physical fountain, market stalls, buildings and NPCs show direct A interaction prompts/context labels.
- Building sign plaques make INN / SHOP / TEMPLE / HOME readable at a glance.
- Pause-menu minimap shows current position and terrain-derived area context.
- Optional objective chip exposes the currently active sidequest/bounty without replacing the main objective.
- Adventure-menu section navigation prevents the growing menu from becoming an iPhone scroll maze.
- Investigation journal, dialogue log, completed-content record and discovered-area record reduce memory burden for long play sessions.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved formal Luke full-body art remains integrated and reused in dialogue, adventure menu, title screen, victory results, battle UI and Luke-spoken prologue beats where supported.
- Dialogue framing has received multiple cinematic polish passes while preserving formal art containment.
- Recent dialogue history now stores up to 30 entries and shows the latest 8 in the menu.
- Ordinary NPC dialogue can react to already-known story progress without revealing hidden canon.
- Leon and Glenn formal full-body art: NOT YET INTEGRATED.
- Eleanor and Elisia formal art: NOT YET INTEGRATED.

## BATTLE_VISUAL_PROGRESS

- 21+ original regional enemy vector designs, regional scenery, particles, enemy stage motion, HP display, command hierarchy, damage feedback and low-HP states remain active.
- Command UI uses original console-style glyphs rather than emoji labels.
- Dedicated victory result presents enemy, EXP, GOLD, level-up and possible item drop.
- Formal Luke art is reused in battle/victory presentation without generating a different Luke.
- `集中斬り` provides the first explicit battle technique, once per battle.
- Enemy personalities now introduce lightweight fast/heavy/tricky behavior variation with readable trait tags.
- Normal attack has a conservative critical-hit layer via collision-safe add-on.
- Battle turn counter improves tactical readability.
- Defeat has a dedicated recovery presentation before returning to existing safe Royal Capital recovery state.
- Original runtime Web Audio SFX cover attack, guard, heal, skill, escape, victory, menu, door, chest and clue feedback where supported.
- Encounter danger indication is present on fresh v0.118 HEAD.

## MAP_READABILITY_IMPROVEMENTS

- 王都 / 王都近郊 / 魔物の森 / 深部 / 霧 / 監視区域 / 退避路 / 崖道 retain dedicated terrain/atmosphere/route identity.
- Repeated terrain/clue/door/interior-prop emoji have been materially reduced or replaced with original CSS/vector presentation.
- 王都 now contains physical service buildings plus an ordinary residence interior, market stalls, fountain, sign plaques and additional townsfolk.
- Optional forest exploration has persistent treasure and hidden sparkle rewards.
- Route objective compass + physical field sign + pause minimap create three complementary navigation layers.
- Interior lighting/prop improvements continued on concurrent v0.113-v0.114 checkpoints.

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
- Collision-safe situational add-on: +30 context-specific lines (10 close win / 10 herb-use / 10 quick win).
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
- fresh concurrent ux chain continued through at least v0.118

Collision-safe add-on checkpoints include situational victory lines, physical landmark prompts, completion record, battle turn counter, optional objective chip, autosave pulse, richer shop cards, stack purchase controls, critical hits, menu section navigation, recent dialogue log, adventure statistics, Tier-II equipment and building signage.

## KNOWN_ISSUES

- Luke field character is still interim CSS rather than formal approved four-direction sprite art.
- Leon/Glenn dialogue images remain interim; Eleanor/Elisia formal portraits remain unavailable.
- CSS/vector world art is substantially improved but still below the eventual high-fidelity sprite/tile/raster target in many places.
- Some map/NPC/environment markers may still use placeholder presentation and need continued replacement.
- Adventure menu is feature-rich and therefore long; sticky section navigation was added, but real iPhone usability still needs Owner-device confirmation.
- Single-save localStorage remains the primary save model; no multi-slot save UI yet.
- `wins` remains a legacy global progression count even though bestiary/bounty now maintain more specific records.
- Some balance values (Tier-II gear, criticals, drops, bounty, smoke bombs) need real playtesting rather than static confidence.
- Current audio is original synthesized Web Audio SFX; there is still no full original BGM layer.
- PWA/service worker is implemented but not real-device verified on Owner iPhone.
- No browser-executed/touch regression harness exists yet.
- Sequential patch chain is large. Dynamic discovery and regression guards reduce maintenance risk, but a future consolidation should only happen as an explicitly tested migration, never casual refactoring.
- Concurrent writers can advance HEAD between reads/writes. Always fresh-fetch target SHA immediately before stateful updates and use `addons/*.js` for independent work when sequential filenames are racing.

## BLOCKERS

- No blocker for continued code/world/UI/content development.
- Formal four-direction Luke field art remains blocked on approved directional source art. Do not fabricate completion by mirroring/guessing the formal design.
- Formal Leon/Glenn/Eleanor/Elisia art requires generation/approval/integration work. Do not substitute low-quality placeholders and call them final.
- Real-device iPhone verification is external to this runtime.

## NEXT_ACTION

Continue from fresh HEAD, first re-reading the latest sequential ux checkpoints that landed after v0.118 if any. Keep using the collision-safe add-on lane for independent work while another writer owns fast-moving `ux-vNN.js`. Highest-value safe priorities are: actual browser/touch regression capability if achievable, remaining prototype/emoji replacement, deeper walkable world/building content, richer battle/item/equipment progression, and PS1-early presentation polish without crossing the locked north story frontier or exposing hidden canon.

## NEXT_ACTION_COMPLETION_CONDITION

1. Fresh HEAD and latest concurrent ux changes are reconstructed before new mutation.
2. At least one additional player-visible improvement is safely checkpointed without overwriting concurrent work.
3. Central movement-stop safety, collision, save, physical interiors, shop/equipment/sell, menu/minimap/journals, treasure persistence, battle rewards/technique/AI, 90-line combined victory variety and current story flags remain intact.
4. New files pass syntax/static/add-on contract validation.
5. The freshest final Pages workflow completes SUCCESS before any user-facing deploy PASS claim.
6. CURRENT remains an autosave checkpoint, not a stop trigger; development should continue after this sync while execution capacity remains.

## SESSION_WORK_ITEMS_COMPLETED

- Fresh HEAD recovery from stale CURRENT.
- Continuous multi-checkpoint work far beyond a single NEXT_ACTION.
- Major terrain/evidence/interior/NPC/door de-placeholder passes.
- Four walkable Royal Capital building interiors including an ordinary residence.
- Expanded battle presentation, first technique, critical layer, enemy behavior classes, results, defeat presentation and original synth SFX.
- Shop sell-back, comparison, stack purchase clarity and Tier-II equipment progression.
- Exploration treasure, hidden finds, minimap, signpost and area records.
- First sidequest and first bounty loop with HUD/menu/completion presentation.
- Bestiary, kill counts, playtime, dialogue log, investigation journal and adventure statistics.
- Formal Owner-approved Luke art reused across multiple large presentation surfaces without inventing a new Luke.
- iPhone menu navigation/control-deck polish.
- Dynamic ux patch discovery, collision-safe add-on architecture, static regression guard and add-on contract guard.
- Concurrent writer collision handled without overwrite or forced stop.

## SESSION_NEXT_AVAILABLE_WORK

- Fresh-read concurrent ux versions beyond current known v0.118.
- Add a browser-executed smoke test if tooling can support it safely.
- Continue replacing any remaining emoji/prototype world presentation.
- Expand ordinary building interiors and town interactions.
- Add additional original equipment/items while tuning economy through real play data.
- Continue battle depth without prematurely creating a major boss.
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
- `tools/lq-static-regression.mjs` and `tools/lq-addon-contract.mjs` are part of deployment safety.
- Frequent safe commits are preferred so sudden execution stop loses minimal work.
- PS1-early quality means concrete density, readable world geometry, physical interiors, original props/enemies, character presence, battle feedback, transitions, menu records and touch usability. It is not permission to call flat CSS placeholders “finished”.
- Formal major-character presentation remains full-body/body-dominant. Field sprites are a separate four-direction layer.
- Approved Luke art may be reused across dialogue/title/menu/battle/victory/prologue. Do not generate a different Luke simply to fill a slot.
- Original CSS/vector art is acceptable as integrated environment/enemy/interim ordinary-NPC presentation, but not as falsely completed formal major-character art.
- Player guidance, exploration reward, readable evidence, optional-content tracking and iPhone interaction are first-class quality requirements.
- Functional/player-visible improvements outrank cosmetic refactoring for its own sake.
- Story secrets must continue to be revealed through evidence/ambiguity, not exposition dumps.

## STORY_CANON_ADDED_OR_CHANGED

- No core hidden story canon was changed in this extended run.
- New optional sidequest/bounty content is local world flavor and does not alter the main canonical mystery.
- Investigation/dialogue records only expose information the player has already encountered.
- Glenn-family relation, Elisia full history, Eleanor's crime and Demon-King succession remain unrevealed.
- The existing north story frontier remains intentionally unresolved.
