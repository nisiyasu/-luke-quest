# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-06 06:39 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- FRESH_HEAD_AT_AUTOSAVE_START: `2d99c2f76d7ea4ac2a8f48522b673509404299f4`
- LATEST_IMPLEMENTATION_CHECKPOINT: `08f762972dd3de896a92eae203be69577bbf2edc`
- LATEST_QUEUE_CHECKPOINT_BEFORE_THIS_AUTOSAVE: `2d99c2f76d7ea4ac2a8f48522b673509404299f4`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE. Queue-controlled autonomous development is active. Fresh implementation now additionally includes persistent MP, the first MP battle skill `蒼閃`, dedicated Azure Slash battle feedback, canonical enemy consumable drops, MP-aware recovery points, and bestiary drop intel. Fresh HEAD always outranks this autosave.
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED`
- WORK_MANAGER: `WORK_MANAGER.md`
- WORK_QUEUE: `WORK_QUEUE.md`
- ACTIVE_REQUIREMENT_ID: `NONE`
- ACTIVE_REQUIREMENT_PATH: `NONE`
- VERIFY_REQUIREMENTS: `REQ-001, REQ-002, REQ-003, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-020`
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
- No requirement is IN_PROGRESS at this autosave checkpoint. REQ-016 through REQ-020 were implemented, automatically validated and moved to VERIFY in this run.
- REQ-004 Leon formal full-body dialogue art and REQ-005 Glenn formal full-body dialogue art remain BACKLOG. Do not fabricate final approved character art or silently promote placeholder SVGs to formal status.
- VERIFY does not consume WIP and does not block independent safe development.
- If only Owner-only formal-art BACKLOG remains, selection rule permits registering another directive-authorized player-visible requirement that advances an explicitly unfinished final-game capability without protected-canon changes.
- CURRENT updates, queue updates, commits and Pages success are checkpoints, not execution-stop conditions.

## WHAT_CHANGED_RECENTLY

### REQ-020 — Bestiary Drop Intel
- `requirements/REQ-020_BESTIARY_DROP_INTEL.md` created and moved to VERIFY.
- `addons/enemy-drop-system.js` now exports a frozen read-only `dropLabels` projection from the canonical drop registry. Drop probabilities remain private to battle logic.
- `addons/bestiary-details.js` reads `window.LQ_ENEMY_DROP_STATUS.dropLabels` instead of maintaining a duplicate drop table.
- Discovered bestiary entries retain HP / ATK / EXP / G / area and now show `DROP 薬草` or `DROP 煙玉`; unknown/unregistered entries safely use `DROP —`.
- Drop probabilities are deliberately not rendered while balance remains subject to Owner feel verification.
- `tools/lq-extra-regression-req20.mjs` added as a modular regression guard.
- `tools/lq-static-regression.mjs` now auto-loads `tools/lq-extra-regression-*.mjs`, allowing future focused regression contracts without repeatedly inflating the central file.
- Requirement definition: `6b92dafd97277c884a3986d032a00c9fab8e6546`.
- Drop projection: `a8d24c072c095cda428fac359c6a13c86e318188`.
- Bestiary integration: `0a6d466698a6717bfd88459408054fc8b4de19b3`.
- Modular regression loader checkpoint: `08f762972dd3de896a92eae203be69577bbf2edc`.
- Pages workflow run `33993594188`: SUCCESS through syntax, static/add-on contracts, assembled browser smoke, floating-touch smoke, upload and deploy.
- Owner physical iPhone/readability usefulness verification remains pending, therefore VERIFY rather than DONE.

### REQ-019 — MP Recovery Point Consistency
- `requirements/REQ-019_MP_RECOVERY_POINTS.md` created and moved to VERIFY.
- `addons/campfire-rest.js` preserves its one-time forest rest and full HP recovery, and now also restores MP to `s.mmp` when MP is available.
- `addons/wayfarer-shrine-blessing.js` preserves its one-time 35% HP blessing and now restores up to 35% of max MP with `s.mmp` clamp.
- Both integrations tolerate undefined/non-finite MP so old saves do not crash.
- MP recovery text is only appended when positive recovery occurs.
- `addons/inn-guest-room.js` was inspected and deliberately left without invented rest/fee mechanics because it currently provides a walkable room, not a formal lodging transaction.
- Campfire checkpoint: `66c214c125a9152954bd2529a835f2b99688325b`.
- Shrine checkpoint: `d32360b6d90512e1d3fb5c221295c791f25ce343`.
- Explicit regression checkpoint: `7c4a12f22f3f4451ded0f00c7b1398847bc15f8b`.
- Pages workflow run `33993422174`: SUCCESS through syntax, static/add-on contracts, assembled browser smoke, floating-touch smoke, upload and deploy.
- Owner physical iPhone/recovery feel verification remains pending, therefore VERIFY rather than DONE.

### REQ-018 — Azure Slash Visual Feedback
- `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md` created and moved to VERIFY.
- `addons/skill-visual-feedback.js` adds a short blue slash overlay, enemy hit flash/shake, MP-spent pulse and insufficient-MP denied pulse.
- The add-on delegates the canonical `window.lqUseAzureSlash` and detects success/denial from battle-log output after base execution.
- It is presentation-only and regression forbids mutation of HP/MP/ATK/EXP/Gold/inventory/enemy HP.
- Effect layer uses `pointer-events:none`, transient cleanup and `prefers-reduced-motion` handling.
- Implementation checkpoint: `7297bbdd01e712cd7123c9c1fe3d1822bcfaad94`.
- Regression checkpoint: `37e447e38b951b1817cc9bdc5bdb9353e5cdb361`.
- Pages workflow run `33993208928`: SUCCESS.
- Owner physical iPhone/subjective visual verification remains pending, therefore VERIFY rather than DONE.

### REQ-017 — Enemy Drop / Battle Loot System
- `requirements/REQ-017_ENEMY_DROP_SYSTEM.md` created and moved to VERIFY.
- `addons/enemy-drop-system.js` adds bounded +1 consumable drops for all 18 normal encounter enemies across field / forest / deepForest / mistTrail / observation / evacRoute.
- Rewards use only canonical `s.potions` and `s.smokeBombs`. No parallel inventory is created and no extra Gold is awarded.
- Unknown enemies and optional bosses safely fall back to no drop.
- Existing `win()` remains authoritative for EXP/G/level/victory flow; drop logic wraps it and appends `戦利品：... ×1` only on success.
- Implementation checkpoint: `6ebd89af5d291888e846abb33e3e62762fe3c058`.
- Explicit regression checkpoint: `9df98dd25bb55da81780e0a1c8d18ec133fe3526`.
- Pages workflow run `33993065410`: SUCCESS.
- Owner physical iPhone/drop-frequency/economy feel verification remains pending, therefore VERIFY rather than DONE.

### REQ-016 — MP / Battle Skill System
- `requirements/REQ-016_MP_SKILL_SYSTEM.md` created and moved to VERIFY.
- `addons/mp-skill-system.js` introduces persistent `s.mp` / `s.mmp`, initial 10/10, old-save migration and clamping.
- First MP technique is `蒼閃`, cost 4 MP. Damage derives from existing `s.atk` / `s.lv`, mutates canonical enemy HP `s.ehp`, delegates to existing `win()` or `enemyTurn()`.
- Insufficient MP spends nothing and does not advance to the enemy turn.
- Status HUD and battle command panel expose MP.
- Level-up increases max MP by 2 and fully restores MP; defeat return to town restores MP to avoid a resource dead-end.
- Existing attack / guard / herb / escape commands remain intact.
- Implementation checkpoint: `8a18bb5143eea8e71853ba0cf45da8b3f5f68b6b`.
- Explicit regression checkpoint: `6240b4e72fa2dbc503f1354715db0d25a3c7d533`.
- Pages workflow run `33992924664`: SUCCESS.
- This is the first MP skill, not a claim that a final/full magic system or final combat balance is complete.
- Owner physical iPhone/combat-feel verification remains pending, therefore VERIFY rather than DONE.

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
- REQ-016 MP / battle skill: VERIFY. MP + 蒼閃 + migration/recovery; Owner combat feel pending.
- REQ-017 Enemy battle drops: VERIFY. 18 normal enemies with bounded canonical consumable drops; Owner drop/economy feel pending.
- REQ-018 Azure Slash feedback: VERIFY. Dedicated presentation feedback; Owner visual feel pending.
- REQ-019 MP recovery points: VERIFY. Campfire/shrine resource consistency; Owner recovery feel pending.
- REQ-020 Bestiary drop intel: VERIFY. Single-source drop labels in discovered bestiary; Owner iPhone readability pending.

## FILES_CHANGED_IN_LATEST_RUN
- `requirements/REQ-016_MP_SKILL_SYSTEM.md`
- `addons/mp-skill-system.js`
- `requirements/REQ-017_ENEMY_DROP_SYSTEM.md`
- `addons/enemy-drop-system.js`
- `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md`
- `addons/skill-visual-feedback.js`
- `requirements/REQ-019_MP_RECOVERY_POINTS.md`
- `addons/campfire-rest.js`
- `addons/wayfarer-shrine-blessing.js`
- `requirements/REQ-020_BESTIARY_DROP_INTEL.md`
- `addons/bestiary-details.js`
- `tools/lq-extra-regression-req20.mjs`
- `tools/lq-static-regression.mjs`
- `WORK_QUEUE.md`
- `CURRENT.md`

## TESTS_AND_VERIFICATION
- Run-start repository metadata/default branch/HEAD were fetched fresh; actual default branch was `main`.
- Run-start HEAD was `348a00c6c588b59a3bf564b73c36f414e62df79c`. Run-start CURRENT recorded the same implementation reality, so no unrecorded prior work needed recovery.
- REQ-016 implementation/regression workflow `33992924664`: SUCCESS.
- REQ-017 implementation/regression workflow `33993065410`: SUCCESS.
- REQ-018 implementation/regression workflow `33993208928`: SUCCESS.
- REQ-019 implementation/regression workflow `33993422174`: SUCCESS.
- REQ-020 implementation/regression workflow `33993594188`: SUCCESS.
- Successful workflows passed sequential-patch syntax, collision-safe addon syntax, static regression, add-on contract, PWA validation, asset validation, assembled browser smoke, floating touch pointer-drag smoke, artifact upload and Pages deployment.
- Fresh queue-sync HEAD before this autosave: `2d99c2f76d7ea4ac2a8f48522b673509404299f4`.
- Real-device iPhone touch/visual/readability/combat feel remains NOT CLAIMED unless Owner physically checks it.

## KNOWN_ISSUES / PENDING OWNER-SIDE VERIFICATION
- Dynamic touch controller needs Owner iPhone feel confirmation for dead zone, controller radius, hold speed and possible fixed-D-pad hiding on coarse-pointer devices.
- Formal Luke dialogue art and 4-direction field sprite need Owner visual confirmation.
- REQ-006/007/008/009/010 need subjective visual confirmation.
- REQ-011 needs iPhone journal readability confirmation.
- REQ-012/013/015 need exploration reward/visual confirmation on iPhone.
- REQ-014 needs subjective confirmation that changing town dialogue feels natural across progress stages.
- REQ-016/018 need combat skill/visual feel confirmation on iPhone.
- REQ-017 needs subjective drop-frequency/economy feel confirmation.
- REQ-019 needs recovery-flow feel confirmation.
- REQ-020 needs bestiary drop-intel readability/usefulness confirmation.
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
- Do not duplicate the enemy drop table in bestiary or other UI; read `LQ_ENEMY_DROP_STATUS.dropLabels`.
- Do not expose drop probability as a stable player-facing contract before balance verification.
- Do not append every new Owner request to the giant global directive; create/register a requirement under queue control.
- Do not run multiple IN_PROGRESS requirements without explicit WIP-policy change.
- Do not let VERIFY items block safe independent work.

## IMPORTANT_DESIGN_DECISIONS
- LUKE QUEST uses queue-controlled requirement management: global rules in `AUTONOMOUS_DEV_DIRECTIVE.md`, recovery/selection in `WORK_MANAGER.md`, inventory/priority/status in `WORK_QUEUE.md`, request detail in `requirements/`, autosave/handoff in CURRENT.
- Original battle enemy art/background art are collision-safe presentation layers. Battle mechanics remain canonical and independent.
- Adventure Journal is a projection of already-known canonical state, not an alternate story authority.
- REQ-014 NPC dialogue is also a projection of canonical state. It may react to known events but does not create story authority.
- REQ-015 treasure uses the canonical consumable/gold fields already used by shop and combat; no parallel inventory authority.
- REQ-016 adds the first canonical MP resource and MP technique while preserving existing battle commands.
- REQ-017 battle loot uses canonical consumables only and wraps canonical `win()` rather than replacing victory authority.
- REQ-018 is presentation-only and reads canonical battle-log results after the skill executes.
- REQ-019 extends only verified existing recovery interactions; a decorative/walkable inn room is not silently promoted into a lodging transaction.
- REQ-020 bestiary drop intel is a read-only projection of REQ-017 authority, not a second drop table.
- Static regression now supports modular `tools/lq-extra-regression-*.mjs` guards for future focused requirements.
- Unknown enemy/map fallback is deliberately preserved.
- PS1-early target means layered readable 2D presentation, not copied existing-game art.

## STORY_CANON_ADDED_OR_CHANGED
- None. REQ-016 through REQ-020 add gameplay resources, battle reward/feedback and read-only knowledge projection without changing protected story canon.

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
- `蒼閃` dedicated blue slash/enemy-hit/MP feedback: LIVE, VERIFY.

## BATTLE_SYSTEM_PROGRESS
- Persistent MP resource: LIVE, VERIFY.
- Initial MP technique `蒼閃` 4MP: LIVE, VERIFY.
- Normal-enemy consumable drops: 18/18 registered, LIVE, VERIFY.
- Forest campfire and wayfarer shrine are MP-aware while preserving their original recovery semantics.
- Bestiary discovered entries show possible drop labels without exposing probabilities.

## EXPLORATION_PROGRESS
- Gold treasure chests: 3, persistent/opened/collision, VERIFY.
- Hidden sparkle finds: 3, exactly-once/disappear-after-find, VERIFY.
- Item treasure caches: 3, canonical inventory rewards, persistent/opened/collision, VERIFY.
- Adventure Journal: LIVE, VERIFY.
- Story-reactive town/field NPC dialogue: LIVE, VERIFY.

## CHECKPOINT_HISTORY_RECENT
- `348a00c6c588b59a3bf564b73c36f414e62df79c` run-start fresh HEAD; CURRENT matched it.
- `8a18bb5143eea8e71853ba0cf45da8b3f5f68b6b` implement REQ-016 MP / 蒼閃.
- `6240b4e72fa2dbc503f1354715db0d25a3c7d533` explicit REQ-016 regression; Pages run `33992924664` SUCCESS.
- `6ebd89af5d291888e846abb33e3e62762fe3c058` implement REQ-017 enemy drops.
- `9df98dd25bb55da81780e0a1c8d18ec133fe3526` explicit REQ-017 regression; Pages run `33993065410` SUCCESS.
- `7297bbdd01e712cd7123c9c1fe3d1822bcfaad94` implement REQ-018 Azure Slash feedback.
- `37e447e38b951b1817cc9bdc5bdb9353e5cdb361` explicit REQ-018 regression; Pages run `33993208928` SUCCESS.
- `66c214c125a9152954bd2529a835f2b99688325b` campfire MP recovery.
- `d32360b6d90512e1d3fb5c221295c791f25ce343` shrine proportional MP recovery.
- `7c4a12f22f3f4451ded0f00c7b1398847bc15f8b` explicit REQ-019 regression; Pages run `33993422174` SUCCESS.
- `a8d24c072c095cda428fac359c6a13c86e318188` expose frozen drop labels from REQ-017 authority.
- `0a6d466698a6717bfd88459408054fc8b4de19b3` integrate drop intel into bestiary.
- `1709144b734bcea0fb644c0177ff1bc8e45dfa84` add modular REQ-020 regression.
- `08f762972dd3de896a92eae203be69577bbf2edc` auto-load modular regression guards; Pages run `33993594188` SUCCESS.
- `2d99c2f76d7ea4ac2a8f48522b673509404299f4` synchronize WORK_QUEUE through REQ-020 VERIFY.

CURRENT is an autosave, not a stop condition. Continue from fresh HEAD under WORK_MANAGER and WORK_QUEUE control.