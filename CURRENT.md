# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-07 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY`
- SELF_AUDIT_GUARD: `EXECUTION_SELF_AUDIT_GUARD.md / LOADED_APPLIED`
- BOOT_REALITY_AUDIT: `REPAIRED / fresh HEAD recovered REQ-121 published fix and REQ-119 D1; stale queue projection still requires forward repair`
- OWNER_PRIORITY_AUDIT: `PASS / REQ-121 hard progression blocker already implemented and published before continuing visual work`
- EXECUTION_DEGRADATION_STATUS: `NONE`
- CURRENT_BUILD_STATUS: `PLAYABLE / PUBLISHED / REQ-121 PROGRESSION FIX AUTOMATED+PAGES PASS / REQ-119 A+B+C+D1+D2_SAFE PUBLIC PASS / FORMAL RECURRING NPC ART BLOCKED / OWNER IPHONE+VISUAL VERIFY PENDING`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `92afc38240a12769f24a0ee9c87e9d7d423ebe5b`
- LATEST_METADATA_COMMIT_SHA: `5503a0a2f8ffe0fe65632883ddd4b23e2a4beb03`
- ACTIVE_REQUIREMENT_ID: `NONE`
- ACTIVE_REQUIREMENT_PATH: `NONE`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`
- STORY_CANON_STATUS: `OPENING_CONFIRMED / CHAPTER_01_CORE_CONFIRMED / LEON+SISTER FUTURE PARTY ROLES CONFIRMED / CHAPTER_02_NOT_DESIGNED`
- BLOCKED_REQUIREMENTS: `REQ-059; REQ-113; REQ-114; REQ-119`
- VERIFY_REQUIREMENTS_CURRENT: `REQ-121; REQ-120; REQ-021; REQ-022; REQ-001; REQ-023; REQ-102; REQ-092; REQ-115; REQ-116; historical VERIFY rows in WORK_QUEUE.md`
- QUEUE_PROJECTION_STATUS: `STALE / WORK_QUEUE.md still projects REQ-121 as READY and legacy REQ-117/118; fresh requirement files and HEAD are authoritative until queue is repaired forward.`
- SELF_REPAIR_ACTIONS: `Recovered REQ-121 as already published VERIFY; continued actual IN_PROGRESS REQ-119 D2; published safe recurring-NPC presentation polish; recorded exact formal-NPC-art blocker without fake completion.`
- NEXT_ACTION: `Repair WORK_QUEUE forward to actual successor/status reality, then select the next highest-value safe player-visible work under WORK_MANAGER. Do not repeat REQ-121 or REQ-119 completed checkpoints.`
- NEXT_ACTION_COMPLETION_CONDITION: `queue projection matches fresh requirement/HEAD reality; WIP=1; selected next work has no protected-canon or unavailable-formal-art dependency.`
- DO_NOT_REPEAT: `Do not reimplement REQ-121. Do not recreate Opening REQ-120. Do not redo REQ-119 A/B/C/D1/D2-safe. Do not invent low-quality formal NPC raster art. Do not create another generic north pursuit map. Do not invent Chapter 2. Do not claim iPhone physical or Owner visual PASS from CI.`

## REQ-121 — CLOUDBREAK → WIND STAIR PROGRESSION DEADLOCK

STATUS: `VERIFY`

- single transition authority: `addons/zzzz-req121-cloudbreak-wind-stair-transition.js`
- `cloudbreakSaddle / lqCloudbreakBoundary` → existing `windStairRidge`
- safe entry `[11,18]`, safe return `[10,2]`
- no new story flag / save schema / north map
- dedicated late assembled smoke: `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req121-cloudbreak-wind-stair-smoke.js`
- published implementation commit: `f98a0847ffb1ed34edeafc6ae25045608f5a6186`
- Pages run `34058848513`: SUCCESS
- assembled browser / 390x844 / REQ-081 / REQ-082: PASS
- `IOS_PHYSICAL_VERIFICATION: PENDING`

Owner physical PASS requires confirmation that `次の高所へ続く石段跡` enters `北尾根・風鳴りの石段`.

## REQ-119 — WORLD / CHARACTER VISUAL RICHNESS

STATUS: `BLOCKED`

Source: `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md`

- A Grounding/Interaction: COMPLETE_AUTOMATED_PUBLIC
- B Map Depth: COMPLETE_AUTOMATED_PUBLIC
- C Ambient Air: COMPLETE_AUTOMATED_PUBLIC
- D1 Luke formal four-direction field art: COMPLETE_AUTOMATED_PUBLIC
- D2 safe recurring-NPC presentation: COMPLETE_AUTOMATED_PUBLIC
- D2 final formal recurring-NPC sprite acceptance: BLOCKED

### D1 Luke formal art

- implementation: `addons/world-field-sprite-richness.js`
- commit: `ad22b4c6edcad2283c46add49396a586e794813d`
- Pages run `34059341491`: SUCCESS

### D2 recurring NPC safe presentation

- implementation: `addons/world-npc-sprite-polish.js`
- commit: `92afc38240a12769f24a0ee9c87e9d7d423ebe5b`
- preserves canonical emoji/glyph identities; does not claim fake formal raster art
- clean silhouette outline + role-distinct three-tone presentation plates for representative recurring NPCs
- pointer transparent; no coordinate/input/collision/save/story/dialogue-art mutation
- dedicated assembled smoke verifies multiple NPC coverage, distinct roles, pointer transparency, story-state preservation and input/fullscreen authority preservation
- Pages run `34061027938`: SUCCESS
- sequential JS / collision-safe add-ons / static regression / add-on contract / autosave bootstrap / PWA / raster checks / assembled browser / 390x844 / REQ-081 / REQ-082 / deploy: PASS

EXACT_BLOCKER: `FORMAL_RECURRING_NPC_FIELD_ART_SOURCE_UNAVAILABLE`

The visual directive forbids treating emoji/CSS-only people as final quality. Fresh `assets/characters/` has no approved recurring-NPC raster authority besides Luke. Unblock only when canonical recurring-NPC field art or a proven generation-to-repository binary handoff becomes available.

`IMPLEMENTATION_COMPLETE: NO`
`OWNER_VISUAL_APPROVAL: PENDING`
`IOS_PHYSICAL_VERIFICATION: PENDING`

## STORY / CONTENT BOUNDARY

Canonical detail lives in `STORY_CANON.md`.

- Opening successor `REQ-120`: VERIFY
- Chapter 1 core: confirmed
- Leon future role: warrior/frontliner
- Leon sister future role: healer/cleric-type, joins because she worries about her brother
- Chapter 2: `NOT_DESIGNED`
- REQ-114 remains BLOCKED until Owner designs Chapter 2 sufficiently

## BOOT / RECOVERY RULE

Fresh HEAD and actual requirement files outrank stale index projections. WIP is one IN_PROGRESS requirement. VERIFY does not block independent work. Never repeat committed work merely because `WORK_QUEUE.md` or CURRENT is stale.
