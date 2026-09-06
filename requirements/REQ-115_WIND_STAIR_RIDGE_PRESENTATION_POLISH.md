# REQ-115 — WIND STAIR RIDGE PRESENTATION POLISH

- ID: `REQ-115`
- TITLE: `Wind Stair Ridge Presentation Polish`
- PRIORITY: `P2`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / PRESENTATION / CANON_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## 1. FRESH PROBLEM EVIDENCE

Fresh `addons/area-title-card.js` contains map-aware subtitles for the northern route through `cloudbreakSaddle`, but the already-published `windStairRidge` map is absent from its subtitle table.

As a result, entering the published `windStairRidge` map falls back to the generic subtitle `LUKE QUEST` instead of receiving the same location-title presentation treatment as adjacent maps.

This is a small player-visible integration gap in an already-existing map. It can be repaired without advancing story.

## 2. STORY-CANON BOUNDARY

This requirement MUST NOT:

- create another north map;
- create a new Leon clue, dialogue, story flag or Story Beat;
- decide the Chapter 1 stopping role;
- create/name/age/characterize Leon's sister;
- invent Chapter 2;
- add north-transition authority;
- wire `STORY_CANON.md` into `AUTONOMOUS_DEV_DIRECTIVE.md` early.

Only presentation integration for the already-published map is authorized.

## 3. IMPLEMENTATION TARGET

Update the existing canonical area-title presentation layer so `windStairRidge` receives a short environmental subtitle consistent with the map name `北尾根・風鳴りの石段`.

The subtitle must be descriptive only and reveal no new plot information.

## 4. P0 SAFETY

MUST NOT alter:

- REQ-021 Tap Anywhere Action authority;
- REQ-022 iPhone fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership / movement stop;
- save schema;
- collision;
- map coordinates;
- battle / encounter authority.

## 5. ACCEPTANCE

- `LQ_AREA_TITLE_STATUS.hasMap('windStairRidge') === true` in the assembled game.
- `subtitle('windStairRidge')` is not the generic `LUKE QUEST` fallback.
- subtitle text is environmental/spoiler-safe only.
- JavaScript validation PASS.
- existing static / contract / assembled-browser / touch-fullscreen regressions PASS.
- Pages deployment SUCCESS before status may move to VERIFY.
- IOS_PHYSICAL_VERIFICATION remains PENDING until Owner checks an actual iPhone.

EOF
