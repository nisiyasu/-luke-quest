# LUKE QUEST CURRENT

- UPDATED_AT: 2026-09-07 JST
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY`
- SELF_AUDIT_GUARD: `EXECUTION_SELF_AUDIT_GUARD.md / LOADED_APPLIED`
- CURRENT_BUILD_STATUS: `PLAYABLE / PUBLISHED / REQ-121 PROGRESSION FIX AUTOMATED+PAGES PASS / REQ-119 D1 FORMAL LUKE FIELD ART PUBLISHED / OWNER IPHONE+VISUAL VERIFY PENDING`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `ad22b4c6edcad2283c46add49396a586e794813d`
- LATEST_METADATA_COMMIT_SHA: `823266d0b6005f23ba4f34c95caea1a8ba818548`
- ACTIVE_REQUIREMENT_ID: `REQ-119`
- ACTIVE_REQUIREMENT_PATH: `requirements/REQ-119_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE`
- STORY_CANON_STATUS: `OPENING_CONFIRMED / CHAPTER_01_CORE_CONFIRMED / LEON+SISTER FUTURE PARTY ROLES CONFIRMED / CHAPTER_02_NOT_DESIGNED`
- BLOCKED_REQUIREMENTS: `REQ-059; REQ-113; REQ-114`
- VERIFY_REQUIREMENTS_CURRENT: `REQ-121; REQ-120; REQ-021; REQ-022; REQ-001; REQ-023; REQ-102; REQ-092; REQ-115; REQ-116; historical VERIFY rows in WORK_QUEUE.md`
- QUEUE_PROJECTION_STATUS: `STALE / WORK_QUEUE.md still projects REQ-121 as READY and legacy REQ-117/118. Fresh HEAD + requirement files are current reality; repair queue forward without repeating implementation.`
- NEXT_ACTION: `Continue REQ-119 Checkpoint D2 only. Fresh-audit recurring NPC field-sprite authorities. Luke D1 is already published; do not redo A/B/C/D1. Improve only independent safe NPC presentation that can meet source quality without inventing low-quality placeholder art. If canonical recurring-NPC art authority is absent, record the exact blocker rather than faking completion.`
- NEXT_ACTION_COMPLETION_CONDITION: `REQ-119 full source acceptance honestly satisfied or exact D2 blocker recorded with all independent safe portions complete; touch/input/collision/save/story protected; assembled browser PASS; 390x844 PASS; Pages SUCCESS before VERIFY.`
- DO_NOT_REPEAT: `Do not reimplement REQ-121. Do not recreate Opening REQ-120. Do not redo REQ-119 A/B/C/D1. Do not create another generic north pursuit map. Do not invent Chapter 2. Do not claim iPhone physical or Owner visual PASS from CI. Do not replace approved Luke art with placeholder SVG/CSS art.`

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

Owner should retry `次の高所へ続く石段跡`; physical PASS requires confirmation that it enters `北尾根・風鳴りの石段`.

## ACTIVE REQ-119 — WORLD / CHARACTER VISUAL RICHNESS

Source: `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md`

- A Grounding/Interaction: COMPLETE_AUTOMATED_PUBLIC
- B Map Depth: COMPLETE_AUTOMATED_PUBLIC
- C Ambient Air: COMPLETE_AUTOMATED_PUBLIC
- D Field Sprite Richness: PARTIAL

### D1 Luke formal four-direction field art — COMPLETE_AUTOMATED_PUBLIC

Fresh character asset authority contains only a formal Luke character directory plus the asset contract. Existing formal Luke field raster slots are:

- `assets/characters/luke/field-down.webp.b64`
- `assets/characters/luke/field-up.webp.b64`
- `assets/characters/luke/field-left.webp.b64`
- `assets/characters/luke/field-right.webp.b64`

Implemented `addons/world-field-sprite-richness.js`:

- registers all four existing formal rasters into the canonical `LQ_CHARACTER_ASSETS.luke.field` authority;
- reuses `LQ_loadBase64Asset` and `LQ_applyFormalLukeFieldArt` from `ux-v12.js`;
- no generated replacement raster;
- presentation-only outline/depth treatment;
- no hitbox/input/collision/save/story mutation.

Checkpoint commit `ad22b4c6edcad2283c46add49396a586e794813d`.
Pages run `34059341491`: SUCCESS with sequential JS, collision-safe addons, static/add-on guards, assembled browser, 390x844, REQ-081, REQ-082, upload and deploy all PASS.

### D2 recurring NPC sprite richness — INCOMPLETE

Fresh `assets/characters/` contains no formal recurring-NPC raster directories besides Luke. Do not invent a low-quality placeholder merely to close the requirement. Continue a fresh audit of existing recurring NPC rendering authorities and complete any safe independent presentation improvements; if richer sprite art cannot be supplied without a missing canonical quality source, record that exact blocker.

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

Fresh HEAD and actual requirement files outrank stale index projections. WIP is one IN_PROGRESS requirement. VERIFY does not block independent work. Never repeat committed work merely because `WORK_QUEUE.md` or CURRENT was stale.
