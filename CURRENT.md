# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 18:42 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `ced33745235f1dedf6b50d388abf32cf0f74ef7d` (v0.39 implementation/deploy-workflow checkpoint immediately before this CURRENT autosave)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / v0.39 source checkpointed / latest Pages validation-deploy is being verified after this autosave

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

`index.html` remains rollback-safe v0.7 core. Pages injects presentation/gameplay patches in numerical order. Current chain is v0.8 → v0.39.

## WHAT_CHANGED_THIS_SESSION

1. Recovered from fresh `main` HEAD rather than relying on stale CURRENT v0.15 state.
2. Added first physical building interior: `南門宿・一階` with doorway entry/exit, collisions, props, innkeeper and functional rest service.
3. Added second physical building interior: `ミナの道具屋` with doorway entry/exit, props and indoor shop interaction.
4. Added third physical building interior: `王国神殿・礼拝堂` with altar, novice, readable props, stained-glass/light presentation, and locked inner sanctum without revealing hidden canon.
5. Added contextual A-button prompts and local interior guidance so doors/services/chests are easier to understand.
6. Increased 王都 visual density with fountain, market stalls, flower beds, lamps, banners, signs and richer tile treatment.
7. Increased 王都近郊 visual density with grass tufts, flowers, stones, route signpost, milestone and road guidance.
8. Increased 魔物の森 / 深部 atmosphere with canopy shadow, light shafts, logs, mushrooms, leaf litter and trail clues.
9. Added demon-army visual identity to observation/evacuation routes with banners, barricades, torches, supply crates and withdrawal footprints.
10. Upgraded battle presentation with layered regional depth, ground shadow, particles, hit pulse, command feedback and low-HP danger treatment.
11. Replaced the field treasure chest emoji with an original CSS-drawn wooden/gold chest while preserving one-time reward/save behavior.
12. Added original lightweight vector battle art for 21 regional enemies across field, forest, deep forest, mist trail, observation zone, evacuation route and cliff-road groups. These are original LUKE QUEST designs, not copied game assets.
13. Upgraded title/prologue presentation with an original crest, layered sky/mountains, chapter branding and cinematic intro framing.
14. Added map-arrival fade/name presentation and battle arrival flash.
15. Added PWA shell: manifest, original app icon, service worker, iPhone safe-area/standalone metadata and touch shell polish.
16. Upgraded Mina's shop from single-click herb purchase to a real shop panel with 薬草, 青銅の剣 and 革の旅装.
17. Added persistent weapon/armor ownership and a real DEF stat. Enemy damage now applies DEF before guard reduction.
18. Replaced the simple adventure memo with a full JRPG adventure menu showing HP/ATK/DEF/GOLD, level/EXP, objective, location, equipment, items, wins and manual save.
19. Added short night-to-morning inn rest presentation.
20. Added field use of 薬草 from the adventure menu.
21. Simplified workflow validation/injection into ordered loops while keeping deterministic v0.8→latest ordering.

## FILES_CHANGED

- `ux-v16.js` through `ux-v39.js`
- `.github/workflows/pages.yml`
- `manifest.webmanifest`
- `sw.js`
- `assets/app-icon.svg`
- `CURRENT.md`

## NEW_ASSETS

- `assets/app-icon.svg` — original LUKE QUEST shield/sword app icon.
- Original inline vector battle art embedded in v0.25/v0.26/v0.27/v0.33/v0.34/v0.35/v0.36 for 21 enemies.
- No new formal major-character portrait was fabricated. Owner-approved Luke full-body WebP remains authoritative.

## TESTS_AND_VERIFICATION

- Fresh repository metadata/default branch confirmed `main`.
- Fresh HEAD recovery detected CURRENT was behind repository reality and development continued from HEAD.
- Each new `ux-vNN.js` is included in GitHub Actions `node --check` validation before deployment once its workflow checkpoint is committed.
- PWA manifest is JSON-parsed in CI; service worker receives `node --check`; app icon presence is validated.
- Existing base64 raster transport probe and approved Luke WebP signature checks remain in CI.
- Multiple intermediate Pages runs completed successfully during this build chain; latest v0.39 workflow/source checkpoint will be fresh-verified after this CURRENT autosave.
- Real-device iPhone visual/touch confirmation is still Owner-device testing and is NOT claimed as passed.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Existing objective HUD and initial exit guidance remain.
- Town/field route landmarks remain.
- Buildings now have physical entrances instead of service-only outdoor NPC interactions.
- Facing a usable door/service/chest can display an A-button contextual hint.
- Interior objective text explains how to use the current facility and how to leave.
- Adventure menu keeps the main story objective visible independent of current interior location.

## DIALOGUE_VISUAL_PROGRESS

- Owner-approved formal Luke full-body dialogue art remains integrated and authoritative.
- Dialogue portrait shell remains body-dominant rather than face-only.
- Leon and Glenn still use interim SVG dialogue art and are NOT formalized.
- Temple interior adds story-space presentation without prematurely revealing hidden family/canon secrets.

## BATTLE_VISUAL_PROGRESS

- Regional battle framing/background treatment, large enemy stage, HP display, 2x2 commands and action feedback remain.
- v0.21 adds environmental depth, particles, enemy hit pulse and low-HP danger styling.
- 21 regional enemies now have original vector battle art instead of emoji placeholders in their covered encounter groups.
- Battle system now displays DEF and applies DEF reduction to enemy damage.
- Victory banter remains 60 randomized Luke lines with last-8 exact repeat suppression.

## MAP_READABILITY_IMPROVEMENTS

- 王都: fountain, market stalls, lamps, flower beds, signs, banners and stronger visual hierarchy.
- 王都近郊: signpost, milestone, road/grass details, flowers, stones and route framing.
- 魔物の森/深部: layered canopy, light, logs, mushrooms, leaf patches and trail clue.
- 監視区域/退避路: military banners, barricade, torch, crates and withdrawal footprints establish readable identity.
- Three Royal Capital interiors now provide physical indoor spaces rather than abstract services.

## CHARACTER_CANON_STATUS

- Luke formal dialogue image: Owner-approved blue-haired / blue-cloak / silver-armor / gold-accent full-body design remains live.
- Luke field direction logic: 4/4 directions live.
- Luke field artwork: still interim CSS and NOT formal directional art.
- Leon and Glenn formal visual art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body dialogue art: INTEGRATED.
- Luke old interim SVG remains only as fallback path.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.
- Eleanor / Elisia formal art: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction logic: 4/4 LIVE (`up`, `down`, `left`, `right`) using authoritative `s.dir`.
- Luke formal four-direction field art: NOT YET INTEGRATED.
- Leon/Glenn formal four-direction field art: NOT YET IMPLEMENTED.
- Do not call current CSS representation final sprite art.

## POST_BATTLE_LINE_VARIETY_STATUS

- Generic Luke victory lines: 60.
- Random selection: LIVE.
- Near-repeat suppression: previous 8 exact lines excluded.
- Special progression narration remains authoritative where already implemented.

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

## KNOWN_ISSUES

- Luke field character still uses interim CSS rather than formal four-direction artwork.
- Leon/Glenn dialogue images remain interim SVGs; Eleanor/Elisia formal portraits are not integrated.
- NPC and many environment objects still use emoji/CSS placeholders; visual replacement remains ongoing.
- Later/other enemy groups not represented by the 21 newly covered vector designs may still use emoji placeholders.
- Shop currently auto-equips a newly purchased weapon/armor and has no explicit re-equip/sell flow yet.
- Equipment stat migration is lightweight; a future explicit save schema version/migration layer is desirable.
- PWA/service worker is implemented but not real-device verified on Owner iPhone.
- No dedicated automated browser/touch regression suite exists.
- `wins` remains a global victory count rather than separated progression/stat counters.
- North continuation beyond the existing story frontier remains intentionally unopened.
- Patch chain is now v0.8→v0.39 and is maintenance debt. Do NOT consolidate until a safe tested migration/checkpoint is prepared; gameplay progress has priority.

## BLOCKERS

- No blocker for continued code/world/UI/content development.
- Formal four-direction Luke field images remain unavailable without approved directional source art; do not fabricate completion with mirroring/guessing.
- Formal Leon/Glenn/Eleanor/Elisia art requires generation/approval/integration work and must not be represented by low-quality substitute art as final.
- Real-device iPhone verification remains external to this runtime.

## NEXT_ACTION

Continue player-visible quality from fresh HEAD. Highest-value next work is to improve remaining placeholder-heavy world/NPC visuals and/or add safe gameplay depth (equipment management, additional treasure/interactions, map atmosphere) while preserving all v0.8→v0.39 behavior. Do not wait for character-art blockers when independent world/battle/UI work is available.

## NEXT_ACTION_COMPLETION_CONDITION

1. At least one additional player-visible improvement is implemented and checkpointed.
2. Existing movement safety, physical interiors, shop/equipment, menu, battle, save, guidance and story flags remain intact.
3. New JS validates in Pages workflow and latest Pages deployment succeeds.
4. CURRENT is treated as autosave, not a session-end trigger; after syncing it, continue if execution capacity remains.

## SESSION_WORK_ITEMS_COMPLETED

- Three physical building interiors.
- Major town/field/forest/military-route visual-density improvements.
- Battle presentation upgrade.
- Original vector enemy art across 21 enemies.
- Original chest presentation.
- Contextual player guidance.
- Title/prologue presentation upgrade.
- Map transition presentation.
- PWA/iPhone shell.
- Real shop panel, equipment, DEF system.
- Full adventure menu and field item use.
- Inn overnight presentation.

## SESSION_NEXT_AVAILABLE_WORK

- More placeholder/NPC visual replacement.
- Explicit equipment re-equip flow and later sell flow.
- More treasure/environment interactions.
- Additional field/map landmarks and readable dungeon-like branches.
- Further battle effects/status depth.
- Formal four-direction Luke sprite when approved source art exists.
- Formal Leon/Glenn portrait integration when approved/generated assets exist.

## DO_NOT_REPEAT

- Do not make the starting exit ambiguous again.
- Do not return Luke to permanently front-facing movement.
- Do not call interim CSS/SVG major-character art formal final art.
- Do not use face-only major-character art as final presentation.
- Do not claim formal image integration unless public game actually references the approved asset.
- Do not generate/substitute an unapproved Luke design while formal canon exists.
- Do not reduce the victory-line pool below approximately 50 or remove near-repeat protection without Owner approval.
- Do not regress central movement-stop safety, keyboard/touch movement, collision, battle rewards, level-up, herbs, guard/escape, world return, objectives or save behavior.
- Do not copy existing-game characters, maps, text, UI, music, images or protected assets.
- Do not reveal Glenn's family relation to Luke, Elisia's full history, Eleanor's full crime, or Demon-King succession secrets yet.
- Do not start the Glenn boss fight yet unless story frontier is intentionally advanced under existing canon.
- Do not reorder the numerical patch injection chain accidentally.

## IMPORTANT_DESIGN_DECISIONS

- Detailed quality authority is `AUTONOMOUS_DEV_DIRECTIVE.md`.
- Visual target remains PS1-early high-quality 2D JRPG, implemented concretely through density, interiors, original art, transitions, readable UI and character presentation rather than an abstract label.
- GitHub fresh HEAD is implementation reality; CURRENT is operational autosave/handoff.
- Commit safe completion units frequently so interrupted runs resume from latest HEAD.
- CURRENT update is not a reason to stop development.
- Main-character dialogue art is full-body/body-dominant; field sprites are a separate four-direction layer.
- Formal raster assets may use optimized `.webp.b64` transport; only approved/formal character art may replace interim major-character art.
- Original inline SVG is acceptable for original enemy/environment art when it produces meaningful in-game quality and is actually integrated.
- Player guidance and map readability are first-class quality requirements.
- Functional systems and visible player improvements outrank pure refactoring.
- PWA shell is progressive enhancement; browser playability must remain intact.

## STORY_CANON_ADDED_OR_CHANGED

- No core story canon changed.
- Temple lobby only visualizes already-established勇者選定、水晶異常 and existing novice uncertainty; it does not reveal hidden causes.
- No Glenn-family / Elisia full-history / Eleanor crime / Demon-King succession secret was revealed.
- Existing story frontier remains unresolved and the first chapter is not marked complete.
