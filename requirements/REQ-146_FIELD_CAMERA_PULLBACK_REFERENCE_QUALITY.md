# REQ-146 — Field Camera Pullback / Reference-Quality World Framing

- ID: `REQ-146`
- PRIORITY: `P0 / OWNER_DIRECT / ABSOLUTE_NEXT`
- STATUS: `READY`
- CREATED_AT: `2026-09-09 JST`
- TYPE: `VISUAL_QUALITY / FIELD_CAMERA / IPHONE_WORLD`
- EXECUTION_NOW: `NO — this checkpoint registers and queues the work only`

## 1. OWNER DIRECT REQUEST

Owner's latest direct request outranks the existing general queue:

- 「もう一段階引いた絵にしよう」
- Use the three Owner-provided screenshots as visual reference assets.
- Move LUKE QUEST toward that level of field readability, composition and visual quality.
- Register this as the highest-priority next development item.

The target is not merely higher resolution. The field view itself must feel one clear step more pulled back, allowing the player to understand more of the surrounding world at once.

## 2. CANONICAL REFERENCE ASSETS

Reference-only assets are stored at:

- `assets/reference/owner_2026-09-09_field_scale/ref-01-wide-architecture.jpg`
- `assets/reference/owner_2026-09-09_field_scale/ref-02-field-ui.jpg`
- `assets/reference/owner_2026-09-09_field_scale/ref-03-pulled-back-field.jpg`
- `assets/reference/owner_2026-09-09_field_scale/README.md`

## 3. VISUAL TARGET

On iPhone portrait and normal public play:

- show materially more surrounding map / routes / landmarks at the same player position;
- keep Luke, NPCs, interactables and important environmental cues readable;
- keep the world as the visual subject, not a tiny tile field surrounded by empty UI space;
- preserve strong route readability and landmark hierarchy;
- use the references for camera distance, density, composition and player-to-world scale, not for literal copying.

The desired result is a broader JRPG field composition where the player can understand where they are going before walking directly into every object.

## 4. IMPLEMENTATION AUDIT BEFORE CHANGE

Before changing scale, fresh-audit the actual single source(s) controlling:

- tile / sprite rendered size;
- map viewport framing;
- camera / CSS / canvas scale;
- iPhone portrait world sizing;
- devicePixelRatio behavior;
- `100dvh`, safe-area and Safari dynamic chrome behavior;
- orientation / resize / `visualViewport` behavior;
- pointer-to-world coordinate mapping and touch hit testing.

Prefer one canonical scale/framing authority. Do not accumulate independent transform hacks.

## 5. PROTECTED SYSTEMS

The visual pullback must not create a second input or gameplay authority. Preserve:

- REQ-021 Tap Anywhere Action -> canonical `action()` exactly once;
- REQ-001 Dynamic Touch Controller dead zone, pointerId ownership and central `stopMoving()`;
- REQ-022 fullscreen world overlays / safe-area behavior;
- MENU / button / battle / shop / inventory input exclusions;
- canonical save schema and load compatibility;
- story, battle, progression and map-transition authority.

If a scale change alters touch geometry, fix coordinate mapping at the canonical input/world boundary rather than adding compensating duplicate handlers.

## 6. ACCEPTANCE EVIDENCE

Before claiming implementation complete:

1. Capture before/after evidence at the same player coordinates in at least three representative field scenes.
2. On iPhone portrait, the candidate must show a visibly wider useful world context than current production.
3. Luke, NPCs, interactables and visual guidance remain legible and operable.
4. Short tap -> canonical Action and drag -> Movement remain spatially correct after scaling.
5. No fixed control lane or new large empty UI region is introduced.
6. Relevant browser regressions, save compatibility, Pages workflow and public build inclusion pass.
7. Public candidate must actually contain the change.
8. `IOS_PHYSICAL_VERIFICATION` remains `PENDING` until Owner checks a real iPhone.

## 7. NO FAKE COMPLETION

The following do not satisfy this requirement by themselves:

- widening `gameShell` only;
- shrinking all UI with a blanket transform;
- increasing canvas pixels without increasing useful visible world context;
- adding the reference files without changing the public game;
- showing more empty terrain while reducing readability;
- passing CI without public-build evidence;
- claiming the reference quality is matched before Owner experience review.

## 8. QUEUE ORDER

This requirement is the next Owner-direct P0 and must be selected before REQ-147 and the pre-existing REQ-145 challenger lane.

This registration checkpoint intentionally does **not** implement the camera/visual change. It makes the requirement, reference assets and execution order recoverable from fresh GitHub reality.
