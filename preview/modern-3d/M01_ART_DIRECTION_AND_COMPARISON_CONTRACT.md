# M01 — Art Direction, Camera, and Comparison Contract

STATUS: DONE
DOCUMENT_ID: LQ-MODERN-3D-M01-ART-CONTRACT-20260911
BRANCH: `prototype/modern-3d`
BASE_M00_SHA: `f17d2b4592811f837afe6b934a35a7f59382a977`

## 1. Visual authority

This contract has two non-interchangeable visual thresholds:

1. `assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png` = **minimum floor**. Falling below it fails. Merely reaching it does not finish the prototype.
2. `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png` = **primary final target**. This is the art/composition authority for M01–M12.

`CURRENT_BAD.png` remains before/regression evidence only.

The target is interpreted as a lush, painterly, premium JRPG field translated into real-time 3D. The desired result is not a literal reconstruction of any copyrighted commercial game or asset set. Geometry, materials, textures, lighting, foliage, water, character, and UI must be original or appropriately licensed.

## 2. Art-direction thesis

**Fantasy diorama realism, not photorealism.**

The scene should feel hand-authored, warm, rich and inviting at first glance. Real-time 3D depth and lighting must strengthen the final target's composition rather than turn the scene into a generic realistic forest demo.

Key principles:

- silhouette and composition before shader complexity;
- authored material variation before random noise;
- readable walkable route inside dense scenery;
- strong foreground/midground/background overlap without hiding traversal;
- warm sun + cool sky/water separation;
- physically plausible roughness/metalness values without making organic materials metallic;
- dense vegetation in clusters, with deliberate breathing space along the playable path;
- river and bridge are hero materials, not background filler;
- player remains clearly readable without glow-outline cheating;
- HUD floats over the world and never claims a dedicated bottom control panel.

## 3. World coordinate convention

For all comparison builds:

- `+X` = east / screen-right tendency
- `+Z` = south / toward lower portion of the portrait frame
- `+Y` = elevation
- meters are the conceptual world unit
- canonical ground reference = `Y = 0`

This convention is fixed so camera, route, collision, assets and evidence can be compared across stages.

## 4. Main comparison camera

### C1 — Canonical portrait hero camera

This is the mandatory same-view comparison camera.

- projection: PerspectiveCamera
- vertical FOV: **34°** initial fixed value
- portrait evidence viewport: **390×844** for automated mobile evidence
- high-quality comparison viewport: **864×1536** when the renderer/runtime can capture it reproducibly
- camera target: bridge/player hero zone near world origin
- yaw: approximately **-28°** around Y, chosen so bridge, river and terrain edges expose depth instead of becoming flat horizontal/vertical bands
- downward pitch: approximately **54°**
- horizon: **not visible** in the canonical frame
- camera distance/height: tune once in M02/M03 so the player appears at **7–9% of viewport height** and the visible world fills edge-to-edge beneath overlay UI
- lens changes after M01 must be documented; do not silently widen the FOV to hide composition problems

### C2 — High-quality inspection camera

Same yaw/target family as C1, allowed slightly closer framing for material inspection. It is supporting evidence only and cannot replace C1 for acceptance.

### C3 — Traversal camera

Follow camera used while moving. It should remain visually close to C1 and may ease its target/position. It must not become an unrestricted orbit camera merely to make screenshots look better.

## 5. Canonical frame composition

The canonical frame must read in this order:

1. player + principal bridge/path junction;
2. turquoise river and shoreline depth;
3. wooded/cliff enclosure and path continuation;
4. supporting vegetation/rocks/flowers/signage;
5. HUD overlays.

Composition targets:

- player sits near lower-middle/central third, never glued to screen center if that weakens the composition;
- a principal wooden bridge occupies a strong diagonal/vertical leading line through the lower-middle frame;
- river occupies a substantial continuous region, with visible banks and depth cues rather than isolated blue rectangles;
- conifers create large framing masses on at least two sides while preserving route visibility;
- cliffs/rock ledges visibly separate elevation bands;
- path/bridge destination remains legible without arrows painted into the terrain;
- no large unexplained black/empty lower viewport band;
- UI leaves the central world composition unobstructed.

## 6. Palette and light contract

### Palette families

- sunlit grass: yellow-green / olive-green variation, never one flat green
- shaded vegetation: deep pine/teal green
- water: cyan-turquoise highlights over deeper blue/teal body
- cliff/rock: cool neutral gray with moss/earth warmth at joins
- bridge: warm honey/brown timber with darker wet/shadow sides
- player hair: saturated royal/electric blue, controlled so it remains a focal accent
- UI: near-black/navy panels with restrained warm gold borders and white/off-white text

### Lighting

- one dominant warm directional sun from upper-left/front-left of the canonical frame
- cooler hemisphere/environment fill preserves shadow information without flattening it
- actual cast shadows required from trees, player, bridge and major rocks where technically reasonable
- contact shadows/ambient occlusion may support grounding but cannot be the sole source of depth
- fog/haze is subtle depth separation, not a blur layer
- point lights are optional and should only exist for motivated local sources; daytime scene does not gain random fantasy lights

## 7. Material-density contract

At canonical camera distance, the scene must retain readable material variation without noisy micro-detail.

- grass: macro value patches + authored ground breakup + smaller tufts/flowers near edges; repetition should not reveal a square tile cadence
- cliffs: top surface, vertical face, cracks/strata and moss/soil transition
- shoreline: wet/dark transition and geometry/material blend; no hard blue-to-green rectangle boundary
- water: depth/color variation, moving normal/ripple response, coherent light reflection and bank interaction
- bridge: individual/plausible board rhythm, side thickness, supports/posts/rails/joints and grounding shadow
- trees: trunk + multiple branch/crown masses + silhouette variants; repeated cones are explicitly insufficient
- rocks: shape variation and grounding, not identical scattered primitives
- flowers/ground props: clustered accents that support composition, not uniform confetti
- player: recognizable blue hair, clothing silhouette, hands/feet/head/body separation at target size; capsule proxy is M00-only evidence and cannot pass final art gates

## 8. HUD contract

World remains the primary canvas.

Preferred target hierarchy:

- top-left: compact LUKE / HP panel
- top-right: next-area / objective guidance where needed
- lower-right: compact A and MENU controls for touch builds
- lower-left: movement control only when the chosen mobile input mode needs it

Rules:

- translucent/navy near-black materials with restrained gold edging;
- no giant opaque bottom tray;
- safe-area aware;
- UI should remain readable over bright water and dark forest;
- automated desktop/CI evidence must not be mislabeled as physical iPhone verification.

## 9. Fixed traversal route for future video and performance evidence

Route ID: `M01_ROUTE_A`

The world layout in M02/M03 must provide a route with these semantic checkpoints, even if exact coordinates are refined later:

- **R0 START:** player standing on the principal bridge near lower-middle hero frame
- **R1 NORTH LANDING:** walk north across bridge onto grass/rock landing
- **R2 FOREST EDGE:** continue along readable path with trees passing in front/behind the player to test occlusion
- **R3 SHORE STOP:** stop beside the river long enough to judge moving water, shoreline and contact shadow
- **R4 TURN:** perform left/right directional changes to expose animation and camera stability
- **R5 RETURN BRIDGE:** return onto bridge and cross back toward R0
- **R6 IDLE:** stand still for lighting/water/foliage-motion inspection

Future acceptance video must include bridge traversal, tree overlap, shore stop, turns, idle and water motion. Static beauty shots cannot substitute for this route.

## 10. Quality rubric

Every evidence review uses exactly these labels: `BELOW_MINIMUM | MINIMUM_MET | TOWARD_FINAL | FINAL_EQUIVALENT_OR_BETTER | NOT_EVALUABLE`.

| Axis | Concrete target condition | Minimum failure examples |
|---|---|---|
| Composition | bridge, river, forest and player have clear hierarchy; portrait world fills frame; route reads immediately | empty bands, player lost, flat centered demo layout |
| Terrain | visible height/elevation, layered cliff/shore joins, continuous natural surfaces | flat green plane, tile-grid silhouette, shadow-only fake cliffs |
| Vegetation | varied crown/branch/trunk silhouettes and layered understory create depth | repeated cones/cylinders dominate first impression |
| Bridge | deck, thickness, supports, rails/joints, material grain and terrain connection all read | one brown box/plane, floating bridge |
| Water | depth variation, bank transition, moving surface/light response form one coherent river | opaque blue/cyan plane, rectangular edges |
| Player | blue-haired protagonist readable at 7–9% viewport height with proper grounding and animation-ready anatomy | capsule/sphere proxy, glow-only identity |
| Light & color | single coherent sun direction, readable shadows, cool/warm separation, preserved detail | flat ambient light, random lights, blown highlights |
| Overall density | authored details across foreground/mid/background with intentional negative space | sparse tech demo or random clutter |
| UI | compact safe-area overlays readable over world, no dedicated bottom slab | UI blocks hero view or dominates portrait area |

### Gate interpretation

- Any axis `BELOW_MINIMUM` => stage visual gate fails.
- `MINIMUM_MET` on every axis only proves the floor, never final completion.
- M05 provisional beauty gate should show multiple axes `TOWARD_FINAL` before expansion work continues.
- M12 final visual claim requires all major axes `FINAL_EQUIVALENT_OR_BETTER` or an explicit Owner-accepted alternative direction.
- Owner subjective approval remains `PENDING` until actually given for a prototype build.

## 11. M01 acceptance result

- visual authority split into minimum vs final: DEFINED
- art direction: DEFINED
- main comparison camera: DEFINED
- supporting cameras: DEFINED
- canonical portrait composition: DEFINED
- palette/light direction: DEFINED
- material-density expectations: DEFINED
- player scale target: DEFINED
- HUD hierarchy: DEFINED
- fixed traversal/evidence route: DEFINED
- all Section 7 quality axes mapped to concrete acceptance: DEFINED

M01 = DONE as a specification/comparison gate. No claim is made that the current M00 bootstrap visually meets the minimum or final target.

OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
