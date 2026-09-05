# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 14:26 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `d57ff86dbdcaf750993b6ca8458430f9630ed14f` (v0.9 Pages injection; this CURRENT checkpoint is committed immediately after it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 4 CONTENT + Phase 5 VISUAL QUALITY / Owner Priority B
- CURRENT_BUILD_STATUS: PLAYABLE / v0.9 portrait-capable dialogue deployed / GitHub Pages deploy SUCCESS

## MANDATORY_BOOT_FILES

Read these fresh before the next mutation:
1. `CURRENT.md`
2. `index.html`
3. `ux-v08.js`
4. `ux-v09.js`
5. `.github/workflows/pages.yml`
6. `assets/portraits/` directory state
7. recent commits / Pages workflow state

Important: the repository `index.html` remains the rollback-safe v0.7 core. Pages injects `ux-v08.js` first and `ux-v09.js` second into the deployed artifact. Do not remove, reorder, or duplicate these injections accidentally. v0.9 depends on v0.8 being loaded first.

## WHAT_CHANGED_THIS_SESSION

1. Booted from fresh GitHub state and confirmed default branch = `main` rather than assuming it.
2. Read fresh `CURRENT.md`, `index.html`, `ux-v08.js`, `.github/workflows/pages.yml`, recent commits, and current Pages workflow state before mutation.
3. Followed the prior NEXT_ACTION and Owner Priority B instead of expanding the story again.
4. Added a portrait-capable dialogue presentation layer that keeps field sprites separate from conversation portraits.
5. Added stable portrait asset keys for `luke`, `leon`, and `glenn` with an expression-slot contract (`neutral` now, future variants supported).
6. Added stable speaker-name mapping from `ルーク` / `レオン` / `グレン` to those portrait keys.
7. Added left/right portrait slots: Luke defaults left; Leon and Glenn default right; per-dialogue overrides are supported through `portraitKey`, `expression`, and `side` fields.
8. Added responsive portrait dialogue layout for normal iPhone widths and shorter screens.
9. Added portrait enhancement for both walkable-world dialogue boxes and opening story dialogue cards.
10. Added actual repository portrait assets for Luke, Leon, and Glenn as original SVG illustrations rather than emoji placeholders.
11. Kept the v0.8 starting-town `出口↓`, persistent objective HUD, guide NPC, cliff-road progression, and movement fail-safe architecture untouched.
12. Updated Pages deployment to inject `ux-v09.js` after `ux-v08.js`.
13. GitHub Pages run `33947043222` completed successfully, including both injection steps and deployment.

## FILES_CHANGED

- `assets/portraits/luke.svg` — original Luke conversation portrait v1
- `assets/portraits/leon.svg` — original Leon conversation portrait v1
- `assets/portraits/glenn.svg` — original Glenn conversation portrait v1
- `ux-v09.js` — portrait manifest, dialogue component, responsive presentation, expression/side hooks
- `.github/workflows/pages.yml` — adds deterministic v0.9 injection after v0.8
- `CURRENT.md` — persistent checkpoint

## NEW_ASSETS

- `assets/portraits/luke.svg`
- `assets/portraits/leon.svg`
- `assets/portraits/glenn.svg`

These are real repository assets and the deployed game references them. They are original vector portrait v1 assets, not copied from an existing game.

Important quality note: these SVG portraits are the first non-emoji character-art pass and prove the end-to-end portrait pipeline. They are NOT yet the Owner-requested final high-fidelity illustration level comparable to the earlier polished character images. Do not describe them as final art.

## TESTS_AND_VERIFICATION

- Fresh repository metadata confirmed default branch = `main`.
- `ux-v09.js` passed `node --check` with exit code 0 before checkpoint completion.
- Fresh GitHub retrieval of `ux-v09.js` confirmed portrait keys and asset references are stored on `main`; blob SHA `a128060d39635e373bf2b337630d46c556526536`.
- Fresh directory retrieval confirmed all three portrait files exist on `main`: Luke `f045b3b3f0a4d7e0b597d0bed14d606ca9dfafdb`, Leon `5d3256055c5ff5410c2f6436184ed23e51ebe66a`, Glenn `773ce593cdf72b082cded6e00a20773930f9cc11`.
- Pages workflow run `33947043222` completed with conclusion `success`.
- Workflow steps confirmed successful: Checkout, Configure Pages, Inject v0.8 UX/world patch, Inject v0.9 portrait dialogue patch, Upload site, Deploy to GitHub Pages, Post Checkout, Complete job.
- Real iPhone visual legibility still requires Owner-device confirmation; the layout includes dedicated width/height media rules to reduce overflow risk.

## PLAYER_GUIDANCE_IMPROVEMENTS

- v0.8 guidance remains active and was not regressed.
- Starting town still has persistent objective text directing the player south to the yellow `出口↓`.
- `南門の案内兵` remains beside the exit.
- Adventure memo still shares the same progression guidance source.

## DIALOGUE_VISUAL_PROGRESS

- Portrait-capable dialogue architecture is now LIVE.
- Luke, Leon, and Glenn have stable portrait keys and actual repository assets.
- World dialogue can show a portrait independently of the tiny map sprite.
- Opening story dialogue can also show mapped portraits.
- Left/right placement exists now and future expression variants can be added without redesigning the component.
- Current SVG art is v1 production placeholder art, visibly above emoji-only presentation but below the final requested illustration-quality target.

## BATTLE_VISUAL_PROGRESS

- v0.8 enlarged enemy display remains active.
- Battle background, polished command panel, damage-number animation, and final enemy art remain pending.
- No battle mechanics were changed this session, reducing regression risk.

## MAP_READABILITY_IMPROVEMENTS

- v0.8 high-contrast town exit landmark remains active.
- Persistent objective text remains active.
- No map readability feature was removed or weakened by the dialogue work.

## KNOWN_ISSUES

- The new vector portraits are not yet the final high-detail illustration style requested by Owner.
- Most field/NPC/enemy graphics still use CSS + emoji placeholders rather than SFC-late / PS1-early quality sprites.
- Capital buildings remain exterior collision objects; interiors are not implemented yet.
- No dedicated automated browser/touch regression suite exists yet.
- `wins` remains a global battle victory count rather than separated progression/statistics counters.
- Battle return state still relies on current map/tile state rather than a separate encounter-state object.
- The north continuation beyond `北の崖道` remains intentionally unopened.
- Build-time injection is now two layers (`ux-v08.js` then `ux-v09.js`); consolidation should happen later after real-device stability is confirmed.

## BLOCKERS

- None for continued code, world, battle, or UI development.
- Real-device iPhone confirmation remains external to this runtime.
- Final high-fidelity generated raster portrait integration is still blocked by the current GitHub text-file write connector not providing a verified binary-image upload path from image generation output. SVG assets are therefore the verified repository-safe visual path used in v0.9. Do not fabricate final raster integration.

## NEXT_ACTION

Owner Priority C: upgrade the battle presentation without changing battle rules. Build a lightweight SFC-late / PS1-early-inspired battle presentation layer with a distinct regional battle background, cleaner command panel hierarchy, clearer enemy/HP presentation, and visible damage feedback. Keep the current enemy data, rewards, guard, potion, escape, level-up, encounter grace, and world return behavior intact. If high-quality binary enemy artwork cannot be committed through a verified path, use original repository-safe CSS/SVG presentation assets and explicitly mark them as interim art rather than pretending final enemy illustrations exist.

## NEXT_ACTION_COMPLETION_CONDITION

The next action is complete only when:
1. Battle commands remain Attack / Guard / Herb / Escape and all still function.
2. Battle screen has a visibly improved background and command hierarchy on iPhone-sized layouts.
3. Enemy HP/state is clearer than v0.8/v0.9.
4. At least one visible damage-feedback improvement is present without breaking turn resolution.
5. World return after victory/escape/defeat remains intact and movement timers remain stopped correctly.
6. Town `出口↓`, objective HUD, guide NPC, and v0.9 portrait dialogue do not regress.
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
- Do not copy maps, sprites, UI, text, music, enemies, characters, or art from an existing game.
- Do not treat emoji/CSS/SVG interim art as final when it is not final.
- Do not claim generated raster assets were integrated unless actual repository files exist and the playable build references them.
- Do not reveal Glenn's relation to Luke, Elisia, or the Demon-King succession conflict yet.
- Do not reveal Elisia's full history through Leon at this stage.
- Do not start the Glenn boss fight yet.
- Do not remove or reorder the v0.8 then v0.9 Pages script injection without intentionally testing the dependency chain.

## IMPORTANT_DESIGN_DECISIONS

- Visual target remains `SFC後期〜PS1初期の高品質2D JRPG`, not full 3D.
- Player guidance remains a core quality requirement.
- Field sprites and dialogue portraits are permanently separate presentation layers.
- Portrait contract is key-based (`luke`, `leon`, `glenn`) with expression and side extensibility.
- Portrait priority remains Luke → Leon → Glenn → Eleanor → Elisia; first three now have v1 assets.
- Original SVG is an acceptable repository-safe interim asset format when binary generation-to-GitHub transport is unavailable.
- Final art quality must still be improved later; technical integration success must not be confused with final visual fidelity.
- Exploration remains top-down, tile/coordinate based with physical exits.
- Mobile-first touch controls remain protected infrastructure.
- Battle presentation should improve incrementally without destabilizing mechanics.

## STORY_CANON_ADDED_OR_CHANGED

- No story canon changed this session.
- No new secret was revealed.
- Leon's second cliff-road encounter remains the current story frontier.
- Glenn's hidden family relation, Elisia's deeper history, and the Demon-King succession conflict remain unrevealed.
- The first chapter remains unresolved.
