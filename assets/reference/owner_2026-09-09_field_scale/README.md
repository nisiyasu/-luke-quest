# Owner Field Scale Visual References — 2026-09-09

Purpose: visual-quality references for the next LUKE QUEST field-camera / world-framing improvement.

These files are compact JPEG derivatives of the three screenshots supplied directly by Owner in chat. They are reference assets, not canonical runtime map art.

## Files

- `ref-01-wide-architecture.jpg`
  - Study: wide architectural framing, large landmark readability, visible approach route, foreground/background balance.
- `ref-02-field-ui.jpg`
  - Study: broad playable field while player character remains readable; world and UI coexist without the controls consuming the scene.
- `ref-03-pulled-back-field.jpg`
  - Study: a clearly more pulled-back classic JRPG field view; landmarks, paths and nearby actors are understandable together.

## Owner intent

"もう一段階引いた絵" is the primary target.
The player should see materially more surrounding world than in the current LUKE QUEST field view, especially on iPhone portrait, without making Luke, NPCs or interactables too small to read or operate.

## Use rules

- Extract framing, camera-distance, visual-hierarchy, density and route-readability principles.
- Do not copy logos, editor chrome, text, characters or third-party map art into LUKE QUEST.
- Build original LUKE QUEST visuals and composition.
- Do not solve this by blindly shrinking the entire DOM or stacking multiple transforms.
- If pulling the camera back exposes empty/unreadable areas, improve intentional scene composition safely rather than adding random clutter.
- Preserve canonical touch coordinate mapping, Tap Anywhere Action, Dynamic Touch Controller, fullscreen overlays, save compatibility and story/battle/progression authority.

The acceptance source of truth is `requirements/REQ-146_FIELD_CAMERA_PULLBACK_REFERENCE_QUALITY.md`.
