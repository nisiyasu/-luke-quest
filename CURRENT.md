# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 13:29 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `97dd3d5c3bbe68c5ff4465aff15f214bc8d5b207` (v0.8 Pages injection + UX/world patch; this CURRENT checkpoint is committed immediately after it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 4 CONTENT + OWNER UX Priority A
- CURRENT_BUILD_STATUS: PLAYABLE / v0.8 / GitHub Pages deploy SUCCESS

## MANDATORY_BOOT_FILES

Read these fresh before the next mutation:
1. `CURRENT.md`
2. `index.html`
3. `ux-v08.js`
4. `.github/workflows/pages.yml`
5. recent commits / Pages workflow state

Important: v0.8 is deployed by build-time injection. The repository `index.html` remains the rollback-safe v0.7 core, while `.github/workflows/pages.yml` injects `<script src="ux-v08.js"></script>` into the deployed artifact before upload. Do not accidentally remove or duplicate this injection without intentionally folding the patch into the core.

## WHAT_CHANGED_THIS_SESSION

1. Booted from fresh GitHub state and confirmed default branch = `main`.
2. Read fresh `CURRENT.md`, `index.html`, and Pages workflow before mutation.
3. Applied the Owner UX priority that the initial town exit was not discoverable enough.
4. Added an always-visible in-world `目的` guidance bar that changes by map/progression state.
5. Changed the two town exit gate tiles into a highly visible animated yellow `出口↓` marker in the deployed build.
6. Added a `南門の案内兵` immediately beside the town exit route; he explicitly tells the player where to leave the city.
7. Added a one-time `冒険ガイド` when a player reaches/continues in the starting town, telling them to move south to the yellow exit and use the top objective bar / adventure memo if lost.
8. Added a post-exit message that immediately explains the next objective: win two field battles and head northeast to the monster forest.
9. Preserved the centralized touch movement stop architecture and all global release/blur/background fail-safes.
10. Completed the previous story NEXT_ACTION instead of abandoning it: the northern evacuation-route gate now physically opens into a distinct walkable `北の崖道` after the withdrawal evidence is found.
11. Added a 30x24 `北の崖道` map with collision terrain, scrolling, return traversal, and regional encounters.
12. Added cliff-road enemies: `崖風コウモリ`, `岩角ヤギ`, `裂谷ワシ`.
13. Added a second physical Leon encounter in the traversable world.
14. Leon now says his fear is real but that returning to the capital would endanger the inn people and training companions; he refuses to identify the exact threat because he believes telling Luke would put Luke in danger too.
15. Preserved the intended mystery: Glenn's family connection, Elisia's full truth, and the Demon-King succession conflict remain unrevealed; no Glenn boss fight starts.
16. Increased enemy visual size in the v0.8 presentation layer as a small first Battle Visual improvement.
17. Implemented v0.8 as `ux-v08.js` plus deterministic Pages artifact injection so the known-good v0.7 core remains easy to roll back while UX changes are validated.
18. GitHub Pages workflow run `33944599633` completed the injection, upload, and deployment steps successfully.

## FILES_CHANGED

- `ux-v08.js` — new v0.8 UX guidance, map/presentation patch, cliff-road content and second Leon event
- `.github/workflows/pages.yml` — injects `ux-v08.js` into the deployed `index.html` artifact before Pages upload
- `CURRENT.md` — this persistent handoff/checkpoint

## NEW_ASSETS

- No binary/generated character portrait assets were added this session.
- New visuals are code/CSS presentation improvements and emoji placeholders only.
- Do not claim the requested high-quality conversation portraits are done yet.

## TESTS_AND_VERIFICATION

- Fresh repository metadata confirmed default branch = `main`.
- `ux-v08.js` passed local `node --check` before repository write.
- Patch presence was fresh-retrieved after creation and includes the town exit guide, objective bar, cliff map, Leon second encounter, and cliff enemy pool.
- Pages workflow injection step `Inject v0.8 UX/world patch` completed with `success`.
- Pages workflow steps Checkout, Configure Pages, Inject v0.8 UX/world patch, Upload site, Deploy to GitHub Pages, Post Checkout, and Complete job all completed with `success` in run `33944599633`.
- Cliff-road map was designed as exactly 30 columns x 24 rows in the prepared candidate.
- Real iPhone touch behavior and visual legibility still require owner-device confirmation; movement fail-safes were not removed.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Starting town now has a persistent objective: `南へ進み、黄色い「出口」から王都近郊へ`.
- Town exit visually displays `出口↓` rather than looking like an anonymous floor/gate tile.
- A `南門の案内兵` stands beside the exit approach and explicitly gives the route.
- First-time town guidance tells the player to move south and explains where to re-check the goal.
- Each major current map now exposes a context-sensitive objective in the playfield.
- Adventure memo now uses the same objective source as the HUD so the two cannot drift as easily.

## DIALOGUE_VISUAL_PROGRESS

- High-quality character portraits requested by Owner are NOT yet integrated.
- Dialogue remains text-window + map-character presentation in v0.8.
- Priority B remains: build portrait-capable dialogue UI and integrate real original Luke / Leon / Glenn images when a verified asset-to-repository path is available.

## BATTLE_VISUAL_PROGRESS

- Enemy display size is increased in the v0.8 presentation layer.
- Full battle background, high-quality enemy art, damage-number animation, and polished command UI remain pending.

## MAP_READABILITY_IMPROVEMENTS

- Town exit is now a high-contrast animated landmark.
- Persistent objective text gives directional semantics to each map rather than relying only on tile interpretation.
- Cliff road uses a distinct terrain palette and physical north/south transitions.

## KNOWN_ISSUES

- Conversation portraits are still not the requested high-quality art level.
- Most field/NPC/enemy graphics remain CSS + emoji placeholders rather than SFC-late / PS1-early quality sprites.
- Capital buildings remain exterior collision objects; interiors are not implemented yet.
- No dedicated automated browser/touch regression suite exists yet.
- `wins` remains a global battle victory count rather than separated progression/statistics counters.
- Battle return state still relies on current map/tile state instead of a separate encounter-state object.
- The north continuation beyond `北の崖道` is intentionally not open yet.
- v0.8 currently uses build-time injection rather than folding all changes directly into `index.html`; this is deliberate rollback isolation, but future refactoring should eventually consolidate once stable.

## BLOCKERS

- None for continued code/world/story/UX development.
- Real-device iPhone confirmation remains external to this runtime.
- High-quality generated portrait integration is not yet verified end-to-end as an actual repository asset workflow; do not fabricate asset completion.

## NEXT_ACTION

Owner Priority B: upgrade dialogue presentation toward the target `SFC後期〜PS1初期の高品質2D JRPG`. First create a portrait-capable dialogue component that supports speaker name + left/right portrait slot + future expression variants without breaking existing dialogue. Integrate it first for Luke / Leon / Glenn using real repository assets if a verified image-generation/upload path is available; if binary asset transport is still unavailable, build and test the portrait UI/asset contract with clearly marked temporary placeholders, preserve hooks for actual images, and do not pretend the final art is complete. Keep the newly fixed town guidance intact.

## NEXT_ACTION_COMPLETION_CONDITION

The next action is complete only when:
1. Existing dialogue still works on iPhone-sized layouts.
2. Dialogue component can display a portrait separately from the small field sprite.
3. Luke, Leon, and Glenn each have a stable portrait asset key / slot architecture.
4. If real generated files can be committed, at least Luke is visibly integrated first and the file/path is verified in GitHub/Pages.
5. If real images cannot be committed, the UI contract is shipped with explicit temporary art state and CURRENT documents the exact blocker.
6. Town `出口↓`, objective HUD, guide NPC, and movement fail-safes do not regress.
7. GitHub Pages deployment succeeds.
8. `CURRENT.md` is updated and fresh-retrieved again.

## DO_NOT_REPEAT

- Do not make the starting exit visually ambiguous again.
- Do not remove the persistent objective guidance without an equivalently clear navigation system.
- Do not bind movement-stop responsibility only to directional button DOM nodes that `render()` destroys.
- Do not allow movement timers to survive world→battle/dialogue/menu/background transitions.
- Do not remove centralized `stopMoving()` / global pointer-release safety without an equivalently robust replacement.
- Do not remove encounter grace without an equivalent anti-chain-encounter mechanism.
- Do not regress keyboard movement, battle rewards, level-up, potion/guard/escape, or HP display.
- Do not return to menu-only location selection as the main exploration model.
- Do not replace physical traversal with static story cards.
- Do not copy maps, sprites, UI, text, music, enemies, characters, or art from Dragon Quest or another existing game.
- Do not treat emoji/CSS placeholder art as final.
- Do not claim image assets were generated/integrated unless actual repository files exist and the playable build references them.
- Do not reveal Glenn's relation to Luke, Elisia, or the Demon-King succession conflict yet.
- Do not reveal Elisia's full history through Leon at this stage.
- Do not start the Glenn boss fight yet.

## IMPORTANT_DESIGN_DECISIONS

- Visual target is now explicitly `SFC後期〜PS1初期の高品質2D JRPG`, not PS1-era full 3D.
- Player guidance is a core quality requirement, not optional polish.
- Exploration remains top-down, tile/coordinate based with physical exits.
- World progression continues through walkable transitions rather than location-selection menus.
- Dialogue field sprites and high-quality conversation portraits are separate presentation layers by design.
- Main character portrait priority: Luke → Leon → Glenn → Eleanor → Elisia.
- Battle presentation should improve incrementally without sacrificing iPhone performance or core stability.
- Mobile-first touch controls remain protected infrastructure.
- v0.8 uses a rollback-safe external patch injected only into the Pages artifact; consolidate into core later after validation.

## STORY_CANON_ADDED_OR_CHANGED

- No previously established canon was contradicted or removed.
- Leon is now encountered a second time on the northern cliff road.
- Leon explicitly fears that returning to the capital would endanger people at the inn and his training companions, not only himself.
- Leon refuses to identify the exact threat because he believes Luke would also become a target.
- Leon remains frightened, conflicted, and protective; he has not suddenly become fearless or conventionally heroic.
- Glenn's hidden family relation, Elisia's deeper history, and the Demon-King succession conflict remain unrevealed.
- The first chapter remains unresolved; Leon continues north after the cliff-road encounter.
