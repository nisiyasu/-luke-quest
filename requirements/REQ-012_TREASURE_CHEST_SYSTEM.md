# REQ-012 — Persistent Treasure Chest System

- ID: REQ-012
- PRIORITY: P1
- STATUS: IN_PROGRESS
- TITLE: 探索できる永続宝箱システム
- OWNER INTENT: LUKE QUESTを最後まで遊べるJRPGへ近づける。DIRECTIVEの完成像に含まれる「宝箱」を、既存ゲームを壊さず実プレイへ導入する。

## PURPOSE
フィールド探索に「見つける → 前を向く → 調べる → 報酬を得る → 開封済み外観になる」というJRPGらしい小さな報酬ループを追加する。

## SCOPE
1. 少なくとも3個の宝箱を、既存の安全なマップへ配置する。
2. 宝箱はworld上に視覚表示され、未開封/開封済みが区別できる。
3. プレイヤーが宝箱の隣で宝箱方向を向いてA/actionすると開けられる。
4. 開封時に報酬を1回だけ付与し、dialogueで内容を伝える。
5. 開封状態は既存save()が保存するstate/flagsへ記録し、再描画や再訪で復活しない。
6. 同じ宝箱を何度調べても報酬を重複取得できない。
7. 既存NPC interaction、building entry、battle、Dynamic Touch Controller、save/loadを壊さない。
8. protected story canonを新規開示しない。
9. 外部ゲーム素材をコピーせず、LUKE QUEST独自の軽量表示を使う。

## INITIAL CHESTS
- 王都アルディア: 路地の補給箱 / 12G
- 王都近郊: 古い旅人箱 / 18G
- 魔物の森・入口: 苔むした探索箱 / 25G

座標はfresh MAPSと既存NPC/entryを確認し、安全なwalkable tile上または隣接interaction可能位置を選ぶこと。既存進行ゲートを塞がない。

## IMPLEMENTATION APPROACH
- collision-safe add-onを優先し、core map dataの破壊的書換えを避ける。
- `front()`、`action` wrapper、`world/render` wrapper、`save()`、`s.flags`等の既存host contractを利用してよい。
- 宝箱visualはworld内absolute layerとして描画し、pointer inputを奪わない。
- 状態は例: `s.flags.lqChestTownSupply` のような固有flagで保持する。

## COMPLETION CONDITIONS
- [ ] 3 chest definitions are present and map-specific.
- [ ] unopened chest is visibly rendered in world.
- [ ] opened chest visibly changes state.
- [ ] action while facing adjacent chest opens it.
- [ ] reward is granted exactly once.
- [ ] opened state persists through save()/rerender/revisit.
- [ ] unknown maps / maps without chests remain unaffected.
- [ ] runtime status marker exists for automated inspection.
- [ ] add-on contract guard covers registry count, unique flags, one-time reward guard, render hook and action hook.
- [ ] Node syntax checks pass.
- [ ] static/add-on regression passes.
- [ ] assembled browser smoke / existing touch smoke remain PASS in Pages workflow.
- [ ] published Pages deployment succeeds.
- [ ] Owner physical iPhone subjective/visual verification is not falsely claimed; if needed, final state is VERIFY.

## DO NOT
- Do not put required story progression inside a chest.
- Do not reveal protected Leon/Glenn/Elisia/Eleanor secrets.
- Do not award the same chest repeatedly.
- Do not make chest DOM intercept touch movement.
- Do not overwrite existing NPC/action behavior when no chest is directly in front.
- Do not call Owner physical iPhone verification PASS without Owner confirmation.
