# REQ-119 — WORLD / CHARACTER VISUAL RICHNESS UPGRADE

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE_PRESENTATION / MAP_VISUALS / FIELD_CHARACTER_VISUALS / UX_POLISH
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`
SOURCE_REQUIREMENT: `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md`
ID_RECOVERY: `REQ-117 collided with an earlier Wind Stair guard. This file is the unique active successor for the Owner visual-richness request.`

## MANDATORY SOURCE LOAD

Before implementation or verification, fresh-read `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md` in full and apply every requirement there as the detailed specification for REQ-119. Do not shorten, omit, or reinterpret that source merely because this successor file is compact.

## CURRENT RECOVERY

Checkpoint A implementation already exists at HEAD in `addons/world-character-grounding.js` from commit `1b834a542a70ef36775e11e8aeda4d0d8ae23d31`:

- universal player/NPC elliptical foot shadows;
- restrained idle breathing motion;
- interaction-prompt ease-in;
- presentation-only safety and smoke assertions.

That implementation was originally labeled REQ-117 before the ID collision was discovered. Relabel it to REQ-119 without changing its Owner intent.

Checkpoint A is not complete until a descendant public Pages gate including the relabeled implementation succeeds. Per the source requirement, do not begin Checkpoint B before that public gate.

## CHECKPOINT ORDER

A. Grounding and Interaction Polish
B. Map Depth
C. Ambient Air
D. Field Sprite Richness

All safety, acceptance, performance, regression, and completion rules remain exactly as defined in the full source requirement.

IOS_PHYSICAL_VERIFICATION: PENDING
OWNER_VISUAL_APPROVAL: PENDING

EOF
