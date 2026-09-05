# LUKE QUEST Character Asset Contract

This contract defines repository-safe integration slots for approved high-fidelity character art.

## Principles

- Generated or supplied art is not considered integrated until the public Pages build actually references it.
- Main-character dialogue art should be full-body or body-dominant, not face-only.
- Field sprites require four visible directions: down/front, up/back, left, right.
- Interim CSS/SVG art must never be promoted to formal canon merely because it is technically easy to store.
- The current canonical Luke visual direction is blue hair, blue-family cloak/clothing, silver armor, gold accents, original heroic fantasy knight styling.

## Repository-safe transport

Because the active GitHub text connector writes UTF-8 text reliably, approved raster assets may be stored as base64 text and decoded in the browser at runtime.

Preferred source format for production art: WebP when quality/size is acceptable, otherwise PNG.

### Naming

Approved Luke dialogue art:

- `assets/characters/luke/dialogue-neutral.webp.b64`

Approved Luke directional field art:

- `assets/characters/luke/field-down.webp.b64`
- `assets/characters/luke/field-up.webp.b64`
- `assets/characters/luke/field-left.webp.b64`
- `assets/characters/luke/field-right.webp.b64`

Future expression variants may follow:

- `dialogue-smile.webp.b64`
- `dialogue-worried.webp.b64`
- `dialogue-determined.webp.b64`

Leon and Glenn use the same directory/slot pattern under their own lowercase character keys.

## Runtime contract

`ux-v12.js` owns the browser-side base64 transport layer.

Expected runtime registry shape:

```js
window.LQ_CHARACTER_ASSETS = {
  luke: {
    dialogue: {
      neutral: { path: 'assets/characters/luke/dialogue-neutral.webp.b64', mime: 'image/webp', formal: true }
    },
    field: {
      down:  { path: 'assets/characters/luke/field-down.webp.b64',  mime: 'image/webp', formal: true },
      up:    { path: 'assets/characters/luke/field-up.webp.b64',    mime: 'image/webp', formal: true },
      left:  { path: 'assets/characters/luke/field-left.webp.b64',  mime: 'image/webp', formal: true },
      right: { path: 'assets/characters/luke/field-right.webp.b64', mime: 'image/webp', formal: true }
    }
  }
};
```

Only entries marked `formal: true` may replace interim art.

## Production image requirements

Dialogue art:

- Full-body or body-dominant composition.
- Transparent or clean separable background preferred.
- Portrait should remain readable in a narrow iPhone dialogue column.
- Target stored image width should normally remain within 640-1024 px after optimization unless a larger master is justified.

Field art:

- Four distinct views, not mirrored text labels or recolors.
- Consistent clothing, armor, proportions, hair and silhouette between directions.
- Transparent background strongly preferred.
- Designed to remain readable at small in-game size.
- Architecture must remain compatible with later 2-3 frame walk animation per direction.

## Integration completion gate

A formal character asset is integrated only when all are true:

1. The approved asset bytes are stored in the repository in a supported path/transport.
2. Runtime loading succeeds without broken image paths.
3. The game actually replaces the interim art with the approved asset.
4. GitHub Pages deployment succeeds.
5. The public build can load the asset on iPhone Safari.
6. `CURRENT.md` records the exact formal/informal status without overclaiming.

## Transport probe

`assets/characters/transport-test.png.b64` is a tiny non-final PNG payload used solely to prove the base64-text transport path. It is not character art and must never be shown as such.
