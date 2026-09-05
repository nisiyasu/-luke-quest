# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-06 07:37 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- FRESH_HEAD_AT_AUTOSAVE_START: `4cf9d246ed2bc29798c0e06f98943c488d4c7def`
- LATEST_IMPLEMENTATION_CHECKPOINT: `d7a5e608125eb40d35e74ae81e512116c42c1a9e`
- LATEST_QUEUE_CHECKPOINT_BEFORE_THIS_AUTOSAVE: `4cf9d246ed2bc29798c0e06f98943c488d4c7def`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_PHASE: Phase 2 WORLD + Phase 3 BATTLE + Phase 4 CONTENT + Phase 5 VISUAL QUALITY + Phase 6 POLISH
- CURRENT_BUILD_STATUS: PLAYABLE / PUBLISHED. Fresh implementation includes tap-anywhere canonical Action, iPhone viewport-first world layout, Dynamic Touch Controller v1.4 safety hardening, and the north evacuation-route guidance repair. Fresh HEAD always outranks this autosave.
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED`
- WORK_MANAGER: `WORK_MANAGER.md`
- WORK_QUEUE: `WORK_QUEUE.md`
- ACTIVE_REQUIREMENT_ID: `NONE`
- ACTIVE_REQUIREMENT_PATH: `NONE`
- VERIFY_REQUIREMENTS: `REQ-001, REQ-002, REQ-003, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-020, REQ-021, REQ-022, REQ-023`
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
- Queue-controlled work management is authoritative.
- `WORK_MANAGER.md` defines recovery, WIP=1, priority selection, blocker handling, VERIFY handling, checkpoint behavior, request registration and continuous execution.
- `WORK_QUEUE.md` is authoritative for ORDER / PRIORITY / STATUS.
- No requirement is IN_PROGRESS at this autosave checkpoint.
- REQ-021, REQ-022, REQ-001 and REQ-023 are automated/public-build verified but remain VERIFY because Owner physical iPhone/subjective confirmation is still pending.
- REQ-004 Leon formal full-body dialogue art and REQ-005 Glenn formal full-body dialogue art remain BACKLOG. Do not fabricate final approved character art or silently promote placeholder SVGs to formal status.
- VERIFY does not consume WIP and does not block independent safe development.
- If only Owner-only formal-art BACKLOG remains, selection rules permit registering another directive-authorized player-visible requirement that advances an explicitly unfinished final-game capability without protected-canon changes.
- CURRENT updates, queue updates, commits and Pages success are checkpoints, not execution-stop conditions.

## RECENT_CHECKPOINTS

### REQ-021 — Tap Anywhere Action
- `addons/floating-touch-controller.js` upgraded from movement-only semantics to a unified pointer surface.
- Short stationary touch/pen tap inside the world `gameShell` calls the final runtime canonical `action()` exactly once.
- Drag crossing the dead zone permanently enters movement semantics for that pointer sequence; release never also fires Action.
- Buttons, links, inputs and explicit controls are excluded from global Action.
- Dialogue can be closed with a clean short world tap.
- `addons/zzz-floating-touch-smoke.js` verifies Action single-fire, dialogue close, drag-no-Action and cancel-no-Action.
- Pages run `33995782229` on checkpoint `2c28b2c983911c029a808021b930580e7e1d2796`: SUCCESS.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

### REQ-022 — iPhone Fullscreen World UI
- `addons/zzzz-iphone-fullscreen-world-ui.js` makes world exploration viewport-first using `100dvh` with `100vh` fallback.
- Existing status card is moved into `gameShell` as a compact translucent top overlay.
- Existing controls are moved into `gameShell`, so they no longer consume a separate vertical document-flow block.
- Fixed D-pad remains as a compact translucent lower-left fallback.
- A and MENU remain touchable lower-right overlays with safe-area offsets.
- Dialogue remains a bottom safe-area overlay.
- Camera transforms are recalculated against the expanded shell on render, resize, orientation change and `visualViewport` resize.
- Structural browser assertions verify world class, status/control overlay parentage, viewport-height shell, hidden footer and absolute overlay positioning.
- Pages run `33996056265` on checkpoint `c1928d8557b7c213f749cc299575b6a28689a186`: SUCCESS.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

### REQ-001 — Dynamic Touch Controller v1.4 hardening
- `addons/floating-touch-controller.js` v1.4 retains arbitrary-origin floating four-way movement, dead zone, dominant-axis direction selection, hold movement, live direction switching, pointer ownership and release/cancel/blur/visibility cleanup.
- Dialogue integration was reconciled with REQ-021: a stationary dialogue tap may perform Action, but movement controller visuals and movement are completely suppressed when dialogue was already active at pointerdown.
- Dialogue drag neither moves Luke nor closes the dialogue.
- Movement release still stops and clears fallback timer without Action.
- Combined dedicated touch browser regression passed within Pages run `33996304585`.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

### REQ-023 — North Evacuation Route Critical Guidance
- Owner real-play report was registered as a P0 guidance bug rather than treating the player as responsible for discovering an undocumented mandatory clue.
- `addons/zzzz-evac-route-critical-guidance.js` changes only presentation/guidance.
- Before `withdrawProofSeen`, objective now explicitly says to find and inspect the `撤収命令の切れ端` on the left/lower side.
- Mandatory clue at canonical coordinate `(6,17)` receives a light pulse/`!` marker while uncollected.
- After the existing canonical Action sets `withdrawProofSeen`, objective immediately changes to return to the north edge and enter the cliff road; the clue marker disappears and a light north-exit marker appears.
- Existing flag meaning, gate condition, story text, map coordinates, collision, encounter rate and save semantics are unchanged.
- `addons/zzzzz-evac-guidance-smoke.js` browser-checks both pre-clue and post-clue guidance phases.
- Pages run `33996304585` on checkpoint `d7a5e608125eb40d35e74ae81e512116c42c1a9e`: SUCCESS through syntax, static/add-on contracts, assembled browser smoke, floating-touch smoke, upload and deploy.
- Owner physical iPhone/subjective guidance confirmation remains pending.

## INPUT_SYSTEM_REALITY
- Primary mobile interaction is now one world pointer surface:
  - short tap inside dead zone -> canonical Action
  - drag beyond dead zone -> Dynamic Touch movement
  - drag/hold -> continuous movement
  - direction change while held -> movement direction changes safely
  - pointerup -> immediate stop / no Action after movement
  - pointercancel / blur / hidden -> stop / no Action
- Explicit interactive controls are excluded.
- Dialogue start cannot leave movement active.
- Map transition / non-world screen cleanup remains fail-safe.
- Fixed D-pad and A remain fallback controls until Owner physical iPhone verification is complete.

## IPHONE_FULLSCREEN_UI_REALITY
- World gameplay now uses the available viewport rather than stacking a large controls area below the map.
- Status / location / objective / fallback D-pad / A / MENU / dialogue are overlaid within the game world.
- Safe-area insets are respected for overlays.
- Safari browser chrome itself is not falsely claimed removable by the page.
- `manifest.webmanifest` already uses `display: standalone` and portrait orientation for Home Screen/PWA use.
- Owner physical-device verification remains pending.

## TESTS_AND_VERIFICATION
- REQ-021 dedicated public Pages test: run `33995782229` SUCCESS.
- REQ-022 fullscreen structural + integrated input public Pages test: run `33996056265` SUCCESS.
- REQ-001 v1.4 + REQ-023 combined public Pages test: run `33996304585` SUCCESS.
- Run `33996304585` passed sequential syntax validation, collision-safe add-ons, static regression, add-on contract, PWA/assets, approved Luke art validation, assembled browser smoke, dedicated floating touch/browser assertions, upload and Pages deploy.
- No automated result may be upgraded to Owner physical iPhone PASS.

## KNOWN_ISSUES
- REQ-021: Owner iPhone physical feel/false-positive check pending.
- REQ-022: Owner iPhone visual/readability/fullscreen feel check pending, including Safari versus Home Screen/PWA behavior.
- REQ-001: Owner iPhone drag/hold/direction-change feel check pending.
- REQ-023: Owner should confirm the evacuation-route guidance is now obvious enough without becoming over-directed.
- Formal Leon and Glenn dialogue art remain unresolved Owner-art BACKLOG.

## BLOCKERS
- No repository/runtime blocker for independent safe development at this autosave checkpoint.
- REQ-004 / REQ-005 require formal character-art decisions/assets and must not be fabricated as final approved art.

## NEXT_ACTION
Follow fresh queue selection. If there is still no READY/IN_PROGRESS work after fresh boot, use `WORK_MANAGER.md` selection rule to register the highest-value safe player-visible requirement that does not require Owner-only formal art or protected-canon invention, then continue development.

## NEXT_ACTION_COMPLETION_CONDITION
A safe next requirement is formally registered, implemented against explicit completion conditions, checkpointed, browser/regression tested, published through Pages, queue/CURRENT synchronized, and execution then continues to the next safe unit rather than self-terminating.

## DO_NOT_REPEAT
- Do not revert to fixed-D-pad-only mobile movement.
- Do not restore a large controls block below the world in iPhone world mode.
- Do not implement tap-anywhere via both `click` and `pointerup` and cause double Action.
- Do not allow drag release to fire Action.
- Do not allow dialogue drag to move Luke.
- Do not attach movement release safety only to ephemeral generated control DOM.
- Do not claim iPhone physical verification from headless browser tests.
- Do not restore the vague `退避路の痕跡を調べる` text as the only mandatory-clue guidance.
- Do not change the `withdrawProofSeen` progression rule merely to bypass the guidance problem.
- Do not fabricate Leon/Glenn final formal art.
- Do not use CURRENT as implementation truth when fresh HEAD is ahead.
