# LUKE QUEST — Owner Visual Reference Ladder

## Purpose

This folder is the canonical visual-quality ladder for the LUKE QUEST field renderer.

The images have three distinct roles and must never be treated as equivalent references.

## Canonical roles

### `CURRENT_BAD.png`

Role: starting point / bad example / regression reference only.

- Records the old low-quality presentation.
- Never use it as the desired visual direction.
- Use it only to measure whether a candidate has genuinely moved away from the old state.

### `MINIMUM_QUALITY_LINE.png`

Role: minimum acceptable quality floor.

This is the former second reference image. It is **not the final destination anymore**.

A candidate that remains visibly below this image is not acceptable for the visual migration.
Meeting this image only means the candidate has reached the minimum line required to continue toward the real target.

Benchmark it for:

- terrain richness and continuity
- water depth and shoreline readability
- bridge dimensionality
- trees / rocks / flowers / environmental layering
- cliffs / elevation readability
- shadow / grounding
- sprite readability
- HUD / world coexistence
- overall first-glance production value

### `TARGET_PS1_FINAL.png`

Role: primary Owner-approved final visual target.

This is the third reference image and is now the **main destination** for the visual-quality program.

The objective is not merely to equal `MINIMUM_QUALITY_LINE.png` and stop. The renderer should continue closing the visible gap toward `TARGET_PS1_FINAL.png` while preserving gameplay, input safety, story state, save compatibility and mobile usability.

Benchmark it for:

- dense but readable environment composition
- natural terrain transitions rather than obvious logical tiles
- lush layered vegetation and strong silhouette depth
- convincing water material, highlights, rocks and shoreline interaction
- substantial bridge structure, supports, rails, depth and contact shadows
- coherent elevation / cliff massing
- integrated player scale and grounding
- directional light, ambient light and coherent shadow language
- polished dark navy / gold HUD coexistence with the world
- commercial-game first-glance quality rather than prototype quality

The reference is a quality-direction benchmark, not an instruction to copy copyrighted game assets or reproduce a specific commercial title literally.

## Mandatory comparison ladder

Evaluation must use:

`CURRENT_BAD.png -> candidate build -> MINIMUM_QUALITY_LINE.png -> TARGET_PS1_FINAL.png`

Two separate questions must be answered:

1. **Minimum gate:** Has the candidate at least reached or exceeded the perceived quality floor represented by `MINIMUM_QUALITY_LINE.png`?
2. **Target gap:** Has the candidate materially closed the remaining gap toward `TARGET_PS1_FINAL.png`?

A small improvement over `CURRENT_BAD.png` is insufficient.
Reaching `MINIMUM_QUALITY_LINE.png` is also not final completion by itself.

## Architecture implication

The Owner has explicitly recognized that the gap is not merely a matter of polishing individual CSS objects.

If the current DOM/CSS-heavy rendering architecture prevents efficient progress toward `TARGET_PS1_FINAL.png`, the rendering layer may be migrated or replaced incrementally while preserving reusable game logic such as story/state, interaction semantics, battle logic, save behavior and input requirements.

Do not preserve a weak renderer merely because it already exists.
Do not perform a reckless whole-game rewrite either. Use staged migration, safe checkpoints, playable comparisons and regression gates.

## Non-negotiable interpretation

`CURRENT_BAD.png` = where we started.

`MINIMUM_QUALITY_LINE.png` = the floor. Falling below it is a fail.

`TARGET_PS1_FINAL.png` = the actual visual destination.

**Never downgrade `TARGET_PS1_FINAL.png` into a vague mood-board reference, and never mistake the minimum line for final completion.**
