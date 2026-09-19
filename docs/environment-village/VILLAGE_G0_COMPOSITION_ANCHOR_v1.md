# VILLAGE G0 COMPOSITION ANCHOR v1

PARENT: #51
CHILD: #54
COMPONENT_ID: `VILLAGE-COMPOSITION-G0-A`
TARGET_AUTHORITY: `prototype/modern-3d:references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png`
TARGET_BLOB_SHA: `e6536371eddcc7fb5cf5803568216f008011a5f1`
TARGET_FULL_FRAME_ROI: `(0%, 0%, 100%, 100%)`
DEPTH_LAYER: `FULL_SCENE_COMPOSITION`
STATUS: `FROZEN_REFERENCE / 固定参照`

## Hard anchors / 固定アンカー

#54 の構図判定では、Owner target の同一フレームを継続使用する。比較対象を別画像・別オブジェクトへ黙って変更しない。

必須アンカー:
1. `VILLAGE-PLAYER-A` — player screen position / scale
2. `VILLAGE-PLAZA-A` — central plaza position / visible depth
3. `VILLAGE-HOUSE-LEFT-A` — left house mass
4. `VILLAGE-HOUSE-RIGHT-A` — right house mass
5. `VILLAGE-FOUNTAIN-A` — central fountain
6. `VILLAGE-CHURCH-A` — church / large-building silhouette at upper frame
7. `VILLAGE-STAIR-PATH-A` — stair/path axis

## Coordinate lock rule / 座標固定規則

各アンカーは target 上の同じ visible instance を authority とし、normalized screen-space `(x%, y%, w%, h%)` で測定する。座標未測定の値を推測で記入しない。実装側も同じ ID で測定し、target と actual の ROI 差分を比較する。

PASSには、camera angle / height / focal feel、player、plaza、left/right house mass、fountain、church silhouette、stair/path axis が target と約95%の構図一致を示す fresh exact-HEAD screenshot evidence が必要。

装飾・lighting・props で構図差を隠すことは禁止。#54 PASS前に #55 以降へ進まない。
