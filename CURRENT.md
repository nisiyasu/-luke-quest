# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-07 09:35 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `dd5f26ed9eaedf03539f3aec9ee14ae7a1823aae`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY`
- SELF_AUDIT_GUARD: `EXECUTION_SELF_AUDIT_GUARD.md` / LOADED_APPLIED
- CURRENT_BUILD_STATUS: `REQ-127 MACHINE-STABLE / NORMAL PAGES SUCCESS / CACHE-BUSTED RECOVERY DEPLOY SUCCESS / IOS_PHYSICAL_VERIFICATION=PENDING`
- ACTIVE_REQUIREMENT_ID: `REQ-127`
- ACTIVE_REQUIREMENT_PATH: `requirements/REQ-127_IPHONE_PWA_PERSISTENT_BLACK_SCREEN_RECOVERY.md`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`
- BLOCKED_REQUIREMENTS: `REQ-059; REQ-113_CLOUDBREAK_NORTH_PLAYABLE_CONTINUATION; REQ-114_STORY_CANON_WIRING_AFTER_CHAPTER_02`
- READY_REQUIREMENTS: `REQ-121_CLOUDBREAK_WIND_STAIR_TRANSITION_DEADLOCK_FIX; REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE; REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING`
- VERIFY_REQUIREMENTS: `REQ-021; REQ-022; REQ-001; REQ-023; REQ-102; REQ-092; REQ-115; REQ-116; other historical VERIFY rows in WORK_QUEUE.md`
- BACKLOG_REQUIREMENTS: `REQ-004, REQ-005` formal Leon/Glen art remain Owner-quality-source dependent.
- SUPERSEDED_REQUIREMENTS: `REQ-035, REQ-091, requirements/REQ-113_STORY_CANON_AUTONOMOUS_WIRING.md`
- QUEUE_PROJECTION_STATUS: `REQ-127 is the absolute P0 IN_PROGRESS incident. Do not select unrelated READY work while black-screen physical recovery remains unresolved.`
- STORY_CANON_STATUS: `PARTIAL / OPENING_CONFIRMED / CHAPTER_01_CORE_CONFIRMED / CHAPTER_02_NOT_DESIGNED`
- RECENT_CHECKPOINTS: `ef184888... world-state proof before pixel PASS; 79b0cae0... PWA runtime diagnostics; 6c9fff52... isolated REQ-127 world smoke; 16590c97... clean SHA-versioned render diagnostic; b40204e6... post-Pages cache-busted recovery deploy; dd5f26ed... incident evidence sync.`
- TESTS_AND_VERIFICATION: `Render run 34070096956 SUCCESS: 390x844 clean world, near_black=0.265579, bright=0.629712, 626 color bins. Normal Pages run 34070194697 SUCCESS. Cache-busted recovery run 34070253834 SUCCESS: 346 runtime script URLs versioned with build SHA dd5f26ed..., clean world pixel PASS near_black=0.265555, bright=0.629679, 626 color bins, deployment SUCCESS.`
- KNOWN_ISSUES: `Last Owner physical evidence before the new cache-busted deployment was still a black iPhone Home Screen PWA. Chromium/public-artifact machine checks are healthy, so remaining uncertainty is physical iPhone PWA/WebKit state. IOS_PHYSICAL_VERIFICATION=PENDING.`
- BLOCKERS: `No machine-side blocker. Exact Owner iPhone Home Screen WebKit state is not reproducible in the current CI environment.`
- NEXT_ACTION: `Keep REQ-127 as active P0. Preserve the cache-busted recovery deployment and diagnostics; do not restore broad post-04:00 feature work. On next fresh run, verify HEAD/Pages/recovery workflow truth first and continue only evidence-producing black-screen work until Owner physical evidence changes.`
- NEXT_ACTION_COMPLETION_CONDITION: `Machine gates remain green; exact cache-busted public artifact remains deployed; no regression in P0 input/fullscreen; physical iPhone recovery is not claimed until Owner confirms.`
- DO_NOT_REPEAT: `Do not accept a title/menu screenshot as world liveness. Do not use global ?lqSmoke=1 as a clean startup-error baseline. Do not retry GitHub Actions self-edit of workflow files without workflows permission. Do not restore the broad post-04:00 feature range before black-screen isolation is stable. Do not claim physical iPhone PASS from CI.`
- TOUCH_CONTROLLER_STATUS: `PROTECTED / REQ-001 VERIFY`
- TOUCH_CONTROLLER_BEHAVIOR: `pointerId ownership + dead zone + drag movement + central stop/cleanup remain protected.`
- TOUCH_CONTROLLER_KNOWN_ISSUES: `No new machine regression observed during REQ-127 recovery; physical iPhone behavior remains pending.`
- TOUCH_CONTROLLER_IOS_VERIFICATION: `PENDING`
- TAP_ANYWHERE_ACTION_STATUS: `REQ-021 VERIFY / protected during REQ-127 recovery`
- IPHONE_FULLSCREEN_UI_STATUS: `REQ-022 VERIFY / protected during REQ-127 recovery`

## REQ-127 — IPHONE PWA PERSISTENT BLACK SCREEN RECOVERY

- STATUS: `IN_PROGRESS / ABSOLUTE P0`.
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

- STATUS: `READY`.
- Owner-directed major presentation improvement.
- Scope includes character foot shadows, restrained idle animation, interaction popup easing, map edge blending, depth/drop shadows, ambient air particles and field-sprite richness principles.
- Preserve canonical touch/input/collision/save/story authorities.
- Do not replace approved Luke art with a lower-quality placeholder simply for convenience.

## REQ-118 — HIGH-QUALITY HERO SELECTION OPENING

- STATUS: `READY`.
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
