# M12 Gold Migration Design — Modern 3D → Existing LUKE QUEST

DOCUMENT_ID: LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2
STAGE: M12
STATUS: TECHNICAL_INTEGRATION_DESIGN
PROTOTYPE_BRANCH: `prototype/modern-3d`
PROTOTYPE_BASE: `58c8707f4fe9cea8b55a7c9044d658496f29d75f`
GOLD_REFERENCE_BRANCH: `experiment/gold-vertical-slice`
OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. M12 decision

The Modern 3D prototype is technically suitable for a **staged integration**, but it must not replace the existing LUKE QUEST runtime as a second game engine.

Gold remains authoritative for:

- game state and story flags;
- save/load and save-key compatibility;
- map/scene progression;
- input intent and action semantics;
- battle state and battle resolution;
- dialogue/HUD/game-mode transitions.

Modern 3D becomes a renderer/projection adapter for an explicitly enabled field scene. Three.js object state is not canonical gameplay state and is not written directly to the existing save.

This preserves the current Gold contract observed in `experiment/gold-vertical-slice/index.html`, including the canonical state object `s`, save key `lukeQuestV2`, `save()`, `render()`, `move()`, `blocked()`, `checkGate()`, `startBattle()`/battle mode, dialogue state, and map/story flags.

## 2. Non-negotiable ownership boundaries

| Concern | Authority after integration | Modern 3D role |
|---|---|---|
| Player HP/level/xp/gold/items | Gold `s` state | Read-only projection into HUD/scene |
| Story/map flags | Gold `s.flags` | Read-only scene decoration/state projection |
| Save/load | Existing `lukeQuestV2` path | No independent save key |
| Current map and logical player position | Gold state | Render projected position |
| Input listeners | One Gold input gateway | Consume normalized intent; no duplicate keyboard/pointer listeners |
| Collision authority | Gold logical collision during first rollout | Visual geometry/height support and shadow comparison only |
| Battle | Gold battle state/runtime | Pause/freeze field renderer while battle owns the screen |
| Dialogue/action | Gold action/dialogue authority | Optional world cue; no duplicate action semantics |
| 3D camera/lights/materials/assets | Modern 3D renderer | Full ownership inside renderer surface |
| Physical iPhone acceptance | Owner / real device | Never inferred from CI |

## 3. State bridge

Introduce one adapter boundary, conceptually:

```js
GoldGameState -> Modern3DSceneSnapshot
```

Minimum snapshot fields:

```text
screen
mapId
player.logicalX
player.logicalY
player.direction
player.hp / maxHp / level
storyFlags (read-only subset required by the scene)
dialogueOpen
battleActive
movementLocked
qualityPreset
```

Rules:

1. Gold produces the snapshot. Modern 3D never reaches into arbitrary DOM state as a substitute for this contract.
2. The renderer may keep transient interpolation/camera/animation state, but canonical logical position stays in Gold.
3. On renderer restart, scene state is reconstructed from the latest Gold snapshot.
4. The current save schema remains valid. No Three.js UUID, camera pose, mesh state, or renderer-only collision data is persisted into `lukeQuestV2` in the first integration unit.

## 4. Input bridge — exactly one registration path

The prototype currently has independent keyboard/touch handling because isolation was required during M00–M11. That input authority must **not** be copied into Gold unchanged.

Gold integration uses one normalized input gateway:

```text
physical keyboard / Gold touch UI
        ↓
Gold Input Gateway
        ↓
MOVE_START(direction) / MOVE_STOP / ACTION / MENU
        ↓
Gold game logic
        ↓
updated canonical state snapshot
        ↓
Modern 3D renderer projection
```

Hard rule: when `modern3d` integration mode is active, prototype-owned `keydown`, `keyup`, pointer/touch movement listeners are disabled at the adapter boundary. There must not be two independent movement loops writing position.

`pointerup`, `pointercancel`, `blur`, and `visibilitychange` still need release safety, but they terminate the **single Gold input intent**, not a second 3D movement state machine.

## 5. Coordinate contract

Gold logical coordinates and Three.js coordinates are separate namespaces.

Use a deterministic scene transform:

```text
logical map coordinate (tileX, tileY)
  -> scene transform (origin + configurable world-units-per-tile)
  -> Three.js X/Z
  -> terrain sampler provides display Y
```

The scale and origin are scene configuration, not hard-coded save data. Reverse mapping is required for diagnostics and future shared collision work, but initial gameplay authority remains the Gold logical grid.

The renderer may interpolate between canonical logical positions for smooth motion. Interpolation never advances story gates, encounters, or save state on its own.

## 6. Collision and terrain migration

### Stage 1 authority

Gold `blocked()` / gate rules remain gameplay collision authority. Modern 3D collision meshes are visual/terrain-support data only.

### Shadow comparison

During preview rollout, log mismatches where:

- Gold says passable but 3D visual geometry appears blocked;
- Gold says blocked but visual route appears open;
- bridge/shore elevation projection produces a grounding mismatch.

Do not silently switch authority based on a mismatch.

### Future convergence option

If later approved, both render and gameplay can consume a shared scene collision manifest. That is a separate migration decision and not part of the first bounded unit.

## 7. Battle, dialogue, HUD and story transitions

Battle remains Gold-owned. On `screen === 'battle'` (or equivalent canonical mode transition):

1. stop accepting field movement intent;
2. freeze/pause the 3D field update loop;
3. preserve only transient renderer state in memory;
4. let Gold battle UI/state run unchanged;
5. on return to world, rebuild/synchronize from fresh canonical state.

Dialogue follows the same principle: Gold decides dialogue open/close and action consequences. Modern 3D may show world emphasis but does not own dialogue progression.

Initial integration keeps Gold DOM HUD/dialogue above the WebGL surface. Replacing HUD visuals is optional later work, not a prerequisite for safe field integration.

## 8. Renderer lifecycle and feature flag

Integration is disabled by default until a bounded preview is deliberately enabled.

Proposed mode:

```text
rendererMode = legacy | modern3d-preview
```

Initial scope: only the selected `field` / 王都近郊 surface represented by the prototype. Other maps continue through the legacy renderer.

Lifecycle:

```text
enter eligible world scene
 -> create Modern3D renderer
 -> hydrate from Gold snapshot
 -> render frames

leave scene / battle / unsupported route
 -> stop animation/input subscription
 -> dispose renderer resources
 -> continue Gold state untouched
```

If Three.js/module/assets fail to load, fail visibly and fall back to `legacy`; never leave a black screen as the only outcome.

## 9. Assets, dependency loading and delivery

M10 authority remains:

- editable source plus a single-HTML package are both retained;
- Three.js is pinned to `three@0.186.0`;
- HTTP launch is the supported path;
- CDN Three.js is an explicit dependency and offline operation is not claimed;
- HIGH and PRACTICAL remain separate quality presets;
- practical quality does not redefine `TARGET_PS1_FINAL.png` downward.

Gold integration should not paste the M10 distribution HTML into Gold. Reuse renderer modules/assets from the source form and keep a deterministic asset manifest.

Recommended delivery order:

1. renderer bootstrap + minimum critical assets;
2. first visible scene shell;
3. remaining environment assets;
4. optional high-quality detail;
5. graceful downgrade to practical preset when selected, never silent target redefinition.

Service-worker/cache versioning must change when renderer or asset identities change so stale 2D/3D mixtures cannot be served indefinitely.

## 10. Regression gates before any production promotion

A promotion candidate must separately verify:

### Existing-game invariants

- existing `lukeQuestV2` save can load;
- new game / continue flow remains valid;
- story flags and map gates do not regress;
- battle enter/resolve/return remains Gold-owned and functional;
- dialogue/action/menu semantics remain functional;
- only one movement/input authority is active;
- renderer failure returns to a usable legacy path.

### Modern 3D invariants

- M08 movement/grounding/collision-release evidence remains green;
- M09 multi-position / portrait / landscape / HUD evidence remains green;
- M10 source/package HIGH and PRACTICAL checks remain separated;
- M11 visual repair is preserved and no major visual axis falls below the minimum line;
- physical iPhone remains PENDING until actually measured.

### Save compatibility gate

Run pre-integration saved-state fixtures through the adapter. Renderer integration must not require save migration merely to display the field.

## 11. Staged rollout

### Phase A — Contract only

Add the adapter interface and tests with the feature flag OFF. No visible Gold behavior change.

### Phase B — Passive shadow renderer

For the eligible field, initialize a 3D renderer from the Gold snapshot without owning input, collision, save, battle, or story. Compare positions and lifecycle behavior. Legacy remains visible authority if necessary.

### Phase C — Preview renderer behind explicit flag

Render the field through Modern 3D while Gold remains gameplay authority. Existing HUD/dialogue remains above the canvas. Run regression gates.

### Phase D — Owner/device verification

Verify on physical iPhone and obtain Owner visual/experience judgment. Keep HIGH/PRACTICAL results separate.

### Phase E — Promotion decision

Only after evidence and explicit promotion authority decide whether the eligible Gold field should default to Modern 3D. This is outside M12 and is not performed automatically.

## 12. Rollback

Rollback is deliberately cheap because game truth remains in Gold.

Primary rollback:

```text
rendererMode = legacy
```

Requirements:

- no save conversion required;
- no story-state reverse migration required;
- remove/dispose 3D renderer subscriptions;
- existing DOM renderer can immediately consume the same canonical state;
- preserve M12 adapter code/evidence for diagnosis rather than rewriting history.

If a production candidate ever changes save schema or collision authority later, that requires a separate migration/rollback design and cannot inherit this M12 approval implicitly.

## 13. First bounded implementation unit

**UNIT M12→G01: Modern3D passive adapter, feature-flag OFF by default.**

Scope:

1. Add a small Gold-side adapter module exposing a `Modern3DSceneSnapshot` from canonical state.
2. Add a renderer lifecycle interface: `mount(snapshot)`, `sync(snapshot)`, `pause()`, `resume(snapshot)`, `dispose()`.
3. Add coordinate conversion as configuration, not save data.
4. Do **not** register new movement/action listeners.
5. Do **not** write saves.
6. Do **not** replace Gold collision, battle, dialogue, or story logic.
7. Add contract tests proving one input authority, save-key preservation, renderer fallback, and deterministic coordinate projection.
8. Keep the feature flag OFF by default. Promotion is a later explicit decision.

Completion evidence for G01 would be code + tests on an isolated integration branch, not a main merge.

## 14. M12 acceptance assessment

M12 design requirements are covered:

- successful prototype parts and remaining gaps are identified;
- game state/input/save/battle ↔ renderer/coordinates/collision responsibilities are explicit;
- duplicate input registration is prohibited structurally;
- asset/load/delivery/cache strategy is defined;
- regression gates are separated by gameplay, 3D, save, performance and physical-device evidence;
- staged rollout and a one-switch rollback are defined;
- the first bounded implementation unit is specified;
- Gold replacement/main merge is not performed by this stage.

Remaining program-level pending states are not hidden:

- `OWNER_EXPERIENCE_PASS: PENDING`
- `IOS_PHYSICAL_VERIFICATION: PENDING`
- `FINAL_EQUIVALENT_OR_BETTER: NOT_CLAIMED`

M12 can therefore close as a **technical migration-design pass** without claiming that those Owner/device gates have passed.
