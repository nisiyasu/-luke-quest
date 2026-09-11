# FIELD-V00_V02 — CURRENT_BAD → TARGET_PS1 Execution Evidence

STATUS: V00 PASS / V01 PASS / V02 PASS FOR DESIGN-AND-AUTHORITY GATE
BASE_GOLD_SHA: 3422c62f42394f90629579633585a380d272c990
BASE_MAIN_SHA: bcbf07f0317474f2e9da82f004ed9eb593dc3638
REQ: REQ-149
ISSUES: #5 #6

## Canonical references

- Bad/current: `assets/reference/owner_2026-09-11_ps1_visual_target/CURRENT_BAD.png`
- Good/target: `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1.png`
- Interpretation: `assets/reference/owner_2026-09-11_ps1_visual_target/README.md`

Reference dimensions observed from the supplied originals:
- CURRENT_BAD source framing: 710 × 1536 portrait
- TARGET_PS1 source framing: 864 × 1536 portrait

The OS/browser chrome is not an art target. Comparison is the game viewport and the world/HUD composition inside it.

---

# V00 — Current-state reproduction and preservation

## Authoritative assembled runtime

The deployed/challenger representation is not raw `index.html` alone.

`tools/lq-req145-assemble-local.py` defines the local equivalent of the assembly chain:

1. base `index.html`
2. `prelude/autosave-bootstrap-guard.js`
3. all `ux-v*.js`, numeric version order
4. all `addons/*.js`, lexical order

The REQ-145 challenger builds candidate and exact-main baseline separately and captures both at `390 × 844`.

## Reproduction state

The existing capture harness already provides a deterministic field state that visually corresponds to the Owner's CURRENT_BAD scene family:

```text
screen = world
map = field  // 王都近郊
x = 10
y = 15
dir = up
wins = 2
dialog = null
viewport = 390 x 844
```

The harness clears `lukeQuestV2`, clones `DEFAULT`, applies the state above, calls `render()`, and captures `candidate-field.png`.

For movement continuity it also captures `candidate-field-move.png` after a canonical `move('up')` from the same state.

## Preserved baseline evidence

Workflow artifact from Gold `3422c62f...` records:

```text
candidate=3422c62f42394f90629579633585a380d272c990
baseline=bcbf07f0317474f2e9da82f004ed9eb593dc3638
```

The captured Gold field reproduces the important CURRENT_BAD characteristics:

- 48px logical tile grid remains visually obvious
- grass is dominated by repeated diagonal geometric cells
- water is a simple repeated blue tile treatment
- conifers read as simplified repeated symbols/shapes
- the tan route/bridge mass is large and visually flat relative to the target
- terrain does not carry target-grade cliff thickness / shoreline depth
- world materials do not yet form the dense coherent painted scene seen in TARGET_PS1

This is the rollback/comparison baseline for REQ-149. Do not replace it as the 'bad example'; future candidates are compared against it and TARGET_PS1.

V00 PASS condition is satisfied for reproducible CI comparison. Owner physical-browser reproduction remains a separate experience check and is not claimed here.

---

# V01 — Target visual specification

TARGET_PS1 is not a literal asset-copy instruction. It is a quality benchmark. The following observable characteristics define the target direction.

## Ground / grass

TARGET:
- grass reads as textured ground material, not a flat colored square
- tile repetition is subdued by local value/noise/foliage variation
- traversable path remains readable without a high-contrast checkerboard
- adjacent grass cells visually knit into a continuous surface

FAIL examples:
- repeated diagonal CSS motif remains the dominant first impression
- every 48px cell reads as an independent square
- visual richness comes only from overlaying random dots without material change

## Elevation / cliffs / edges

TARGET:
- raised land has an upper surface plus a visibly darker vertical edge / cliff face
- shore/cliff thickness establishes elevation at a glance
- outer and inner corners join cleanly
- walkable/non-walkable geometry is visually consistent with collision

FAIL examples:
- black voids used as unexplained borders
- shadow-only fake depth with no coherent edge geometry
- walls that look walkable or grass that visually hides blocked cells

## Water

TARGET:
- deep blue base, local tonal variation, highlights/ripples, shoreline darkening
- water reads beneath/around land instead of as blue patterned squares pasted beside it
- any animation is shared/bounded and does not shimmer aggressively

FAIL examples:
- repeated wave glyph is the primary water texture
- shore has no depth transition
- expensive per-tile animation/filter used to simulate richness

## Bridge / route structure

TARGET:
- bridge has deck boards, side thickness, supports/posts/rails where appropriate
- ends visibly connect to land
- perspective and board direction follow bridge geometry
- Luke's feet and bridge rails/supports have coherent occlusion
- visual corridor matches actual traversable corridor

FAIL examples:
- beige rounded rectangle/road with wood color applied
- diagonal section produced by stretching one texture
- large route mass floats without supports/shadow/contact

## Trees / vegetation

TARGET:
- conifers have layered crowns, trunk/body, dark grounding, local silhouette variation
- foreground/midground/depth groups create scene depth
- flowers/rocks/shrubs are subordinate material accents, not sticker noise

FAIL examples:
- identical triangle/tree icons repeated on a grid
- density increase without silhouette/material improvement

## Player

TARGET:
- existing Luke design remains recognizable
- sprite has enough pixel/material definition to belong in the upgraded background
- feet are grounded by placement/shadow
- 4-direction × 3-frame behavior stays intact unless a separately verified sprite upgrade supersedes it

## Lighting / color

TARGET:
- one coherent light direction
- shadows at tree bases, cliff faces, bridge underside, character feet agree
- dark navy/gold UI separates from world without flattening or obscuring it

FAIL examples:
- whole-world blur/filter used as a quality substitute
- incompatible drop shadows baked and dynamically duplicated

## HUD / information hierarchy

TARGET:
- dark navy/near-black panels with restrained gold edging/accent
- readable hierarchy: HP / next area / encounter / objective / bounty / action/menu
- overlays coexist with the world instead of reclaiming a large dedicated control panel
- state text remains live DOM/state-driven, never baked into target image assets

## First-glance acceptance

A candidate must materially improve these four first-glance axes together:

1. material richness
2. depth/elevation
3. scene coherence/density
4. world/HUD production-value consistency

A candidate that only improves one axis is not V04-ready.

---

# V02 — Render authority and collision responsibility

## Core logical map authority

`index.html` remains the current logical world source:

- `TS = 48`
- `MAPS.field` defines 王都近郊 geometry
- state uses tile coordinates `s.x / s.y`
- `blocked(x,y)` owns the base collision interpretation for logical map characters
- `move(d)` owns canonical movement / gate / encounter flow

REQ-149 must not silently replace those authorities during visual migration.

## Assembly / override authority

The final runtime is a layered system. Therefore visual migration must target final render authority, not edit an early CSS rule and assume it wins.

Relevant existing visual contributors include:

- `addons/field-route-hierarchy.js` — decorative field route hierarchy
- `addons/world-map-depth.js` — tile adjacency / boundary / shadow depth treatment
- `addons/world-character-grounding.js` — entity grounding
- `addons/world-generic-npc-art.js` — NPC visual body
- `addons/zzz-luke-field-sprite.js` — Luke field sprite presentation
- `addons/zzzz-iphone-fullscreen-world-ui.js` — world/UI viewport composition
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req145-gold-slice-foundation.js` — Gold presentation foundation
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req145-first-ten-seconds-focus.js` — late Gold first-impression override

Because addons are lexically appended, late `zzzz...` presentation files can override earlier rules. REQ-149 must introduce a clearly named late visual authority or explicitly retire superseded rules; it must not accumulate another uncontrolled stack of CSS patches.

## Responsibility map for migration

| Layer | Logical authority to preserve | Visual authority to replace/normalize | V04 expectation |
|---|---|---|---|
| Ground | MAPS + tile coordinates | grass/base field styling + Gold overrides | textured continuous grass surface |
| Water | MAPS `~` / collision | water tile styling + depth overlays | deep water + shoreline transition |
| Cliff/edge | MAPS/blocking | world-map-depth + new edge assets | explicit top/face/corner system |
| Route/bridge | logical walkable cells | field-route-hierarchy + Gold route presentation | actual bridge structure, same passability |
| Trees | logical blocked cells / map symbols | tree/forest visual styling | dimensional layered conifers |
| Player | `s.x/s.y`, move/action/save | zzz-luke-field-sprite + grounding | preserved control, integrated art |
| Foreground | no new collision by default | new controlled occlusion layer | rail/tree/edge overlap where needed |
| HUD | live game state | fullscreen + Gold presentation | navy/gold target hierarchy |

## Collision contract

For V03/V04, art may add apparent elevation and depth but does not introduce new collision semantics.

- existing walkable cells stay walkable
- existing blocked cells stay blocked
- bridge appearance must fit existing corridor unless an explicit later task changes collision
- decorative foreground must use pointer-safe/non-authoritative presentation

If target-quality bridge/cliff geometry cannot honestly match the existing corridor, that is a recorded architecture/collision change request, not a hidden art tweak.

## Architecture decision gate

V03 begins with the current logical map preserved. Presentation may initially remain DOM-backed.

At V04, evaluate:

- can the target material richness be produced without huge DOM/CSS patch growth?
- can cliff/shore/bridge joins be represented without visual seams?
- does 390×844 remain responsive on automated/browser gates?
- can foreground/background occlusion be expressed cleanly?
- is the number of per-tile DOM/filter/animation effects bounded?

If these fail, migrate rendering incrementally to Canvas/another 2D renderer while preserving map/state/input authorities. Do not keep polishing a structurally inadequate renderer merely to avoid architecture work.

---

# Gate result

V00: PASS for deterministic assembled comparison state and rollback evidence.

V01: PASS. Target is decomposed into observable acceptance criteria.

V02: PASS. Logical authorities, visual override risk, collision contract, and architecture decision gate are defined.

NEXT: FIELD-V03. Establish the field-gold asset production contract and minimal asset manifest. Then create the V04 playable slice. Do not roll out across the map before V04 visual acceptance.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
