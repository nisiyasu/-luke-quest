# LUKE QUEST — Owner Visual Reference: Current vs PS1-Class Target

## Purpose

This folder is the canonical visual comparison set for the current LUKE QUEST field presentation versus the Owner-approved target quality direction.

The two images in this folder have different roles. They must never be treated as equivalent references.

## Expected files

### `CURRENT_BAD`

Role: current-state / regression-comparison reference only.

This image records the present LUKE QUEST visual quality and structure before the rendering-quality migration.

Rules:

- Do **not** imitate this image as the desired result.
- Do **not** preserve its simplified visual treatment merely because it is the current implementation.
- Do **not** treat its DOM/CSS rendering style, flatness, sparse environmental detail, simplified terrain, simplified water, simplified bridge/building rendering, or low scene density as a target constraint.
- Use it to measure how far candidate builds have actually moved away from the current state.
- It is valuable as a regression / before-image, not as an art-direction target.

### `TARGET_PS1`

Role: Owner-approved target visual-quality reference.

This image is the quality destination for the Gold visual direction. It represents the intended early-PlayStation-era commercial JRPG level of perceived presentation quality, not an instruction to copy a specific copyrighted game or asset set.

Treat it as a visual-quality benchmark for:

- terrain richness and material definition
- tile / ground variation and density
- trees, rocks, flowers and environmental layering
- bridge, architecture and object dimensionality
- water depth, texture and light response
- cliffs, edges and elevation readability
- shadows and grounding
- sprite readability and character presence
- depth / overlap / occlusion hierarchy
- scene composition and environmental coherence
- HUD / world coexistence and information hierarchy
- overall first-glance production value

## Comparison rule

Evaluation should be performed as:

`CURRENT_BAD -> candidate build -> TARGET_PS1`

The question is not "is the candidate prettier than CURRENT_BAD?"

The question is:

"Has the candidate materially closed the gap toward TARGET_PS1 while preserving gameplay, input safety, story state, save compatibility and mobile usability?"

Small cosmetic improvements that leave the underlying presentation effectively at CURRENT_BAD quality are not sufficient.

## Architecture implication

The Owner has explicitly recognized that the gap between CURRENT_BAD and TARGET_PS1 is not merely a matter of polishing individual CSS objects.

If the current DOM/CSS-heavy rendering architecture prevents the target quality from being reached efficiently or reliably, the implementation should be allowed to migrate the rendering layer rather than endlessly decorating the existing structure.

Preserve reusable game logic where appropriate, including story/state, interaction semantics, battle logic, save behavior and input requirements, while treating the visual renderer as replaceable when necessary.

Do not perform a reckless whole-game rewrite. Prefer staged migration behind safe checkpoints and A/B comparison.

## Asset naming

When the Owner uploads the two reference images, use clear filenames such as:

- `CURRENT_BAD.png` (or `.jpg` / `.jpeg`)
- `TARGET_PS1.png` (or `.jpg` / `.jpeg`)

If uploaded filenames differ, update this README so the role of each image remains unambiguous.

## Non-negotiable interpretation

`CURRENT_BAD` = evidence of the starting point.

`TARGET_PS1` = visual quality target.

**Never use CURRENT_BAD as the implementation target. Never downgrade TARGET_PS1 into a vague mood-board reference.**
