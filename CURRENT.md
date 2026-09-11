# LUKE QUEST CURRENT

## FRESH RECOVERY SNAPSHOT — 2026-09-11

- UPDATED_AT: `2026-09-11 10:30 JST`
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTUAL_DEFAULT_BRANCH: `main`
- MAIN_HEAD_AT_RECOVERY: `fbe77de5068891d65528d0603abdbd06bf65f0ae`
- ACTIVE_BRANCH: `experiment/gold-vertical-slice`
- GOLD_BRANCH_HEAD_AT_RECOVERY: `15be043a1ee00b457fab653baa7a96ed524660a0`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `7e1b6a2cd36ee2d63cde4a5ee12a1364a0e10d97`
- LATEST_VERIFIED_RUNTIME_HEAD_SHA: `7e1b6a2cd36ee2d63cde4a5ee12a1364a0e10d97`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- GOLD_PREVIEW_URL: https://nisiyasu.github.io/-luke-quest/preview/gold/
- GOLD_PREVIEW_SOURCE_BRANCH: `experiment/gold-vertical-slice`
- CURRENT_BUILD_STATUS: `GREEN for the latest player-visible Gold checkpoint 7e1b6a2: P0 Touch SUCCESS first attempt; REQ-145 Gold Challenger SUCCESS; REQ-023 first attempt hit the 30s browser wall-clock timeout but the exact same HEAD rerun succeeded. Current Gold CI-only descendant 15be043 adds timeout-only retry protection and its REQ-023 + Gold Challenger runs are SUCCESS. Main Pages deployment at fbe77de is SUCCESS; post-deploy cache-busted recovery and iOS WebKit live diagnostics are SUCCESS.`
- ACTIVE_REQUIREMENT_ID: `REQ-145`
- ACTIVE_REQUIREMENT_PATH: `requirements/REQ-145_GOLD_VERTICAL_SLICE_CONTINUOUS_QUALITY_LANE.md`
- ACTIVE_REQUIREMENT_STATUS: `P0 / IN_PROGRESS`
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY / WIP_LIMIT_1 / OWNER_DIRECT_P0_PREEMPTION`
- RECENT_CHECKPOINTS: `7e1b6a2 perf(req145): replace market support filter with box shadow; 15be043 ci(req023): retry one wall-clock browser timeout on Gold; fbe77de ci(req023): retry one wall-clock browser timeout on main.`
- TESTS_AND_VERIFICATION: `7e1b6a2 P0 Touch Diagnostic SUCCESS first attempt; 7e1b6a2 Gold Challenger SUCCESS; 7e1b6a2 REQ-023 exact-HEAD rerun SUCCESS after one wall-clock timeout. 15be043 hardened REQ-023 SUCCESS first attempt and Gold Challenger SUCCESS. Main fbe77de Pages run 34550640044 SUCCESS; cache-busted Pages recovery 34550713912 SUCCESS; iOS WebKit live diagnostic 34550713833 SUCCESS.`
- KNOWN_ISSUES: `GitHub-hosted Chrome browser smoke occasionally reaches the 30s wall-clock timeout without product-failure markers. P0 already discriminates this class; REQ-023 now retries exactly once only on exit 124 and still fails closed on all other nonzero exits or missing gameplay markers. WORK_QUEUE metadata contains stale status entries for REQ-145/146/147 and requires a safe full-file synchronization; fresh HEAD/requirement reality takes precedence until that metadata repair is completed.`
- BLOCKERS: `No hard implementation blocker. REQ-001 / REQ-021 / REQ-022 and other iPhone-sensitive items remain IOS_PHYSICAL_VERIFICATION=PENDING. REQ-145 remains IN_PROGRESS and is not promoted to production or declared Owner-experience PASS.`
- NEXT_ACTION: `Continue REQ-145 on the Gold branch with one isolated player-visible or performance-safe quality increment. Preserve canonical Action/touch/save/story/battle/collision authorities. Gate the exact candidate through P0 Touch, REQ-023 and Gold Challenger, then verify public Gold preview freshness before promotion.`
- NEXT_ACTION_COMPLETION_CONDITION: `One isolated Gold change passes exact-head P0 Touch + REQ-023 + Gold Challenger, public preview contains the candidate, existing gameplay remains intact, and physical iPhone status is reported PENDING rather than falsely promoted.`
- DO_NOT_REPEAT: `Do not re-add the expensive market-support CSS filter removed at 7e1b6a2. Do not treat a lone 30s browser timeout as deterministic product regression without an exact-head retry. Do not weaken marker assertions. Do not add duplicate touch/action authority. Do not claim physical iPhone PASS from CI.`

### INPUT / FULLSCREEN PROTECTION — CURRENT

- TOUCH_CONTROLLER_STATUS: `REQ-001 VERIFY / machine and public protection green / physical iPhone PENDING`
- TOUCH_CONTROLLER_BEHAVIOR: `pointerId ownership; dead zone; short tap arbitration; live drag direction switching; central stopMoving cleanup; pointercancel/blur/pagehide/visibility/map/battle/dialogue safety; visualViewport clamp.`
- TOUCH_CONTROLLER_KNOWN_ISSUES: `No deterministic machine regression in the fresh Gold checkpoint. Physical iPhone verification remains pending.`
- TOUCH_CONTROLLER_IOS_VERIFICATION: `PENDING`
- TAP_ANYWHERE_ACTION_STATUS: `REQ-021 VERIFY / canonical action() smoke and tap-vs-drag protections green on fresh Gold evidence / physical iPhone PENDING`
- IPHONE_FULLSCREEN_UI_STATUS: `REQ-022 VERIFY / latest main Pages + iOS WebKit live diagnostic green / physical iPhone PENDING`

### REQ-023 NORTH EVACUATION GUIDANCE — CURRENT

- STATUS: `VERIFY`
- MACHINE_PUBLIC_STATUS: `Latest exact Gold runtime 7e1b6a2 passes after one transient 30s Chrome timeout; same-head rerun succeeded. Timeout-only single retry protection is now committed to both main and Gold, and the hardened Gold gate passes.`
- CURRENT_BEHAVIOR: `Required clue/objective marker, canonical Action progression, north-objective update, north marker and clue removal remain strict assertions.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

### REQ-145 GOLD VERTICAL SLICE CONTINUOUS QUALITY LANE — CURRENT

- STATUS: `IN_PROGRESS`
- PRIORITY: `P0 / OWNER_DIRECT`
- DEVELOPMENT_BRANCH: `experiment/gold-vertical-slice`
- PUBLIC_PREVIEW: `https://nisiyasu.github.io/-luke-quest/preview/gold/`
- LATEST_PLAYER_VISIBLE_CHECKPOINT: `7e1b6a2cd36ee2d63cde4a5ee12a1364a0e10d97`
- LATEST_PLAYER_VISIBLE_CHANGE: `Aldia market support depth is retained while replacing the support drop-shadow filter with a cheaper box-shadow, reducing compositor cost without changing input, collision, save, story or battle authority.`
- LATEST_BRANCH_HEAD: `15be043a1ee00b457fab653baa7a96ed524660a0 — CI-only descendant adding timeout-only REQ-023 retry protection.`
- MACHINE_GATES: `P0 Touch SUCCESS / REQ-023 SUCCESS on exact-head rerun and hardened descendant / Gold Challenger SUCCESS.`
- QUALITY_LEVEL: `Q5`
- OWNER_EXPERIENCE_PASS: `PENDING`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

---

## PRESERVED PREVIOUS SNAPSHOT — 2026-09-09

The content below is retained verbatim as the immediately previous autosave for recovery/audit history. Where it conflicts with the FRESH RECOVERY SNAPSHOT above, fresh HEAD and the new snapshot govern.

- UPDATED_AT: `2026-09-09 15:00 JST`
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `0d0b226f48349642af5faa6a9929d7606fd11f28`
- LATEST_VERIFIED_RUNTIME_HEAD_SHA: `0d0b226f48349642af5faa6a9929d7606fd11f28`
- LATEST_METADATA_COMMIT_SHA: `77324c0 (fresh main before this queue-registration checkpoint)`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- GOLD_PREVIEW_URL: https://nisiyasu.github.io/-luke-quest/preview/gold/
- GOLD_PREVIEW_SOURCE_BRANCH: `experiment/gold-vertical-slice`
- GOLD_PREVIEW_SOURCE_SHA: `3cdfe35532f9a18db180914d78870fa6609d9c5b`
- CURRENT_BUILD_STATUS: `Fresh main safety/runtime baseline 0d0b226 remains production and Gold source 3cdfe355 remains preserved. This checkpoint is queue/reference registration only: no runtime implementation is changed. New Owner P0 order is REQ-146 field-camera pullback, then REQ-147 battle UX restoration, then resume REQ-145.`
- ACTIVE_REQUIREMENT_ID: `NONE — queue-only checkpoint; REQ-146 is next READY by Owner priority`
- ACTIVE_REQUIREMENT_PATH: `NONE — next: requirements/REQ-146_FIELD_CAMERA_PULLBACK_REFERENCE_QUALITY.md`
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY / WIP_LIMIT_1 / OWNER_DIRECT_P0_PREEMPTION`
- MANDATORY_BOOT_FILES: `docs/quality/QUALITY_SYSTEM.md; docs/quality/QUALITY_RESEARCH_BASIS.md; docs/quality/LEON_GOLD_STANDARD_SCENE_DESIGN.md`
- RECENT_CHECKPOINTS: `3cdfe355 hardened mobile dialogue focus smoke; 1db3aaec dedicated mobile dialogue focus gate; e75e625e mobile dialogue focus implementation; 138677e5 mobile battle density gate; b4b9d1e3 compositor-light post-battle objective focus; 05191956 deterministic post-battle focus smoke repair; f3ca51cd dedicated post-battle focus gate; 164d0773 post-battle objective refocus implementation; e5af0e84 Gold challenger conflict-resolved onto fresh main safety baseline 0d0b226; 0d0b226 persisted WebKit world probe state-aware; 79db1541 Leon Gold Standard status aligned to VERIFY candidate; 7048defa QUALITY_SYSTEM status aligned to VERIFY; 6af1192e REQ-143 runtime regression watch; ede53279 REQ-143 P0 watch expansion; 01ac0463 production cleanup; 473bd3df REQ-141 verified implementation; 8e7638be REQ-142 dedicated gate; 68ff67fc REQ-142 final VERIFY autosave; 3ecf3b70 REQ-143 requirement; a173c2d6 quality research basis; b19d449c canonical QUALITY_SYSTEM v1.0; d22a00a8 Leon Gold Standard scene design.`
- TESTS_AND_VERIFICATION: `Gold mobile dialogue focus source 3cdfe355: dedicated gate 34307127956 SUCCESS after the first fail-closed run correctly exposed a smoke-fixture flaw and the fixture was repaired without canonical state authority; full REQ-145 challenger run 34307127954 SUCCESS including source syntax, candidate assembly, P0 touch/fullscreen runtime, canonical action feedback smoke, deterministic exact-main-vs-candidate capture and non-black A/B evidence. Pages 34307219686 SUCCESS including assembled main browser smoke, iPhone-sized floating-touch/world visual liveness, REQ-081 north cliff, REQ-082 encounters, Gold preview assembly and deployment. Post-deploy iPhone WebKit live diagnostic 34307307151 SUCCESS. Owner physical iPhone remains unverified.`
- KNOWN_ISSUES: `Owner reports field framing should be one clear step more pulled back and battle UX currently hides 集中斬り behind scroll, presents VICTORY after returning to world, and requires a separate Luke-comment dismiss. These are now canonical READY P0 work as REQ-146 then REQ-147. Existing physical iPhone verification remains PENDING where previously recorded.`
- BLOCKERS: `No hard blocker for REQ-146 or REQ-147. REQ-145 Gold source 3cdfe355 is preserved while preempted. Existing physical iPhone/subjective checks remain PENDING and do not block safe queue execution.`
- NEXT_ACTION: `Select REQ-146 from WORK_QUEUE and implement the Owner-requested one-step field-camera pullback using the three canonical reference assets. After REQ-146 public evidence is complete, execute REQ-147 battle UX restoration, then resume REQ-145 Gold challenger work.`
- NEXT_ACTION_COMPLETION_CONDITION: `REQ-146 public candidate visibly shows more useful surrounding world at the same coordinates while preserving touch/action/fullscreen/save/story/battle authorities; Pages/public evidence is green and IOS_PHYSICAL_VERIFICATION remains PENDING. Then advance to REQ-147.`
- DO_NOT_REPEAT: `Do not claim physical iPhone PASS from CI. Do not add duplicate input/save/battle authority. Do not hand-build partial canonical saves in prelude. Do not use expensive filters as fake quality. Do not mark current REQ-128/REQ-143/REQ-145 as Gold Standard PASS before Owner experience approval. Do not rebuild Gold from the stale pre-0d0b226 baseline. Do not treat a smoke-fixture failure as product completion; fail closed, repair the fixture, then rerun public evidence.`

## SELF-AUDIT GUARD

- SELF_AUDIT_GUARD: `LOADED / APPLIED`
- BOOT_REALITY_AUDIT: `PASS — fresh local origin/main was fast-forwarded to 77324c0 before this Owner queue-registration checkpoint. Main runtime remains protected at 0d0b226; Gold source 3cdfe355 remains preserved and untouched.`
- OWNER_PRIORITY_AUDIT: `PASS — latest Owner direct priority preempts REQ-145 without discarding its checkpoint. REQ-146 is top READY, REQ-147 is second READY, REQ-145 returns to READY. No runtime work is falsely claimed in this registration checkpoint.`
- CONTINUE_GATE_LAST_RESULT: `QUEUE_READY — no IN_PROGRESS item remains after deliberate Owner preemption. Next autonomous selection must take REQ-146, then REQ-147, before REQ-145.`
- EXECUTION_DEGRADATION_STATUS: `DETECTED_REPAIRED — first dedicated mobile-dialogue-focus smoke run failed because its fixture depended on an existing gameShell and malformed repeated markup. Product authority was not bypassed; the smoke was repaired to synthesize only a presentation host when needed, then dedicated/full/Page/WebKit gates all passed.`
- PREEMPTED_REQUIREMENT: `REQ-145 and REQ-144 are READY. REQ-145 Gold checkpoint 3cdfe355 is preserved but Owner-preempted by REQ-146 then REQ-147.`
- SELF_REPAIR_ACTIONS: `Freshened main, preserved Gold source, stored the three Owner field-scale reference assets locally in the repository, registered REQ-146 and REQ-147, and repaired queue/CURRENT priority so the next boot cannot silently resume stale REQ-145 first.`

## REQ-143 GAME QUALITY SYSTEM / LEON GOLD STANDARD

- STATUS: `VERIFY`
- OWNER_QUALITY_EVIDENCE: `Current Leon climax judged too weak in physical play despite functional machine success.`
- QUALITY_LEVEL: `Q5 CLIMAX`
- OWNER_QUALITY_RESULT: `FAIL`
- QUALITY_SSOT: `docs/quality/QUALITY_SYSTEM.md`
- RESEARCH_BASIS: `docs/quality/QUALITY_RESEARCH_BASIS.md`
- SCENE_DESIGN: `docs/quality/LEON_GOLD_STANDARD_SCENE_DESIGN.md`
- CURRENT_GAP: `Machine/public gate contradiction repaired. Production DOM intentionally contains no developer quality metadata; internal beat contract remains testable through LQ_REQ143_TEST. Subjective Owner experience remains unverified.`
- NEXT: `Owner experience / physical iPhone review remains PENDING. Autonomous loop continues independently on the next evidenced safe player-visible gap.`
- OWNER_EXPERIENCE_PASS: `PENDING`

## REQ-145 GOLD VERTICAL SLICE CONTINUOUS QUALITY LANE

- STATUS: `READY / OWNER_PREEMPTED / CHECKPOINT_PRESERVED`
- PRIORITY: `P0 / OWNER_DIRECT`
- DEVELOPMENT_BRANCH: `experiment/gold-vertical-slice`
- PUBLIC_PREVIEW: `https://nisiyasu.github.io/-luke-quest/preview/gold/`
- PREVIEW_STATUS: `PUBLIC / Pages 34307219686 SUCCESS / candidate source 3cdfe355 / post-deploy iPhone WebKit 34307307151 SUCCESS`
- BASELINE_STATUS: `Gold remains based on fresh main runtime 0d0b226 and isolated from production runtime. Main metadata may advance independently; Gold-only runtime delta remains isolated to challenger workflows, presentation addons, A/B docs and capture tooling.`
- LATEST_PLAYER_VISIBLE_CHANGE: `On iPhone portrait Gold, world dialogue is constrained to roughly the lower third (max 34dvh / 268px), keeps long text vertically scrollable, compacts speaker/body/sub typography, and further fades top HUD/objective overlays while dialogue is open so more of the world remains visible behind the conversation. It is presentation-only and adds no input/action/save/story/battle/movement/progression/dialogue-advance authority.`
- LATEST_DEDICATED_GATE: `REQ-145 Mobile Dialogue Focus 34307127956 SUCCESS on 3cdfe355 after fail-closed fixture repair.`
- LATEST_FULL_CHALLENGER_GATE: `34307127954 SUCCESS on 3cdfe355.`
- QUALITY_LEVEL: `Q5`
- LOOP: `TARGET EXPERIENCE -> BUILD -> PLAY -> CRITIQUE -> REPAIR -> A/B QUALITY GATE -> REPEAT`
- PRESERVE: `Chapter 1 canon; canonical action/touch/save/battle authorities; current main as production baseline`
- OWNER_EXPERIENCE_PASS: `PENDING`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## REQ-144 ORIGINAL GENERIC FIELD NPC ART

- STATUS: `READY / OWNER_PREEMPTED`
- QUALITY_LEVEL: `Q2`
- EVIDENCE: `Canonical generic person emoji remain visible after world-character-grounding because that layer wraps existing glyph nodes rather than replacing them.`
- SCOPE: `Generic elder / merchant / acolyte / farmer / observation watch only. Protected named-character identity excluded.`
- ART_STATUS: `INTERIM_ORIGINAL_SVG / NOT_FORMAL_CHARACTER_CANON`
- INPUT_AUTHORITY_CHANGE: `NONE`
- SAVE_SCHEMA_CHANGE: `NONE`
- STORY_CHANGE: `NONE`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## P0 INPUT / FULLSCREEN PROTECTION

- TOUCH_CONTROLLER_STATUS: `REQ-001 VERIFY / latest Gold full challenger 34307127954 SUCCESS preserves P0 touch/fullscreen runtime over exact main runtime 0d0b226; Pages 34307219686 also passes assembled iPhone-sized floating-touch/world visual-liveness; post-deploy iPhone WebKit 34307307151 SUCCESS.`
- TOUCH_CONTROLLER_BEHAVIOR: `pointerId ownership; dead zone; short tap arbitration; live drag direction switching; central stopMoving cleanup; pointercancel/blur/pagehide/visibility/map/battle/dialogue safety; visualViewport clamp.`
- TOUCH_CONTROLLER_KNOWN_ISSUES: `No known machine regression. IOS physical verification PENDING.`
- TOUCH_CONTROLLER_IOS_VERIFICATION: `PENDING`
- TAP_ANYWHERE_ACTION_STATUS: `REQ-021 VERIFY / latest Gold full challenger 34307127954 preserves canonical action smoke and P0 touch runtime; short tap -> action() once, dialogue close, UI exclusion, drag/cancel/stale release no Action remain protected.`
- IPHONE_FULLSCREEN_UI_STATUS: `REQ-022 VERIFY / Pages 34307219686 assembled iPhone-sized floating-touch + world visual-liveness PASS; post-deploy iPhone WebKit 34307307151 SUCCESS; 100dvh + safe-area overlays + visualViewport-aware framing preserved. Physical iPhone remains PENDING.`

## REQ-142 ADVENTURE MEMO MODERN CONTROLS HINT

- STATUS: `VERIFY`
- PLAYER_VISIBLE_GAP: `Canonical adventure memo said 操作：十字キーで移動、Aで会話。 despite current iPhone drag-anywhere movement and short-tap canonical Action.`
- IMPLEMENTATION: `Wrap canonical openMenu(), call it first, then replace only the stale controls sentence inside 冒険メモ. New touch guidance: world drag to move + short tap to investigate/talk. Keyboard guidance: Arrow/WASD + Enter/Space. Existing objective/location text retained.`
- INPUT_AUTHORITY_CHANGE: `NONE — zero pointer/touch/click handlers added; canonical action(), Dynamic Touch Controller and menu semantics unchanged.`
- DEDICATED_GATE: `34226908113 SUCCESS on 8e7638be.`
- PAGES_STATUS: `34226908028 SUCCESS on exact product implementation HEAD 8e7638be.`
- P0_TOUCH_REGRESSION: `34227266577 SUCCESS on descendant metadata head 4125bf13.`
- QUEUE_SYNC: `34227492239 SUCCESS; ORDER 124 / P1 / VERIFY.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## REQ-141 PRE-LEON SCHEMA-SAFE RECOVERY

- STATUS: `VERIFY`
- OWNER_OBSERVED_FAILURE: `Dedicated LV11 recovery opened black on physical iPhone when recovery was constructed before runtime initialization.`
- ROOT_CAUSE_STATUS: `Previous prelude recovery was demonstrably schema-fragile. This is a concrete defect. windStairRidge itself is NOT proven to be the physical root cause.`
- IMPLEMENTATION: `Stage 1 backs up existing lukeQuestV2, clears only canonical save, stores one-shot session marker and reloads through normal runtime initialization. Stage 2 consumes the marker after runtime initialization, modifies only recovery/progression fields, preserves current/future schema fields, then uses canonical save() and render().`
- SAFE_RECOVERY_CHECKPOINT: `cloudbreakSaddle (10,2), facing up, LV11, HP132/132, ATK34, MP30/30; existing REQ-121 canonical transition leads onward toward windStairRidge.`
- MACHINE_PUBLIC_STATUS: `Dedicated REQ-141 34226073276 SUCCESS; exact-head Pages 34226073258 SUCCESS on 473bd3df.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## REQ-140 IPHONE COMPOSITOR BLACK-SCREEN RECOVERY

- STATUS: `VERIFY`
- IMPLEMENTATION: `Reduced fullscreen compositor pressure and retained validated save-rescue path.`
- MACHINE_PUBLIC_STATUS: `P0 Touch 34220306982 SUCCESS; Pages 34220399635 SUCCESS; Render Liveness 34220399555 SUCCESS.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## REQ-023 NORTH EVACUATION GUIDANCE

- STATUS: `VERIFY`
- MACHINE_PUBLIC_STATUS: `PASS on protected lineage; REQ-023 branch gate 34303165716 SUCCESS after Gold fresh-baseline merge, and Pages 34307219686 preserves REQ-081/082 browser smokes.`
- CURRENT_BEHAVIOR: `Required withdrawProof target is visually guided; objective updates immediately after acquisition; next instruction directs player back to the north exit.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## RECENT MOBILE / BATTLE UX LINEAGE

- REQ-134: `VERIFY — iPhone battle command layout/touch targets; machine/public PASS; physical PENDING.`
- REQ-135: `VERIFY — battle command touch/focus/disabled feedback; machine/public PASS; physical PENDING.`
- REQ-136: `VERIFY — latest battle-log follow + live semantics; machine/public PASS; physical PENDING.`
- REQ-137: `VERIFY — canonical post-victory dialogue includes defeated enemy + exact EXP/G once; physical PENDING.`
- REQ-138: `VERIFY — canonical level-up transition surfaced once as LV before→after; physical PENDING.`
- REQ-139: `VERIFY — world dialogue close hint says タップ / Aで閉じる while retaining canonical action() and zero new input handlers; physical PENDING.`

## STORY PROTECTION

- Chapter 1 approved canon and implementation remain protected.
- Chapter 2 is `NOT_DESIGNED`; do not invent continuation.
- Safe autonomous work may improve Chapter-1 gameplay, usability, presentation, robustness, accessibility, system depth, or visual quality without changing protected story facts.
