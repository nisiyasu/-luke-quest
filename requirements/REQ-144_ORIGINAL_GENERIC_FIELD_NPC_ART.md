# REQ-144 — Original Generic Field NPC Art

- ID: `REQ-144`
- TITLE: `Original Generic Field NPC Art`
- PRIORITY: `P1`
- STATUS: `IN_PROGRESS`
- CREATED_AT: `2026-09-09 JST`
- TYPE: `PLAYER_VISIBLE_QUALITY / FIELD_PRESENTATION / ACCESSIBILITY / REGRESSION_SAFE`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- QUALITY_LEVEL: `Q2`

---

## 0. EVIDENCED GAP

Fresh Chapter 1 audit found that canonical human NPCs still originate as emoji text in `index.html` (`👴`, `👩`, `🧑‍⚕️`, `🧑‍🌾`, `🛡️`). The late `world-character-grounding.js` presentation layer deliberately moves the existing child nodes into `.lqEntityVisualBody`; it does not replace those glyphs with original art.

Therefore ordinary field NPCs remain emoji stand-ins in the assembled game even though the permanent development directive and Quality System require player-visible work to move away from emoji-as-final-quality presentation.

This requirement is limited to generic/non-protected field NPC presentation. It must not invent or formalize Leon, Glenn, Eleanor, Luke, Leon's sister, or other protected character identities.

---

## 1. OWNER / DIRECTIVE INTENT

Improve the Chapter 1 world so ordinary people read as inhabitants of LUKE QUEST rather than phone-font emoji.

Use lightweight original repository-owned visual art and preserve all existing dialogue, interaction, collision, facing, story, save and input authority.

This is a reversible presentation improvement. It is not formal character canon approval.

---

## 2. SCOPE

Target generic human NPC glyphs currently used in canonical world data:

- `👴` — elder / traveler archetype
- `👩` — merchant / civilian archetype
- `🧑‍⚕️` — temple acolyte / healer archetype
- `🧑‍🌾` — field worker archetype
- `🛡️` when used as a human guard/watch NPC

Do not replace non-character evidence/prop glyphs such as fire, feather, sword, thread, footprints, flags, boots, bandages, treasure or other interactable objects under this requirement.

Do not replace protected named-character visuals under this requirement.

---

## 3. VISUAL CONTRACT

- Create original lightweight SVG field sprites owned by this repository.
- Provide four directional variants in the source asset contract even if a currently static generic NPC uses the down/front view at runtime.
- Use a compact fantasy-RPG silhouette readable at current small field scale.
- Avoid CSS-drawn people as the final runtime body for this requirement.
- Avoid emoji fallback when the original asset is available.
- No expensive blur/filter/compositor effects.
- No permanent `will-change`.
- Preserve the existing grounding foot shadow and interaction marker layers.

The SVGs are `INTERIM_ORIGINAL`, not `FORMAL_CHARACTER_CANON`. The existing Character Asset Contract explicitly forbids promoting easy interim SVG art to formal canon.

---

## 4. RUNTIME INTEGRATION

Implement a late presentation-only add-on that:

1. runs after the canonical world render and current grounding layer;
2. detects only scoped generic human NPC bodies;
3. replaces the visible emoji text body with an original SVG `<img>` or equivalent image element;
4. preserves the original glyph only as internal detection data, not visible output;
5. preserves `.npc` position, collision, interaction target, facing marker, pointer transparency, dialogue and story state;
6. re-applies safely after DOM re-render without stacking duplicate images;
7. does not create input, save, battle, action or movement handlers.

---

## 5. INPUT / STATE SAFETY

Must preserve:

- REQ-021 short tap -> canonical `action()` exactly once;
- REQ-001 Dynamic Touch Controller and central `stopMoving()` authority;
- REQ-022 fullscreen world geometry and overlays;
- menu/button/link/input exclusion behavior;
- all NPC dialogue and progression flags;
- map transition behavior;
- save schema and existing saves.

`INPUT_AUTHORITY_CHANGE = NONE`
`SAVE_SCHEMA_CHANGE = NONE`
`STORY_CHANGE = NONE`

---

## 6. ACCESSIBILITY / FAILURE BEHAVIOR

- Sprite images are decorative because the NPC's semantic identity is already communicated through dialogue/interaction UI; use empty alt text and `aria-hidden=true`.
- If an image asset cannot load, fail safely without mutating gameplay state. A non-emoji neutral fallback is preferred over reintroducing a platform-dependent person emoji.
- No visual layer may intercept pointer input.

---

## 7. TESTS

Minimum acceptance:

- JavaScript syntax PASS.
- SVG assets exist and parse/load in assembled Pages artifact.
- Canonical town elder, merchant and acolyte render original NPC art rather than visible person emoji.
- Canonical field worker renders original NPC art rather than visible person emoji.
- Human guard/watch mapping uses original guard art where applicable.
- Non-human evidence/prop glyphs remain unchanged.
- No duplicate sprite image after repeated `render()` / `world()` calls.
- `.npc` coordinates and interaction/dialogue behavior remain unchanged.
- Existing grounding foot shadow remains present.
- P0 Touch regression PASS.
- Render Liveness PASS.
- Pages deploy SUCCESS.
- Public build includes the add-on and SVG asset.

Physical iPhone subjective appearance remains:

`IOS_PHYSICAL_VERIFICATION = PENDING`

---

## 8. IMPLEMENTATION COMPLETE CONDITION

Move to `VERIFY` only after:

- original generic NPC art is actually present in the assembled/public build;
- browser regression proves scoped person emoji are no longer the visible body for the tested canonical NPCs;
- interaction and P0 touch/fullscreen authorities remain intact;
- Pages deployment succeeds;
- no protected character identity or story canon was changed.

Do not claim `FORMAL_ART_APPROVED` or physical iPhone PASS.

EOF
