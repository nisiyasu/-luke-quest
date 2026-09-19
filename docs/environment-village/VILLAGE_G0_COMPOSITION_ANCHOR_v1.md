# VILLAGE G0 COMPOSITION ANCHOR v1

PARENT: #51
CHILD: #54
COMPONENT_ID: `VILLAGE-COMPOSITION-G0-A`
TARGET_AUTHORITY: `prototype/modern-3d:references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png`
TARGET_BLOB_SHA: `e6536371eddcc7fb5cf5803568216f008011a5f1`
TARGET_NATIVE_SIZE: `896x1664`
TARGET_FULL_FRAME_ROI: `(0%, 0%, 100%, 100%)`
DEPTH_LAYER: `FULL_SCENE_COMPOSITION`
STATUS: `FROZEN_REFERENCE / 固定参照`

## Hard anchors / 固定アンカー

#54 の構図判定では、Owner target の同一フレームを継続使用する。比較対象を別画像・別オブジェクトへ黙って変更しない。

2026-09-20 の fresh artifact で Owner target raster を実際に開いて視覚測定し、以下の normalized screen-space ROI を固定した。座標原点は画像左上。値は G0 major-silhouette 比較用であり、後段の細部物体 ROI ではない。

1. `VILLAGE-PLAYER-A` — ROI `(47.7%, 58.3%, 6.5%, 7.2%)` — lower-central player — depth `FOREGROUND_PLAYER`
2. `VILLAGE-PLAZA-A` — ROI `(29.6%, 25.8%, 51.9%, 49.3%)` — central road/plaza visible-depth envelope — depth `MIDGROUND_AXIS`
3. `VILLAGE-HOUSE-LEFT-A` — ROI `(0.0%, 2.6%, 28.7%, 36.2%)` — left framing house mass — depth `MIDGROUND_LEFT`
4. `VILLAGE-HOUSE-RIGHT-A` — ROI `(71.4%, 10.9%, 28.6%, 30.0%)` — right framing house mass — depth `MIDGROUND_RIGHT`
5. `VILLAGE-FOUNTAIN-A` — ROI `(65.8%, 38.5%, 28.1%, 13.5%)` — right-of-center fountain silhouette — depth `MIDGROUND_HERO`
6. `VILLAGE-CHURCH-A` — ROI `(43.6%, 0.0%, 27.6%, 14.7%)` — upper church/large-building silhouette, partially overlapped by HUD — depth `BACKGROUND_HERO`
7. `VILLAGE-STAIR-PATH-A` — ROI `(42.4%, 11.9%, 24.8%, 25.2%)` — upper stair/path axis from church toward plaza — depth `BACKGROUND_AXIS`

## Nearby hard anchors / 近接固定目印

- PLAYER: central road axis; below fountain; above lower stair foreground.
- PLAZA: between left market/house edge and fountain/right house edge; continuous toward upper stairs.
- HOUSE LEFT: left image boundary; roof and facade frame the plaza.
- HOUSE RIGHT: right image boundary; arched door/flower facade frame fountain.
- FOUNTAIN: right of road centerline, below right-house door level.
- CHURCH: centered near upper vanishing axis behind the stair run.
- STAIR/PATH: centered upper axis connecting church and plaza.

## Coordinate lock rule / 座標固定規則

各アンカーは target 上の同じ visible instance を authority とする。以後、同じ ID の参照物を黙って変更しない。実装側も同じ ID で測定し、target と actual の ROI 差分を比較する。変更が必要なら anchor revision を明示記録する。

PASSには、camera angle / height / focal feel、player、plaza、left/right house mass、fountain、church silhouette、stair/path axis が target と約95%の構図一致を示す fresh exact-HEAD screenshot evidence が必要。

装飾・lighting・props で構図差を隠すことは禁止。#54 PASS前に #55 以降へ進まない。
