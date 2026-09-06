# REQ-115 — WIND STAIR RIDGE PRESENTATION POLISH

- ID: `REQ-115`
- TITLE: `Wind Stair Ridge Presentation Polish`
- PRIORITY: `P2`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- COMPLETED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / PRESENTATION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## 1. FRESH PROBLEM EVIDENCE

Fresh `addons/area-title-card.js` contained map-aware subtitles for the northern route through `cloudbreakSaddle`, but the already-published `windStairRidge` map was absent from its subtitle table.

As a result, entering the published `windStairRidge` map fell back to the generic subtitle `LUKE QUEST` instead of receiving the same location-title presentation treatment as adjacent maps.

This was a small player-visible integration gap in an already-existing map and was repaired without advancing story.

## 2. STORY-CANON BOUNDARY

This requirement did NOT:

- create another north map;
- create a new Leon clue, dialogue, story flag or Story Beat;
- decide the Chapter 1 stopping role;
- create/name/age/characterize Leon's sister;
- invent Chapter 2;
- add north-transition authority;
- wire `STORY_CANON.md` into `AUTONOMOUS_DEV_DIRECTIVE.md` early.

Only presentation integration for the already-published map was changed.

## 3. IMPLEMENTATION

Updated `addons/area-title-card.js` so `windStairRidge` now has the spoiler-safe environmental subtitle:

`風鳴りが石段を抜ける北尾根の高所`

Also exposed `windStairRidgeIntegrated:true` in `LQ_AREA_TITLE_STATUS` for fresh runtime auditability.

IMPLEMENTATION_COMMIT: `f97e306d2e6beb2e13e72062eec943cb5348348c`

## 4. P0 SAFETY

No changes were made to:

- REQ-021 Tap Anywhere Action authority;
- REQ-022 iPhone fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership / movement stop;
- save schema;
- collision;
- map coordinates;
- battle / encounter authority.

## 5. VERIFICATION

Pages run `34050169291` for implementation commit `f97e306d2e6beb2e13e72062eec943cb5348348c` completed `SUCCESS`.

The run passed:

- sequential JavaScript validation v08-v80;
- sequential JavaScript validation v81-v120;
- sequential JavaScript validation v121-plus;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- REQ-063 autosave bootstrap validation;
- PWA validation;
- base64 raster transport probe;
- approved Luke dialogue asset validation;
- bootstrap/presentation injection;
- assembled browser smoke;
- floating touch + iPhone world visual-liveness smoke;
- REQ-081 north-route smoke;
- REQ-082 encounter smoke;
- site upload;
- GitHub Pages deployment.

Acceptance status:

- `LQ_AREA_TITLE_STATUS.hasMap('windStairRidge') === true`: PASS by implementation table/runtime status contract.
- subtitle is not generic fallback: PASS.
- environmental/spoiler-safe only: PASS.
- JavaScript/regression/browser/touch-fullscreen gates: PASS.
- Pages deployment: PASS.
- IOS_PHYSICAL_VERIFICATION: `PENDING` until Owner checks an actual iPhone.

## 6. FINAL STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
STATUS: `VERIFY`
IOS_PHYSICAL_VERIFICATION: `PENDING`

EOF
