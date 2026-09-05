# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-05 17:34 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_COMMIT_SHA: `0ee1b6ad80d4c0150869d5ca0559ea4d47d5100e` (v0.15 implementation/deploy checkpoint; this CURRENT checkpoint is committed immediately after it)
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / v0.15 deployed / Pages workflow run `33955535985` all steps SUCCESS

## MANDATORY_BOOT_FILES

Read fresh before mutation:
1. `CURRENT.md`
2. `index.html`
3. `ux-v08.js`
4. `ux-v09.js`
5. `ux-v10.js`
6. `ux-v11.js`
7. `ux-v12.js`
8. `ux-v13.js`
9. `ux-v14.js`
10. `ux-v15.js`
11. `.github/workflows/pages.yml`
12. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
13. `assets/portraits/` state
14. recent commits / Pages workflow state

`index.html` remains rollback-safe v0.7 core. Pages injects v0.8 → v0.9 → v0.10 → v0.11 → v0.12 → v0.13 → v0.14 → v0.15 in that order.

## WHAT_CHANGED_THIS_SESSION

1. Fresh boot confirmed actual default branch `main`, fresh HEAD, CURRENT, core files, portrait state, and Pages/workflow reality.
2. Proved repository-safe raster transport using base64 text, browser `fetch` + `atob` + Blob URL decoding, and CI signature validation.
3. Added `assets/characters/CHARACTER_ASSET_CONTRACT.md` defining formal full-body dialogue and four-direction field-art slots.
4. Reused the Owner-approved existing Luke full-body image; no new image was generated. Optimized it to WebP and stored it as `assets/characters/luke/dialogue-neutral.webp.b64`.
5. Added `ux-v12.js`; formal Luke dialogue now hydrates the approved WebP at runtime and replaces the interim Luke dialogue SVG. Full-body containment and larger dialogue art framing were added for iPhone-sized layouts.
6. Added `ux-v13.js`; 王都アルディア now has a visually stronger south-gate arch/landmark and stone-road guidance. 王都近郊 now has a visible route trail and forest landmark generated without changing collision coordinates.
7. Added `ux-v14.js`; 道具屋のミナ now sells one 薬草 for 8G per interaction, and a 南門宿の主人 restores HP for 12G. Full-HP guests are not charged. Existing `render()` autosave persists gold/items/HP changes.
8. Added `ux-v15.js`; 王都近郊 now contains the first persistent treasure chest. It awards 18G + 薬草1個 once and disappears permanently after opening via saved flag.
9. Workflow now validates JS through v0.15, validates the PNG transport probe and approved Luke WebP signature, injects all patches deterministically, uploads, and deploys Pages.
10. Latest v0.15 workflow run `33955535985` completed every step successfully, including all validation, injection, upload, and Pages deploy steps.

## FILES_CHANGED

- `assets/characters/transport-test.png.b64`
- `assets/characters/CHARACTER_ASSET_CONTRACT.md`
- `assets/characters/luke/dialogue-neutral.webp.b64`
- `ux-v12.js`
- `ux-v13.js`
- `ux-v14.js`
- `ux-v15.js`
- `.github/workflows/pages.yml`
- `CURRENT.md`

## NEW_ASSETS

- Formal Luke dialogue artwork: `assets/characters/luke/dialogue-neutral.webp.b64` — optimized from the existing Owner-approved full-body Luke reference; no new image generation occurred.
- Transport probe: `assets/characters/transport-test.png.b64` — technical test only, never character art.

## TESTS_AND_VERIFICATION

- Fresh repository metadata/default branch verified as `main`.
- README does not currently exist (fresh 404 check).
- Existing interim portrait directory still contains `luke.svg`, `leon.svg`, `glenn.svg`.
- Core `render()` was verified to call `save()`, so shop/inn/chest changes persist through existing localStorage autosave.
- JS validation succeeds through `ux-v15.js` in Pages workflow.
- Base64 PNG transport signature validation succeeds.
- Approved Luke WebP RIFF/WEBP signature validation succeeds.
- v0.15 workflow run `33955535985`: validation, all v0.8–v0.15 injections, upload, and deployment all SUCCESS.
- Fresh main implementation HEAD verified as `0ee1b6ad80d4c0150869d5ca0559ea4d47d5100e` before this CURRENT checkpoint.
- Real-device iPhone visual/touch confirmation remains Owner-device testing.

## PLAYER_GUIDANCE_IMPROVEMENTS

- Existing objective HUD, yellow starting exit, and guidance NPC remain active.
- 王都 south route now has visible stone-road hierarchy, a gate arch, and `王都南門 ↓` landmark.
- 王都近郊 now has a visible traversable trail toward the forest and `魔物の森 ↑` landmark.

## DIALOGUE_VISUAL_PROGRESS

- Formal Owner-approved Luke full-body dialogue art is now integrated into the public build through the base64/WebP runtime loader.
- Dialogue art uses `object-fit: contain` and body-dominant framing instead of face-only cropping.
- Leon and Glenn still use interim SVG dialogue art and are not formalized.

## BATTLE_VISUAL_PROGRESS

- v0.10 regional battle backgrounds, larger enemy presentation, HP display, 2x2 commands, and action feedback remain active.
- Enemy graphics are still interim emoji art.
- v0.11 victory banter remains 60 randomized Luke lines with last-8 repeat suppression.

## MAP_READABILITY_IMPROVEMENTS

- 王都 and 王都近郊 received the first dedicated visual route/landmark pass in v0.13.
- No collision coordinates, exits, NPC story positions, or map transitions were changed by the readability layer.

## CHARACTER_CANON_STATUS

- Luke formal dialogue image: Owner-approved blue-haired / blue-cloak / silver-armor / gold-accent full-body design, now live.
- Luke field direction behavior: 4/4 directions live, but current field artwork remains interim CSS.
- Leon and Glenn formal visual art: pending.

## PORTRAIT_INTEGRATION_STATUS

- Luke formal full-body dialogue art: INTEGRATED.
- Luke old `assets/portraits/luke.svg`: remains in repository as fallback/interim, but v0.12 runtime replaces Luke neutral dialogue source when the formal WebP loads.
- Leon formal art: NOT YET INTEGRATED.
- Glenn formal art: NOT YET INTEGRATED.

## FIELD_SPRITE_DIRECTION_STATUS

- Luke direction logic: 4/4 LIVE (`up`, `down`, `left`, `right`) using authoritative `s.dir`.
- Luke formal generated four-direction field art: NOT YET INTEGRATED; v0.11 CSS representation remains interim.
- Leon/Glenn four-direction formal field art: NOT YET IMPLEMENTED.

## POST_BATTLE_LINE_VARIETY_STATUS

- Generic Luke victory lines: 60.
- Random selection: LIVE.
- Near-repeat suppression: previous 8 exact lines excluded.
- Special second-win progression narration remains authoritative.

## KNOWN_ISSUES

- Luke field character still uses interim CSS rather than formal four-direction art.
- Leon/Glenn dialogue images remain interim SVGs; major characters beyond Luke need formal full-body art later.
- Enemy graphics remain emoji placeholders.
- Most map/NPC graphics are still CSS/emoji rather than final visual assets.
- Building interiors are not yet implemented.
- Shop interaction currently buys exactly one herb per A interaction rather than opening a quantity menu.
- Inn has functional recovery but no interior/bed scene yet.
- Treasure chest uses an emoji representation, not final chest art.
- No dedicated automated browser/touch regression suite exists.
- `wins` remains a global victory count rather than separated progression/stat counters.
- North continuation beyond `北の崖道` remains intentionally unopened.
- Patch chain is now eight injected layers; consolidate only after real-device stability is confirmed.

## BLOCKERS

- No blocker for continued code/world/UI development.
- High-fidelity raster transport is no longer blocked; the base64/WebP route is proven end-to-end.
- Formal four-direction Luke field images are unavailable without creating/receiving four approved directional images. Do not fabricate completion with mirrored or guessed art.
- Real-device iPhone confirmation remains external to this runtime.

## NEXT_ACTION

Continue player-visible WORLD progression without generating unapproved new character images: implement the first safe building interior in 王都 (preferably the inn), including physical doorway entry/exit and a simple interior map while preserving v0.15 shop/inn/chest systems, guidance, formal Luke dialogue art, movement safety, battle behavior, and save compatibility.

## NEXT_ACTION_COMPLETION_CONDITION

1. A player can physically enter at least one 王都 building from the walkable map and exit back to the correct exterior location.
2. The interior has collision boundaries and at least one functional interaction or landmark.
3. Existing v0.8–v0.15 functionality remains intact.
4. JS validation and Pages deployment succeed.
5. CURRENT.md is updated and fresh-retrieved again.

## SESSION_WORK_ITEMS_COMPLETED

1. Raster transport contract + technical probe.
2. Approved Luke full-body dialogue art optimization, repository storage, runtime integration, and validation.
3. Town/field map readability and route landmarks.
4. Functional herb shop.
5. Functional HP-restoring inn service.
6. Persistent one-time field treasure chest.
7. Pages validation/deployment updates through v0.15.

## SESSION_NEXT_AVAILABLE_WORK

- First physical building interior.
- Additional treasure/environment interactions.
- Further town/field terrain hierarchy.
- Formal four-direction field art once approved directional source images are available.

## DO_NOT_REPEAT

- Do not make the starting exit ambiguous again.
- Do not return Luke to permanently front-facing movement.
- Do not call interim CSS/SVG art formal final art.
- Do not use face-only major-character art as the final presentation.
- Do not claim image integration unless the public game actually references it.
- Do not generate/substitute an unapproved Luke design while formal canon exists.
- Do not reduce the victory-line pool below approximately 50 or remove near-repeat protection without Owner approval.
- Do not regress movement-stop safety, keyboard/touch movement, collision, battle rewards, level-up, herbs, guard/escape, world return, objective guidance, or save behavior.
- Do not change battle mechanics merely for presentation.
- Do not copy existing-game characters, maps, text, UI, music, images, or other protected assets.
- Do not reveal Glenn's family relation to Luke, Elisia's full history, or Demon-King succession secrets yet.
- Do not start the Glenn boss fight yet.
- Do not remove/reorder the v0.8→v0.15 Pages injection chain accidentally.

## IMPORTANT_DESIGN_DECISIONS

- Visual target remains SFC-late / PS1-early high-quality 2D JRPG.
- GitHub HEAD is implementation reality; CURRENT is the operational handoff. If they disagree, inspect HEAD/diff and recover from fresh reality.
- Commit safe completion units frequently so interrupted runs can resume from latest HEAD.
- Main-character dialogue art is full-body/body-dominant; field sprites are a separate four-direction layer.
- Formal raster assets may be stored as optimized `.webp.b64` text and decoded in-browser to Blob URLs; only `formal:true` assets may replace interim art.
- Luke field direction remains driven by existing `s.dir`; presentation must not duplicate movement logic.
- Player guidance and map readability are first-class quality requirements.
- Functional game systems and visible player improvements outrank pure refactoring.

## STORY_CANON_ADDED_OR_CHANGED

- No story canon changed this session.
- No hidden family/Elisia/Demon-King secret was revealed.
- Leon's second cliff-road encounter remains the current story frontier.
- The first chapter remains unresolved.
