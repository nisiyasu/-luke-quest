# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 15:22 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `f1e79d12c8a847e64e25e3380acea5219debd2d0` (v0.10 Pages injection + validation; this CURRENT checkpoint is committed immediately after it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 3 BATTLE + Phase 5 VISUAL QUALITY / Owner Priority C completed → Priority D next
- CURRENT_BUILD_STATUS: PLAYABLE / v0.10 regional battle presentation deployed / GitHub Pages deploy SUCCESS

## MANDATORY_BOOT_FILES

Read these fresh before the next mutation:
1. `CURRENT.md`
2. `index.html`
3. `ux-v08.js`
4. `ux-v09.js`
5. `ux-v10.js`
6. `.github/workflows/pages.yml`
7. `assets/portraits/` directory state
8. recent commits / Pages workflow state

Important: repository `index.html` remains the rollback-safe v0.7 core. Pages injects presentation patches in this exact order: `ux-v08.js` → `ux-v09.js` → `ux-v10.js`. Do not remove, reorder, or duplicate these injections accidentally.

## WHAT_CHANGED_THIS_SESSION

1. Booted from fresh GitHub state and confirmed default branch = `main` instead of assuming it.
2. Read fresh `CURRENT.md`, `index.html`, `ux-v08.js`, `ux-v09.js`, workflow config, recent commits, and current Pages state before mutation.
3. Followed prior NEXT_ACTION and Owner Priority C rather than expanding story content.
4. Added `ux-v10.js`, a battle-presentation-only layer that preserves the existing battle rules and enemy data.
5. Rebuilt the visible battle screen into a clearer SFC-late / PS1-early-inspired layout with a dedicated battlefield scene, enemy stage, enemy plate, numeric HP, HP bar, player status strip, and 2x2 command grid.
6. Added regional CSS battle backgrounds for field, forest, mist trail, military/evacuation zones, and cliff road so encounters visually reflect the current map.
7. Enlarged the enemy presentation substantially while keeping current emoji enemy art as explicit interim art rather than pretending it is final illustration quality.
8. Added visible damage/heal/guard/escape-failure feedback overlays.
9. Preserved Attack / Guard / Herb / Escape commands and underlying reward, level-up, encounter grace, defeat, victory, escape, and world-return logic.
10. Added `stopMoving()` at battle rendering to keep the previous movement-loop fix protected.
11. Updated the Pages workflow to run `node --check` on `ux-v08.js`, `ux-v09.js`, and `ux-v10.js` before injection/deployment.
12. Updated Pages injection order to include `ux-v10.js` after `ux-v09.js`.
13. GitHub Pages run `33949549698` completed successfully. Validation, all three injections, upload, and deployment all passed.

## FILES_CHANGED

- `ux-v10.js` — regional battle background, enemy/HP presentation, command hierarchy, visible action feedback
- `.github/workflows/pages.yml` — JavaScript syntax validation + deterministic v0.10 injection
- `CURRENT.md` — persistent checkpoint

## NEW_ASSETS

- No new binary or raster assets were added this session.
- v0.10 uses original CSS presentation and the existing enemy data/emoji as interim art.
- No final enemy illustration is claimed.

## TESTS_AND_VERIFICATION

- Fresh repository metadata confirmed default branch = `main`.
- Fresh GitHub retrieval confirmed `ux-v10.js` exists on `main`; blob SHA `d6620a62429c21057c6349f3b794faed46252693`.
- Pages workflow run `33949549698` completed with conclusion `success`.
- Workflow `Validate presentation patches` step passed, executing `node --check` for `ux-v08.js`, `ux-v09.js`, and `ux-v10.js`.
- Workflow steps confirmed successful: Checkout, Configure Pages, Validate presentation patches, Inject v0.8, Inject v0.9, Inject v0.10, Upload site, Deploy to GitHub Pages, Post Checkout, Complete job.
- Static compatibility check: v0.10 wraps existing `attack`, `guard`, `potion`, and `runAway` functions instead of replacing their mechanics; original state transitions remain authoritative.
- Real iPhone visual/touch confirmation still requires Owner-device testing.

## PLAYER_GUIDANCE_IMPROVEMENTS

- v0.8 guidance remains active and was not regressed.
- Starting town still has persistent objective text directing the player south to the yellow `出口↓`.
- `南門の案内兵` remains beside the exit.
- Adventure memo still shares the progression guidance source.

## DIALOGUE_VISUAL_PROGRESS

- v0.9 portrait-capable dialogue architecture remains LIVE.
- Luke, Leon, and Glenn portrait assets remain referenced and unchanged.
- No dialogue visual regression was introduced by v0.10.
- Current SVG portraits remain interim v1 art, below the final Owner-requested high-fidelity level.

## BATTLE_VISUAL_PROGRESS

- Regional battlefield backgrounds are now LIVE.
- Enemy display is substantially larger and placed on a dedicated stage.
- Enemy HP now shows both a bar and exact numeric HP.
- Player LV / HP / ATK / herbs / EXP are grouped into a clearer command panel.
- Commands are now presented as a stable 2x2 grid.
- Damage, healing, guard, and failed escape now produce visible floating feedback.
- Current enemy art is still emoji/interim art; final generated enemy illustrations remain pending.

## MAP_READABILITY_IMPROVEMENTS

- v0.8 high-contrast town exit landmark remains active.
- Persistent objective guidance remains active.
- No map readability work was removed or weakened this session.
- Owner Priority D is now the next visual focus.

## KNOWN_ISSUES

- Enemy sprites remain emoji placeholders rather than final SFC-late / PS1-early quality original enemy illustrations.
- Luke / Leon / Glenn portrait SVGs remain v1 interim art and are not yet the polished illustration quality Owner ultimately wants.
- Most field/NPC graphics still use CSS + emoji placeholders.
- Capital buildings remain exterior collision objects; interiors are not implemented yet.
- No dedicated automated browser/touch regression suite exists yet.
- `wins` remains a global battle victory count rather than separated progression/statistics counters.
- Battle return state still relies on current map/tile state rather than a separate encounter-state object.
- The north continuation beyond `北の崖道` remains intentionally unopened.
- Build-time presentation is now three injected layers; consolidation should wait until real-device stability is confirmed.

## BLOCKERS

- None for continued code, world, battle, UI, or map-readability development.
- Real-device iPhone confirmation remains external to this runtime.
- High-fidelity generated raster art still lacks a verified binary write path through the current GitHub text-file connector. Repository-safe CSS/SVG remains the verified integration route unless a binary path is explicitly available and tested.

## NEXT_ACTION

Owner Priority D: improve map readability and visual hierarchy without expanding the story frontier. Start with `王都アルディア` and `王都近郊`: make roads/paths visually distinct from generic ground, strengthen the south-gate landmark and town-to-field visual flow, add clearer environmental landmarks, and reduce the placeholder/flat-tile feeling while preserving all current collision coordinates, NPC positions, exit behavior, objective HUD, portrait dialogue, battle system, and movement fail-safes. Prefer repository-safe CSS/SVG techniques unless a verified binary asset path exists.

## NEXT_ACTION_COMPLETION_CONDITION

The next action is complete only when:
1. A first-time player can visually identify the intended town route to the south exit without relying only on text.
2. `王都アルディア` has visibly differentiated traversable roads/paths and landmarks compared with v0.10.
3. `王都近郊` has clearer path/terrain hierarchy and the route toward the forest is easier to read.
4. Existing collision, NPC placement, south-gate transition, objective HUD, keyboard/touch movement, encounter rules, v0.9 portraits, and v0.10 battle presentation remain intact.
5. JavaScript validation passes.
6. GitHub Pages deployment succeeds.
7. `CURRENT.md` is updated and fresh-retrieved again.

## DO_NOT_REPEAT

- Do not make the starting exit visually ambiguous again.
- Do not remove persistent objective guidance without an equivalently clear navigation system.
- Do not bind movement-stop responsibility only to directional button DOM nodes that `render()` destroys.
- Do not allow movement timers to survive world→battle/dialogue/menu/background transitions.
- Do not remove centralized `stopMoving()` / global pointer-release safety without an equivalently robust replacement.
- Do not remove encounter grace without an equivalent anti-chain-encounter mechanism.
- Do not regress keyboard movement, battle rewards, level-up, potion/guard/escape, HP display, or world return.
- Do not change battle rules merely to improve presentation.
- Do not return to menu-only location selection as the main exploration model.
- Do not replace physical traversal with static story cards.
- Do not copy maps, sprites, UI, text, music, enemies, characters, or art from an existing game.
- Do not treat emoji/CSS/SVG interim art as final when it is not final.
- Do not claim generated raster assets were integrated unless actual repository files exist and the playable build references them.
- Do not reveal Glenn's relation to Luke, Elisia, or the Demon-King succession conflict yet.
- Do not reveal Elisia's full history through Leon at this stage.
- Do not start the Glenn boss fight yet.
- Do not remove or reorder the v0.8 → v0.9 → v0.10 Pages injection chain without intentionally testing it.

## IMPORTANT_DESIGN_DECISIONS

- Visual target remains `SFC後期〜PS1初期の高品質2D JRPG`, not full 3D.
- Player guidance remains a core quality requirement.
- Field sprites and dialogue portraits remain separate presentation layers.
- Portrait contract remains key-based (`luke`, `leon`, `glenn`) with expression and side extensibility.
- Original CSS/SVG is an acceptable repository-safe interim visual format when binary transport is unavailable.
- Final art quality must still be improved later; technical integration success must not be confused with final visual fidelity.
- Battle presentation is regional and map-aware but battle mechanics remain owned by the core logic.
- Exploration remains top-down, tile/coordinate based with physical exits.
- Mobile-first touch controls and movement-stop safety remain protected infrastructure.
- Future visual upgrades should increasingly reduce placeholder appearance without destabilizing playability.

## STORY_CANON_ADDED_OR_CHANGED

- No story canon changed this session.
- No new secret was revealed.
- Leon's second cliff-road encounter remains the current story frontier.
- Glenn's hidden family relation, Elisia's deeper history, and the Demon-King succession conflict remain unrevealed.
- The first chapter remains unresolved.
