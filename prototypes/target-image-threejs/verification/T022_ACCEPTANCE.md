# T022 machine-checkable acceptance gate

Run from the repository root:

```sh
node --test prototypes/target-image-threejs/verification/silhouette-iou-v1.test.mjs
```

PASS requires all assertions to hold: PNG decoding is deterministic; foreground pixels use an explicit integer threshold; the tool rejects mismatched dimensions without resampling; intersection, union, and IoU equal known fixture values; equal empty masks return `BLOCKED_EMPTY_UNION`; invalid inputs are rejected; and repeated comparisons produce identical JSON values including input SHA-256 hashes.

To measure real aligned binary/grayscale mask PNGs:

```sh
node prototypes/target-image-threejs/verification/silhouette-iou-v1.mjs reference-mask.png actual-mask.png --pixel-threshold 128 --minimum-iou 0.85 --output result.json
```

Inputs must be non-interlaced 8-bit PNGs with grayscale, grayscale-alpha, RGB, indexed, RGBA, or RGB color type. RGB input is converted with the fixed integer luminance formula `(299R + 587G + 114B + 500) / 1000`; transparent pixels are background. Dimensions must match exactly. The result is `PASS` when IoU meets the supplied minimum, `FAIL` otherwise, and `BLOCKED_EMPTY_UNION` when neither mask has foreground pixels. IoU is computed as intersection pixel count divided by union pixel count.

This gate checks the measurement implementation. The 0.85 initial major-silhouette target remains a later G1 composition criterion; synthetic test masks do not establish visual similarity to the target image.
