# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-06 05:26 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- FRESH_HEAD_AT_AUTOSAVE_START: `f21a978152fe74de2817325ef2260e3d2a3e7436`
- LATEST_IMPLEMENTATION_CHECKPOINT: `6788d4e6c43113c7b863d154759acd76c382ac58`
- LATEST_QUEUE_CHECKPOINT_BEFORE_THIS_AUTOSAVE: `f21a978152fe74de2817325ef2260e3d2a3e7436`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE. Queue-controlled autonomous development is active. Fresh implementation includes formal Luke dialogue art, floating touch controller, 4-direction × 3-frame Luke field sprites, Aldia/field/forest visual-density upgrades, expanded interiors, original normal-enemy battle art, original regional battle background art, Adventure Journal, persistent Gold treasure chests, hidden sparkle finds, story-reactive NPC dialogue, and item-bearing exploration caches. Fresh HEAD always outranks this autosave.
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED`
- WORK_MANAGER: `WORK_MANAGER.md`
- WORK_QUEUE: `WORK_QUEUE.md`
- ACTIVE_REQUIREMENT_ID: `NONE`
- ACTIVE_REQUIREMENT_PATH: `NONE`
- VERIFY_REQUIREMENTS: `REQ-001, REQ-002, REQ-003, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015`
- BACKLOG_REQUIREMENTS: `REQ-004, REQ-005`
- NEXT_QUEUE_SELECTION: follow fresh `WORK_MANAGER.md` + `WORK_QUEUE.md`; do not guess from CURRENT.

## MANDATORY_BOOT_FILES
1. repository metadata / actual default branch / fresh HEAD
2. `AUTONOMOUS_DEV_DIRECTIVE.md` FULL TEXT
3. `WORK_MANAGER.md` FULL TEXT
4. `WORK_QUEUE.md` FULL TEXT
5. `CURRENT.md` FULL TEXT
6. active requirement file from WORK_QUEUE when one exists
7. `index.html`
8. `.github/workflows/pages.yml`
9. all sequential `ux-v*.js` through fresh latest version in numeric order
10. all `addons/*.js`
11. `tools/lq-static-regression.mjs`
12. `tools/lq-addon-contract.mjs`
13. `manifest.webmanifest`
14. `sw.js`
15. `assets/app-icon.svg`
16. `assets/characters/CHARACTER_ASSET_CONTRACT.md`
17. `assets/characters/luke/dialogue-neutral.webp.b64`
18. `assets/portraits/` state
19. recent commits / Actions / Pages state

Fresh HEAD is implementation truth. CURRENT is autosave and may lag after autonomous checkpoints. Never repeat work from CURRENT without HEAD/diff reconstruction.

## WORK_MANAGEMENT_REALITY
- Queue-controlled work management remains authoritative.
- `WORK_MANAGER.md` defines recovery, WIP=1, priority selection, blocker handling, VERIFY handling, checkpoint behavior, and request registration.
- `WORK_QUEUE.md` is authoritative for ORDER / PRIORITY / STATUS.
- No requirement is IN_PROGRESS at this autosave checkpoint. REQ-014 and REQ-015 were implemented, automatically validated and moved to VERIFY.
- REQ-004 Leon formal full-body dialogue art and REQ-005 Glenn formal full-body dialogue art remain BACKLOG. Do not fabricate final approved character art or silently promote placeholder SVGs to formal status.
- VERIFY does not consume WIP and does not block independent safe development.
- If only Owner-only formal-art BACKLOG remains, selection rule permits registering another directive-authorized player-visible requirement that advances an explicitly unfinished final-game capability without protected-canon changes.
- CURRENT updates, queue updates, commits and Pages success are checkpoints, not execution-stop conditions.

## WHAT_CHANGED_RECENTLY

### REQ-015 — Item Treasure Caches
- `requirements/REQ-015_ITEM_TREASURE_CACHES.md` created and moved to VERIFY after implementation and automated deployment validation.
- `addons/item-treasure-caches.js` added as an isolated collision-safe add-on.
- Existing REQ-012 Gold treasure chests were preserved unchanged.
- Three new mid-game exploration caches were added:
  - `deepForest` `(18,19)` — 森奥の薬草束 — 薬草×2 — `lqItemCacheDeepHerbs`
  - `mistTrail` `(10,21)` — 退避用ポーチ — 煙玉×1 — `lqItemCacheMistSmoke`
  - `observation` `(25,20)` — 隠し補給箱 — 45G — `lqItemCacheObservationGold`
- Rewards use canonical inventory fields already consumed by shop/battle systems: `s.potions`, `s.smokeBombs`, `s.gold`.
- Each cache has exactly-once persistent reward logic, opened/empty visual state, collision and `pointer-events:none` touch passthrough.
- Rewards call `save()` after mutation.
- `window.LQ_ITEM_TREASURE_CACHE_STATUS` exposes maps, IDs, flags, reward types, one-time/collision/touch/canonical-inventory status.
- Definition checkpoint: `47b775efae1c583ab171885c8b3dc258b289b88a`.
- Implementation checkpoint: `6788d4e6c43113c7b863d154759acd76c382ac58`.
- Pages workflow run `33990010600`: SUCCESS. Sequential syntax, isolated add-ons, static regression, add-on contract, PWA/assets, assembled browser smoke, floating touch smoke, upload and Pages deploy all passed.
- Owner physical iPhone/subjective visual verification remains pending, therefore VERIFY rather than DONE.

### REQ-014 — NPC Dialogue Progression
- `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` created and moved to VERIFY.
- `addons/npc-dialogue-progression.js` added.
- Four existing NPCs now react to canonical story progress without new canon or story flags:
  - 王都: 旅好きの老人
  - 王都: 道具屋のミナ
  - 王都: 神殿の見習い
  - 王都近郊: 畑仕事の青年
- Six dialogue stages derive only from existing progress state: baseline, `s.wins`, `leonSeen`, mist/Glenn trace, observation/Glenn seen, evacuation/withdraw proof.
- NPC positions, collision, kinds, battle mechanics and rewards are unchanged.
- Protected secrets remain forbidden from the projection.
- `window.LQ_NPC_DIALOGUE_PROGRESSION_STATUS` exposes stage/count/maps/canonical flags and confirms projection-only behavior.
- `tools/lq-addon-contract.mjs` guards required NPCs, canonical progression flags, town/field scope, runtime marker and protected-spoiler phrases.
- Implementation checkpoint: `553eabc6c74fb6a8b363db20172bafe831023d9b`.
- Pages workflow run `33989872020`: SUCCESS through syntax, static/add-on contracts, assembled browser smoke, floating touch smoke and deploy.
- Owner physical iPhone/subjective dialogue-flow verification remains pending, therefore VERIFY rather than DONE.

### REQ-013 — Hidden Find / Sparkle System
- `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` is VERIFY.
- `addons/hidden-finds.js` supplies three exactly-once hidden sparkle finds in town, field and deep forest.
- Rewards persist via unique flags and save; discovered sparkle disappears.
- Pages workflow run `33987250241`: SUCCESS.

### REQ-012 — Persistent Treasure Chests
- `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` is VERIFY.
- `addons/treasure-chests.js` supplies three original CSS-drawn Gold chests in town, field and forest.
- Each chest has collision, opened visual, exactly-once persistent Gold reward and touch passthrough.
- Pages workflow run `33987117818`: SUCCESS.

### REQ-011 — Adventure Journal / Objective Tracking
- `requirements/REQ-011_ADVENTURE_JOURNAL.md` is VERIFY.
- Pause menu contains `ADVENTURE JOURNAL` with MAIN OBJECTIVE, DISCOVERED CLUES and SIDE QUESTS.
- Main objective mirrors canonical progress; discovered clues only show facts whose flags are already unlocked; future protected facts are not previewed.
- Existing Elder Charm, Forest Bounty and Forest Herb Sample side quests are tracked.
- `tools/lq-addon-contract.mjs` guards journal UI/runtime markers, canonical state coverage, side-quest state, duplicate protection, visibility and protected-spoiler phrases.
- Pages workflow run `33984155835`: SUCCESS.

### REQ-006 — Original Normal-Enemy Battle Art
- 18 normal encounter enemies across field / forest / deepForest / mistTrail / observation / evacRoute are registered to LUKE QUEST original inline-SVG battle art.
- Unknown/future/smoke enemies keep fallback; dedicated optional forest boss remains independent.
- Pages workflow run `33982213456`: SUCCESS.

### REQ-007 — Original Regional Battle Backgrounds
- Six normal encounter regions have distinct original inline-SVG battle backgrounds.
- Unknown maps retain fallback; layer is presentation-only and battle mechanics are unchanged.
- Pages workflow run `33982352056`: SUCCESS.

## EXISTING VERIFIED REQUIREMENT STATE
- REQ-001 Dynamic Touch Controller: VERIFY. v1.2 pointer-drag regression passes; Owner physical iPhone feel pending.
- REQ-002 Luke dialogue formal art: VERIFY. Approved WebP transport/guard integrated; Owner visual confirmation pending.
- REQ-003 Luke field sprite: VERIFY. 4 directions × 3 frames integrated; Owner visual/iPhone confirmation pending.
- REQ-006 Original enemy art: VERIFY. 18 normal enemies implemented; Owner subjective/iPhone visual pending.
- REQ-007 Regional battle backgrounds: VERIFY. 6 regions implemented; Owner subjective/iPhone visual pending.
- REQ-008 Aldia visual density: VERIFY. Automated/Pages passed; Owner subjective/iPhone pending.
- REQ-009 Field/forest visual density: VERIFY. Automated/Pages passed; Owner subjective/iPhone pending.
- REQ-010 Building/interior expansion: VERIFY. South Gate Inn / attic and transition smoke passed; Owner subjective/iPhone pending.
- REQ-011 Adventure Journal: VERIFY. Spoiler-safe objective/clue/side-quest tracking; Owner iPhone readability pending.
- REQ-012 Persistent Gold treasure chests: VERIFY. 3 chests; Owner iPhone visual pending.
- REQ-013 Hidden finds: VERIFY. 3 sparkle finds; Owner iPhone visual pending.
- REQ-014 NPC dialogue progression: VERIFY. 4 NPCs × 6 canonical stages; Owner subjective/iPhone pending.
- REQ-015 Item treasure caches: VERIFY. 3 caches with herbs/smoke/Gold; Owner subjective/iPhone pending.

## FILES_CHANGED_IN_LATEST_RUN
- `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md`
- `addons/npc-dialogue-progression.js`
- `tools/lq-addon-contract.mjs`
- `requirements/REQ-015_ITEM_TREASURE_CACHES.md`
- `addons/item-treasure-caches.js`
- `WORK_QUEUE.md`
- `CURRENT.md`

## TESTS_AND_VERIFICATION
- Run-start repository metadata/default branch/HEAD were fetched fresh; actual default branch was `main`.
- Run-start HEAD was `4ca9255da85efb760d17f21dde11257f0872061f`. CURRENT was behind and fresh HEAD was treated as implementation truth.
- REQ-014 implementation workflow `33989872020`: SUCCESS.
- REQ-015 implementation workflow `33990010600`: SUCCESS.
- Both successful implementation workflows passed sequential-patch syntax, collision-safe addon syntax, static regression, add-on contract, PWA validation, asset validation, assembled browser smoke, floating touch pointer-drag smoke, artifact upload and Pages deployment.
- Fresh queue-sync HEAD before this autosave: `f21a978152fe74de2817325ef2260e3d2a3e7436`.
- Real-device iPhone touch/visual/readability feel remains NOT CLAIMED unless Owner physically checks it.

## KNOWN_ISSUES / PENDING OWNER-SIDE VERIFICATION
- Dynamic touch controller needs Owner iPhone feel confirmation for dead zone, controller radius, hold speed and possible fixed-D-pad hiding on coarse-pointer devices.
- Formal Luke dialogue art and 4-direction field sprite need Owner visual confirmation.
- REQ-006/007/008/009/010 need subjective visual confirmation.
- REQ-011 needs iPhone journal readability confirmation.
- REQ-012/013/015 need exploration reward/visual confirmation on iPhone.
- REQ-014 needs subjective confirmation that changing town dialogue feels natural across progress stages.
- Leon, Glenn, Eleanor and Elisia still lack final integrated approved major-character artwork. REQ-004 and REQ-005 preserve Leon/Glenn requests without pretending placeholder SVGs are final art.

## BLOCKERS
- No blocker to continued safe code/UI/world/battle/content development in general.
- Final approved Leon/Glenn visual integration should not invent or silently approve character art when final asset/canon is not sufficiently established.
- Owner physical/subjective checks never block independent safe work; keep affected requirements in VERIFY.

## NEXT_ACTION
1. On next execution fresh-fetch HEAD and WORK_QUEUE first. Recover any concurrent work from HEAD/diff.
2. If an IN_PROGRESS/READY requirement exists, recover/select it under WORK_MANAGER.
3. If no IN_PROGRESS/READY exists and REQ-004/005 remain Owner-only formal-art BACKLOG, preserve them and register another directive-authorized, collision-safe player-visible requirement that advances an explicitly unfinished final-game capability without changing protected canon.
4. Prefer gaps that deepen actual game interaction, world reactivity, treasure/inventory, combat readability, exploration or content over cosmetic micro-polish.
5. Keep one IN_PROGRESS item at a time and continue checkpoint-to-checkpoint while the environment allows.

## NEXT_ACTION_COMPLETION_CONDITION
- Fresh HEAD remains implementation reality.
- Queue accurately reflects IN_PROGRESS / VERIFY / BACKLOG.
- Selected work has a detailed requirement or equivalent safe scope before mutation.
- Safe implementation checkpoint, automated regression, fresh Actions/Pages validation and autosave are performed.
- Completion of one requirement is never itself a reason to stop execution.

## DO_NOT_REPEAT
- Do not replace Owner-approved Luke dialogue art with a newly invented different-looking Luke.
- Do not call fallback SVG formal.
- Do not reintroduce enemy emoji as final art for the 18 registered normal enemies.
- Do not reduce regional battle background art to a flat CSS gradient and call it complete.
- Do not overwrite dedicated optional-boss art with the normal-enemy registry.
- Do not remove centralized pointerup/pointercancel/blur/visibility movement-stop safety.
- Do not make mouse clicks summon the floating controller.
- Do not let world touch movement activate over buttons/dialogue/interactive controls.
- Do not trust stale CURRENT over fresh HEAD.
- Do not expose protected story canon early.
- Do not make Adventure Journal preview undiscovered future clues or protected secrets.
- Do not overwrite REQ-012 Gold chests when extending treasure; REQ-015 is additive.
- Do not create parallel consumable inventory fields; use canonical `s.potions` / `s.smokeBombs`.
- Do not append every new Owner request to the giant global directive; create/register a requirement under queue control.
- Do not run multiple IN_PROGRESS requirements without explicit WIP-policy change.
- Do not let VERIFY items block safe independent work.

## IMPORTANT_DESIGN_DECISIONS
- LUKE QUEST uses queue-controlled requirement management: global rules in `AUTONOMOUS_DEV_DIRECTIVE.md`, recovery/selection in `WORK_MANAGER.md`, inventory/priority/status in `WORK_QUEUE.md`, request detail in `requirements/`, autosave/handoff in CURRENT.
- Original battle enemy art/background art are collision-safe presentation layers. Battle mechanics remain canonical and independent.
- Adventure Journal is a projection of already-known canonical state, not an alternate story authority.
- REQ-014 NPC dialogue is also a projection of canonical state. It may react to known events but does not create story authority.
- REQ-015 treasure uses the canonical consumable/gold fields already used by shop and combat; no parallel inventory authority.
- Unknown enemy/map fallback is deliberately preserved.
- PS1-early target means layered readable 2D presentation, not copied existing-game art.

## STORY_CANON_ADDED_OR_CHANGED
- None. REQ-014 adds reactive wording only and reveals no protected secrets. REQ-015 adds only non-story exploration supplies.

## CHARACTER_CANON_STATUS
- Luke formal large-image canon: blue hair / blue clothing and cloak / silver armor / gold accents. Owner-approved generated artwork remains authoritative.
- Luke field formal sprite: 4-direction × 3-frame implementation LIVE, Owner visual verification pending.
- Leon formal art: pending, REQ-004 BACKLOG.
- Glenn formal art: pending, REQ-005 BACKLOG.

## TOUCH_CONTROLLER_STATUS
- REQ-001: VERIFY.
- Anywhere-touch translucent four-arrow controller: LIVE.
- Four-direction slide/hold movement: LIVE.
- Centralized release/cancel/blur/visibility cleanup: LIVE.
- Dedicated automated pointer-drag regression: PASS.
- Fixed D-pad/keyboard fallback: preserved.
- Owner physical iPhone feel verification: PENDING.

## BATTLE_VISUAL_PROGRESS
- Normal enemy original art: 18/18 registered, VERIFY.
- Regional normal-encounter background art: 6/6 registered, VERIFY.
- Optional forest boss retains independent dedicated SVG art.
- Existing wound/critical state, focus-frame, foreground-depth and battle runtime smoke remain protected by regression.

## EXPLORATION_PROGRESS
- Gold treasure chests: 3, persistent/opened/collision, VERIFY.
- Hidden sparkle finds: 3, exactly-once/disappear-after-find, VERIFY.
- Item treasure caches: 3, canonical inventory rewards, persistent/opened/collision, VERIFY.
- Adventure Journal: LIVE, VERIFY.
- Story-reactive town/field NPC dialogue: LIVE, VERIFY.

## CHECKPOINT_HISTORY_RECENT
- `4ca9255da85efb760d17f21dde11257f0872061f` fresh run-start HEAD with REQ-012/013 already ahead of stale CURRENT.
- `553eabc6c74fb6a8b363db20172bafe831023d9b` implement REQ-014 NPC dialogue progression + contract; Pages run `33989872020` SUCCESS.
- `47b775efae1c583ab171885c8b3dc258b289b88a` define REQ-015 item treasure caches.
- `6788d4e6c43113c7b863d154759acd76c382ac58` implement REQ-015; Pages run `33990010600` SUCCESS.
- `0e8ba897710682d29658181021c488800e57f9ba` record REQ-015 VERIFY evidence.
- `3f7723e973efa90f59ea6398fcd9969dc73cafde` record REQ-014 verification evidence.
- `f21a978152fe74de2817325ef2260e3d2a3e7436` synchronize WORK_QUEUE through REQ-015.

CURRENT is an autosave, not a stop condition. Continue from fresh HEAD under WORK_MANAGER and WORK_QUEUE control.
