# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-08 04:34 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `302f4c1b8fc6c1294c488bf559754e5a9da95434`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY`
- SELF_AUDIT_GUARD: `EXECUTION_SELF_AUDIT_GUARD.md` / LOADED_APPLIED
- CURRENT_BUILD_STATUS: `P0 INPUT / FULLSCREEN MACHINE RE-AUDIT GREEN at implementation 302f4c1... + regression checkpoint 993cd21...; Pages 34155713639 SUCCESS including touch/iPhone visual smoke and real deploy; Render 34155713656 SUCCESS including Chromium + WebKit iPhone-sized world render; REQ-121 34155713615 attempt 2 SUCCESS after attempt 1 transient Chromium timeout; IOS_PHYSICAL_VERIFICATION=PENDING`
- ACTIVE_REQUIREMENT_ID: `NONE`
- ACTIVE_REQUIREMENT_PATH: `NONE`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`
- BLOCKED_REQUIREMENTS: `REQ-059; REQ-113_CLOUDBREAK_NORTH_PLAYABLE_CONTINUATION; REQ-114_STORY_CANON_WIRING_AFTER_CHAPTER_02`
- READY_REQUIREMENTS: `NONE at fresh queue; remaining non-VERIFY work is BLOCKED or Owner-art BACKLOG.`
- VERIFY_REQUIREMENTS: `REQ-021; REQ-022; REQ-001; REQ-023; REQ-102; REQ-092; REQ-115; REQ-116; other historical VERIFY rows in WORK_QUEUE.md`
- BACKLOG_REQUIREMENTS: `REQ-004, REQ-005` formal Leon/Glen art remain Owner-quality-source dependent.
- SUPERSEDED_REQUIREMENTS: `REQ-035, REQ-091, requirements/REQ-113_STORY_CANON_AUTONOMOUS_WIRING.md`
- QUEUE_PROJECTION_STATUS: `No ordinary IN_PROGRESS or READY row. REQ-021/022/001/023 remain VERIFY under latest Owner P0 re-audit authority; remaining non-VERIFY work is BLOCKED or Owner-art BACKLOG.`
- STORY_CANON_STATUS: `PARTIAL / OPENING_CONFIRMED / CHAPTER_01_CORE_CONFIRMED / CHAPTER_02_NOT_DESIGNED`
- RECENT_CHECKPOINTS: `302f4c1... adds pagehide/BFCache touch ownership cleanup through canonical stop path; 993cd21... proves held-drag pagehide cleanup; ba2d57... + 1c4c718... harden visualViewport offset/scroll clamping; cbd2ae... previously proved visualViewport resize hold preservation.`
- TESTS_AND_VERIFICATION: `Pages 34155713639 SUCCESS including browser assembled game, floating touch + iPhone world visual smoke, route regressions, upload and real Pages deploy; Render Liveness 34155713656 SUCCESS including Chromium + WebKit iPhone-sized world rendering; REQ-121 progression gate 34155713615 attempt 2 SUCCESS after attempt 1 browser timeout.`
- KNOWN_ISSUES: `No confirmed machine regression at 302f4c1/993cd21. REQ-121 attempt 1 timed out in headless Chromium but the unchanged-code failed-job rerun passed all acceptance steps. iPhone physical behavior for VERIFY items remains Owner-confirmation pending.`
- BLOCKERS: `No machine-side blocker for current P0 re-audit. REQ-059 and Chapter 2 Story Canon work remain separately BLOCKED per WORK_QUEUE.`
- NEXT_ACTION: `Continue highest-value safe player-visible P0 audit from fresh HEAD; repair only fresh evidence-backed defects without inventing Chapter 2 or formal Owner-art decisions.`
- NEXT_ACTION_COMPLETION_CONDITION: `Any newly discovered P0 defect is reproduced, repaired, machine-tested and publicly included; otherwise preserve the green P0 baseline and IOS physical verification PENDING.`
- DO_NOT_REPEAT: `Do not clamp Dynamic Touch from visualViewport width/height alone: visualViewport can be offset inside the layout viewport, so preserve offsetLeft/offsetTop and re-clamp on visualViewport scroll without cancelling a valid held drag. Do not treat every visualViewport.resize as a movement-cancel boundary; browser chrome/layout can emit it during a valid drag hold. Do not leave held movement ownership alive across pagehide/BFCache navigation. Do not treat a single headless Chromium timeout as a gameplay regression without an unchanged-code retry. Do not accept a title/menu screenshot as world liveness. Do not use global ?lqSmoke=1 as a clean startup-error baseline. Do not retry GitHub Actions self-edit of workflow files without workflows permission. Do not claim physical iPhone PASS from CI.`
- TOUCH_CONTROLLER_STATUS: `PROTECTED / REQ-001 VERIFY / v1.9 offset-aware + pagehide-safe machine+public green`
- TOUCH_CONTROLLER_BEHAVIOR: `pointerId ownership + dead zone + drag movement + central stop/cleanup + safe-area/visualViewport clamp; visualViewport offsetLeft/offsetTop included in clamp; visualViewport scroll/resize re-clamps while preserving a valid held drag; window resize/orientation hard-stop; pagehide clears ownership/timers through canonical stop.`
- TOUCH_CONTROLLER_KNOWN_ISSUES: `No confirmed machine regression at v1.9 offset/pagehide hardening; physical iPhone behavior remains pending.`
- TOUCH_CONTROLLER_IOS_VERIFICATION: `PENDING`
- TAP_ANYWHERE_ACTION_STATUS: `REQ-021 VERIFY / protected by unified touch smoke`
- IPHONE_FULLSCREEN_UI_STATUS: `REQ-022 VERIFY / 100dvh + safe-area overlays + visualViewport camera recenter protected`

## REQ-127 — IPHONE PWA PERSISTENT BLACK SCREEN RECOVERY

- STATUS: `VERIFY / MACHINE RECOVERY COMPLETE / IOS_PHYSICAL_VERIFICATION=PENDING`.
- Owner evidence before the latest recovery deployment: Home Screen PWA black; audio later absent; app foreground could briefly flash top HUD before returning black.
- Rollback to the physical-good-time candidate `9e6cb573...` did not change the Owner symptom, so post-04:00 source changes alone were not a sufficient explanation.
- Service-worker purge/unregister alone also did not prove recovery.
- Corrected machine visual-liveness now proves a real `world` render before pixel analysis, rather than accidentally accepting the title screen.
- Runtime diagnostics now capture startup errors/rejections, world/player geometry/styles, viewport, center occluder stack, lifecycle/resume events and service-worker state.
- Dedicated `?lqReq127RenderSmoke=1` isolates the world diagnostic from historical global smoke suites.
- Clean render run `34070096956` is SUCCESS with `near_black_ratio=0.265579`, `bright_ratio=0.629712`, `mean_luminance=87.893`, `quantized_color_bins=626`.
- Normal Pages run `34070194697` is SUCCESS.
- Post-Pages recovery run `34070253834` is SUCCESS and verified `346` runtime script URLs are build-SHA-versioned with `dd5f26ed9eaedf03539f3aec9ee14ae7a1823aae`.
- The exact cache-busted recovery artifact passed clean 390x844 world rendering with `near_black_ratio=0.265555`, `bright_ratio=0.629679`, `mean_luminance=87.889`, `quantized_color_bins=626`, then deployed successfully to GitHub Pages.
- This closes the known stable-runtime-URL cache hole without claiming it was definitively the sole root cause.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

## OWNER-APPROVED STORY REALITY — 2026-09-07

### STORY_CANON.md

Fresh Owner authority now records:

- Leon is Eleanor's son.
- Leon has a sister; her name, age and detailed personality remain undecided.
- Eleanor has long boasted publicly that she gave birth to the hero.
- Leon was raised believing he would become the hero.
- Leon is highly capable across many fields but is not uniquely first in all of them.
- Unmotivated Luke has beaten Leon in school combat.
- Leon expected a future awakening that never arrived.
- Leon fled before hero selection because he feared the crystal would not respond to him and his identity/family expectations would collapse.

### Opening / Prologue — CONFIRMED

Owner approved a high-quality playable Opening:

1. cold open / Aldia hero-selection morning;
2. Luke's natural, under-motivated introduction and playable walk through Aldia;
3. school-era Luke-vs-Leon mock battle flashback, with Luke winning;
4. Leon private anxiety scene showing effort, repeated near-top achievement and fear that the crystal will not respond;
5. public hero-selection ceremony where Leon is absent;
6. Luke touches the hero crystal and triggers an abnormal reaction far beyond a normal selection;
7. Luke is recognized as hero and reacts with natural confusion rather than heroic swagger;
8. Eleanor publicly congratulates Luke while privately showing unexplained shock;
9. report arrives that Leon left toward the monster forest;
10. Luke receives his first mission: retrieve Leon;
11. title / Chapter 1 handoff into the existing playable route.

Protected late-game truths remain unrevealed.

### Chapter 1 climax — CONFIRMED

- Luke eventually reaches Leon.
- Leon learns Luke was chosen as hero.
- Leon's accumulated resentment and identity collapse erupt.
- Leon attacks Luke.
- Luke has no desire to fight and only defends, remaining naturally confused/non-hostile.
- Leon's sister physically steps between them.
- Leon accidentally wounds his sister.
- The injury is not fatal at this point.
- Leon immediately regains awareness of what he is doing.
- Luke prioritizes helping the injured sister rather than condemning Leon.
- Eleanor remains outwardly benevolent and does not reveal her hidden past.
- Luke, Leon, Leon's sister and Eleanor return to the kingdom.
- This return is the end of Chapter 1.

### Chapter 2

- STATUS: `NOT_DESIGNED`.
- Do not invent it autonomously.
- REQ-114 global Story Canon wiring remains BLOCKED until Chapter 2 is sufficiently Owner-designed.

## REQ-117 — WORLD / CHARACTER VISUAL RICHNESS UPGRADE

- STATUS: `VERIFY`.
- Owner-directed major presentation improvement.
- Scope includes character foot shadows, restrained idle animation, interaction popup easing, map edge blending, depth/drop shadows, ambient air particles and field-sprite richness principles.
- Preserve canonical touch/input/collision/save/story authorities.
- Do not replace approved Luke art with a lower-quality placeholder simply for convenience.

## REQ-118 — HIGH-QUALITY HERO SELECTION OPENING

- STATUS: `VERIFY`.
- Latest Owner-approved story implementation request.
- Dedicated requirement: `requirements/REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING.md`.
- Fresh NEW GAME should receive the playable Opening through a safe integration with actual title/newGame architecture.
- Existing progressed saves must not be forced backward through the Opening.
- Opening implementation should use staged recoverable checkpoints rather than one opaque mega-write.
- Must preserve REQ-021 Tap Anywhere Action, REQ-022 iPhone Fullscreen World UI and REQ-001 Dynamic Touch Controller.
- Must end in a valid existing Chapter 1 playable state.
- IOS_PHYSICAL_VERIFICATION: `PENDING` until Owner confirms actual device.

## P0 INPUT / FULLSCREEN — PROTECTED

### REQ-021 — Tap Anywhere Action

- STATUS: `VERIFY`.
- Canonical short-tap Action remains protected.
- Drag/cancel/stale release must not become Action.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

### REQ-022 — iPhone Fullscreen World UI

- STATUS: `VERIFY`.
- `100dvh`, safe-area-aware viewport-primary world and floating overlays remain protected.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

### REQ-001 — Dynamic Touch Controller

- STATUS: `VERIFY`.
- pointerId ownership, dead zone, live direction switching and central stop/cleanup remain protected.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

## RECENT VERIFIED PLAYER-VISIBLE CHECKPOINTS

- REQ-106 `windShelf`: VERIFY / published.
- REQ-107 `skylineTraverse`: VERIFY / published.
- REQ-108 `cloudbreakSaddle`: VERIFY / published.
- REQ-109 north-route compass: VERIFY / published.
- REQ-110 mobile resume orientation toast: VERIFY / published.
- REQ-111 tap-first interaction affordance: VERIFY / published.
- REQ-112 first-touch gesture coach: VERIFY / published.
- REQ-115 windStair area title: VERIFY / published.
- REQ-116 windStair environmental continuity: VERIFY / published.
- Do not reimplement these without fresh defect evidence.

## MANDATORY CONTINUATION

Every future execution must fresh-load repository metadata, actual default branch, HEAD, `AUTONOMOUS_DEV_DIRECTIVE.md`, `EXECUTION_SELF_AUDIT_GUARD.md`, `WORK_MANAGER.md`, `WORK_QUEUE.md`, `CURRENT.md`, active/re-audit requirements, relevant implementation files, recent commits/workflow/Pages state, and current `STORY_CANON.md` when story-related work is selected.

Fresh HEAD and actual requirement contents outrank stale projections. WIP remains one IN_PROGRESS. VERIFY does not block independent work. A blocked story-continuation item does not block approved Opening or canon-safe presentation work. Commits, Pages success and CURRENT autosaves are checkpoints, not autonomous stop conditions.

## REQ-117 — WORLD / CHARACTER VISUAL RICHNESS UPGRADE — MACHINE COMPLETE

- STATUS: `VERIFY`.
- Checkpoint A repaired canonical grounding authority and stale CI references; foot shadow/idle/prompt easing are presentation-only.
- Checkpoint B keeps map depth while removing per-tile filter/isolation compositor layers on iPhone-sensitive paths.
- Checkpoint C caps mobile ambient work and removes fog blur/filter while preserving map-aware atmosphere/lifecycle cleanup.
- Checkpoint D preserves approved Luke 4-direction × 3-frame raster, routes it through the canonical visual body, and prevents sprite rerender from deleting the foot-shadow/body wrapper.
- Dedicated A/B/C/D gate `34074892503`: SUCCESS. Pages `34074892512`: SUCCESS. Render Liveness `34074892523`: SUCCESS. REQ-121 regression `34074892552`: SUCCESS.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.


## REQ-118 — HIGH-QUALITY HERO SELECTION OPENING — MACHINE COMPLETE

- STATUS: `VERIFY`.
- Full A-through-H integration run `34076886814`: SUCCESS.
- Standard Pages `34076886815`: SUCCESS.
- Render Liveness `34076886817`: SUCCESS.
- REQ-121 progression regression `34076886818`: SUCCESS.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

## REQ-128 — CHAPTER 1 CLIMAX — ACTIVE

- STATUS: `IN_PROGRESS`.
- Requirement: `requirements/REQ-128_CHAPTER_01_CLIMAX_LEON_CONFRONTATION.md`.
- Authority: Owner-confirmed `STORY_CANON.md` Chapter 1 core only.
- Protected unknowns: sister name/age/detailed personality; Chapter 2.
- Required shape: reach Leon -> hero revelation -> nonlethal defensive confrontation -> sister interruption/nonfatal wound -> Luke aids her -> return to kingdom -> Chapter 1 end.
- Next: fresh-audit actual route/Leon/battle/save/input implementation before coding.

## REQ-131 — CHAPTER 1 COMPLETE NPC DIALOGUE CLOSURE — MACHINE COMPLETE

- STATUS: `VERIFY`.
- Requirement: `requirements/REQ-131_CHAPTER_01_COMPLETE_NPC_DIALOGUE_CLOSURE.md`.
- Implementation checkpoint: `4f67718f7654de7640105fec0ecc5abb757142e5`.
- `chapter1Complete` is the terminal dialogue stage and outranks stale pursuit flags.
- Existing reactive NPC stages 0-5 remain intact; terminal lines contain no active north/pursuit instruction.
- Cache-busted Pages recovery run `34095873109`: SUCCESS.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.

## BOOT REALITY REPAIR — 2026-09-07 17:18 JST

- SELF_AUDIT_GUARD: `LOADED_APPLIED`.
- BOOT_REALITY_AUDIT: `REPAIRED`.
- OWNER_PRIORITY_AUDIT: `PASS`.
- EXECUTION_DEGRADATION_STATUS: `DETECTED_REPAIRED` because CURRENT/QUEUE lagged committed REQ-131 work.
- SELF_REPAIR_ACTIONS: `Registered REQ-131 in WORK_QUEUE and synchronized CURRENT to fresh HEAD/public evidence.`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.

## REQ-132 — CHAPTER 1 COMPLETE ROUTE GUIDANCE CLOSURE — ACTIVE

- STATUS: `IN_PROGRESS`.
- Fresh audit proved stale post-completion pursuit copy/markers outside the canonical MAIN OBJECTIVE.
- Guarded surfaces: NORTH ROUTE COMPASS, northCliffRoad local guidance, windcutPass local guidance.
- Implementation checkpoints: `4946494732c5b6602f2164c6099cc2946498b982`, `0678aca1f787ff22cc504b0f4a4ecd20312079fa`, `eeee93508d7e7db20fe20c7e6691db8b8de7fca4`.
- Normal Pages run `34100767214`: SUCCESS.
- Dedicated terminal/pre-completion regression: PENDING.
- Chapter 2 destination/objective remains intentionally undefined.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.


## REQ-133 — CHAPTER 1 COMPLETE UPPER PURSUIT GUIDANCE CLOSURE — ACTIVE

- STATUS: `IN_PROGRESS`.
- Fresh audit found stale always-on pursuit guide+marker UI on `windShelf`, `skylineTraverse`, and `cloudbreakSaddle` after `chapter1Complete`.
- A presentation-only late guard removes only those active command projections after Chapter 1 completion; maps, traversal, encounters and environmental history remain unchanged.
- Deterministic assembled-browser smoke proves unfinished visible -> completion hidden -> unfinished restoration for all three maps.
- Standard Pages `34106696700`: SUCCESS.
- REQ-121 route regression `34106696470`: SUCCESS.
- REQ-128 Chapter 1 climax regression `34106697030`: SUCCESS.
- Render Liveness: PENDING at this autosave.
- Chapter 2 remains intentionally undesigned.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.


## BOOT REALITY REPAIR — 2026-09-07 20:28 JST

- SELF_AUDIT_GUARD: `LOADED_APPLIED`.
- BOOT_REALITY_AUDIT: `REPAIRED`.
- OWNER_PRIORITY_AUDIT: `REPAIRED`: latest loader explicitly re-calls REQ-021 -> REQ-022 -> REQ-001 as absolute P0 re-audit authority.
- EXECUTION_DEGRADATION_STATUS: `DETECTED_REPAIRED`: CURRENT still listed REQ-121/117/118 as READY even though fresh queue/requirements are VERIFY, and REQ-133 had completed machine/public gates while metadata still said Render pending.
- SELF_REPAIR_ACTIONS: `REQ-133 promoted VERIFY; stale READY projection removed; active authority returned to P0 input re-audit; fresh controller/fullscreen implementation and current Pages touch gate re-read.`
- REQ-133 EVIDENCE: `Pages 34106890062 SUCCESS; Render Liveness 34106890050 SUCCESS; cache-busted public deploy 34106990439 SUCCESS.`
- REQ-021 RE-AUDIT HARDENING: `1421c9e8... adds stationary >420ms long-press release => no Action/no movement/cleanup regression under ?lqTouchSmoke=1.`
- REQ-001 RE-AUDIT HARDENING: `c0cae32a... adds first-pointer ownership / second-touch cannot steal movement regression under ?lqTouchSmoke=1.`
- REQ-022 FRESH REALITY: `100dvh world, safe-area overlays, transparent controls plane and 390x844 geometry gate remain present at fresh HEAD.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`.
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.

## BOOT REALITY REPAIR — 2026-09-08 02:24 JST

- SELF_AUDIT_GUARD: `LOADED_APPLIED`.
- BOOT_REALITY_AUDIT: `REPAIRED`: CURRENT checkpoint lagged fresh HEAD and the previous run's P0 touch hardening.
- OWNER_PRIORITY_AUDIT: `PASS`: Owner absolute order REQ-021 -> REQ-022 -> REQ-001 remains the active re-audit authority; no lower-priority IN_PROGRESS work preempts it.
- EXECUTION_DEGRADATION_STATUS: `DETECTED_REPAIRED`: previous handoff explicitly left CURRENT stale; this run synchronized it forward before continuing.
- SELF_REPAIR_ACTIONS: `Fresh-loaded P0 requirements and implementations; added Dynamic Touch v1.8 visualViewport resize cleanup; added deterministic visualViewport held-gesture smoke; synchronized CURRENT to implementation HEAD.`
- REQ-001 HARDENING: `5fe1a30f... adds visualViewport.resize -> central stop/reset; c86b3bc... makes the browser smoke actively prove the cleanup and requires version 1.8/visualViewportChangeStops.`
- REQ-022 INTEGRATION NOTE: `Fullscreen camera already listens to visualViewport.resize. Dynamic Touch now revokes a held pointer on the same event before/alongside layout recentering, closing the cross-system viewport-change gap.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`.
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.

## P0 VISUAL VIEWPORT REGRESSION REPAIR — 2026-09-08 02:32 JST

- STATUS: `REPAIRED / PUBLIC GREEN / IOS_PHYSICAL_VERIFICATION=PENDING`.
- The v1.8 attempt (`5fe1a30f...` + `c86b3bc...`) was rejected by standard Pages run `34147501517`: the touch smoke observed `movedRight=true` while `rightActive=false` and `upActive=false`, proving that stopping on every `visualViewport.resize` could kill an otherwise valid held drag during ordinary render/browser-chrome changes.
- SELF_REPAIR: v1.9 implementation `2ab5511a...` changes `visualViewport.resize` from a central-stop boundary to an active-pad re-clamp against the current visible viewport dimensions, while preserving hard central stop on `window.resize` and `orientationchange`.
- REGRESSION TEST: `cbd2ae...` now actively dispatches a visualViewport resize during a valid held drag and requires pointer ownership/direction to remain active, followed by clean pointerup stop/cleanup.
- PAGES: `34147751164 SUCCESS` including assembled game, floating touch + iPhone world visual smoke, route regressions, upload and real Pages deploy.
- RENDER_LIVENESS: `34147751148 SUCCESS` including Chromium and WebKit world rendering.
- CACHE_BUSTED_PUBLIC: `34147812799 SUCCESS`.
- REQ-021 / REQ-022 / REQ-001: `VERIFY / MACHINE+PUBLIC GREEN`.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.
- DO_NOT_REPEAT: `Do not treat every visualViewport.resize as a logical movement-cancel boundary; dynamic browser chrome/layout can emit it during a valid drag hold.`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.

## P0 VISUAL VIEWPORT OFFSET / SCROLL HARDENING — 2026-09-08 04:25 JST

- STATUS: `REPAIRED / PUBLIC GREEN / IOS_PHYSICAL_VERIFICATION=PENDING`.
- FRESH DEFECT: Dynamic Touch v1.9 clamped against visualViewport width/height but ignored `offsetLeft` / `offsetTop` and did not listen for visualViewport `scroll`, leaving a shifted visual viewport able to move the visible region away from the controller clamp origin.
- IMPLEMENTATION: `ba2d57b0ceba8d0f2523a9ce3eac70187a5b1a7a` adds visual viewport metrics including offsets, applies them to safe-area-aware clamp bounds, and re-clamps on visualViewport `scroll` while preserving a valid held drag.
- REGRESSION: `1c4c71891f6cbe82bd1f5f6d7604a694058274f6` adds an inert-unless-`?lqTouchSmoke=1` probe that starts a held right drag, forces stale recorded offsets, dispatches visualViewport scroll, requires immediate offset re-sync + held direction preservation, then requires clean pointerup cleanup.
- PAGES: `34155391562 SUCCESS`; browser assembled game, floating touch + iPhone world visual liveness, route regressions, upload and real GitHub Pages deploy all passed.
- RENDER_LIVENESS: `34155391566 SUCCESS`; Chromium and WebKit iPhone-sized world screenshot/pixel analysis both passed.
- REQ-021 / REQ-022 / REQ-001: `VERIFY / MACHINE+PUBLIC GREEN`.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.
- DO_NOT_REPEAT: `Do not assume visualViewport starts at layout coordinate 0,0; width/height alone are not sufficient for a visible-viewport clamp.`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.

## P0 PAGEHIDE / BFCACHE TOUCH RELEASE HARDENING — 2026-09-08 04:34 JST

- STATUS: `REPAIRED / PUBLIC GREEN / IOS_PHYSICAL_VERIFICATION=PENDING`.
- FRESH DEFECT: Dynamic Touch cleanup covered pointercancel, blur, visibilitychange, viewport resize/orientation, dialogue/battle/map transitions, but not `pagehide`, leaving pointer ownership/timers without an explicit release path when the page enters history/BFCache navigation.
- IMPLEMENTATION: `302f4c1b8fc6c1294c488bf559754e5a9da95434` wires `pagehide` into the existing canonical cancel/stop/reset path; no parallel movement logic was added.
- REGRESSION: `993cd21ac5827fa7dc8a4e0576b5ab9aef4130df` extends the inert `?lqTouchSmoke=1` probe to start a held drag, dispatch persisted pagehide, require hidden controller/no active direction/no timer, and prove a stale later pointerup cannot resurrect state.
- PAGES: `34155713639 SUCCESS`; browser assembled game, unified floating-touch + iPhone visual smoke, route regressions, upload and real GitHub Pages deploy all passed.
- RENDER_LIVENESS: `34155713656 SUCCESS`; Chromium and WebKit iPhone-sized world rendering both passed.
- REQ-121: `34155713615 attempt 1 FAILURE` was a headless Chromium timeout before DOM acceptance, not a gameplay assertion. The unchanged-code failed-job rerun `attempt 2 SUCCESS` passed syntax, assembly, canonical Action transition acceptance and evidence preservation, so no code rollback was warranted.
- REQ-021 / REQ-022 / REQ-001: `VERIFY / MACHINE+PUBLIC GREEN`.
- IOS_PHYSICAL_VERIFICATION: `PENDING`.
- DO_NOT_REPEAT: `Do not retain held movement ownership across pagehide/BFCache entry; do not diagnose a single headless browser timeout as a gameplay defect before an unchanged-code retry.`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`.