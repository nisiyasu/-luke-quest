# REQ-119 — WORLD / CHARACTER VISUAL RICHNESS UPGRADE

STATUS: BLOCKED
PRIORITY: P1
TYPE: PLAYER_VISIBLE_PRESENTATION / MAP_VISUALS / FIELD_CHARACTER_VISUALS / UX_POLISH
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`
SOURCE_REQUIREMENT: `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md`
ID_RECOVERY: `REQ-117 collided with an earlier Wind Stair guard. This file is the unique active successor for the Owner visual-richness request.`

## MANDATORY SOURCE LOAD

Before implementation or verification, fresh-read `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md` in full and apply every requirement there as the detailed specification for REQ-119. Do not shorten, omit, or reinterpret that source merely because this successor file is compact.

## CURRENT RECOVERY

Checkpoint A — Grounding and Interaction Polish:

- implementation: `addons/world-character-grounding.js`
- original checkpoint commit: `1b834a542a70ef36775e11e8aeda4d0d8ae23d31`
- relabeled/recovered under unique REQ-119 by commit `6441e0cadfaf03019671ac6fa89311d9adfbfc2a`
- universal player/NPC elliptical foot shadows
- restrained idle breathing motion
- interaction-prompt ease-in
- public descendant gates have passed

Checkpoint B — Map Depth:

- implementation: `addons/world-map-depth.js`
- checkpoint commit: `7cc4ebaa202e311299f15e98d2422649acc91d2f`
- neighbor-aware boundary treatment and restrained height/drop-shadow presentation
- public descendant gates have passed

Checkpoint C — Ambient Air:

- implementation: `addons/world-ambient-layer.js`
- checkpoint commit: `fc6397574c61673a167159304ddec4e97a6683b4`
- map-sensitive restrained ambient layer with reduced-motion / cleanup safeguards
- public descendant gates have passed

Checkpoint D — Field Sprite Richness:

### D1 formal Luke four-direction field art wiring — COMPLETE_AUTOMATED_PUBLIC

Fresh asset authority confirmed the existing formal raster slots:

- `assets/characters/luke/field-down.webp.b64`
- `assets/characters/luke/field-up.webp.b64`
- `assets/characters/luke/field-left.webp.b64`
- `assets/characters/luke/field-right.webp.b64`

`ux-v12.js` already had the canonical formal field loader but no field specs were registered, so those approved assets were not being selected as Luke's formal world art.

Implemented `addons/world-field-sprite-richness.js` at commit `ad22b4c6edcad2283c46add49396a586e794813d`:

- registers all four existing canonical Luke raster directions as formal WebP field assets;
- reuses the existing `LQ_loadBase64Asset` and `LQ_applyFormalLukeFieldArt` authority;
- does not regenerate or replace approved raster bytes;
- adds presentation-only dark silhouette/grounding treatment;
- does not change hitbox, input, collision, save or story state;
- exposes `LQ_REQ119_CHECKPOINT_D_STATUS` and validates all four formal directions.

Public gate:

- Pages run `34059341491`: SUCCESS
- sequential JS validation: PASS
- collision-safe add-on validation: PASS
- static/add-on contract guards: PASS
- assembled browser smoke: PASS
- 390x844 touch/fullscreen visual-liveness: PASS
- REQ-081: PASS
- REQ-082: PASS
- upload/deploy: PASS

### D2 recurring NPC sprite richness — SAFE PRESENTATION PORTION COMPLETE / FORMAL ART BLOCKED

Fresh asset and render audit confirmed that recurring field NPCs are still sourced from the existing emoji/glyph identities in the canonical world render. `assets/characters/` contains no formal recurring-NPC raster directories besides Luke. The global visual directive explicitly forbids treating emoji/CSS-only people as final character quality.

Implemented the independent safe presentation portion in `addons/world-npc-sprite-polish.js` at commit `92afc38240a12769f24a0ee9c87e9d7d423ebe5b`:

- preserves existing NPC source identity rather than inventing replacement raster bytes;
- adds a clean silhouette outline for recurring field NPCs;
- adds role-distinct three-tone shadow/base/highlight palette plates for representative recurring NPC roles;
- covers the town elder, shopkeeper, temple acolyte, field farmer, Leon, Demon Army guard and Glenn when those canonical glyphs are rendered;
- uses the existing `lqEntityVisualBody` presentation wrapper and keeps all new visual plates pointer-transparent;
- changes no NPC tile coordinates, hitboxes, interaction facing, input, collision, save schema, story flags or dialogue-art authority;
- dedicated `?lqSmoke` acceptance verifies multiple recurring town NPCs, distinct role palettes, outline/presentation attachment, pointer transparency, unchanged story flags, Tap Anywhere authority and fullscreen authority.

Public gate for D2 safe portion:

- Pages run `34061027938`: SUCCESS
- sequential JavaScript validation: PASS
- collision-safe add-ons: PASS
- static regression guard: PASS
- add-on contract guard: PASS
- autosave bootstrap/PWA/raster transport/Luke dialogue asset validation: PASS
- assembled browser smoke: PASS
- 390x844 touch/fullscreen smoke: PASS
- REQ-081: PASS
- REQ-082: PASS
- upload/deploy: PASS

This is deliberately NOT claimed as final recurring-NPC pixel-art acceptance. The remaining source acceptance asks for genuinely rich recurring NPC field sprites, including richer costume/facial-direction treatment where resolution permits. No canonical approved recurring-NPC raster source currently exists, and creating a low-quality placeholder merely to close the requirement would violate the visual target and NO-FAKE-COMPLETION rules.

EXACT_BLOCKER: `FORMAL_RECURRING_NPC_FIELD_ART_SOURCE_UNAVAILABLE`

UNBLOCK CONDITION:

- canonical/approved recurring-NPC field raster assets become available through an authorized quality source or a proven generation-to-repository binary handoff pipeline; then complete D2 formal sprite integration and re-run all public gates.

## CHECKPOINT ORDER

A. Grounding and Interaction Polish — COMPLETE_AUTOMATED_PUBLIC
B. Map Depth — COMPLETE_AUTOMATED_PUBLIC
C. Ambient Air — COMPLETE_AUTOMATED_PUBLIC
D. Field Sprite Richness — PARTIAL / D1 COMPLETE / D2 SAFE PRESENTATION COMPLETE / FORMAL NPC ART BLOCKED

All safety, acceptance, performance, regression, and completion rules remain exactly as defined in the full source requirement.

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED_FOR_D1: YES
PAGES_VERIFIED_FOR_D2_SAFE_PORTION: YES
IOS_PHYSICAL_VERIFICATION: PENDING
OWNER_VISUAL_APPROVAL: PENDING

EOF
