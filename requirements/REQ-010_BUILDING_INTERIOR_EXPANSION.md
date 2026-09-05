# REQ-010 — 建物内部と町コンテンツの追加拡張

STATUS: VERIFY
PRIORITY: P2
TYPE: WORLD / INTERIOR / CONTENT / UX
OWNER_REQUEST: CONFIRMED

## PURPOSE
王都や周辺施設を「入口を押すだけの背景」ではなく、実際に歩いて見て回れる場所として増やす。

既に実装済みの室内を作り直さず、既存施設へ自然に接続する新しい歩行可能空間、小物、会話、生活感を安全なcheckpoint単位で追加する。

## FRESH BASELINE
fresh HEADには既に複数の室内/任意エリアが存在し、Pages browser smokeでも以下の入退室が検証されている。

- 宿屋系 interior / guest room
- stock room
- temple record room
- roadside shrine
- forest clearing
- training yard

特に `addons/inn-guest-room.js` は `MAPS.innGuestRoom` を持ち、`innInterior` から入室し、再び `innInterior` へ戻る物理map transitionを実装済み。

REQ-010では、この既存成果を上書きせず拡張する。

## FIRST SAFE EXPANSION
最初の対象は南門宿の追加室内とする。

理由:
- 既存 `innInterior` → `innGuestRoom` の導線が確立済み。
- `innGuestRoom` 自体が10x8の独立mapで、安全に追加扉を設けやすい。
- 王都の生活感を増やしながら、物語canon変更を必要としない。

最初に `innGuestRoom` から入れる「屋根裏談話室 / 読書部屋」に相当する小室を追加してよい。
名称はゲーム内の自然さを優先して確定する。

## INTERIOR QUALITY STANDARD
新規室内は最低限:

1. 独立した `MAPS.*` map
2. 壁と歩行床
3. 明確な出入口
4. 2種類以上の視覚的小物
5. 2つ以上の調べられるポイントまたはNPC
6. 入室時の短い文脈説明
7. 退出時に元の位置へ安全に戻る
8. presentation decorはpointerを奪わない
9. collisionとvisualの対応が破綻しない

## CONTENT TONE
町の生活感を増やす。

候補:
- 本棚
- 旅人の置き手紙
- 古い地図
- 暖炉
- ランプ
- 荷物
- テーブル
- 椅子
- 窓
- 掲示板
- 宿帳

ただし、重要なストーリー秘密を新規室内で勝手に確定・暴露しない。
小さな世界観、旅人の気配、ルークの自然なコメントを中心とする。

## IMPLEMENTATION POLICY
- fresh HEADの既存map名、入口、collisionを正本とする。
- 既存室内を壊して新室内を作らない。
- entry/exit時は `stopMoving()` を維持する。
- map transition後に移動timerを残さない。
- Dynamic Touch Controllerの状態をtransition跨ぎで残さない。
- add-on方式なら既存関数wrap chainを尊重する。
- `tileClass`, `tileEmoji`, `npcClass`, `action`, `checkGate`, `world`, `render` の既存wrapを必ずbase-callで繋ぐ。
- save dataに未知mapが残っても既存fallbackを壊さない。

## CHECKPOINT PLAN
Checkpoint A: 南門宿の追加歩行室内を1つ実装
Checkpoint B: 室内小物・調べるポイント・視覚密度を仕上げる
Checkpoint C: browser smokeへ新室内のentry/exit/runtime assertionを追加
Checkpoint D: Pages回帰、requirement/queue/CURRENT同期

## IMPLEMENTED CHECKPOINTS

### Checkpoint A — COMPLETE
Files:
- `addons/inn-attic-lounge.js`
- `addons/zz-inn-attic-entry-guard.js`

新規の独立歩行MAP `MAPS.innAtticLounge`（表示名: `南門宿・屋根裏談話室`）を実装した。
既存 `innGuestRoom` の東側から扉を調べて入室し、屋根裏南側の出口から `innGuestRoom` へ戻る。
entry/exit双方で既存 `stopMoving()` 安全契約を維持する。

### Checkpoint B — COMPLETE
屋根裏談話室に以下を統合した。

- 木床 / 壁 / 出口の専用visual
- 大きな青系ラグ
- 本棚
- 窓
- 暖炉
- 中央テーブル
- 4つの調査ポイント
  - 旅人の本棚
  - 古い街道地図
  - 旅人の置き手紙
  - 暖炉脇の椅子
- ルークの軽いコメントと旅人の生活感

重大なstory canonは追加していない。

### Checkpoint C — COMPLETE
`.github/workflows/pages.yml` のassembled-game browser smokeへ、新屋根裏の実entry/exit assertionを追加した。

追加検証:
- `lqAtticRuntimeSmokeMarker`
- `data-attic-entered="true"`
- `data-attic-exited="true"`
- `data-attic-room="true"`

最初の実動試験で入口だけfalseを検出した。原因はadd-onのalphabetical load orderで、`inn-attic-lounge.js` が `inn-guest-room.js` より先に実行され、客室MAP生成前に扉登録を試みていたことだった。

これを `zz-inn-attic-entry-guard.js` で、guest-room生成後に扉登録と最終action guardを行う構造へ修正した。

### Checkpoint D — AUTOMATED PASS / OWNER VISUAL VERIFY REMAINS
Implementation hardening commit:
`180d71a1b5f8e8c4f5a656838ec8abfb93d16e36`

GitHub Pages workflow run:
`33981620155`

結果: `SUCCESS`

以下を全て通過した。
- sequential patch syntax validation
- 68 collision-safe add-on syntax validation
- static regression guard
- add-on contract guard
- PWA / approved Luke raster transport validation
- assembled game browser smoke
- existing six optional/interior transitions
- 新規 attic entry/exit/runtime assertion
- battle smoke
- save smoke
- site upload
- GitHub Pages deploy

Owner physical iPhone / subjective room appearance confirmationは未実施なので、`DONE`ではなく`VERIFY`とする。

## REGRESSION REQUIREMENTS
TEST 1: 既存の `innInterior` → `innGuestRoom` が維持される。
TEST 2: `innGuestRoom` → `innInterior` 退出が維持される。
TEST 3: 新室内へ入れる。
TEST 4: 新室内から元のroomへ戻れる。
TEST 5: 新室内のcollisionを抜けない。
TEST 6: 調べるポイントがfront/actionで発火する。
TEST 7: dialogue後に移動暴走しない。
TEST 8: touch controllerが室内装飾に奪われない。
TEST 9: existing building smokeがすべて維持される。
TEST 10: Pages deployまでPASS。

## COMPLETION CONDITION
- 既存施設へ接続する新しい歩行可能室内が最低1つ追加される。
- 室内に複数小物・調査ポイントがある。
- entry/exitが物理map transitionとして動く。
- existing room transitionsを壊していない。
- browser smokeが新室内を実際に入退室して検証する。
- static/addon/browser/Pages PASS。
- iPhoneでの主観的操作・見た目確認はVERIFYへ残してよい。

## DO NOT REPEAT
- 既存guest roomを名前だけ変えて複製しない。
- カードUIだけで「室内追加」と呼ばない。
- 未使用mapを定義しただけで完了扱いしない。
- 出口のない室内を作らない。
- story canonの重大秘密を勝手に追加しない。
- transition時のstopMoving安全性を崩さない。
