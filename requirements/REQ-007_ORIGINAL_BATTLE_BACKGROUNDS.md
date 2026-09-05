# REQ-007 — Original Regional Battle Backgrounds

STATUS: VERIFY
PRIORITY: P1
TYPE: VISUAL / BATTLE / ORIGINAL_ASSET
OWNER_REQUEST: PRESERVED

## PURPOSE
Replace generic/CSS-only battle scenery as final presentation with original LUKE QUEST regional battle background artwork that makes encounters visibly belong to the current journey location.

## SCOPE
Provide original battle backdrop art for the six normal encounter regions:
- `field` — 王都近郊
- `forest` — 魔物の森・入口
- `deepForest` — 魔物の森・深部
- `mistTrail` — 霧の追跡路
- `observation` — 魔王軍・監視区域
- `evacRoute` — 北の退避路

Optional/interior/boss-specific scenes must remain safe. Unknown maps must retain their existing fallback rather than crashing.

## VISUAL TARGET
- LUKE QUEST original artwork only.
- Early-PS1-era 2D JRPG battle-scene composition.
- Strong foreground/midground/background separation.
- Enemy silhouette remains readable on iPhone.
- Each region must be immediately distinguishable without reading the map name.
- Avoid flat single-gradient backgrounds as final quality.
- Use illustrated environmental silhouettes, terrain planes, atmospheric depth, landmarks and light direction.

## REGIONAL ART DIRECTION
### field
Blue sky, distant Aldia stone silhouette, grassy roadside, low hills, warm daylight.

### forest
Dense trunks, green canopy, fern/grass foreground, filtered warm-green light.

### deepForest
Taller darker trunks, layered shadow, blue-green fog pockets, older roots and denser depth.

### mistTrail
Cool desaturated woodland/ravine, heavy white-blue mist bands, fragmented visibility, eerie depth.

### observation
Black-iron military observation zone: dark palisade/towers, ash-gray ground, red-violet warning accents, disciplined geometry.

### evacRoute
Rocky northern cliff road, pale sky, stone walls/outcrops, wind-exposed sparse vegetation, high-altitude depth.

## IMPLEMENTATION ARCHITECTURE
Prefer a collision-safe add-on.

The background system must:
1. resolve backdrop from canonical `s.map`;
2. attach only during `s.screen === 'battle'`;
3. integrate with the current assembled enemy stage/card without replacing battle mechanics/UI;
4. render behind enemy art, foreground-depth effects and battle focus overlays;
5. avoid duplicate nodes on repeated `battle()`/`render()` calls;
6. leave unknown maps on the existing fallback;
7. expose `window.LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS` with registered maps/count.

Inline SVG is acceptable as original image artwork when binary image transport is unnecessary. CSS may position/scale the image but must not be the sole final artwork.

## SAFETY
- Do not change battle stats, encounter rates or rewards.
- Do not obscure command buttons, HP bars, names or logs.
- Do not reduce enemy-art readability.
- Preserve `battle-foreground-depth.js`, `battle-focus-frame.js`, wound effects and optional boss art.
- Unknown/custom battle maps must not crash.
- No copyrighted third-party art.

## CHECKPOINTS
A. Implement six original regional backdrop images/illustrations.
B. Integrate behind current battle enemy stage without duplicate DOM.
C. Add contract regression for six maps, status marker, unknown-map fallback and original-image layer.
D. Pass static/add-on/browser/Pages workflow.

## IMPLEMENTATION EVIDENCE
- `addons/original-battle-backgrounds.js` registers six distinct regional inline-SVG image scenes: `field`, `forest`, `deepForest`, `mistTrail`, `observation`, `evacRoute`.
- The artwork layer is inserted once as `.lqOriginalBattleBackdrop`, reused on repeated renders, and marked `original-vector-regional-battle-background`.
- Artwork is attached only during battle and only for a registered canonical map; unknown maps return to the existing fallback unchanged.
- The layer is positioned behind enemy/focus/foreground presentation and does not modify battle mechanics, encounter rates, rewards or commands.
- `tools/lq-addon-contract.mjs` now verifies all six scene registrations, runtime status marker, SVG-image layer, formal-stage marker, unknown-map fallback and duplicate-layer reuse guard.
- Implementation checkpoint commit: `9f9c93fa69a71b2626b871e5650598cc1b0d1eb1`.
- Contract checkpoint commit: `376c6e051baf46900d954325f11968a34da48fb4`.
- GitHub Pages workflow run `33982352056` completed SUCCESS. Add-on syntax, static regression, add-on contracts, assembled browser smoke, floating touch regression, upload and Pages deployment all succeeded.

## COMPLETION CONDITION
Move to VERIFY when:
- all six listed encounter maps have registered distinct original background images/illustrations;
- battle rendering visibly uses the regional art layer;
- unknown map fallback remains safe;
- existing enemy art and battle overlays remain functional;
- automated guards pass;
- GitHub Pages deploy succeeds;
- fresh HEAD confirms integration.

Owner subjective/iPhone visual approval remains pending in VERIFY and does not block independent work.

## DO NOT REPEAT
- Do not call a plain CSS gradient a finished battle background.
- Do not use third-party copyrighted game backgrounds.
- Do not replace battle logic for a visual change.
- Do not let repeated renders stack duplicate backgrounds.
