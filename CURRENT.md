# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 18:55 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `01d615bf86ed6a114369137d74244c686711eb6f` (v0.50 implementation/deploy checkpoint immediately before this CURRENT autosave)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / v0.50 validation+Pages deploy SUCCESS via workflow run `33959184463`

## MANDATORY_BOOT_FILES

Read fresh before mutation:
1. `AUTONOMOUS_DEV_DIRECTIVE.md`
2. `CURRENT.md`
3. `index.html`
4. `.github/workflows/pages.yml`
5. `ux-v08.js` through latest `ux-vNN.js`
6. `manifest.webmanifest`
7. `sw.js`
8. `assets/app-icon.svg`
9. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
10. `assets/characters/luke/dialogue-neutral.webp.b64`
11. `assets/portraits/` state
12. recent commits / Pages workflow state

`index.html` remains rollback-safe v0.7 core. Pages injects presentation/gameplay patches in numerical order. Current deployed chain is v0.8 → v0.50.

## WHAT_CHANGED_RECENTLY

### v0.16-v0.39 foundation carried forward
1. Added physical interiors for `南門宿・一階`, `ミナの道具屋`, and `王国神殿・礼拝堂` with doorway entry/exit, collisions, props, services and safe story presentation.
2. Added contextual A-button prompts, town/field/forest visual-density passes, demon-army route identity, battle depth, original CSS chest, 21 original vector enemy designs, title/prologue upgrade, transitions, PWA shell, real shop/equipment/DEF system, full adventure menu, inn overnight presentation and field herb use.

### HEAD-first recovery in the current automation run
3. Fresh `main` HEAD was `434d236667ca812b7e8d3a0bb61f459ae71c544a` while CURRENT still pointed to v0.39. The run correctly treated HEAD as reality, inspected the missing commits/diffs and resumed from v0.41 rather than repeating stale work.
4. Recovered v0.40: explicit weapon/armor switching from the adventure menu.
5. Recovered v0.41: original lightweight field silhouettes for five ordinary human NPCs (`旅好きの老人`, `畑仕事の青年`, `道具屋のミナ`, `南門宿の主人`, `神殿の見習い`) replacing their emoji placeholders.

### v0.42-v0.50 player-visible work
6. v0.42 replaced eight story-clue emoji with original CSS-drawn props: dying campfire, black feather, broken training sword, golden thread, disturbed footprints, black-iron order marker, disciplined bootprints and discarded bandage.
7. v0.43 replaced three evacuation-route clue emoji with original props (`血のついた岩`, `外された封鎖杭`, `撤収命令の切れ端`) and replaced the ordinary demon-army lookout emoji with a distinct original CSS guard silhouette.
8. v0.44 removed repeated house/tree/rock emoji from core terrain rendering and introduced a denser original CSS terrain language for grass, forest, deep forest, conifer trees, roof shingles, boulders, animated water glints, masonry walls, interior floors, gates, military ground and evacuation terrain.
9. v0.45 added a two-step cadence, grounded shadow, body/head/cape bob and leg phase animation to the existing interim Luke field representation. This remains interim CSS and is explicitly NOT formal four-direction character artwork.
10. v0.46 added two persistent optional exploration treasure caches: forest cache = 24G + 薬草1, deep-forest cache = 38G + 薬草1. Both use saved flags and the existing original chest presentation.
11. v0.47 added an `INVESTIGATION` clue journal to the adventure menu. It exposes only already-discovered evidence from existing story flags and deliberately does not reveal hidden family/Elisia/Eleanor/Demon-King canon.
12. v0.48 replaced emoji-led battle command labels with original console-style CSS glyphs and Japanese/English command hierarchy for ATTACK / GUARD / ITEM / ESCAPE; battle header chips were also de-emoji'd.
13. v0.49 added a real shop sell-back flow for optional equipment. 青銅の剣 sells for 22G and 革の旅装 for 19G. Equipped gear cannot be sold, and starter gear remains protected.
14. v0.50 added a dedicated post-battle result overlay with defeated enemy, EXP, GOLD and a LEVEL UP callout. Movement/action are safely blocked while the result is open; A or the continue button returns to the field, after which the existing Luke victory banter remains available.
15. Final workflow run `33959184463` for commit `01d615bf86ed6a114369137d74244c686711eb6f` completed SUCCESS, validating all JS v0.8-v0.50 plus PWA/raster checks and deploying GitHub Pages.

## FILES_CHANGED

- `ux-v40.js`
- `ux-v41.js`
- `ux-v42.js`
- `ux-v43.js`
- `ux-v44.js`
- `ux-v45.js`
- `ux-v46.js`
- `ux-v47.js`
- `ux-v48.js`
- `ux-v49.js`
- `ux-v50.js`
- `.github/workflows/pages.yml`
- `CURRENT.md`

## NEW_ASSETS

- No new formal raster major-character art was fabricated.
- Owner-approved Luke full-body WebP remains authoritative.
- v0.42-v0.44 use original CSS-drawn environment/clue/terrain visuals integrated directly into the public game.
- v0.41/v0.43 use original CSS field silhouettes for ordinary NPC/guard presentation; these are not formal major-character portrait assets.

## TESTS_AND_VERIFICATION

- Fresh repository metadata/default branch confirmed `main`.
- HEAD-first recovery correctly detected stale CURRENT and reconstructed v0.40-v0.41 from commit reality.
- v0.42-v0.50 are included in workflow `node --check` validation before deployment.
- PWA manifest JSON parse, service-worker syntax check, app-icon presence, base64 PNG transport signature and Owner-approved Luke WebP RIFF/WEBP signature remain in CI.
- Final v0.50 workflow run `33959184463`: `status=completed`, `conclusion=success`.
- Pages deploy checkpoint HEAD verified as `01d615bf86ed6a114369137d74244c686711eb6f` before this CURRENT autosave.
- Real-device iPhone visual/touch confirmation remains Owner-device testing and is NOT claimed as passed.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Existing objective HUD, initial exit guidance, route landmarks, building prompts and interior guidance remain active.
- Adventure menu keeps the main objective visible.
- v0.47 now also preserves discovered mystery evidence in a clue journal, reducing the need to remember scattered NPC/prop dialogue.
- v0.46 rewards optional forest exploration with persistent treasure instead of making every detour purely decorative.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved formal Luke full-body dialogue art remains integrated and authoritative.
- Dialogue shell remains body-dominant rather than face-only.
- Leon and Glenn still use interim SVG dialogue art and are NOT formalized.
- Eleanor / Elisia formal dialogue art remains unintegrated.
- Investigation journal summarizes discovered evidence without leaking hidden canon.

## BATTLE_VISUAL_PROGRESS

- Regional battle framing, enemy stage, HP display, environmental depth, particles, enemy hit pulse, low-HP danger and 21 original vector enemy designs remain active.
- v0.48 replaces emoji-led command labels with original console-style command glyphs and stronger hierarchy.
- v0.50 adds a dedicated victory-result presentation with EXP/GOLD/level-up feedback.
- DEF continues to reduce enemy damage before guard reduction.
- Victory banter remains 60 randomized Luke lines with last-8 exact repeat suppression.

## MAP_READABILITY_IMPROVEMENTS

- 王都 / 王都近郊 / 魔物の森 / 深部 / 監視区域 / 退避路 retain their prior landmark and density passes.
- v0.42-v0.43 turn story evidence into distinct readable physical props instead of generic emoji.
- v0.44 materially reduces repeated emoji tiles and gives grass/forest/tree/roof/rock/water/wall/floor/military/evacuation terrain a more coherent 2D-console visual language.
- Three Royal Capital interiors remain physically enterable.
- Two forest-region optional treasure caches add readable exploration destinations.

## CHARACTER_CANON_STATUS

- Luke formal dialogue image: Owner-approved blue-haired / blue-cloak / silver-armor / gold-accent full-body design remains live.
- Luke field direction logic: 4/4 directions live.
- Luke field artwork: still interim CSS and NOT formal directional art.
- v0.45 improves movement cadence only; it does NOT change formal-canon status.
- Leon and Glenn formal visual art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body dialogue art: INTEGRATED.
- Luke old interim SVG remains only as fallback path.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.
- Eleanor formal art: NOT YET INTEGRATED.
- Elisia formal art: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction logic: 4/4 LIVE (`up`, `down`, `left`, `right`) using authoritative `s.dir`.
- Luke interim CSS field presentation: four directional silhouettes + v0.45 two-step movement cadence / idle return.
- Luke formal four-direction field art: NOT YET INTEGRATED.
- Leon/Glenn formal four-direction field art: NOT YET IMPLEMENTED.
- Five ordinary human NPCs now use original CSS chibi silhouettes; major-character formal-art requirements are unchanged.
- Do not call current CSS Luke representation final sprite art.

## POST_BATTLE_LINE_VARIETY_STATUS

- Generic Luke victory lines: 60.
- Random selection: LIVE.
- Near-repeat suppression: previous 8 exact lines excluded.
- Special progression narration remains authoritative where already implemented.
- v0.50 victory results are additive and do not replace the existing Luke character banter system.

## CHECKPOINT_HISTORY

- v0.16: first inn interior.
- v0.17: item-shop interior.
- v0.18: Royal Capital visual-density pass.
- v0.19: field visual-density pass.
- v0.20: forest atmosphere pass.
- v0.21: battle depth/impact pass.
- v0.22: original chest presentation.
- v0.23: temple lobby interior.
- v0.24: contextual building guidance.
- v0.25: original field enemy vectors.
- v0.26: original forest enemy vectors.
- v0.27: original deep-forest enemy vectors.
- v0.28: title/prologue presentation.
- v0.29: map-arrival polish.
- v0.30: iPhone/PWA shell.
- v0.31: shop/equipment/DEF system.
- v0.32: full adventure menu.
- v0.33: mist-trail enemy vectors.
- v0.34: observation-zone enemy vectors.
- v0.35: evacuation-route enemy vectors.
- v0.36: cliff-road enemy vectors.
- v0.37: inn overnight presentation.
- v0.38: field herb use from menu.
- v0.39: demon-army route visual identity.
- v0.40: explicit equipment switching from adventure menu.
- v0.41: original ordinary-NPC CSS chibi silhouettes.
- v0.42: original clue/world prop sprites for eight evidence objects.
- v0.43: evacuation clues + demon-army guard field silhouette.
- v0.44: original terrain tile-art pass / repeated terrain emoji reduction.
- v0.45: interim Luke two-step field movement cadence.
- v0.46: two persistent optional exploration treasure caches.
- v0.47: spoiler-safe investigation clue journal.
- v0.48: console-style battle command glyph/UI pass.
- v0.49: equipment sell-back flow.
- v0.50: victory results / reward / level-up presentation.

## KNOWN_ISSUES

- Luke field character still uses interim CSS rather than formal four-direction artwork.
- Leon/Glenn dialogue images remain interim SVGs; Eleanor/Elisia formal portraits are not integrated.
- Some NPCs/environment/story markers still use emoji or CSS placeholders; visual replacement remains ongoing.
- CSS-drawn ordinary NPCs/props/terrain are a meaningful quality step but are not equivalent to final high-fidelity generated/raster sprite sheets where the directive ultimately requires them.
- Some later/other enemy groups may still use placeholders outside the 21 already-covered regional designs.
- Shop purchase currently auto-equips newly purchased weapon/armor; explicit re-equip is available from the adventure menu and optional gear can now be sold if unequipped.
- Equipment/save migration is lightweight; an explicit save schema version/migration layer remains desirable.
- PWA/service worker is implemented but not real-device verified on Owner iPhone.
- No dedicated automated browser/touch regression suite exists.
- `wins` remains a global victory count rather than separated progression/stat counters.
- North continuation beyond the existing story frontier remains intentionally unopened.
- Patch chain is now v0.8→v0.50 and is maintenance debt. Do NOT consolidate until a safe tested migration/checkpoint is prepared; gameplay/player-visible progress still has priority.

## BLOCKERS

- No blocker for continued code/world/UI/content development.
- Formal four-direction Luke field images remain unavailable without approved directional source art; do not fabricate completion with mirroring/guessing.
- Formal Leon/Glenn/Eleanor/Elisia art requires generation/approval/integration work and must not be represented by low-quality substitute art as final.
- Real-device iPhone verification remains external to this runtime.

## NEXT_ACTION

Continue from fresh HEAD with player-visible PS1-early quality escalation. Highest-value safe work is to keep removing prototype/emoji presentation, improve equipment/shop comparison clarity and battle/world feedback, and add exploration depth without advancing hidden story canon or waiting for blocked formal character-art work.

## NEXT_ACTION_COMPLETION_CONDITION

1. At least one additional visible gameplay/presentation improvement is checkpointed beyond v0.50.
2. Existing movement-stop safety, four-direction logic, physical interiors, shop/equipment/sell flow, menu/clue journal, treasure persistence, battle rewards, 60-line banter, story flags and save behavior remain intact.
3. New JS validates in the Pages workflow and final latest Pages deployment succeeds.
4. CURRENT remains an autosave checkpoint rather than a stop trigger; continue after this sync while execution capacity remains.

## SESSION_WORK_ITEMS_COMPLETED

- HEAD-first crash recovery from stale CURRENT to v0.41 reality.
- Explicit equipment switching recovery.
- Ordinary NPC placeholder reduction.
- 11 evidence/clue prop visual replacements plus demon guard silhouette.
- Terrain emoji reduction and original CSS terrain-art pass.
- Interim Luke movement cadence polish without mislabeling it as formal art.
- Two persistent optional treasure caches.
- Spoiler-safe investigation clue journal.
- Battle command UI de-emoji / console glyph pass.
- Shop equipment sell-back flow.
- Dedicated victory results and level-up presentation.
- Final v0.50 Pages validation/deploy SUCCESS.

## SESSION_NEXT_AVAILABLE_WORK

- Shop projected-stat comparison before purchase.
- More placeholder/NPC/environment visual replacement.
- Further battle background/image-quality escalation without changing mechanics.
- More optional treasure/environment interactions.
- Additional readable dungeon-like exploration branches that do not advance locked story frontier.
- Save-schema version/migration hardening after player-visible priorities.
- Formal four-direction Luke sprite when approved source art exists.
- Formal Leon/Glenn portrait integration when approved/generated assets exist.

## DO_NOT_REPEAT

- Do not make the starting exit ambiguous again.
- Do not return Luke to permanently front-facing movement.
- Do not call interim CSS/SVG major-character art formal final art.
- Do not use face-only major-character art as final presentation.
- Do not claim formal image integration unless the public game actually references the approved asset.
- Do not generate/substitute an unapproved Luke design while formal canon exists.
- Do not reduce the victory-line pool below approximately 50 or remove near-repeat protection without Owner approval.
- Do not regress central movement-stop safety, keyboard/touch movement, collision, battle rewards, level-up, herbs, guard/escape, world return, objectives, clue flags or save behavior.
- Do not copy existing-game characters, maps, text, UI, music, images or protected assets.
- Do not reveal Glenn's family relation to Luke, Elisia's full history, Eleanor's full crime, or Demon-King succession secrets yet.
- Do not start the Glenn boss fight or open the north story continuation casually; the existing story frontier remains intentional.
- Do not reorder the numerical patch injection chain accidentally.
- Do not treat CURRENT update, commit, successful deploy, or completion of one NEXT_ACTION as a reason to stop development.

## IMPORTANT_DESIGN_DECISIONS

- Detailed quality authority is `AUTONOMOUS_DEV_DIRECTIVE.md`.
- Visual target remains PS1-early high-quality 2D JRPG, implemented concretely through density, interiors, original art, transitions, readable UI, physical evidence props, battle result presentation and character presentation rather than an abstract label.
- GitHub fresh HEAD is implementation reality; CURRENT is operational autosave/handoff.
- Commit safe completion units frequently so interrupted runs resume from latest HEAD.
- CURRENT update is not a reason to stop development.
- Main-character dialogue art is full-body/body-dominant; field sprites are a separate four-direction layer.
- Formal raster assets may use optimized `.webp.b64` transport; only approved/formal character art may replace interim major-character art.
- Original inline SVG/CSS is acceptable for original enemies/environment/interim ordinary NPC presentation when it produces meaningful in-game quality and is actually integrated, but it must not be mislabeled as final formal major-character art.
- Player guidance, map readability, exploration reward, mystery-evidence readability and touch-safe interaction are first-class quality requirements.
- Functional systems and visible player improvements outrank pure refactoring.
- PWA shell is progressive enhancement; browser playability must remain intact.

## STORY_CANON_ADDED_OR_CHANGED

- No core story canon changed in v0.40-v0.50.
- Investigation journal only records evidence already discoverable from existing flags/dialogue; it does not explain the hidden reason behind Glenn's behavior.
- No Glenn-family / Elisia full-history / Eleanor crime / Demon-King succession secret was revealed.
- Existing story frontier remains unresolved and the first chapter is not marked complete.
